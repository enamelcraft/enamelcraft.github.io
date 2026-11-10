(function () {
  "use strict";

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function shuffle(list) {
    var items = list.slice();
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  function setupAvatarFallbacks(root) {
    root.querySelectorAll("img[data-ec-avatar-fallback]").forEach(function (img) {
      img.addEventListener(
        "error",
        function () {
          var span = document.createElement("span");
          span.className = "ec-testimonial-card__avatar";
          span.setAttribute("aria-hidden", "true");
          span.textContent = img.getAttribute("data-ec-avatar-fallback") || "?";
          img.replaceWith(span);
        },
        { once: true }
      );
    });
  }

  function cloneCard(card, forScreenReader) {
    var clone = card.cloneNode(true);
    var stars = clone.querySelector(".ec-stars");
    if (stars) {
      if (forScreenReader) {
        stars.setAttribute("aria-hidden", "true");
        stars.removeAttribute("aria-label");
      } else if (!stars.getAttribute("aria-label")) {
        stars.removeAttribute("aria-hidden");
      }
    }
    return clone;
  }

  function initGoogleReviews() {
    var section = document.querySelector("[data-ec-google-reviews]");
    if (!section) return;

    var track = section.querySelector("[data-ec-reviews-track]");
    var sourceGroup = section.querySelector("[data-ec-reviews-group]");
    if (!track || !sourceGroup) return;

    var cards = Array.from(sourceGroup.querySelectorAll("[data-ec-review]"));
    if (!cards.length) return;

    var shuffled = shuffle(cards);
    track.innerHTML = "";

    var groups = [document.createElement("div"), document.createElement("div")];
    groups[0].className = "ec-review-marquee__group";
    groups[0].setAttribute("data-ec-reviews-group", "");
    groups[1].className = "ec-review-marquee__group";
    groups[1].setAttribute("aria-hidden", "true");

    shuffled.forEach(function (card) {
      groups[0].appendChild(cloneCard(card, false));
      groups[1].appendChild(cloneCard(card, true));
    });

    groups.forEach(function (group) {
      track.appendChild(group);
    });

    setupAvatarFallbacks(track);
  }

  onReady(initGoogleReviews);
})();
