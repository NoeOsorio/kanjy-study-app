import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Cargando from './Cargando';
import IndicePage from '../pages/indice';
import HoyPage from '../pages/hoy';
import Pestanas from './Pestanas';

/** Celular: libreta a pantalla completa. Escritorio (1024 px o más): índice a la izquierda, doble página a la derecha. */
export default function Layout() {
  const enIndice = useLocation().pathname === '/indice';
  return (
    <div className="min-h-dvh bg-paper pt-[env(safe-area-inset-top)] lg:grid lg:h-dvh lg:grid-cols-[330px_1fr] lg:gap-6 lg:p-5">
      <aside className="hidden overflow-y-auto lg:block">
        <IndicePage />
      </aside>
      <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-row">
      <main className="flex min-h-dvh flex-1 flex-col lg:min-h-0 lg:overflow-y-auto lg:rounded-[20px] lg:bg-paper lg:shadow-[var(--shadow-sheet)]">
        {enIndice ? (
          <>
            {/* En celular el índice es la pantalla; en escritorio ya está a la izquierda y aquí va hoy. */}
            <div className="flex flex-1 flex-col lg:hidden">
              <Suspense fallback={<Cargando />}><Outlet /></Suspense>
            </div>
            <div className="hidden flex-1 flex-col lg:flex">
              <HoyPage />
            </div>
          </>
        ) : (
          <Suspense fallback={<Cargando />}><Outlet /></Suspense>
        )}
      </main>
      <Pestanas />
      </div>
    </div>
  );
}
