import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pages = JSON.parse(
  fs.readFileSync(path.join(root, "seo", "service-pages.json"), "utf8")
);

function faqSchema(faqs) {
  if (!faqs.length) return "";
  const mainEntity = faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));
  return `    <script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity }, null, 4)}
    </script>`;
}

function faqHtml(faqs) {
  if (!faqs.length) return "";
  const items = faqs
    .map(
      (f) => `                <details class="ec-faq-item">
                    <summary>${f.q}</summary>
                    <p>${f.a}</p>
                </details>`
    )
    .join("\n");
  return `            <h2 class="ec-section__h-sub mt-5">Common questions</h2>
            <div class="ec-faq-stack">
${items}
            </div>`;
}

for (const p of pages) {
  const file = `${p.slug}.html`;
  const canonical = `https://www.enamelcraft.in/${file}`;
  const navId = `ecNav${p.slug.replace(/-/g, "").slice(0, 12)}`;
  const paragraphs = p.paragraphs.map((t) => `<p>${t}</p>`).join("\n                ");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-K6S2BTW4');</script>
    <meta charset="utf-8">
    <title>${p.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="${p.description}">
    <meta property="og:title" content="${p.title}">
    <meta property="og:description" content="${p.description}">
    <meta property="og:image" content="https://www.enamelcraft.in/${p.image}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="${canonical}">
    <!-- Schema: Dentist (local business) -->
    <script type="application/ld+json">{}</script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        "name": "${p.procedure}",
        "description": ${JSON.stringify(p.description)},
        "url": "${canonical}",
        "image": "https://www.enamelcraft.in/${p.image}",
        "performer": { "@id": "https://www.enamelcraft.in/#dentist" },
        "location": {
            "@type": "Dentist",
            "name": "Enamel Craft Dental Studio",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Baner",
                "addressRegion": "Maharashtra",
                "postalCode": "411045",
                "addressCountry": "IN"
            }
        }
    }
    </script>
${faqSchema(p.faqs)}
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.enamelcraft.in/" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.enamelcraft.in/service.html" },
            { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(p.h1)}, "item": "${canonical}" }
        ]
    }
    </script>
    <link href="img/logo-img/logo.png" rel="icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,400&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
    <link href="css/site.css" rel="stylesheet">
</head>
<body class="ec-body">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K6S2BTW4" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<header class="ec-header">
    <nav class="ec-nav__inner" aria-label="Main">
        <a class="ec-brand" href="index.html" aria-label="Enamel Craft Dental Studio">
            <img src="img/logo-img/enamel-craft-dental-studio-logo.png" width="200" height="50" alt="Enamel Craft Dental Studio">
        </a>
        <button type="button" class="ec-nav__toggle d-lg-none" data-ec-nav-toggle aria-expanded="false" aria-controls="${navId}" aria-label="Open menu">
            <i class="bi bi-list" aria-hidden="true"></i>
        </button>
        <div class="ec-nav__collapse" id="${navId}" data-ec-nav-collapse>
            <div class="ec-nav__links">
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="service.html" class="is-active" aria-current="page">Services</a>
                <a href="our-work.html">Our Work</a>
                <a href="contact.html">Contact</a>
                <a href="blogs.html">Blogs</a>
            </div>
            <div class="ec-nav__actions">
                <a class="ec-nav__phone ec-num d-none d-xl-inline-flex" href="tel:+91-7666297468">+91-7666297468</a>
                <a class="ec-btn ec-btn--outline ec-nav__cta-secondary" href="online-consultation.html" title="Video consult · ₹299">Online consult</a>
                <a class="ec-btn ec-btn--primary ec-nav__cta" href="https://wa.me/917666297468?text=Hello,%20Can%20I%20book%20an%20appointment%3F" target="_blank" rel="noopener noreferrer">Book visit</a>
            </div>
        </div>
    </nav>
</header>

<div class="ec-page-hero">
    <div class="ec-page-hero__inner">
        <nav class="ec-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> · <a href="service.html">Services</a> · ${p.h1}</nav>
        <h1>${p.h1}</h1>
        <p class="ec-lead mb-0">Enamel Craft Dental Studio · Pancard Club Road, Baner, Pune</p>
    </div>
</div>

<main class="ec-page-main">
<section class="ec-section" style="padding-top:0" data-ec-reveal>
    <div class="ec-section__inner">
        <div class="row g-4 align-items-start">
            <div class="col-lg-7 ec-prose">
                <p class="ec-eyebrow">Baner</p>
                ${paragraphs}
                <p class="mb-0"><a class="ec-btn ec-btn--primary" href="https://wa.me/917666297468?text=Hello,%20Can%20I%20book%20an%20appointment%3F" target="_blank" rel="noopener noreferrer">Book on WhatsApp</a>
                    <a class="ec-btn ec-btn--outline ms-2" href="contact.html">Visit the clinic</a></p>
                <p class="mt-3 mb-0"><a class="ec-link" href="${p.blogUrl}" target="_blank" rel="noopener noreferrer">Longer clinical guide on our blog →</a></p>
${faqHtml(p.faqs)}
            </div>
            <div class="col-lg-5">
                <figure class="ec-media-frame">
                    <img src="${p.image}" alt="${p.imageAlt}" width="800" height="600" loading="lazy" decoding="async">
                </figure>
                <p class="small text-muted mt-2">Also listed on our <a class="ec-link" href="service.html#${p.anchorId}">services overview</a>.</p>
            </div>
        </div>
    </div>
</section>
</main>

<footer class="ec-footer">
    <div class="ec-footer__inner">
        <div>
            <h3>Practice</h3>
            <a href="index.html">Home</a>
            <a href="dentist-in-baner.html">Dentist in Baner</a>
            <a href="https://maps.app.goo.gl/xwzzvwhkLiujg52z9" target="_blank" rel="noopener noreferrer">Locate us</a>
            <a href="online-consultation.html">Online consultation</a>
            <a href="https://wa.me/917666297468?text=Hello,%20Can%20I%20book%20an%20appointment%3F" target="_blank" rel="noopener noreferrer">Book appointment</a>
            <a href="tel:+91-7666297468">Call us</a>
        </div>
        <div>
            <h3>Explore</h3>
            <a href="about.html">About</a>
            <a href="service.html">Services</a>
            <a href="our-work.html">Our Work</a>
            <a href="contact.html">Contact</a>
            <a href="faq.html">FAQ</a>
            <a href="blogs.html">Blogs</a>
        </div>
        <div>
            <h3>Services</h3>
            <a href="root-canal-baner.html">Root canal</a>
            <a href="dental-implants-baner.html">Implants</a>
            <a href="teeth-whitening-baner.html">Whitening</a>
            <a href="dental-scaling-baner.html">Cleanings</a>
        </div>
        <div itemscope itemtype="https://schema.org/Dentist">
            <h3>Studio</h3>
            <p class="mb-2 small" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                <span itemprop="streetAddress">Shop No. 3, Shreeban building, Sneh Park Society, Pancard Club Rd, Baner Gaon, Baner, Pune, Maharashtra 411045</span>
            </p>
            <a href="mailto:enamelcraft.dental@gmail.com" itemprop="email">enamelcraft.dental@gmail.com</a>
            <a href="tel:+91-7666297468" itemprop="telephone">+91-7666297468</a>
        </div>
    </div>
    <div class="ec-footer__bottom">
        <span>© <a href="https://www.enamelcraft.in">Enamel Craft Dental Studio</a>. All rights reserved.</span>
    </div>
</footer>

<div class="ec-mobile-cta" aria-label="Quick contact">
    <a href="tel:+91-7666297468" class="ec-mobile-cta__call"><i class="bi bi-telephone" aria-hidden="true"></i> Call</a>
    <a href="https://wa.me/917666297468?text=Hello,%20Can%20I%20book%20an%20appointment%3F" class="ec-mobile-cta__wa" target="_blank" rel="noopener noreferrer"><i class="bi bi-whatsapp" aria-hidden="true"></i> Book visit</a>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
<script src="js/ec-images.js" defer></script>
<script src="js/site.js" defer></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(root, file), html);
  console.log("Wrote", file);
}
