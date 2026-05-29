import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const schema = JSON.parse(
  fs.readFileSync(path.join(root, "seo", "local-business.json"), "utf8")
);

const LOCAL_META = `    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">
    <meta name="geo.region" content="IN-MH">
    <meta name="geo.placename" content="Baner, Pune, Maharashtra">
    <meta name="geo.position" content="18.5600556;73.7825659">
    <meta name="ICBM" content="18.5600556, 73.7825659">
    <meta property="og:site_name" content="Enamel Craft Dental Studio">
    <meta property="og:locale" content="en_IN">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">`;

function dentistSchemaBlock(pageUrl) {
  const data = { ...schema, url: pageUrl || schema.url };
  if (pageUrl && pageUrl !== schema.url) {
    data.mainEntityOfPage = pageUrl;
  }
  return `    <script type="application/ld+json">\n${JSON.stringify(data, null, 4)}\n    </script>`;
}

const pageUrls = {
  "index.html": "https://www.enamelcraft.in/",
  "about.html": "https://www.enamelcraft.in/about.html",
  "service.html": "https://www.enamelcraft.in/service.html",
  "contact.html": "https://www.enamelcraft.in/contact.html",
  "faq.html": "https://www.enamelcraft.in/faq.html",
  "blogs.html": "https://www.enamelcraft.in/blogs.html",
  "offer.html": "https://www.enamelcraft.in/offer.html",
  "yashwin.html": "https://www.enamelcraft.in/yashwin.html",
  "voice-search.html": "https://www.enamelcraft.in/voice-search.html",
  "dentist-in-baner.html": "https://www.enamelcraft.in/dentist-in-baner.html",
  "our-work.html": "https://www.enamelcraft.in/our-work.html",
};

const publicPages = Object.keys(pageUrls);

function removeBodyDuplicateSchemas(html) {
  return html
    .replace(
      /<!-- Schema Markup for Local SEO -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g,
      ""
    )
    .replace(
      /<!-- Schema Markup for SEO -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g,
      ""
    )
    .replace(
      /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"DentalClinic"[\s\S]*?<\/script>\s*/g,
      ""
    )
    .replace(
      /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"Dentist","name":"Enamel Craft Dental Studio","url":"https:\/\/www\.enamelcraft\.in\/"[\s\S]*?"availableLanguage":\["English","Hindi","Marathi"\]\}\}\s*<\/script>\s*/g,
      ""
    );
}

function replaceHeadDentistSchema(html, pageUrl) {
  const block = dentistSchemaBlock(pageUrl);
  const replaced = html.replace(
    /<!-- Schema: Dentist[^>]*-->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<!-- Schema: Dentist (local business) -->\n${block}`
  );
  if (replaced !== html) return replaced;

  return html.replace(
    /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"Dentist"[\s\S]*?<\/script>/,
    block
  );
}

function injectLocalMeta(html) {
  if (html.includes('name="geo.region"')) return html;
  return html.replace(
    /<meta name="viewport"[^>]*>/,
    (m) => `${m}\n${LOCAL_META}`
  );
}

function addTwitterFromOg(html) {
  if (html.includes('name="twitter:title"')) return html;
  const title = html.match(/<meta property="og:title" content="([^"]*)"/);
  const desc = html.match(/<meta property="og:description"\s+content="([^"]*)"/);
  const image = html.match(
    /<meta property="og:image" content="([^"]*)"/
  );
  if (!title) return html;
  let tags = `    <meta name="twitter:title" content="${title[1]}">`;
  if (desc) tags += `\n    <meta name="twitter:description" content="${desc[1]}">`;
  if (image) tags += `\n    <meta name="twitter:image" content="${image[1]}">`;
  return html.replace(
    /<meta name="twitter:card" content="summary_large_image">/,
    `<meta name="twitter:card" content="summary_large_image">\n${tags}`
  );
}

for (const file of publicPages) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, "utf8");
  html = removeBodyDuplicateSchemas(html);
  html = injectLocalMeta(html);
  html = replaceHeadDentistSchema(html, pageUrls[file]);
  html = addTwitterFromOg(html);
  fs.writeFileSync(filePath, html);
  console.log("Updated", file);
}

// Index-specific: WebSite schema + remove extra body scripts
const indexPath = path.join(root, "index.html");
let indexHtml = fs.readFileSync(indexPath, "utf8");
const websiteSchema = `    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://www.enamelcraft.in/#website",
        "name": "Enamel Craft Dental Studio",
        "url": "https://www.enamelcraft.in/",
        "publisher": { "@id": "https://www.enamelcraft.in/#dentist" },
        "inLanguage": "en-IN"
    }
    </script>`;
indexHtml = indexHtml.replace(
  /<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"WebSite"[\s\S]*?<\/script>/,
  websiteSchema
);
indexHtml = removeBodyDuplicateSchemas(indexHtml);
fs.writeFileSync(indexPath, indexHtml);
console.log("Updated index.html WebSite schema");
