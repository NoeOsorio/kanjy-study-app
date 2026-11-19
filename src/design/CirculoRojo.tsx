import type { ReactNode } from 'react';

/** Círculo rojo del maestro alrededor de una respuesta correcta. */
export function CirculoRojo({ children }: { children?: ReactNode }) {
  return (
    <span className="relative inline-flex items-center justify-center px-3 py-1.5">
      <svg
        viewBox="0 0 64 56"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="var(--red-pen)"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path
          vectorEffect="non-scaling-stroke"
          d="M14 6 C 30 0, 54 3, 60 22 C 65 40, 48 53, 30 53 C 10 53, -1 38, 4 21 C 8 9, 26 3, 44 4"
        />
      </svg>
      {children && <span className="relative">{children}</span>}
    </span>
  );
}
