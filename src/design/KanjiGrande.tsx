import { IconPlay } from './icons';
import { cx } from './cx';

/** Baldosa sakura con el kanji grande y, si se pide, el botón de sonido en la esquina. */
export function KanjiGrande({
  kanji,
  size = 116,
  tone = 'sakura',
  onPlay,
  playLabel = 'Escuchar',
  className,
}: {
  kanji: string;
  size?: number;
  tone?: 'sakura' | 'white';
  onPlay?: () => void;
  playLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'relative flex shrink-0 items-center justify-center rounded-[14px]',
        tone === 'sakura' ? 'bg-sakura-bg text-ink' : 'bg-paper text-sakura-deep',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontFamily: 'var(--font-kanji)',
        fontSize: size * 0.68,
        lineHeight: 1,
        boxShadow: tone === 'white' ? '0 0 0 1px var(--rail)' : undefined,
      }}
    >
      {kanji}
      {onPlay && (
        <button
          type="button"
          onClick={onPlay}
          aria-label={playLabel}
          className="kj-press absolute bottom-0 right-0 flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-paper text-ink shadow-[0_0_0_1px_var(--rail)]"
        >
          <IconPlay size={14} />
        </button>
      )}
    </div>
  );
}
