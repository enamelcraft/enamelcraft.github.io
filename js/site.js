(function () {
  "use strict";

  var WA_BOOK =
    "https://wa.me/917666297468?text=Hello,%20Can%20I%20book%20an%20appointment%3F";

  var STRIP_HOURS_WEEKDAY = "Mon–Fri 10:00 AM–8:00 PM";
  var STRIP_HOURS_WEEKEND = "Sat–Sun 11:00 AM–7:00 PM";
  var STRIP_HOURS_HTML =
    STRIP_HOURS_WEEKDAY + "<br>" + STRIP_HOURS_WEEKEND;
  var STRIP_VISIT_ADDRESS =
    "Shop No. 3, Shreeban building, Sneh Park Society, Pancard Club Rd, Baner Gaon, Baner, Pune, Maharashtra 411045";

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function getGalleryImages() {
    if (window.EC_IMAGES && Array.isArray(window.EC_IMAGES.gallery)) {
      return window.EC_IMAGES.gallery;
    }
    return [];
  }

  function initInfoStrip() {
    if (document.querySelector(".ec-strip")) return;

    var hero = document.querySelector(".ec-hero");
    var pageHero = document.querySelector(".ec-page-hero");
    var anchor = hero || pageHero;
    if (!anchor) return;

    var strip = document.createElement("div");
    strip.className =
      "ec-strip ec-strip--prominent" + (pageHero && !hero ? " ec-strip--page" : "");
    strip.setAttribute("aria-label", "Studio hours, location, phone, and email");
    strip.innerHTML =
      '<div class="ec-strip__grid">' +
      '<div class="ec-strip__card ec-strip__card--hours">' +
      '<span class="ec-strip__card-row">' +
      '<span class="ec-strip__icon" aria-hidden="true"><i class="bi bi-clock"></i></span>' +
      '<span class="ec-strip__card-body">' +
      '<span class="ec-strip__label">Hours</span>' +
      "<h3>We are open seven days</h3>" +
      "<p>" + STRIP_HOURS_HTML + "</p>" +
      "</span></span></div>" +
      '<a class="ec-strip__card ec-strip__card--link" href="https://maps.google.com/?cid=0x320e0867367f751a" target="_blank" rel="noopener noreferrer">' +
      '<span class="ec-strip__card-row">' +
      '<span class="ec-strip__icon" aria-hidden="true"><i class="bi bi-geo-alt"></i></span>' +
      '<span class="ec-strip__card-body">' +
      '<span class="ec-strip__label">Visit</span>' +
      "<p class=\"ec-strip__visit-address\">" + STRIP_VISIT_ADDRESS + "</p>" +
      "</span></span></a>" +
      '<div class="ec-strip__card ec-strip__card--phone">' +
      '<span class="ec-strip__card-row">' +
      '<span class="ec-strip__icon" aria-hidden="true"><i class="bi bi-telephone"></i></span>' +
      '<span class="ec-strip__card-body">' +
      '<span class="ec-strip__label">Phone</span>' +
      '<h3 class="ec-num"><a class="ec-strip__tel" href="tel:+91-7666297468">+91-7666297468</a></h3>' +
      '<p><a class="ec-strip__email" href="mailto:enamelcraft.dental@gmail.com">enamelcraft.dental@gmail.com</a></p>' +
      "</span></span></div>" +
      "</div>";

    anchor.insertAdjacentElement("afterend", strip);

    var next = strip.nextElementSibling;
    if (next && next.classList.contains("ec-section")) {
      next.classList.add("ec-section--after-strip");
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

  function initNavMore() {
    document.querySelectorAll("[data-ec-nav-more]").forEach(function (root) {
      var toggle = root.querySelector(".ec-nav__more-toggle");
      var menu = root.querySelector(".ec-nav__more-menu");
      if (!toggle || !menu) return;

      function close() {
        root.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      }

      function open() {
        root.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        menu.hidden = false;
      }

      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        if (menu.hidden) open();
        else close();
      });

      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          close();
        });
      });

      document.addEventListener("click", function (e) {
        if (!root.contains(e.target)) close();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
      });
    });
  }

  function navHrefToFile(href) {
    if (!href || href.indexOf("://") !== -1) return "";
    var path = href.split("#")[0].split("?")[0];
    path = path.replace(/^\.\//, "");
    if (!path || path === "/") return "index.html";
    return path.split("/").pop() || "index.html";
  }

  function currentPageFile() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop() || "index.html";
    if (!file || file === "/") return "index.html";
    return file;
  }

  function initNavActive() {
    var nav = document.querySelector(".ec-nav__links");
    if (!nav) return;
    var current = currentPageFile();
    var matched = false;

    nav.querySelectorAll("a[href]").forEach(function (link) {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
      var file = navHrefToFile(link.getAttribute("href"));
      if (file && file === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
        matched = true;
      }
    });

    if (!matched && current === "index.html") {
      var home = nav.querySelector('a[href="index.html"], a[href="./"], a[href="/"]');
      if (home) {
        home.classList.add("is-active");
        home.setAttribute("aria-current", "page");
      }
    }
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

  function buildMarqueeGroup(items, startIndex, interactive) {
    var group = document.createElement("div");
    group.className = "clinic-marquee__group";
    if (!interactive) group.setAttribute("aria-hidden", "true");

    items.forEach(function (item, offset) {
      var index = startIndex + offset;
      var fig = document.createElement("figure");
      fig.className = "clinic-marquee__slide";
      if (interactive) {
        fig.setAttribute("data-clinic-tour-index", String(index));
        fig.tabIndex = 0;
        fig.setAttribute("role", "button");
      } else {
        fig.tabIndex = -1;
      }
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = interactive ? item.alt : "";
      img.width = 640;
      img.height = 480;
      img.loading = "lazy";
      img.decoding = "async";
      fig.appendChild(img);
      group.appendChild(fig);
    });
    return group;
  }

  function initGalleryGrid() {
    var grid = document.querySelector("[data-ec-gallery-grid]");
    if (!grid) return;
    var gallery = getGalleryImages().slice(0, 6);
    if (!gallery.length) return;
    grid.innerHTML = "";
    gallery.forEach(function (item, index) {
      var fig = document.createElement("figure");
      fig.className = "ec-gallery-grid__item clinic-marquee__slide";
      fig.setAttribute("data-clinic-tour-index", String(index));
      fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.width = 640;
      img.height = 480;
      img.loading = "lazy";
      img.decoding = "async";
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  function initGalleryMarquee() {
    var stack = document.querySelector("[data-ec-gallery-marquee]");
    if (!stack) return;
    var gallery = getGalleryImages();
    if (!gallery.length) return;

    var mid = Math.ceil(gallery.length / 2);
    var rowA = gallery.slice(0, mid);
    var rowB = gallery.slice(mid);

    stack.innerHTML = "";

    function addRow(items, reverse, indexOffset) {
      var row = document.createElement("div");
      row.className = "clinic-marquee" + (reverse ? " clinic-marquee--reverse" : "");
      var track = document.createElement("div");
      track.className = "clinic-marquee__track";
      track.appendChild(buildMarqueeGroup(items, indexOffset, true));
      track.appendChild(buildMarqueeGroup(items, indexOffset, false));
      row.appendChild(track);
      stack.appendChild(row);
    }

    addRow(rowA, false, 0);
    addRow(rowB, true, rowA.length);
  }

  function heroSlideSrcKey(src) {
    try {
      return new URL(src, window.location.href).pathname;
    } catch (e) {
      return src;
    }
  }

  function shouldLimitHeroCarousel() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return false;
    if (conn.saveData) return true;
    var et = conn.effectiveType || "";
    return et === "slow-2g" || et === "2g";
  }

  function initHeroSlides() {
    var container = document.querySelector("[data-ec-hero-slides]");
    if (!container) return;
    var hero =
      window.EC_IMAGES && Array.isArray(window.EC_IMAGES.hero)
        ? window.EC_IMAGES.hero
        : [];
    if (!hero.length) return;

    var existing = container.querySelectorAll(".ec-hero__frame, .ec-hero__slide");
    var have = {};
    existing.forEach(function (el) {
      var img =
        el.tagName === "IMG" ? el : el.querySelector("img.ec-hero__frame__img, img.ec-hero__slide");
      if (!img) return;
      have[heroSlideSrcKey(img.getAttribute("src") || img.src)] = true;
    });

    function appendSlide(item, isFirst) {
      var frame = document.createElement("div");
      var frameClass = "ec-hero__frame";
      if (/netflixDental/i.test(item.src)) frameClass += " ec-hero__frame--top";
      if (isFirst) frameClass += " is-active";
      frame.className = frameClass;

      var img = document.createElement("img");
      img.className = "ec-hero__frame__img";
      img.src = item.src;
      img.alt = item.alt;
      img.width = 1920;
      img.height = 1080;
      img.sizes = "100vw";
      if (item.srcset) img.srcset = item.srcset;
      if (isFirst) img.setAttribute("fetchpriority", "high");
      else img.loading = "lazy";
      img.decoding = "async";

      frame.appendChild(img);
      container.appendChild(frame);
    }

    if (!existing.length) {
      container.innerHTML = "";
      hero.forEach(function (item, idx) {
        appendSlide(item, idx === 0);
      });
      return;
    }

    if (shouldLimitHeroCarousel()) return;

    hero.forEach(function (item) {
      if (have[heroSlideSrcKey(item.src)]) return;
      appendSlide(item, false);
    });
  }

  function initClinicTourLightbox() {
    var GALLERY = getGalleryImages();

    var root = document.getElementById("clinic-tour-lightbox");
    var stack =
      document.querySelector("[data-ec-gallery-marquee]") ||
      document.querySelector("[data-ec-gallery-root]") ||
      document.querySelector(".clinic-marquee-stack");
    if (!root || !stack || !GALLERY.length) return;

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
    var slides = root.querySelectorAll(".ec-hero__frame");
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      slides.forEach(function (s, idx) {
        s.classList.toggle("is-active", idx === 0);
      });
      return;
    }
    var i = 0;
    var ms = 7000;
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

  function initCaseLightbox() {
    var root = document.getElementById("ec-case-lightbox");
    if (!root) return;
    var imgEl = document.getElementById("ec-case-lightbox-img");
    var backdrop = root.querySelector(".ec-case-lightbox__backdrop");
    var closeBtn = root.querySelector(".ec-case-lightbox__close");
    if (!imgEl || !backdrop || !closeBtn) return;

    var lastFocus = null;

    function close() {
      root.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
    }

    function open(figure) {
      var img = figure.querySelector("img");
      if (!img) return;
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.alt || "Case clinical photograph";
      lastFocus = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    document.querySelectorAll("[data-ec-case-enlarge]").forEach(function (figure) {
      figure.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        open(figure);
      });
      figure.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(figure);
        }
      });
    });

    backdrop.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (!root.hidden && e.key === "Escape") close();
    });
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
    initNavActive();
    initInfoStrip();
    initSpinner();
    initHeaderScroll();
    initNavMore();
    initMobileNav();
    initHeroSlides();
    initGalleryGrid();
    initGalleryMarquee();
    initClinicTourLightbox();
    initHeroCarousel();
    initCaseLightbox();
    initReveal();
  });
})();
