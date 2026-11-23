// Shared SVG illustrations for the Dr Meet Desai pancreatic-case edit.
// Anterior view, patient's right on the viewer's left (standard medical convention).
// Colour key (consistent in every scene):
//   arteries red, portal vein / SMV blue, bile duct green, pancreas warm yellow,
//   duodenum / bowel pink, liver red-brown, gallbladder green, tumour magenta.
// Layering follows real anatomy: the SMV/portal confluence sits BEHIND the pancreatic
// neck; the SMV and SMA run IN FRONT of the 3rd part of the duodenum; the bile duct
// passes behind D1 and through the head of the pancreas to the papilla on D2.
// World = 1000 x 1000 units; scenes move a camera over it.

window.ANAT = (() => {
  const C = {
    liverA: '#b4544a', liverB: '#6a2420',
    gbA: '#a6d46f', gbB: '#4a8a2c',
    bileA: '#b6e04c', bileB: '#4f8f18',
    stomA: '#f5b0a8', stomB: '#c65d5a',
    duoA: '#f7aca2', duoB: '#c4524e',
    pancA: '#ffe09a', pancB: '#e8a040', pancLob: '#f7c065',
    pductA: '#fff0c4', pductB: '#cf8a30',
    artA: '#ff6262', artB: '#a3161e',
    veinA: '#62a8ff', veinB: '#1c4c9a',
    spleenA: '#a7629a', spleenB: '#5a2753',
    tumA: '#ff86c0', tumB: '#c42476', tumC: '#7c0e47',
    jejA: '#f7b6ab', jejB: '#c9625b',
  };

  function tube(id, d, w, a, b, extra = '') {
    return `<g id="${id}" ${extra}>
      <path class="tb" d="${d}" fill="none" stroke="${b}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="tm" d="${d}" fill="none" stroke="${a}" stroke-width="${w * 0.66}" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="th" d="${d}" fill="none" stroke="#fff" stroke-opacity=".42" stroke-width="${Math.max(1.5, w * 0.16)}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${-w * 0.14},${-w * 0.14})"/>
    </g>`;
  }

  function defs(p) {
    return `<defs>
      <radialGradient id="${p}liverG" cx="30%" cy="25%" r="85%"><stop offset="0" stop-color="${C.liverA}"/><stop offset="1" stop-color="${C.liverB}"/></radialGradient>
      <radialGradient id="${p}gbG" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${C.gbA}"/><stop offset="1" stop-color="${C.gbB}"/></radialGradient>
      <radialGradient id="${p}stomG" cx="55%" cy="30%" r="75%"><stop offset="0" stop-color="${C.stomA}"/><stop offset="1" stop-color="${C.stomB}"/></radialGradient>
      <radialGradient id="${p}pancG" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="${C.pancA}"/><stop offset="1" stop-color="${C.pancB}"/></radialGradient>
      <radialGradient id="${p}spleenG" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${C.spleenA}"/><stop offset="1" stop-color="${C.spleenB}"/></radialGradient>
      <radialGradient id="${p}tumG" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="${C.tumA}"/><stop offset=".6" stop-color="${C.tumB}"/><stop offset="1" stop-color="${C.tumC}"/></radialGradient>
      <radialGradient id="${p}nodG" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#ffb0d6"/><stop offset=".7" stop-color="${C.tumB}"/><stop offset="1" stop-color="${C.tumC}"/></radialGradient>
      <pattern id="${p}lob" width="26" height="24" patternUnits="userSpaceOnUse">
        <circle cx="7" cy="7" r="7" fill="${C.pancLob}" opacity=".6"/>
        <circle cx="20" cy="17" r="6.5" fill="#fff6d8" opacity=".35"/>
        <circle cx="19" cy="5" r="3.2" fill="${C.pancB}" opacity=".28"/>
        <circle cx="6" cy="19" r="3" fill="${C.pancB}" opacity=".22"/>
      </pattern>
      <filter id="${p}lobTex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".055" numOctaves="2" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .85  0 0 0 1.3 -.62" result="spots"/>
        <feComposite in="spots" in2="SourceAlpha" operator="in" result="sp"/>
        <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="1" seed="3" result="n2"/>
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 .8  0 0 0 0 .48  0 0 0 0 .12  0 0 0 1.1 -.58" result="dk"/>
        <feComposite in="dk" in2="SourceAlpha" operator="in" result="dd"/>
        <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="sp"/><feMergeNode in="dd"/></feMerge>
      </filter>
      <linearGradient id="${p}fadeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset=".14" stop-color="#fff"/><stop offset=".76" stop-color="#fff"/><stop offset=".88" stop-color="#000"/></linearGradient>
      <mask id="${p}fadeM" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1400" height="1400"><rect x="-200" y="-60" width="1400" height="960" fill="url(#${p}fadeG)"/></mask>
      <filter id="${p}soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".35"/>
      </filter>
      <!-- inner shading: darkens the rim, lifts the centre -> rounded 3D look -->
      <filter id="${p}shade" x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="b"/>
        <feComposite in="SourceAlpha" in2="b" operator="arithmetic" k2="1" k3="-1" result="rim"/>
        <feFlood flood-color="#3a0d08" flood-opacity=".32"/><feComposite in2="rim" operator="in" result="rimC"/>
        <feOffset in="b" dx="-10" dy="-12" result="bo"/>
        <feComposite in="SourceAlpha" in2="bo" operator="arithmetic" k2="1" k3="-1" result="hl"/>
        <feFlood flood-color="#fff" flood-opacity=".22"/><feComposite in2="hl" operator="in" result="hlC"/>
        <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="rimC"/><feMergeNode in="hlC"/></feMerge>
      </filter>
      <filter id="${p}glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <pattern id="${p}mesh" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <path d="M0,0 L9,9 M9,0 L0,9" stroke="#f2f6f8" stroke-width="1.6"/></pattern>
      <clipPath id="${p}belowNeck"><rect x="-100" y="512" width="1200" height="600"/></clipPath>
      <clipPath id="${p}aboveStomach"><rect x="-100" y="-100" width="1200" height="430"/></clipPath>
    </defs>`;
  }

  const P = {
    liver: 'M-80,-60 L720,-60 C712,10 680,70 628,112 C585,146 530,178 488,204 C462,220 446,232 428,240 C404,250 380,256 352,254 C300,250 248,262 188,284 C120,308 30,326 -80,330 Z',
    gb: 'M402,232 C408,256 398,282 380,304 C362,328 338,346 314,342 C292,338 288,314 300,292 C312,268 342,246 372,232 Z',
    stomach: 'M632,34 L668,34 L664,62 C690,50 726,56 752,80 C790,116 804,180 796,240 C788,306 748,364 690,394 C630,424 548,424 486,414 L484,352 C512,346 540,330 560,304 C586,270 600,214 610,160 C616,126 622,96 630,70 Z',
    stomFolds: 'M700,110 C735,160 742,230 718,300 M664,120 C690,180 692,250 664,320 M630,190 C640,250 630,310 590,360 M560,360 C600,388 650,392 700,372',
    pancreas: 'M548,426 C510,420 444,418 408,428 C386,438 378,464 378,504 C378,560 382,598 400,616 C424,634 482,636 532,632 C572,628 604,622 610,606 C614,590 596,584 580,582 C566,566 562,540 566,516 C602,508 680,490 760,462 C820,442 878,428 918,412 C946,400 950,370 924,362 C880,358 820,372 760,390 C690,410 620,425 584,428 C570,428 558,427 548,426 Z',
    head: 'M548,426 C510,420 444,418 408,428 C386,438 378,464 378,504 C378,560 382,598 400,616 C424,634 482,636 532,632 C572,628 604,622 610,606 C614,590 596,584 580,582 C566,566 562,540 566,516 L574,512 C568,486 568,456 573,429 C566,428 557,427 548,426 Z',
    remnant: 'M572,430 C602,428 650,418 700,406 L762,390 C820,372 880,358 924,362 C950,370 946,400 918,412 C878,428 820,442 760,462 C680,490 620,504 574,512 C566,486 566,456 572,430 Z',
    pduct: 'M904,384 C850,398 790,414 730,432 C670,450 616,462 580,468 C548,474 520,482 494,500 C462,522 428,546 384,560',
    duodenum: 'M484,383 C452,384 414,384 386,392 C356,402 340,426 340,458 C340,520 340,580 344,606 C350,650 384,670 432,672 C502,674 570,674 620,666 C660,660 674,632 674,602 C674,588 672,574 668,560',
    jejunum: 'M668,560 C700,528 762,538 784,574 C808,614 792,662 752,682 C712,702 700,742 726,772 C752,800 822,800 862,770',
    chd: 'M452,226 C446,258 440,290 432,320',
    cystic: 'M384,246 C396,270 412,298 432,320',
    cbd: 'M432,320 C426,362 418,412 410,462 C404,500 398,532 384,560',
    portal: 'M575,472 C560,420 530,360 500,304 C486,276 474,254 464,232',
    smv: 'M575,800 C576,720 577,640 577,580 C577,530 576,498 575,472',
    splenicV: 'M575,472 C620,470 700,452 780,426 C840,406 880,394 912,388',
    sma: 'M622,436 C622,500 622,580 622,650 C622,710 620,760 618,800',
    hepA: 'M612,402 C580,398 540,380 516,350 C500,330 490,290 480,240',
    spleen: 'M904,276 C948,268 994,298 996,348 C998,398 970,436 932,438 C912,438 908,418 918,400 C930,378 918,358 902,352 C876,342 868,304 904,276 Z',
    ampulla: { x: 380, y: 560 },
  };

  function blob(cx, cy, r, seed = 1, lumps = 9, amp = 0.16, stretch = [1, 1]) {
    const pts = [];
    const n = 40;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + amp * Math.sin(a * lumps + seed) + amp * 0.5 * Math.sin(a * (lumps + 4) + seed * 2.3);
      pts.push([cx + Math.cos(a) * r * k * stretch[0], cy + Math.sin(a) * r * k * stretch[1]]);
    }
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d + 'Z';
  }

  // Tumour = cluster of nodules (reads as a mass, like the reference illustration).
  // `wrap` adds the lobes that creep in front of the SMV (vessel involvement).
  function tumour(p, cx, cy, r) {
    let s = `<g id="${p}tumour">`;
    s += `<path d="${blob(cx, cy, r, 1.3, 7, 0.1)}" fill="url(#${p}tumG)"/>`;
    const nod = [[-.48, -.3, .36], [.1, -.52, .34], [.5, -.18, .34], [.42, .36, .34], [-.12, .5, .36], [-.56, .2, .3], [0, 0, .42], [.18, .08, .26], [-.3, -.05, .24]];
    nod.forEach(([dx, dy, rr]) => {
      s += `<circle cx="${(cx + dx * r).toFixed(1)}" cy="${(cy + dy * r).toFixed(1)}" r="${(rr * r).toFixed(1)}" fill="url(#${p}nodG)" opacity=".92"/>`;
      s += `<ellipse cx="${(cx + dx * r - rr * r * .32).toFixed(1)}" cy="${(cy + dy * r - rr * r * .36).toFixed(1)}" rx="${(rr * r * .3).toFixed(1)}" ry="${(rr * r * .22).toFixed(1)}" fill="#fff" opacity=".3"/>`;
    });
    return s + '</g>';
  }
  function tumourWrap(p) {
    // lobes over the SMV / SMA at the neck level = "touching the main blood vessels"
    return `<g id="${p}tumWrap">
      <path d="${blob(578, 502, 34, 2.2, 6, 0.12, [1.3, 0.95])}" fill="url(#${p}tumG)" opacity=".95"/>
      <circle cx="580" cy="488" r="14" fill="url(#${p}nodG)"/><circle cx="604" cy="512" r="13" fill="url(#${p}nodG)"/>
      <circle cx="572" cy="516" r="12" fill="url(#${p}nodG)"/>
    </g>`;
  }

  // Full anatomy. opt.parts lets a scene drop pieces (e.g. after resection).
  function anatomy(p, opt = {}) {
    const t = opt.tumour || { x: 506, y: 502, r: 62 };
    return `${defs(p)}
    <g id="${p}world" mask="url(#${p}fadeM)">
      <g id="${p}spleenL" filter="url(#${p}soft)"><path d="${P.spleen}" fill="url(#${p}spleenG)" filter="url(#${p}shade)"/></g>
      <g id="${p}vesselsBack">
        ${tube(p + 'splenicV', P.splenicV, 20, C.veinA, C.veinB)}
        ${tube(p + 'portal', P.portal, 28, C.veinA, C.veinB)}
        ${tube(p + 'smvB', P.smv, 26, C.veinA, C.veinB)}
        ${tube(p + 'smaB', P.sma, 19, C.artA, C.artB)}
        ${tube(p + 'hepA', P.hepA, 12, C.artA, C.artB)}
      </g>
      ${opt.split ? `
      <g id="${p}remL" filter="url(#${p}soft)"><g filter="url(#${p}shade)"><path d="${P.remnant}" fill="url(#${p}pancG)" filter="url(#${p}lobTex)"/></g>
        <path d="${P.remnant}" fill="none" stroke="#b5671a" stroke-opacity=".45" stroke-width="2.5"/></g>
      <g id="${p}headL" filter="url(#${p}soft)"><g filter="url(#${p}shade)"><path d="${P.head}" fill="url(#${p}pancG)" filter="url(#${p}lobTex)"/></g>
        <path d="${P.head}" fill="none" stroke="#b5671a" stroke-opacity=".45" stroke-width="2.5"/></g>` : `
      <g id="${p}pancL" filter="url(#${p}soft)">
        <g filter="url(#${p}shade)"><path id="${p}pancreas" d="${P.pancreas}" fill="url(#${p}pancG)" filter="url(#${p}lobTex)"/></g>
        <path d="${P.pancreas}" fill="none" stroke="#b5671a" stroke-opacity=".45" stroke-width="2.5"/>
      </g>`}
      <g id="${p}pductL" opacity=".95">${tube(p + 'pduct', P.pduct, 10, C.pductA, C.pductB)}</g>
      <g id="${p}cbdL">${tube(p + 'cbd', P.cbd, 16, C.bileA, C.bileB)}
        ${opt.stent ? `<g id="${p}stentA"><path d="M386,566 C398,530 404,500 410,462 C414,436 418,412 421,392" fill="none" stroke="#7d8d95" stroke-width="15" stroke-linecap="round"/>
          <path d="M386,566 C398,530 404,500 410,462 C414,436 418,412 421,392" fill="none" stroke="url(#${p}mesh)" stroke-width="13" stroke-linecap="round"/></g>` : ''}</g>
      <g id="${p}duoL" filter="url(#${p}soft)">
        ${tube(p + 'jej', P.jejunum, 52, C.jejA, C.jejB)}
        <path d="${P.jejunum}" fill="none" stroke="#a63c3c" stroke-opacity=".16" stroke-width="44" stroke-dasharray="2.5 13"/>
        ${tube(p + 'duo', P.duodenum, 70, C.duoA, C.duoB)}
        <path d="${P.duodenum}" fill="none" stroke="#a63c3c" stroke-opacity=".16" stroke-width="62" stroke-dasharray="2.5 14"/>
      </g>
      <g id="${p}vesselsFront" clip-path="url(#${p}belowNeck)">
        ${tube(p + 'smv', P.smv, 26, C.veinA, C.veinB)}
        ${tube(p + 'sma', P.sma, 19, C.artA, C.artB)}
      </g>
      <g id="${p}stomachL" filter="url(#${p}soft)">
        <g filter="url(#${p}shade)"><path id="${p}stomach" d="${P.stomach}" fill="url(#${p}stomG)"/></g>
        <path d="${P.stomFolds}" stroke="#b04c49" stroke-opacity=".28" stroke-width="5" fill="none" stroke-linecap="round"/>
      </g>
      <g id="${p}bileUp">
        ${tube(p + 'chd', P.chd, 15, C.bileA, C.bileB)}
        ${tube(p + 'cystic', P.cystic, 11, C.bileA, C.bileB)}
        <g clip-path="url(#${p}aboveStomach)">${tube(p + 'cbdTop', 'M432,320 C430,340 428,356 426,372', 16, C.bileA, C.bileB)}</g>
      </g>
      <g id="${p}liverL" filter="url(#${p}soft)">
        <g filter="url(#${p}shade)"><path id="${p}liver" d="${P.liver}" fill="url(#${p}liverG)"/></g>
        <path d="M470,-60 C480,40 490,120 470,200" stroke="#5a1c18" stroke-opacity=".35" stroke-width="4" fill="none"/>
      </g>
      <g id="${p}gbL" filter="url(#${p}soft)"><path d="${P.gb}" fill="url(#${p}gbG)" filter="url(#${p}shade)"/></g>
      <circle id="${p}papilla" cx="${P.ampulla.x}" cy="${P.ampulla.y}" r="8" fill="#7d2228" stroke="#ffd0ca" stroke-width="2.5"/>
      ${tumourWrap(p)}
      ${tumour(p, t.x, t.y, t.r)}
    </g>
    <g id="${p}fx" mask="url(#${p}fadeM)"></g><g id="${p}labels"></g>`;
  }

  return { C, P, tube, defs, blob, tumour, tumourWrap, anatomy };
})();
