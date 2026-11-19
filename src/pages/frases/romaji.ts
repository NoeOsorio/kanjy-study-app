const BASE: Record<string, string> = {
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
  ゔ: 'vu', ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
  '。': '.', '、': ',', '？': '?', '！': '!', '「': '"', '」': '"', '・': ' ', '　': ' ',
};

const SMALL: Record<string, string> = { ゃ: 'ya', ゅ: 'yu', ょ: 'yo' };

export const kata2hira = (s: string) =>
  s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** Kana a romaji Hepburn. Lo que no es kana se deja igual. */
export function kanaToRomaji(input: string): string {
  const s = kata2hira(input);
  let out = '';
  let geminate = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === 'っ') {
      geminate = true;
      continue;
    }
    if (ch === 'ー') {
      const last = out.match(/[aiueo]$/);
      if (last) out += last[0];
      continue;
    }
    let r = BASE[ch] ?? ch;
    const next = s[i + 1];
    if (next && SMALL[next] && /[a-z]/.test(r) && r.endsWith('i')) {
      const y = SMALL[next];
      // しゃ sha, ちゃ cha, じゃ ja; el resto conserva la consonante.
      r = /^(sh|ch|j)i$/.test(r) ? r.slice(0, -1) + y.slice(1) : r.slice(0, -1) + y;
      i++;
    }
    if (geminate && /^[a-z]/.test(r)) {
      r = (r.startsWith('ch') ? 't' : r[0]) + r;
    }
    geminate = false;
    out += r;
  }
  return out;
}

/**
 * Romaji de una frase por tokens, unidos con espacios (sin espacio antes de la puntuación).
 * Un token que es exactamente は, へ o を se lee wa, e, o.
 */
export function sentenceRomaji(tokens: { text: string; reading?: string }[]): string {
  const PARTICULA: Record<string, string> = { は: 'wa', へ: 'e', を: 'o' };
  // Okurigana suelta (い en 良い) se pega al kanji anterior; partículas, です y ます van aparte.
  const APARTE = /^(です|ます|でした|ました|でしょう|ません)/;
  let joined = '';
  tokens.forEach((t, i) => {
    const particula = PARTICULA[t.text];
    const r = particula ?? kanaToRomaji(t.reading ?? t.text);
    const prev = tokens[i - 1];
    const pegar = !particula && !t.reading && !!prev?.reading && !APARTE.test(t.text) && !/[一-鿿々]/.test(t.text);
    joined += (i > 0 && !pegar ? ' ' : '') + r;
  });
  joined = joined
    .replace(/\s+([.,?!"])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return joined.charAt(0).toUpperCase() + joined.slice(1);
}
