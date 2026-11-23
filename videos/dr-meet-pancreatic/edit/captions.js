// Captions for the on-camera parts. Timed from the word-level transcript of the
// doctor's narration (Hindi/English mix) and written as clean English.
// [start, end, html]  — <b> marks the highlighted words.
const CAPTIONS = [
  [0.15, 4.85, 'One consultation that <b>changed everything.</b>'],
  [5.00, 6.95, 'Locally advanced <b>pancreatic cancer.</b>'],
  [7.05, 8.70, '<b>Not an easy case</b> to operate.'],
  [9.30, 12.65, 'In such cases, surgery is usually <b>not possible.</b>'],
  [12.80, 15.30, 'Can we make this tumour <b>operable?</b>'],
  [16.00, 18.90, 'Let me tell you about this <b>rare, special case.</b>'],
  [19.00, 21.30, '<b>Locally advanced</b> pancreatic cancer.'],
  [26.95, 30.75, 'So <b>upfront surgery</b> was not possible.'],
  [30.90, 35.35, 'Our whole team held a <b>multidisciplinary</b> consultation.'],
  [56.50, 59.45, 'After <b>5 cycles</b> of chemotherapy…'],
  [70.75, 72.90, 'That was the <b>turning point.</b>'],
  [73.10, 75.30, 'But it was <b>not the end</b> yet.'],
  [75.45, 79.30, 'First, <b>2 weeks</b> of special prehabilitation…'],
  [79.40, 83.10, '…to strengthen the chest, heart and <b>breathing muscles</b>…'],
  [83.25, 85.80, '…so that recovery would be <b>smooth.</b>'],
  [85.90, 88.30, 'Because this surgery would <b>not be simple.</b>'],
  [88.45, 90.00, 'Then came <b>the surgery.</b>'],
  [90.10, 94.70, 'A team that <b>specialises</b> in these cancers.'],
  [108.20, 109.90, 'It is <b>not an easy task.</b>'],
  [110.00, 114.10, 'But our specialised, <b>experienced team</b> could do it.'],
  [119.90, 122.90, 'Thanks to <b>extensive planning</b> before surgery…'],
  [123.20, 127.70, 'By <b>day 4</b>, walking and eating normally.'],
  [135.60, 140.40, 'In <b>selected patients</b> with locally advanced pancreatic cancer…'],
  [140.50, 145.70, '…<b>curative surgery</b> can become possible.'],
  [145.80, 152.40, 'With the <b>right preparation</b> before surgery.'],
  [152.80, 154.55, 'As I always say…'],
  [154.65, 159.20, 'A cancer diagnosis doesn’t mean <b>going straight to surgery.</b>'],
  [167.40, 170.40, 'Science with precision. <b>Always.</b>'],
];

(function buildCaptions() {
  const host = $('#caps');
  CAPTIONS.forEach(([a, b, html], i) => {
    const c = el('div', { class: 'cap', html: words(html.replace(/<b>/g, '<span class="hl">').replace(/<\/b>/g, '</span>')) }, host);
    // highlight groups are single spans; split them into words for the stagger but keep colour
    c.querySelectorAll('.w.hl').forEach(span => {
      const parts = span.textContent.split(/\s+/).filter(Boolean);
      span.outerHTML = parts.map(p => `<span class="w hl">${p}</span>`).join(' ');
    });
    tl.set(c, { opacity: 1 }, 0);
    const ws = c.querySelectorAll('.w');
    ws.forEach((w, j) => tl.fromTo(w, { opacity: 0, y: 22, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: .42, ease: 'power3.out', immediateRender: true }, a + j * 0.045));
    tl.to(c, { opacity: 0, y: -10, duration: .28, ease: 'power2.in' }, b - .28);
  });
})();
