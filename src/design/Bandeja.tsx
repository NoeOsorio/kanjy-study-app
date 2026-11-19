import type { ReactNode } from 'react';
import { cx } from './cx';

/** Bandeja rosada que guarda casillas blancas. */
export function Bandeja({
  children,
  className,
  radius = 14,
}: {
  children: ReactNode;
  className?: string;
  radius?: 12 | 14;
}) {
  return (
    <div
      className={cx('flex flex-wrap gap-1.5 bg-tray p-1.5', className)}
      style={{ borderRadius: radius }}
    >
      {children}
    </div>
  );
}
