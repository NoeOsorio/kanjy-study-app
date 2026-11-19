import type { Summary } from '../../study/session';

export interface Resumen {
  summary: Summary;
  /** Kanji repasados hoy, en el orden en que salieron. */
  repasados: string[];
}

let ultimo: Resumen | null = null;

/** El resumen vive aquí para sobrevivir a la navegación de /repaso a /repaso/listo. */
export function guardarResumen(r: Resumen): void {
  ultimo = r;
}

export function leerResumen(): Resumen | null {
  return ultimo;
}
