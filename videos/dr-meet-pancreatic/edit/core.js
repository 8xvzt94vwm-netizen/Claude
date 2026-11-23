// Core of the compositor: one paused GSAP master timeline + procedural "ticks",
// both pure functions of time, so any frame can be rendered in any order.
const FPS = 30;
const DUR = 170.4;
const tl = gsap.timeline({ paused: true });
const ticks = [];
const SVGNS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = {
  io: k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  out: k => 1 - Math.pow(1 - k, 3),
  in: k => k * k * k,
};
const prog = (t, a, b) => clamp((t - a) / (b - a));

// ----------------------------------------------------------------------------
// Footage. Each shot of the source keeps its own framing; at every cut the
// punch-in alternates (wide <-> tight) so jump cuts read as camera changes, and a
// slow push keeps static talking-head shots alive.
// [startSec, endSec, zoomStart, zoomEnd, xShift, yShift]
const SHOTS = [
  [0.000, 15.433, 1.20, 1.25, 0, 0],      // cinematic opening (book -> chair -> desk)
  [15.433, 21.60, 1.30, 1.36, 0, 0],      // medium close
  [26.90, 35.50, 1.22, 1.28, 0, 0],
  [56.40, 59.60, 1.36, 1.40, 0, 0],
  [70.60, 72.467, 1.24, 1.27, 0, 0],
  [72.467, 74.533, 1.20, 1.22, 40, 0],    // side angle
  [74.533, 82.133, 1.34, 1.38, 60, 0],
  [82.133, 88.000, 1.21, 1.25, 40, 0],
  [88.000, 94.90, 1.30, 1.35, 0, 0],
  [108.10, 114.30, 1.24, 1.29, 0, 0],
  [119.50, 127.90, 1.28, 1.34, 0, 0],
  [135.167, 141.200, 1.23, 1.27, 0, 0],
  [141.200, 146.433, 1.36, 1.40, 0, 0],
  [146.433, 152.633, 1.25, 1.29, 0, 0],
  [152.633, 159.40, 1.20, 1.27, 0, 0],    // wide closing shot
  [167.10, 170.40, 1.30, 1.34, 0, 0],
];
const SETTLE = [15.433, 72.467, 74.533, 82.133, 88.000, 141.200, 146.433, 152.633];
function shotAt(t) {
  for (const s of SHOTS) if (t >= s[0] && t < s[1]) return s;
  // between shots (under a scene transition): borrow the nearest shot's framing
  let best = null, bd = 1e9;
  for (const s of SHOTS) { const d = t < s[0] ? s[0] - t : t - s[1]; if (d < bd) { bd = d; best = s; } }
  return best;
}

// Scenes register the spans where they fully cover the frame, so footage frames
// are not decoded needlessly.
const covered = [];
function isCovered(t) { return covered.some(([a, b]) => t >= a && t <= b); }

const docImg = $('#doc');
let docSrc = '';
async function updateDoc(t) {
  const s = shotAt(t);
  const fr = Math.min(5111, Math.max(0, Math.round(t * FPS)));
  if (!s || isCovered(t)) { docImg.style.visibility = 'hidden'; return; }
  docImg.style.visibility = 'visible';
  const k = ease.io(prog(t, s[0], s[1]));
  let z = lerp(s[2], s[3], k);
  if (SETTLE.includes(s[0])) z *= 1 + 0.035 * (1 - ease.out(prog(t, s[0], s[0] + 0.55)));
  docImg.style.transform = `translate(${s[4]}px, ${s[5]}px) scale(${z})`;
  const src = `${window.DOCFRAMES}/${String(fr).padStart(5, '0')}.jpg`;
  if (src !== docSrc) {
    docSrc = src; docImg.src = src;
    try { await docImg.decode(); } catch (e) { console.log('decode fail', src); }
  }
}
window.DOCFRAMES = new URLSearchParams(location.search).get('frames') || '../frames';

window.seek = async t => {
  tl.time(t, false);
  for (const f of ticks) f(t);
  await updateDoc(t);
};

// ----------------------------------------------------------------------------
// helpers
function el(tag, attrs = {}, parent) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'html') e.innerHTML = v; else if (k === 'style') e.style.cssText = v; else e.setAttribute(k, v);
  }
  if (parent) parent.appendChild(e);
  return e;
}
function sel(root, s) { return root.querySelector(s); }

// Scene container with an enter/exit transition. The panel "rises" into the full
// frame (rounded card expanding from the caption panel) and leaves by easing back
// with a soft zoom so the cut to the doctor never feels abrupt.
function scene(id, t0, t1, opt = {}) {
  const root = el('div', { class: 'scene', id }, $('#scenes'));
  const inner = el('div', { class: 'layer inner' }, root);
  el('div', { class: 'vig' }, root);
  const tin = opt.tin ?? 0.55, tout = opt.tout ?? 0.6;
  tl.set(root, { visibility: 'visible' }, t0 - tin);
  if (opt.enter === 'fade') {
    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: tin, ease: 'power2.out', immediateRender: false }, t0 - tin);
  } else if (opt.enter !== 'none') {
    tl.fromTo(root, { clipPath: 'inset(54% 6% 24% 6% round 48px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: tin, ease: 'power3.inOut', immediateRender: false }, t0 - tin);
    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: tin * .3, ease: 'power1.out', immediateRender: false }, t0 - tin);
    tl.fromTo(inner, { scale: 1.08, y: 60 }, { scale: 1, y: 0, duration: tin + .3, ease: 'power3.out', immediateRender: false }, t0 - tin);
  } else {
    tl.set(root, { opacity: 1 }, t0 - tin);
  }
  if (opt.exit === 'none') {
    tl.set(root, { opacity: 0, visibility: 'hidden' }, t1);
    covered.push([t0 + 0.02, t1 + 0.01]);
  } else {
    // mirror of the entry: the frame folds back into the caption panel
    const te = t1 - tout * 0.6;
    tl.fromTo(root, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(54% 6% 24% 6% round 48px)', duration: tout, ease: 'power3.inOut', immediateRender: false }, te);
    tl.fromTo(inner, { scale: 1, y: 0 }, { scale: .94, y: 70, duration: tout, ease: 'power3.inOut', immediateRender: false }, te);
    tl.to(root, { opacity: 0, duration: tout * .4, ease: 'power1.in' }, te + tout * .6);
    tl.set(root, { visibility: 'hidden' }, te + tout + .02);
  }
  if (opt.exit !== 'none') covered.push([t0 + 0.02, t1 - tout * 0.6 - 0.02]);
  return inner;
}

function shades(root, top = true, bot = true) {
  if (top) el('div', { class: 'topShade' }, root);
  if (bot) el('div', { class: 'botShade' }, root);
}
function svgEl(parent, w = 1080, h = 1920, vb = `0 0 ${w} ${h}`) {
  const s = document.createElementNS(SVGNS, 'svg');
  s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('viewBox', vb);
  s.style.position = 'absolute'; s.style.left = '0'; s.style.top = '0'; s.style.overflow = 'visible';
  parent.appendChild(s);
  return s;
}

// Text reveal used by titles: words rise in, staggered.
function words(html) {
  // wraps plain words in spans while keeping <span class="hl"> groups intact
  const tmp = document.createElement('div'); tmp.innerHTML = html;
  const out = [];
  tmp.childNodes.forEach(n => {
    if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(w => { if (w.trim()) out.push(`<span class="w">${w}</span>`); else if (w) out.push(' '); });
    else out.push(`<span class="w ${n.className || ''}">${n.innerHTML}</span>`);
  });
  return out.join('');
}
function revealWords(container, t, stagger = 0.06, dur = 0.5) {
  const ws = container.querySelectorAll('.w');
  ws.forEach((w, i) => tl.fromTo(w, { opacity: 0, y: 26, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: dur, ease: 'power3.out', immediateRender: true }, t + i * stagger));
}
function hideEl(e, t, dur = 0.35) { tl.to(e, { opacity: 0, y: -14, duration: dur, ease: 'power2.in' }, t); }

// Title block inside a scene
function titleBlock(root, t, kicker, title, opt = {}) {
  const top = opt.top ?? 330;
  const k = kicker ? el('div', { class: 'kicker', html: kicker, style: `top:${top}px` }, root) : null;
  const ti = el('div', { class: 'title', html: words(title), style: `top:${top + 44}px;${opt.size ? 'font-size:' + opt.size + 'px' : ''}` }, root);
  if (k) tl.fromTo(k, { opacity: 0, letterSpacing: '.5em' }, { opacity: 1, letterSpacing: '.26em', duration: .7, ease: 'power3.out', immediateRender: true }, t);
  revealWords(ti, t + .1);
  if (opt.out) { if (k) hideEl(k, opt.out); hideEl(ti, opt.out); }
  return { k, ti };
}

// SVG path helpers (need the path in the DOM)
function pathLen(p) { return p.getTotalLength(); }
function drawOn(path, t, dur, from = 0, to = 1, easeName = 'power2.inOut') {
  const L = path.getTotalLength();
  path.style.strokeDasharray = `${L} ${L}`;
  tl.fromTo(path, { strokeDashoffset: L * (1 - from) }, { strokeDashoffset: L * (1 - to), duration: dur, ease: easeName, immediateRender: true }, t);
}

// A label: dot on target + leader line + text, drawn in an SVG at screen scale.
function label(svg, x, y, tx, ty, text, t, opt = {}) {
  const g = document.createElementNS(SVGNS, 'g');
  const col = opt.color || '#fff';
  const k = opt.k || 1;
  const anchor = opt.anchor || (tx < x ? 'end' : 'start');
  g.innerHTML = `
    <circle cx="${x}" cy="${y}" r="${9 / k}" fill="${col}" stroke="#0b1a21" stroke-width="${3 / k}"/>
    <circle cx="${x}" cy="${y}" r="${20 / k}" fill="none" stroke="${col}" stroke-opacity=".5" stroke-width="${2 / k}" class="ring"/>
    <path d="M${x},${y} L${tx},${ty}" stroke="${col}" stroke-width="${2.5 / k}" fill="none" class="ld"/>
    <text x="${tx + (anchor === 'end' ? -14 / k : anchor === 'middle' ? 0 : 14 / k)}" y="${ty + 11 / k}" text-anchor="${anchor}" class="lbl" font-size="${(opt.size || 34) / k}" fill="#fff" paint-order="stroke" stroke="#0b1a21" stroke-opacity=".55" stroke-width="${6 / k}">${text}</text>
    ${opt.sub ? `<text x="${tx + (anchor === 'end' ? -14 / k : anchor === 'middle' ? 0 : 14 / k)}" y="${ty + 48 / k}" text-anchor="${anchor}" class="lblS" font-size="${(opt.size || 34) * .72 / k}" paint-order="stroke" stroke="#0b1a21" stroke-opacity=".55" stroke-width="${5 / k}">${opt.sub}</text>` : ''}`;
  svg.appendChild(g);
  const ld = g.querySelector('.ld');
  const L = Math.hypot(tx - x, ty - y);
  ld.style.strokeDasharray = `${L} ${L}`;
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: .25, immediateRender: true }, t);
  tl.fromTo(ld, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: .45, ease: 'power2.out', immediateRender: true }, t);
  const txts = g.querySelectorAll('text');
  txts.forEach((tx_, i) => tl.fromTo(tx_, { opacity: 0, x: (anchor === 'end' ? 16 : -16) / k }, { opacity: 1, x: 0, duration: .45, ease: 'power3.out', immediateRender: true }, t + .2 + i * .08));
  tl.fromTo(g.querySelector('.ring'), { attr: { r: 9 / k }, opacity: 1 }, { attr: { r: 30 / k }, opacity: 0, duration: .9, ease: 'power2.out', immediateRender: true }, t);
  if (opt.out) tl.to(g, { opacity: 0, duration: .3 }, opt.out);
  return g;
}

// Journey tracker (Stent -> Chemo -> Scan -> Prehab -> Surgery -> Recovery)
const JOURNEY = ['Stent', 'Chemo', 'Scan', 'Prehab', 'Surgery', 'Recovery'];
function journey(root, t, active, opt = {}) {
  const top = opt.top ?? 1610;
  const wrap = el('div', { style: `position:absolute;left:80px;right:80px;top:${top}px;height:110px;` }, root);
  const n = JOURNEY.length, w = 920, step = w / (n - 1);
  let svg = `<svg width="920" height="110" viewBox="0 0 920 110" style="overflow:visible">
    <line x1="0" y1="30" x2="${w}" y2="30" stroke="rgba(255,255,255,.16)" stroke-width="4" stroke-linecap="round"/>
    <line class="jfill" x1="0" y1="30" x2="${step * active}" y2="30" stroke="#ff8a6b" stroke-width="4" stroke-linecap="round"/>`;
  JOURNEY.forEach((nm, i) => {
    const on = i < active, cur = i === active;
    svg += `<g class="jn${cur ? ' jcur' : ''}" transform="translate(${i * step},30)">
      <circle r="${cur ? 15 : 11}" fill="${cur ? '#ff8a6b' : on ? '#ff8a6b' : '#203a45'}" stroke="${cur || on ? '#ffd2c4' : 'rgba(255,255,255,.25)'}" stroke-width="3"/>
      ${cur ? '<circle class="jpulse" r="15" fill="none" stroke="#ff8a6b" stroke-width="3"/>' : ''}
      <text y="62" text-anchor="middle" font-size="24" font-weight="${cur ? 800 : 600}" fill="${cur ? '#fff' : on ? '#ffc3b2' : 'rgba(169,188,196,.6)'}" letter-spacing="1">${nm}</text>
    </g>`;
  });
  wrap.innerHTML = svg + '</svg>';
  tl.fromTo(wrap, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', immediateRender: true }, t);
  const pulse = wrap.querySelector('.jpulse');
  if (pulse) ticks.push(tt => { const k = ((tt - t) % 1.4 + 1.4) % 1.4 / 1.4; pulse.setAttribute('r', 15 + k * 18); pulse.setAttribute('stroke-opacity', 1 - k); });
  const fill = wrap.querySelector('.jfill');
  tl.fromTo(fill, { attr: { x2: Math.max(0, step * (active - 1)) } }, { attr: { x2: step * active }, duration: .8, ease: 'power2.inOut', immediateRender: true }, t + .3);
  return wrap;
}

// camera for an SVG world group: k(t) -> {x,y,s}
function camera(g, keys) {
  // keys: [[t, x, y, s], ...] world point (x,y) centred on screen point (cx,cy)
  ticks.push(t => {
    let a = keys[0], b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i][0] && t <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break; }
    if (t < keys[0][0]) b = a = keys[0];
    if (t > keys[keys.length - 1][0]) a = b = keys[keys.length - 1];
    const k = a === b ? 0 : ease.io(prog(t, a[0], b[0]));
    const x = lerp(a[1], b[1], k), y = lerp(a[2], b[2], k), s = lerp(a[3], b[3], k);
    const cx = a[4] ?? 540, cy = a[5] ?? 1000;
    g.setAttribute('transform', `translate(${cx - x * s},${cy - y * s}) scale(${s})`);
  });
}

// points along an SVG path
function pointsOn(path, n) {
  const L = path.getTotalLength(), pts = [];
  for (let i = 0; i <= n; i++) { const p = path.getPointAtLength(L * i / n); pts.push([p.x, p.y]); }
  return pts;
}
