# HyperFrames Rendering Backend · Decision Guide and Operating Manual

> Introduced on 2026-07-17 after hands-on validation of the toolchain, CJK fonts, agent environment, migration path, and 3D support. The key findings are recorded here.
> HyperFrames is HeyGen's open-source HTML-to-video framework (Apache 2.0): pure HTML plus a paused GSAP timeline, rendered deterministically by seeking frame by frame in a headless browser.

## Choosing a backend (read this table before starting)

| Scene | Which rendering route to use |
|---|---|
| New animation project (default) | **HyperFrames**. Free audit suite, 3D/GSAP/Lottie/shader fully unlocked |
| Requires 3D, particles, physical inertia, or shader transitions | HyperFrames; the custom Stage does not support these |
| Existing Stage demo must be reused or modified | Migrate it using the adapter recipe below (20–30 minutes per demo). If it only needs re-rendering, leave it unchanged and keep using `render-video-seek.js` |
| Constrained runtime (no npm, dependencies cannot be installed, or delivery must be a single file the user can double-click) | Custom Stage (`assets/animations.jsx`); keep the existing workflow |
| Interactive browser demo with no video export | Custom Stage or ordinary HTML. HyperFrames is a rendering pipeline, not an interaction framework |
| Long narrated video (Step 9.5, driven by `narration_stage`) | **Custom narration pipeline** (`voiceover-pipeline.md` + `render-narration.sh`), not HyperFrames for now. Its dual time sources, subtitles, and TTS timeline are tightly coupled to the custom Stage. If this rule conflicts with “use HyperFrames by default for animation,” this row takes precedence |
| Batch parameterized videos (personalized templates at scale, including face or text substitution) | Remotion (see planning direction 5, independent of this skill's main workflow) |

**The design language remains the source of truth**: the narrative structure, easing system, and dual-track SFX/BGM system still apply (`animation-best-practices.md` / `audio-design-rules.md`). HyperFrames is only the implementation and rendering layer. See `references/gsap-recipes.md` for GSAP implementation recipes.

## Project scaffolding

```bash
npx -y hyperframes init <project-name> --example blank   # --example is required in non-interactive mode
cd <project-name> && npm install
```

This generates `index.html`, `hyperframes.json`, `meta.json`, `package.json` (with the CLI version pinned), and a project-level `CLAUDE.md`. `init` installs 19 HyperFrames skills into `~/.claude/skills/` (already installed on this machine). For the composition authoring contract, read the `SKILL.md` from the `hyperframes-core` skill. `init` installs skills into each runtime's skill directory; Claude Code defaults to `~/.claude/skills/`. In a runtime without a skill mechanism, use the local documentation instead: `npx hyperframes docs <topic>` (`data-attributes`, `gsap`, `rendering`, or `troubleshooting`).

**Version policy**: The project's `package.json` pins an exact version (0.7.61 at the time of validation). HyperFrames changes rapidly, with more than 300 releases. Before upgrading, inspect the changes with `npx hyperframes@latest upgrade --project . --check`; then rerun the checks and regression-test the demo before proceeding.

## Composition contract at a glance (read `hyperframes-core` for the full version)

- Root container: `data-composition-id` + `data-start` + `data-duration` + `data-width/height`
- Each timing element: `class="clip"` + `data-start` + `data-duration` + `data-track-index`
- The timeline must be paused and registered: `window.__timelines["composition-id"] = gsap.timeline({ paused: true })`
- Use `muted` for video material, separate audio track `<audio>` element
- **Only deterministic logic is allowed**: do not use `Date.now()`, `Math.random()`, or runtime network requests; use a seeded random function
- Fonts: the compiler downloads Google Fonts and injects deterministic `@font-face` rules (cached in `~/.cache/hyperframes/fonts/`). For system-only fonts such as PingFang SC, satisfy lint with `@font-face { font-family:"PingFang SC"; src: local("PingFang SC"); }`
- For Three.js, use the `hf-seek` adapter documented by the installed `hyperframes-animation` skill; if that skill is unavailable in the current runtime, read the equivalent local HyperFrames documentation. The root container must declare `data-duration` explicitly

## Migrating an old demo · Adapter recipe (validated at 20–30 minutes per demo)

A custom Stage animation built around a pure `render(t)` function does not need to be rewritten. Follow four steps:

1. **Wrap the composition**: add composition data attributes to `#root`. The simplest setup is to make the entire `.stage` the only clip (`class="stage clip"` plus `data-start`, `data-duration`, and `data-track-index`). Change `.stage` from a centered fixed element to `position: absolute; inset: 0`, and lock `html`/`body` to 1920×1080
2. **Remove self-driven playback**: delete the rAF tick loop, `fitStage`/resize observers, replay button, and the `__ready`/`__setTime`/`__seek` protocol; the renderer does not need them
3. **Attach a proxy tween** (12 core lines):
   ```js
   const proxy = { t: 0 };
   const tl = gsap.timeline({ paused: true });
   tl.to(proxy, { t: DURATION, duration: DURATION, ease: "none",
     onUpdate: () => render(proxy.t) }, 0);
   window.__timelines = window.__timelines || {};
   window.__timelines["main"] = tl;
   render(0);   // Required: onUpdate does not fire while the timeline is parked at t=0, so initialize frame zero explicitly.
   ```
4. **Audit transitions**: search the entire project for `transition:`. CSS transitions triggered by class changes run on wall-clock time and are nondeterministic under frame seeking. Replace them with a pure function of `t`—for example, a `lerp` inside `render(t)`

## Verification and rendering

```bash
npm run check                        # five-part audit: lint, runtime, layout, motion, and contrast
npx hyperframes check --no-contrast  # For dark cinematic work (see below)
npx -y hyperframes@<pinned-version> render --fps 60   # final rendering; default 30fps
```

- **`check` must report zero errors before rendering** (except when intentionally disabling the contrast gate). Lint catches whole classes of otherwise silent visual failures, including `letterSpacing` jitter, missing fonts, and nondeterminism.
- **Contrast-gate trade-off**: the gate enforces WCAG 4.5:1, which inherently conflicts with low-contrast watermarks and decorative text at 16–40% opacity in dark cinematic work. Use `--no-contrast` consistently for that output, but keep the other four checks at zero errors. Do not disable contrast for bright, information-dense work; contrast errors there are usually real defects.
- **Two-stage rendering**: render at the default 30fps for quick review, then render the final at `--fps 60` after visual and frame-capture inspection. In testing, 600 frames at 1080p/60fps took about 20 seconds.
- Use `scripts/verify-video.sh` to validate the rendered deliverable's audio stream, black frames, loudness, and duration; see `verification.md`.

## Alpha channel (motion graphics and overlays for an editing timeline)

`npx hyperframes render --format mov` outputs ProRes 4444 (`yuva444p12le`, with alpha). As verified on 2026-07-17, multicolor elements and soft shadows retain correct translucency. `--format webm` also supports transparency at a much smaller size, while `--format png-sequence` produces RGBA frame sequences for After Effects or DaVinci Resolve. On the composition side, set the `html` and `body` backgrounds to `transparent` and do not add a background color. Motion-graphics text, corner bugs, and lower thirds can then be placed directly on an editing timeline without keying. MOV files are large (ProRes lossless territory: about 15 MB for four seconds) and intended for editors; WebM is preferable for network transfer.

## Audio

HyperFrames compositions can include `<audio>` elements directly on the timeline, so BGM and narration render with the video. The existing audio workflow remains valid: produce SFX and BGM as separate tracks according to `audio-design-rules.md`, or post-mix with `add-music.sh` / `mix-voiceover.sh`. Choose between the two based on production experience; neither is mandatory yet. Manage SFX with `scripts/sfx-cues.sh <video> <cue-table.tsv> <output>`. The cue table contains three columns—time in seconds, SFX path, and volume in dB. This pattern was established in B00; edit the table and rerun it to produce a new mix in about ten seconds.

## Additional pitfalls compared with the custom pipeline

Several custom-pipeline pitfalls do **not apply** to HyperFrames: the recording-protocol issues in `animation-pitfalls.md` §7/10/12/13, font timing in §6, and network issues in §15/17. HyperFrames handles the recording protocol internally, captures fonts during compilation, and has been verified through the CDN proxy. Four new pitfalls are documented in `animation-pitfalls.md` §18–21: nondeterministic CSS transitions, the proxy tween's first frame, contrast-gate conflicts, and `fromTo` `immediateRender` ghosts.
