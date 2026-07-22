# Tweaks · Real-Time Controls for Design Variants

Tweaks is a core capability of this skill. It lets users switch variants and adjust parameters in real time without editing code.

**Cross-environment compatibility**: Some native design-agent environments, such as Claude.ai Artifacts, use host `postMessage` calls to persist tweak values back into source code. This skill uses a **pure front-end `localStorage` solution**. It preserves state across refreshes in the browser rather than in the source file, and works in any agent environment, including Claude Code, Codex, Cursor, and Trae.

## When to add Tweaks

- The user clearly requires "can adjust parameters"/"switch between multiple versions"
- When the design has multiple variations that need to be compared
- The user did not explicitly ask, but your design judgment says that **a few well-chosen controls would reveal meaningful possibilities**

Default recommendation: **add two or three Tweaks to each design**—for example theme, type size, or layout—even when the user does not ask. Helping users explore the possibility space is part of the design service.

## Implementation method (pure front-end version)

### Basic structure

```jsx
const TWEAK_DEFAULTS = {
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
};

function useTweaks() {
  const [tweaks, setTweaks] = React.useState(() => {
    try {
      const stored = localStorage.getItem('design-tweaks');
      return stored ? { ...TWEAK_DEFAULTS, ...JSON.parse(stored) } : TWEAK_DEFAULTS;
    } catch {
      return TWEAK_DEFAULTS;
    }
  });

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    try {
      localStorage.setItem('design-tweaks', JSON.stringify(next));
    } catch {}
  };

  const reset = () => {
    setTweaks(TWEAK_DEFAULTS);
    try {
      localStorage.removeItem('design-tweaks');
    } catch {}
  };

  return { tweaks, update, reset };
}
```

### Tweaks panel UI

A collapsible floating panel in the lower-right corner:

```jsx
function TweaksPanel() {
  const { tweaks, update, reset } = useTweaks();
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
    }}>
      {open ? (
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          width: 280,
          fontFamily: 'system-ui',
          fontSize: 13,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <strong>Tweaks</strong>
            <button onClick={() => setOpen(false)} style={{
              border: 'none', background: 'none', cursor: 'pointer', fontSize: 16,
            }}>×</button>
          </div>

          {/* Color */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Main Color</div>
            <input 
              type="color" 
              value={tweaks.primaryColor} 
              onChange={e => update({ primaryColor: e.target.value })}
              style={{ width: '100%', height: 32 }}
            />
          </label>

          {/* Font-size slider */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Font Size ({tweaks.fontSize}px)</div>
            <input 
              type="range" 
              min={12} max={24} step={1}
              value={tweaks.fontSize}
              onChange={e => update({ fontSize: +e.target.value })}
              style={{ width: '100%' }}
            />
          </label>

          {/* Density Options */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>Density</div>
            <select 
              value={tweaks.density}
              onChange={e => update({ density: e.target.value })}
              style={{ width: '100%', padding: 6 }}
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </label>

          {/* Dark-mode toggle */}
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <input 
              type="checkbox" 
              checked={tweaks.dark}
              onChange={e => update({ dark: e.target.checked })}
            />
            <span>Dark Mode</span>
          </label>

          <button onClick={reset} style={{
            width: '100%',
            padding: '8px 12px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>Reset</button>
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          style={{
            background: '#1A1A1A',
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '10px 16px',
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >⚙ Tweaks</button>
      )}
    </div>
  );
}
```

### Applying Tweaks

Use Tweaks in the main component:

```jsx
function App() {
  const { tweaks } = useTweaks();

  return (
    <div style={{
      '--primary': tweaks.primaryColor,
      '--font-size': `${tweaks.fontSize}px`,
      background: tweaks.dark ? '#0A0A0A' : '#FAFAFA',
      color: tweaks.dark ? '#FAFAFA' : '#1A1A1A',
    }}>
      {/* Your content */}
      <TweaksPanel />
    </div>
  );
}
```

Use variables in CSS:

```css
button.cta {
  background: var(--primary);
  color: white;
  font-size: var(--font-size);
}
```

## Typical Tweak options

Choose controls appropriate to the type of design:

### Universal
- Main color (color picker)
- Font size (slider 12-24px)
- Font (select: display font vs body font)
- Dark mode (toggle)

### Slide deck
- Theme (light/dark/brand)
- Background style (solid/gradient/image)
- Type treatment (more decorative vs. more restrained)
- Information density (minimal/standard/dense)

### Product prototype
- Layout variant (layout A / B / C)
- Interaction speed (animation speed 0.5x-2x)
- Data volume (number of mock data 5/20/100)
- Status (empty/loading/success/error)

### Animation
- Speed (0.5x-2x)
- Loop (once/loop/ping-pong)
- Easing (linear / easeOut / spring)

### Landing page
- Hero style (image/gradient/pattern/solid)
- CTA copy (several variations)
- Structure (single column / two column / sidebar)

## Tweaks design principles

### 1. Offer meaningful choices, not arbitrary controls

Every Tweak must expose **a genuine design choice**. Do not add controls no one should use, such as a 0–50px border-radius slider whose intermediate values are all unattractive.

Good tweaks expose **discrete, thoughtful variations**:
- “Corner style”: square / subtly rounded / generously rounded (three deliberate options)
- Not “corner radius”: a 0–50px slider

### 2. Less is more

A well-designed Tweaks panel has at most five or six controls. Beyond that, it becomes a configuration page and no longer supports quick exploration.

### 3. The default state is the finished design

Tweaks are **an enhancement, not a crutch**. The default state must already be complete and ready to ship. The design visible after closing the panel is the primary output.

### 4. Reasonable grouping

Group related controls:

```
---- Vision ----
Main color | Font size | Dark mode

---- Layout ----
Density | Sidebar position

---- Content ----
Display data volume | Status
```

## Forward compatibility with source-level persistence

To keep the design compatible with environments that persist Tweaks into source code, such as Claude.ai Artifacts, retain the **EDITMODE marker block**:

```jsx
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;
```

The marker is only a comment under the `localStorage` approach, but a host that supports source-code writeback can read it to persist values in the file. It is harmless in the current environment and preserves forward compatibility.

## FAQ

**The Tweaks panel covers the design**
→ Make it collapsible. Keep it closed by default as a small button and expand it only after the user clicks.

**The user's settings disappear after a refresh**
→ This implementation uses `localStorage`. If values do not persist, confirm that `localStorage` is available; private browsing can reject it, which is why the calls must be wrapped in `try`/`catch`.

**Several HTML pages need to share Tweaks**
→ Add the project name to the `localStorage` key: `design-tweaks-[projectName]`.

**One Tweak should influence another**
→ Add the relationship to `update`:

```jsx
const update = (patch) => {
  let next = { ...tweaks, ...patch };
  // When dark mode is selected, choose a compatible text color automatically.
  if (patch.dark === true && !patch.textColor) {
    next.textColor = '#F0EEE6';
  }
  setTweaks(next);
  localStorage.setItem(...);
};
```
