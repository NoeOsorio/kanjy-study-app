import { Link } from 'react-router-dom';
import { Barra, Hoja } from '../design';

/** Pantalla vacía para rutas o kanji que no existen. */
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <Barra kind="close" onClick={() => history.back()} />
      <Hoja className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[20px] bg-sakura-bg">
          <span className="font-kanji text-[56px] leading-none text-faded">無</span>
        </div>
        <p className="font-voice text-[22px] text-ink">Esta página no existe.</p>
        <Link
          to="/"
          className="kj-press flex h-[52px] items-center justify-center rounded-xl bg-wine px-8 text-[18px] font-semibold text-white"
        >
          Ir al inicio
        </Link>
      </Hoja>
    </div>
  );
}
