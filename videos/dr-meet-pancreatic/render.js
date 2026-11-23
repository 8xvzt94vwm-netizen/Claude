#!/usr/bin/env node
// Renders the re-edit frame by frame (deterministic: every frame is a pure function
// of time) with several browser pages in parallel, then muxes the original audio.
//
// Usage:
//   node render.js --frames <dir of source frames %05d.jpg> --source <original.mp4>
//                  --out <final.mp4> [--work <tmp dir>] [--workers 4] [--scale 1]
//                  [--from 0] [--to 170.4] [--crf 17]
//
// Source frames: ffmpeg -i original.mp4 -q:v 2 -start_number 0 <dir>/%05d.jpg

const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
const FPS = 30;
const framesDir = path.resolve(args.frames);
const work = path.resolve(args.work || 'render-work');
const workers = +(args.workers || 4);
const scale = +(args.scale || 1);
const from = +(args.from || 0), to = +(args.to || 170.4);
const out = path.resolve(args.out || 'out.mp4');
const crf = args.crf || '17';
const page = 'file://' + path.join(__dirname, 'edit', 'index.html') + '?frames=' + encodeURIComponent(framesDir);

(async () => {
  fs.mkdirSync(work, { recursive: true });
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
  const todo = [];
  for (let f = f0; f < f1; f++) if (!fs.existsSync(path.join(work, `${String(f).padStart(5, '0')}.jpg`))) todo.push(f);
  console.log(`frames ${f0}..${f1 - 1}, ${todo.length} to render, ${workers} workers, scale ${scale}`);
  const browser = await chromium.launch();
  const t0 = Date.now();
  let done = 0;
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: scale });
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log(`[w${w}] pageerror:`, e.message));
    await p.goto(page, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    // contiguous chunk per worker keeps GSAP seeks short
    const n = Math.ceil(todo.length / workers);
    const mine = todo.slice(w * n, (w + 1) * n);
    for (const f of mine) {
      await p.evaluate(t => window.seek(t), f / FPS);
      await p.screenshot({ path: path.join(work, `${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 94 });
      done++;
      if (done % 150 === 0) {
        const el = (Date.now() - t0) / 1000;
        process.stdout.write(`\r  ${done}/${todo.length}  ${(done / el).toFixed(1)} fps  eta ${Math.round((todo.length - done) / (done / el))}s   `);
      }
    }
    await ctx.close();
  }));
  await browser.close();
  console.log(`\nrendered in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  // mux: rendered frames + the original narration track (gentle fade at the very end)
  const dur = (f1 - f0) / FPS;
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error',
    '-framerate', String(FPS), '-start_number', String(f0), '-i', path.join(work, '%05d.jpg'),
    '-ss', String(from), '-t', String(dur), '-i', path.resolve(args.source),
    '-map', '0:v', '-map', '1:a',
    '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-profile:v', 'high', '-level', '4.2',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-g', '60', '-r', String(FPS),
    '-af', `afade=t=out:st=${Math.max(0, dur - 0.45).toFixed(2)}:d=0.45`,
    '-c:a', 'aac', '-b:a', '256k', '-ar', '48000',
    '-movflags', '+faststart', '-t', String(dur), out], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status);
  console.log('wrote', out);
})().catch(e => { console.error(e); process.exit(1); });
