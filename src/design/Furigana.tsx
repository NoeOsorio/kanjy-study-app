import { Marcatextos } from './Marcatextos';
import { cx } from './cx';

export type TokenFurigana = {
  text: string;
  reading?: string;
  /** La lectura se dibuja solo si es true. */
  showReading?: boolean;
  /** Marcatextos detrás del token. */
  highlight?: boolean;
  /** Kanji estudiado en tinta sakura. */
  accent?: boolean;
};

/** Texto japonés por tokens; la lectura en hiragana va encima solo donde se pide. */
export function Furigana({
  tokens,
  size = 22,
  className,
}: {
  tokens: TokenFurigana[];
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cx('text-ink', className)}
      style={{ fontFamily: 'var(--font-kanji)', fontSize: size, lineHeight: 1.9 }}
    >
      {tokens.map((t, i) => {
        const body =
          t.showReading && t.reading ? (
            <ruby style={{ rubyPosition: 'over' }}>
              {t.text}
              <rt
                style={{
                  fontFamily: 'var(--font-kanji)',
                  fontSize: Math.max(10, Math.round(size * 0.46)),
                  color: 'var(--sakura-ink)',
                  letterSpacing: '0.08em',
                }}
              >
                {t.reading}
              </rt>
            </ruby>
          ) : (
            t.text
          );
        const colored = t.accent ? (
          <span style={{ color: 'var(--sakura-ink)' }}>{body}</span>
        ) : (
          body
        );
        return t.highlight ? <Marcatextos key={i}>{colored}</Marcatextos> : <span key={i}>{colored}</span>;
      })}
    </span>
  );
}
