// Helpers for the Kanjy data build. Pure functions, no network, no file writes.

export const LEVEL_RANK = { N5: 1, N4: 2, N3: 3, N2: 4, N1: 5, beyond: 6 };

// One CJK ideograph. Excludes the iteration mark and the small ke, which are
// handled as "kanji-like" only when aligning readings.
const KANJI = /[㐀-䶿一-鿿豈-﫿\u{20000}-\u{2FA1F}]/u;
export const isKanji = (ch) => KANJI.test(ch);
const isKanjiLike = (ch) => KANJI.test(ch) || ch === '々' || ch === 'ヶ' || ch === 'ヵ';

export function unescapeXml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&');
}

export function toHiragana(s) {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    out += c >= 0x30a1 && c <= 0x30f6 ? String.fromCodePoint(c - 0x60) : ch;
  }
  return out;
}

// ---------------------------------------------------------------- romaji
// Hepburn as people type it (shou, not shō), so a search for "shou" finds ショウ.
const BASE = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'i', ゑ: 'e', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゔ: 'vu',
};
const SMALL_Y = { ゃ: 'a', ゅ: 'u', ょ: 'o' };
const SMALL_V = { ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o' };
const SOKUON_STOP = /^[bcdfghjklmnpqrstvwxyz]/;

export function kanaToRomaji(kana) {
  const k = [...toHiragana(kana)];
  let out = '';
  for (let i = 0; i < k.length; i++) {
    const ch = k[i];
    if (ch === 'っ') {
      const next = k[i + 1] ? kanaToRomaji(k.slice(i + 1, i + 3).join('')) : '';
      if (next.startsWith('ch')) out += 't';
      else if (SOKUON_STOP.test(next)) out += next[0];
      continue;
    }
    if (ch === 'ー') {
      const last = out.at(-1);
      if (last && 'aiueo'.includes(last)) out += last;
      continue;
    }
    const base = BASE[ch];
    if (base === undefined) {
      if (/[\s.\-・]/.test(ch)) continue;
      throw new Error(`kanaToRomaji: unexpected character «${ch}» in «${kana}»`);
    }
    const next = k[i + 1];
    if (next && SMALL_Y[next] && base.endsWith('i')) {
      const stem = base === 'shi' || base === 'chi' || base === 'ji' ? base.slice(0, -1) : base.slice(0, -1) + 'y';
      out += stem + SMALL_Y[next];
      i++;
    } else if (next && SMALL_V[next] && base.length > 1 && 'aiueo'.includes(base.at(-1))) {
      out += base.slice(0, -1) + SMALL_V[next];
      i++;
    } else if (next && SMALL_V[next] && ch === 'う') {
      out += 'w' + SMALL_V[next];
      i++;
    } else {
      out += base;
    }
  }
  return out;
}

// ---------------------------------------------------------------- furigana
// Splits a token into [text, reading?] segments so a ruby reading sits only
// over the kanji runs: 食べる + たべる gives [["食","た"],["べる"]].
// When the okurigana cannot be matched, the whole token carries the reading.
export function alignToken(surface, readingHira) {
  const chars = [...surface];
  if (!chars.some(isKanjiLike)) return [[surface]];
  const runs = [];
  for (const ch of chars) {
    const kanji = isKanjiLike(ch);
    const last = runs.at(-1);
    if (last && last.kanji === kanji) last.text += ch;
    else runs.push({ kanji, text: ch });
  }
  if (runs.length === 1) return [[surface, readingHira]];
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = runs.map((r) => (r.kanji ? '(.+?)' : esc(toHiragana(r.text)))).join('');
  const m = new RegExp(`^${pattern}$`, 'u').exec(readingHira);
  if (!m) return [[surface, readingHira]];
  let g = 1;
  return runs.map((r) => (r.kanji ? [r.text, m[g++]] : [r.text]));
}

// ---------------------------------------------------------------- svg
// KanjiVG base file reduced to what the app draws: viewBox, stroke paths and
// the stroke order numbers. Comments, DOCTYPE, the kvg: attributes and the
// whitespace between tags go. Ids such as kvg:065e5-s1 stay so strokes can be
// animated one by one.
export function stripSvg(src) {
  return src
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE[\s\S]*?\]>/, '')
    .replace(/\s+kvg:[A-Za-z]+="[^"]*"/g, '')
    .replace(/\s+xmlns:kvg="[^"]*"/, '')
    .replace(/\s+(width|height)="[^"]*"/g, '')
    .replace(/>\s+</g, '><')
    .trim();
}

// ---------------------------------------------------------------- difficulty
// 1 (Fácil) to 3 (Difícil). Points = level points (N5 and N4 0, N3 and N2 1,
// N1 2) plus a stroke bracket (up to 5 strokes 0, 6 to 9 one, 10 to 13 two,
// 14 or more three). 0 to 1 points is 1, 2 to 3 is 2, 4 or more is 3.
export function difficulty(level, strokeCount) {
  const levelPoints = Math.floor((LEVEL_RANK[level] - 1) / 2);
  const strokePoints = strokeCount <= 5 ? 0 : strokeCount <= 9 ? 1 : strokeCount <= 13 ? 2 : 3;
  const p = levelPoints + strokePoints;
  return p <= 1 ? 1 : p <= 3 ? 2 : 3;
}

// Even split into lessons of about ten: n kanji become round(n/10) lessons whose
// sizes differ by at most one, so the last lesson is never a stub.
export function chunkLessons(items) {
  const count = Math.max(1, Math.round(items.length / 10));
  const base = Math.floor(items.length / count);
  const extra = items.length % count;
  const out = [];
  let at = 0;
  for (let i = 0; i < count; i++) {
    const size = base + (i < extra ? 1 : 0);
    out.push(items.slice(at, at + size));
    at += size;
  }
  return out;
}
