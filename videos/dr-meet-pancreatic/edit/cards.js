// Floating cards over the desk area while the doctor is on camera.
// Each card is timed to the words it illustrates.
function card(t0, t1, html, opt = {}) {
  const c = el('div', { class: 'card', html, style: opt.style || '' }, $('#cards'));
  tl.fromTo(c, { opacity: 0, y: 40, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .55, ease: 'power3.out', immediateRender: true }, t0);
  tl.to(c, { opacity: 0, y: -16, duration: .35, ease: 'power2.in' }, t1 - .35);
  return c;
}
const ICON = {
  surgeon: '<path d="M12 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm-7 17c0-3.9 3.1-7 7-7s7 3.1 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 4.5h8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  drop: '<path d="M12 3c3 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 9 7 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  scan: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/>',
  scope: '<path d="M5 4c6 0 9 4 9 9v4a3 3 0 0 0 6 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  sleep: '<path d="M4 15h16M4 15a8 8 0 0 1 16 0M12 7V4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  lungs: '<path d="M12 4v8m0 0c-1.5 1-3 1-3 1M12 12c1.5 1 3 1 3 1M9 8C6 8 4 13 4 17c0 2 2 3 4 2l1-1V9zM15 8c3 0 5 5 5 9c0 2-2 3-4 2l-1-1V9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>',
  muscle: '<path d="M5 15c2-6 5-9 8-9l1 3-3 1 1 3c3-1 5 0 6 2-2 4-9 5-13 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  walk: '<circle cx="13" cy="4.5" r="2" fill="currentColor"/><path d="M11 21l2-6-2-3 1-4 3 3 3 1M9 12l1-4-3 2-1 3M13 15l3 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  plate: '<circle cx="12" cy="13" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 4v6m0 0v10M5 4v4a2 2 0 0 1-4 0V4M21 4c-2 0-3 2-3 5v3h3v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  food: '<path d="M4 12h16a8 8 0 0 1-16 0zM8 8c0-2 2-2 2-4M12 8c0-2 2-2 2-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  team: '<circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 19c0-3 3-5 6-5s6 2 6 5M10 19c0-3 3-5 6-5s6 2 6 5" fill="none" stroke="currentColor" stroke-width="2"/>',
  pill: '<rect x="3" y="8" width="18" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(-30 12 12)"/><path d="M12 7l-2 10" stroke="currentColor" stroke-width="2" transform="rotate(-30 12 12)"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
};
const ico = (n, sz = 44, col = 'currentColor') => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" style="color:${col}">${ICON[n]}</svg>`;

function BUILD_CARDS() {
  // opening kicker over the cinematic shots
  const kick = el('div', { html: 'One patient’s journey', style: 'position:absolute;left:0;right:0;top:1286px;text-align:center;font:700 24px Inter;letter-spacing:.3em;text-transform:uppercase;color:#ff8a6b' }, $('#cards'));
  tl.fromTo(kick, { opacity: 0, letterSpacing: '.5em' }, { opacity: 1, letterSpacing: '.3em', duration: .9, ease: 'power3.out', immediateRender: true }, .2);
  tl.to(kick, { opacity: 0, duration: .4 }, 15.0);

  // 1 — multidisciplinary team (30.9 – 35.4)
  {
    const sp = [['surgeon', 'Surgeon'], ['drop', 'Oncologist'], ['scan', 'Radiologist'], ['scope', 'Gastro'], ['sleep', 'Anaesthesia']];
    const c = card(30.95, 35.45, `
      <div style="position:absolute;left:0;right:0;top:26px;display:flex;justify-content:space-around;padding:0 26px">
        ${sp.map(([i, n]) => `<div class="sp" style="display:flex;flex-direction:column;align-items:center;gap:10px;width:150px">
          <div style="width:86px;height:86px;border-radius:50%;background:rgba(255,255,255,.06);border:2px solid rgba(127,224,195,.55);display:flex;align-items:center;justify-content:center;color:#7fe0c3">${ico(i, 44)}</div>
          <div style="font:700 23px Inter;color:#dfe8ec">${n}</div></div>`).join('')}
      </div>
      <svg class="ln" width="940" height="270" style="position:absolute;left:0;top:0">${[0, 1, 2, 3, 4].map(i => `<path d="M${94 + i * 188},150 C${94 + i * 188},200 470,190 470,214" fill="none" stroke="#7fe0c3" stroke-opacity=".6" stroke-width="2.5"/>`).join('')}</svg>
      <div class="plan" style="position:absolute;left:50%;top:206px;transform:translateX(-50%);padding:10px 26px;border-radius:30px;background:#ff8a6b;color:#0b1a21;font:800 25px Inter;letter-spacing:.06em;white-space:nowrap">ONE TREATMENT PLAN</div>`);
    c.querySelectorAll('.sp').forEach((d, i) => tl.fromTo(d, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45, ease: 'back.out(2)', immediateRender: true }, 31.2 + i * .18));
    const ln = c.querySelectorAll('.ln path');
    ln.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: .6, immediateRender: true }, 34.1); });
    tl.fromTo(c.querySelector('.plan'), { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2)', immediateRender: true }, 34.4);
  }
  // 2 — five cycles of chemotherapy (56.5 – 59.5)
  {
    const c = card(56.55, 59.5, `
      <div style="position:absolute;left:0;right:0;top:34px;text-align:center;font:700 24px Inter;letter-spacing:.22em;color:#a9bcc4;text-transform:uppercase">Chemotherapy cycles</div>
      <div style="position:absolute;left:0;right:0;top:92px;display:flex;justify-content:center;gap:26px">
        ${[1, 2, 3, 4, 5].map(i => `<div class="cy" style="width:104px;height:104px;border-radius:50%;border:3px solid rgba(127,224,195,.45);display:flex;align-items:center;justify-content:center;font:800 42px Inter;color:rgba(255,255,255,.5)">${i}</div>`).join('')}
      </div>
      <div class="ok" style="position:absolute;left:0;right:0;top:214px;text-align:center;font:700 25px Inter;color:#7fe0c3">${ico('check', 26, '#7fe0c3')} Completed — then re-assessed</div>`);
    c.querySelectorAll('.cy').forEach((d, i) => tl.fromTo(d, { backgroundColor: 'rgba(0,0,0,0)', color: 'rgba(255,255,255,.5)' }, { backgroundColor: '#7fe0c3', color: '#0b1a21', duration: .18, immediateRender: true }, 57.55 + i * .16));
    tl.fromTo(c.querySelector('.ok'), { opacity: 0 }, { opacity: 1, duration: .4, immediateRender: true }, 58.6);
  }
  // 3 — prehabilitation (75.5 – 88.3)
  {
    const days = Array.from({ length: 14 }, (_, i) => `<div class="d" style="width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.08)"></div>`).join('');
    const items = [['muscle', 'Chest', 80.3], ['heart', 'Heart', 81.0], ['lungs', 'Breathing', 81.6]];
    const c = card(75.5, 88.25, `
      <div style="position:absolute;left:40px;top:34px;font:700 24px Inter;letter-spacing:.2em;color:#a9bcc4;text-transform:uppercase">Prehabilitation</div>
      <div class="wk" style="position:absolute;left:40px;top:72px;font:600 64px Fraunces;color:#fff">2 weeks</div>
      <div style="position:absolute;left:40px;top:168px;display:grid;grid-template-columns:repeat(7,30px);gap:10px">${days}</div>
      <div style="position:absolute;right:36px;top:40px;display:flex;gap:20px">
        ${items.map(([i, n]) => `<div class="it" style="display:flex;flex-direction:column;align-items:center;gap:12px;width:128px">
          <div class="ib" style="width:104px;height:104px;border-radius:30px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;color:#ff8a6b">${ico(i, 56)}</div>
          <div style="font:700 24px Inter;color:#dfe8ec">${n}</div></div>`).join('')}
      </div>
      <div class="opt" style="position:absolute;right:36px;top:206px;width:424px;text-align:center;padding:10px 0;border-radius:24px;background:rgba(127,224,195,.16);color:#7fe0c3;font:800 24px Inter;letter-spacing:.08em">${ico('check', 24, '#7fe0c3')} OPTIMISED FOR SURGERY</div>`);
    c.querySelectorAll('.d').forEach((d, i) => tl.fromTo(d, { backgroundColor: 'rgba(255,255,255,.08)' }, { backgroundColor: '#ff8a6b', duration: .12, immediateRender: true }, 76.3 + i * .16));
    c.querySelectorAll('.it').forEach((d, i) => {
      tl.fromTo(d, { opacity: .25 }, { opacity: 1, duration: .3, immediateRender: true }, items[i][2]);
      tl.fromTo(d.querySelector('.ib'), { scale: 1, borderColor: 'rgba(255,255,255,.12)' }, { scale: 1.1, borderColor: '#ff8a6b', duration: .25, yoyo: true, repeat: 1, immediateRender: true }, items[i][2]);
    });
    tl.fromTo(c.querySelector('.opt'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45, immediateRender: true }, 83.5);
  }
  // 4 — recovery by day 4 (123.2 – 127.7)
  {
    const c = card(123.2, 127.7, `
      <div style="position:absolute;left:40px;top:34px;font:700 24px Inter;letter-spacing:.2em;color:#a9bcc4;text-transform:uppercase">After surgery</div>
      <div style="position:absolute;left:40px;right:40px;top:90px;height:6px;border-radius:3px;background:rgba(255,255,255,.12)"><div class="bar" style="height:6px;border-radius:3px;background:#7fe0c3;width:0%"></div></div>
      <div style="position:absolute;left:40px;right:40px;top:70px;display:flex;justify-content:space-between">
        ${[1, 2, 3, 4].map(i => `<div class="dy" style="display:flex;flex-direction:column;align-items:center;gap:12px"><div style="width:46px;height:46px;border-radius:50%;background:#10262f;border:3px solid ${i === 4 ? '#7fe0c3' : 'rgba(255,255,255,.3)'}"></div><div style="font:700 24px Inter;color:${i === 4 ? '#7fe0c3' : '#a9bcc4'}">Day ${i}</div></div>`).join('')}
      </div>
      <div style="position:absolute;left:0;right:0;top:186px;display:flex;justify-content:center;gap:28px">
        <div class="wa" style="display:flex;align-items:center;gap:12px;padding:10px 24px;border-radius:30px;background:rgba(127,224,195,.16);color:#7fe0c3;font:800 26px Inter">${ico('walk', 34, '#7fe0c3')} Walking</div>
        <div class="ea" style="display:flex;align-items:center;gap:12px;padding:10px 24px;border-radius:30px;background:rgba(127,224,195,.16);color:#7fe0c3;font:800 26px Inter">${ico('food', 34, '#7fe0c3')} Eating normally</div>
      </div>`);
    tl.fromTo(c.querySelector('.bar'), { width: '0%' }, { width: '100%', duration: 1.2, ease: 'power2.inOut', immediateRender: true }, 123.5);
    tl.fromTo(c.querySelector('.wa'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, immediateRender: true }, 125.3);
    tl.fromTo(c.querySelector('.ea'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .4, immediateRender: true }, 126.3);
  }
  // 5 — what made it possible (145.8 – 152.4)
  {
    const pil = [['muscle', 'Prehabilitation', 146.55], ['food', 'Nutrition', 148.55], ['drop', 'Chemotherapy', 149.45], ['team', 'Team planning', 150.8]];
    const c = card(145.85, 152.45, `
      <div style="position:absolute;left:0;right:0;top:30px;display:flex;justify-content:space-around;padding:0 20px">
        ${pil.map(([i, n]) => `<div class="pl" style="display:flex;flex-direction:column;align-items:center;gap:14px;width:210px">
          <div style="width:110px;height:110px;border-radius:32px;background:rgba(255,138,107,.14);border:2px solid rgba(255,138,107,.6);display:flex;align-items:center;justify-content:center;color:#ff8a6b">${ico(i, 58)}</div>
          <div style="font:700 25px Inter;color:#f6f1ea;text-align:center">${n}</div></div>`).join('')}
      </div>`);
    c.querySelectorAll('.pl').forEach((d, i) => tl.fromTo(d, { opacity: 0, y: 24, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(2)', immediateRender: true }, pil[i][2]));
  }
}
function BUILD() { BUILD_SCENES(); BUILD_CARDS(); tl.time(0); }
// gentle fade-out on the very last frames
(function () { tl.fromTo('#docFade', { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power1.in', immediateRender: true }, 169.95); })();
