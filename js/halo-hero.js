/* ==========================================================================
   HALO RING 3D HERO (THREE.JS VANILLA PORT) · PORTAFOLIO VICTORIA SOL FRÍAS
   Anillo cilíndrico 3D de tarjetas curvas, odómetro 0..100, cámara en picada
   y giro interactivo por arrastre.
   ========================================================================== */

import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';

const CARDS = [
  'images/projects/bivalvia-hero.jpg',
  'images/projects/umwelt-bees.jpg',
  'images/projects/yara-hero.jpg',
  'images/projects/crisol-hero.jpg',
  'images/projects/local-hero.jpg',
  'images/projects/realidades-hero.jpg',
  'images/projects/bivalvia-pants.jpg',
  'images/projects/yara-panoramic.jpg',
  'images/projects/local-material.jpg',
  'images/projects/umwelt-hero.jpg',
  'images/projects/crisol-frame.jpg',
  'images/projects/bivalvia-front.jpg',
  'images/projects/yara-detail.jpg',
  'images/projects/local-detail.jpg',
  'images/projects/bivalvia-hood.jpg',
  'images/projects/yara-editorial.jpg'
];

const STATS = [
  { value: 7, decimals: 0, suffix: '', label: 'Proyectos' },
  { value: 3, decimals: 0, suffix: '', label: 'Disciplinas' },
  { value: 2026, decimals: 0, suffix: '', label: 'Archivo' }
];

const T = {
  markIn: [0, 0.65],
  countRise: [0, 0.25],
  count: [0.05, 0.8],
  build: [0.1, 1.87],
  pop: 0.3,
  sky: [2.02, 2.45],
  countOut: [2.15, 2.5],
  dive: [2.0, 2.85],
  shrink: [2.2, 2.95],
  suffix: [3.1, 3.4],
  frame: [3.15, 3.55],
  links: [3.2, 3.45],
  line1: [3.2, 3.55],
  line2: [3.38, 3.73],
  stats: [3.55, 4.6],
  underline: [3.7, 4.2],
  idle: 3.0,
  end: 4.7
};

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const span = (t, ab) => clamp01((t - ab[0]) / (ab[1] - ab[0]));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOut3 = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut3 = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutBack = (x) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const BUILD_KNOTS = [
  [0, 0.1],
  [0.4, 0.6],
  [0.8, 1.5],
  [1, 1.87 - 0.3]
];

function cardStart(k, n) {
  const f = n <= 1 ? 0 : k / (n - 1);
  for (let i = 1; i < BUILD_KNOTS.length; i++) {
    const [f0, t0] = BUILD_KNOTS[i - 1];
    const [f1, t1] = BUILD_KNOTS[i];
    if (f <= f1) return lerp(t0, t1, (f - f0) / (f1 - f0));
  }
  return BUILD_KNOTS[BUILD_KNOTS.length - 1][1];
}

function cardShown(t, k, n) {
  return clamp01((t - cardStart(k, n)) / T.pop);
}

function countAt(t) {
  return 100 * easeOut3(span(t, T.count));
}

function odometer(c, place) {
  const unit = Math.pow(10, place);
  const whole = Math.floor(c / unit);
  const carry = Math.max(0, (c % unit) - (unit - 1));
  const v = (whole % 10) + carry;
  return c >= 100 && place === 2 ? 1 : v;
}

const YAW_BUILD = 0.16;
const YAW_RAMP = [T.dive[0], T.idle + 0.45];

function yawSpeed(t, slot) {
  if (t <= T.build[0]) return 0;
  const start = easeOut3(clamp01((t - T.build[0]) / 0.5));
  const k = easeInOut3(span(t, YAW_RAMP));
  return start * lerp(YAW_BUILD, slot / 0.9, k);
}

function ringYaw(t, slot) {
  const end = Math.min(t, YAW_RAMP[1]);
  let yaw = 0;
  if (end > T.build[0]) {
    const steps = 48;
    const a = T.build[0];
    const h = (end - a) / steps;
    let acc = yawSpeed(a, slot) + yawSpeed(end, slot);
    for (let i = 1; i < steps; i++) acc += yawSpeed(a + i * h, slot) * (i % 2 ? 4 : 2);
    yaw = (acc * h) / 3;
  }
  if (t > YAW_RAMP[1]) yaw += (slot / 0.9) * (t - YAW_RAMP[1]);
  return yaw;
}

function cameraAt(t, outside, inside) {
  const pq = span(t, [T.build[0], T.dive[1]]);
  const pull = lerp(0.86, 1, pq * (2 - pq));
  const s = easeInOut3(span(t, T.dive));
  const drop = Math.pow(s, 1.6);
  return {
    px: lerp(outside.px * pull, inside.px, s),
    py: lerp(outside.py * pull, inside.py, drop),
    pz: lerp(outside.pz * pull, inside.pz, s),
    tx: lerp(outside.tx, inside.tx, s),
    ty: lerp(outside.ty, inside.ty, s),
    tz: lerp(outside.tz, inside.tz, s),
    vfov: lerp(outside.vfov, inside.vfov, easeInOut3(clamp01((s - 0.5) / 0.5))),
    roll: lerp(outside.roll, inside.roll, s)
  };
}

function cardGeometry(R, w, h, seg) {
  const pos = [];
  const uv = [];
  const idx = [];
  for (let j = 0; j <= 1; j++) {
    for (let i = 0; i <= seg; i++) {
      const u = i / seg - 0.5;
      const phi = (-u * w) / R;
      pos.push(R * Math.sin(phi), (j - 0.5) * h, R * Math.cos(phi) - R);
      uv.push(u + 0.5, j);
    }
  }
  for (let i = 0; i < seg; i++) {
    const a = i;
    const b = i + 1;
    const c = i + seg + 1;
    const d = i + seg + 2;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

function cardCanvas(img) {
  const W = 432;
  const H = 768;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d');
  if (!x) return c;
  const r = 30;
  x.beginPath();
  x.moveTo(r, 0);
  x.arcTo(W, 0, W, H, r);
  x.arcTo(W, H, 0, H, r);
  x.arcTo(0, H, 0, 0, r);
  x.arcTo(0, 0, W, 0, r);
  x.closePath();
  x.clip();
  x.fillStyle = '#1D120E';
  x.fillRect(0, 0, W, H);
  if (img && img.naturalWidth) {
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * s;
    const dh = img.naturalHeight * s;
    x.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }
  return c;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    im.onload = () => resolve(im);
    im.onerror = () => resolve(null);
    im.src = src;
  });
}

(function initHaloHero() {
  const root = document.getElementById('haloRoot');
  const sceneEl = document.getElementById('hrhScene');
  const canvas = document.getElementById('hrhCanvas');
  const skyEl = document.getElementById('hrhSky');
  const coverEl = document.getElementById('hrhCover');
  const markEl = document.getElementById('hrhMark');
  const countEl = document.getElementById('hrhCount');
  const navEl = document.getElementById('hrhNav');
  const barEl = document.getElementById('hrhBar');
  const wordRiseEl = document.getElementById('hrhWordRise');
  const replayBtn = document.getElementById('hrhReplay');

  if (!root || !sceneEl || !canvas) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const R = 1;
  const n = CARDS.length;
  const slot = (Math.PI * 2) / n;

  let built = null;
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 2, 0.02, 60);
    const ring = new THREE.Group();
    scene.add(ring);

    const w = ((2 * Math.PI * R) / n) * 0.9;
    const h = (w * 16) / 9;
    const geo = cardGeometry(R, w, h, 18);
    const cards = [];
    const mats = [];

    for (let k = 0; k < n; k++) {
      const mat = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        color: 0xffffff
      });
      const m = new THREE.Mesh(geo, mat);
      const theta = (k / n) * Math.PI * 2;
      m.position.set(R * Math.sin(theta), 0, R * Math.cos(theta));
      m.rotation.y = theta;
      m.visible = false;
      ring.add(m);
      cards.push(m);
      mats.push(mat);
    }

    built = { renderer, scene, camera, ring, cards, mats };
  } catch {
    built = null;
  }

  let W = 1;
  let H = 1;
  let navH = 56;
  let barH = 128;

  function measure() {
    const r = root.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    navH = Math.round(Math.min(64, Math.max(48, H * 0.072)));
    const narrow = W <= 720;
    barH = Math.round(narrow ? Math.min(220, Math.max(165, H * 0.24)) : Math.min(176, Math.max(112, H * 0.185)));
    root.style.setProperty('--hrh-nav', `${navH}px`);
    root.style.setProperty('--hrh-bar', `${barH}px`);
    if (built) {
      built.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      built.renderer.setSize(W, H, false);
      built.camera.aspect = W / H;
    }
  }

  function framings() {
    const aspect = W / H;
    const frac = aspect > 1.2 ? 0.5 : aspect > 0.8 ? 0.66 : 0.8;
    const vfovOut = 30;
    const tv = Math.tan(((vfovOut / 2) * Math.PI) / 180);
    const halfW = (2 * R) / frac / 2;
    let D = halfW / (aspect * tv);
    D = Math.max(D, (R * 1.35) / tv);
    const el = (37 * Math.PI) / 180;
    const outside = {
      px: 0,
      py: D * Math.sin(el),
      pz: D * Math.cos(el),
      tx: aspect > 1.2 ? 0.1 : 0,
      ty: -0.04,
      tz: 0,
      vfov: vfovOut,
      roll: 0.13
    };
    const insetH = Math.max(1, H - navH - barH);
    const insetAspect = W / insetH;
    const hfov = 128;
    const th = Math.tan(((hfov / 2) * Math.PI) / 180);
    const tvIn = Math.min(th / Math.max(0.3, insetAspect), 0.85);
    const vInFull = (2 * Math.atan(tvIn * (H / insetH)) * 180) / Math.PI;
    const inside = {
      px: 0,
      py: 0,
      pz: 0.12 * R,
      tx: 0,
      ty: 0,
      tz: -R,
      vfov: Math.min(160, vInFull),
      roll: 0
    };
    return { outside, inside };
  }

  measure();
  let frame = framings();

  let ready = false;
  let startTime = performance.now();

  const cardImgs = CARDS.map(loadImage);
  const timeoutCap = new Promise((r) => setTimeout(() => r(null), 4000));

  Promise.race([Promise.all(cardImgs), timeoutCap]).then(async () => {
    if (built) {
      const maxAniso = built.renderer.capabilities.getMaxAnisotropy();
      for (let k = 0; k < n; k++) {
        const img = await Promise.race([cardImgs[k], Promise.resolve(null)]);
        const tex = new THREE.CanvasTexture(cardCanvas(img));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, maxAniso);
        built.mats[k].map = tex;
        built.mats[k].needsUpdate = true;
      }
    }
    ready = true;
    startTime = performance.now();
  });

  // Drag to spin
  let drag = 0;
  let vel = 0;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;

  function clock() {
    if (!ready) return 0;
    if (reduced) return T.end + 2;
    return (performance.now() - startTime) / 1000;
  }

  sceneEl.addEventListener('pointerdown', (e) => {
    if (reduced || clock() < T.idle) return;
    dragging = true;
    lastX = e.clientX;
    lastT = performance.now();
    vel = 0;
    sceneEl.setPointerCapture(e.pointerId);
    sceneEl.setAttribute('data-drag', '');
  });

  sceneEl.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    const d = (dx / Math.max(320, W)) * 2.4;
    drag += d;
    vel = d / Math.max(8, now - lastT);
    lastX = e.clientX;
    lastT = now;
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    sceneEl.removeAttribute('data-drag');
    if (sceneEl.hasPointerCapture(e.pointerId)) sceneEl.releasePointerCapture(e.pointerId);
  }

  sceneEl.addEventListener('pointerup', endDrag);
  sceneEl.addEventListener('pointercancel', endDrag);

  const letters = markEl ? Array.from(markEl.querySelectorAll('[data-l]')) : [];
  const extras = markEl ? Array.from(markEl.querySelectorAll('[data-x]')) : [];
  const cols = countEl ? Array.from(countEl.querySelectorAll('[data-c]')) : [];
  const navItems = navEl ? Array.from(navEl.querySelectorAll('[data-n]')) : [];
  const lines = barEl ? Array.from(barEl.querySelectorAll('[data-line]')) : [];
  const unders = barEl ? Array.from(barEl.querySelectorAll('[data-u]')) : [];
  const statEls = barEl ? Array.from(barEl.querySelectorAll('[data-s]')) : [];

  let raf = 0;
  let visible = true;
  let lastFrame = performance.now();

  function draw() {
    raf = 0;
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    const t = clock();

    if (markEl) {
      const big = Math.min(62, Math.max(32, W * 0.036));
      const small = W < 480 ? 15 : 16;
      const k = easeInOut3(span(t, T.shrink));
      const fs = lerp(big, small, k);
      markEl.style.fontSize = `${fs.toFixed(2)}px`;
      const topBig = Math.round(H * 0.045);
      const topNav = (navH - small) / 2 - small * 0.06;
      markEl.style.top = `${lerp(topBig, topNav, k).toFixed(2)}px`;

      letters.forEach((el, i) => {
        const p = easeOut3(clamp01((t - T.markIn[0] - i * 0.075) / 0.4));
        el.style.transform = `translateY(${((1 - p) * 110).toFixed(1)}%)`;
      });

      extras.forEach((el, i) => {
        const p = easeOut3(clamp01((t - T.suffix[0] - i * 0.03) / 0.28));
        el.style.transform = `translateY(${((1 - p) * 110).toFixed(1)}%)`;
        const box = el.parentElement;
        if (box) box.style.maxWidth = p >= 1 ? 'none' : `${(p * 1.1).toFixed(3)}em`;
      });

      root.style.setProperty('--hrh-markw', `${Math.round(markEl.offsetWidth)}px`);
    }

    if (countEl) {
      const c = countAt(t);
      const rise = easeOut3(span(t, T.countRise));
      const out = span(t, T.countOut);
      countEl.style.opacity = (rise * (1 - out)).toFixed(3);
      countEl.style.transform = `translateY(${((1 - rise) * 40 + out * -12).toFixed(1)}px)`;
      countEl.style.visibility = out >= 1 || t <= 0 ? 'hidden' : 'visible';
      cols.forEach((el, i) => {
        el.style.transform = `translateY(${(-odometer(c, 2 - i) * (100 / 11)).toFixed(3)}%)`;
      });
    }

    const skyK = easeOut3(span(t, T.sky));
    if (skyEl) skyEl.style.opacity = skyK.toFixed(3);
    if (coverEl) coverEl.style.opacity = (1 - skyK).toFixed(3);

    const fk = easeOut3(span(t, T.frame));
    const side = Math.round(lerp(0, W <= 720 ? 8 : 14, fk));
    sceneEl.style.clipPath = `inset(${lerp(0, navH, fk).toFixed(1)}px ${side}px ${lerp(0, barH, fk).toFixed(1)}px ${side}px round ${lerp(0, 16, fk).toFixed(1)}px)`;

    // PORTAFOLIO surge desde abajo hacia arriba durante el zoom/dive (t = 2.15 -> 3.35)
    if (wordRiseEl) {
      const wp = easeOut3(span(t, [2.15, 3.35]));
      wordRiseEl.style.opacity = (wp * 0.96).toFixed(3);
      wordRiseEl.style.transform = `translate(-50%, ${((1 - wp) * 95).toFixed(1)}%)`;
    }

    if (t >= T.idle && !reduced) sceneEl.setAttribute('data-live', '');
    else sceneEl.removeAttribute('data-live');

    navItems.forEach((el, i) => {
      const p = easeOut3(clamp01((t - T.links[0] - i * 0.05) / 0.3));
      if (p >= 1) {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.visibility = '';
        el.setAttribute('data-done', '');
        return;
      }
      el.removeAttribute('data-done');
      el.style.opacity = (p * 0.78).toFixed(3);
      el.style.transform = `translateY(${((1 - p) * 8).toFixed(1)}px)`;
      el.style.visibility = p > 0 ? 'visible' : 'hidden';
    });

    lines.forEach((el, i) => {
      const p = easeOut3(span(t, i === 0 ? T.line1 : T.line2));
      el.style.transform = `translateY(${((1 - p) * 105).toFixed(1)}%)`;
    });

    unders.forEach((el, i) => {
      const p = easeInOut3(clamp01((t - T.underline[0] - i * 0.08) / 0.4));
      el.style.backgroundSize = `${(p * 100).toFixed(1)}% 1px`;
      const sup = el.firstElementChild;
      if (sup) sup.style.opacity = (p * 0.65).toFixed(3);
    });

    statEls.forEach((el, i) => {
      const st = STATS[i];
      if (!st) return;
      const p = easeOut3(span(t, T.stats));
      const shown = span(t, [T.stats[0] - 0.12, T.stats[0] + 0.1]);
      const num = el.querySelector('b');
      if (num) num.textContent = (st.value * p).toFixed(st.decimals) + st.suffix;
      el.style.opacity = shown.toFixed(3);
      el.style.transform = `translateY(${((1 - shown) * 8).toFixed(1)}px)`;
    });

    if (built) {
      const { renderer, scene, camera, ring, cards: meshes, mats } = built;
      if (!dragging) {
        drag += vel * dt * 1000;
        vel *= Math.pow(0.0025, dt);
      }
      ring.rotation.y = ringYaw(reduced ? 0 : t, slot) + drag;
      const cam = cameraAt(t, frame.outside, frame.inside);
      ring.rotation.z = cam.roll;
      camera.fov = cam.vfov;
      camera.position.set(cam.px, cam.py, cam.pz);
      camera.lookAt(cam.tx, cam.ty, cam.tz);

      const centre = lerp(H / 2, (navH + (H - barH)) / 2, fk);
      camera.setViewOffset(W, H, 0, H / 2 - centre, W, H);
      camera.updateProjectionMatrix();

      for (let k = 0; k < meshes.length; k++) {
        const p = cardShown(t, k, meshes.length);
        const m = meshes[k];
        m.visible = p > 0;
        if (!m.visible) continue;
        const s = lerp(0.55, 1, easeOutBack(p));
        m.scale.set(s, s, s);
        m.rotation.x = 0;
        m.rotation.z = (1 - easeOut3(p)) * -0.32;
        mats[k].opacity = Math.min(1, p * 3);
        m.position.y = (1 - easeOut3(p)) * -0.08;
      }
      renderer.render(scene, camera);
    }

    const moving = !reduced && (t < T.end + 1 || dragging || Math.abs(vel) > 1e-5 || t >= T.idle);
    if (visible && (moving || !ready)) raf = requestAnimationFrame(draw);
  }

  function kick() {
    if (!raf && visible) {
      lastFrame = performance.now();
      raf = requestAnimationFrame(draw);
    }
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      drag = 0;
      vel = 0;
      startTime = performance.now();
      kick();
    });
  }

  const ro = new ResizeObserver(() => {
    measure();
    frame = framings();
    if (!raf) draw();
  });
  ro.observe(root);

  const io = new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible) kick();
  });
  io.observe(root);

  kick();
})();
