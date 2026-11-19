import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bandeja, Furigana, NotaPropia, StickerSakura } from '../../design';
import type { TokenFurigana } from '../../design';
import { IconLapiz, IconPlay } from '../../design/icons';
import { needsReading, sentenceTokens } from '../../data/furigana';
import type { Kanji, Level, Sentence, Word } from '../../data/types';
import { putNote } from '../../store/repo';
import { canSpeak, speak } from '../../sound';

/** Lectura en kana para hablar: primera kunyomi sin marcas, si no la primera onyomi en hiragana. */
export function lecturaHablada(k: Kanji): string {
  const kun = k.kunyomi[0];
  if (kun) return cleanReading(kun);
  return k.onyomi[0] ? kata2hira(cleanReading(k.onyomi[0])) : '';
}

export const kata2hira = (s: string) =>
  s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

/** Lectura japonesa sin la marca de okurigana. */
export const cleanReading = (s: string) => s.replace(/[.\-]/g, '');

const DIFICULTAD = { 1: 'Fácil', 2: 'Media', 3: 'Difícil' } as const;

export function chips(k: Kanji): string[] {
  const out: string[] = [DIFICULTAD[k.difficulty]];
  if (k.frequencyRank !== null) {
    if (k.frequencyRank <= 500) out.push('Muy común');
    else if (k.frequencyRank <= 1500) out.push('Común');
  }
  if (k.grade !== null) {
    if (k.grade >= 1 && k.grade <= 6) out.push(`${k.grade}.º de primaria`);
    else if (k.grade === 8) out.push('Secundaria');
  }
  out.push(`${k.strokeCount} trazos`);
  return out;
}

export function Dots({ total, filled, size = 26 }: { total: number; filled: number; size?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label="Progreso de la lección">
      {Array.from({ length: total }, (_, i) => (
        <StickerSakura key={i} size={size} rotation={(i * 37) % 30 - 15} empty={i >= filled} />
      ))}
    </div>
  );
}

export function Readings({ k }: { k: Kanji }) {
  const on = k.onyomi.slice(0, 1).map(cleanReading).join('、');
  const kun = k.kunyomi.slice(0, 1).map(cleanReading).join('、');
  const row = 'inline-flex items-center gap-3';
  const tag = 'rounded-lg px-2.5 py-1 text-[15px] font-semibold';
  const kana = 'text-[24px] leading-none text-ink';
  return (
    <div className="flex flex-col items-start gap-2">
      {on && (
        <span className={row}>
          <span className={`${tag} bg-china-bg text-china-ink`}>china</span>
          <span className={kana} style={{ fontFamily: 'var(--font-kanji)' }}>{on}</span>
        </span>
      )}
      {kun && (
        <span className={row}>
          <span className={`${tag} bg-japonesa-bg text-japonesa-ink`}>japonesa</span>
          <span className={kana} style={{ fontFamily: 'var(--font-kanji)' }}>{kun}</span>
        </span>
      )}
    </div>
  );
}

export function Palabras({ words, level, char }: { words: Word[]; level: Level; char: string }) {
  const list = [...words.filter((w) => w.written !== char), ...words.filter((w) => w.written === char)].slice(0, 3);
  if (list.length === 0) return null;
  return (
    <ul
      className={`m-0 grid list-none items-center gap-x-3 gap-y-1 p-0 ${
        canSpeak() ? 'grid-cols-[auto_auto_1fr_auto]' : 'grid-cols-[auto_auto_1fr]'
      }`}
    >
      {list.map((w) => {
        const furi = needsReading(w.level, level);
        return (
          <li key={w.written} className="col-span-full grid grid-cols-subgrid items-center">
            <Furigana
              size={26}
              tokens={[{ text: w.written, reading: w.reading, showReading: furi }]}
            />
            {!furi && (
              <span className="text-[15px] text-ink-3" style={{ fontFamily: 'var(--font-kanji)' }}>
                {w.reading}
              </span>
            )}
            <span className={`font-voice text-[19px] leading-tight text-ink-2 ${furi ? 'col-span-2' : ''}`}>
              {w.meaning}
            </span>
            <BotonSonido text={w.reading} label="Escuchar la palabra" />
          </li>
        );
      })}
    </ul>
  );
}

export function oracionTokens(s: Sentence, char: string, level: Level): TokenFurigana[] {
  return sentenceTokens(s).map((t) => ({
    text: t.text,
    reading: t.reading,
    showReading: !!(t.reading && t.level && needsReading(t.level, level)),
    highlight: t.text.includes(char),
  }));
}

export function Oracion({ s, char, level, size = 24 }: { s: Sentence; char: string; level: Level; size?: number }) {
  return (
    <div>
      <Furigana tokens={oracionTokens(s, char, level)} size={size} />
      <p className="m-0 font-voice text-[18px] leading-snug text-ink-2">{s.es}</p>
    </div>
  );
}

export function BotonSonido({ text, label = 'Escuchar la frase' }: { text: string; label?: string }) {
  if (!canSpeak()) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={label}
      className="kj-press flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-paper text-ink shadow-[0_0_0_1px_var(--rail)]"
    >
      <IconPlay size={14} />
    </button>
  );
}

export function EnUnaFrase({ s, char, level }: { s: Sentence; char: string; level: Level }) {
  return (
    <section className="flex flex-col gap-2 rounded-[14px] bg-tray p-4">
      <header className="flex items-center justify-between">
        <h2 className="m-0 text-[14px] font-semibold text-ink-3">En una frase</h2>
        <BotonSonido text={s.ja} />
      </header>
      <Oracion s={s} char={char} level={level} />
    </section>
  );
}

/** Una frase por lectura cuando hay; si ninguna coincide, la primera sin etiqueta. */
export function frasesPorLectura(k: Kanji): { tag?: { kind: 'china' | 'japonesa'; text: string }; s: Sentence }[] {
  const used = new Set<number>();
  const out: { tag?: { kind: 'china' | 'japonesa'; text: string }; s: Sentence }[] = [];
  const reads: { kind: 'china' | 'japonesa'; text: string; stem: string }[] = [
    ...k.onyomi.map((r) => ({ kind: 'china' as const, text: cleanReading(r), stem: kata2hira(cleanReading(r)) })),
    ...k.kunyomi.map((r) => ({ kind: 'japonesa' as const, text: cleanReading(r), stem: kata2hira(r.split('.')[0].replace('-', '')) })),
  ];
  for (const r of reads) {
    if (!r.stem) continue;
    const i = k.sentences.findIndex(
      (s, idx) =>
        !used.has(idx) &&
        sentenceTokens(s).some((t) => t.text.includes(k.char) && t.reading && kata2hira(t.reading).includes(r.stem)),
    );
    if (i >= 0) {
      used.add(i);
      out.push({ tag: { kind: r.kind, text: r.text }, s: k.sentences[i] });
    }
  }
  if (out.length === 0 && k.sentences[0]) out.push({ s: k.sentences[0] });
  return out;
}

export function EnFrases({ k, level }: { k: Kanji; level: Level }) {
  const rows = frasesPorLectura(k);
  if (rows.length === 0) return null;
  return (
    <section className="flex flex-col gap-3 rounded-[14px] bg-tray p-4">
      <h2 className="m-0 text-[14px] font-semibold text-sakura-deep">En frases, con cada lectura</h2>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map(({ tag, s }, i) => (
          <li key={i} className="flex items-start gap-3">
            {tag && (
              <span
                className={`mt-2 inline-flex min-w-[44px] shrink-0 justify-center rounded-md px-2 py-0.5 text-[14px] ${
                  tag.kind === 'china' ? 'bg-china-bg text-china-ink' : 'bg-japonesa-bg text-japonesa-ink'
                }`}
                style={{ fontFamily: 'var(--font-kanji)' }}
              >
                {tag.text}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <Oracion s={s} char={k.char} level={level} size={22} />
            </div>
            <BotonSonido text={s.ja} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Cuadricula({ char, to, cols, cells }: { char: string; to: string; cols: number; cells: number }) {
  const cell = 'flex aspect-square items-center justify-center rounded-lg bg-paper shadow-[0_0_0_1px_var(--rail)]';
  const font = { fontFamily: 'var(--font-kanji)', lineHeight: 1 } as const;
  return (
    <Bandeja className="!block">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: cells }, (_, i) => {
          if (i < 2)
            return (
              <span key={i} className={`${cell} text-[26px] text-sakura-ink/25`} style={font} aria-hidden>
                {char}
              </span>
            );
          if (i < 4)
            return (
              <span key={i} className={`${cell} text-[26px] text-ink`} style={font} aria-hidden>
                {char}
              </span>
            );
          if (i === 4)
            return (
              <Link
                key={i}
                to={to}
                aria-label="Escribir de memoria"
                className={`${cell} kj-press text-ink shadow-[0_0_0_2px_var(--ink)]`}
              >
                <IconLapiz size={20} />
              </Link>
            );
          return <span key={i} className={cell} aria-hidden />;
        })}
      </div>
    </Bandeja>
  );
}

/** Nota propia editable en el lugar: se guarda al salir del campo, vacía la borra. */
export function Nota({ char, initial }: { char: string; initial: string }) {
  const [text, setText] = useState(initial);
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => setText(initial), [initial, char]);
  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const save = () => {
    const t = text.trim();
    setText(t);
    setEditing(false);
    void putNote(char, t);
  };

  return (
    <NotaPropia onEdit={editing ? undefined : () => setEditing(true)}>
      {editing ? (
        <textarea
          ref={ref}
          value={text}
          rows={2}
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          aria-label="Tu nota"
          className="m-0 block w-full resize-none border-0 bg-transparent p-0 text-ink outline-none"
          style={{ font: 'inherit', lineHeight: 'inherit', fieldSizing: 'content' } as React.CSSProperties}
        />
      ) : text ? (
        text
      ) : (
        <span className="text-faded">Escribe cómo recordarlo</span>
      )}
    </NotaPropia>
  );
}
