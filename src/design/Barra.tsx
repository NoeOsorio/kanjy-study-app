import type { ReactNode } from 'react';
import { IconAtras, IconCerrar } from './icons';

/** Barra superior: volver o cerrar a la izquierda, contexto mínimo a la derecha. */
export function Barra({
  kind = 'back',
  label,
  onClick,
  children,
  title,
}: {
  kind?: 'back' | 'close';
  label?: string;
  onClick?: () => void;
  children?: ReactNode;
  /** Tooltip, aquí van los atajos de teclado. */
  title?: string;
}) {
  return (
    <header className="flex min-h-[38px] items-center justify-between gap-3 px-3.5 py-2">
      <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={label ?? (kind === 'close' ? 'Cerrar' : 'Volver')}
        className="kj-press flex h-[38px] items-center gap-1.5 rounded-lg bg-tray px-3 text-[15px] font-medium text-ink"
      >
        {kind === 'close' ? <IconCerrar size={18} /> : <IconAtras size={16} />}
        {kind === 'back' && label}
      </button>
      {children && <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5">{children}</div>}
    </header>
  );
}
