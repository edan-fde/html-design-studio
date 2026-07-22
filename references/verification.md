# Verification · Output QA Workflow

Some native design-agent environments, such as Claude.ai Artifacts, include a `fork_verifier_agent` subagent that inspects iframe screenshots. Most agent environments—including Claude Code, Codex, Cursor, and Trae—do not. Playwright can cover the same verification scenarios manually.

## Verification Checklist

Run this checklist after every HTML generation:

### 1. Browser rendering check (required)

Start with the most basic question: **does the HTML open?** On macOS:

```bash
open -a "Google Chrome" "/path/to/your/design.html"
```

or take a screenshot with Playwright (next section).

### 2. Console error check

The most common HTML failure is a blank screen caused by a JavaScript error. Check it with Playwright:

```bash
python scripts/verify.py path/to/design.html
```

This script will:
1. Open the HTML in headless Chromium
2. Save the screenshot to the project directory
3. Grab console errors
4. Report status

See `scripts/verify.py` for details.

### 3. Multi-viewport check

If it is a responsive design, grab multiple viewports:

```bash
python verify.py design.html --viewports 1920x1080,1440x900,768x1024,375x667
```

### 4. Interaction check

Static screenshots cannot validate Tweaks, animations, or button state changes. **Ask the user to open the page and interact with it**, or record the flow with Playwright:

```python
page.video.record('interaction.mp4')
```

### 5. Check every slide

Capture deck-style HTML one slide at a time:

```bash
python verify.py deck.html --slides 10  # Capture the first 10 slides.
```

This generates `deck-slide-01.png`, `deck-slide-02.png`, and so on for quick review.

## Playwright Setup

Install the required tooling:

```bash
# Node.js version, if Playwright is not installed yet:
npm install -g playwright
npx playwright install chromium

# Or the Python version:
pip install playwright
playwright install chromium
```

If the user has installed Playwright globally, just use it directly.

## Screenshot best practice

### Screenshot the entire page

```python
page.screenshot(path='full.png', full_page=True)
```

### Screenshot the viewport

```python
page.screenshot(path='viewport.png')  # Only capture the visible area by default
```

### Screenshot specific elements

```python
element = page.query_selector('.hero-section')
element.screenshot(path='hero.png')
```

### High-definition screenshot

```python
page = browser.new_page(device_scale_factor=2)  # retina
```

### Wait for animation to settle before capturing

```python
page.wait_for_timeout(2000)  # Wait two seconds for the animation to settle.
page.screenshot(...)
```

## Send the screenshot to the user

### Open the local screenshot directly

```bash
open screenshot.png
```

The user can inspect it in Preview, Figma, VS Code, or a browser.

### Upload the image sharing link

If you need to show it to remote collaborators (such as Slack/Feishu/WeChat), let the user upload the screenshot using their own image sharing tool or MCP, and get a permanent link that can be pasted anywhere.

## When a verification error occurs

### The page is blank

There must be an error in the console. First check:

1. React+Babel script tag's integrity hash is correct (see `react-setup.md`)
2. Is there a naming conflict with `const styles = {...}`
3. Are cross-file components exported to `window`
4. JSX syntax errors (`babel.min.js` can obscure them; switch temporarily to the unminified `babel.js`)

### Animation stutters

- Use Chrome DevTools Performance tab to record a section
- Look for layout thrashing (frequent reflows)
- Prefer `transform` and `opacity` for motion so the compositor can accelerate it

### The font is wrong

- Confirm that each `@font-face` URL is accessible
- Inspect the fallback chain
- Chinese fonts load slowly: show the fallback immediately, then swap after the font arrives

### The layout is misaligned

- Check whether `box-sizing: border-box` is applied globally
- Check the global `* { margin: 0; padding: 0; }` reset
- Open gridlines in Chrome DevTools to see the actual layout

## Verification = designer's second pair of eyes

**Always perform the review yourself.** Common AI-generated-code failures include:

- Looks right but has bugs in interaction
- Static screenshots are good but misaligned when scrolling
- Wide screens look correct while narrow screens break
- Dark mode forgot to test
- Some components do not respond after switching Tweaks

**The last 1 minute of verification can save 1 hour of rework**.

## Common verification script commands

```bash
# Basic: open, capture, and report errors.
python verify.py design.html

# Multiple viewports.
python verify.py design.html --viewports 1920x1080,375x667

# Multiple slides.
python verify.py deck.html --slides 10

# Output to the specified directory
python verify.py design.html --output ./screenshots/

# headless=false: open a visible browser for manual review.
python verify.py design.html --show
```

## Video product hard verification (verify-video.sh)

Do not validate a rendered MP4 solely by eye. Use the script for deterministic checks. `hyperframes check` handles the five-part composition audit; this script validates only the rendered deliverable:

```bash
# Finished deliverable; an audio track is required by default.
bash scripts/verify-video.sh final.mp4 --duration=22 --fps=60 --width=1920 --height=1080

# Silent intermediate render.
bash scripts/verify-video.sh raw.mp4 --duration=10 --fps=60 --no-audio

# Cinematic render with an intentionally black opening.
bash scripts/verify-video.sh film.mp4 --duration=30 --fps=60 --allow-black-open
```

Checks include resolution and frame rate, duration tolerance (±2%), the presence of an audio stream (no audio track means the render is mechanically classified as unfinished), black frames at the beginning or end (`blackdetect`, often indicating an offset recording start or loop bounce), and LUFS loudness (target: -14 ±4 for a finished deliverable). Do not deliver if the command exits nonzero.
