#!/usr/bin/env node
/**
 * tts-doubao.mjs · Doubao Voice TTS (Volcengine OpenSpeech)
 *
 * Usage:
 *   node scripts/tts-doubao.mjs --text "Hello" --out demo.mp3
 *   node scripts/tts-doubao.mjs --text-file script.txt --out out.mp3 --speed 1.0
 *   node scripts/tts-doubao.mjs --text "Hello" --out demo.mp3 --timestamps   # Include word-level timestamps
 *
 * Output:
 *   - Writes the audio file to --out
 *   - Prints one JSON line to stdout: {"path":"...","duration":12.34,"bytes":54321}
 *   - With --timestamps, also includes words: [{text,start,end,confidence}] (seconds from the start of this segment)
 *     Note: timestamp text is text-normalized (for example, "2025" may become "twenty twenty-five"),
 *     and punctuation is attached to the preceding token. Requires a 2.0 resource
 *     (seed-tts-2.0 / seed-icl-2.0); Chinese and English only.
 *
 * Dependencies: Node 18+ (built-in fetch/crypto), ffprobe (duration measurement; brew install ffmpeg)
 *
 * Environment (loaded automatically from .env in the skill root; process.env overrides values):
 *   DOUBAO_TTS_API_KEY     Optional (new API-key authentication)
 *   DOUBAO_APP_ID          Optional (console App ID, paired with DOUBAO_ACCESS_KEY)
 *   DOUBAO_ACCESS_KEY      Optional (console Access Token, paired with DOUBAO_APP_ID)
 *   DOUBAO_TTS_VOICE_ID    Required (voice ID)
 *   DOUBAO_TTS_RESOURCE_ID Optional (inferred from the voice by default)
 *   DOUBAO_TTS_ENDPOINT    Default: https://openspeech.bytedance.com/api/v3/tts/unidirectional
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(SKILL_ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

function parseArgs(argv) {
  const args = { speed: '1.0', encoding: 'mp3' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--text') args.text = argv[++i];
    else if (a === '--text-file') args.textFile = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--speed') args.speed = argv[++i];
    else if (a === '--voice') args.voice = argv[++i];
    else if (a === '--encoding') args.encoding = argv[++i];
    else if (a === '--timestamps') args.timestamps = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.error(`
tts-doubao.mjs · Doubao Voice TTS

  --text <str>          Text to synthesize
  --text-file <path>    Read text from a file (mutually exclusive with --text)
  --out <path>          Output audio path (required)
  --speed <float>       Speech-rate multiplier, default 1.0 (0.5–2.0)
  --voice <voice_id>    Override the voice ID from .env
  --encoding <ext>      mp3 / wav / pcm, default mp3
  --timestamps          Request word-level timestamps (enable_subtitle); adds a words array to the result JSON
`.trim());
  process.exit(1);
}

function getDuration(filePath) {
  try {
    const out = execFileSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath,
    ], { encoding: 'utf8' });
    return parseFloat(out.trim());
  } catch (e) {
    return null;
  }
}

function inferResourceId(voiceId) {
  // Cloned voices default to 2.0: this account only has seed-icl-2.0 access (1.0 returns 403 resource not granted),
  // and word-level timestamps (enable_subtitle) are available only with 2.0 resources.
  if (voiceId.startsWith('S_')) return 'seed-icl-2.0';
  if (voiceId.includes('uranus')) return 'seed-tts-2.0';
  return 'seed-tts-1.0';
}

function speedToSpeechRate(speed) {
  const ratio = parseFloat(speed);
  if (!Number.isFinite(ratio)) return 0;
  return Math.max(-50, Math.min(100, Math.round((ratio - 1) * 100)));
}

function buildAuthHeaders({ requestId, resourceId }) {
  const apiKey = process.env.DOUBAO_TTS_API_KEY;
  const appId = process.env.DOUBAO_APP_ID;
  const accessKey = process.env.DOUBAO_ACCESS_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Resource-Id': resourceId,
    'X-Api-Request-Id': requestId,
  };

  if (apiKey) {
    headers['X-Api-Key'] = apiKey;
    return headers;
  }

  if (!appId) throw new Error('Missing DOUBAO_TTS_API_KEY or DOUBAO_APP_ID (check .env)');
  if (!accessKey) throw new Error('Missing DOUBAO_ACCESS_KEY (check .env)');

  headers['X-Api-App-Id'] = appId;
  headers['X-Api-Access-Key'] = accessKey;
  return headers;
}

async function readV3Audio(res) {
  const text = await res.text();
  const chunks = [];
  const words = []; // Word-level timestamps (with enable_subtitle, the server returns sentence.words per sentence).
  let finalCode = null;
  let finalMessage = '';

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let json;
    try {
      json = JSON.parse(trimmed);
    } catch (e) {
      throw new Error(`API response line is not JSON: ${trimmed.slice(0, 200)}`);
    }

    const code = json.code ?? 0;
    if (code === 20000000) {
      finalCode = code;
      finalMessage = json.message || '';
      break;
    }
    if (code !== 0) {
      throw new Error(`API returned an error: code=${code} msg=${json.message || JSON.stringify(json)}`);
    }
    if (json.data) chunks.push(Buffer.from(json.data, 'base64'));
    if (json.sentence && Array.isArray(json.sentence.words)) {
      for (const w of json.sentence.words) {
        words.push({
          text: w.word,
          start: w.startTime,
          end: w.endTime,
          confidence: w.confidence,
        });
      }
    }
  }

  if (!chunks.length) {
    const detail = finalCode ? `final code ${finalCode} ${finalMessage}` : text.slice(0, 500);
    throw new Error(`API response contained no audio data: ${detail}`);
  }
  return { audio: Buffer.concat(chunks), words };
}

async function tts({ text, voice, speed, encoding, timestamps }) {
  const endpoint = process.env.DOUBAO_TTS_ENDPOINT || 'https://openspeech.bytedance.com/api/v3/tts/unidirectional';
  const voiceId = voice || process.env.DOUBAO_TTS_VOICE_ID || process.env.DOUBAO_SPEAKER;
  const resourceId = process.env.DOUBAO_TTS_RESOURCE_ID || inferResourceId(voiceId || '');
  const requestId = randomUUID();

  if (!voiceId) throw new Error('Missing DOUBAO_TTS_VOICE_ID (check .env or pass --voice)');

  const body = {
    user: { uid: 'html-design-studio' },
    req_params: {
      text,
      speaker: voiceId,
      audio_params: {
        format: encoding,
        sample_rate: 24000,
        speech_rate: speedToSpeechRate(speed),
        // Word-level timestamps: supported only by 2.0 resources (seed-tts-2.0 / seed-icl-2.0), for Chinese and English.
        ...(timestamps ? { enable_subtitle: true } : {}),
      },
    },
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: buildAuthHeaders({ requestId, resourceId }),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 500)}`);
  }

  return readV3Audio(res);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) usage();

  let text = args.text;
  if (!text && args.textFile) {
    text = fs.readFileSync(args.textFile, 'utf8').trim();
  }
  if (!text) {
    console.error('Error: missing --text or --text-file');
    usage();
  }
  if (!args.out) {
    console.error('Error: missing --out');
    usage();
  }

  const outPath = path.resolve(args.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const { audio, words } = await tts({
    text,
    voice: args.voice,
    speed: args.speed,
    encoding: args.encoding,
    timestamps: args.timestamps,
  });

  fs.writeFileSync(outPath, audio);
  const duration = getDuration(outPath);
  const result = {
    path: outPath,
    bytes: audio.length,
    duration,
    text_chars: text.length,
  };
  if (args.timestamps) result.words = words;
  console.log(JSON.stringify(result));
}

main().catch((err) => {
  console.error(`TTS failed: ${err.message}`);
  process.exit(1);
});
