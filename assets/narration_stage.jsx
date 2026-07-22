/**
 * narration_stage.jsx · Narration-driven Stage
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🛑 Required reading before use: references/voiceover-pipeline.md ║
 * ║                                                                  ║
 * ║  Rule #1: The film is one continuous motion narrative, not        ║
 * ║           a collection of independent scenes.                     ║
 * ║          You are not making 7 slides. You are directing 1 movie. ║
 * ║                                                                  ║
 * ║  Rule #2: Keep one hero element alive across scenes; do not        ║
 * ║           introduce a new layout for every scene.                  ║
 * ║                                                                  ║
 * ║  Rule #3: Never hard-cut between scenes (opacity 1→0 / 0→1).      ║
 * ║           Morph; do not cut.                                      ║
 * ║                                                                  ║
 * ║  Failure mode #1 (learned in production with skill v1):           ║
 * ║           independent layout per Scene + fade-up cues + scene     ║
 * ║           switching. Full-page opacity swaps create a narrated    ║
 * ║           PowerPoint and destroy the production value.            ║
 * ║                                                                  ║
 * ║  Correct approach: put the hero directly under <NarrationStage>,  ║
 * ║           outside Scene. Read time/scene/cue state in the hero     ║
 * ║           with useNarration(), and let it derive its form from     ║
 * ║           time so motion remains continuous across scenes.        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Usage (inline in an HTML <script type="text/babel">):
 *   const { NarrationStage, Scene, Cue, useNarration } = NarrationStageLib;
 *
 *   const App = () => (
 *     <NarrationStage timeline={TIMELINE} audioSrc="voiceover.mp3"
 *                     width={1920} height={1080}>
 *       <Scene id="intro">
 *         <h1>What is a token?</h1>
 *         <Cue id="question">
 *           {(triggered) => triggered && <p>↑ This is the question</p>}
 *         </Cue>
 *       </Scene>
 *       <Scene id="token-2">
 *         <Cue id="split">
 *           {(triggered, progress) => (
 *             <div style={{opacity: triggered ? 1 : 0.3}}>...</div>
 *           )}
 *         </Cue>
 *       </Scene>
 *     </NarrationStage>
 *   );
 *
 * Time source (selected automatically):
 *   - Recording mode (window.__recording === true): use window.__time (frames driven externally)
 *   - Live playback: use <audio>.currentTime (strictly synchronized when the user presses Play)
 *
 * render-video.js compatibility:
 *   - Set window.__ready = true on the first tick
 *   - In recording mode, detect window.__recording, suppress audio, and use window.__time
 *   - Expose window.__totalDuration so the driver can calculate total frames
 *
 * Dependencies: React 18 + ReactDOM 18 + Babel standalone (same as animations.jsx)
 */

const NarrationStageLib = (() => {
  const NarrationContext = React.createContext({
    time: 0,
    scene: null,
    sceneTime: 0,
    isCueTriggered: () => false,
    cueProgress: () => 0,
  });

  /**
   * Main component: consumes timeline + audio and provides context
   *
   * Props:
   *   timeline       timeline.json object (required)
   *   audioSrc       path to voiceover.mp3 (required)
   *   width/height   Stage dimensions, default 1920x1080
   *   background     default '#0e0e0e'
   *   controls       show the bottom playback bar, default true
   *   children       animation content organized with <Scene>/<Cue>
   */
  function NarrationStage({
    timeline,
    audioSrc,
    width = 1920,
    height = 1080,
    background = '#0e0e0e',
    controls = true,
    children,
  }) {
    const audioRef = React.useRef(null);
    const [time, setTime] = React.useState(0);
    const [playing, setPlaying] = React.useState(false);
    const recording = typeof window !== 'undefined' && window.__recording === true;

    // Expose state to render-video.js.
    React.useEffect(() => {
      if (typeof window === 'undefined') return;
      window.__totalDuration = timeline.totalDuration;
      window.__ready = true;
    }, [timeline.totalDuration]);

    // Time tick.
    React.useEffect(() => {
      let raf;
      if (recording) {
        // Seek rendering (window.__seekRender injected by render-video-seek.js): freeze the self-driven clock
        // and let external window.__seek(t) advance frame by frame. Every frame is a deterministic seek; no rAF.
        if (typeof window !== 'undefined' && window.__seekRender) {
          window.__seek = (t) => setTime(Math.min(t, timeline.totalDuration));
          return;
        }
        // Recording mode: self-drive from zero with wall-clock rAF.
        // Compatible with render-video.js, which relies on natural animation progress + window.__seek reset.
        let startedAt = null;
        const tick = (now) => {
          if (startedAt === null) startedAt = now;
          setTime(Math.min((now - startedAt) / 1000, timeline.totalDuration));
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        // Expose __seek so render-video.js can call __seek(0) after ready and reset the clock.
        if (typeof window !== 'undefined') {
          window.__seek = (t) => {
            startedAt = performance.now() - t * 1000;
            setTime(t);
          };
        }
      } else {
        // Live playback: follow audio.currentTime.
        const tick = () => {
          if (audioRef.current && !audioRef.current.paused) {
            setTime(audioRef.current.currentTime);
          }
          raf = requestAnimationFrame(tick);
        };
        tick();
      }
      return () => cancelAnimationFrame(raf);
    }, [recording, timeline.totalDuration]);

    // Current scene.
    const currentScene = React.useMemo(() => {
      if (!timeline.scenes) return null;
      // Find the scene where start <= time < end. Keep the final scene through its end.
      for (let i = 0; i < timeline.scenes.length; i++) {
        const s = timeline.scenes[i];
        const next = timeline.scenes[i + 1];
        if (time >= s.start && (!next || time < next.start)) return s;
      }
      return timeline.scenes[0];
    }, [time, timeline.scenes]);

    const sceneTime = currentScene ? Math.max(0, time - currentScene.start) : 0;

    // Resolve cue state by absoluteTime, including cues in other scenes.
    const allCues = React.useMemo(() => {
      const map = {};
      for (const s of timeline.scenes || []) {
        for (const c of s.cues || []) {
          map[c.id] = c;
        }
      }
      return map;
    }, [timeline.scenes]);

    const isCueTriggered = React.useCallback(
      (cueId) => {
        const c = allCues[cueId];
        if (!c) return false;
        return time >= c.absoluteTime;
      },
      [allCues, time],
    );

    /** Ramp from 0→1 for the specified seconds after triggering, then stay at 1. Used for post-cue reveals. */
    const cueProgress = React.useCallback(
      (cueId, ramp = 0.5) => {
        const c = allCues[cueId];
        if (!c) return 0;
        const dt = time - c.absoluteTime;
        if (dt <= 0) return 0;
        if (dt >= ramp) return 1;
        return dt / ramp;
      },
      [allCues, time],
    );

    const ctx = { time, scene: currentScene, sceneTime, isCueTriggered, cueProgress, timeline };

    // Play/pause/seek controls.
    const handlePlayPause = () => {
      if (!audioRef.current) return;
      if (audioRef.current.paused) {
        audioRef.current.play();
        setPlaying(true);
      } else {
        audioRef.current.pause();
        setPlaying(false);
      }
    };

    const handleSeek = (e) => {
      if (!audioRef.current) return;
      const t = parseFloat(e.target.value);
      audioRef.current.currentTime = t;
      setTime(t);
    };

    const handleAudioEnded = () => setPlaying(false);

    return (
      <NarrationContext.Provider value={ctx}>
        <div
          style={{
            position: 'relative',
            width,
            height,
            background,
            overflow: 'hidden',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif',
          }}
        >
          {children}
        </div>
        {!recording && (
          <audio
            ref={audioRef}
            src={audioSrc}
            preload="auto"
            onEnded={handleAudioEnded}
          />
        )}
        {!recording && controls && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: '#1a1a1a',
              color: '#ddd',
              fontFamily: 'monospace',
              fontSize: 13,
              width,
              boxSizing: 'border-box',
            }}
          >
            <button
              onClick={handlePlayPause}
              style={{
                padding: '6px 14px',
                background: '#fff',
                color: '#000',
                border: 0,
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {playing ? '❚❚ Pause' : '▶ Play'}
            </button>
            <input
              type="range"
              min={0}
              max={timeline.totalDuration}
              step={0.01}
              value={time}
              onChange={handleSeek}
              style={{ flex: 1 }}
            />
            <span style={{ minWidth: 110, textAlign: 'right' }}>
              {time.toFixed(2)} / {timeline.totalDuration.toFixed(2)}s
            </span>
            <span
              style={{
                padding: '4px 10px',
                background: '#2a2a2a',
                borderRadius: 4,
                minWidth: 100,
                textAlign: 'center',
              }}
            >
              {currentScene ? currentScene.id : '—'}
            </span>
          </div>
        )}
      </NarrationContext.Provider>
    );
  }

  /**
   * Scene wrapper: render children only while the specified scene id is active
   *
   * Props:
   *   id          scene id (corresponds to timeline.scenes[].id)
   *   children    content; either a ReactNode or (sceneTime, sceneInfo) => ReactNode
   *   keepMounted default false. Set true to keep mounted and toggle visibility (useful for animation continuity)
   */
  function Scene({ id, children, keepMounted = false }) {
    const { scene, sceneTime } = React.useContext(NarrationContext);
    const isActive = scene && scene.id === id;
    if (!isActive && !keepMounted) return null;
    const content = typeof children === 'function' ? children(sceneTime, scene) : children;
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? 'auto' : 'none',
          transition: keepMounted ? 'opacity 0.2s' : undefined,
        }}
      >
        {content}
      </div>
    );
  }

  /**
   * Cue wrapper: observe a cue's trigger state
   *
   * Props:
   *   id        cue id (corresponds to timeline.scenes[].cues[].id)
   *   ramp      seconds for progress to ramp from 0→1 after the cue, default 0.5
   *   children  must be a function: (triggered: bool, progress: 0-1) => ReactNode
   */
  function Cue({ id, ramp = 0.5, children }) {
    const { isCueTriggered, cueProgress } = React.useContext(NarrationContext);
    const triggered = isCueTriggered(id);
    const progress = cueProgress(id, ramp);
    return children(triggered, progress);
  }

  /** Hook: access narration state directly inside a custom component. */
  function useNarration() {
    return React.useContext(NarrationContext);
  }

  /**
   * splitChunkToLines · Wrap text into subtitle lines no wider than maxLen visual units
   *
   * Language-aware behavior:
   * 1. Break sentences at strong punctuation in English and CJK text (.!?。！？ and newlines).
   * 2. Wrap English at word boundaries and CJK text at character boundaries.
   * 3. Count Latin letters/digits at roughly half a CJK em, preserving sensible mixed-language widths.
   * 4. Split inside a token only as a last resort (for example, an unusually long URL).
   *
   * @param text   source text
   * @param maxLen maximum visual width per line, default 13 (about 26 Latin characters or 13 CJK glyphs)
   * @returns wrapped subtitle lines
   */
  function visualLen(s) {
    let n = 0;
    for (const ch of s) {
      if (/\s/u.test(ch)) n += 0.25;
      else if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(ch)) n += 1;
      else if (/[\p{L}\p{N}]/u.test(ch)) n += 0.5;
      else n += 0.45;
    }
    return n;
  }

  function textTokens(text) {
    return text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]|[\p{L}\p{N}]+(?:['’._/@:+-][\p{L}\p{N}]+)*|\s+|[^\s]/gu) || [];
  }

  function hardWrapToken(token, maxLen) {
    const parts = [];
    let current = '';
    for (const ch of token) {
      if (current && visualLen(current + ch) > maxLen) {
        parts.push(current);
        current = ch;
      } else {
        current += ch;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  function splitChunkToLines(text, maxLen = 13) {
    const lines = [];
    let line = '';

    const flush = () => {
      const clean = line.trim();
      if (clean) lines.push(clean);
      line = '';
    };

    for (const token of textTokens(String(text || ''))) {
      if (/\n/u.test(token)) {
        flush();
        continue;
      }

      const isSpace = /^\s+$/u.test(token);
      const attachesBackward = /^[,.;:!?%)\]}。！？；：、]/u.test(token);
      const candidate = line + token;
      if (!isSpace && !attachesBackward && line.trim() && visualLen(candidate) > maxLen) flush();

      if (!isSpace && visualLen(token) > maxLen) {
        for (const part of hardWrapToken(token, maxLen)) {
          if (line.trim() && visualLen(line + part) > maxLen) flush();
          line += part;
          if (visualLen(line) >= maxLen) flush();
        }
      } else if (!(isSpace && !line)) {
        line += token;
      }

      if (/[.!?。！？]\s*$/u.test(token)) flush();
    }
    flush();
    return lines;
  }

  /**
   * Subtitles · Clean halo subtitle component (dark ink with a pale halo, no background, timed by chunks)
   *
   * Reads the active chunk from the current scene.chunks, wraps it with splitChunkToLines,
   * and allocates the chunk's time window to each line in proportion to visual length.
   *
   * Required: timeline.scenes[].chunks[] (emitted by narrate-pipeline.mjs by default)
   *
   * Props (override the default style):
   *   bottom    pixels from the bottom, default 90 (keeps text away from the edge)
   *   fontSize  font size, default 32
   *   color     text color, default dark ink #1a1a1a (for pale paper backgrounds)
   *   haloColor halo color, default rgba(245,241,232,0.9) (for #f5f1e8 backgrounds)
   *   maxLen    maximum visual width per line, default 13
   *
   * For dark scenes, set color to '#fff' and haloColor to 'rgba(0,0,0,0.85)'.
   *
   * Karaoke mode (word-level highlighting; requires words in timeline chunks, emitted by narrate-pipeline.mjs by default):
   *   karaoke       true enables it, default false. Show a full line and recolor each spoken token
   *   karaokeColor  color of spoken tokens, default brand orange '#e8590c'
   *   If a chunk has no words data, fall back automatically to ordinary chunk mode.
   *   Note: words contain text-normalized output (for example, "2025" may become "twenty twenty-five").
   *   Karaoke lines use those tokens directly so highlighting remains aligned with speech; they may differ from chunk.text.
   */
  function shouldInsertSpace(previous, next) {
    if (!previous || !next || /\s$/u.test(previous) || /^\s/u.test(next)) return false;
    if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(previous + next)) return false;
    if (/^[,.;:!?%)\]}。！？；：、]/u.test(next)) return false;
    if (/[(\[{]$/u.test(previous)) return false;
    const previousIsWordToken = /[\p{L}\p{N}][,.;:!?%)\]}"'’]?$/u.test(previous);
    const nextIsWordToken = /^["'‘“]?[\p{L}\p{N}]/u.test(next);
    return previousIsWordToken && nextIsWordToken;
  }

  function splitWordsToLines(words, maxLen = 13) {
    // Greedily pack timestamped tokens into lines ≤maxLen; preserve English word boundaries and break after strong English/CJK punctuation.
    const lines = [];
    let cur = [];
    let curLen = 0;
    for (const w of words) {
      const prev = cur[cur.length - 1];
      const separator = prev && shouldInsertSpace(prev.text, w.text) ? ' ' : '';
      const wLen = visualLen(separator + w.text);
      if (cur.length > 0 && curLen + wLen > maxLen) { lines.push(cur); cur = []; curLen = 0; }
      cur.push(w);
      const actualPrev = cur.length > 1 ? cur[cur.length - 2] : null;
      curLen += visualLen((actualPrev && shouldInsertSpace(actualPrev.text, w.text) ? ' ' : '') + w.text);
      if (/[.!?。！？]\s*$/u.test(w.text)) { lines.push(cur); cur = []; curLen = 0; }
    }
    if (cur.length > 0) lines.push(cur);
    return lines;
  }

  function Subtitles({ bottom = 90, fontSize = 32, color = '#1a1a1a', haloColor = 'rgba(245,241,232,0.9)', maxLen = 13, karaoke = false, karaokeColor = '#e8590c' } = {}) {
    const { time, scene } = React.useContext(NarrationContext);
    if (!scene || !scene.chunks) return null;
    const active = scene.chunks.find(c => time >= c.absoluteStart && time < c.absoluteEnd);
    if (!active) return null;

    // —— Karaoke mode: show a full line and highlight tokens as spoken (no CSS transition, deterministic seek rendering). ——
    if (karaoke && active.words && active.words.length > 0) {
      const wordLines = splitWordsToLines(active.words, maxLen);
      let activeWLine = wordLines[0];
      for (const ln of wordLines) {
        if (time >= ln[0].absoluteStart) activeWLine = ln;
        else break;
      }
      const lineStart = activeWLine[0].absoluteStart;
      const lineProg = Math.max(0, Math.min(1, (time - (lineStart - 0.15)) / 0.15)); // Fade the line in 0.15s early.
      return React.createElement('div', {
        style: { position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 },
      }, React.createElement('div', {
        key: lineStart,
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif',
          fontSize, fontWeight: 600,
          letterSpacing: '0.04em', lineHeight: 1.2, textAlign: 'center',
          textShadow: `0 0 6px ${haloColor}, 0 0 12px ${haloColor}, 0 1px 2px rgba(255,255,255,0.5)`,
          opacity: lineProg, transform: `translateY(${(1 - lineProg) * 4}px)`,
        },
      }, activeWLine.map((w, i) => React.createElement('span', {
        key: i,
        style: { color: time >= w.absoluteStart ? karaokeColor : color },
      }, `${i > 0 && shouldInsertSpace(activeWLine[i - 1].text, w.text) ? ' ' : ''}${w.text}`))));
    }

    // —— Ordinary chunk mode. ——
    const lines = splitChunkToLines(active.text, maxLen);
    if (lines.length === 0) return null;
    const totalLen = lines.reduce((s, l) => s + visualLen(l), 0);
    const chunkDur = active.absoluteEnd - active.absoluteStart;
    let acc = active.absoluteStart;
    let activeLine = lines[lines.length - 1];
    let lineStart = active.absoluteStart;
    for (const line of lines) {
      const dur = (visualLen(line) / totalLen) * chunkDur;
      if (time < acc + dur) { activeLine = line; lineStart = acc; break; }
      acc += dur;
    }
    const lineProg = Math.min(1, (time - lineStart) / 0.15);
    return React.createElement('div', {
      style: { position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 },
    }, React.createElement('div', {
      key: lineStart,
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans SC", sans-serif',
        fontSize, fontWeight: 600, color,
        letterSpacing: '0.04em', lineHeight: 1.2, textAlign: 'center',
        textShadow: `0 0 6px ${haloColor}, 0 0 12px ${haloColor}, 0 1px 2px rgba(255,255,255,0.5)`,
        opacity: lineProg, transform: `translateY(${(1 - lineProg) * 4}px)`,
      },
    }, activeLine));
  }

  /**
   * useSceneFade · Soft fade helper for supporting elements within a scene
   *
   * Rule #2 forbids hard cuts between scenes, but supporting elements within a scene (data cards, pull quotes)
   * remain visible until the scene ends after their cue triggers. Without a fade-out they persist awkwardly or
   * disappear abruptly at the next scene. This hook provides a consistent [fade in → hold → fade out] transition.
   *
   * Usage (multiply op into the supporting element's opacity):
   *   const op = useSceneFade('md-side', 0.6, 0.8);  // 0.6s in, 0.8s out
   *   <Cue id="agents-md">{(t, p) => (
   *     <div style={{ opacity: op * p }}>...</div>
   *   )}</Cue>
   *
   * The data card now fades in during the first 0.6s of md-side and begins fading out 0.8s before the scene ends.
   * It overlaps the next scene's supporting-element fade-in, eliminating a hard cut.
   *
   * @param sceneId  scene id
   * @param fadeIn   entry fade duration in seconds (default 0.5)
   * @param fadeOut  exit fade duration in seconds (default 0.5)
   * @returns opacity multiplier between 0 and 1
   */
  function useSceneFade(sceneId, fadeIn = 0.5, fadeOut = 0.5) {
    const { time, timeline } = React.useContext(NarrationContext);
    if (!timeline) return 0;
    const s = timeline.scenes.find(x => x.id === sceneId);
    if (!s) return 0;
    const inT = (time - s.start) / fadeIn;
    const outT = (s.end - time) / fadeOut;
    const v = Math.min(1, Math.min(inT, outT));
    return Math.max(0, v);
  }

  return { NarrationStage, Scene, Cue, useNarration, useSceneFade, Subtitles, splitChunkToLines, splitWordsToLines };
})();

if (typeof window !== 'undefined') {
  Object.assign(window, { NarrationStageLib });
}
