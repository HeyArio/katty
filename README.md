# Katayoun Parmar — Portfolio

Personal portfolio site for **Katayoun Parmar**, Iranian filmmaker and director
based in Paris. A single-page, dark editorial site with an animated WebGL
background evoking a film projection (warm projector glow, drifting dust, film
grain).

## Tech

- Plain HTML, CSS, and vanilla JavaScript — no build step, no framework.
- [Three.js](https://threejs.org/) (r128, via CDN) for the animated background shader.
- Google Fonts: Cormorant Garamond, Archivo, Space Mono.

## Project structure

```
katayoun-parmar-portfolio/
├── index.html          # Markup for the whole page
├── css/
│   └── style.css       # Design tokens + all component styles
├── js/
│   ├── background.js   # Three.js full-screen projection shader (#fx-canvas)
│   └── main.js         # Scroll-reveal + page interactions
├── assets/             # Photography / film stills
└── README.md
```

## Run locally

No build is required. Because the page loads local assets, serve it over HTTP
rather than opening the file directly:

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

## Sections

`Hero · Selected Films · About · Awards & Festivals · Sibling Story (studio) · Behind the Scenes · Contact`

## Customising

- **Colours & type** live as CSS custom properties at the top of `css/style.css`
  (`--bg`, `--ink`, `--ember`, `--serif`, …).
- **The background animation** is a single fragment shader in `js/background.js`;
  tweak the glow, dust layers, grain, and vignette there. It honours
  `prefers-reduced-motion` and renders a single static frame for those users.
- **Content** (films, awards, festivals) is straightforward markup in `index.html`.

## Deploy

It is a static site — push to any static host (GitHub Pages, Netlify, Vercel,
Cloudflare Pages). For GitHub Pages, enable Pages on the `main` branch root.

---

© 2026 Katayoun Parmar · Paris / Tehran
