import { cx } from './cx';

/** Cinta washi rosada con una palabra («Hoy», «Mañana»). */
export function Washi({
  label,
  rotation = -3,
  className,
}: {
  label: string;
  rotation?: number;
  className?: string;
}) {
  return (
    <span
      className={cx('inline-block px-3 py-1.5 text-[12px] font-bold leading-none', className)}
      style={{
        background:
          'repeating-linear-gradient(135deg, rgba(244,163,180,0.9) 0 6px, rgba(248,190,202,0.9) 6px 12px)',
        color: '#7A2B3D',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {label}
    </span>
  );
}
