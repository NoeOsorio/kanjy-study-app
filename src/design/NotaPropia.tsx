import type { ReactNode } from 'react';
import { IconLapiz } from './icons';

/** Nota propia del estudiante: tarjeta blanca con renglones. Nunca una nota adhesiva. */
export function NotaPropia({
  children,
  onEdit,
}: {
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <section
      className="rounded-[14px] bg-paper px-[18px] pb-4 pt-3.5"
      style={{ boxShadow: '0 0 0 1px rgba(168,50,90,0.16), 0 8px 20px -10px rgba(168,50,90,0.22)' }}
    >
      <header className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[12px] font-semibold text-wine">
          <IconLapiz size={14} />
          Tu nota
        </span>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-[13px] font-medium text-ink-3">
            Editar
          </button>
        )}
      </header>
      <p
        className="m-0 text-ink"
        style={{
          fontFamily: 'var(--font-kanji)',
          fontSize: 17,
          lineHeight: '26px',
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 25px, #F2E1E7 25px 26px)',
          backgroundAttachment: 'local',
        }}
      >
        {children}
      </p>
    </section>
  );
}
