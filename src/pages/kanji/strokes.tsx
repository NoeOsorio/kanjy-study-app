import { useEffect, useRef, useState } from 'react';
import { strokeUrl } from '../../data/levels';

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
export const MS_PER_STROKE = 300;

const cache = new Map<string, Promise<string[]>>();

function loadStrokes(char: string): Promise<string[]> {
  let p = cache.get(char);
  if (!p) {
    p = fetch(strokeUrl(char))
      .then((r) => (r.ok ? r.text() : ''))
      .then((txt) => {
        if (!txt.includes('<path')) return [];
        const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
        return Array.from(doc.querySelectorAll('path'))
          .map((p) => p.getAttribute('d') ?? '')
          .filter(Boolean);
      })
      .catch(() => []);
    cache.set(char, p);
  }
  return p;
}

/** Trazos del kanji en orden; vacío mientras carga o si no hay. */
export function useStrokes(char: string): string[] {
  const [state, setState] = useState<{ char: string; d: string[] }>({ char: '', d: [] });
  useEffect(() => {
    let alive = true;
    loadStrokes(char).then((d) => alive && setState({ char, d }));
    return () => {
      alive = false;
    };
  }, [char]);
  return state.char === char ? state.d : [];
}

/** Controla la reproducción del orden de trazos. `run` cambia en cada reproducción. */
export function useStrokePlayback(count: number) {
  const [playing, setPlaying] = useState(false);
  const [go, setGo] = useState(false);
  const [run, setRun] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const raf = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const play = () => {
    if (count === 0) return;
    window.clearTimeout(timer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    setRun((n) => n + 1);
    setGo(false);
    setPlaying(true);
    raf.current = requestAnimationFrame(() => {
      raf.current = requestAnimationFrame(() => setGo(true));
    });
    timer.current = window.setTimeout(
      () => setPlaying(false),
      reduced() ? 1200 : count * MS_PER_STROKE + 700,
    );
  };
  return { playing, go, run, play, instant: typeof window !== 'undefined' && reduced() };
}

/** Trazos dibujándose uno tras otro sobre la baldosa. */
export function StrokeOverlay({
  paths,
  go,
  run,
  instant,
}: {
  paths: string[];
  go: boolean;
  run: number;
  instant: boolean;
}) {
  return (
    <svg
      key={run}
      viewBox="0 0 109 109"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full p-[6%]"
      fill="none"
      stroke="var(--ink)"
      strokeWidth={4.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          style={{
            strokeDasharray: '1 2',
            strokeDashoffset: instant || go ? 0 : 1.02,
            transition: instant ? 'none' : `stroke-dashoffset ${MS_PER_STROKE}ms ${EASE} ${i * MS_PER_STROKE}ms`,
          }}
        />
      ))}
    </svg>
  );
}

/** Tira de pasos: cada baldosa muestra los trazos hasta ahí y el nuevo en pluma roja. */
export function StrokeStrip({ paths }: { paths: string[] }) {
  if (paths.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 rounded-[14px] bg-tray p-1.5">
      {paths.map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 109 109"
          aria-hidden
          className="h-[44px] w-[44px] shrink-0 rounded-lg bg-paper p-[3px] shadow-[0_0_0_1px_var(--rail)]"
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {paths.slice(0, i + 1).map((d, j) => (
            <path key={j} d={d} stroke={j === i ? 'var(--red-pen)' : 'var(--ink)'} />
          ))}
        </svg>
      ))}
    </div>
  );
}
