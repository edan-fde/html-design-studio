#!/usr/bin/env node
/**
 * export_deck_stage_pdf.mjs — PDF exporter for single-file <deck-stage> decks
 *
 * Usage:
 *   node export_deck_stage_pdf.mjs --html <deck.html> --out <file.pdf> [--width 1920] [--height 1080]
 *
 * When should you use this script?
 *   - Your deck is a **single HTML file**, every slide is a `<section>`, and `<deck-stage>` wraps them all
 *   - `export_deck_pdf.mjs`, which is designed for multi-file decks, does not apply
 *
 * Why not call `page.pdf()` directly? (Failure documented 2026-04-20)
 *   1. deck-stage's shadow CSS `::slotted(section) { display: none }` leaves only the active slide visible
 *   2. Even an outer `!important` rule in print media cannot override the shadow DOM rule
 *   3. The resulting PDF always contains only one page: the active slide
 *
 * Solution:
 *   After opening the HTML, use page.evaluate to remove all sections from the deck-stage slot,
 *   attach them to a regular div under body, force position:relative and fixed dimensions inline,
 *   set page-break-after: always on each section, and change the last one to auto to avoid a blank trailing page.
 *
 * Dependency: playwright
 *   npm install playwright
 *
 * Output characteristics:
 *   - Text remains vector-based (copyable and searchable)
 *   - 1:1 visual fidelity
 *   - Fonts must be loadable by Chromium (local fonts or Google Fonts)
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

function parseArgs() {
  const args = { width: 1920, height: 1080 };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.html || !args.out) {
    console.error('Usage: node export_deck_stage_pdf.mjs --html <deck.html> --out <file.pdf> [--width 1920] [--height 1080]');
    process.exit(1);
  }
  args.width = parseInt(args.width);
  args.height = parseInt(args.height);
  return args;
}

async function main() {
  const { html, out, width, height } = parseArgs();
  const htmlAbs = path.resolve(html);
  const outFile = path.resolve(out);

  await fs.access(htmlAbs).catch(() => {
    console.error(`HTML file not found: ${htmlAbs}`);
    process.exit(1);
  });

  console.log(`Rendering ${path.basename(htmlAbs)} → ${path.basename(outFile)}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();

  await page.goto('file://' + htmlAbs, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);  // Wait for Google Fonts and deck-stage initialization.

  // Core fix: remove sections from the shadow DOM slot and flatten them.
  const sectionCount = await page.evaluate(({ W, H }) => {
    const stage = document.querySelector('deck-stage');
    if (!stage) throw new Error('<deck-stage> not found — this script only supports the single-file deck-stage architecture');
    const sections = Array.from(stage.querySelectorAll(':scope > section'));
    if (!sections.length) throw new Error('No <section> found inside <deck-stage>');

    // Inject print styles.
    const style = document.createElement('style');
    style.textContent = `
      @page { size: ${W}px ${H}px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; background: #fff; }
      deck-stage { display: none !important; }
    `;
    document.head.appendChild(style);

    // Flatten under body.
    const container = document.createElement('div');
    container.id = 'print-container';
    sections.forEach(s => {
      // Inline styles get the highest priority; position:relative correctly constrains absolute children.
      s.style.cssText = `
        width: ${W}px !important;
        height: ${H}px !important;
        display: block !important;
        position: relative !important;
        overflow: hidden !important;
        page-break-after: always !important;
        break-after: page !important;
        margin: 0 !important;
        padding: 0 !important;
      `;
      container.appendChild(s);
    });
    // Do not break after the last page; this prevents a blank trailing page.
    const last = sections[sections.length - 1];
    last.style.pageBreakAfter = 'auto';
    last.style.breakAfter = 'auto';
    document.body.appendChild(container);
    return sections.length;
  }, { W: width, H: height });

  await page.waitForTimeout(800);

  await page.pdf({
    path: outFile,
    width: `${width}px`,
    height: `${height}px`,
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  const stat = await fs.stat(outFile);
  const kb = (stat.size / 1024).toFixed(0);
  console.log(`\n✓ Wrote ${outFile}  (${kb} KB, ${sectionCount} pages, vector)`);
  console.log(`  Verify the page count: mdimport "${outFile}" && pdfinfo "${outFile}" | grep Pages`);
}

main().catch(e => { console.error(e); process.exit(1); });
