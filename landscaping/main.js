/* ============================================================
   Verdara — 3D scroll experience
   A procedural low-poly garden valley. The camera walks the
   valley as the page scrolls; light moves from dawn to dusk.
   ============================================================ */

import * as THREE from "./vendor/three.module.min.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PHASES = 5; // camera keyframes span data-phase 0..5

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------ utilities */

// Deterministic value noise + fBm (no deps)
function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}
function smooth(t) { return t * t * (3 - 2 * t); }
function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash2(xi, yi), b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  const u = smooth(xf), v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) {
  let value = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < 4; i++) {
    value += amp * valueNoise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2.1;
  }
  return value;
}
const lerp = (a, b, t) => a + (b - a) * t;

/* ------------------------------------------------ scene setup */

const canvas = document.getElementById("scene");
let renderer = null;

try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
} catch (e) {
  canvas.style.display = "none";
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 400);

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  scene.fog = new THREE.Fog(0xd7ecf5, 45, 190);
}

/* Lights (values are driven per-frame by the phase mixer) */
const hemiLight = new THREE.HemisphereLight(0xbfd8e8, 0x9db98a, 1.0);
const sunLight = new THREE.DirectionalLight(0xfff2cc, 2.2);
const fillLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(hemiLight, sunLight, fillLight);

/* ------------------------------------------------ the valley */

// Winding footpath through the valley (used to flatten terrain + place stones)
const pathCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(2, 0, 36),
  new THREE.Vector3(-5, 0, 20),
  new THREE.Vector3(5, 0, 4),
  new THREE.Vector3(-4, 0, -14),
  new THREE.Vector3(4, 0, -30),
  new THREE.Vector3(-2, 0, -46),
]);
const pathSamples = pathCurve.getSpacedPoints(220);

function distToPath(x, z) {
  let min = Infinity;
  for (let i = 0; i < pathSamples.length; i += 4) {
    const dx = pathSamples[i].x - x, dz = pathSamples[i].z - z;
    const d = dx * dx + dz * dz;
    if (d < min) min = d;
  }
  return Math.sqrt(min);
}

function terrainHeight(x, z) {
  let h = fbm(x * 0.035 + 7.3, z * 0.035 + 2.1) * 14 - 5.2;
  h += fbm(x * 0.12, z * 0.12) * 1.6; // fine detail
  const rim = Math.max(0, (Math.abs(x) - 34) * 0.28) + Math.max(0, (Math.abs(z + 6) - 46) * 0.22);
  h += rim * rim * 0.28; // valley walls rise at the edges
  const d = distToPath(x, z);
  const flatten = smooth(Math.min(1, Math.max(0, (d - 2.2) / 7)));
  return lerp(Math.min(h, 0.25), h, flatten); // meadow floor near the path
}

function buildWorld() {
  /* --- terrain --- */
  const size = 190, segs = 150;
  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const grassLow = new THREE.Color(0x649355);
  const grassHigh = new THREE.Color(0x447540);
  const earth = new THREE.Color(0x8c8266);
  const pale = new THREE.Color(0xa3b075);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i) - 8;
    const h = terrainHeight(x, z);
    pos.setY(i, h);
    pos.setZ(i, z);
    const n = fbm(x * 0.2 + 40, z * 0.2 + 40);
    if (h > 6) c.copy(grassHigh).lerp(earth, smooth(Math.min(1, (h - 6) / 7)));
    else c.copy(grassLow).lerp(grassHigh, smooth(Math.min(1, Math.max(0, h / 6))));
    c.lerp(pale, n * 0.35); // sun-dried patches
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const terrain = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })
  );
  scene.add(terrain);

  /* --- footpath stones --- */
  const stoneGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.18, 6);
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xcfc6b4, flatShading: true, roughness: 0.9 });
  const stones = new THREE.InstancedMesh(stoneGeo, stoneMat, 110);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  for (let i = 0; i < 110; i++) {
    const t = i / 109;
    const p = pathCurve.getPointAt(t);
    const jx = (hash2(i, 3) - 0.5) * 1.2, jz = (hash2(i, 7) - 0.5) * 1.2;
    const x = p.x + jx, z = p.z + jz;
    const y = terrainHeight(x, z) + 0.05;
    q.setFromEuler(new THREE.Euler(0, hash2(i, 11) * Math.PI, 0));
    s.setScalar(0.8 + hash2(i, 13) * 0.5);
    m.compose(new THREE.Vector3(x, y, z), q, s);
    stones.setMatrixAt(i, m);
  }
  scene.add(stones);

  /* --- trees: conifers (trunk + two cones) and broadleafs (trunk + blob) --- */
  const TREES = 90;
  const placements = [];
  let guard = 0;
  while (placements.length < TREES && guard++ < 4000) {
    const x = (hash2(guard, 1.7) - 0.5) * 150;
    const z = (hash2(guard, 9.2) - 0.5) * 150 - 8;
    const d = distToPath(x, z);
    if (d < 5.5 || d > 55) continue; // keep the walk clear, hug the valley
    const y = terrainHeight(x, z);
    if (y > 10) continue;
    placements.push({ x, y, z, r: hash2(guard, 4.4) });
  }

  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.26, 1.6, 5);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4f2e, flatShading: true, roughness: 1 });
  const coneGeo = new THREE.ConeGeometry(1.15, 2.6, 6);
  const coneMat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 });
  const blobGeo = new THREE.IcosahedronGeometry(1.25, 0);
  const blobMat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 });

  const conifers = placements.filter((p) => p.r < 0.55);
  const broadleafs = placements.filter((p) => p.r >= 0.55);

  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, placements.length);
  const cones = new THREE.InstancedMesh(coneGeo, coneMat, conifers.length * 2);
  const blobs = new THREE.InstancedMesh(blobGeo, blobMat, broadleafs.length);
  const greenA = new THREE.Color(0x2f6b3a);
  const greenB = new THREE.Color(0x55953f);
  const greenC = new THREE.Color(0x7aa83f);
  const tint = new THREE.Color();

  let ti = 0, ci = 0, bi = 0;
  for (const p of placements) {
    const sc = 0.8 + hash2(p.x, p.z) * 0.9;
    q.setFromEuler(new THREE.Euler(0, p.r * Math.PI * 2, (hash2(p.z, p.x) - 0.5) * 0.08));
    m.compose(new THREE.Vector3(p.x, p.y + 0.7 * sc, p.z), q, s.setScalar(sc));
    trunks.setMatrixAt(ti++, m);
    if (p.r < 0.55) {
      tint.copy(greenA).lerp(greenB, hash2(p.x * 2, p.z));
      for (let k = 0; k < 2; k++) {
        m.compose(
          new THREE.Vector3(p.x, p.y + (1.9 + k * 1.25) * sc, p.z),
          q,
          s.setScalar(sc * (1 - k * 0.32))
        );
        cones.setMatrixAt(ci, m);
        cones.setColorAt(ci++, tint);
      }
    } else {
      tint.copy(greenB).lerp(greenC, hash2(p.x, p.z * 2));
      m.compose(new THREE.Vector3(p.x, p.y + 2.1 * sc, p.z), q, s.setScalar(sc));
      blobs.setMatrixAt(bi, m);
      blobs.setColorAt(bi++, tint);
    }
  }
  scene.add(trunks, cones, blobs);

  /* --- shrubs & flowers near the path --- */
  const shrubGeo = new THREE.IcosahedronGeometry(0.45, 0);
  const shrubMat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1 });
  const shrubs = new THREE.InstancedMesh(shrubGeo, shrubMat, 140);
  const flowerGeo = new THREE.ConeGeometry(0.12, 0.3, 5);
  const flowerMat = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.7 });
  const flowers = new THREE.InstancedMesh(flowerGeo, flowerMat, 160);
  const flowerColors = [new THREE.Color(0xd97706), new THREE.Color(0xe9c46a), new THREE.Color(0xc74b50), new THREE.Color(0xe7e0d0)];

  for (let i = 0; i < 140; i++) {
    const t = hash2(i, 21);
    const p = pathCurve.getPointAt(t);
    const ang = hash2(i, 23) * Math.PI * 2;
    const rad = 2.5 + hash2(i, 27) * 9;
    const x = p.x + Math.cos(ang) * rad, z = p.z + Math.sin(ang) * rad;
    const y = terrainHeight(x, z);
    if (y > 5) continue;
    tint.copy(greenB).lerp(greenC, hash2(i, 31));
    m.compose(
      new THREE.Vector3(x, y + 0.25, z),
      q.setFromEuler(new THREE.Euler(0, ang, 0)),
      s.setScalar(0.7 + hash2(i, 33) * 1.1)
    );
    shrubs.setMatrixAt(i, m);
    shrubs.setColorAt(i, tint);
  }
  for (let i = 0; i < 160; i++) {
    const t = hash2(i, 41);
    const p = pathCurve.getPointAt(t);
    const ang = hash2(i, 43) * Math.PI * 2;
    const rad = 1.8 + hash2(i, 47) * 6;
    const x = p.x + Math.cos(ang) * rad, z = p.z + Math.sin(ang) * rad;
    const y = terrainHeight(x, z);
    if (y > 4) continue;
    m.compose(new THREE.Vector3(x, y + 0.18, z), q.setFromEuler(new THREE.Euler(0, ang, 0)), s.setScalar(1));
    flowers.setMatrixAt(i, m);
    flowers.setColorAt(i, flowerColors[i % flowerColors.length]);
  }
  scene.add(shrubs, flowers);

  /* --- drifting pollen + dusk fireflies --- */
  scene.userData.pollen = makeParticles(180, 0xfff7d6, 0.3, 0.5);
  scene.userData.fireflies = makeParticles(120, 0xffd166, 0.55, 0.0);
  scene.add(scene.userData.pollen.points, scene.userData.fireflies.points);
}

let discTex = null;
function discTexture() {
  if (discTex) return discTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  discTex = new THREE.CanvasTexture(c);
  return discTex;
}

function makeParticles(count, color, size, opacity) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const t = hash2(i, 51);
    const p = pathCurve.getPointAt(t);
    positions[i * 3] = p.x + (hash2(i, 53) - 0.5) * 26;
    positions[i * 3 + 1] = 1 + hash2(i, 57) * 7;
    positions[i * 3 + 2] = p.z + (hash2(i, 59) - 0.5) * 26;
    seeds[i] = hash2(i, 61) * Math.PI * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color, size, transparent: true, opacity, map: discTexture(),
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  return { points: new THREE.Points(g, mat), seeds, base: positions.slice() };
}

if (renderer) buildWorld();

/* ------------------------------------------------ light phases (dawn → dusk) */

const phases = [
  { sky: 0xd8eef6, fog: 0xd8eef6, sun: 0xfff2cc, sunI: 2.2, hemiSky: 0xbfd8e8, hemiGround: 0x9db98a, hemiI: 1.05, sunPos: [45, 55, 50], exposure: 1.12 },
  { sky: 0xccebf7, fog: 0xccebf7, sun: 0xffffff, sunI: 2.6, hemiSky: 0xcde9f5, hemiGround: 0xa4c18d, hemiI: 1.1, sunPos: [15, 65, 25], exposure: 1.15 },
  { sky: 0xd6eecf, fog: 0xd8eecd, sun: 0xfff0b8, sunI: 2.4, hemiSky: 0xc6e3cd, hemiGround: 0xa0bd85, hemiI: 1.0, sunPos: [-25, 48, 12], exposure: 1.12 },
  { sky: 0xf6dcab, fog: 0xf3d9a8, sun: 0xffc46b, sunI: 2.2, hemiSky: 0xf0d9ae, hemiGround: 0x97a86f, hemiI: 0.85, sunPos: [-48, 24, -8], exposure: 1.1 },
  { sky: 0xeeb488, fog: 0xe8ad84, sun: 0xff9950, sunI: 1.7, hemiSky: 0xe5b28d, hemiGround: 0x7d8a60, hemiI: 0.7, sunPos: [-52, 11, -22], exposure: 1.05 },
  { sky: 0x374a6b, fog: 0x40536f, sun: 0x8aa7d6, sunI: 0.55, hemiSky: 0x51648a, hemiGround: 0x3d4a3f, hemiI: 0.55, sunPos: [-30, 18, -40], exposure: 0.98 },
];

const colA = new THREE.Color(), colB = new THREE.Color();

function mixPhase(t) {
  const clamped = Math.min(Math.max(t, 0), PHASES);
  const i = Math.min(Math.floor(clamped), PHASES - 1);
  const f = smooth(clamped - i);
  const a = phases[i], b = phases[i + 1];

  scene.background = scene.background || new THREE.Color();
  scene.background.copy(colA.set(a.sky)).lerp(colB.set(b.sky), f);
  if (scene.fog) scene.fog.color.copy(colA.set(a.fog)).lerp(colB.set(b.fog), f);

  sunLight.color.copy(colA.set(a.sun)).lerp(colB.set(b.sun), f);
  sunLight.intensity = lerp(a.sunI, b.sunI, f);
  sunLight.position.set(
    lerp(a.sunPos[0], b.sunPos[0], f),
    lerp(a.sunPos[1], b.sunPos[1], f),
    lerp(a.sunPos[2], b.sunPos[2], f)
  );
  hemiLight.color.copy(colA.set(a.hemiSky)).lerp(colB.set(b.hemiSky), f);
  hemiLight.groundColor.copy(colA.set(a.hemiGround)).lerp(colB.set(b.hemiGround), f);
  hemiLight.intensity = lerp(a.hemiI, b.hemiI, f);
  if (renderer) renderer.toneMappingExposure = lerp(a.exposure, b.exposure, f);

  // fireflies wake up as dusk falls, pollen goes to sleep
  const dusk = smooth(Math.min(Math.max((clamped - 3.4) / 1.4, 0), 1));
  if (scene.userData.fireflies) scene.userData.fireflies.points.material.opacity = dusk * 0.95;
  if (scene.userData.pollen) scene.userData.pollen.points.material.opacity = (1 - dusk) * 0.5;
}

/* ------------------------------------------------ camera rig */

const camPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 6.5, 40),    // hero — wide vista at the valley mouth
  new THREE.Vector3(-11, 5, 20),    // services — drift left between the trees
  new THREE.Vector3(9, 4.5, 4),     // process — cross the path, low and close
  new THREE.Vector3(-7, 3.6, -12),  // work — glide along the meadow floor
  new THREE.Vector3(5, 8, -26),     // voices — rise over the far grove
  new THREE.Vector3(0, 17, -14),    // contact — lift high above the valley at dusk
], false, "catmullrom", 0.35);

const lookPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 3.5, 4),
  new THREE.Vector3(2, 2.5, -2),
  new THREE.Vector3(-3, 2, -16),
  new THREE.Vector3(3, 2.2, -28),
  new THREE.Vector3(-2, 1.5, -40),
  new THREE.Vector3(0, -1, -44),
], false, "catmullrom", 0.35);

let scrollProgress = 0;       // raw, from ScrollTrigger
let easedProgress = 0;        // smoothed for the camera
const mouse = { x: 0, y: 0, ex: 0, ey: 0 };
const lookTarget = new THREE.Vector3();

addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / innerHeight - 0.5) * 2;
}, { passive: true });

function placeCamera(p) {
  const t = Math.min(Math.max(p, 0), 1);
  camPath.getPointAt(t, camera.position);
  lookPath.getPointAt(t, lookTarget);
  // gentle mouse parallax (never on reduced motion)
  if (!prefersReducedMotion) {
    mouse.ex = lerp(mouse.ex, mouse.x, 0.04);
    mouse.ey = lerp(mouse.ey, mouse.y, 0.04);
    camera.position.x += mouse.ex * 0.9;
    camera.position.y += -mouse.ey * 0.5;
  }
  camera.lookAt(lookTarget);
}

/* ------------------------------------------------ render loop */

const clock = new THREE.Clock();
let running = true;

document.addEventListener("visibilitychange", () => { running = !document.hidden; });

function animate() {
  requestAnimationFrame(animate);
  if (!renderer || !running) return;

  const t = clock.getElapsedTime();
  easedProgress = prefersReducedMotion ? scrollProgress : lerp(easedProgress, scrollProgress, 0.065);

  placeCamera(easedProgress);
  mixPhase(easedProgress * PHASES);

  if (!prefersReducedMotion) {
    drift(scene.userData.pollen, t, 0.4, 0.35);
    drift(scene.userData.fireflies, t, 0.9, 0.8);
  }

  renderer.render(scene, camera);
}

function drift(sys, t, speed, amp) {
  if (!sys) return;
  const posAttr = sys.points.geometry.attributes.position;
  const arr = posAttr.array, base = sys.base, seeds = sys.seeds;
  for (let i = 0; i < seeds.length; i++) {
    const k = i * 3, sd = seeds[i];
    arr[k] = base[k] + Math.sin(t * speed + sd) * amp;
    arr[k + 1] = base[k + 1] + Math.sin(t * speed * 0.8 + sd * 2) * amp * 0.6;
    arr[k + 2] = base[k + 2] + Math.cos(t * speed * 0.6 + sd) * amp;
  }
  posAttr.needsUpdate = true;
}

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer?.setSize(innerWidth, innerHeight);
});

/* ------------------------------------------------ scroll wiring */

ScrollTrigger.create({
  trigger: document.body,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => {
    scrollProgress = self.progress;
    const thumb = document.getElementById("progressThumb");
    if (thumb) thumb.style.height = `${self.progress * 100}%`;
  },
});

/* Nav condenses once the hero is left behind */
const nav = document.getElementById("nav");
ScrollTrigger.create({
  start: "top -60",
  onUpdate: (self) => nav.classList.toggle("is-scrolled", self.scroll() > 60),
});

/* Section content reveals */
if (!prefersReducedMotion) {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 42,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" },
    });
  });
} else {
  // content must simply be visible — no motion
  gsap.set(".reveal", { clearProps: "all" });
}

/* Stat counters */
gsap.utils.toArray(".stat-num").forEach((el) => {
  const target = Number(el.dataset.count);
  if (prefersReducedMotion) { el.textContent = target; return; }
  const counter = { v: 0 };
  gsap.to(counter, {
    v: target,
    duration: 1.8,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 88%" },
    onUpdate: () => { el.textContent = Math.round(counter.v); },
  });
});

/* ------------------------------------------------ intro & loader */

const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loaderBar");
let fakeProgress = 0;
const loadTick = setInterval(() => {
  fakeProgress = Math.min(fakeProgress + Math.random() * 22, 92);
  loaderBar.style.width = `${fakeProgress}%`;
}, 120);

function heroIntro() {
  if (prefersReducedMotion) return;
  gsap.timeline({ delay: 0.15 })
    .from(".hero-title .line > span", {
      yPercent: 115,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.14,
    })
    .from(".scroll-cue", { opacity: 0, y: -10, duration: 0.8, ease: "power2.out" }, "-=0.4");
}

function dismissLoader() {
  clearInterval(loadTick);
  loaderBar.style.width = "100%";
  setTimeout(() => {
    loader.classList.add("is-done");
    heroIntro();
    ScrollTrigger.refresh();
  }, 350);
}

Promise.race([
  Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 400))]),
  new Promise((r) => setTimeout(r, 2200)), // never trap the user on the loader
]).then(dismissLoader);

if (renderer) {
  mixPhase(0);
  placeCamera(0);
  animate();
} else {
  document.getElementById("canvasFallback").style.zIndex = "0";
}

/* ------------------------------------------------ contact form */

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("f-name");
const emailInput = document.getElementById("f-email");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

function setError(input, id, msg) {
  const err = document.getElementById(id);
  err.textContent = msg;
  input.closest(".field").classList.toggle("has-error", Boolean(msg));
  input.setAttribute("aria-invalid", msg ? "true" : "false");
}

function validateName() {
  const ok = nameInput.value.trim().length >= 2;
  setError(nameInput, "err-name", ok ? "" : "Please tell us your name so we know who to greet.");
  return ok;
}
function validateEmail() {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  setError(emailInput, "err-email", ok ? "" : "That email doesn't look complete — check for a typo.");
  return ok;
}

nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const okName = validateName();
  const okEmail = validateEmail();
  if (!okName) { nameInput.focus(); return; }
  if (!okEmail) { emailInput.focus(); return; }

  submitBtn.classList.add("is-loading");
  submitBtn.setAttribute("disabled", "true");
  formStatus.textContent = "";

  // Demo site: simulate the request, then confirm.
  setTimeout(() => {
    submitBtn.classList.remove("is-loading");
    submitBtn.removeAttribute("disabled");
    formStatus.textContent = "Thank you — we'll walk your land with you soon.";
    form.reset();
  }, 1200);
});
