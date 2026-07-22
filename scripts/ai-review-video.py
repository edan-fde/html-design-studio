#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "requests>=2.28.0",
# ]
# ///
"""
Closed-loop AI video review: send a rendered animation MP4 to a video-understanding
model (seed-2.0-lite), review it segment by segment against a fixed checklist, scan a
low-resolution copy of the full film, and consolidate the findings into a structured
Markdown report.

Usage:
    uv run ai-review-video.py --video final-film.mp4
    uv run ai-review-video.py --video final-film.mp4 --context director-notes.md
    uv run ai-review-video.py --video final-film.mp4 --segment-len 60 --output report.md

Pipeline:
    1. Probe duration and audio tracks with ffprobe.
    2. If audio is present, extract an SFX-onset table with ffmpeg silencedetect. The
       model cannot hear the video's audio (verified 2026-07-17: input_video sends
       visuals only), so sync review combines local onset detection with model vision.
    3. Split and compress by --segment-len (1280px wide / 15 fps / CRF 28; flat
       animation is roughly 0.5 MB per minute).
    4. Review each segment against checklist items ①–⑧, with source-film timestamps.
    5. Separately review a low-resolution full-film pass (960px / 10 fps) for
       cross-segment narrative continuity and hero continuity.
    6. Make a text-only consolidation call that merges findings by checklist item;
       retain raw segment findings in an appendix.

API key: read ARK_API_KEY only from the environment or a portable .env location;
never hard-code it. Set HUASHU_ENV_FILE to override the .env path.
Proxy handling: requests disables trust_env to avoid inherited ALL_PROXY issues.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from base64 import b64encode
from pathlib import Path

import requests

API_URL = "https://ark.cn-beijing.volces.com/api/v3/responses"
DEFAULT_MODEL = "doubao-seed-2-0-lite-260215"
ENV_PATHS = [
    *([Path(os.environ["HUASHU_ENV_FILE"]).expanduser()] if os.getenv("HUASHU_ENV_FILE") else []),
    Path.cwd() / ".env",
    Path(__file__).resolve().parents[1] / ".env",
    Path.home() / ".config" / "huashu-design" / ".env",
]
MAX_SEGMENT_MB = 8  # Recompress a segment at a lower setting if its output exceeds this size.

CHECKLIST = """\
① Black frames / empty frames / incomplete rendering: full-frame or large black/white
   areas, missing elements, or visibly broken assets.
② Text problems: title cards or labels are clipped, overflow their containers, contain
   typos or mojibake, or overlap other text.
③ Unintended overlap and occlusion: elements cover one another, use an incorrect
   stacking order, or visually intersect.
④ Narrative continuity: classify scene transitions as hard cuts (the entire frame
   changes abruptly with no bridge), crossfades (the old scene fades away), or morphs
   (elements continuously transform or move into the next scene). State which type you
   actually observe; never misreport a crossfade as a hard cut. Hard cut = ⚡. If the
   director's notes require a morph but the film uses a crossfade, report 💡 "lazy transition."
⑤ Hero / subject continuity: if a principal element persists through the film, does it
   break, disappear, or jump position during a scene transition?
⑥ Dead pacing: use the objective static-segment table below (frame-by-frame ffmpeg
   detection of completely still intervals ≥3 seconds). Do not search for dead spots;
   classify every listed interval as an intentional hold (reading a title card, holding
   a comment overlay, or a final freeze) or a genuine dead spot (nothing to read or
   absorb while the image remains still). Intentional hold = omit or 💡; dead spot = ⚡.
⑦ SFX cues (see onset table below): verify that each detected sound-effect time aligns
   with a corresponding visual event.
⑧ Composition: obvious imbalance, large meaningless empty areas, or important elements
   pressed against an edge or corner."""

SEVERITY_RULE = """\
Use three severity levels:
- ⚠️ Critical: must be fixed before delivery (black frames, typos, clipped text,
  severe element collisions, or visibly broken assets).
- ⚡ Important: clearly harms the viewing experience (abrupt hard cuts, broken hero
  continuity, dead spots over three seconds, or clearly unbalanced composition).
- 💡 Suggestion: a worthwhile polish improvement."""


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def load_api_key():
    for p in ENV_PATHS:
        if p.exists():
            for line in p.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
            break
    key = os.getenv("ARK_API_KEY")
    if not key or key.startswith("your_"):
        searched = ", ".join(str(p) for p in ENV_PATHS)
        sys.exit(f"Error: ARK_API_KEY is not configured. Checked: {searched}. Refusing to fabricate review results.")
    return key


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"Command failed: {' '.join(cmd)}\n{r.stderr[-2000:]}")
    return r


def probe(video: Path):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-show_entries", "stream=codec_type", "-of", "json", str(video)])
    info = json.loads(r.stdout)
    duration = float(info["format"]["duration"])
    has_audio = any(s.get("codec_type") == "audio" for s in info.get("streams", []))
    return duration, has_audio


def detect_audio_onsets(video: Path, noise_db=-45, min_silence=0.3):
    """Infer SFX onsets with silencedetect; return source-film timestamps in seconds."""
    r = subprocess.run(
        ["ffmpeg", "-i", str(video), "-af",
         f"silencedetect=noise={noise_db}dB:d={min_silence}", "-f", "null", "-"],
        capture_output=True, text=True)
    onsets = [round(float(m), 1) for m in
              re.findall(r"silence_end:\s*([\d.]+)", r.stderr)]
    # If the opening is not silent (sound starts immediately), add an onset at 0.
    starts = re.findall(r"silence_start:\s*([\d.-]+)", r.stderr)
    if starts and float(starts[0]) > min_silence:
        onsets.insert(0, 0.0)
    return onsets


def detect_static_segments(video: Path, noise=0.001, min_dur=3.0):
    """Find completely static intervals ≥min_dur with freezedetect; return source-film (start, end) seconds."""
    r = subprocess.run(
        ["ffmpeg", "-i", str(video), "-vf",
         f"freezedetect=n={noise}:d={min_dur}", "-f", "null", "-"],
        capture_output=True, text=True)
    starts = re.findall(r"freeze_start:\s*([\d.]+)", r.stderr)
    durs = re.findall(r"freeze_duration:\s*([\d.]+)", r.stderr)
    return [(round(float(s), 1), round(float(s) + float(d), 1))
            for s, d in zip(starts, durs)]


def compress(src: Path, dst: Path, ss=None, t=None, width=1280, fps=15, crf=28):
    cmd = ["ffmpeg", "-y", "-v", "error"]
    if ss is not None:
        cmd += ["-ss", str(ss)]
    if t is not None:
        cmd += ["-t", str(t)]
    cmd += ["-i", str(src), "-vf", f"scale={width}:-2,fps={fps}",
            "-c:v", "libx264", "-crf", str(crf), "-preset", "veryfast",
            "-pix_fmt", "yuv420p", "-an", str(dst)]
    run(cmd)


def fmt_ts(sec: float) -> str:
    return f"{int(sec) // 60}:{int(sec) % 60:02d}"


def ask_model(session, api_key, model, prompt, video_path: Path | None = None, retries=1):
    content = []
    if video_path is not None:
        b64 = b64encode(video_path.read_bytes()).decode()
        content.append({"type": "input_video", "video_url": f"data:video/mp4;base64,{b64}"})
    content.append({"type": "input_text", "text": prompt})
    payload = {"model": model, "input": [{"role": "user", "content": content}]}
    last_err = None
    for attempt in range(retries + 1):
        try:
            resp = session.post(
                API_URL, json=payload, timeout=600,
                headers={"Authorization": f"Bearer {api_key}",
                         "Content-Type": "application/json"})
            if resp.status_code != 200:
                last_err = f"API {resp.status_code}: {resp.text[:500]}"
                continue
            data = resp.json()
            usage = data.get("usage", {})
            text = ""
            out = data.get("output")
            if isinstance(out, list):
                for item in out:
                    if isinstance(item, dict) and item.get("type") == "message":
                        for c in item.get("content", []):
                            if isinstance(c, dict) and c.get("type") == "output_text":
                                text += c.get("text", "")
            elif isinstance(out, str):
                text = out
            if not text:
                choices = data.get("choices", [])
                if choices:
                    text = choices[0].get("message", {}).get("content", "")
            if text:
                return text, usage
            last_err = f"Response contained no text: {json.dumps(data, ensure_ascii=False)[:500]}"
        except requests.RequestException as e:
            last_err = f"Network error: {e}"
        if attempt < retries:
            log(f"  Retrying ({last_err[:120]})...")
            time.sleep(3)
    raise RuntimeError(last_err)


def segment_prompt(seg_start, seg_end, duration, context_text, onsets_in_seg,
                   statics_in_seg):
    p = ["You are a quality-control reviewer for finished animation. Be exacting: identify flaws rather than praising the film.",
         f"This video is one segment of an animated film with a total duration of {fmt_ts(duration)}. "
         f"It corresponds to source-film time {fmt_ts(seg_start)}–{fmt_ts(seg_end)}. "
         f"Second t within this clip equals {fmt_ts(seg_start)} + t in the source film. "
         "Use source-film timestamps (MM:SS) throughout your report."]
    if context_text:
        p.append("Here are the director's notes for the full film. Use them as context to determine narrative intent and expected content:\n"
                 "<director-notes>\n" + context_text + "\n</director-notes>")
    p.append("Check every checklist item below. Report findings from this segment only:\n" + CHECKLIST)
    if statics_in_seg:
        ts = ", ".join(f"{fmt_ts(a)}–{fmt_ts(b)} ({b - a:.1f}s)" for a, b in statics_in_seg)
        p.append(f"Objective static-segment table for item ⑥ (source-film times within this segment): {ts}. Classify each as an intentional hold or a genuine dead spot.")
    else:
        p.append('No static interval ≥3 seconds was detected in this segment. Write "None found" for item ⑥.')
    if onsets_in_seg:
        ts = ", ".join(f"{fmt_ts(t)} ({t}s)" for t in onsets_in_seg)
        p.append(f"SFX onset table for item ⑦ (actual source-film times within this segment): {ts}. "
                 "You cannot hear the audio. Check only whether each timestamp contains a visual event that merits a sound effect "
                 "(transition, title-card landing, impact, or element appearance). Report any onset with no corresponding event as a missed cue.")
    else:
        p.append("No SFX onset was detected in this segment, so skip item ⑦. However, if a strong visual event "
                 "(impact, title card, or transition) has no SFX coverage, you may suggest it under item ⑦ with 💡.")
    p.append(SEVERITY_RULE)
    p.append("Output Markdown organized by items ①–⑧. Under each item, use this list format:\n"
             "- [source MM:SS] severity emoji — specific description\n"
             'If an item has no problem, write "None found." Report only what you actually see; mark uncertain findings as "Uncertain" and never invent details.')
    return "\n\n".join(p)


def global_prompt(duration, context_text):
    p = ["You are a quality-control reviewer for finished animation. This is a low-resolution review copy of the full film "
         "(compression and reduced image quality are expected; do not report fidelity or sharpness issues). Total duration: " + fmt_ts(duration) + "."]
    if context_text:
        p.append("Director's notes:\n<director-notes>\n" + context_text + "\n</director-notes>")
    p.append("Do only these three things (segment reviews handle detail issues):\n"
             "A. Narrative continuity: from beginning to end, which timestamps use PowerPoint-like hard cuts (an entire-page change with no transition)?\n"
             "B. Hero / subject continuity: at which transitions does the film's principal recurring element break, disappear, or jump?\n"
             "C. Overall pacing: which intervals drag (no new information for too long), and which feel rushed?\n\n"
             + SEVERITY_RULE +
             '\n\nOutput Markdown with sections A/B/C and [MM:SS] timestamps for every finding. Write "None found" when appropriate. Never invent details.')
    return "\n\n".join(p)


def synthesis_prompt(duration, seg_reports, global_report):
    parts = ["You are the editor of a quality-control report. Below are raw segment reviews and a full-film review "
             "for the same " + fmt_ts(duration) + " animated film. Merge them into one final report body.",
             "Requirements:\n"
             "1. Organize by checklist items ①–⑧. Under each, list findings chronologically as: - [MM:SS] severity description\n"
             '2. Merge duplicate reports of the same problem. If segment and full-film reviews conflict, retain both and mark them "Uncertain."\n'
             "3. Preserve every finding's timestamp and severity emoji (⚠️/⚡/💡). Add no findings absent from the raw records.\n"
             '4. Open with a "Total issues: ⚠️x ⚡y 💡z" line and an overall assessment of no more than three sentences.\n'
             "5. Output only the Markdown report body, with no pleasantries.",
             "<full-film-review>\n" + global_report + "\n</full-film-review>"]
    for (s, e, text) in seg_reports:
        parts.append(f"<segment-review source={fmt_ts(s)}–{fmt_ts(e)}>\n{text}\n</segment-review>")
    return "\n\n".join(parts)


def main():
    ap = argparse.ArgumentParser(description="AI video review: animation MP4 → structured checklist report")
    ap.add_argument("--video", required=True, help="Path to the final MP4")
    ap.add_argument("--context", help="Optional director's notes / scene outline Markdown for review context")
    ap.add_argument("--segment-len", type=int, default=60, help="Segment length in seconds (default: 60)")
    ap.add_argument("--model", default=DEFAULT_MODEL, help=f"Model (default: {DEFAULT_MODEL})")
    ap.add_argument("--output", "-o", help="Report path (default: <video-name>-AI-review.md next to the video)")
    args = ap.parse_args()

    video = Path(args.video).resolve()
    if not video.exists():
        sys.exit(f"Error: video not found: {video}")
    out_path = Path(args.output) if args.output else video.parent / f"{video.stem}-AI-review.md"

    context_text = ""
    if args.context:
        ctx = Path(args.context)
        if not ctx.exists():
            sys.exit(f"Error: context file not found: {ctx}")
        context_text = ctx.read_text(encoding="utf-8")[:12000]

    api_key = load_api_key()
    session = requests.Session()
    session.trust_env = False  # Avoid inherited proxy variables such as ALL_PROXY.

    duration, has_audio = probe(video)
    log(f"Video {fmt_ts(duration)}; audio={'yes' if has_audio else 'no'}")

    onsets = detect_audio_onsets(video) if has_audio else []
    if has_audio:
        log(f"SFX onset detection: {len(onsets)} → {['%.1f' % t for t in onsets]}")

    # Objective static-segment detection; merge adjacent intervals.
    raw_statics = detect_static_segments(video)
    statics = []
    for a, b in raw_statics:
        if statics and a - statics[-1][1] < 0.2:
            statics[-1] = (statics[-1][0], b)
        else:
            statics.append((a, b))
    log(f"Static-segment detection (≥3s): {len(statics)} → "
        f"{[f'{a:.0f}-{b:.0f}s' for a, b in statics]}")

    total_usage = {"input_tokens": 0, "output_tokens": 0}

    def add_usage(u):
        for k in total_usage:
            total_usage[k] += u.get(k, 0) or 0

    seg_reports, failures = [], []
    with tempfile.TemporaryDirectory(prefix="ai-review-") as tmp:
        tmp = Path(tmp)
        # Segment the film.
        bounds = []
        t0 = 0.0
        while t0 < duration - 1:
            bounds.append((t0, min(t0 + args.segment_len, duration)))
            t0 += args.segment_len
        log(f"Segments: {len(bounds)} × ≤{args.segment_len}s")

        for i, (s, e) in enumerate(bounds, 1):
            seg = tmp / f"seg{i}.mp4"
            compress(video, seg, ss=s, t=e - s)
            if seg.stat().st_size > MAX_SEGMENT_MB * 1024 * 1024:
                compress(video, seg, ss=s, t=e - s, width=960, fps=10, crf=32)
            mb = seg.stat().st_size / 1048576
            onsets_in = [t for t in onsets if s <= t < e]
            statics_in = [(a, b) for a, b in statics if a < e and b > s]
            log(f"Segment {i} {fmt_ts(s)}–{fmt_ts(e)} ({mb:.1f} MB, onsets×{len(onsets_in)}, "
                f"static intervals×{len(statics_in)}): submitting for review...")
            try:
                text, usage = ask_model(session, api_key, args.model,
                                        segment_prompt(s, e, duration, context_text,
                                                       onsets_in, statics_in),
                                        seg)
                add_usage(usage)
                seg_reports.append((s, e, text))
            except RuntimeError as err:
                log(f"  Segment {i} review failed: {err}")
                failures.append((s, e, str(err)))

        # Low-resolution full-film pass.
        log("Submitting low-resolution full film for narrative/hero/pacing review...")
        full = tmp / "full.mp4"
        compress(video, full, width=960, fps=10, crf=30)
        global_report, global_fail = "", None
        try:
            global_report, usage = ask_model(session, api_key, args.model,
                                             global_prompt(duration, context_text), full)
            add_usage(usage)
        except RuntimeError as err:
            global_fail = str(err)
            log(f"  Full-film pass failed: {err}")

    if not seg_reports and not global_report:
        sys.exit("Error: every review call failed, so no report can be produced. Refusing to fabricate results.\n" +
                 "\n".join(f"{fmt_ts(s)}–{fmt_ts(e)}: {m}" for s, e, m in failures))

    # Consolidate the final report.
    log("Consolidating the final report...")
    try:
        body, usage = ask_model(session, api_key, args.model,
                                synthesis_prompt(duration, seg_reports,
                                                 global_report or "(Full-film pass failed; no record available.)"))
        add_usage(usage)
    except RuntimeError as err:
        log(f"Consolidation call failed ({err}); falling back to concatenated raw records")
        body = "> Consolidation call failed. The raw records from each pass are concatenated below.\n\n" + \
               (global_report or "") + "\n\n" + \
               "\n\n".join(f"## Segment {fmt_ts(s)}–{fmt_ts(e)}\n{t}" for s, e, t in seg_reports)

    lines = [f"# {video.name} · AI Review Report",
             "",
             f"> Model: {args.model} | Reviewed: {time.strftime('%Y-%m-%d %H:%M')} | "
             f"Duration: {fmt_ts(duration)} | Segments: {len(seg_reports)} succeeded/{len(failures)} failed | "
             f"SFX onsets: {len(onsets)} / static intervals ≥3s: {len(statics)} "
             f"(both detected objectively with local ffmpeg; the model cannot hear audio, so sync review combines onsets with visuals) | "
             f"tokens: in {total_usage['input_tokens']} / out {total_usage['output_tokens']}",
             ""]
    if failures:
        lines.append("> ⚠️ The following intervals failed review and are not covered: " +
                     "; ".join(f"{fmt_ts(s)}–{fmt_ts(e)} ({m[:100]})" for s, e, m in failures))
        lines.append("")
    if global_fail:
        lines.append(f"> ⚠️ Full-film continuity pass failed: {global_fail[:200]}")
        lines.append("")
    lines.append(body)
    lines.append("\n\n---\n\n## Appendix · Objective Detection Data (ffmpeg, not model judgment)\n")
    lines.append("Static intervals ≥3s: " + (", ".join(
        f"{fmt_ts(a)}–{fmt_ts(b)} ({b - a:.1f}s)" for a, b in statics) or "none"))
    lines.append("\nSFX onsets: " + (", ".join(fmt_ts(t) for t in onsets) or "none / no audio track"))
    lines.append("\n## Appendix · Raw Review Records by Segment\n")
    if global_report:
        lines.append("### Full-Film Pass (Narrative / Hero / Pacing)\n\n" + global_report + "\n")
    for s, e, t in seg_reports:
        lines.append(f"### Segment · Source {fmt_ts(s)}–{fmt_ts(e)}\n\n{t}\n")

    out_path.write_text("\n".join(lines), encoding="utf-8")
    log(f"Report written to: {out_path}")
    print(out_path)


if __name__ == "__main__":
    main()
