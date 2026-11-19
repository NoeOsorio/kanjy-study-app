import type { ReactNode } from 'react';

const C = 60;
const lobes = 6;

function flowerPath() {
  const pts: string[] = [];
  const n = 240;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r = 40 + 12 * Math.abs(Math.cos((lobes / 2) * t));
    const x = C + r * Math.cos(t - Math.PI / 2);
    const y = C + r * Math.sin(t - Math.PI / 2);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ') + 'Z';
}

function spiralPath() {
  const pts: string[] = [];
  const turns = 1.7;
  const n = 160;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * turns * Math.PI * 2;
    const r = 24 + (i / n) * 14;
    pts.push(`${i === 0 ? 'M' : 'L'}${(C + r * Math.cos(t)).toFixed(1)} ${(C + r * Math.sin(t)).toFixed(1)}`);
  }
  return pts.join(' ');
}

const FLOWER = flowerPath();
const SPIRAL = spiralPath();

/** 花丸: flor de contorno festoneado con espiral, dibujada con la pluma roja. */
export function Hanamaru({
  size = 120,
  children,
  soft = false,
  spiral = true,
  draw = false,
}: {
  size?: number;
  children?: ReactNode;
  /** Trazo translúcido para dibujarlo encima del kanji. */
  soft?: boolean;
  /** Dibuja la espiral central; apágala cuando va un puntaje dentro. */
  spiral?: boolean;
  /** Dibuja el contorno con la pluma al aparecer (600 ms). */
  draw?: boolean;
}) {
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        stroke="var(--red-pen)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        style={{ position: 'absolute', inset: 0, opacity: soft ? 0.5 : 1 }}
      >
        <path d={FLOWER} pathLength={1} className={draw ? 'kj-draw' : undefined} />
        {spiral && <path d={SPIRAL} pathLength={1} className={draw ? 'kj-draw kj-draw-2' : undefined} />}
      </svg>
      {children && (
        <span
          className="relative text-red-pen"
          style={{ fontFamily: 'var(--font-kanji)', fontSize: size * 0.28, lineHeight: 1 }}
        >
          {children}
        </span>
      )}
    </span>
  );
}
