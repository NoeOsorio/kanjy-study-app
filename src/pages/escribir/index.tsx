import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getKanji, loadLevel, strokeUrl } from '../../data/levels';
import type { Kanji } from '../../data/types';
import { addLog, getCard, getNote, markStudyDay, putCard } from '../../store/repo';
import { newCard, rate } from '../../store/scheduler';
import NotFound from '../../app/NotFound';
import KanjiCanvas from '../../components/KanjiCanvas';
import type { KanjiCanvasHandle } from '../../components/KanjiCanvas';
import {
  Bandeja,
  Barra,
  BotonPrincipal,
  CasillaKanji,
  EtiquetaLectura,
  Hanamaru,
  Hoja,
  KanjiGrande,
  NotaPropia,
  StickerSakura,
} from '../../design';
import { IconLapiz } from '../../design/icons';

interface Datos {
  kanji: Kanji;
  guide: string[];
  /** Kanji de la lección, para los puntos y para el siguiente. */
  leccion: string[];
  nota: string;
}

const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const IconDeshacer = () => (
  <svg {...iconProps}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </svg>
);
const IconBorrar = () => (
  <svg {...iconProps}>
    <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L13 21" />
    <path d="M22 21H7" />
    <path d="m5 11 9 9" />
  </svg>
);
const IconPista = () => (
  <svg {...iconProps}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6M10 22h4" />
  </svg>
);

function ToolButton({
  label,
  title,
  onClick,
  pressed,
  children,
}: {
  label: string;
  title: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={label}
      aria-pressed={pressed}
      className="kj-press flex h-12 w-16 items-center justify-center rounded-xl text-ink aria-pressed:bg-sakura-chip aria-pressed:text-sakura-deep"
    >
      {children}
    </button>
  );
}

export default function EscribirPage() {
  const { char = '' } = useParams();
  const [datos, setDatos] = useState<{ char: string; d: Datos | null } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const kanji = await getKanji(char);
      if (!kanji) return alive && setDatos({ char, d: null });
      const [file, svg, nota] = await Promise.all([
        loadLevel(kanji.level),
        fetch(strokeUrl(char)).then((r) => (r.ok ? r.text() : '')).catch(() => ''),
        getNote(char),
      ]);
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const guide = Array.from(doc.querySelectorAll('path')).map((p) => p.getAttribute('d') ?? '');
      const leccion = file.lessons.find((l) => l.number === kanji.lesson)?.kanji ?? [char];
      if (alive) setDatos({ char, d: { kanji, guide, leccion, nota: nota?.text ?? '' } });
    })();
    return () => {
      alive = false;
    };
  }, [char]);

  if (!datos || datos.char !== char) return <div className="min-h-dvh" />;
  if (!datos.d) return <NotFound />;
  return <Practica key={char} d={datos.d} />;
}

function Practica({ d }: { d: Datos }) {
  const { kanji, guide, leccion, nota } = d;
  const navigate = useNavigate();
  const canvas = useRef<KanjiCanvasHandle>(null);
  const [trazos, setTrazos] = useState(0);
  const [pista, setPista] = useState(false);
  const [escritos, setEscritos] = useState(0);
  const hecho = trazos >= kanji.strokeCount;
  const idx = Math.max(0, leccion.indexOf(kanji.char));
  const siguiente = leccion[idx + 1];
  // Ventana de seis puntos alrededor del kanji actual.
  const ini = Math.max(0, Math.min(idx - 2, leccion.length - 6));

  // Al completar el último trazo se anota el día y se suma una casilla escrita.
  const antes = useRef(false);
  useEffect(() => {
    if (hecho && !antes.current) {
      markStudyDay().catch(() => {});
      // Writing a kanji for the first time is what adds it to the student's reviews.
      const char = kanji.char;
      getCard(char)
        .then(async (c) => {
          if (c) return;
          const { card, log } = rate(newCard(char, 'lesson'), 'good');
          await putCard(card);
          await addLog(log);
        })
        .catch(() => {});
      setEscritos((n) => n + 1);
    }
    antes.current = hecho;
  }, [hecho]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement | null)?.closest('input, textarea')) return;
      if (e.key === 'z') canvas.current?.undo();
      if (e.key === 'Backspace') canvas.current?.clear();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Casillas de práctica: dos de ejemplo, las escritas y la actual.
  const ranuras = [0, 1, 2, 3].map((i) => {
    const previas = hecho ? escritos - 1 : escritos;
    if (i < previas) return 'escrita';
    if (i === previas) return hecho ? 'escrita-actual' : 'actual';
    return 'vacia';
  });

  const lectura = (kind: 'china' | 'japonesa', list: string[]) =>
    list.length > 0 && (
      <EtiquetaLectura variant={kind} reading={list.slice(0, 2).join('、')} />
    );

  return (
    <div className="flex flex-1 flex-col">
      <Barra kind="back" label="Índice" onClick={() => navigate('/indice')}>
        <div className="flex items-center gap-1" role="img" aria-label="Avance de la lección">
          {leccion.map((c, i) => {
            if (i < ini || i >= ini + 6) return null;
            const sticker = i < idx || (i === idx && hecho);
            return (
              <span key={c} className="inline-flex h-[22px] w-[22px] items-center justify-center">
                {sticker ? (
                  <StickerSakura size={i === idx ? 24 : 20} rotation={(i * 37) % 30 - 15} />
                ) : (
                  <span
                    className={i === idx ? 'h-[18px] w-[18px] rounded-full bg-rail' : 'h-[14px] w-[14px] rounded-full bg-rail'}
                  />
                )}
              </span>
            );
          })}
        </div>
      </Barra>

      <Hoja className="flex flex-1 flex-col gap-3.5 pb-6">
        <div className="flex items-center gap-4">
          <KanjiGrande kanji={kanji.char} size={116} />
          <div className="flex min-w-0 flex-col gap-2.5">
            <h1 className="font-voice text-[30px] leading-none text-ink">{kanji.meanings[0]}</h1>
            {lectura('china', kanji.onyomi)}
            {lectura('japonesa', kanji.kunyomi)}
          </div>
        </div>

        <Bandeja>
          {[0, 1].map((i) => (
            <CasillaKanji key={i} kanji={kanji.char} size="lg" state="pending" className="!h-[45px] !w-[45px]" />
          ))}
          {ranuras.map((r, i) =>
            r === 'escrita' || r === 'escrita-actual' ? (
              <CasillaKanji
                key={i}
                kanji={kanji.char}
                size="lg"
                state={r === 'escrita-actual' ? 'today' : 'learned'}
                className="!h-[45px] !w-[45px]"
              />
            ) : r === 'actual' ? (
              <CasillaKanji key={i} size="lg" state="today" className="!h-[45px] !w-[45px]">
                <IconLapiz size={20} />
              </CasillaKanji>
            ) : (
              <CasillaKanji key={i} size="lg" state="empty" className="!h-[45px] !w-[45px]" />
            ),
          )}
        </Bandeja>

        {nota && <NotaPropia>{nota}</NotaPropia>}

        <div className="relative">
          <KanjiCanvas
            ref={canvas}
            guidePaths={guide}
            showGuide={pista}
            locked={hecho}
            onChange={(s) => setTrazos(s.length)}
          />
          {hecho && <Sello />}
        </div>

        <div className="flex items-center justify-around">
          <ToolButton label="Deshacer" title="Deshacer, tecla z" onClick={() => canvas.current?.undo()}>
            <IconDeshacer />
          </ToolButton>
          <ToolButton label="Borrar todo" title="Borrar todo, tecla Retroceso" onClick={() => canvas.current?.clear()}>
            <IconBorrar />
          </ToolButton>
          <ToolButton label="Ver el trazo guía" title="Ver u ocultar la guía" pressed={pista} onClick={() => setPista((v) => !v)}>
            <IconPista />
          </ToolButton>
        </div>

        {hecho && (
          <BotonPrincipal onClick={() => navigate(siguiente ? `/kanji/${siguiente}/escribir` : '/indice')}>
            Siguiente
          </BotonPrincipal>
        )}
      </Hoja>
    </div>
  );
}

/** 花丸 con pluma roja sobre el trazo del estudiante, se dibuja en menos de 700 ms. */
function Sello() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.querySelectorAll('path').forEach((p, i) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: i === 0 ? 450 : 300,
        delay: i === 0 ? 0 : 350,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'both',
      });
    });
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <HanamaruFluido />
    </div>
  );
}

/** Hanamaru que ocupa el 89 % de la pizarra. */
function HanamaruFluido() {
  return (
    <div className="flex aspect-square w-[89%] items-center justify-center [&>span]:!h-full [&>span]:!w-full [&_svg]:!h-full [&_svg]:!w-full">
      <Hanamaru size={300} soft />
    </div>
  );
}
