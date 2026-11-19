import { useEffect, useRef } from 'react';

export type RespuestaEstado = 'right' | 'wrong' | 'current' | 'pending';

/** Progreso del examen en una sola fila: círculo rojo si acertó, tachón si falló, anillo de tinta en la actual. */
export function HojaRespuestas({ items }: { items: RespuestaEstado[] }) {
  const chico = items.length > 10;
  const actual = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    actual.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [items]);
  const lado = chico ? 18 : 24;
  return (
    <div
      className="flex flex-nowrap gap-1 overflow-x-auto p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="list"
    >
      {items.map((s, i) => (
        <span
          key={i}
          ref={s === 'current' ? actual : undefined}
          role="listitem"
          className="relative flex shrink-0 items-center justify-center rounded-md bg-paper"
          style={{
            width: lado,
            height: lado,
            boxShadow: s === 'current' ? '0 0 0 2px var(--ink)' : '0 0 0 1px var(--rail)',
          }}
        >
          {s === 'right' && (
            <svg viewBox="0 0 24 24" width={lado - 2} height={lado - 2} fill="none" stroke="var(--red-pen)" strokeWidth="2" aria-label="Correcta">
              <circle cx="12" cy="12" r="8" />
            </svg>
          )}
          {s === 'wrong' && (
            <svg viewBox="0 0 24 24" width={lado - 2} height={lado - 2} fill="none" stroke="var(--red-pen)" strokeWidth="2" strokeLinecap="round" aria-label="Incorrecta">
              <path d="M6 19 18 5" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
