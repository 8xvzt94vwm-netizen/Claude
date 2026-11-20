#!/usr/bin/env node
// Renders an HTML/CSS-animated story page to an Instagram-ready MP4.
// Every CSS animation is paused and stepped frame by frame, so the output is
// deterministic and perfectly smooth regardless of machine speed.
//
// Usage: node stories/render.js <story.html> <out.mp4> [seconds=7] [fps=30]
// Also writes <out>-cover.png (the final frame) for use as a still story.

const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const [, , htmlArg, outArg, secArg = '7', fpsArg = '30'] = process.argv;
if (!htmlArg || !outArg) {
  console.error('Usage: node stories/render.js <story.html> <out.mp4> [seconds] [fps]');
  process.exit(1);
}
const seconds = Number(secArg);
const fps = Number(fpsArg);
const totalFrames = Math.round(seconds * fps);
const W = 1080, H = 1920;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(htmlArg), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fontsOk = await page.evaluate(() =>
    [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.style} ${f.weight}`));
  console.log('Fonts loaded:', fontsOk.length ? fontsOk.join(', ') : 'NONE (fallback fonts in use!)');

  await page.evaluate(() => document.getAnimations().forEach(a => a.pause()));

  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
    '-t', String(seconds),
    '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-profile:v', 'high', '-level', '4.2',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-g', String(fps), '-r', String(fps),
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    outArg,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  let last;
  for (let i = 0; i < totalFrames; i++) {
    const ms = (i / fps) * 1000;
    await page.evaluate(t => document.getAnimations().forEach(a => { a.currentTime = t; }), ms);
    last = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(last)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % fps === 0) process.stdout.write(`\r  frame ${i}/${totalFrames}`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  process.stdout.write(`\r  frame ${totalFrames}/${totalFrames}\n`);

  const cover = outArg.replace(/\.mp4$/i, '') + '-cover.png';
  fs.writeFileSync(cover, last);
  await browser.close();
  console.log('Wrote', outArg, 'and', cover);
})().catch(e => { console.error(e); process.exit(1); });
