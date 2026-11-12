/**
 * Central image map for Enamel Craft site sections.
 * Edit these lists to add/remove photos — paths are relative to site root.
 */
(function (global) {
  "use strict";

  var GALLERY_DIR = "img/gallery/";

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

  var desktopHero = [
    {
      src: "img/hero-img/desktop/netflixDental.jpg",
      alt: "Enamel Craft Dental Studio, Baner — clinic interior with ceiling-mounted display",
    },
    {
      src: "img/hero-img/desktop/consultation1.jpg",
      alt: "Dr. Girija consulting a patient at Enamel Craft Dental Studio, Baner",
    },
    {
      src: "img/hero-img/desktop/studio-3.jpg",
      alt: "Dr. Girija Nandanwar Dhakite at Enamel Craft Dental Studio, Baner",
    },
    {
      src: "img/hero-img/desktop/studio-3-2.jpg",
      alt: "Dr. Girija Nandanwar Dhakite — cosmetic and restorative dentistry in Baner",
    },
    {
      src: "img/hero-img/desktop/dr-girija-hero.png",
      alt: "Dr. Girija Nandanwar Dhakite — Lead Dentist at Enamel Craft Dental Studio, Baner",
    },
  ];

  var mobileHero = [
    {
      src: "img/hero-img/mobile/netflixDental-960.jpg",
      alt: "Enamel Craft Dental Studio, Baner — clinic interior with ceiling-mounted display",
    },
    {
      src: "img/hero-img/mobile/consultation1-960.jpg",
      alt: "Dr. Girija consulting a patient at Enamel Craft Dental Studio, Baner",
    },
    {
      src: "img/hero-img/mobile/studio-3-960.jpg",
      alt: "Dr. Girija Nandanwar Dhakite at Enamel Craft Dental Studio, Baner",
    },
    {
      src: "img/hero-img/mobile/dr-g1.jpg",
      alt: "Dr. Girija Nandanwar Dhakite — Lead Dentist at Enamel Craft Dental Studio, Baner",
    },
  ];

  var isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767.98px)").matches;
  var selectedHero = isMobile ? mobileHero : desktopHero;

  global.EC_IMAGES = {
    logo: "img/logo-img/enamel-craft-dental-studio-logo.png",
    favicon: "img/logo-img/logo.png",
    googleLogo: "img/services/google-logo.svg",
    heroStatic: selectedHero[0],
    hero: selectedHero,
    gallery: gallery,
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
