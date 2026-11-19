import type { ReactNode } from 'react';
import { cx } from './cx';

export type CasillaTamano = 'sm' | 'md' | 'lg';
export type CasillaEstado = 'learned' | 'today' | 'pending' | 'missed' | 'empty';

const SIZE: Record<CasillaTamano, { box: number; font: number }> = {
  sm: { box: 28, font: 18 },
  md: { box: 36, font: 22 },
  lg: { box: 44, font: 28 },
};

const ESTADO: Record<CasillaEstado, { cls: string; shadow: string }> = {
  learned: { cls: 'bg-paper text-ink', shadow: '0 0 0 1px var(--rail)' },
  today: { cls: 'bg-paper text-ink', shadow: '0 0 0 2px var(--ink)' },
  pending: { cls: 'bg-white/60 text-faded', shadow: 'none' },
  missed: { cls: 'bg-sakura-chip text-sakura-deep', shadow: '0 0 0 1px var(--rail)' },
  empty: { cls: 'bg-paper text-ink', shadow: '0 0 0 1px var(--rail)' },
};

export function CasillaKanji({
  kanji,
  size = 'md',
  state = 'learned',
  children,
  className,
}: {
  kanji?: string;
  size?: CasillaTamano;
  state?: CasillaEstado;
  /** Sustituye al kanji (por ejemplo el lápiz de la casilla de hoy). */
  children?: ReactNode;
  className?: string;
}) {
  const s = SIZE[size];
  const e = ESTADO[state];
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center rounded-lg', e.cls, className)}
      style={{
        width: s.box,
        height: s.box,
        fontSize: s.font,
        fontFamily: 'var(--font-kanji)',
        lineHeight: 1,
        boxShadow: e.shadow,
      }}
    >
      {children ?? kanji}
    </span>
  );
}
