import { useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { cx } from './cx';

/** True desde 1280 px: la libreta se abre a doble página. Antes de eso es una sola página. */
export function useDoble(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia('(min-width: 1280px)');
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia('(min-width: 1280px)').matches,
    () => false,
  );
}

/**
 * Hoja blanca bajo la barra: radio 14 arriba, margen 8, sombra de hoja.
 * En escritorio (`plana`) ya está dentro de la libreta, así que pierde marco y sombra.
 * `centrada` la deja en una columna legible; `doble` la parte en dos páginas con el lomo al centro.
 */
export function Hoja({
  children,
  className,
  plana,
  centrada,
  doble,
}: {
  children: ReactNode;
  className?: string;
  plana?: boolean;
  centrada?: boolean;
  doble?: boolean;
}) {
  return (
    <section
      className={cx(
        'mx-2 rounded-t-[14px] bg-paper p-4 shadow-[var(--shadow-sheet)]',
        (plana || centrada || doble) && 'md:mx-0 md:rounded-none md:shadow-none',
        centrada && 'md:mx-auto md:w-full md:max-w-[620px] md:px-6 md:py-8',
        doble && 'md:mx-auto md:w-full md:max-w-[620px] md:px-6 md:py-8 xl:max-w-none xl:grid xl:grid-cols-2 xl:gap-0 xl:p-0',
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Página izquierda de la doble página. En celular desaparece y sus hijos se apilan como siempre. */
export function PaginaIzquierda({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('contents xl:flex xl:min-w-0 xl:flex-col xl:gap-6 xl:p-8', className)}>{children}</div>;
}

/** Página derecha, con la sombra del lomo en su borde. */
export function PaginaDerecha({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        'contents xl:flex xl:min-w-0 xl:flex-col xl:gap-6 xl:p-8 xl:bg-[linear-gradient(to_right,rgba(29,27,24,0.07),transparent_36px)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
