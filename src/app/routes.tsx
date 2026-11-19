import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Cargando from './Cargando';
import NotFound from './NotFound';
import HoyPage from '../pages/hoy';
import IndicePage from '../pages/indice';
import KanjiPage from '../pages/kanji';
import EscribirPage from '../pages/escribir';
import RepasoPage from '../pages/repaso';
import RepasoListoPage from '../pages/repasoListo';
import FrasesPage from '../pages/frases';
import ExamenPage from '../pages/examen';
import ExamenJugarPage from '../pages/examenJugar';
import ExamenResultadoPage from '../pages/examenResultado';
import BuscarPage from '../pages/buscar';
import CuentaPage from '../pages/cuenta';
import CreditosPage from '../pages/creditos';

// Hoja de componentes del sistema de diseño (solo en desarrollo)
const ComponentSheet = import.meta.env.DEV ? lazy(() => import('../design/ComponentSheet')) : null;

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HoyPage />} />
        <Route path="/indice" element={<IndicePage />} />
        <Route path="/kanji/:char" element={<KanjiPage />} />
        <Route path="/kanji/:char/escribir" element={<EscribirPage />} />
        <Route path="/repaso" element={<RepasoPage />} />
        <Route path="/repaso/listo" element={<RepasoListoPage />} />
        <Route path="/frases/:lesson" element={<FrasesPage />} />
        <Route path="/examen" element={<ExamenPage />} />
        <Route path="/examen/jugar" element={<ExamenJugarPage />} />
        <Route path="/examen/resultado" element={<ExamenResultadoPage />} />
        <Route path="/buscar" element={<BuscarPage />} />
        <Route path="/cuenta" element={<CuentaPage />} />
        <Route path="/creditos" element={<CreditosPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {ComponentSheet && (
        <Route path="/_componentes" element={<Suspense fallback={<Cargando />}><ComponentSheet /></Suspense>} />
      )}
    </Routes>
  );
}
