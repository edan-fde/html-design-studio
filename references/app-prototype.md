# App / iOS Prototype Rules · Complete Operating Manual

> The expanded version of the rules summarized in `SKILL.md`. `SKILL.md` retains a seven-rule quick reference; this document explains each rule in full: architecture selection, image sources and code, the `AppPhone` JSX skeleton, the three-step `ios_frame` workflow, and the complete set of taste anchors.

When creating an iOS, Android, or mobile-app prototype (triggers include “app prototype,” “iOS mockup,” “mobile application,” and “build an app”), the following rules **override** the general placeholder principle. An app prototype is a live demonstration; static staging and beige placeholder cards are unconvincing.

### 0. Choose the Architecture First (Mandatory)

**Default to single-file inline React**: put all JSX, data, and styles directly in the main HTML file inside `<script type="text/babel">...</script>`. **Do not** load them externally with `<script src="components.jsx">`. Under the `file://` protocol, the browser blocks external JavaScript as cross-origin content. Requiring the user to start an HTTP server violates the expectation that a prototype should open with a double-click. Embed local images as base64 data URLs; never assume a server is present.

**Split the project into external files only in two cases:**
- (a) The single file exceeds 1,000 lines and becomes difficult to maintain → split it into `components.jsx` + `data.js`, and provide explicit delivery instructions (the `python3 -m http.server` command and the URL to open).
- (b) Multiple subagents need to build different screens in parallel → use `index.html` plus one standalone HTML file per screen (`today.html`, `graph.html`, etc.), aggregated with iframes. Each screen must itself remain a self-contained single file.

**Architecture cheatsheet:**

| Scenario | Architecture | Delivery |
|------|------|----------|
| One person building a 4–6-screen prototype (most common) | Single inline file | One `.html` file that opens on double-click |
| One person building a large app (>10 screens) | Multiple JSX files + server | Include a startup command |
| Multiple agents working in parallel | Multiple HTML files + iframe | Aggregate in `index.html`; each screen opens independently |

### 1. Find Real Images First—Do Not Leave Placeholders Sitting There

Proactively obtain real images by default. Do not draw SVG replacements, leave beige placeholder cards in place, or wait for the user to ask. Common sources:

| Scenario | Preferred Source |
|------|---------|
| Art, museum, or historical content | Wikimedia Commons (public domain), The Met Open Access, Art Institute of Chicago API |
| General lifestyle or photography | Unsplash, Pexels (royalty-free) |
| Assets already on the user's machine | `~/Downloads`, the project's `_archive/`, or the user's configured asset library |

Wikimedia download pitfall (on this machine, `curl` fails TLS through the proxy; Python's `urllib` connects successfully):

```python
# A compliant User-Agent is mandatory; otherwise Wikimedia returns 429
UA = 'ProjectName/0.1 (https://github.com/you; you@example.com)'
# Use the MediaWiki API to discover the actual URL
api = 'https://commons.wikimedia.org/w/api.php'
# action=query&list=categorymembers retrieves a series in bulk;
# prop=imageinfo+iiurlwidth returns a thumbnail URL at the requested width
```

Fall back to an honest placeholder **only** when every source fails, rights are unclear, or the user explicitly requests one. Even then, do not draw a bad SVG.

**Honesty test for real imagery** (critical): before obtaining an image, ask yourself, “Would removing this image cause information to be lost?”

| Scenario | Assessment | Action |
|------|------|------|
| Covers in an article or essay list, a scenic profile-page header, a decorative settings-page banner | Decorative; no intrinsic relationship to the content | **Do not add it.** Doing so is AI slop—the photographic equivalent of a purple gradient. |
| A portrait in museum or biographical content, the physical product on a product page, the location shown in a map card | The image is the content; there is an intrinsic relationship | **Must be included** |
| An extremely faint texture behind a graph or visualization | Atmospheric; subordinate to the content and never competing with it | Add it, but keep opacity ≤ 0.08 |

**Counterexamples:** pairing an essay with an Unsplash “inspiration image,” or putting a stock-photo model in a notes app. Both are AI slop. Permission to use real imagery is not permission to misuse it.

### 2. Delivery Format: “Tiled + Interactive” by Default—Do Not Ask

There is exactly one **default delivery format for an iOS app prototype**. Do not ask whether the user wants “tiled or interactive”: **tile four to six primary screens, and make every phone interactive**. The user can understand the whole app at a glance from several iPhones arranged side by side, while still being able to switch tabs and perform basic operations such as expanding, selecting, toggling, and opening modals. Provide both benefits at once; do not force a choice.

| Dimension | Default |
|------|---------|
| **Screen count** | Tile **4–6 primary screens** covering the app's core functional surfaces—not an arbitrary assortment. If more than six exist, show the most important 4–6 and make the others reachable through tabs or navigation within a phone. |
| **Layout** | Arrange independent iPhones horizontally with `flexWrap`; place a one-line italic label above each phone identifying the screen. |
| **Interaction in each phone** | Each phone is an independent miniature state machine: tabs switch, buttons/cards/toggles respond, and modals can open. It is not a static staged screenshot. |

Depart from this default only for two explicit exceptions:
- The user explicitly requests “static screenshots only,” “it does not need to be clickable,” or “I only want to see the layout” → provide a purely static overview (each phone renders only its `ScreenComponent`, with no state machine attached).
- The user explicitly requests “demonstrate one flow only,” “walk through onboarding,” or “single-device demo” → use one `AppPhone` to run the full flow.

**Default skeleton** (multiple tiled phones, each with its own stateful `AppPhone`):

```jsx
// Each phone is an independent state machine whose initial state is its assigned primary screen
function AppPhone({ initial }) {
  const [screen, setScreen] = React.useState(initial);
  const [modal, setModal] = React.useState(null);
  // Render the appropriate ScreenComponent for screen and pass
  // callbacks such as onTabChange/onOpen/onClose/onToggle
  return (
    <IosFrame>
      <ScreenComponent
        screen={screen}
        onTabChange={setScreen}
        onOpen={setModal}
        onClose={() => setModal(null)}
      />
    </IosFrame>
  );
}

// Tile 4–6 phones side by side, each initialized to a different primary screen
<div style={{display: 'flex', gap: 32, flexWrap: 'wrap', padding: 48, alignItems: 'flex-start'}}>
  {mainScreens.map(s => (
    <div key={s.id}>
      <div style={{fontSize: 13, color: '#666', marginBottom: 8, fontStyle: 'italic'}}>{s.label}</div>
      <AppPhone initial={s.id} />
    </div>
  ))}
</div>
```

Screen components accept callback props (`onTabChange`, `onOpen`, `onClose`, `onToggle`, `onAnnotation`) rather than hard-coding state. Add `cursor: pointer` and hover feedback to the tab bar, buttons, artwork cards, and switches. Each phone opens on a different primary screen, but tab switching should make the screens mutually reachable: tiling gives breadth; interaction gives depth.

### 3. Run Real Click Tests Before Delivery

Static screenshots reveal layout issues, but interaction bugs appear only after clicking. Use Playwright to run three minimum click tests: open a detail view, activate a key annotation point, and switch tabs. Confirm that `pageerror` remains at zero before delivery. Invoke Playwright with `npx playwright` or through its global installation path (`npm root -g` + `/playwright`).

### 4. Taste Anchors (Preferred Fallbacks)

When no design system exists, default toward these directions to avoid AI slop:

| Dimension | Prefer | Avoid |
|------|------|------|
| **Typography** | Serif display face (Newsreader / Source Serif / EB Garamond) + `-apple-system` for body text | SF Pro or Inter everywhere—it looks like an unstyled system default |
| **Color** | One warm background tone + **one** accent carried through the entire design (rust orange / deep green / dark red) | Multicolor clustering unless the data genuinely has at least three categorical dimensions |
| **Information density · restrained mode** (default) | One fewer container, one fewer border, one fewer **decorative** icon—leave breathing room for content | A meaningless icon + tag + status dot on every card |
| **Information density · high-density mode** (exception) | When the product's core value is intelligence, data, or contextual awareness (AI tools, dashboards, trackers, copilots, Pomodoro apps, health monitoring, accounting), every screen needs **at least three visible pieces of differentiating product information**: meaningful data, dialogue or reasoning excerpts, inferred state, or contextual relationships | A single button and a clock—the intelligence is invisible, making the product indistinguishable from an ordinary app |
| **Signature detail** | One screenshot-worthy moment: an extremely faint oil-paint texture, a serif italic quotation, or a full-screen black recording waveform | Applying equal effort everywhere and making every area equally bland |

**Both principles apply at the same time:**
1. Taste means taking one detail to 120% and the rest to 80%. It does not mean making every area precious; it means making the right area sufficiently refined.
2. Subtraction is a fallback, not a universal law. When a product's core value depends on information density—AI, data, or contextual-awareness products—addition takes priority over restraint. See “Information-Density Types” below.

### 5. iOS Device Frames Must Use `assets/ios_frame.jsx`—Never Hand-Code the Dynamic Island or Status Bar

Every iPhone mockup is **strictly required** to use `assets/ios_frame.jsx`. This standard shell is already aligned to exact iPhone 15 Pro specifications: bezel, Dynamic Island (124 × 36, `top: 12`, centered), status bar (time/signal/battery, kept clear of both sides of the island and vertically centered on the island's midline), Home Indicator, and content-area top padding.

**Do not hand-code** any of the following in project HTML:
- `.dynamic-island` / `.island` / a centered black rounded rectangle using `position: absolute`, `top: 11px` or `12px`, and a width around `120px`
- A `.status-bar` with hand-built time, signal, or battery icons
- `.home-indicator` / the bottom home bar
- The rounded iPhone bezel with a black outline and shadow

Hand-built versions have positioning bugs 99% of the time: the island crowds the status-bar time or battery, or incorrect content top padding puts the first line beneath the island. The iPhone 15 Pro cutout is a **fixed 124 × 36 pixels**. The usable width on each side is narrow; do not estimate it from memory.

**Usage (exactly three steps):**

```jsx
// Step 1: Read this skill's assets/ios_frame.jsx (path relative to this SKILL.md)
// Step 2: Copy the complete iosFrameStyles constant and IosFrame component into your <script type="text/babel">
// Step 3: Wrap your screen component in <IosFrame>...</IosFrame> and do not touch the island/status bar/Home Indicator
<IosFrame time="9:41" battery={85}>
  <YourScreen />  {/* Content begins at top: 54; the bottom space for the Home Indicator is already handled */}
</IosFrame>
```

**Exception:** bypass this only when the user explicitly asks for “an iPhone 14 non-Pro notch,” “Android rather than iOS,” or a custom device form. In that case, read the corresponding `android_frame.jsx` or modify the constants in `ios_frame.jsx`. **Do not** create a separate island/status-bar implementation inside the project HTML.
