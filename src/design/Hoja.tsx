import type { ReactNode } from 'react';
import { cx } from './cx';

/** Hoja blanca bajo la barra: radio 14 arriba, margen 8, sombra de hoja. */
export function Hoja({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cx('mx-2 rounded-t-[14px] bg-paper p-4 shadow-[var(--shadow-sheet)]', className)}
    >
      {children}
    </section>
  );
}
