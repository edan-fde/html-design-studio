#!/usr/bin/env node
/**
 * gen_deck_thumbs.mjs — Generate per-slide thumbnails for a multi-file deck (used by deck_index.html's Infinite Gallery overview).
 *
 * Background: deck_index.html offers two overview modes:
 *   · Grid (default 60%): renders actual child pages in iframes. It is sharp and WYSIWYG, with no thumbnails required.
 *   · Infinite Gallery (40%): tiles every slide seamlessly and drifts slowly. Dozens or hundreds of iframe tiles are expensive,
 *     so the gallery uses <img> thumbnails instead; repeated images are decoded once and remain smooth.
 *   This script prepares those gallery thumbnails. Grid mode does not need them.
 *
 * Usage (copy to the deck project root, install dependencies, then run):
 *   npm install playwright sharp
 *   node gen_deck_thumbs.mjs --slides slides --out thumbs [--width 1600] [--quality 86]
 *
 * Then add a thumb to each item in index.html's MANIFEST (same base name as file, with .jpg):
 *   { file: "slides/01-cover.html", thumb: "thumbs/01-cover.jpg", label: "Cover" }
 * deck_index.html uses thumb only in Gallery mode; Grid mode always uses file (iframe). Without a thumb, Gallery falls back to an iframe.
 *
 * Tip: do not set thumbnail resolution too low (default: 1600px), or cards will look blurry when enlarged on hover.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const slidesDir = arg('slides', 'slides');
const outDir = arg('out', 'thumbs');
const width = parseInt(arg('width', '1600'), 10);
const quality = parseInt(arg('quality', '86'), 10);
const W = parseInt(arg('canvas-w', '1920'), 10);
const H = parseInt(arg('canvas-h', '1080'), 10);

if (!fs.existsSync(slidesDir)) { console.error('Slides directory not found: ' + slidesDir); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const files = fs.readdirSync(slidesDir).filter(f => f.endsWith('.html')).sort();
if (!files.length) { console.error('No .html files found in the slides directory'); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
let ok = 0;
for (const f of files) {
  const base = f.replace(/\.html$/, '');
  const out = path.join(outDir, base + '.jpg');
  try {
    await page.goto('file://' + path.resolve(slidesDir, f), { waitUntil: 'load' });
    await page.waitForTimeout(2800);                 // Wait for webfonts and images to paint.
    const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
    await sharp(buf).resize(width).jpeg({ quality }).toFile(out);
    ok++; console.log('[ok] ' + out);
  } catch (e) { console.error('[FAIL] ' + f + ': ' + e.message); }
}
await browser.close();
console.log(`\n=== ${ok}/${files.length} thumbnails → ${outDir}/ ===`);
console.log('Add thumb: "' + outDir + '/<same-name>.jpg" to each item in index.html\'s MANIFEST (Gallery mode only)');
