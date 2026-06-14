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

  function init() {
    initReveal();
    ensureHeroVisible();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
