import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Cargando from './Cargando';
import IndicePage from '../pages/indice';
import HoyPage from '../pages/hoy';
import Pestanas from './Pestanas';

/** Celular: libreta a pantalla completa. Tableta y escritorio (768 px o más): índice a la izquierda, doble página a la derecha. */
export default function Layout() {
  const { pathname } = useLocation();
  const enIndice = pathname === '/indice';
  // Repaso y examen son pruebas: sin el índice al lado, la libreta ocupa todo.
  const enfoque = pathname === '/repaso' || pathname === '/examen/jugar';
  return (
    <div
      className={`min-h-dvh bg-paper pt-[env(safe-area-inset-top)] md:grid md:h-dvh md:gap-6 md:p-5 ${enfoque ? 'md:grid-cols-1' : 'md:grid-cols-[280px_1fr] lg:grid-cols-[330px_1fr]'}`}
    >
      <aside className={`hidden overflow-y-auto ${enfoque ? '' : 'md:block'}`}>
        <IndicePage />
      </aside>
      <div className="flex min-w-0 flex-col md:min-h-0 md:flex-row">
      <main className="flex min-h-dvh flex-1 flex-col md:min-h-0 md:overflow-y-auto lg:rounded-[20px] md:bg-paper lg:shadow-[var(--shadow-sheet)]">
        {enIndice ? (
          <>
            {/* En celular el índice es la pantalla; en escritorio ya está a la izquierda y aquí va hoy. */}
            <div className="flex flex-1 flex-col md:hidden">
              <Suspense fallback={<Cargando />}><Outlet /></Suspense>
            </div>
            <div className="hidden flex-1 flex-col md:flex">
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
