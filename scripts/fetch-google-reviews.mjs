/**
 * Fetches Google reviews and saves data/google-reviews.json for the static site.
 *
 * Usage:
 *   set GOOGLE_PLACES_API_KEY=your_key
 *   node scripts/fetch-google-reviews.mjs
 *
 * Enable "Places API (New)" in Google Cloud Console.
 * The API returns up to 5 reviews per request (Google limit).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "data", "google-reviews.json");
const PLACE_QUERY = "Enamel Craft Dental Studio, Baner, Pune, India";

function normalizeReview(review) {
  return {
    author: review.authorAttribution.displayName,
    rating: review.rating,
    text: review.text.text,
    relativeTime: review.relativePublishTimeDescription,
    profilePhoto: review.authorAttribution.photoUri || "",
    source: "google",
  };
}

async function fetchReviews(apiKey) {
  var res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.displayName,places.rating,places.userRatingCount,places.reviews,places.googleMapsUri",
    },
    body: JSON.stringify({
      textQuery: PLACE_QUERY,
      languageCode: "en",
    }),
  });

  var data = await res.json();
  if (!res.ok) {
    throw new Error((data.error && data.error.message) || "Places API request failed");
  }

  var place = data.places && data.places[0];
  if (!place) throw new Error("Place not found for query: " + PLACE_QUERY);

  return {
    fetchedAt: new Date().toISOString(),
    placeName: place.displayName.text,
    rating: place.rating,
    reviewCount: place.userRatingCount,
    googleMapsUri: place.googleMapsUri,
    reviews: (place.reviews || []).map(normalizeReview),
  };
}

async function main() {
  var apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("Set GOOGLE_PLACES_API_KEY to fetch reviews.");
    process.exit(1);
  }

  console.log("Fetching reviews from Google Places API…");
  var payload = await fetchReviews(apiKey);

  if (!payload.reviews.length) {
    console.error("No reviews returned.");
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log("Saved " + payload.reviews.length + " reviews → data/google-reviews.json");
  console.log("Rating: " + payload.rating + " · Count: " + payload.reviewCount);
}

main().catch(function (err) {
  console.error(err.message || err);
  process.exit(1);
});
