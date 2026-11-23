# Dr Meet Desai: pancreatic case (re-edit of v8)

This re-edit of `Dr_Meet_Pancreatic_Cancer_Case_Complete_Dialogue_v8.mp4` keeps the
narration track unchanged and rebuilds every graphic. The animations are timed to
the doctor's words, using a word-level transcript of the Hindi/English narration.

## What changed vs v8
- **Medically accurate full-screen animations** run while the doctor's voice continues:
  - **A, 21.5s.** Anatomy: tumour in the head of the pancreas encasing the SMV/SMA,
    plus the vessels that supply the intestine and liver.
  - **B, 35.5s.** ERCP biliary stent, drawn from the reference image. The duodenoscope
    sits in the duodenum and a guidewire passes through the papilla. A self-expanding
    metal stent opens the bile duct where the tumour narrows it, and bile drains again.
  - **C, 44s.** Neoadjuvant chemotherapy. The drug reaches the tumour through its
    feeding arteries. Over 5 cycles the tumour shrinks and space opens around the vessels.
  - **D, 59.5s.** Re-assessment: PET-CT, then software builds a 3D reconstruction of
    the tumour and vessels.
  - **E, 95s.** The 10-hour operation and the Whipple resection outline. A special
    Japanese technique removes the outer layer of the involved vessels with the tumour,
    so the vessels are saved.
  - **F, 114s.** Heidelberg technique: the pancreas is stitched back to the intestine
    layer by layer.
  - **G, 128s.** Final pathology report: tumour 100% removed.
  - **H, 159s.** "Choose the right pathway", ending on long-term survival and quality of life.
- **On-camera cards** (multidisciplinary team, 5 cycles, 2-week prehab, day-4 recovery,
  4 pillars), each timed to the words it illustrates.
- **Cuts:**
  - Jump cuts are covered by animation, or reframed with alternating punch-ins plus a
    short push-settle so they read as camera changes.
  - Scenes enter by rising out of the caption panel and leave by folding back into it.
- **Old burned-in graphics** are covered by a new caption panel and a brand tab.
  Accurate English captions replace the old ones.

## Build
```
npm install                       # gsap + fonts (copied into edit/lib, edit/fonts)
ffmpeg -i v8.mp4 -q:v 2 -start_number 0 frames/%05d.jpg
node render.js --frames frames --source v8.mp4 --out out.mp4 --workers 4
```
`edit/index.html?frames=<dir>` opens the compositor. `window.seek(t)` renders any
moment, because everything is a pure function of time.

Source files:
- `edit/core.js`: timeline, footage framing, transitions
- `edit/anatomy.js`: shared anatomy
- `edit/scenes.js`: scenes A–H
- `edit/cards.js`: on-camera cards
- `edit/captions.js`: captions

## Note
The source was the already-edited v8 file, with graphics burned in. Given the clean
camera footage, the same project can re-render without the cover panel.
