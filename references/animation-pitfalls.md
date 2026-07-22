# Animation Pitfalls: Hard-Won Rules for HTML Animation

The most common animation bugs and how to prevent them. Every rule comes from a real failure.

Read this before writing animation; it can save an entire iteration.

## 1. Layered Layouts: Make `position: relative` the Default for Layered Containers

**Failure:** one `sentence-wrap` element contained three `bracket-layer` children using `position: absolute`. Because `sentence-wrap` had no `position: relative`, the absolute brackets used `.canvas` as their coordinate system and drifted 200 px beyond the bottom of the screen.

**Rules:**
- Every container with `position: absolute` descendants **must** explicitly set `position: relative`.
- Even when the container itself needs no visual offset, write `position: relative` to establish the coordinate-system anchor.
- Whenever you write `.parent { ... }` and a descendant has `.child { position: absolute }`, instinctively add `position: relative` to the parent.

**Quick check:** for every `position: absolute`, walk upward through its ancestors and confirm that the nearest positioned ancestor is the coordinate system you **intend**.

## 2. Character Traps: Never Depend on Rare Unicode

**Failure:** `␣` (U+2423 OPEN BOX) was used to visualize a “space token.” Neither Noto Serif SC nor Cormorant Garamond contained the glyph, so it rendered as blank or tofu and the audience saw nothing.

**Rules:**
- **Every character that appears in an animation must exist in the chosen typeface.**
- Common rare-character blocklist: `␣ ␀ ␐ ␋ ␨ ↩ ⏎ ⌘ ⌥ ⌃ ⇧ ␦ ␖ ␛`.
- Represent metacharacters such as Space, Enter, and Tab with **semantic boxes built in CSS**:
  ```html
  <span class="space-key">Space</span>
  ```
  ```css
  .space-key {
    display: inline-flex;
    padding: 4px 14px;
    border: 1.5px solid var(--accent);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.3em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  ```
- Verify emoji as well. Some emoji fall back to gray squares outside Noto Emoji. Prefer an `emoji` font family or SVG.

## 3. Data-Driven Grid and Flex Templates

**Failure:** JavaScript defined `const N = 6` tokens, but CSS hard-coded `grid-template-columns: 80px repeat(5, 1fr)`. The sixth token had no column and the entire matrix became misaligned.

**Rules:**
- When a count comes from a JavaScript array such as `TOKENS.length`, make the CSS template data-driven as well.
- Option A: inject a CSS variable from JavaScript.
  ```js
  el.style.setProperty('--cols', N);
  ```
  ```css
  .grid { grid-template-columns: 80px repeat(var(--cols), 1fr); }
  ```
- Option B: let the browser expand automatically with `grid-auto-flow: column`.
- **Never combine a fixed CSS number with a JavaScript constant.** Changing `N` will not update the CSS.

## 4. Transition Gaps: Scene Changes Must Remain Continuous

**Failure:** between `zoom1` at 13–19 s and `zoom2` at 19.2–23 s, the main sentence was already hidden. A 0.6 s `zoom1` fade-out + 0.6 s `zoom2` fade-in + stagger delays of 0.2 s or more created approximately one second of complete blank screen. The audience thought the animation had frozen.

**Rules:**
- When scenes change continuously, fade-out and fade-in must **overlap in a crossfade**. Do not wait until one scene is fully gone before starting the next.
  ```js
  // Bad:
  if (t >= 19) hideZoom('zoom1');      // Starts exit at 19.0 s
  if (t >= 19.4) showZoom('zoom2');    // Starts entrance at 19.4 s → 0.4 s gap

  // Good:
  if (t >= 18.6) hideZoom('zoom1');    // Begin fade-out 0.4 s early
  if (t >= 18.6) showZoom('zoom2');    // Fade in simultaneously
  ```
- Alternatively, use an anchor element such as the main sentence as a visual bridge and reveal it briefly during the zoom transition.
- Calculate CSS transition durations precisely; never trigger the next transition before the previous one is complete unless the overlap is intentional.

## 5. Pure Render Principle: Animation State Must Be Seekable

**Failure:** animation state was triggered through a chain of `setTimeout` calls and `fireOnce(key, fn)`. Normal playback worked, but frame-by-frame recording and arbitrary seeking could not “go back in time” after earlier timers had already fired.

**Rules:**
- Ideally, `render(t)` is a **pure function**: one value of `t` produces exactly one DOM state.
- If side effects such as class changes are unavoidable, use a `fired` set and explicit reset:
  ```js
  const fired = new Set();
  function fireOnce(key, fn) { if (!fired.has(key)) { fired.add(key); fn(); } }
  function reset() { fired.clear(); /* Remove every .show class */ }
  ```
- Expose `window.__seek(t)` for Playwright and debugging:
  ```js
  window.__seek = (t) => { reset(); render(t); };
  ```
- Animation-related `setTimeout` calls should never span more than one second; longer timers break when seeking backward.

## 6. Measuring Before Fonts Load Means Measuring the Wrong Layout

**Failure:** `charRect(idx)` ran immediately on `DOMContentLoaded` to measure bracket positions. The font had not loaded, so every character width came from the fallback face. When the actual font arrived roughly 500 ms later, each bracket's old `left: Xpx` remained permanently offset.

**Rules:**
- Wrap any layout code that depends on DOM measurement—`getBoundingClientRect`, `offsetWidth`, and similar—in `document.fonts.ready.then()`:
  ```js
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      buildBrackets(...);  // Fonts are ready, so measurements are accurate
      tick();              // Start animation
    });
  });
  ```
- The extra `requestAnimationFrame` gives the browser one frame to commit layout.
- When using Google Fonts CDN, add `<link rel="preconnect">` to accelerate the first load.

## 7. Prepare for Recording: Expose the Hooks Video Export Needs

**Failure:** Playwright `recordVideo` defaults to 25 fps and begins recording as soon as the context is created. The first two seconds of page and font loading entered the recording, leaving two seconds of blank or flashing video before the content.

**Rules:**
- Use `render-video.js` to handle warmup navigation → reload to restart the animation → wait for duration → trim the head and convert to H.264 MP4 with `ffmpeg`.
- **Frame zero** must be the complete initial state with the final layout already in place, never a blank or loading state.
- Need 60 fps? Post-process with `ffmpeg` rather than relying on the browser's source frame rate.
- Need GIF? Use a two-pass palette workflow—`palettegen` + `paletteuse`. A 30-second 1080p animation can be compressed to roughly 3 MB.

See `video-export.md` for complete script usage.

## 8. Batch Export: Include the PID in Temporary Directory Names

**Failure:** three `render-video.js` processes recorded three HTML files in parallel. `TMP_DIR` used only `Date.now()`. All three launched in the same millisecond and shared one temporary directory. The first process to finish removed the directory; the other two encountered `ENOENT` and crashed.

**Rules:**
- Every temporary directory that might be shared by multiple processes must include a **PID or random suffix**:
  ```js
  const TMP_DIR = path.join(DIR, '.video-tmp-' + Date.now() + '-' + process.pid);
  ```
- If several files genuinely need parallel processing, use shell `&` + `wait` rather than forking from one Node script.
- For batch recording, be conservative: at most two files in parallel; queue three or more sequentially.

## 9. Progress Bars and Replay Buttons in the Recording: UI Chrome Contaminates the Video

**Failure:** the animation HTML included a `.progress` bar, `.replay` button, and `.counter` timestamp for convenient human debugging. They appeared at the bottom of the delivered MP4 as though developer tools had been captured.

**Rules:**
- Manage human-facing “chrome”—progress bar, replay button, footer, masthead, counter, phase labels—separately from the video content.
- Standardize on the class `.no-record`. The recording script automatically hides any element with this class.
- `render-video.js` should inject CSS that hides common chrome selectors by default:
  ```
  .progress .counter .phases .replay .masthead .footer .no-record [data-role="chrome"]
  ```
- Inject with Playwright `addInitScript` so it runs before every navigation and survives reloads.
- Add a `--keep-chrome` flag when the original HTML, including chrome, should remain visible.

## 10. The First Seconds Repeat: Warmup Frames Leaked into the Recording

**Failure:** the old `render-video.js` flow was `goto → wait 1.5 s for fonts → reload → wait for duration`. Recording began when the context was created, so the animation played partway through during warmup and then restarted from zero after reload. The video began with “middle of animation → cut → animation from zero,” creating an obvious repeat.

**Rules:**
- **Warmup and recording must use separate contexts:**
  - Warmup context, without a `recordVideo` option: load the URL, wait for fonts, then close it.
  - Recording context, with `recordVideo`: begin from a fresh state and record animation from `t = 0`.
- An `ffmpeg -ss` trim may remove minor Playwright startup latency of roughly 0.3 s. It **cannot** conceal warmup frames; the source must be clean.
- The WebM file is written only when the recording context closes; this is a Playwright constraint.
- Reference pattern:
  ```js
  // Phase 1: warmup (throwaway)
  const warmupCtx = await browser.newContext({ viewport });
  const warmupPage = await warmupCtx.newPage();
  await warmupPage.goto(url, { waitUntil: 'networkidle' });
  await warmupPage.waitForTimeout(1200);
  await warmupCtx.close();

  // Phase 2: record (fresh)
  const recordCtx = await browser.newContext({ viewport, recordVideo });
  const page = await recordCtx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(DURATION * 1000);
  await page.close();
  await recordCtx.close();
  ```

## 11. Do Not Draw “Fake Chrome” Inside the Frame

**Failure:** the animation used the `Stage` component, which already provides a scrubber, timecode, and pause button. These belong to `.no-record` chrome and are hidden during export. A second decorative “magazine folio” progress bar—`00:60 ──── CLAUDE-DESIGN / ANATOMY`—was added along the bottom of the composition. It seemed tasteful in isolation. **The result:** the user saw two progress bars, one from Stage and one decorative. The collision looked unmistakably like a bug: “Why is there another progress bar inside the video?”

**Rules:**

- Stage already provides a scrubber, timecode, pause, and replay. **Do not draw** another progress indicator, current timecode, copyright strip, or chapter counter inside the composition. These either collide with chrome or become filler slop, violating the “earn its place” principle.
- “Page-number feel,” “magazine feel,” and “bottom credit strip” are high-frequency decorative fillers that AI adds automatically. Treat every appearance with suspicion. Does it communicate irreplaceable information, or merely fill empty space?
- If a bottom strip truly must exist—for example, the animation's subject is a player UI—it must be **narratively necessary** and **visually distinct from the Stage scrubber** in position, form, and color.

**Ownership test for every element drawn on the canvas:**

| What Does It Belong To? | Treatment |
|---|---|
| Narrative content of a particular scene | Keep it. |
| Global chrome used for controls or debugging | Add `.no-record`; hide it during export. |
| **Neither part of a scene nor chrome** | **Delete it.** It is an ownerless element and therefore filler slop. |

**Three-second pre-delivery check:** capture one static frame and ask:

- Does anything resemble video-player UI: a horizontal progress line, timecode, or control-button shape?
- If so, would deleting it harm the narrative? If not, delete it.
- Does the same information—progress, time, or credit—appear twice? Consolidate it into one chrome location.

**Counterexamples:** a bottom strip reading `00:42 ──── PROJECT NAME`; a chapter counter reading “CH 03 / 06” in the lower-right; a version number “v0.3.1” at the canvas edge. All are fake-chrome filler.

## 12. Blank Lead-In + Shifted Start: the `__ready` × Tick × `lastTick` Triple Trap

**Failure A · Blank lead-in:** a 60-second MP4 began with two or three seconds of blank page. `ffmpeg --trim=0.3` could not remove it.

**Failure B · Shifted start, real incident on 2026-04-20:** in an exported 24-second video, the user felt “the first frame does not play until 19 seconds.” In reality, recording began at animation `t = 5`, continued to `t = 24`, looped to `t = 0`, then captured another five seconds before ending. The final five seconds were the true beginning.

**Shared root cause:**

Playwright `recordVideo` begins writing WebM at `newContext()`. Babel, React, and font loading together take `L` seconds, commonly 2–6. The recording script waits for `window.__ready = true` as the “animation begins here” anchor. That event must pair exactly with animation `time = 0`. Two common errors break the pair:

| Incorrect Pattern | Symptom |
|---|---|
| Set `__ready` in `useEffect` or synchronous setup before the first tick | The recording script thinks animation started while WebM still shows a blank page → **blank lead-in** |
| Initialize `lastTick = performance.now()` at script top level | Font-load time `L` enters the first frame's `dt`; `time` jumps instantly to `L` → recording remains `L` seconds late → **shifted start** |

**✅ Complete correct starter-tick template**; every hand-written animation must use this skeleton:

```js
// ━━━━━━ state ━━━━━━
let time = 0;
let playing = false;   // ❗ Do not play by default; wait until fonts are ready
let lastTick = null;   // ❗ Sentinel: force dt to 0 on the first tick; never use performance.now()
const fired = new Set();

// ━━━━━━ tick ━━━━━━
function tick(now) {
  if (lastTick === null) {
    lastTick = now;
    window.__ready = true;   // ✅ Pair “recording start” with animation t = 0 on the same frame
    render(0);               // Render again to guarantee a ready DOM; fonts are ready now
    requestAnimationFrame(tick);
    return;
  }
  const dt = (now - lastTick) / 1000;   // Advance dt only after the first frame
  lastTick = now;

  if (playing) {
    let t = time + dt;
    if (t >= DURATION) {
      t = window.__recording ? DURATION - 0.001 : 0;  // Never loop while recording; preserve final frame with 0.001 s
      if (!window.__recording) fired.clear();
    }
    time = t;
    render(time);
  }
  requestAnimationFrame(tick);
}

// ━━━━━━ boot ━━━━━━
// Never start rAF immediately at top level; wait for fonts
document.fonts.ready.then(() => {
  render(0);                    // Draw initial frame after fonts are ready
  playing = true;
  requestAnimationFrame(tick);  // First tick pairs __ready with t = 0
});

// ━━━━━━ seek API: defensive correction for render-video ━━━━━━
window.__seek = (t) => { fired.clear(); time = t; lastTick = null; render(t); };
```

**Why this template is correct:**

| Component | Why It Must Work This Way |
|---|---|
| `lastTick = null` + `return` on first frame | Prevents the `L` seconds between script load and first tick from entering animation time. |
| `playing = false` by default | Even if `tick` runs during font loading, time does not advance or corrupt layout. |
| Set `__ready` on the first tick | The recording script starts timing on a frame that is truly animation `t = 0`. |
| Start `tick` only inside `document.fonts.ready.then(...)` | Prevents fallback-font measurement and first-frame font swapping. |
| Provide `window.__seek` | Lets `render-video.js` actively correct timing as a second line of defense. |

**Matching defenses in the recording script:**
1. Use `addInitScript` to inject `window.__recording = true` before `page.goto`.
2. Call `waitForFunction(() => window.__ready === true)` and record that offset for the `ffmpeg` trim.
3. **Additionally**, after `__ready`, call `page.evaluate(() => window.__seek && window.__seek(0))` to force any HTML timing drift back to zero. This is the second line of defense against HTML that does not follow the starter template precisely.

**Verification after exporting MP4:**
```bash
ffmpeg -i video.mp4 -ss 0 -vframes 1 frame-0.png
ffmpeg -i video.mp4 -ss $DURATION-0.1 -vframes 1 frame-end.png
```
The first frame must be the initial state at animation `t = 0`, not a middle frame or black. The last frame must be the final state, not a moment from the second loop.

**Reference implementations:** the Stage component in `assets/animations.jsx` and `scripts/render-video.js` already follow this protocol. Every hand-written HTML animation must use the starter-tick template; every line prevents a specific observed bug.

## 13. Disable Looping During Recording with `window.__recording`

**Failure:** Stage defaults to `loop=true` for convenient browser preview. `render-video.js` waits an additional 300 ms after `duration` before stopping. During that buffer, Stage begins the next loop. When `ffmpeg -t DURATION` truncates the result, the final 0.5–1 s can come from the next loop, abruptly returning to Scene 1. The audience reads this as a broken video.

**Root cause:** no handshake tells the HTML that it is being recorded, so it retains interactive browser looping behavior.

**Rules:**

1. **Recording script:** inject `window.__recording = true` in `addInitScript` before `page.goto`:
   ```js
   await recordCtx.addInitScript(() => { window.__recording = true; });
   ```

2. **Stage component:** detect the signal and force `loop=false`:
   ```js
   const effectiveLoop = (typeof window !== 'undefined' && window.__recording) ? false : loop;
   // ...
   if (next >= duration) return effectiveLoop ? 0 : duration - 0.001;
   //                                                       ↑ Preserve Sprite end=duration with 0.001 s
   ```

3. **Final Sprite fade-out:** use `fadeOut={0}` while recording. Otherwise, the video ends transparent or dark. Users expect a crisp final frame, not a fade. In hand-written HTML, set every final Sprite to `fadeOut={0}`.

**Reference implementations:** Stage in `assets/animations.jsx` and `scripts/render-video.js` already contain the handshake. A hand-written Stage must detect `__recording` or it will inevitably hit this failure.

**Verification:** after exporting, run `ffmpeg -ss 19.8 -i video.mp4 -frames:v 1 end.png`. Confirm that the final 0.2 seconds still show the intended last frame rather than a sudden cut to another scene.

## 14. Default 60 fps Conversion Should Duplicate Frames; `minterpolate` Has Poor Compatibility

**Failure:** a 60 fps MP4 generated by `convert-formats.sh` with `minterpolate=fps=60:mi_mode=mci...` would not open in some macOS QuickTime and Safari versions; it appeared black or was rejected outright. VLC and Chrome opened it successfully.

**Root cause:** the H.264 elementary stream emitted by `minterpolate` contains SEI or SPS fields that some players parse incorrectly.

**Rules:**

- Default 60 fps conversion should use the simple `fps=60` filter, duplicating frames for broad compatibility across QuickTime, Safari, Chrome, and VLC.
- Enable high-quality interpolation explicitly with `--minterpolate`, and **test the target player locally before delivery**.
- The practical value of a 60 fps label is **platform algorithm recognition**: Bilibili and YouTube prioritize 60 fps streams. Perceived smoothness improves only slightly for CSS animation.
- Add `-profile:v high -level 4.0` for broad H.264 compatibility.

`convert-formats.sh` now defaults to compatibility mode. For high-quality interpolation, add `--minterpolate`:
```bash
bash convert-formats.sh input.mp4 --minterpolate
```

## 15. The `file://` + External `.jsx` CORS Trap: Inline the Engine for Single-File Delivery

**Failure:** animation HTML loaded its engine through `<script type="text/babel" src="animations.jsx"></script>`. When opened with a double-click under `file://`, Babel Standalone used XHR to retrieve `.jsx`. Chrome reported `Cross origin requests are only supported for protocol schemes: http, https, chrome, chrome-extension...`. The page went completely black. No `pageerror` appeared, only a console error, making it easy to misdiagnose as “the animation did not trigger.”

Even an HTTP server may not help when a global proxy routes `localhost` through itself, producing 502 or connection failures.

**Rules:**

- **Single-file delivery**, where the user double-clicks one HTML file → inline `animations.jsx` inside `<script type="text/babel">...</script>`; never use `src="animations.jsx"`.
- **Multi-file project**, demonstrated through an HTTP server → external loading is acceptable, but delivery instructions must include `python3 -m http.server 8000`.
- Decision test: are you delivering “an HTML file” or “a project directory with a server”? Inline for the former.
- Stage and `animations.jsx` often exceed 200 lines. Pasting them into one HTML `<script>` block is entirely acceptable; file size is not a concern.

**Minimum verification:** double-click the generated HTML and open it **without any server**. It passes only if Stage displays the initial animation frame correctly.

## 16. Inverted Color Context Across Scenes: Never Hard-Code Colors in Shared On-Canvas Elements

**Failure:** reusable elements such as `ChapterLabel`, `SceneNumber`, and `Watermark` appeared across several scenes and hard-coded `color: '#1A1A1A'`. They looked correct over the light first four scenes but disappeared completely over the black fifth scene. No error was reported, no check failed, and important information became invisible.

**Rules:**

- **Never hard-code a color value** in an on-canvas element reused across scenes: chapter label, scene number, timecode, watermark, or copyright strip.
- Use one of three approaches:
  1. **Inherit with `currentColor`:** the element uses `color: currentColor`; the parent scene computes its color.
  2. **Use an `invert` prop:** explicitly switch contrast through `<ChapterLabel invert />`.
  3. **Compute from the background:** `color: contrast-color(var(--scene-bg))` through the CSS Color 4 API, or determine it in JavaScript.
- Before delivery, capture a representative frame from **every scene** in Playwright and visually confirm that all cross-scene elements remain visible.

This pitfall is unusually subtle because **no bug alarm exists**. Only visual inspection or OCR finds it.

## 17. Truly Self-Contained Offline Output: Inline React and Babel, and Transpile the Engine Too

**Failure, May 2026 觅游 (Miyou) promotional animation:** the HTML used React and Babel from CDN through `<script src="https://unpkg.com/react...">` and `<script src=".../@babel/standalone">`. A global proxy caused Chromium to return `net::ERR_CONNECTION_CLOSED` for unpkg and Google Fonts during Playwright recording:

1. React and ReactDOM did not load → `window.React undefined`.
2. Babel did not load → JSX in `<script type="text/babel">` ran as plain JavaScript → `Unexpected token '<'`.

After React and Babel were fixed, a second problem appeared: inlining the `animations.jsx` engine as a normal `<script>` still produced `Unexpected token '<'`, followed by `window.Animations is undefined`. The cause is that **the `animations.jsx` engine itself contains JSX**: the `Stage` and `Sprite` components return `<div>...</div>`. The engine was designed to load under `<script type="text/babel">`. Transpiling only the app code while forgetting the engine leaves its JSX uncompiled.

**Rules for a truly self-contained file that opens on double-click, works offline, and can be recorded by Playwright:**

- **Inline local React + ReactDOM:** use `curl` to download `react.production.min.js` (~10 KB) and `react-dom.production.min.js` (~131 KB), then inline them in `<script>` tags. Do not use CDN at runtime.
- **Precompile with Babel at build time; do not ship Babel at runtime:** download `@babel/standalone` once for building. In Node, call `Babel.transform(src,{presets:['react']}).code` to convert JSX to `React.createElement`. **Both the app and `animations.jsx` engine must pass through the transform** because the engine contains JSX. Omitting it inevitably causes `Unexpected token '<'`.
- **Use system fonts:** a proxy may block Google Fonts as well. Chinese animation should use the system faces `'PingFang SC'` for sans-serif and `'Songti SC'` for serif. `document.fonts.ready` resolves immediately for system fonts, avoiding recording delay.
- **Inline image assets as base64:** relative paths such as `<img src="png/x.png">` render under `file://`, but true portability requires base64 data URLs so moving the file does not lose images. Convert large backgrounds to compressed JPEG before base64 encoding.
- **Template the build:** keep `__REACT__`, `__REACTDOM__`, `__ASSETS__`, and `__ENGINE__` tokens in the HTML template, plus application source inside `type="text/jsx-source"`. A Node build script reads the tokens, injects vendor code unchanged, transpiles the engine and app with Babel, and writes the final single file. To revise motion, edit the template and rebuild.

**Verification:** run `page.evaluate(()=>({React:typeof window.React, Animations:typeof window.Animations}))` in Playwright. Both values must be `object`. If either is `undefined`, the corresponding `<script>` threw—usually because its JSX was not transpiled.

**Relationship to pitfall 15:** #15 says not to load external `.jsx` through `src=` in a single file because `file://` causes CORS failure. This pitfall goes further: in a restricted network, even the remote CDN for React, Babel, and fonts fails. True self-containment requires complete inlining and build-time transpilation.

## 18. [HyperFrames] CSS Transitions + Class Changes Are Nondeterministic During Seek Rendering

CSS `transition` follows wall-clock time, not timeline time. In frame-by-frame seek rendering, every frame is an independent capture. The transition's intermediate state depends on how much wall-clock time has elapsed since seeking to that frame, making it completely nondeterministic. It may remain forever at the start value or stop randomly in the middle. Measured during the c3 migration on 2026-07-17: `.watermark-br` used `transition: opacity 0.6s` + a class change, and opacity would not obey seek rendering.

**Fix:** express every state change on the rendering path through a tween or a pure function of `t`. When migrating an old demo, search globally for `transition:` and replace each occurrence with interpolation in `render(t)`. Never introduce transitions in a new renderable composition. Transitions for hover and other interactive states are harmless because recording does not trigger them.

## 19. [HyperFrames] Proxy Tween Does Not Fire on Frame Zero: Call `render(0)` Manually

When a proxy tween attaches `render(t)` to a GSAP timeline, as in the legacy-demo adapter path, `onUpdate` is not guaranteed to run while the timeline remains at `t = 0`. The first frame may therefore show the HTML's uninitialized static state rather than the result of `render(0)`.

**Fix:** after registering the timeline, call `render(0)` synchronously once. See `references/hyperframes-backend.md` for the complete recipe.

## 20. [HyperFrames] The Contrast Gate Conflicts with Dark Cinematic Design: Use `--no-contrast`, but Keep the Other Four Gates at Zero Errors

The contrast gate in `npm run check` tests all text against WCAG AA 4.5:1. In dark cinematic design, watermarks, mono labels, and decorative text at 16–40% opacity are **intentionally** low-contrast; this is part of the cinematic character. The gate reports them in bulk, and the framework has no per-element exemption. In the c3 test, all 42 contrast errors were intentional design decisions.

**Fix:** run `npx hyperframes check --no-contrast` for dark cinematic output. The lint, runtime, layout, and motion gates must still report zero errors. **Do not skip contrast for light-background, information-led work.** There, contrast failures usually represent genuine readability problems; see the readability hard floor in the `SKILL.md` fallback section.

## 21. [HyperFrames / GSAP] The `fromTo` `immediateRender` Phantom: Elements Appear Seconds Too Early

GSAP `fromTo()` uses `immediateRender: true` by default. It applies the `from` state as soon as the timeline is built. If that state is visible—`autoAlpha > 0`—the element appears before its tween begins. Short effects such as sparks, click rings, ripples, and dust are most vulnerable. B00 encountered this four times: effects lingered on screen several seconds before their intended arrival.

**Fix:** every `fromTo()` whose `from` state is visible must set `immediateRender: false` explicitly, or use “set hidden initial state + `to`.” To audit, capture the opening frame of every scene after rendering and look for effect elements that should not yet be present.

## Five-Second Preflight Checklist

- [ ] Does every parent of a `position: absolute` element set `position: relative`?
- [ ] Does the chosen font contain every special character used in the animation, including `␣`, `⌘`, and emoji?
- [ ] Does the Grid/Flex template count match the JavaScript data length?
- [ ] Do scene changes crossfade without more than 0.3 seconds of complete blank screen?
- [ ] Is every DOM measurement wrapped in `document.fonts.ready.then()`?
- [ ] Is `render(t)` pure, or does it have an explicit reset mechanism?
- [ ] Is frame zero the complete initial state rather than a blank page?
- [ ] Is the composition free of fake-chrome decoration—progress bars, timecodes, and bottom credits colliding with the Stage scrubber?
- [ ] Does the first animation tick set `window.__ready = true` on the same frame as `t = 0`? `animations.jsx` provides this; hand-written HTML must add it.
- [ ] Does Stage detect `window.__recording` and force `loop=false`? Hand-written HTML must implement this.
- [ ] Does the final Sprite use `fadeOut={0}` so the video holds a crisp last frame?
- [ ] Does 60 fps MP4 export use frame duplication by default for compatibility, with `--minterpolate` enabled only when needed?
- [ ] After export, were frame zero and the final frame extracted and confirmed as the intended initial and final states?
- [ ] If a specific brand such as Stripe, Anthropic, or Lovart is involved, was the five-step Brand Asset Protocol in `SKILL.md` §1.a completed, including `brand-spec.md`?
- [ ] For single-file delivery, is `animations.jsx` inline rather than loaded through `src="..."`, which produces a CORS black screen under `file://`?
- [ ] Do cross-scene elements such as chapter labels, watermarks, and scene numbers avoid hard-coded colors and remain visible over every scene background?
- [ ] For offline or truly self-contained output, are React and ReactDOM inlined locally, **both the app and the `animations.jsx` engine transpiled through Babel**, and system fonts used? See pitfall 17; the engine contains JSX, and omission causes `Unexpected token '<'`.
- [ ] [HyperFrames] Is the rendering path free of CSS `transition`, with every state change expressed as a tween or pure function of `t`? See pitfall 18.
- [ ] [HyperFrames] Was `render(0)` called after registering each proxy-tween scene? See pitfall 19.
- [ ] [HyperFrames] Did checks pass? Use `--no-contrast` for dark cinematic design, while keeping the other four gates at zero errors. See pitfall 20.
- [ ] [HyperFrames / GSAP] Does every `fromTo()` with a visible `from` state set `immediateRender: false`? See pitfall 21, observed in four B00 phantoms.
