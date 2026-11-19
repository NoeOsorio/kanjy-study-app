import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Barra, Hoja } from '../design';

/** Marco común de una pantalla: barra con volver o cerrar, hoja debajo. */
export function Pagina({
  kind = 'back',
  title,
  children,
}: {
  kind?: 'back' | 'close';
  title: string;
  children?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col">
      <div className={kind === 'back' ? 'md:hidden' : undefined}>
        <Barra kind={kind} onClick={() => navigate(-1)} />
      </div>
      <Hoja className="flex-1">
        <h1 className="font-voice text-[28px] leading-tight text-ink">{title}</h1>
        {children}
      </Hoja>
    </div>
  );
}
