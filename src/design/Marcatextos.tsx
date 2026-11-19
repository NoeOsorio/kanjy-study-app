import type { ReactNode } from 'react';

/** Banda de marcatextos detrás de un kanji dentro de una frase (del 18 % al 88 % de la altura). */
export function Marcatextos({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background:
          'linear-gradient(to bottom, transparent 18%, var(--highlighter) 18%, var(--highlighter) 88%, transparent 88%)',
        padding: '0 1px',
      }}
    >
      {children}
    </span>
  );
}
