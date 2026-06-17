/* ============================================================
   Bilingual content (English / French)
   ------------------------------------------------------------
   • Every translatable element carries a data-i18n key (text /
     inline markup) or data-i18n-aria key (aria-label).
   • The switcher in the nav flips between "en" and "fr"; the
     choice is remembered in localStorage. With JS disabled the
     page falls back to the English written into the markup.
   ============================================================ */
(function () {
  "use strict";

  var STORE_KEY = "kp-lang";

  // key -> { en, fr }. Values may contain inline HTML (<em>, <br>, <span>).
  var T = {
    "doc.title": {
      en: "Katayoun Parmar — Filmmaker & Director",
      fr: "Katayoun Parmar — Réalisatrice & Cinéaste"
    },

    /* Nav */
    "nav.films":   { en: "Films",   fr: "Films" },
    "nav.about":   { en: "About",   fr: "À propos" },
    "nav.awards":  { en: "Awards",  fr: "Prix" },
    "nav.studio":  { en: "Studio",  fr: "Studio" },
    "nav.contact": { en: "Contact", fr: "Contact" },

    /* Hero */
    "hero.eyebrow": {
      en: "Réalisatrice · Filmmaker &amp; Director",
      fr: "Réalisatrice · Cinéaste"
    },
    "hero.lede": {
      en: "An Iranian director based in Paris, working between Tehran and France. Six short films selected in more than fifty festivals worldwide — and a new studio built with her brother.",
      fr: "Réalisatrice iranienne installée à Paris, travaillant entre Téhéran et la France. Six courts métrages sélectionnés dans plus de cinquante festivals à travers le monde — et un nouveau studio fondé avec son frère."
    },
    "hero.viewfilms": { en: "View films", fr: "Voir les films" },
    "hero.contact":   { en: "Contact",    fr: "Contact" },

    /* Films */
    "films.title": { en: "Selected Films", fr: "Films sélectionnés" },
    "films.meta":  { en: "Six shorts · 2017—2026", fr: "Six courts métrages · 2017—2026" },
    "feature.latest": { en: "Latest", fr: "Dernier" },
    "films.directormeta": {
      en: "Director · France · Watch trailer",
      fr: "Réalisation · France · Bande-annonce"
    },
    "films.shortmeta": {
      en: "Short · Iran · Watch trailer",
      fr: "Court métrage · Iran · Bande-annonce"
    },

    /* About */
    "about.caption": { en: "On set · La Chasse, Paris 2026", fr: "Sur le tournage · La Chasse, Paris 2026" },
    "about.eyebrow": { en: "About", fr: "À propos" },
    "about.lead": {
      en: "Katayoun Parmar is an Iranian director based in Paris, working between Tehran and France in a quiet, observational register.",
      fr: "Katayoun Parmar est une réalisatrice iranienne installée à Paris, travaillant entre Téhéran et la France dans un registre intime et observateur."
    },
    "about.para": {
      en: "She studied cinema and audiovisual arts at Master 2 level at Université Paris 1 Panthéon-Sorbonne, after a bachelor's at the University of Art in Tehran. She has directed six short films selected in more than fifty international festivals, and collaborated with MK2 Curiosity on one of her projects. In 2025 she founded the production studio Sibling Story in Tehran with her brother, Keyvan Parmar.",
      fr: "Elle a étudié le cinéma et l'audiovisuel en Master 2 à l'Université Paris 1 Panthéon-Sorbonne, après une licence à l'Université d'Art de Téhéran. Elle a réalisé six courts métrages sélectionnés dans plus de cinquante festivals internationaux, et a collaboré avec MK2 Curiosity sur l'un de ses projets. En 2025, elle a fondé le studio de production Sibling Story à Téhéran avec son frère, Keyvan Parmar."
    },
    "about.craft":          { en: "Craft", fr: "Métier" },
    "about.directing":      { en: "Directing", fr: "Réalisation" },
    "about.screenwriting":  { en: "Screenwriting", fr: "Scénario" },
    "about.editing":        { en: "Editing", fr: "Montage" },
    "about.cinematography": { en: "Cinematography", fr: "Image" },
    "about.photovideo":     { en: "Photography &amp; Videography", fr: "Photographie &amp; Vidéo" },
    "about.also":           { en: "Also", fr: "Également" },
    "about.setdecorator":   { en: "Set Decorator — <span>Soulless</span> (2023)", fr: "Décoratrice — <span>Soulless</span> (2023)" },
    "about.committee":      { en: "Selection committee — Tehran Int'l Short Film Festival (2021)", fr: "Comité de sélection — Festival International du Court Métrage de Téhéran (2021)" },
    "about.teacher":        { en: "Cinema teacher — Manzoumeh Kherad Institute (2018—2022)", fr: "Professeure de cinéma — Institut Manzoumeh Kherad (2018—2022)" },
    "about.member":         { en: "Member — Iranian Short Film Association (ISFA)", fr: "Membre — Association iranienne du court métrage (ISFA)" },
    "about.education":      { en: "Education", fr: "Formation" },
    "about.educationfact":  {
      en: "MA Cinema &amp; Audiovisual — Paris 1 Panthéon-Sorbonne, 2024—26<br>BA Cinema — University of Art, Tehran, 2014—18",
      fr: "Master Cinéma &amp; Audiovisuel — Paris 1 Panthéon-Sorbonne, 2024—26<br>Licence Cinéma — Université d'Art, Téhéran, 2014—18"
    },
    "about.languages":     { en: "Languages", fr: "Langues" },
    "about.languagesfact": { en: "Persian · French · English", fr: "Persan · Français · Anglais" },

    /* Awards */
    "awards.eyebrow": { en: "Recognition", fr: "Reconnaissance" },
    "awards.big": {
      en: "<em>50+</em> festivals worldwide",
      fr: "<em>50+</em> festivals dans le monde"
    },
    "awards.awards":       { en: "Awards", fr: "Récompenses" },
    "award.narrative":     { en: "Best Narrative Short", fr: "Meilleur court métrage de fiction" },
    "award.grandprize":    { en: "Special Grand Prize", fr: "Grand Prix spécial" },
    "award.cinematography":{ en: "Best Cinematography", fr: "Meilleure image" },
    "award.editing":       { en: "Best Editing", fr: "Meilleur montage" },
    "award.youngtalent":   { en: "Young Talent Award", fr: "Prix du jeune talent" },
    "award.bestshort":     { en: "Best Short Film", fr: "Meilleur court métrage" },
    "awards.selectedfest": { en: "Selected Festivals", fr: "Festivals sélectionnés" },

    /* Studio */
    "studio.eyebrow":     { en: "The Studio · Est. 2025", fr: "Le Studio · Fondé en 2025" },
    "studio.para": {
      en: "A production studio founded in Tehran in 2025 with her brother, Keyvan Parmar — a home for the films the two of them want to make, and the filmmakers they want to make them with.",
      fr: "Un studio de production fondé à Téhéran en 2025 avec son frère, Keyvan Parmar — un foyer pour les films qu'ils veulent faire ensemble, et les cinéastes avec qui les réaliser."
    },
    "studio.production":  { en: "Production", fr: "Production" },
    "studio.development": { en: "Development", fr: "Développement" },
    "studio.cities":      { en: "Tehran · Paris", fr: "Téhéran · Paris" },

    /* Gallery */
    "gallery.title": { en: "Behind the Scenes", fr: "Dans les coulisses" },
    "gallery.meta":  { en: "From the monitor", fr: "Depuis le moniteur" },
    "gallery.cap1":  { en: "You're Still Here · 2018 · ph. Shauheen Daneshfar", fr: "You're Still Here · 2018 · ph. Shauheen Daneshfar" },
    "gallery.cap2":  { en: "La Chasse · 2026 · behind the camera", fr: "La Chasse · 2026 · derrière la caméra" },
    "gallery.cap3":  { en: "You're Still Here · on the monitor", fr: "You're Still Here · au moniteur" },
    "gallery.cap4":  { en: "La Chasse · 2026 · Paris", fr: "La Chasse · 2026 · Paris" },
    "gallery.cap5":  { en: "You're Still Here · the take", fr: "You're Still Here · la prise" },
    "gallery.cap6":  { en: "You're Still Here · direction", fr: "You're Still Here · mise en scène" },

    /* Contact */
    "contact.eyebrow": { en: "Contact", fr: "Contact" },
    "contact.title": {
      en: "Let's make<br><em>something.</em>",
      fr: "Créons<br><em>ensemble.</em>"
    },
    "contact.location": { en: "Ivry-sur-Seine · Paris", fr: "Ivry-sur-Seine · Paris" },
    "footer.role": { en: "Katayoun Parmar — Cinéaste", fr: "Katayoun Parmar — Cinéaste" },
    "footer.copy": { en: "© 2026 · Paris / Tehran", fr: "© 2026 · Paris / Téhéran" },

    /* Aria labels */
    "aria.prevfilm":    { en: "Previous film", fr: "Film précédent" },
    "aria.nextfilm":    { en: "Next film", fr: "Film suivant" },
    "aria.prevposters": { en: "Previous posters", fr: "Affiches précédentes" },
    "aria.nextposters": { en: "Next posters", fr: "Affiches suivantes" },
    "aria.close":       { en: "Close trailer", fr: "Fermer la bande-annonce" }
  };

  function apply(lang) {
    if (lang !== "fr") lang = "en";

    document.documentElement.setAttribute("lang", lang);
    if (T["doc.title"]) document.title = T["doc.title"][lang];

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var entry = T[nodes[i].getAttribute("data-i18n")];
      if (entry && entry[lang] != null) nodes[i].innerHTML = entry[lang];
    }

    var arias = document.querySelectorAll("[data-i18n-aria]");
    for (var j = 0; j < arias.length; j++) {
      var a = T[arias[j].getAttribute("data-i18n-aria")];
      if (a && a[lang] != null) arias[j].setAttribute("aria-label", a[lang]);
    }

    var opts = document.querySelectorAll("[data-lang]");
    for (var k = 0; k < opts.length; k++) {
      var on = opts[k].getAttribute("data-lang") === lang;
      opts[k].classList.toggle("is-active", on);
      opts[k].setAttribute("aria-pressed", on ? "true" : "false");
    }

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  function initialLang() {
    var stored;
    try { stored = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (stored === "en" || stored === "fr") return stored;
    var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return nav.indexOf("fr") === 0 ? "fr" : "en";
  }

  function init() {
    var opts = document.querySelectorAll("[data-lang]");
    for (var i = 0; i < opts.length; i++) {
      opts[i].addEventListener("click", function () {
        apply(this.getAttribute("data-lang"));
      });
    }
    apply(initialLang());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
