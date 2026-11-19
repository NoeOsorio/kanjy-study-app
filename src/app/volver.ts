import type { NavigateFunction } from 'react-router-dom';

/** Cierra una sesión de prueba y regresa a donde estaba el estudiante, o al índice si abrió la pantalla directo. */
export function volver(navigate: NavigateFunction, alterno = '/indice') {
  const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
  if (idx > 0) navigate(-1);
  else navigate(alterno);
}
