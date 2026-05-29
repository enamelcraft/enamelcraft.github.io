(function () {
  "use strict";

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initSpinner() {
    var el = document.getElementById("spinner");
    if (!el) return;
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    window.setTimeout(function () {
      el.style.visibility = "hidden";
      el.style.display = "none";
    }, 400);
  }

  function initHeaderScroll() {
    var header = document.querySelector(".ec-header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileNav() {
    var toggle = document.querySelector("[data-ec-nav-toggle]");
    var collapse = document.querySelector("[data-ec-nav-collapse]");
    if (!toggle || !collapse) return;

    toggle.addEventListener("click", function () {
      var open = collapse.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    collapse.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 991.98px)").matches) {
          collapse.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  function initClinicTourLightbox() {
    var GALLERY = [
      { src: "img/ecGallary01.jpg", alt: "Best dental clinic in Baner Pune" },
      { src: "img/ecGallary02.jpg", alt: "Affordable dentist near Balewadi Baner Road" },
      { src: "img/ecGallary03.jpg", alt: "Painless Root Canal Treatment in Baner" },
      { src: "img/ecGallary11.jpg", alt: "Top-rated cosmetic dental clinic near me" },
      { src: "img/ecGallary04.jpg", alt: "Best dentist in Pan Card Club Road Baner" },
      { src: "img/ecGallary12.jpg", alt: "The best dental studio near me" },
      { src: "img/ecGallary05.jpg", alt: "Professional dental services in Baner Pune" },
      { src: "img/ecGallary06.jpg", alt: "Nearby dental clinic with affordable fees" },
      { src: "img/ecGallary07.jpg", alt: "Cosmetic dental care for a perfect smile" },
      { src: "img/ecGallary08.jpg", alt: "Smile makeover with top-rated dentist near me" },
      { src: "img/ecGallary09.jpg", alt: "The dental studio offering expert care" },
      { src: "img/ecGallary10.jpg", alt: "Best-rated dentist near Balewadi Baner Road" },
      { src: "assets-lib/1.png", alt: "Enamel Craft Dental Studio reception and branding" },
      { src: "assets-lib/2.png", alt: "Treatment and care area at Enamel Craft Dental Studio" },
      { src: "assets-lib/3.png", alt: "Dental studio interior in Baner" },
      { src: "assets-lib/4.png", alt: "Modern dental clinic space in Baner Pune" },
      { src: "assets-lib/5.png", alt: "Calm clinical environment at Enamel Craft" },
    ];

    var root = document.getElementById("clinic-tour-lightbox");
    var stack = document.querySelector(".clinic-marquee-stack");
    if (!root || !stack) return;

    var imgEl = document.getElementById("clinic-tour-lightbox-img");
    var captionEl = document.getElementById("clinic-tour-lightbox-caption");
    var counterEl = document.getElementById("clinic-tour-lightbox-counter");
    var btnPrev = document.getElementById("clinic-tour-lightbox-prev");
    var btnNext = document.getElementById("clinic-tour-lightbox-next");
    var btnClose = document.getElementById("clinic-tour-lightbox-close");
    var backdrop = root.querySelector(".clinic-tour-lightbox__backdrop");
    if (!imgEl || !captionEl || !counterEl || !btnPrev || !btnNext || !btnClose || !backdrop) return;

    var currentIndex = 0;
    var lastFocus = null;

    function renderSlide() {
      var item = GALLERY[currentIndex];
      imgEl.src = item.src;
      imgEl.alt = item.alt;
      captionEl.textContent = item.alt;
      counterEl.textContent = currentIndex + 1 + " / " + GALLERY.length;
    }

    function onDocKeydown(e) {
      if (root.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeViewer();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    }

    function openViewer(index) {
      var n = GALLERY.length;
      if (!n) return;
      currentIndex = ((index % n) + n) % n;
      renderSlide();
      lastFocus = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = "hidden";
      stack.classList.add("is-lightbox-open");
      document.addEventListener("keydown", onDocKeydown);
      btnNext.focus();
    }

    function closeViewer() {
      root.hidden = true;
      document.body.style.overflow = "";
      stack.classList.remove("is-lightbox-open");
      document.removeEventListener("keydown", onDocKeydown);
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    function step(delta) {
      var n = GALLERY.length;
      currentIndex = (currentIndex + delta + n) % n;
      renderSlide();
    }

    stack.addEventListener("click", function (e) {
      var slide = e.target.closest(".clinic-marquee__slide");
      if (!slide || !stack.contains(slide)) return;
      var raw = slide.getAttribute("data-clinic-tour-index");
      if (raw === null || raw === "") return;
      var index = parseInt(raw, 10);
      if (isNaN(index)) return;
      openViewer(index);
    });

    stack.addEventListener("keydown", function (e) {
      var slide = e.target.closest(".clinic-marquee__slide");
      if (!slide || slide.getAttribute("role") !== "button") return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        var raw = slide.getAttribute("data-clinic-tour-index");
        openViewer(parseInt(raw, 10));
      }
    });

    btnPrev.addEventListener("click", function () {
      step(-1);
    });
    btnNext.addEventListener("click", function () {
      step(1);
    });
    btnClose.addEventListener("click", closeViewer);
    backdrop.addEventListener("click", closeViewer);
  }

  function initHeroCarousel() {
    var root = document.querySelector("[data-ec-hero-carousel]");
    if (!root) return;
    var slides = root.querySelectorAll(".ec-hero__slide");
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      slides.forEach(function (s, idx) {
        s.classList.toggle("is-active", idx === 0);
      });
      return;
    }
    var i = 0;
    var ms = 6500;
    function show(n) {
      slides.forEach(function (s, idx) {
        s.classList.toggle("is-active", idx === n);
      });
    }
    show(0);
    window.setInterval(function () {
      i = (i + 1) % slides.length;
      show(i);
    }, ms);
  }

  function initReveal() {
    if (!window.IntersectionObserver) return;
    var els = document.querySelectorAll("[data-ec-reveal]");
    if (!els.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  onReady(function () {
    initSpinner();
    initHeaderScroll();
    initMobileNav();
    initClinicTourLightbox();
    initHeroCarousel();
    initReveal();
  });
})();
