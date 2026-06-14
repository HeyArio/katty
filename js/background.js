/* ============================================================
   Animated WebGL background — Three.js
   ------------------------------------------------------------
   A full-screen shader that evokes a film projection: a warm
   projector glow that drifts slowly, a faint light shaft, and
   three parallax layers of floating dust, with film grain and
   a soft vignette. Renders behind all page content.

   Dependencies: three.js (r128) — loaded in index.html.
   Entry point:  #fx-canvas
   ============================================================ */
(function () {
  "use strict";

  function init() {
    var canvas = document.getElementById("fx-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    // Respect users who prefer reduced motion: paint one static frame.
    var reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false });
    var dpr = Math.min(window.devicePixelRatio || 1, 1.4);
    renderer.setPixelRatio(dpr);

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var uniforms = {
      u_time: { value: 0 },
      u_res:  { value: new THREE.Vector2(1, 1) }
    };

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: "void main(){ gl_Position = vec4(position, 1.0); }",
      fragmentShader: [
        "precision highp float;",
        "uniform float u_time; uniform vec2 u_res;",
        "float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }",
        "vec2 hash2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }",
        // One parallax layer of soft floating dust motes.
        "float dustLayer(vec2 uv, float t, float scale, float speed){",
        "  uv *= scale;",
        "  uv.y -= t * speed;",
        "  uv.x += sin(uv.y * 0.3 + t * 0.2) * 0.35;",
        "  vec2 g = floor(uv); vec2 f = fract(uv);",
        "  float m = 0.0;",
        "  for(int y = -1; y <= 1; y++){ for(int x = -1; x <= 1; x++){",
        "    vec2 o = vec2(float(x), float(y));",
        "    vec2 h = hash2(g + o);",
        "    vec2 pos = o + h - f;",
        "    float d = length(pos);",
        "    float r = 0.035 + 0.05 * h.x;",
        "    float b = smoothstep(r, 0.0, d) * (0.25 + 0.75 * h.y);",
        "    b *= 0.5 + 0.5 * sin(t * 1.4 + h.x * 28.0);",
        "    m += b;",
        "  }}",
        "  return m;",
        "}",
        "void main(){",
        "  vec2 uv = gl_FragCoord.xy / u_res.xy;",
        "  float ar = u_res.x / u_res.y;",
        "  vec2 p = vec2(uv.x * ar, uv.y);",
        "  float t = u_time;",
        // Warm projector glow, slowly drifting.
        "  vec2 gc = vec2((0.5 + 0.16 * sin(t * 0.05)) * ar, 0.4 + 0.12 * cos(t * 0.04));",
        "  float glow = exp(-3.0 * length(p - gc));",
        "  vec3 col = vec3(0.043, 0.039, 0.035);",
        "  col += vec3(0.55, 0.30, 0.13) * glow * 0.22;",
        // Faint diagonal light shaft.
        "  float shaft = smoothstep(0.0, 0.5, 1.0 - abs(uv.x - 0.63) * 3.0) * 0.035 * (0.6 + 0.4 * sin(t * 0.1));",
        "  col += vec3(0.5, 0.35, 0.2) * shaft;",
        // Three parallax dust layers.
        "  float dust = 0.0;",
        "  dust += dustLayer(p, t, 6.0, 0.05) * 0.6;",
        "  dust += dustLayer(p + 11.3, t, 11.0, 0.085) * 0.4;",
        "  dust += dustLayer(p + 27.7, t, 18.0, 0.12) * 0.22;",
        "  col += vec3(0.85, 0.72, 0.52) * dust * 0.5;",
        // Film grain + vignette.
        "  float gr = hash(gl_FragCoord.xy + fract(t) * vec2(53.0, 91.0));",
        "  col += (gr - 0.5) * 0.05;",
        "  float v = smoothstep(1.25, 0.32, length(uv - 0.5));",
        "  col *= 0.5 + 0.5 * v;",
        "  gl_FragColor = vec4(col, 1.0);",
        "}"
      ].join("\n")
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.u_res.value.set(w * dpr, h * dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    var clock = new THREE.Clock();

    if (reduceMotion) {
      uniforms.u_time.value = 0;
      renderer.render(scene, camera);
      return;
    }

    (function loop() {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
