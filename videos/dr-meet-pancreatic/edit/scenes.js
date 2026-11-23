// Full-screen medical animation scenes. Times are absolute seconds in the
// narration (taken from the word-level transcript) so each beat lands on the word.
const SC = {};

// helper: an SVG holding the anatomy world with its own id prefix + camera
function anatomyStage(root, p, opt = {}) {
  const svg = svgEl(root);
  const cam = document.createElementNS(SVGNS, 'g');
  svg.appendChild(cam);
  cam.innerHTML = ANAT.anatomy(p, opt);
  const W = id => svg.querySelector('#' + p + id);
  return { svg, cam, W, world: W('world'), fx: W('fx'), labels: W('labels') };
}
function glow(world, d, color, width, id) {
  const g = document.createElementNS(SVGNS, 'g');
  g.innerHTML = `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity=".9" filter="blur(${width * .35}px)"/>
                 <path d="${d}" fill="none" stroke="${color}" stroke-width="${width * .25}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
  g.style.opacity = 0;
  world.appendChild(g);
  return g;
}
function pulseOn(g, t, dur = 1.6, peak = 1) {
  tl.fromTo(g, { opacity: 0 }, { opacity: peak, duration: .35, ease: 'power2.out', immediateRender: false }, t);
  tl.to(g, { opacity: peak * .35, duration: dur, ease: 'sine.inOut' }, t + .35);
}

// =============================================================================
// A — "The pancreatic tumour… main blood vessels, intestine, liver supply"
// =============================================================================
SC.A = function () {
  const t0 = 21.55, t1 = 26.95;
  const root = scene('scA', t0, t1);
  const { svg, cam, W, world, fx, labels } = anatomyStage(root, 'a_');
  shades(root, true, true);
  camera(cam, [[t0 - .6, 620, 440, 1.2, 540, 1130], [t0 + 1.6, 580, 460, 1.3, 540, 1130], [t1 + .4, 540, 480, 1.5, 540, 1130]]);
  // tumour grows on "tumour"
  const tum = W('tumour'), wrap = W('tumWrap');
  tl.fromTo(tum, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .9, ease: 'back.out(1.6)', immediateRender: true }, 22.2);
  tl.fromTo(wrap, { scale: 0, opacity: 0, transformOrigin: '0% 50%' }, { scale: 1, opacity: 1, duration: .7, ease: 'power2.out', immediateRender: true }, 23.5);
  // pancreas outline glow on "pancreas"
  const pg = glow(fx, ANAT.P.pancreas, '#ffd27a', 10);
  pulseOn(pg, 21.65, 1.2, .9);
  tl.to(pg, { opacity: 0, duration: .4 }, 23.2);
  // vessels glow on "main blood vessels"
  const vg = glow(fx, ANAT.P.smv + ' ' + ANAT.P.portal, '#62a8ff', 22);
  const ag = glow(fx, ANAT.P.sma, '#ff6262', 18);
  pulseOn(vg, 23.4, 1.5); pulseOn(ag, 23.55, 1.5);
  // intestine on "intestine"
  const dg = glow(fx, ANAT.P.duodenum, '#ffb3a8', 34);
  pulseOn(dg, 24.35, 1.2, .8);
  // liver supply on "liver supply"
  const lg = glow(fx, ANAT.P.hepA + ' ' + ANAT.P.portal, '#ffd27a', 16);
  pulseOn(lg, 25.0, 1.4);
  // labels live in world space (k = camera scale around the time they appear)
  const k = 1.4;
  label(labels, 488, 478, 300, 470, 'Tumour', 22.45, { k, color: '#ff86c0', size: 38, anchor: 'end' });
  label(labels, 590, 690, 640, 770, 'Main blood vessels', 23.55, { k, color: '#8fc2ff', size: 34, sub: 'vein (blue) · artery (red)', anchor: 'start' });
  el('div', { class: 'note', html: 'Vessels that supply the intestine and liver', style: 'top:540px;font-size:24px;letter-spacing:.08em;color:rgba(169,188,196,.9)' }, root);
  label(labels, 342, 640, 300, 700, 'Intestine', 24.4, { k, color: '#ffb3a8', size: 34, anchor: 'end' });
  label(labels, 476, 262, 450, 150, 'Liver blood supply', 25.0, { k, color: '#ffd27a', size: 34, anchor: 'end' });
  titleBlock(root, t0 - .2, 'Locally advanced pancreatic cancer', 'The tumour was <span class="hl">encasing the main</span> <span class="hl">blood vessels</span>', { size: 62 });
  el('div', { class: 'note', html: 'Simplified illustration', style: 'top:1700px' }, root);
};

// =============================================================================
// B — ERCP biliary stent (as in the reference image)
// =============================================================================
SC.B = function () {
  const t0 = 35.45, t1 = 44.0;
  const root = scene('scB', t0, t1, { exit: 'none' });
  const svg = svgEl(root);
  const p = 'b_';
  svg.innerHTML = `${ANAT.defs(p)}
  <defs>
    <linearGradient id="b_lumen" x1="0" x2="1"><stop offset="0" stop-color="#5e1418"/><stop offset=".5" stop-color="#8e2a2c"/><stop offset="1" stop-color="#5a1216"/></linearGradient>
    <linearGradient id="b_wall" x1="0" x2="1"><stop offset="0" stop-color="#f0a48a"/><stop offset=".35" stop-color="#d9634f"/><stop offset="1" stop-color="#a8302f"/></linearGradient>
    <linearGradient id="b_wallR" x1="1" x2="0"><stop offset="0" stop-color="#f0a48a"/><stop offset=".35" stop-color="#d9634f"/><stop offset="1" stop-color="#a8302f"/></linearGradient>
    <linearGradient id="b_scope" x1="0" x2="1"><stop offset="0" stop-color="#3d4f86"/><stop offset=".35" stop-color="#9fb2e6"/><stop offset=".55" stop-color="#c9d6ff"/><stop offset="1" stop-color="#34457a"/></linearGradient>
    <linearGradient id="b_tip" x1="0" x2="1"><stop offset="0" stop-color="#2a2f36"/><stop offset=".4" stop-color="#9aa3ad"/><stop offset=".6" stop-color="#cfd6dd"/><stop offset="1" stop-color="#2a2f36"/></linearGradient>
    <radialGradient id="b_panc" cx="60%" cy="40%" r="80%"><stop offset="0" stop-color="#ffe3a0"/><stop offset="1" stop-color="#eaa64a"/></radialGradient>
    <pattern id="b_dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.6" fill="#fff" opacity=".28"/><circle cx="11" cy="10" r="2" fill="#7a1d1d" opacity=".25"/></pattern>
    <clipPath id="b_lumClip"><rect x="112" y="430" width="296" height="1300"/></clipPath>
    <clipPath id="b_win"><rect x="40" y="560" width="1000" height="1030" rx="44"/></clipPath>
    <filter id="b_bileGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect x="40" y="560" width="1000" height="1030" rx="44" fill="#000" opacity=".35" transform="translate(0,14)" filter="blur(18px)"/>
  <g clip-path="url(#b_win)"><g id="b_scene" transform="translate(0,40)">
    <!-- pancreas tissue (medial to the duodenum) -->
    <path d="M470,470 C620,440 860,450 1100,470 L1100,1620 C900,1640 640,1630 470,1600 Z" fill="url(#b_panc)" filter="url(#b_lobTex)"/>
    <path d="M470,470 C620,440 860,450 1100,470" stroke="#c07a26" stroke-width="3" fill="none" opacity=".5"/>
    <!-- pancreatic duct joining at the papilla -->
    <path id="b_pd" d="M1100,1300 C960,1290 820,1262 700,1236 C600,1214 530,1200 470,1194" fill="none" stroke="#c97a22" stroke-width="30" stroke-linecap="round"/>
    <path d="M1100,1300 C960,1290 820,1262 700,1236 C600,1214 530,1200 470,1194" fill="none" stroke="#ffcf7a" stroke-width="18" stroke-linecap="round"/>
    <!-- tumour (around the bile duct) -->
    <g id="b_tum"></g>
    <!-- bile duct: drawn procedurally -->
    <path id="b_cbdC" d="M418,1196 L470,1185 C560,1150 640,1080 690,990 C740,900 790,800 850,700 C900,620 940,540 990,440" fill="none" stroke="none"/>
    <path id="b_cbdWall" fill="#4f8f18"/>
    <path id="b_cbdLum" fill="#a9d63c"/>
    <g id="b_bile" filter="url(#b_bileGlow)"></g>
    <g id="b_wire"><path id="b_wireP" d="M332,1176 C380,1180 430,1190 470,1185 C560,1150 640,1080 690,990 C740,900 790,800 850,700 C900,620 935,555 965,490" fill="none" stroke="#e8eef2" stroke-width="5" stroke-linecap="round"/></g>
    <path id="b_stCore" fill="none" stroke="#3d6e12" stroke-opacity=".55" stroke-linecap="round"/>
    <g id="b_stent"></g>
    <g id="b_pinch"></g>
    <!-- duodenum: back wall (lumen) + cut walls -->
    <rect x="112" y="430" width="296" height="1300" fill="url(#b_lumen)"/>
    <g clip-path="url(#b_lumClip)" opacity=".45">
      ${Array.from({ length: 14 }, (_, i) => `<path d="M112,${470 + i * 92} C190,${500 + i * 92} 330,${500 + i * 92} 408,${470 + i * 92}" stroke="#c0484a" stroke-width="10" fill="none"/>`).join('')}
    </g>
    <g id="b_flowOut"></g>
    <rect x="40" y="430" width="74" height="1300" fill="url(#b_wall)"/><rect x="40" y="430" width="74" height="1300" fill="url(#b_dots)"/>
    <rect x="406" y="430" width="70" height="1300" fill="url(#b_wallR)"/><rect x="406" y="430" width="70" height="1300" fill="url(#b_dots)"/>
    <!-- papilla -->
    <ellipse cx="412" cy="1190" rx="26" ry="40" fill="#e0706a"/><ellipse cx="400" cy="1190" rx="8" ry="12" fill="#5a1216"/>
    <!-- duodenoscope -->
    <g id="b_scopeG">
      <path d="M-160,140 C40,330 200,520 240,760 C258,880 262,980 262,1070" fill="none" stroke="#1f2a4a" stroke-width="150" stroke-linecap="butt"/>
      <path d="M-160,140 C40,330 200,520 240,760 C258,880 262,980 262,1070" fill="none" stroke="url(#b_scope)" stroke-width="140" stroke-linecap="butt"/>
      <path d="M-160,140 C40,330 200,520 240,760 C258,880 262,980 262,1070" fill="none" stroke="#24335e" stroke-opacity=".55" stroke-width="140" stroke-dasharray="3 22"/>
      <rect x="190" y="1060" width="144" height="210" rx="34" fill="url(#b_tip)" stroke="#15181c" stroke-width="4"/>
      <rect x="300" y="1120" width="30" height="100" rx="12" fill="#0d1014"/>
      <circle cx="315" cy="1145" r="7" fill="#6fd3ff" opacity=".85"/>
      <path id="b_elev" d="M318,1196 L338,1180" stroke="#cfd6dd" stroke-width="7" stroke-linecap="round"/>
    </g>
  </g></g>
  <rect x="40" y="560" width="1000" height="1030" rx="44" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="2"/>`;
  // tumour around the duct
  sel(svg, '#b_tum').innerHTML = (() => {
    const cx = 692, cy = 985; let s = '';
    s += `<path d="${ANAT.blob(cx, cy, 150, 0.7, 6, 0.1, [1.05, .95])}" fill="url(#b_tumG)"/>`;
    [[-95, -60, 62], [-20, -110, 58], [70, -70, 60], [100, 20, 58], [40, 100, 60], [-60, 95, 56], [-110, 20, 50], [0, 0, 56]].forEach(([dx, dy, r]) => {
      s += `<circle cx="${cx + dx}" cy="${cy + dy}" r="${r}" fill="url(#b_nodG)"/><ellipse cx="${cx + dx - r * .3}" cy="${cy + dy - r * .35}" rx="${r * .3}" ry="${r * .22}" fill="#fff" opacity=".3"/>`;
    });
    return s;
  })();

  // ---- procedural bile duct (width depends on tumour squeeze and stent opening)
  const C = sel(svg, '#b_cbdC'), wall = sel(svg, '#b_cbdWall'), lum = sel(svg, '#b_cbdLum');
  const N = 140, L = C.getTotalLength();
  const pts = [], nrm = [];
  for (let i = 0; i <= N; i++) {
    const a = C.getPointAtLength(L * i / N), b = C.getPointAtLength(Math.min(L, L * i / N + 1)), c = C.getPointAtLength(Math.max(0, L * i / N - 1));
    pts.push([a.x, a.y]); const dx = b.x - c.x, dy = b.y - c.y, m = Math.hypot(dx, dy) || 1; nrm.push([-dy / m, dx / m]);
  }
  // s index where duct leaves the duodenal wall (~x 470)
  const sPap = pts.findIndex(q => q[0] >= 470) / N;
  let sStr = 0, best = 1e9;
  pts.forEach((q, i) => { const d = Math.hypot(q[0] - 692, q[1] - 985); if (d < best) { best = d; sStr = i / N; } });
  const tOpen0 = 40.05, tOpen1 = 41.35;
  function width(s, t) {
    let w = 40;
    w += 26 * clamp((s - sStr - .06) / .14);               // dilated above the block (bile backed up)
    const open = ease.io(prog(t, tOpen0 + (1 - s) * .5, tOpen0 + (1 - s) * .5 + .7)); // opens top -> bottom
    const sq = Math.exp(-Math.pow((s - sStr) / .07, 2));
    w -= sq * 28 * (1 - open);                                // squeezed by the tumour
    w -= 22 * clamp((s - sStr - .06) / .14) * open * .6;      // dilatation settles once drained
    return w;
  }
  function polyline(t, scale) {
    const L1 = [], R = [];
    for (let i = 0; i <= N; i++) {
      const s = i / N; if (s < sPap - .01) continue;
      const w = width(s, t) * scale / 2;
      L1.push([pts[i][0] + nrm[i][0] * w, pts[i][1] + nrm[i][1] * w]);
      R.push([pts[i][0] - nrm[i][0] * w, pts[i][1] - nrm[i][1] * w]);
    }
    const all = L1.concat(R.reverse());
    return 'M' + all.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('L') + 'Z';
  }
  ticks.push(t => { wall.setAttribute('d', polyline(t, 1.3)); lum.setAttribute('d', polyline(t, .82)); });
  // bile colour: dark/stagnant before, bright once draining
  ticks.push(t => {
    const k = prog(t, 41.0, 42.4);
    lum.setAttribute('fill', `rgb(${Math.round(lerp(122, 186, k))},${Math.round(lerp(150, 224, k))},${Math.round(lerp(40, 70, k))})`);
  });

  // ---- stent mesh (self-expanding metal stent)
  const st = sel(svg, '#b_stent');
  const sA = sPap - .07, sB = Math.min(.86, sStr + .32);
  const iA = Math.max(0, Math.round(sA * N)), iB = Math.round(sB * N);
  const tIn0 = 39.25, tIn1 = 40.05;   // stent slides in over the wire (compressed)
  const wires = 5;
  for (let i = 0; i < wires * 2 + 2; i++) { const pth = document.createElementNS(SVGNS, 'path'); st.appendChild(pth); }
  const stPaths = [...st.children];
  stPaths.forEach((q, i) => {
    q.setAttribute('fill', 'none'); q.setAttribute('stroke-linecap', 'round');
    if (i >= wires * 2) { q.setAttribute('stroke', '#5d6a72'); q.setAttribute('stroke-width', '4'); }
    else { q.setAttribute('stroke', i % 2 ? '#f4f8fa' : '#cdd7de'); q.setAttribute('stroke-width', '3.2'); }
  });
  function drawStent(t) {
    const vis = prog(t, tIn0, tIn0 + .25);
    st.style.opacity = vis;
    if (vis <= 0) return;
    const slide = ease.out(prog(t, tIn0, tIn1));      // slides up from the scope
    const shift = Math.round((1 - slide) * 34);        // index offset (enters from below)
    const pitch = 74;
    for (let w = 0; w < wires * 2; w++) {
      const dir = w < wires ? 1 : -1, ph = (w % wires) / wires * Math.PI * 2;
      let d = '';
      for (let i = iA; i <= iB; i++) {
        const j = Math.max(0, i - shift);
        const s = i / N;
        const open = ease.io(prog(t, tOpen0 + (1 - s) * .5, tOpen0 + (1 - s) * .5 + .7));
        const r = lerp(8, Math.min(26, width(s, t) * .5 - 4), open);
        const arc = (i - iA) * (L / N);
        const off = r * Math.sin(dir * arc / pitch * Math.PI * 2 + ph);
        const x = pts[j][0] + nrm[j][0] * off, y = pts[j][1] + nrm[j][1] * off;
        d += (d ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
      }
      stPaths[w].setAttribute('d', d);
    }
    for (let e = 0; e < 2; e++) {
      let d = '';
      for (let i = iA; i <= iB; i++) {
        const j = Math.max(0, i - shift), s = i / N;
        const open = ease.io(prog(t, tOpen0 + (1 - s) * .5, tOpen0 + (1 - s) * .5 + .7));
        const r = lerp(8, Math.min(26, width(s, t) * .5 - 4), open) * (e ? -1 : 1);
        d += (d ? 'L' : 'M') + (pts[j][0] + nrm[j][0] * r).toFixed(1) + ',' + (pts[j][1] + nrm[j][1] * r).toFixed(1);
      }
      stPaths[wires * 2 + e].setAttribute('d', d);
    }
  }
  ticks.push(drawStent);
  const core = sel(svg, '#b_stCore');
  ticks.push(t => {
    const open = ease.io(prog(t, tOpen0, tOpen0 + 1.2));
    if (open <= 0) { core.setAttribute('d', ''); return; }
    let d = '';
    for (let i = iA; i <= iB; i++) d += (d ? 'L' : 'M') + pts[i][0].toFixed(1) + ',' + pts[i][1].toFixed(1);
    core.setAttribute('d', d); core.setAttribute('stroke-width', 40 * open); core.style.opacity = open;
  });
  // tumour lobes that squeeze the duct (in front of it); pushed back as the stent opens
  const pinch = sel(svg, '#b_pinch');
  const pl = [];
  [-.05, -.02, .01, .04, .07].forEach((ds, i) => [1, -1].forEach(side => {
    const ii = Math.round((sStr + ds) * N), r = 26 + (i % 2) * 8;
    const g = document.createElementNS(SVGNS, 'g');
    g.innerHTML = `<circle r="${r}" fill="url(#b_nodG)"/><ellipse cx="${-r * .3}" cy="${-r * .35}" rx="${r * .3}" ry="${r * .22}" fill="#fff" opacity=".3"/>`;
    pinch.appendChild(g); pl.push({ g, ii, side, r });
  }));
  ticks.push(t => pl.forEach(q => {
    const s_ = q.ii / N, w = width(s_, t) * .65 + q.r * .55;
    q.g.setAttribute('transform', `translate(${(pts[q.ii][0] + nrm[q.ii][0] * w * q.side).toFixed(1)},${(pts[q.ii][1] + nrm[q.ii][1] * w * q.side).toFixed(1)})`);
  }));

  // ---- guidewire: out of the scope, through the papilla, past the narrowing
  const wire = sel(svg, '#b_wireP'); const WL = wire.getTotalLength();
  wire.style.strokeDasharray = `${WL} ${WL}`;
  tl.fromTo(wire, { strokeDashoffset: WL }, { strokeDashoffset: 0, duration: 1.15, ease: 'power1.inOut', immediateRender: true }, 38.05);
  tl.to(wire, { strokeDashoffset: WL, duration: .6, ease: 'power1.in' }, 41.5);   // withdrawn after deployment

  // ---- scope enters, then backs off a little after deployment
  const scopeG = sel(svg, '#b_scopeG');
  tl.fromTo(scopeG, { x: -260, y: -520 }, { x: 0, y: 0, duration: 1.35, ease: 'power3.out', immediateRender: true }, 36.55);
  tl.to(scopeG, { y: -60, duration: .8, ease: 'power2.inOut' }, 41.6);
  tl.fromTo(sel(svg, '#b_elev'), { rotation: 0, svgOrigin: '318 1196' }, { rotation: -28, svgOrigin: '318 1196', duration: .3, immediateRender: true }, 37.9);

  // ---- bile particles: stuck above the block, then draining through the stent
  const bileG = sel(svg, '#b_bile'), outG = sel(svg, '#b_flowOut');
  const NP = 70, parts = [];
  for (let i = 0; i < NP; i++) {
    const c = document.createElementNS(SVGNS, 'circle');
    c.setAttribute('r', 5 + (i * 7 % 4)); c.setAttribute('fill', i % 3 ? '#f2ffb0' : '#d8f76a');
    bileG.appendChild(c); parts.push({ c, u: (i * 0.6180339) % 1, lane: ((i * 0.37) % 1) - .5 });
  }
  const tFlow = 41.2;
  ticks.push(t => {
    parts.forEach((q, i) => {
      let s;
      if (t < tFlow) {
        // jostling in the dilated duct above the block
        s = sStr + .1 + q.u * (sB + .05 - sStr - .1) + .01 * Math.sin(t * 2 + i);
      } else {
        const v = .18;            // fraction of duct per second
        const span = 1 - sPap + .25;
        let u = (q.u * span - (t - tFlow) * v);
        u = ((u % span) + span) % span;
        s = sPap - .2 + u;
      }
      if (s >= sPap) {
        const ii = Math.min(N, Math.max(0, Math.round(s * N)));
        const w = width(s, t) * .32 * q.lane;
        q.c.setAttribute('cx', pts[ii][0] + nrm[ii][0] * w); q.c.setAttribute('cy', pts[ii][1] + nrm[ii][1] * w);
        q.c.setAttribute('opacity', .9);
        if (q.c.parentNode !== bileG) bileG.appendChild(q.c);
      } else {
        // emerging from the papilla into the intestine, drifting down
        const k = (sPap - s) / .2;
        q.c.setAttribute('cx', 400 - k * 110 + q.lane * 90 * k);
        q.c.setAttribute('cy', 1192 + k * 60 + k * k * 300 + q.lane * 40 * k);
        q.c.setAttribute('opacity', .95 * (1 - k * k));
        if (q.c.parentNode !== outG) outG.appendChild(q.c);
      }
    });
  });

  // ---- titles + labels (screen space)
  const lab = svgEl(root);
  titleBlock(root, t0 - .3, 'Step 1 · Biliary stent (ERCP)', 'First, open the <span class="hl">blocked bile duct</span>', { size: 64, out: 41.45 });
  const t2 = el('div', { class: 'title', html: words('Jaundice settles — ready for <span class="hl">further treatment</span>'), style: 'top:374px;font-size:62px' }, root);
  revealWords(t2, 41.75);
  label(lab, 760, 1120, 700, 1330, 'Tumour', 35.9, { color: '#ff9fcd', anchor: 'start', size: 38, sub: 'narrows the bile duct', out: 39.3 });
  label(lab, 845, 760, 760, 690, 'Bile duct', 36.3, { color: '#c9f06a', anchor: 'end', size: 38, sub: 'bile backs up', out: 39.3 });
  label(lab, 255, 860, 520, 860, 'Endoscope', 37.3, { color: '#b9c9ff', anchor: 'start', size: 38, sub: 'passed through the mouth', out: 39.3 });
  label(lab, 760, 900, 640, 760, 'Metal stent', 40.4, { color: '#ffffff', anchor: 'end', size: 38, sub: 'holds the duct open' });
  label(lab, 330, 1400, 520, 1460, 'Bile drains into', 42.0, { color: '#d8f76a', anchor: 'start', size: 38, sub: 'the intestine' });
  journey(root, t0, 0);
};

// =============================================================================
// C — neoadjuvant chemotherapy: drug reaches the tumour through its arteries,
// five cycles, tumour shrinks and pulls back from the vessels
// =============================================================================
SC.C = function () {
  const t0 = 44.05, t1 = 56.45;
  const root = scene('scC', t0, t1, { enter: 'fade', tin: .6 });
  const { svg, cam, W, world, fx, labels } = anatomyStage(root, 'c_', { stent: true });
  shades(root, true, true);
  camera(cam, [[t0 - .6, 540, 470, 1.8, 540, 1120], [t0 + 5.5, 530, 500, 2.05, 540, 1120], [t1 + .5, 530, 505, 2.2, 540, 1120]]);
  tl.set([W('stomachL'), W('liverL')], { opacity: .28 }, 0);
  tl.set([W('gbL'), W('spleenL')], { opacity: .5 }, 0);
  const tum = W('tumour'), wrap = W('tumWrap');
  // feeding arteries into the tumour + drug particles
  const feeds = [
    'M622,596 C600,600 578,590 562,572 C552,560 544,550 538,540',            // inferior pancreaticoduodenal (from SMA)
    'M622,640 C596,648 566,640 546,616 C532,598 520,580 512,562',            // second branch from the SMA
    'M486,420 C490,432 494,442 498,452',                                     // gastroduodenal side (from above)
  ];
  const feedG = document.createElementNS(SVGNS, 'g'); fx.appendChild(feedG);
  feeds.forEach(d => { feedG.innerHTML += `<path d="${d}" fill="none" stroke="#a3161e" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#ff6262" stroke-width="4" stroke-linecap="round"/>`; });
  tl.fromTo(feedG, { opacity: 0 }, { opacity: 1, duration: .6, immediateRender: true }, 45.2);
  // particle routes: down the SMA into a feeder, or down the hepatic artery side
  const routes = [
    'M622,516 C622,550 622,580 622,596 C600,600 578,590 562,572 C552,560 544,550 538,540 C530,530 520,516 510,506',
    'M622,516 C622,570 622,620 622,640 C596,648 566,640 546,616 C532,598 520,580 512,562 C508,546 506,530 504,516',
    'M470,330 C476,370 482,400 486,420 C490,432 494,442 498,452 C502,468 504,482 505,496',
  ].map(d => { const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', d); return p; });
  const partG = document.createElementNS(SVGNS, 'g'); partG.setAttribute('filter', 'url(#c_glow)'); fx.appendChild(partG);
  routes.forEach(r => { r.setAttribute('fill', 'none'); partG.appendChild(r); });
  const RL = routes.map(r => r.getTotalLength());
  const NP = 36, ps = [];
  for (let i = 0; i < NP; i++) { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('r', 4.2); c.setAttribute('fill', '#8affe6'); partG.appendChild(c); ps.push({ c, r: i % 3, ph: (i * .618) % 1 }); }
  // cycles: drug pulses + one shrink step each
  const cyc = [50.55, 51.55, 52.55, 53.55, 54.55];
  ticks.push(t => {
    let inten = prog(t, 45.4, 46.6);
    cyc.forEach(c => { inten += 0.9 * Math.exp(-Math.pow((t - c - .1) / .35, 2)); });
    inten = Math.min(1.4, inten) * (1 - prog(t, 55.3, 56.0));
    ps.forEach((q, i) => {
      const u = ((t * .42 + q.ph) % 1);
      const pt = routes[q.r].getPointAtLength(RL[q.r] * u);
      q.c.setAttribute('cx', pt.x); q.c.setAttribute('cy', pt.y);
      q.c.setAttribute('opacity', Math.min(1, inten) * Math.sin(u * Math.PI) * (i % 4 === 0 ? 1 : .85));
    });
  });
  // tumour shrink in 5 steps, retreating from the vessels (origin on its left side)
  tl.set(tum, { svgOrigin: '446 502' }, 0);
  let sc = 1;
  cyc.forEach((c, i) => {
    sc = [0.92, 0.84, 0.76, 0.69, 0.63][i];
    tl.to(tum, { scale: sc, duration: .55, ease: 'back.out(2)' }, c);
    tl.fromTo(tum, { filter: 'brightness(1.6) saturate(.6)' }, { filter: 'brightness(1) saturate(1)', duration: .6, immediateRender: false }, c);
  });
  tl.to(wrap, { scale: .35, opacity: 0, svgOrigin: '548 502', duration: 1.6, ease: 'power2.inOut' }, 50.6);
  // vessels free: glow + gap marker
  const vg = glow(fx, ANAT.P.smv, '#7fe0c3', 20), ag = glow(fx, ANAT.P.sma, '#7fe0c3', 16);
  pulseOn(vg, 54.3, 1.6, .9); pulseOn(ag, 54.4, 1.6, .9);
  const gap = document.createElementNS(SVGNS, 'g'); labels.appendChild(gap);
  gap.innerHTML = `<path d="M528,502 L559,502" stroke="#7fe0c3" stroke-width="2.4" stroke-dasharray="4 3"/>
    <path d="M533,497 L527,502 L533,507 M554,497 L560,502 L554,507" stroke="#7fe0c3" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  tl.fromTo(gap, { opacity: 0 }, { opacity: 1, duration: .4, immediateRender: true }, 54.45);
  // labels (world space; camera ~2.1)
  const k = 2.1;
  label(labels, 566, 590, 560, 690, 'Drug reaches the tumour', 46.7, { k, color: '#8affe6', anchor: 'middle', size: 36, sub: 'through its arteries', out: 50.2 });
  label(labels, 404, 480, 420, 300, 'Stent in place', 45.0, { k, color: '#e9f0f4', anchor: 'middle', size: 32, out: 50.2 });
  label(labels, 545, 502, 620, 420, 'Space opens', 54.55, { k, color: '#7fe0c3', anchor: 'start', size: 38, sub: 'around the vessels' });
  // IV bag (screen space, top-right of the frame)
  const iv = el('div', { style: 'position:absolute;left:800px;top:600px;width:200px;height:360px;' }, root);
  iv.innerHTML = `<svg width="200" height="360" viewBox="0 0 200 360">
    <defs><linearGradient id="ivF" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9ff7e6" stop-opacity=".55"/><stop offset="1" stop-color="#4fd6bb" stop-opacity=".85"/></linearGradient></defs>
    <path d="M100,6 L100,26" stroke="#cfd8dc" stroke-width="5" stroke-linecap="round"/>
    <rect x="40" y="26" width="120" height="170" rx="26" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.7)" stroke-width="3"/>
    <rect id="ivLvl" x="46" y="70" width="108" height="120" rx="20" fill="url(#ivF)"/>
    <text x="100" y="120" text-anchor="middle" font-size="22" font-weight="800" fill="#0b1a21" opacity=".75">CHEMO</text>
    <path d="M88,196 L112,196 L106,220 L94,220 Z" fill="rgba(255,255,255,.6)"/>
    <rect x="90" y="222" width="20" height="46" rx="6" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.6)" stroke-width="2"/>
    <circle id="ivDrop" cx="100" cy="232" r="4.5" fill="#7fffe0"/>
    <path d="M100,268 C100,300 70,320 40,350" stroke="rgba(255,255,255,.55)" stroke-width="4" fill="none"/>
  </svg>`;
  tl.fromTo(iv, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out', immediateRender: true }, 44.3);
  tl.to(iv, { opacity: 0, duration: .4 }, 50.1);
  const drop = iv.querySelector('#ivDrop');
  ticks.push(t => { const k2 = ((t * 1.6) % 1); drop.setAttribute('cy', 230 + k2 * k2 * 34); drop.setAttribute('opacity', 1 - k2 * .6); });
  // cycle counter
  const cc = el('div', { style: 'position:absolute;left:0;right:0;top:538px;text-align:center;' }, root);
  cc.innerHTML = `<div style="display:inline-flex;align-items:center;gap:16px;padding:14px 26px;border-radius:60px;background:rgba(8,20,26,.75);border:1.5px solid rgba(255,255,255,.1)">
    <div style="font-weight:700;font-size:22px;letter-spacing:.18em;color:#a9bcc4;text-transform:uppercase;margin-right:8px">Cycle</div>
    ${[1, 2, 3, 4, 5].map(i => `<div class="cy" style="width:62px;height:62px;border-radius:50%;border:3px solid rgba(127,224,195,.35);display:flex;align-items:center;justify-content:center;font:800 28px Inter;color:rgba(255,255,255,.45)">${i}</div>`).join('')}</div>`;
  tl.fromTo(cc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out', immediateRender: true }, 50.1);
  cc.querySelectorAll('.cy').forEach((d, i) => {
    tl.to(d, { backgroundColor: 'rgba(127,224,195,.95)', borderColor: '#7fe0c3', color: '#0b1a21', scale: 1.12, duration: .25, ease: 'power2.out' }, cyc[i]);
    tl.to(d, { scale: 1, duration: .3 }, cyc[i] + .25);
  });
  titleBlock(root, t0 - .2, 'Step 2 · Neoadjuvant chemotherapy', 'Chemotherapy <span class="hl">before</span> surgery', { size: 66, out: 50.0 });
  const t2 = el('div', { class: 'title', html: words('Goal: <span class="hl">shrink the tumour</span> and free the vessels'), style: 'top:374px;font-size:62px' }, root);
  revealWords(t2, 50.3);
  journey(root, t0, 1);
};

// =============================================================================
// D — re-assessment: PET-CT, then special 3D software reconstruction
// =============================================================================
SC.D = function () {
  const t0 = 59.55, t1 = 70.75;
  const root = scene('scD', t0, t1);
  const svg = svgEl(root);
  svg.innerHTML = `
  <defs>
    <clipPath id="d_win"><rect x="40" y="560" width="1000" height="1030" rx="44"/></clipPath>
    <linearGradient id="d_gan" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f3f6f8"/><stop offset="1" stop-color="#b9c6cf"/></linearGradient>
    <radialGradient id="d_bore" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#0d1b22"/><stop offset=".85" stop-color="#1d3340"/><stop offset="1" stop-color="#3d5866"/></radialGradient>
    <linearGradient id="d_ui" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0a1a22"/><stop offset="1" stop-color="#071116"/></linearGradient>
    <filter id="d_glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="d_grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40,0 L0,0 0,40" fill="none" stroke="#5fd3ff" stroke-opacity=".09" stroke-width="1.5"/></pattern>
  </defs>
  <rect x="40" y="560" width="1000" height="1030" rx="44" fill="#000" opacity=".35" transform="translate(0,14)" filter="blur(18px)"/>
  <g clip-path="url(#d_win)">
    <rect x="40" y="560" width="1000" height="1030" fill="url(#d_ui)"/>
    <g id="d_scan">
      <rect x="40" y="560" width="1000" height="1030" fill="#14303b"/>
      <ellipse cx="540" cy="1560" rx="700" ry="140" fill="#0e242d"/>
      <g id="d_gantry">
        <rect x="150" y="640" width="780" height="780" rx="120" fill="url(#d_gan)"/>
        <rect x="150" y="640" width="780" height="780" rx="120" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>
        <circle cx="540" cy="1010" r="270" fill="#9eb0bb"/>
        <circle cx="540" cy="1010" r="236" fill="url(#d_bore)"/>
        <circle id="d_ring" cx="540" cy="1010" r="252" fill="none" stroke="#5fd3ff" stroke-width="10" stroke-linecap="round" filter="url(#d_glow)"/>
        <text x="540" y="712" text-anchor="middle" font-size="30" font-weight="800" fill="#40525d" letter-spacing="6">PET · CT</text>
      </g>
      <g id="d_table">
        <path d="M330,1600 L750,1600 L620,1090 L460,1090 Z" fill="#dfe7ec"/>
        <path d="M330,1600 L750,1600 L620,1090 L460,1090 Z" fill="none" stroke="#9fb0ba" stroke-width="3"/>
        <g id="d_pt">
          <ellipse cx="540" cy="1180" rx="46" ry="40" fill="#2c7fb8"/>
          <path d="M478,1220 C470,1300 452,1420 436,1560 L644,1560 C628,1420 610,1300 602,1220 Z" fill="#3a95d1"/>
          <ellipse cx="540" cy="1150" rx="36" ry="34" fill="#f0c3a4"/>
        </g>
      </g>
      <rect id="d_beam" x="300" y="1000" width="480" height="8" fill="#5fd3ff" filter="url(#d_glow)" opacity=".0"/>
    </g>
    <g id="d_ui3d" opacity="0">
      <rect x="40" y="560" width="1000" height="1030" fill="url(#d_grid)"/>
      <g font-family="Inter" font-weight="700" font-size="20" fill="#5fd3ff" opacity=".7">
        <text x="80" y="612" letter-spacing="3">3D RECONSTRUCTION</text>
        <text x="1000" y="612" text-anchor="end" letter-spacing="3">PANCREAS · TUMOUR · VESSELS</text>
      </g>
      <g opacity=".55" stroke="#5fd3ff" stroke-width="2" fill="none"><path d="M80,1540 l0,-60 M80,1540 l60,0 M80,1540 l-36,30"/></g>
      <g id="d_model"></g>
      <rect id="d_sweep" x="60" y="640" width="960" height="4" fill="#5fd3ff" opacity="0" filter="url(#d_glow)"/>
      <g id="d_meas"></g>
    </g>
  </g>
  <rect x="40" y="560" width="1000" height="1030" rx="44" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="2"/>`;
  // scanner: patient slides in, ring scans
  const pt = sel(svg, '#d_pt'), ring = sel(svg, '#d_ring'), beam = sel(svg, '#d_beam');
  tl.fromTo(pt, { y: 330, scale: 1.25, svgOrigin: '540 1300' }, { y: 0, scale: 1, svgOrigin: '540 1300', duration: 1.8, ease: 'power2.inOut', immediateRender: true }, 59.4);
  const RC = 2 * Math.PI * 252;
  ring.style.strokeDasharray = `${RC * .22} ${RC * .78}`;
  ticks.push(t => { ring.style.strokeDashoffset = -(t * 900) % RC; ring.style.opacity = .5 + .5 * Math.sin(t * 6) ** 2; });
  ticks.push(t => { const k = prog(t, 60.6, 62.2); beam.setAttribute('opacity', k > 0 && k < 1 ? .9 : 0); beam.setAttribute('y', 850 + 300 * Math.sin(k * Math.PI * 2) ** 2); });
  // zoom through the bore into the 3D software
  const scanG = sel(svg, '#d_scan'), ui = sel(svg, '#d_ui3d');
  tl.to(scanG, { scale: 3.2, svgOrigin: '540 1010', opacity: 0, duration: .9, ease: 'power3.in' }, 62.05);
  tl.to(ui, { opacity: 1, duration: .5, ease: 'power2.out' }, 62.6);

  // 3D model: layered 2.5D with parallax rotation
  const P = ANAT.P;
  const model = sel(svg, '#d_model');
  // world -> window transform: centre (560,500) at (540,1060), scale 1.55
  model.setAttribute('transform', 'translate(540,1075) scale(1.4) translate(-660,-480)');
  const layers = {
    art: { depth: -60, html: `<path d="${P.sma}" fill="none" stroke="#ff6262" stroke-width="15" stroke-linecap="round" filter="url(#d_glow)"/><path d="${P.hepA}" fill="none" stroke="#ff6262" stroke-width="9" stroke-linecap="round" filter="url(#d_glow)"/><path d="M612,330 L612,700" fill="none" stroke="#ff6262" stroke-opacity=".5" stroke-width="22" stroke-linecap="round"/>` },
    vein: { depth: -25, html: `<path d="${P.splenicV}" fill="none" stroke="#62a8ff" stroke-width="16" stroke-linecap="round" filter="url(#d_glow)"/><path d="${P.portal}" fill="none" stroke="#62a8ff" stroke-width="22" stroke-linecap="round" filter="url(#d_glow)"/><path d="${P.smv}" fill="none" stroke="#62a8ff" stroke-width="20" stroke-linecap="round" filter="url(#d_glow)"/>` },
    panc: { depth: 0, html: `<path id="d_pan" d="${P.pancreas}" fill="#ffcf7a" fill-opacity=".22" stroke="#ffd98a" stroke-width="3"/><path d="${P.pduct}" fill="none" stroke="#ffd98a" stroke-opacity=".6" stroke-width="3" stroke-dasharray="6 6"/>` },
    tum: { depth: 18, html: `<g id="d_tum"><path d="${ANAT.blob(492, 502, 40, 1.3, 7, .12)}" fill="#ff86c0" fill-opacity=".75" stroke="#ffb3d6" stroke-width="2.5" filter="url(#d_glow)"/></g>` },
  };
  const L = {};
  ['art', 'vein', 'panc', 'tum'].forEach(k => { const g = document.createElementNS(SVGNS, 'g'); g.innerHTML = layers[k].html; model.appendChild(g); L[k] = g; });
  // build sequence: pancreas outline draws on, vessels fade in, tumour last
  const pan = sel(svg, '#d_pan'); const PL = pan.getTotalLength();
  pan.style.strokeDasharray = `${PL} ${PL}`;
  tl.fromTo(pan, { strokeDashoffset: PL, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', immediateRender: true }, 62.7);
  tl.to(pan, { fillOpacity: .22, duration: .6 }, 63.8);
  tl.fromTo([L.vein, L.art], { opacity: 0 }, { opacity: 1, duration: .7, stagger: .25, immediateRender: true }, 64.6);
  tl.fromTo(L.tum, { opacity: 0 }, { opacity: 1, duration: .5, immediateRender: true }, 66.8);
  ticks.push(t => {
    const th = (t < 62.6 ? 0 : Math.sin((t - 62.6) * .55) * .42);    // gentle rotation ±24°
    const c = Math.cos(th), sn = Math.sin(th);
    for (const k in L) { const d = layers[k].depth; L[k].setAttribute('transform', `matrix(${c},0,0,1,${(1 - c) * 600 + d * sn * 1.6},0)`); }
  });
  const sweep = sel(svg, '#d_sweep');
  ticks.push(t => { const k = prog(t, 62.8, 66.6); sweep.setAttribute('opacity', k > 0 && k < 1 ? .8 : 0); sweep.setAttribute('y', 660 + 860 * k); });
  // measurement: clear space between tumour and vessels
  const meas = sel(svg, '#d_meas');
  meas.innerHTML = `<g transform="translate(540,1075) scale(1.4) translate(-660,-480)">
    <path d="M534,502 L562,502" stroke="#7fe0c3" stroke-width="3" stroke-dasharray="5 4"/>
    <path d="M539,496 L533,502 L539,508 M557,496 L563,502 L557,508" stroke="#7fe0c3" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  tl.fromTo(meas, { opacity: 0 }, { opacity: 1, duration: .4, immediateRender: true }, 68.1);
  const lab = svgEl(root);
  label(lab, 290, 1090, 210, 900, 'Tumour', 66.9, { color: '#ff9fcd', anchor: 'middle', size: 36 });
  label(lab, 424, 1330, 300, 1440, 'Vein', 64.7, { color: '#8fc2ff', anchor: 'end', size: 34 });
  label(lab, 487, 1360, 600, 1460, 'Artery', 64.95, { color: '#ff8f8f', anchor: 'start', size: 34 });
  label(lab, 383, 1106, 640, 1240, 'Tumour can now', 68.2, { color: '#7fe0c3', anchor: 'start', size: 34, sub: 'be separated from the vessel' });
  titleBlock(root, t0 - .3, 'Step 3 · Re-assessment', 'A <span class="hl">PET-CT scan</span> after 5 cycles', { size: 64, out: 62.2 });
  const t2 = el('div', { class: 'title', html: words('Special software builds a <span class="hl">3D map</span> of tumour and vessels'), style: 'top:374px;font-size:58px' }, root);
  revealWords(t2, 62.5);
  journey(root, t0, 2);
};

// =============================================================================
// E — the operation: 10 hours, Whipple resection, Japanese technique on the
// involved vessels (outer layer removed), vessels saved
// =============================================================================
SC.E = function () {
  const t0 = 94.85, t1 = 108.2;
  const root = scene('scE', t0, t1);
  // ---- part 1: clock
  const clk = el('div', { class: 'layer' }, root);
  const cs = svgEl(clk);
  const R = 250, CX = 540, CY = 1060;
  cs.innerHTML = `<g>
    <circle cx="${CX}" cy="${CY}" r="${R + 40}" fill="#0f2530" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="26"/>
    <circle id="e_arc" cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#ff8a6b" stroke-width="26" stroke-linecap="round" transform="rotate(-90 ${CX} ${CY})"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${CX + Math.sin(a) * (R - 46)}" y1="${CY - Math.cos(a) * (R - 46)}" x2="${CX + Math.sin(a) * (R - 64)}" y2="${CY - Math.cos(a) * (R - 64)}" stroke="rgba(255,255,255,.45)" stroke-width="5" stroke-linecap="round"/>`; }).join('')}
    <line id="e_hand" x1="${CX}" y1="${CY}" x2="${CX}" y2="${CY - R + 100}" stroke="#fff" stroke-width="8" stroke-linecap="round"/>
    <circle cx="${CX}" cy="${CY}" r="14" fill="#ff8a6b"/>
    </g>`;
  cs.innerHTML += `<text id="e_hrs" x="${CX}" y="${CY + R + 190}" text-anchor="middle" font-family="Fraunces" font-weight="600" font-size="110" fill="#fff">0 h</text>`;
  const arc = sel(cs, '#e_arc'), hand = sel(cs, '#e_hand'), hrs = sel(cs, '#e_hrs');
  const AC = 2 * Math.PI * R;
  arc.style.strokeDasharray = `${AC} ${AC}`;
  ticks.push(t => {
    const k = ease.io(prog(t, 95.0, 97.2));
    arc.style.strokeDashoffset = AC * (1 - k * 10 / 12);
    hand.setAttribute('transform', `rotate(${k * 10 * 360} ${CX} ${CY})`);
    hrs.textContent = Math.round(k * 10) + (Math.round(k * 10) === 1 ? ' hour' : ' hours');
  });
  tl.to(clk, { opacity: 0, scale: .9, duration: .5, ease: 'power2.in' }, 97.55);
  const tA = titleBlock(root, t0 - .3, 'Step 5 · Surgery', 'A <span class="hl">10-hour</span> operation', { size: 70, out: 97.5 });

  // ---- part 2/3: anatomy
  const an = el('div', { class: 'layer' }, root);
  const { svg, cam, W, world, fx, labels } = anatomyStage(an, 'e_', { stent: true, split: true, tumour: { x: 506, y: 502, r: 40 } });
  shades(an, true, true);
  sel(svg, '#e_tumWrap').style.display = 'none';
  tl.fromTo(an, { opacity: 0 }, { opacity: 1, duration: .6, immediateRender: true }, 97.5);
  camera(cam, [[97.4, 560, 470, 1.4, 540, 1120], [100.2, 560, 480, 1.5, 540, 1120], [101.7, 560, 530, 2.1, 540, 1100], [108.6, 565, 535, 2.25, 540, 1100]]);
  // specimen outline (Whipple): head of pancreas + duodenum + gallbladder + lower bile duct
  const spec = 'M298,240 C350,214 410,214 446,262 C462,290 470,330 486,344 C510,352 540,392 562,418 L574,426 C568,456 568,488 574,514 C600,548 650,540 690,556 C720,590 720,690 648,712 C560,724 410,724 330,684 C290,650 292,520 298,430 C302,360 282,290 298,240 Z';
  const sp = document.createElementNS(SVGNS, 'g'); fx.appendChild(sp);
  sp.innerHTML = `<path d="${spec}" fill="#ff8a6b" fill-opacity=".14"/><path id="e_specL" d="${spec}" fill="none" stroke="#fff" stroke-width="3.2" stroke-dasharray="12 9"/>`;
  const specL = sel(sp, '#e_specL'); const SL = specL.getTotalLength();
  tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: true }, 98.0);
  ticks.push(t => { specL.style.strokeDashoffset = -t * 30; });
  tl.fromTo(specL, { strokeDasharray: `0 ${SL}` }, { strokeDasharray: `${SL} 0`, duration: 1.2, ease: 'power2.inOut', immediateRender: true }, 98.0);
  tl.set(specL, { strokeDasharray: '12 9' }, 99.25);
  tl.to(sp, { opacity: 0, duration: .5 }, 101.2);
  label(labels, 520, 478, 640, 300, 'Tumour removed completely', 98.95, { k: 1.5, color: '#ffffff', anchor: 'middle', size: 38, sub: 'with the head of the pancreas', out: 101.1 });
  // vessel sheath (the involved outer layer) around SMV / SMA next to the tumour
  const sheath = document.createElementNS(SVGNS, 'g'); fx.appendChild(sheath);
  const sv = 'M577,470 C577,520 577,560 577,640', sa = 'M622,470 C622,520 622,580 622,640';
  const wav = (x, w) => { let d = `M${x},470`; for (let y = 470; y < 640; y += 14) d += ` Q${x + w},${y + 7} ${x},${y + 14}`; return d; };
  sheath.innerHTML = `
    <path d="${sv}" fill="none" stroke="#ffe9dd" stroke-opacity=".5" stroke-width="46" stroke-linecap="round"/>
    <path d="${sa}" fill="none" stroke="#ffe9dd" stroke-opacity=".5" stroke-width="38" stroke-linecap="round"/>
    ${[-15, -5, 5, 15].map(o => `<path d="${wav(577 + o, o % 10 ? 3 : -3)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.4"/>`).join('')}
    ${[-12, -3, 6, 13].map(o => `<path d="${wav(622 + o, o % 2 ? 3 : -3)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.4"/>`).join('')}`;
  tl.fromTo(sheath, { opacity: 0 }, { opacity: 1, duration: .5, immediateRender: true }, 102.3);
  // peel: the layer lifts off toward the specimen and fades
  tl.to(sheath, { x: -26, opacity: 0, duration: 1.6, ease: 'power2.inOut' }, 104.6);
  // dissection line between tumour and vessels
  const cut = document.createElementNS(SVGNS, 'path');
  cut.setAttribute('d', 'M560,440 C552,480 552,520 560,560 C566,590 570,620 572,650');
  cut.setAttribute('fill', 'none'); cut.setAttribute('stroke', '#7fe0c3'); cut.setAttribute('stroke-width', '3'); cut.setAttribute('stroke-linecap', 'round'); cut.setAttribute('filter', 'url(#e_glow)');
  fx.appendChild(cut);
  drawOn(cut, 103.3, 1.4);
  tl.to(cut, { opacity: 0, duration: .4 }, 106.6);
  // specimen (head, duodenum, gallbladder, lower bile duct, tumour) moves away; vessels stay
  const specParts = [W('headL'), W('duoL'), W('gbL'), W('cbdL'), W('tumour'), W('pductL'), W('papilla')];
  tl.to(specParts, { x: -70, y: 30, opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 106.4);
  const vg = glow(fx, ANAT.P.smv + ' ' + ANAT.P.portal, '#7fe0c3', 22), ag = glow(fx, ANAT.P.sma, '#7fe0c3', 18);
  pulseOn(vg, 107.05, 1.2, .95); pulseOn(ag, 107.15, 1.2, .95);
  const k = 2.15;
  label(labels, 600, 600, 790, 690, 'Involved vessels', 102.35, { k, color: '#ffffff', anchor: 'end', size: 38, out: 104.3 });
  label(labels, 640, 560, 790, 690, 'Outer layer removed', 104.4, { k, color: '#ffe7d6', anchor: 'end', size: 38, sub: 'along with the tumour', out: 106.9 });
  label(labels, 600, 600, 790, 690, 'Vessels saved', 107.15, { k, color: '#7fe0c3', anchor: 'end', size: 42 });
  const t2 = el('div', { class: 'title', html: words('Tumour removed with a special <span class="hl">Japanese technique</span>'), style: 'top:374px;font-size:60px' }, root);
  revealWords(t2, 100.3); hideEl(t2, 106.8);
  const t3 = el('div', { class: 'title', html: words('Tumour out — <span class="hl">vessels saved</span>'), style: 'top:374px;font-size:64px' }, root);
  revealWords(t3, 107.05);
  journey(root, t0, 4);
};

// =============================================================================
// F — Heidelberg technique: pancreas joined back to the intestine
// =============================================================================
SC.F = function () {
  const t0 = 113.95, t1 = 119.6;
  const root = scene('scF', t0, t1);
  const svg = svgEl(root);
  svg.innerHTML = `${ANAT.defs('f_')}
  <defs>
    <radialGradient id="f_cut" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#fff0c8"/><stop offset="1" stop-color="#eaa64a"/></radialGradient>
    <linearGradient id="f_bow" x1="0" x2="1"><stop offset="0" stop-color="#c4524e"/><stop offset=".45" stop-color="#f7aca2"/><stop offset="1" stop-color="#c4524e"/></linearGradient>
  </defs>
  <g id="f_all" transform="translate(0,40)">
    <!-- remaining pancreas coming in from the right; cut face at the left -->
    <g id="f_panc" filter="url(#f_soft)">
      <path d="M560,880 C700,860 900,840 1140,820 L1140,1160 C900,1140 700,1130 560,1150 Z" fill="url(#f_pancG)" filter="url(#f_lobTex)"/>
      <ellipse cx="560" cy="1015" rx="70" ry="135" fill="url(#f_cut)" stroke="#c07a26" stroke-width="3"/>
      <path d="M570,1015 C700,1010 900,1000 1140,990" stroke="#d98a2b" stroke-width="18" fill="none"/>
      <path d="M570,1015 C700,1010 900,1000 1140,990" stroke="#ffe7b0" stroke-width="9" fill="none"/>
      <ellipse cx="556" cy="1015" rx="9" ry="13" fill="#8a4b12"/>
    </g>
    <!-- loop of small intestine (jejunum) -->
    <g id="f_bowel">
      <path d="M260,1700 C260,1400 250,1150 300,980 C340,850 420,800 470,840" fill="none" stroke="#a23f3c" stroke-width="210" stroke-linecap="round"/>
      <path d="M260,1700 C260,1400 250,1150 300,980 C340,850 420,800 470,840" fill="none" stroke="url(#f_bow)" stroke-width="196" stroke-linecap="round"/>
      <path d="M260,1700 C260,1400 250,1150 300,980 C340,850 420,800 470,840" fill="none" stroke="#a63c3c" stroke-opacity=".22" stroke-width="180" stroke-dasharray="4 26"/>
      <ellipse cx="452" cy="1015" rx="30" ry="40" fill="#7d2228" id="f_hole" opacity="0"/>
    </g>
    <g id="f_stitch"></g>
    <g id="f_juice"></g>
  </g>`;
  shades(root, false, true);
  const bowel = sel(svg, '#f_bowel'), panc = sel(svg, '#f_panc');
  tl.fromTo(bowel, { x: -260, rotation: -6, svgOrigin: '300 1300' }, { x: 0, rotation: 0, svgOrigin: '300 1300', duration: 1.3, ease: 'power3.out', immediateRender: true }, 114.3);
  tl.fromTo(panc, { x: 160 }, { x: 0, duration: 1.3, ease: 'power3.out', immediateRender: true }, 114.3);
  tl.fromTo(sel(svg, '#f_hole'), { opacity: 0 }, { opacity: 1, duration: .3, immediateRender: true }, 115.5);
  // stitches: inner duct-to-mucosa ring, then outer layer
  const st = sel(svg, '#f_stitch');
  let sh = '';
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; sh += `<path class="si" d="M${556 + Math.cos(a) * 14},${1015 + Math.sin(a) * 19} L${474 + Math.cos(a) * 26},${1015 + Math.sin(a) * 34}" stroke="#4fb3ff" stroke-width="3.5" stroke-linecap="round"/>`; }
  for (let i = 0; i < 12; i++) { const y = 900 + i * 21; sh += `<path class="so" d="M520,${y} C500,${y + 6} 480,${y + 6} 462,${y}" stroke="#4fb3ff" stroke-width="4" fill="none" stroke-linecap="round"/>`; }
  st.innerHTML = sh;
  st.querySelectorAll('.si').forEach((p_, i) => tl.fromTo(p_, { opacity: 0 }, { opacity: 1, duration: .12, immediateRender: true }, 115.75 + i * .1));
  st.querySelectorAll('.so').forEach((p_, i) => tl.fromTo(p_, { opacity: 0 }, { opacity: 1, duration: .12, immediateRender: true }, 116.7 + i * .07));
  // after joining: the cut face snugs into the bowel
  tl.to(panc, { x: -34, duration: .6, ease: 'power2.inOut' }, 117.5);
  // pancreatic juice draining into the gut
  const ju = sel(svg, '#f_juice'); const jp = [];
  for (let i = 0; i < 18; i++) { const c = document.createElementNS(SVGNS, 'circle'); c.setAttribute('r', 6); c.setAttribute('fill', '#fff2b8'); ju.appendChild(c); jp.push({ c, ph: (i * .618) % 1, lane: ((i * .37) % 1) - .5 }); }
  ticks.push(t => {
    const on = prog(t, 117.9, 118.3);
    jp.forEach(q => {
      const u = (t * .5 + q.ph) % 1;
      const x = lerp(900, 470, Math.min(1, u * 1.4)) - Math.max(0, u * 1.4 - 1) * 200, y = 1015 + q.lane * 22 + Math.max(0, u * 1.4 - 1) * 260;
      q.c.setAttribute('cx', x); q.c.setAttribute('cy', y + 40); q.c.setAttribute('opacity', on * Math.sin(u * Math.PI));
    });
  });
  const lab = svgEl(root);
  label(lab, 840, 920, 860, 760, 'Remaining pancreas', 114.7, { color: '#ffd27a', anchor: 'middle', size: 36 });
  label(lab, 230, 1400, 330, 1500, 'Small intestine', 114.9, { color: '#ffb3a8', anchor: 'start', size: 36 });
  label(lab, 520, 1080, 640, 1290, 'Stitched layer by layer', 116.0, { color: '#8fd0ff', anchor: 'start', size: 34, sub: 'duct to intestinal lining' });
  titleBlock(root, t0 - .3, 'Heidelberg technique', 'Pancreas joined back <span class="hl">to the gut</span>', { size: 66 });
  const nt = el('div', { class: 'note', html: 'Bile duct and stomach are joined to the same loop', style: 'top:520px;font-size:22px;letter-spacing:.1em;color:rgba(169,188,196,.85)' }, root);
  tl.fromTo(nt, { opacity: 0 }, { opacity: 1, duration: .5, immediateRender: true }, 117.9);
  journey(root, t0, 4);
};


// =============================================================================
// G — final pathology report: tumour 100% removed
// =============================================================================
SC.G = function () {
  const t0 = 127.85, t1 = 135.15;
  const root = scene('scG', t0, t1);
  const doc = el('div', { style: 'position:absolute;left:150px;top:620px;width:780px;height:860px;border-radius:30px;background:linear-gradient(180deg,#fbfaf7,#efece6);box-shadow:0 40px 90px rgba(0,0,0,.5);overflow:hidden;' }, root);
  const bar = (w, o = .14) => `<div style="height:16px;border-radius:8px;background:rgba(11,26,33,${o});width:${w}%;margin:0 0 18px"></div>`;
  doc.innerHTML = `
    <div style="height:120px;background:#10262f;display:flex;align-items:center;padding:0 46px;gap:20px">
      <svg width="54" height="54" viewBox="0 0 24 24"><path d="M9 3h6M10 3v4l-3 9a4 4 0 0 0 4 5h2a4 4 0 0 0 4-5l-3-9V3" fill="none" stroke="#ff8a6b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div><div style="font:700 22px Inter;letter-spacing:.24em;color:#a9bcc4;text-transform:uppercase">Final</div>
      <div style="font:600 40px Fraunces;color:#fff;margin-top:4px">Pathology report</div></div></div>
    <div style="padding:46px 46px 0">${bar(62)}${bar(88)}${bar(74)}${bar(40, .1)}</div>
    <div class="res" style="position:absolute;left:46px;right:46px;top:380px;height:420px;border-radius:26px;background:#fff;border:2px solid rgba(11,26,33,.08);display:flex;align-items:center;gap:40px;padding:0 44px">
      <svg width="250" height="250" viewBox="0 0 250 250" style="flex:none">
        <circle cx="125" cy="125" r="104" fill="none" stroke="rgba(11,26,33,.08)" stroke-width="22"/>
        <circle class="rg" cx="125" cy="125" r="104" fill="none" stroke="#2bb594" stroke-width="22" stroke-linecap="round" transform="rotate(-90 125 125)"/>
        <text class="pc" x="125" y="146" text-anchor="middle" font-family="Fraunces" font-weight="700" font-size="66" fill="#10262f">0%</text>
      </svg>
      <div><div style="font:700 22px Inter;letter-spacing:.2em;color:#6b7f88;text-transform:uppercase">Tumour</div>
      <div style="font:600 54px/1.05 Fraunces;color:#10262f;margin-top:10px">Completely<br>removed</div>
      <div class="ok" style="display:inline-flex;align-items:center;gap:10px;margin-top:22px;padding:10px 22px;border-radius:30px;background:#2bb594;color:#fff;font:800 24px Inter;letter-spacing:.06em">${ico('check', 26, '#fff')} ACHIEVED</div></div>
    </div>`;
  tl.fromTo(doc, { y: 220, rotation: -4, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.0, ease: 'power3.out', immediateRender: true }, 127.7);
  const res = doc.querySelector('.res');
  tl.fromTo(res, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out', immediateRender: true }, 130.9);
  const rg = doc.querySelector('.rg'), pc = doc.querySelector('.pc'); const RC = 2 * Math.PI * 104;
  rg.style.strokeDasharray = `${RC} ${RC}`;
  ticks.push(t => { const k = ease.io(prog(t, 131.3, 132.4)); rg.style.strokeDashoffset = RC * (1 - k); pc.textContent = Math.round(k * 100) + '%'; });
  tl.fromTo(doc.querySelector('.ok'), { opacity: 0, scale: 1.8, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: .45, ease: 'back.out(2.2)', immediateRender: true }, 132.6);
  titleBlock(root, t0 - .3, 'And not only that', 'The final report: tumour <span class="hl">100% removed</span>', { size: 62 });
  journey(root, t0, 5);
};

// =============================================================================
// H — choose the pathway: long-term survival + quality of life
// =============================================================================
SC.H = function () {
  const t0 = 159.35, t1 = 167.2;
  const root = scene('scH', t0, t1);
  const svg = svgEl(root);
  const pathD = 'M540,1600 C860,1540 880,1390 600,1320 C300,1245 200,1120 470,1040 C760,955 860,860 540,790';
  svg.innerHTML = `
    <defs><filter id="h_glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="${pathD}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="56" stroke-linecap="round"/>
    <path id="h_track" d="${pathD}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>
    <path id="h_lit" d="${pathD}" fill="none" stroke="#ff8a6b" stroke-width="8" stroke-linecap="round" filter="url(#h_glow)"/>
    <g id="h_nodes"></g>
    <circle id="h_dot" r="16" fill="#fff" filter="url(#h_glow)"/>`;
  const lit = sel(svg, '#h_lit'), dot = sel(svg, '#h_dot'), nodesG = sel(svg, '#h_nodes');
  const PL = lit.getTotalLength();
  lit.style.strokeDasharray = `${PL} ${PL}`;
  const names = ['Diagnosis', 'Stent', 'Chemotherapy', 'PET-CT + 3D plan', 'Prehabilitation', 'Surgery', 'Recovery'];
  const us = names.map((_, i) => .02 + i * .96 / (names.length - 1));
  const tA = 159.7, tB = 162.9;
  names.forEach((n, i) => {
    const p = lit.getPointAtLength(PL * us[i]);
    const right = p.x < 540;
    const g = document.createElementNS(SVGNS, 'g');
    g.innerHTML = `<circle cx="${p.x}" cy="${p.y}" r="17" fill="#10262f" stroke="#ff8a6b" stroke-width="4"/>
      <circle class="in" cx="${p.x}" cy="${p.y}" r="8" fill="#ff8a6b"/>
      <text x="${p.x + (right ? 40 : -40)}" y="${p.y + 12}" text-anchor="${right ? 'start' : 'end'}" font-size="34" font-weight="700" fill="#f6f1ea">${n}</text>`;
    nodesG.appendChild(g);
    const tt = tA + (tB - tA) * us[i];
    tl.fromTo(g, { opacity: .2 }, { opacity: 1, duration: .25, immediateRender: true }, tt);
    tl.fromTo(g.querySelector('.in'), { attr: { r: 0 } }, { attr: { r: 8 }, duration: .3, ease: 'back.out(3)', immediateRender: true }, tt);
  });
  ticks.push(t => {
    const k = ease.io(prog(t, tA, tB));
    lit.style.strokeDashoffset = PL * (1 - k);
    const p = lit.getPointAtLength(PL * k); dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
    dot.setAttribute('opacity', k > 0 && k < 1 ? 1 : 0);
  });
  const badges = el('div', { style: 'position:absolute;left:0;right:0;top:600px;display:flex;justify-content:center;gap:24px' }, root);
  badges.innerHTML = `
    <div class="b1" style="display:flex;align-items:center;gap:14px;padding:18px 30px;border-radius:40px;background:#7fe0c3;color:#0b1a21;font:800 32px Inter">${ico('heart', 38, '#0b1a21')} Long-term survival</div>
    <div class="b2" style="display:flex;align-items:center;gap:14px;padding:18px 30px;border-radius:40px;background:#ff8a6b;color:#0b1a21;font:800 32px Inter">${ico('walk', 38, '#0b1a21')} Quality of life</div>`;
  tl.fromTo(badges.querySelector('.b1'), { opacity: 0, y: 30, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(2)', immediateRender: true }, 163.3);
  tl.fromTo(badges.querySelector('.b2'), { opacity: 0, y: 30, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(2)', immediateRender: true }, 165.4);
  titleBlock(root, t0 - .3, 'When cancer is found', 'Choose the <span class="hl">right pathway</span>', { size: 70 });
};

// =============================================================================
// build
// =============================================================================
function BUILD_SCENES() { Object.values(SC).forEach(f => f()); }
