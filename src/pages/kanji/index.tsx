import { useEffect, useState, useSyncExternalStore } from 'react';
import Cargando from '../../app/Cargando';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getKanji, loadLevel } from '../../data/levels';
import type { Kanji, Level } from '../../data/types';
import { getCard, getNote, getSettings, putCard } from '../../store/repo';
import { newCard } from '../../store/scheduler';
import NotFound from '../../app/NotFound';
import { Barra, BotonPrincipal, FilaDatos, Hoja, KanjiGrande } from '../../design';
import { IconLapiz } from '../../design/icons';
import { canSpeak, speak, useCanSpeak } from '../../sound';
import { StrokeOverlay, StrokeStrip, useStrokePlayback, useStrokes } from './strokes';
import {
  chips,
  Cuadricula,
  Dots,
  EnFrases,
  EnUnaFrase,
  Nota,
  Palabras,
  lecturaHablada,
  Readings,
} from './parts';

interface Loaded {
  char: string;
  kanji: Kanji | null;
  level: Level;
  writing: boolean;
  note: string;
  hasCard: boolean;
  lessonTotal: number;
  lessonDone: number;
}

const QUERY = '(min-width: 1024px)';
function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(QUERY);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

async function load(char: string): Promise<Loaded> {
  const [kanji, settings, note, card] = await Promise.all([getKanji(char), getSettings(), getNote(char), getCard(char)]);
  let lessonTotal = 0;
  let lessonDone = 0;
  if (kanji) {
    try {
      const f = await loadLevel(kanji.level);
      const lesson = f.lessons.find((l) => l.number === kanji.lesson);
      if (lesson) {
        lessonTotal = lesson.kanji.length;
        const cards = await Promise.all(lesson.kanji.map((c) => getCard(c)));
        lessonDone = cards.filter(Boolean).length;
      }
    } catch {
      /* sin progreso */
    }
  }
  return {
    char,
    kanji,
    level: settings.level,
    writing: settings.writing,
    note: note?.text ?? '',
    hasCard: !!card,
    lessonTotal,
    lessonDone,
  };
}

export default function KanjiPage() {
  const { char = '' } = useParams();
  const [state, setState] = useState<Loaded | null>(null);

  useEffect(() => {
    let alive = true;
    load(char).then((s) => alive && setState(s));
    return () => {
      alive = false;
    };
  }, [char]);

  if (!state || state.char !== char) return <Cargando />;
  if (!state.kanji) return <NotFound />;
  return <Contenido s={state} k={state.kanji} />;
}

function Contenido({ s, k }: { s: Loaded; k: Kanji }) {
  const navigate = useNavigate();
  const desktop = useDesktop();
  const paths = useStrokes(k.char);
  const pb = useStrokePlayback(paths.length);
  const [added, setAdded] = useState(s.hasCard);
  const escribir = `/kanji/${encodeURIComponent(k.char)}/escribir`;
  const done = Math.min(s.lessonTotal, s.lessonDone + (added && !s.hasCard ? 1 : 0));
  const dots = s.lessonTotal > 0 ? <Dots total={s.lessonTotal} filled={done} size={desktop ? 22 : 18} /> : null;

  const sonido = useCanSpeak();
  const onPlay = () => {
    pb.play();
    const t = lecturaHablada(k);
    if (canSpeak() && t) speak(t);
  };

  const tile = (
    <KanjiGrande
      kanji={pb.playing ? '' : k.char}
      size={desktop ? 142 : 116}
      onPlay={paths.length > 0 || sonido ? onPlay : undefined}
      playLabel="Ver el orden de los trazos"
      className="relative"
    />
  );
  const tileWithStrokes = (
    <div className="relative shrink-0">
      {tile}
      {pb.playing && (
        <div className="pointer-events-none absolute left-0 top-0" style={{ width: desktop ? 142 : 116, height: desktop ? 142 : 116 }}>
          <StrokeOverlay paths={paths} go={pb.go} run={pb.run} instant={pb.instant} />
        </div>
      )}
    </div>
  );

  const head = (
    <div className="flex items-start gap-4">
      {tileWithStrokes}
      <div className="flex min-w-0 flex-col gap-3 pt-1">
        <h1 className="m-0 font-voice text-[36px] leading-none text-ink">{k.meanings[0]}</h1>
        <Readings k={k} />
      </div>
    </div>
  );

  const agregar = () => {
    void putCard(newCard(k.char, 'lesson')).then(() => setAdded(true));
  };

  const accion = s.writing ? (
    <BotonPrincipal icon={<IconLapiz size={20} />} onClick={() => navigate(escribir)}>
      Escribir de memoria
    </BotonPrincipal>
  ) : (
    <BotonPrincipal icon={<IconLapiz size={20} />} onClick={agregar} disabled={added}>
      {added ? 'En tus repasos' : 'Agregar a mis repasos'}
    </BotonPrincipal>
  );

  if (!desktop) {
    return (
      <div className="flex flex-1 flex-col">
        <Barra kind="back" label="Índice" onClick={() => navigate('/indice')}>
          {dots}
        </Barra>
        <Hoja className="flex flex-1 flex-col gap-4">
          {head}
          <FilaDatos chips={chips(k)} dificultad={k.difficulty} />
          <Palabras words={k.words} level={s.level} char={k.char} />
          {s.writing && <Cuadricula char={k.char} to={escribir} cols={6} cells={12} />}
          {k.sentences[0] && <EnUnaFrase s={k.sentences[0]} char={k.char} level={s.level} />}
          <Nota char={k.char} initial={s.note} />
          <div className="mt-auto pt-2">{accion}</div>
        </Hoja>
      </div>
    );
  }

  return (
    <div className="grid flex-1 grid-cols-2">
      <section className="flex flex-col gap-6 p-8">
        {head}
        <FilaDatos chips={chips(k)} dificultad={k.difficulty} />
        <Palabras words={k.words} level={s.level} char={k.char} />
        <EnFrases k={k} level={s.level} />
        {paths.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="m-0 text-[14px] font-semibold text-ink-3">Orden de trazos</h2>
            <StrokeStrip paths={paths} />
          </div>
        )}
      </section>
      <section
        className="flex flex-col gap-5 p-8"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(29,27,24,0.07), transparent 28px)' }}
      >
        <div className="flex justify-end">{dots}</div>
        {s.writing ? (
          <>
            <Cuadricula char={k.char} to={escribir} cols={7} cells={7} />
            <Link
              to={escribir}
              aria-label="Escribir de memoria"
              className="kj-press relative flex aspect-[4/3] w-full items-end justify-center rounded-[20px] bg-tray p-3"
            >
              <span className="absolute inset-3 rounded-xl bg-paper shadow-[0_0_0_2px_var(--ink)]" aria-hidden>
                <span className="absolute inset-y-6 left-1/2 border-l border-dashed border-rail" />
                <span className="absolute inset-x-6 top-1/2 border-t border-dashed border-rail" />
              </span>
              <span className="relative mb-6 flex h-[52px] items-center gap-2.5 rounded-xl bg-wine px-6 text-[18px] font-semibold text-white">
                <IconLapiz size={20} />
                Escribir de memoria
              </span>
            </Link>
          </>
        ) : (
          accion
        )}
        <Nota char={k.char} initial={s.note} />
      </section>
    </div>
  );
}
