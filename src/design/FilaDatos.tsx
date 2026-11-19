import { cx } from './cx';

const chip = 'inline-flex h-8 items-center gap-1.5 rounded-lg bg-tray px-2.5 text-[13px] text-ink-2';

/** Fila de chips pequeños; el primero puede llevar tres barras de dificultad. */
export function FilaDatos({
  chips,
  dificultad,
  className,
}: {
  chips: string[];
  /** 1 a 3 barras llenas en el primer chip. */
  dificultad?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div className={cx('flex flex-wrap gap-1.5', className)}>
      {chips.map((c, i) => (
        <span key={c} className={cx(chip, i === 0 && dificultad && 'font-semibold text-ink')}>
          {i === 0 && dificultad && (
            <span className="flex gap-[3px]" aria-hidden>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="h-[14px] w-[5px] rounded-[2px]"
                  style={{ background: n <= dificultad ? 'var(--wine)' : 'var(--rail)' }}
                />
              ))}
            </span>
          )}
          {c}
        </span>
      ))}
    </div>
  );
}
