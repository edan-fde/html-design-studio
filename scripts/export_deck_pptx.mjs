#!/usr/bin/env node
/**
 * export_deck_pptx.mjs — Export a multi-file slide deck as an editable PPTX
 *
 * Usage:
 *   node export_deck_pptx.mjs --slides <dir> --out <file.pptx>
 *
 * Behavior:
 *   - Uses scripts/html2pptx.js to translate each HTML DOM element into a native PowerPoint object
 *   - Text is stored in real text boxes and can be edited directly in PowerPoint
 *   - Body dimensions are 960pt × 540pt (LAYOUT_WIDE, 13.333″ × 7.5″)
 *
 * ⚠️ HTML must satisfy four non-negotiable constraints (see references/editable-pptx.md):
 *   1. Wrap text in <p>/<h1>-<h6> (do not place text directly in a div)
 *   2. Do not use CSS gradients
 *   3. <p>/<h*> elements cannot have background/border/shadow (put those on a wrapper div)
 *   4. Do not use background-image on divs (use <img>)
 *
 * Visually unconstrained HTML will almost never pass; follow these constraints from the first line.
 * For work that prioritizes visual freedom (animation, web components, CSS gradients, complex SVG),
 * export a PDF with export_deck_pdf.mjs / export_deck_stage_pdf.mjs instead.
 *
 * Dependencies: npm install playwright pptxgenjs sharp
 *
 * Files are sorted by name (01-xxx.html → 02-xxx.html → ...).
 */

import pptxgen from 'pptxgenjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.slides || !args.out) {
    console.error('Usage: node export_deck_pptx.mjs --slides <dir> --out <file.pptx>');
    console.error('');
    console.error('⚠️ HTML must satisfy four non-negotiable constraints (see references/editable-pptx.md).');
    console.error('   For visually unconstrained work, export a PDF with export_deck_pdf.mjs instead.');
    process.exit(1);
  }
  return args;
}

async function main() {
  const { slides, out } = parseArgs();
  const slidesDir = path.resolve(slides);
  const outFile = path.resolve(out);

  const files = (await fs.readdir(slidesDir))
    .filter(f => f.endsWith('.html'))
    .sort();
  if (!files.length) {
    console.error(`No .html files found in ${slidesDir}`);
    process.exit(1);
  }

  console.log(`Converting ${files.length} slides via html2pptx...`);

  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  let html2pptx;
  try {
    html2pptx = require(path.join(__dirname, 'html2pptx.js'));
  } catch (e) {
    console.error(`✗ Failed to load html2pptx.js: ${e.message}`);
    console.error(`  If dependencies are missing, run: npm install playwright pptxgenjs sharp`);
    process.exit(1);
  }

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inches, corresponding to an HTML body of 960 × 540 pt

  const errors = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const fullPath = path.join(slidesDir, f);
    try {
      await html2pptx(fullPath, pres);
      console.log(`  [${i + 1}/${files.length}] ${f} ✓`);
    } catch (e) {
      console.error(`  [${i + 1}/${files.length}] ${f} ✗  ${e.message}`);
      errors.push({ file: f, error: e.message });
    }
  }

  if (errors.length) {
    console.error(`\n⚠️ ${errors.length} slides failed to convert. The most common cause is HTML that violates the four constraints.`);
    console.error(`  See "Common Error Cheatsheet" in references/editable-pptx.md.`);
    if (errors.length === files.length) {
      console.error(`✗ Every slide failed; no PPTX will be generated.`);
      process.exit(1);
    }
  }

  await pres.writeFile({ fileName: outFile });
  console.log(`\n✓ Wrote ${outFile}  (${files.length - errors.length}/${files.length} slides, editable PPTX)`);
}

main().catch(e => { console.error(e); process.exit(1); });
