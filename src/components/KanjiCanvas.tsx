import { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

interface KanjiCanvasProps {
  character: string;
  size?: number; // CSS pixels
  defaultShowGrid?: boolean;
}

export default function KanjiCanvas({ character, size = 300, defaultShowGrid = true }: KanjiCanvasProps) {
  const guideRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(defaultShowGrid);
  const currentStrokeRef = useRef<Point[]>([]);

  // Resize both canvases only when size changes
  useEffect(() => {
    resizeCanvas(guideRef.current);
    resizeCanvas(drawRef.current);
    renderGuide();
    redrawStrokes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  // Re-render guide when character or visibility changes
  useEffect(() => {
    renderGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, showGrid]);

  // Redraw strokes when strokes change
  useEffect(() => {
    redrawStrokes();
  }, [strokes]);

  const resizeCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const desired = size * dpr;
    if (canvas.width !== desired || canvas.height !== desired) {
      canvas.width = desired;
      canvas.height = desired;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const renderGuide = () => {
    const canvas = guideRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    if (!showGrid) return; // ocultar guía
    // Fondo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    // Marco
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);
    // Guías
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.stroke();
    // Kanji guía
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize = size * 0.6;
    ctx.font = `${fontSize}px 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif`;
    ctx.fillText(character, size / 2, size / 2 + size * 0.02);
  };

  const redrawStrokes = () => {
    const canvas = drawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(15,23,42,0.95)';
    strokes.forEach(stroke => {
      if (stroke.length < 2) return;
      for (let i = 1; i < stroke.length; i++) {
        const prev = stroke[i - 1];
        const curr = stroke[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minW = 6;
        const maxW = 12;
        const t = Math.min(1, Math.max(0, dist / 12));
        ctx.lineWidth = maxW - t * (maxW - minW);
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
      }
    });
  };

  const pointFromEvent = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = drawRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as React.MouseEvent).clientY;
    if (clientX === undefined || clientY === undefined) return null;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const p = pointFromEvent(e);
    if (!p) return;
    setIsDrawing(true);
    currentStrokeRef.current = [p];
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const p = pointFromEvent(e);
    if (!p) return;
    currentStrokeRef.current.push(p);
    // Draw incremental only on drawing canvas
    const canvas = drawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = currentStrokeRef.current;
    if (s.length < 2) return;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    const prev = s[s.length - 2];
    const curr = s[s.length - 1];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minW = 6;
    const maxW = 12;
    const t = Math.min(1, Math.max(0, dist / 12));
    ctx.strokeStyle = 'rgba(15,23,42,0.95)';
    ctx.lineWidth = maxW - t * (maxW - minW);
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.stroke();
  };

  const handleUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const stroke = currentStrokeRef.current;
    currentStrokeRef.current = [];
    if (stroke.length > 1) setStrokes(prev => [...prev, stroke]);
  };

  const handleLeave = () => {
    if (isDrawing) handleUp();
  };

  const handleClear = () => setStrokes([]);
  const handleUndo = () => setStrokes(prev => prev.slice(0, -1));

  return (
    <div className="w-full">
      <div className="relative mx-auto" style={{ width: size, maxWidth: '100%' }}>
        {/* Capa de guía */}
        <canvas ref={guideRef} className="block rounded-2xl border border-slate-200 bg-white" />
        {/* Capa de dibujo */}
        <canvas
          ref={drawRef}
          className="absolute inset-0 rounded-2xl touch-none select-none"
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          onMouseUp={handleUp}
          onMouseLeave={handleLeave}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onTouchEnd={handleUp}
        />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button onClick={handleUndo} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium border border-slate-200">Deshacer</button>
        <button onClick={handleClear} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold">Limpiar</button>
        <label className="ml-auto inline-flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input type="checkbox" className="accent-teal-600" checked={showGrid} onChange={() => setShowGrid(v => !v)} />
          Guía
        </label>
      </div>
    </div>
  );
}


