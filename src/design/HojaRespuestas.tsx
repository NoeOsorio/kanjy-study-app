
export type RespuestaEstado = 'right' | 'wrong' | 'current' | 'pending';

/** Progreso del examen: círculo rojo si acertó, tachón si falló, anillo de tinta en la actual. */
export function HojaRespuestas({ items }: { items: RespuestaEstado[] }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="list">
      {items.map((s, i) => (
        <span
          key={i}
          role="listitem"
          className="relative flex h-6 w-6 items-center justify-center rounded-md bg-paper"
          style={{
            boxShadow: s === 'current' ? '0 0 0 2px var(--ink)' : '0 0 0 1px var(--rail)',
          }}
        >
          {s === 'right' && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--red-pen)" strokeWidth="2" aria-label="Correcta">
                <circle cx="12" cy="12" r="8" />
              </svg>
            </span>
          )}
          {s === 'wrong' && (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--red-pen)" strokeWidth="2" strokeLinecap="round" aria-label="Incorrecta">
              <path d="M6 19 18 5" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

