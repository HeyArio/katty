/* ============================================================
   Page interactions
   ------------------------------------------------------------
   • Scroll-reveal: fades sections in as they enter the viewport.
   • Hero entrance safety net for throttled background tabs.
   ============================================================ */
(function () {
  "use strict";

  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    // No IntersectionObserver → just show everything.
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings within the same parent.
        var sibs = el.parentElement
          ? Array.prototype.slice.call(el.parentElement.querySelectorAll(":scope > [data-reveal]"))
          : [el];
        var idx = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = (idx * 90) + "ms";
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });

    // Safety fallback: reveal anything still hidden after 4.5s.
    setTimeout(function () {
      els.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4500);
  }

  // CSS entrance animations (the hero) can be throttled to a halt when the
  // page loads in a background tab. This guarantees the hero ends visible.
  function ensureHeroVisible() {
    setTimeout(function () {
      var animated = document.querySelectorAll('.hero__text .eyebrow, .hero__title, .hero__lede, .hero__actions');
      Array.prototype.forEach.call(animated, function (el) {
        el.style.animation = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }, 2400);
  }

  // Trailer modal: opens a Vimeo player for any element with [data-trailer].
  function initTrailers() {
    var modal = document.getElementById("trailer");
    if (!modal) return;
    var frame = document.getElementById("trailer-frame");
    var title = document.getElementById("trailer-title");
    var lastFocused = null;

    function open(id, name) {
      lastFocused = document.activeElement;
      title.textContent = name || "Trailer";
      frame.innerHTML =
        '<iframe src="https://player.vimeo.com/video/' + id +
        '?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = modal.querySelector(".trailer__close");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      modal.hidden = true;
      frame.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.querySelectorAll("[data-trailer]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        open(trigger.getAttribute("data-trailer"), trigger.getAttribute("data-film"));
      });
    });

    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) close();
    });
  }

  // Poster carousel: prev/next arrows scroll the track by one card.
  function initCarousel() {
    var track = document.getElementById("poster-track");
    if (!track) return;
    var carousel = track.closest(".carousel");
    var prev = carousel.querySelector(".carousel__nav--prev");
    var next = carousel.querySelector(".carousel__nav--next");

    function step() {
      var card = track.querySelector(".poster");
      var gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 20, 10) || 20;
      return card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    }
    function update() {
      var maxScroll = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollLeft >= maxScroll;
    }

    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // Gallery: keeps the big stage and the thumbnail navigator in sync.
  function initGallery() {
    var stage = document.getElementById("feature-track");
    var thumbTrack = document.getElementById("poster-track");
    if (!stage || !thumbTrack) return;
    var slides = Array.prototype.slice.call(stage.querySelectorAll(".feature"));
    var thumbs = Array.prototype.slice.call(thumbTrack.querySelectorAll(".poster"));
    var gallery = stage.closest(".gallery");
    var prev = gallery.querySelector(".gallery__nav--prev");
    var next = gallery.querySelector(".gallery__nav--next");
    var active = -1;

    function setActive(i, scrollStage) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (i === active) return;
      active = i;
      if (scrollStage) stage.scrollTo({ left: i * stage.clientWidth, behavior: "smooth" });
      thumbs.forEach(function (t, n) { t.classList.toggle("is-active", n === i); });
      // Keep the active thumbnail comfortably in view.
      var thumb = thumbs[i];
      if (thumb) {
        var target = thumb.offsetLeft - (thumbTrack.clientWidth - thumb.offsetWidth) / 2;
        thumbTrack.scrollTo({ left: target, behavior: "smooth" });
      }
      if (prev) prev.disabled = i <= 0;
      if (next) next.disabled = i >= slides.length - 1;
    }

    if (prev) prev.addEventListener("click", function () { setActive(active - 1, true); });
    if (next) next.addEventListener("click", function () { setActive(active + 1, true); });

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () { setActive(i, true); });
    });

    // Manual swipe/scroll of the stage updates the active film.
    var raf;
    stage.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        setActive(Math.round(stage.scrollLeft / stage.clientWidth), false);
      });
    }, { passive: true });

    setActive(0, false);
  }

  function init() {
    initReveal();
    ensureHeroVisible();
    initTrailers();
    initCarousel();
    initGallery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
