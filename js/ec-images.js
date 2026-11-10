/**
 * Central image map for Enamel Craft site sections.
 * Edit these lists to add/remove photos — paths are relative to site root.
 *
 * Folders:
 *   img/hero-img/   — homepage hero carousel only
 *   img/gallery/    — “Inside the studio” marquee + lightbox
 *   img/our-work/   — case study photos (filename referenced in our-work.html)
 *   img/services/   — service thumbnails
 *   img/dr-girija/  — doctor portraits
 *   img/blogs/      — blog card images
 *   img/reviews/    — Google review avatars
 *   img/logo-img/   — logos & favicon
 */
(function (global) {
  "use strict";

  var GALLERY_DIR = "img/gallery/";

  /** @type {{ src: string, alt: string }[]} */
  var gallery = [
    { src: GALLERY_DIR + "3.jpg", alt: "Enamel Craft Dental Studio, Baner — 3" },
    { src: GALLERY_DIR + "4.jpg", alt: "Enamel Craft Dental Studio, Baner — 4" },
    { src: GALLERY_DIR + "5.jpg", alt: "Enamel Craft Dental Studio, Baner — 5" },
    { src: GALLERY_DIR + "carousel-1.jpg", alt: "Enamel Craft Dental Studio, Baner — carousel 1" },
    { src: GALLERY_DIR + "carousel-2.jpg", alt: "Enamel Craft Dental Studio, Baner — carousel 2" },
    { src: GALLERY_DIR + "consultation1.jpg", alt: "Enamel Craft Dental Studio, Baner — consultation1" },
    { src: GALLERY_DIR + "consultation3.jpg", alt: "Enamel Craft Dental Studio, Baner — consultation3" },
    { src: GALLERY_DIR + "ecGallary02.jpg", alt: "Enamel Craft Dental Studio — clinic photo 02" },
    { src: GALLERY_DIR + "ecGallary03.jpg", alt: "Enamel Craft Dental Studio — clinic photo 03" },
    { src: GALLERY_DIR + "ecGallary04.jpg", alt: "Enamel Craft Dental Studio — clinic photo 04" },
    { src: GALLERY_DIR + "ecGallary05.jpg", alt: "Enamel Craft Dental Studio — clinic photo 05" },
    { src: GALLERY_DIR + "ecGallary06.jpg", alt: "Enamel Craft Dental Studio — clinic photo 06" },
    { src: GALLERY_DIR + "ecGallary07.jpg", alt: "Enamel Craft Dental Studio — clinic photo 07" },
    { src: GALLERY_DIR + "ecGallary08.jpg", alt: "Enamel Craft Dental Studio — clinic photo 08" },
    { src: GALLERY_DIR + "ecGallary09.jpg", alt: "Enamel Craft Dental Studio — clinic photo 09" },
    { src: GALLERY_DIR + "ecGallary12.jpg", alt: "Enamel Craft Dental Studio — clinic photo 12" },
    { src: GALLERY_DIR + "netflixDental.jpg", alt: "Enamel Craft Dental Studio, Baner — netflixDental" },
  ];

  global.EC_IMAGES = {
    logo: "img/logo-img/enamel-craft-dental-studio-logo.png",
    favicon: "img/logo-img/logo.png",
    googleLogo: "img/services/google-logo.svg",
    /** Homepage LCP — first slide is in index.html; initHeroSlides appends the rest */
    heroStatic: {
      src: "img/hero-img/banners/netflixDental.jpg",
      alt: "Enamel Craft Dental Studio, Baner — clinic interior with ceiling-mounted display",
    },
  /** Netflix slide stays first (LCP); Dr Girija hero shots rotate after */
    hero: [
      {
        src: "img/hero-img/banners/netflixDental.jpg",
        srcset:
          "img/hero-img/banners/netflixDental-960.jpg 960w, img/hero-img/banners/netflixDental.jpg 1920w",
        alt: "Enamel Craft Dental Studio, Baner — clinic interior with ceiling-mounted display",
      },
      {
        src: "img/hero-img/banners/dr-g1.jpg",
        srcset:
          "img/hero-img/banners/dr-g1-960.jpg 960w, img/hero-img/banners/dr-g1.jpg 1920w",
        alt: "Dr. Girija Nandanwar Dhakite, dental surgeon at Enamel Craft Dental Studio, Baner",
      },
      {
        src: "img/hero-img/banners/consultation1.jpg",
        srcset:
          "img/hero-img/banners/consultation1-960.jpg 960w, img/hero-img/banners/consultation1.jpg 1920w",
        alt: "Dr. Girija consulting a patient at Enamel Craft Dental Studio, Baner",
      },
      {
        src: "img/hero-img/banners/studio-3.jpg",
        srcset:
          "img/hero-img/banners/studio-3-960.jpg 960w, img/hero-img/banners/studio-3.jpg 1920w",
        alt: "Dr. Girija Nandanwar Dhakite at Enamel Craft Dental Studio, Baner",
      },
      {
        src: "img/hero-img/banners/studio-3-2.jpg",
        srcset:
          "img/hero-img/banners/studio-3-2-960.jpg 960w, img/hero-img/banners/studio-3-2.jpg 1920w",
        alt: "Dr. Girija Nandanwar Dhakite — cosmetic and restorative dentistry in Baner",
      },
    ],
    gallery: gallery,
    /** Case image files in img/our-work/ — keep in sync with our-work.html article ids */
    ourWorkCases: [
      { id: "case-wisdom-operculum", file: "case-wisdom-operculectomy.jpeg" },
      { id: "case-rct-lower-molar", file: "case-rct-lower-molar.jpeg" },
      { id: "case-fluorosis-rehab", file: "case-fluorosis.jpeg" },
      { id: "case-composite-diastema", file: "case-diastema.jpeg" },
      { id: "case-fracture-crown-wedding", file: "case-fracture-crown.jpeg" },
    ],
    homeFeaturedCaseIds: [
      "case-composite-diastema",
      "case-fracture-crown-wedding",
      "case-fluorosis-rehab",
    ],
    servicesDir: "img/services/",
  };
})(typeof window !== "undefined" ? window : globalThis);
