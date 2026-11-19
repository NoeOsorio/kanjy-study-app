// Kanjy data build: `npm run data`.
// One reproducible script that turns pinned open sources (sources.json) into
// public/data/ (levels, strokes, search). Human corrections live only in
// overrides.json. Node 22, ESM. Runtime deps: none besides kuromoji (dev).
// System tools used through child_process: `bunzip2` (Tatoeba exports are bz2)
// and `unzip` (KanjiVG release is a zip); both ship with macOS and Linux.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import {
  LEVEL_RANK, alignToken, chunkLessons, difficulty, isKanji, kanaToRomaji,
  stripSvg, toHiragana, unescapeXml,
} from './lib.mjs';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CACHE = path.join(ROOT, '.cache');
const OUT = path.join(ROOT, 'public/data');
const sources = JSON.parse(fs.readFileSync(path.join(HERE, 'sources.json'), 'utf8'));
const overrides = JSON.parse(fs.readFileSync(path.join(HERE, 'overrides.json'), 'utf8'));
const tokenReadings = overrides._tokenReadings ?? {};
const wordMeanings = overrides._wordMeanings ?? {};
const extraWords = overrides._extraWords ?? {};
for (const k of Object.keys(overrides)) if (k.startsWith('_')) delete overrides[k];

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const EXPECTED_COUNTS = { N5: 79, N4: 166, N3: 367, N2: 367, N1: 1232 };
// research.md R1: what the previous measurement found, to compare against.
const R1 = {
  commonWord: { N5: 79, N4: 166, N3: 367, N2: 366, N1: 994 },
  anyWord: { N5: 79, N4: 166, N3: 367, N2: 367, N1: 1165 },
  sentence: { N5: 79, N4: 166, N3: 367, N2: 357, N1: 755 },
};
const MAX_WORDS = 5;
const MAX_SENTENCES = 3;
const MAX_SENTENCE_CHARS = 25;
const failures = [];
const fail = (msg) => failures.push(msg);

// ------------------------------------------------------------ download
const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

async function fetchTo(url, dest) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function ensureSource(name, src) {
  const dest = path.join(CACHE, src.file);
  if (fs.existsSync(dest) && sha256(dest) === src.sha256) return dest;
  if (fs.existsSync(dest)) console.log(`  ${name}: cached file does not match the pinned sha256, downloading again`);
  const urls = [src.url, ...(src.mirrors ?? [])];
  let lastError = '';
  for (const url of urls) {
    try {
      console.log(`  ${name}: downloading ${url}`);
      await fetchTo(url, dest);
      const got = sha256(dest);
      if (got === src.sha256) return dest;
      lastError = `sha256 mismatch for ${src.file}: pinned ${src.sha256}, got ${got}. The upstream file changed; review it and update sources.json.`;
    } catch (e) {
      lastError = String(e.message ?? e);
    }
  }
  fs.rmSync(dest, { force: true });
  throw new Error(`${name}: ${lastError}`);
}

const readGz = (file) => zlib.gunzipSync(fs.readFileSync(file)).toString('utf8');
const readBz2 = (file) =>
  execFileSync('bunzip2', ['-c', file], { maxBuffer: 1 << 30 }).toString('utf8');

// ------------------------------------------------------------ levels (Waller)
function loadLevels(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const levelOf = new Map();
  for (const [ch, v] of Object.entries(raw)) {
    const n = v.jlpt_new; // the only field read from this file
    if (n >= 1 && n <= 5) levelOf.set(ch, `N${n}`);
  }
  const counts = Object.fromEntries(LEVELS.map((l) => [l, [...levelOf.values()].filter((x) => x === l).length]));
  for (const l of LEVELS) {
    if (counts[l] !== EXPECTED_COUNTS[l]) throw new Error(`kanji-data has ${counts[l]} kanji for ${l}, expected ${EXPECTED_COUNTS[l]}`);
  }
  return levelOf;
}

// ------------------------------------------------------------ KANJIDIC2
function loadKanjidic(file, levelOf) {
  const xml = readGz(file);
  const out = new Map();
  const blockRe = /<character>([\s\S]*?)<\/character>/g;
  const all = (b, re) => [...b.matchAll(re)].map((m) => unescapeXml(m[1]));
  for (const m of xml.matchAll(blockRe)) {
    const b = m[1];
    const ch = /<literal>([^<]+)<\/literal>/u.exec(b)?.[1];
    if (!ch || !levelOf.has(ch)) continue;
    const num = (re) => {
      const v = re.exec(b)?.[1];
      return v === undefined ? null : Number(v);
    };
    out.set(ch, {
      strokeCount: num(/<stroke_count>(\d+)<\/stroke_count>/),
      grade: num(/<grade>(\d+)<\/grade>/),
      freq: num(/<freq>(\d+)<\/freq>/),
      onyomi: all(b, /<reading r_type="ja_on">([^<]*)<\/reading>/g),
      kunyomi: all(b, /<reading r_type="ja_kun">([^<]*)<\/reading>/g),
      meanings: all(b, /<meaning m_lang="es">([^<]*)<\/meaning>/g),
    });
  }
  return out;
}

// ------------------------------------------------------------ JMdict
// Returns Map<kanji, Word candidate[]> for every list kanji, only from entries
// with a Spanish gloss. Tier 0 is the R1 "common" rule (news1, ichi1, spec1,
// spec2, nf01 to nf24); tier 1 has another priority tag; tier 2 has none.
const R1_COMMON = /^(news1|ichi1|spec1|spec2|nf(0[1-9]|1\d|2[0-4]))$/;

function loadJmdict(file, levelOf) {
  const lines = readGz(file).split('\n');
  const index = new Map();
  let entry = null;
  let sec = null; // current k_ele / r_ele / sense
  const flush = () => {
    if (!entry.senses.some((s) => s.spa.length)) return;
    for (const k of entry.kebs) {
      const chars = new Set([...k.keb].filter((c) => levelOf.has(c)));
      if (!chars.size) continue;
      const reading = entry.rebs.find(
        (r) => !r.nokanji && (r.restr.length === 0 || r.restr.includes(k.keb)),
      )?.reb;
      if (!reading) continue;
      // first usable Spanish gloss: skip glosses that are only digits or note a
      // restricted use («(usado en ...»), which teach nothing about the word
      const meaning = entry.senses
        .filter((s) => (!s.stagk.length || s.stagk.includes(k.keb)) && (!s.stagr.length || s.stagr.includes(reading)))
        .flatMap((s) => s.spa)
        .find((g) => !/^[\d\s.,]+$/.test(g) && !g.startsWith('(usado en'));
      if (!meaning) continue;
      const nf = k.pri.map((p) => /^nf(\d\d)$/.exec(p)?.[1]).filter(Boolean).map(Number);
      const tier = k.pri.some((p) => R1_COMMON.test(p)) ? 0 : k.pri.length ? 1 : 2;
      const cand = {
        written: k.keb,
        reading,
        meaning,
        verbal: entry.pos.some((p) => /^(v1|v5.*|vk|adj-i)$/.test(p)),
        nf: nf.length ? Math.min(...nf) : 99,
        tier,
      };
      for (const c of chars) {
        if (!index.has(c)) index.set(c, []);
        index.get(c).push(cand);
      }
    }
  };
  for (const line of lines) {
    if (line === '<entry>') { entry = { kebs: [], rebs: [], senses: [], pos: [] }; continue; }
    if (!entry) continue;
    if (line === '</entry>') { flush(); entry = null; continue; }
    if (line === '<k_ele>') { sec = { keb: '', pri: [] }; entry.kebs.push(sec); continue; }
    if (line === '<r_ele>') { sec = { reb: '', restr: [], nokanji: false }; entry.rebs.push(sec); continue; }
    if (line === '<sense>') { sec = { stagk: [], stagr: [], spa: [] }; entry.senses.push(sec); continue; }
    let m;
    if ((m = /^<keb>(.*)<\/keb>$/.exec(line))) sec.keb = unescapeXml(m[1]);
    else if ((m = /^<ke_pri>(.*)<\/ke_pri>$/.exec(line))) sec.pri.push(m[1]);
    else if ((m = /^<reb>(.*)<\/reb>$/.exec(line))) sec.reb = unescapeXml(m[1]);
    else if (line === '<re_nokanji/>') sec.nokanji = true;
    else if ((m = /^<re_restr>(.*)<\/re_restr>$/.exec(line))) sec.restr.push(unescapeXml(m[1]));
    else if ((m = /^<pos>&(.*);<\/pos>$/.exec(line))) entry.pos.push(m[1]);
    else if ((m = /^<stagk>(.*)<\/stagk>$/.exec(line))) sec.stagk.push(unescapeXml(m[1]));
    else if ((m = /^<stagr>(.*)<\/stagr>$/.exec(line))) sec.stagr.push(unescapeXml(m[1]));
    else if ((m = /^<gloss xml:lang="spa"[^>]*>(.*)<\/gloss>$/.exec(line))) sec.spa.push(unescapeXml(m[1]));
  }
  return index;
}

// ------------------------------------------------------------ Tatoeba
// Returns Map<kanji, {id, ja, es}[]>: Japanese sentences of at most 25
// characters that have a Spanish translation. With several translations the
// shortest one is kept.
function loadTatoeba(files, levelOf) {
  const parse = (txt) => txt.split('\n').filter(Boolean).map((l) => l.split('\t'));
  const ja = new Map();
  for (const [id, , text] of parse(readBz2(files.jpn))) {
    if ([...text].length <= MAX_SENTENCE_CHARS) ja.set(id, text);
  }
  const spa = new Map(parse(readBz2(files.spa)).map(([id, , text]) => [id, text]));
  const best = new Map();
  for (const [a, b] of parse(readBz2(files.links))) {
    const jaText = ja.get(a);
    const esText = spa.get(b);
    if (jaText === undefined || esText === undefined) continue;
    const cur = best.get(a);
    if (!cur || esText.length < cur.es.length) best.set(a, { id: Number(a), ja: jaText, es: esText });
  }
  const index = new Map();
  for (const s of best.values()) {
    for (const c of new Set([...s.ja].filter((x) => levelOf.has(x)))) {
      if (!index.has(c)) index.set(c, []);
      index.get(c).push(s);
    }
  }
  return index;
}

// ------------------------------------------------------------ KanjiVG
function extractKanjivg(zip) {
  const dir = path.join(CACHE, `kanjivg-${sha256(zip).slice(0, 12)}`);
  if (!fs.existsSync(path.join(dir, 'kanji'))) {
    fs.mkdirSync(dir, { recursive: true });
    execFileSync('unzip', ['-q', '-o', zip, 'kanji/*', '-d', dir]);
  }
  return path.join(dir, 'kanji');
}
const hex5 = (ch) => ch.codePointAt(0).toString(16).padStart(5, '0');

// ------------------------------------------------------------ kuromoji
function buildTokenizer() {
  const pkg = require('kuromoji/package.json');
  if (pkg.version !== sources.tools.kuromoji.version) {
    throw new Error(`kuromoji ${pkg.version} installed, sources.json pins ${sources.tools.kuromoji.version}`);
  }
  const kuromoji = require('kuromoji');
  const dicPath = path.join(path.dirname(require.resolve('kuromoji/package.json')), 'dict');
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath }).build((err, t) => (err ? reject(err) : resolve(t)));
  });
}

// Reading of a sentence as [text] or [text, kana] segments. Returns null when a
// token that contains kanji has no reading in the dictionary.
function readSentence(tokenizer, ja) {
  const segments = [];
  for (const t of tokenizer.tokenize(ja)) {
    const surface = t.surface_form;
    if ([...surface].some(isKanji) || /[々ヶ]/.test(surface)) {
      const r = tokenReadings[surface] ?? t.reading;
      if (!r || r === '*') return null;
      segments.push(...alignToken(surface, toHiragana(r)));
    } else {
      segments.push([surface]);
    }
  }
  // merge neighbouring segments without a reading, so plain text stays in one piece
  const merged = [];
  for (const s of segments) {
    const last = merged.at(-1);
    if (last && last.length === 1 && s.length === 1) last[0] += s[0];
    else merged.push([...s]);
  }
  if (merged.map((s) => s[0]).join('') !== ja) throw new Error(`reading segments do not rebuild «${ja}»`);
  return merged;
}

// ------------------------------------------------------------ main
async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  console.log('Sources');
  const files = {};
  for (const [name, src] of Object.entries(sources.sources)) files[name] = await ensureSource(name, src);

  const levelOf = loadLevels(files.kanjiData);
  const rankOf = (ch) => LEVEL_RANK[levelOf.get(ch) ?? 'beyond'];
  const levelName = (ch) => levelOf.get(ch) ?? 'beyond';

  console.log('Reading KANJIDIC2, JMdict, Tatoeba');
  const kd = loadKanjidic(files.kanjidic2, levelOf);
  const jm = loadJmdict(files.jmdict, levelOf);
  // words JMdict has no Spanish gloss for, curated in overrides.json
  for (const [written, w] of Object.entries(extraWords)) {
    for (const c of new Set([...written].filter((x) => levelOf.has(x)))) {
      if (!jm.has(c)) jm.set(c, []);
      if (!jm.get(c).some((x) => x.written === written)) jm.get(c).push({ written, reading: w.reading, meaning: w.meaning, nf: 99, tier: 0, verbal: false });
    }
  }
  const tb = loadTatoeba({ jpn: files.tatoebaJpn, spa: files.tatoebaSpa, links: files.tatoebaLinks }, levelOf);
  const svgDir = extractKanjivg(files.kanjivg);
  const tokenizer = await buildTokenizer();

  // overrides: all of N5 must be curated
  for (const [ch, l] of levelOf) if (l === 'N5' && !overrides[ch]?.meanings?.length) fail(`${ch}: N5 kanji without an override meaning`);
  for (const ch of Object.keys(overrides)) if (!levelOf.has(ch)) fail(`${ch}: override for a kanji that is not in the lists`);

  const readingCache = new Map();
  let sentencesSkippedNoReading = 0;
  const reading = (ja) => {
    if (!readingCache.has(ja)) readingCache.set(ja, readSentence(tokenizer, ja));
    return readingCache.get(ja);
  };
  const kanjiLevelsOf = (ja) => Object.fromEntries([...new Set([...ja].filter(isKanji))].map((c) => [c, levelName(c)]));
  const makeSentence = (ja, es) => {
    const r = reading(ja);
    return r ? { ja, reading: r, es, kanjiLevels: kanjiLevelsOf(ja) } : null;
  };

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'levels'), { recursive: true });
  fs.mkdirSync(path.join(OUT, 'strokes'), { recursive: true });

  const search = [];
  const report = {};
  let totalMeanings = 0;
  let totalStrokes = 0;
  let strokeCountMismatch = 0;
  const diffHist = { 1: 0, 2: 0, 3: 0 };

  for (const level of LEVELS) {
    const chars = [...levelOf].filter(([, l]) => l === level).map(([c]) => c);
    // frequency order; kanji without freq go last, by stroke count
    chars.sort((a, b) => {
      const fa = kd.get(a)?.freq ?? null;
      const fb = kd.get(b)?.freq ?? null;
      if (fa !== null && fb !== null) return fa - fb;
      if (fa !== null) return -1;
      if (fb !== null) return 1;
      return (kd.get(a)?.strokeCount ?? 0) - (kd.get(b)?.strokeCount ?? 0) || a.codePointAt(0) - b.codePointAt(0);
    });

    const lessonChunks = chunkLessons(chars);
    const lessons = lessonChunks.map((kanji, i) => ({ level, number: i + 1, kanji }));
    const kanjiMap = {};
    const stat = { total: chars.length, meanings: 0, strokes: 0, commonWord: 0, anyWord: 0, fiveWords: 0, sentence: 0, threeSentences: 0 };

    for (const lesson of lessons) {
      for (const ch of lesson.kanji) {
        const info = kd.get(ch);
        const ov = overrides[ch] ?? {};
        if (!info) { fail(`${ch}: missing in KANJIDIC2`); continue; }

        // meanings
        const meanings = ov.meanings ?? info.meanings;
        if (!meanings.length) fail(`${ch}: no Spanish meaning`);
        else stat.meanings++;

        // strokes
        const svgFile = path.join(svgDir, `${hex5(ch)}.svg`);
        if (!fs.existsSync(svgFile)) fail(`${ch}: no KanjiVG stroke file (${hex5(ch)}.svg)`);
        else {
          const svg = stripSvg(fs.readFileSync(svgFile, 'utf8'));
          fs.writeFileSync(path.join(OUT, 'strokes', `${hex5(ch)}.svg`), svg);
          if ((svg.match(/<path /g) ?? []).length !== info.strokeCount) strokeCountMismatch++;
          stat.strokes++;
        }

        // words
        const hidden = new Set(ov.hideWords ?? []);
        const fits = (w) => Math.max(...[...w.written].filter(isKanji).map(rankOf)) <= LEVEL_RANK[level];
        const seen = new Set();
        const cands = (jm.get(ch) ?? [])
          .filter((w) => !hidden.has(w.written))
          .map((w) => (wordMeanings[w.written] ? { ...w, meaning: wordMeanings[w.written] } : w))
          .sort((a, b) =>
            a.tier - b.tier ||
            // the bare kanji teaches least: last among words of its tier
            Number(a.written === ch) - Number(b.written === ch) ||
            Number(!fits(a)) - Number(!fits(b)) ||
            // verb or i-adjective form first (食べる before 食事)
            Number(!(a.verbal && a.written[0] === ch)) - Number(!(b.verbal && b.written[0] === ch)) ||
            a.nf - b.nf ||
            [...a.written].length - [...b.written].length ||
            a.written.localeCompare(b.written, 'ja'))
          // one word per written form, keeping its best entry (sorted first)
          .filter((w) => !seen.has(w.written) && seen.add(w.written));
        for (const form of [...(ov.words ?? [])].reverse()) {
          const at = cands.findIndex((w) => w.written === form);
          if (at < 0) { fail(`${ch}: words override «${form}» is not a JMdict word with a Spanish gloss`); continue; }
          cands.unshift(...cands.splice(at, 1));
        }
        if (cands.some((w) => w.tier === 0)) stat.commonWord++;
        if (cands.length) stat.anyWord++;
        const words = cands.slice(0, MAX_WORDS).map((w) => ({
          written: w.written,
          reading: w.reading,
          meaning: w.meaning,
          level: [...w.written].filter(isKanji).map(levelName).reduce((hi, l) => (LEVEL_RANK[l] > LEVEL_RANK[hi] ? l : hi), 'N5'),
        }));
        if (words.length === MAX_WORDS) stat.fiveWords++;

        // sentences: curated first, then Tatoeba
        const sentences = [];
        for (const s of ov.sentences ?? []) {
          const made = makeSentence(s.ja, s.es);
          if (made) sentences.push(made); else fail(`${ch}: curated sentence without reading «${s.ja}»`);
        }
        const tatoebaCands = tb.get(ch) ?? [];
        if (tatoebaCands.length) stat.sentence++;
        const score = (s) => {
          const others = new Set([...s.ja].filter((c) => isKanji(c) && c !== ch));
          const above = [...others].filter((c) => rankOf(c) > LEVEL_RANK[level]).length;
          const len = [...s.ja].length;
          return [above, len < 6 ? 1 : 0, len, s.id];
        };
        const ranked = tatoebaCands
          .map((s) => ({ s, k: score(s) }))
          .sort((a, b) => a.k[0] - b.k[0] || a.k[1] - b.k[1] || a.k[2] - b.k[2] || a.k[3] - b.k[3]);
        for (const { s } of ranked) {
          if (sentences.length >= MAX_SENTENCES) break;
          if (sentences.some((x) => x.ja === s.ja)) continue;
          const made = makeSentence(s.ja, s.es);
          if (made) sentences.push(made); else sentencesSkippedNoReading++;
        }
        if (sentences.length === MAX_SENTENCES) stat.threeSentences++;

        const diff = difficulty(level, info.strokeCount);
        diffHist[diff]++;
        kanjiMap[ch] = {
          char: ch,
          level,
          frequencyRank: info.freq,
          grade: info.grade,
          difficulty: diff,
          meanings,
          onyomi: info.onyomi,
          kunyomi: info.kunyomi,
          strokeCount: info.strokeCount,
          words,
          sentences,
          lesson: lesson.number,
        };

        const cleanKun = [...new Set(info.kunyomi.map((k) => k.replace(/[-.]/g, '')))];
        const kana = [...new Set([...info.onyomi.map(toHiragana), ...cleanKun.map(toHiragana)])];
        search.push([ch, level, meanings.join('; '), kana.join(' '), [...new Set(kana.map(kanaToRomaji))].join(' ')]);
      }
    }
    totalMeanings += stat.meanings;
    totalStrokes += stat.strokes;
    report[level] = stat;
    fs.writeFileSync(path.join(OUT, 'levels', `${level.toLowerCase()}.json`), JSON.stringify({ level, lessons, kanji: kanjiMap }));
  }

  fs.writeFileSync(path.join(OUT, 'search.json'), JSON.stringify(search));

  // ---------------------------------------------------------- report
  console.log('\nCoverage per level (R1 value in brackets where research.md R1 has one)');
  const rows = [['level', 'kanji', 'meanings', 'strokes', 'common word', 'any word', 'sentence', '5 words', '3 sentences']];
  for (const l of LEVELS) {
    const s = report[l];
    const vs = (v, ref) => (ref === undefined ? `${v}` : `${v} [${ref}]${v === ref ? '' : ' DIFF'}`);
    rows.push([l, s.total, s.meanings, s.strokes, vs(s.commonWord, R1.commonWord[l]), vs(s.anyWord, R1.anyWord[l]), vs(s.sentence, R1.sentence[l]), s.fiveWords, s.threeSentences]);
  }
  const sum = (k) => LEVELS.reduce((a, l) => a + report[l][k], 0);
  rows.push(['all', sum('total'), sum('meanings'), sum('strokes'), sum('commonWord'), sum('anyWord'), sum('sentence'), sum('fiveWords'), sum('threeSentences')]);
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => String(r[i]).length)));
  for (const r of rows) console.log('  ' + r.map((c, i) => String(c).padEnd(widths[i])).join('  '));
  console.log(`\n${totalMeanings} of ${sum('total')} with meanings, ${totalStrokes} of ${sum('total')} with strokes`);
  console.log(`difficulty spread: easy ${diffHist[1]}, medium ${diffHist[2]}, hard ${diffHist[3]}`);
  console.log(`stroke files whose path count differs from KANJIDIC2 stroke_count: ${strokeCountMismatch}`);
  console.log(`Tatoeba sentences skipped for lacking a reading: ${sentencesSkippedNoReading}`);

  if (failures.length) {
    console.error(`\nFAILED, ${failures.length} problem(s):`);
    for (const f of failures.slice(0, 50)) console.error('  ' + f);
    process.exit(1);
  }
  if (totalMeanings !== 2211 || totalStrokes !== 2211) {
    console.error('Expected 2211 kanji with meanings and strokes');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
