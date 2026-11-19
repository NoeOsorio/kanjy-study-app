import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

/** Punto normalizado, de 0 a 1, para que el trazo sobreviva a cambios de tamaño. */
export type Point = { x: number; y: number };
export type Stroke = Point[];

export interface KanjiCanvasHandle {
  undo: () => void;
  clear: () => void;
}

interface KanjiCanvasProps {
  /** Trazos de KanjiVG (atributo d, caja de 109) para la guía tenue. */
  guidePaths?: string[];
  showGuide?: boolean;
  /** Cuando es true ya no se aceptan más trazos. */
  locked?: boolean;
  onChange?: (strokes: Stroke[]) => void;
}

const INK = '#1D1B18';
const RAIL = '#F2E1E7';

/** Pizarra cuadrada para escribir con el dedo o el ratón. */
const KanjiCanvas = forwardRef<KanjiCanvasHandle, KanjiCanvasProps>(function KanjiCanvas(
  { guidePaths = [], showGuide = false, locked = false, onChange },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const guideRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);

  useImperativeHandle(ref, () => ({
    undo: () => setStrokes((s) => s.slice(0, -1)),
    clear: () => setStrokes([]),
  }));

  useEffect(() => {
    onChange?.(strokes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes]);

  // El lienzo sigue al ancho disponible.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize(el.clientWidth));
    ro.observe(el);
    setSize(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  function prepare(canvas: HTMLCanvasElement | null) {
    if (!canvas || !size) return null;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(size * dpr)) {
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    return ctx;
  }

  // Guía de KanjiVG, muy tenue.
  useEffect(() => {
    const ctx = prepare(guideRef.current);
    if (!ctx || !showGuide) return;
    const k = size / 109;
    ctx.scale(k, k);
    ctx.strokeStyle = INK;
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    guidePaths.forEach((d) => ctx.stroke(new Path2D(d)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guidePaths, showGuide, size]);

  function paint(all: Stroke[]) {
    const ctx = prepare(drawRef.current);
    if (!ctx) return;
    ctx.strokeStyle = INK;
    ctx.fillStyle = INK;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(10, size * 0.042);
    for (const s of all) {
      const pts = s.map((p) => ({ x: p.x * size, y: p.y * size }));
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      // Curvas por puntos medios para que el trazo salga suave.
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }
  }

  useEffect(() => {
    paint(strokes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, size]);

  function point(e: React.PointerEvent): Point {
    const r = drawRef.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  }

  function down(e: React.PointerEvent) {
    if (locked || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    currentRef.current = [point(e)];
    paint([...strokes, currentRef.current]);
  }

  function move(e: React.PointerEvent) {
    const cur = currentRef.current;
    if (!cur) return;
    const p = point(e);
    const prev = cur[cur.length - 1];
    if (Math.hypot(p.x - prev.x, p.y - prev.y) * size < 1.5) return;
    cur.push(p);
    paint([...strokes, cur]);
  }

  function up() {
    const cur = currentRef.current;
    currentRef.current = null;
    if (!cur) return;
    // Un toque suelto no cuenta como trazo.
    if (cur.length < 2) return paint(strokes);
    setStrokes((s) => [...s, cur]);
  }

  return (
    <div
      ref={wrapRef}
      className="relative aspect-square w-full overflow-hidden rounded-xl bg-white"
      style={{ border: '2px solid var(--ink)' }}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <line x1="50%" y1="4%" x2="50%" y2="96%" stroke={RAIL} strokeWidth="2" strokeDasharray="8 8" />
        <line x1="4%" y1="50%" x2="96%" y2="50%" stroke={RAIL} strokeWidth="2" strokeDasharray="8 8" />
      </svg>
      <canvas ref={guideRef} className="absolute inset-0 h-full w-full" aria-hidden />
      <canvas
        ref={drawRef}
        role="img"
        aria-label="Espacio para escribir el kanji"
        className="absolute inset-0 h-full w-full select-none"
        style={{ touchAction: 'none' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      />
    </div>
  );
});

export default KanjiCanvas;
