import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const schema = JSON.parse(
  fs.readFileSync(path.join(root, "seo", "local-business.json"), "utf8")
);

const INDEX_REVIEWS = [
  {
    author: "Nikhil Kamlapure",
    body: "Thank you, Dr. Girija and team, for the exceptional care and outstanding treatment. I highly recommend this best-rated dental clinic in Baner Pune for quality dental care.",
  },
  {
    author: "Swaswati Goswami",
    body: "I visited the clinic for a toothache, and I must say, Dr. Girija's knowledge and ability to comfort patients is commendable. She got to the root cause pretty quickly. I would recommend Enamel Craft Dental Studio for painless root canal treatment in Baner.",
  },
  {
    author: "Rajendra Bande",
    body: "Highly recommend Enamel Craft for quality dental care. If you're looking for an affordable dentist in Baner, this is the place!",
  },
  {
    author: "Bhushan Lakhe",
    body: "The staff is friendly and efficient, and the overall atmosphere is so relaxing. The best dental clinic in Baner for a stress-free experience.",
  },
  {
    author: "Abhijit Gunjewar",
    body: "Enamel Craft Dental Studio is the best in Baner! Dr. Girija's thorough and gentle care made my experience comfortable. Highly recommended if you're searching for the best dentist in Pan Card Club Road Baner.",
  },
  {
    author: "Rupesh Bende",
    body: "Excellent experience at Enamel Craft Dental Studio — warm staff, spotless clinic, and Dr. Girija's thorough, painless care made me feel at ease. Highly recommend if you're looking for a nearby dental clinic in Baner.",
  },
];

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
};

function buildDentistSchema(pageUrl, file) {
  const data = JSON.parse(JSON.stringify(schema));
  data.url = pageUrl || schema.url;
  if (pageUrl && pageUrl !== schema.url) {
    data.mainEntityOfPage = pageUrl;
  }

  if (file === "index.html") {
    data.review = INDEX_REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      reviewBody: r.body,
    }));
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      reviewCount: INDEX_REVIEWS.length,
    };
  }

  return data;
}

function dentistSchemaBlock(pageUrl, file) {
  const data = buildDentistSchema(pageUrl, file);
  return `    <script type="application/ld+json">\n${JSON.stringify(data, null, 4)}\n    </script>`;
}

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
      /<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"DentalClinic"[\s\S]*?<\/script>\s*/g,
      ""
    )
    .replace(
      /<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"Dentist"[\s\S]*?"contactPoint":\s*\{[\s\S]*?"availableLanguage":\s*"English, Hindi, Marathi"[\s\S]*?\}\s*\}\s*<\/script>\s*/g,
      ""
    );
}

function stripMicrodata(html) {
  return html
    .replace(/\s*itemscope(?:\s+itemtype="[^"]*")?/g, "")
    .replace(/\s*itemtype="https:\/\/schema\.org\/[^"]*"/g, "")
    .replace(/\s*itemprop="[^"]*"/g, "")
    .replace(/<meta itemprop="[^"]*"\s+content="[^"]*">\s*/g, "");
}

function hasHeadDentistSchema(html) {
  return /"@type":\s*"Dentist"[\s\S]*?"@id":\s*"https:\/\/www\.enamelcraft\.in\/#dentist"/.test(
    html.split("</head>")[0]
  );
}

function replaceHeadDentistSchema(html, pageUrl, file) {
  if (hasHeadDentistSchema(html)) return html;

  const block = dentistSchemaBlock(pageUrl, file);
  const patterns = [
    /<!-- Schema:[^>]*-->\s*<script type="application\/ld\+json">[\s\S]*?"@type":\s*"Dentist"[\s\S]*?<\/script>/,
    /<script type="application\/ld\+json">\s*\{[\s\S]*?"@type":\s*"Dentist"[\s\S]*?<\/script>/,
  ];

  for (const pattern of patterns) {
    const replaced = html.replace(
      pattern,
      `<!-- Schema: Dentist (local business) -->\n${block}`
    );
    if (replaced !== html) return replaced;
  }

  return html;
}

function ensureIndexSchemas(html, pageUrl, file) {
  if (!hasHeadDentistSchema(html)) {
    html = html.replace(
      /<!-- Schema: Dentist \(local business\) -->[\s\S]*?(?=<!-- Favicon -->)/,
      `<!-- Schema: Dentist (local business) -->\n${dentistSchemaBlock(pageUrl, file)}\n${websiteSchema}\n    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.enamelcraft.in/" }]
    }
    </script>

    `
    );
    return html;
  }

  if (!html.split("</head>")[0].includes('"@type": "WebSite"')) {
    html = html.replace(
      /(<!-- Schema: Dentist \(local business\) -->[\s\S]*?<\/script>)/,
      `$1\n${websiteSchema}`
    );
  }

  return html;
}

function injectLocalMeta(html) {
  if (html.includes('name="geo.region"')) return html;
  return html.replace(/<meta name="viewport"[^>]*>/, (m) => `${m}\n${LOCAL_META}`);
}

function addTwitterFromOg(html) {
  if (html.includes('name="twitter:title"')) return html;
  const title = html.match(/<meta property="og:title" content="([^"]*)"/);
  const desc = html.match(/<meta property="og:description"\s+content="([^"]*)"/);
  const image = html.match(/<meta property="og:image" content="([^"]*)"/);
  if (!title) return html;
  let tags = `    <meta name="twitter:title" content="${title[1]}">`;
  if (desc) tags += `\n    <meta name="twitter:description" content="${desc[1]}">`;
  if (image) tags += `\n    <meta name="twitter:image" content="${image[1]}">`;
  return html.replace(
    /<meta name="twitter:card" content="summary_large_image">/,
    `<meta name="twitter:card" content="summary_large_image">\n${tags}`
  );
}

for (const file of Object.keys(pageUrls)) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, "utf8");
  html = removeBodyDuplicateSchemas(html);
  html = stripMicrodata(html);
  html = injectLocalMeta(html);
  html = replaceHeadDentistSchema(html, pageUrls[file], file);
  if (file === "index.html") {
    html = ensureIndexSchemas(html, pageUrls[file], file);
  }
  html = addTwitterFromOg(html);

  fs.writeFileSync(filePath, html);
  console.log("Updated", file);
}
