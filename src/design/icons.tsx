import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16, p: P) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
});

export const IconLapiz = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    <path d="m14.5 5.5 3 3" />
  </svg>
);

export const IconAtras = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const IconCerrar = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlay = ({ size, ...p }: P) => (
  <svg {...base(size, { ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.85l10.5-6.5a1 1 0 0 0 0-1.7L9.5 4.65A1 1 0 0 0 8 5.5Z" />
  </svg>
);
