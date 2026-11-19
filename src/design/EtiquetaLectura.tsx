import { cx } from './cx';

const V = {
  china: { chip: 'bg-china-bg text-china-ink', name: 'china' },
  japonesa: { chip: 'bg-japonesa-bg text-japonesa-ink', name: 'japonesa' },
};

/**
 * Etiqueta de lectura. Por defecto la lectura va a la derecha de la etiqueta;
 * con `dentro` va dentro de la pastilla (búsqueda fuera de nivel).
 */
export function EtiquetaLectura({
  variant,
  label,
  reading,
  dentro = false,
  className,
}: {
  variant: 'china' | 'japonesa';
  label?: string;
  reading?: string;
  dentro?: boolean;
  className?: string;
}) {
  const v = V[variant];
  if (dentro) {
    return (
      <span
        className={cx('inline-flex items-center rounded-lg px-3 py-1.5 text-[18px]', v.chip, className)}
        style={{ fontFamily: 'var(--font-kanji)' }}
      >
        {reading}
      </span>
    );
  }
  return (
    <span className={cx('inline-flex items-center gap-3', className)}>
      <span className={cx('rounded-lg px-2.5 py-1 text-[15px] font-semibold', v.chip)}>
        {label ?? v.name}
      </span>
      {reading && (
        <span className="text-[24px] leading-none text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>
          {reading}
        </span>
      )}
    </span>
  );
}
