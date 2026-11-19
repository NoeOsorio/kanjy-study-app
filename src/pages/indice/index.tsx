import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bandeja, BotonSecundario, CasillaKanji, Hoja, SelloSumi, Washi } from '../../design';
import type { CasillaEstado } from '../../design/CasillaKanji';
import { cx } from '../../design/cx';
import { LEVELS, loadLevel } from '../../data/levels';
import type { Level, LevelFile } from '../../data/types';
import { allCards, getSettings, newKanjiPerDay, putSettings } from '../../store/repo';

// ---------- Datos del índice ----------

const isLearnedState = (s: unknown) => s === 2 || s === 3 || s === 'Review' || s === 'Relearning';
const isLearningState = (s: unknown) => s === 0 || s === 1 || s === 'New' || s === 'Learning';

interface Progreso {
  learned: Set<string>;
  inProgress: Set<string>;
}

async function cargarProgreso(): Promise<Progreso> {
  const cards = await allCards();
  const learned = new Set<string>();
  const inProgress = new Set<string>();
  for (const c of cards) {
    const s = (c.fsrs as { state?: unknown }).state;
    if (isLearnedState(s)) learned.add(c.char);
    else if (isLearningState(s)) inProgress.add(c.char);
  }
  return { learned, inProgress };
}

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ---------- Pantalla ----------

export default function IndicePage() {
  const [params, setParams] = useSearchParams();
  const [level, setLevel] = useState<Level | null>(null);
  const [perDay, setPerDay] = useState(2);
  const [file, setFile] = useState<LevelFile | null>(null);
  const [progreso, setProgreso] = useState<Progreso>({ learned: new Set(), inProgress: new Set() });
  const [selector, setSelector] = useState(params.get('selector') === '1');
  const scroller = useRef<HTMLDivElement>(null);

  // Ajustes y progreso, y el nivel opcional de la URL (se guarda y se quita de la barra).
  useEffect(() => {
    let vivo = true;
    (async () => {
      const [s, p] = await Promise.all([getSettings(), cargarProgreso()]);
      let lvl = s.level;
      const q = params.get('nivel')?.toUpperCase();
      if (q && (LEVELS as string[]).includes(q) && q !== lvl) {
        lvl = q as Level;
        await putSettings({ level: lvl });
      }
      if (!vivo) return;
      setPerDay(newKanjiPerDay(s.minutesPerDay));
      setProgreso(p);
      setLevel(lvl);
      if (params.has('nivel') || params.has('selector')) {
        const next = new URLSearchParams(params);
        next.delete('nivel');
        next.delete('selector');
        setParams(next, { replace: true });
      }
    })();
    return () => {
      vivo = false;
    };
    // Solo al montar: la URL se consume una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!level) return;
    let vivo = true;
    loadLevel(level).then((f) => vivo && setFile(f));
    return () => {
      vivo = false;
    };
  }, [level]);

  const elegir = useCallback((l: Level) => {
    setSelector(false);
    if (l === level) return;
    setFile(null);
    setLevel(l);
    void putSettings({ level: l });
    scroller.current?.scrollIntoView?.({ block: 'start' });
  }, [level]);

  const plan = useMemo(() => {
    if (!file) return null;
    const { learned, inProgress } = progreso;
    const terminada = (n: string[]) => n.every((c) => learned.has(c));
    let actual = file.lessons.findIndex((l) => !terminada(l.kanji));
    if (actual < 0) actual = file.lessons.length;
    const hechas = file.lessons.slice(0, actual);
    const lesson = file.lessons[actual];
    let hoy = new Set<string>();
    if (lesson) {
      const pend = lesson.kanji.filter((c) => !learned.has(c));
      const enCurso = pend.filter((c) => inProgress.has(c));
      hoy = new Set(enCurso.length ? enCurso : pend.slice(0, perDay));
    }
    return { hechas, lesson, hoy, siguientes: file.lessons.slice(actual + 1) };
  }, [file, progreso, perDay]);

  const estado = (c: string, hoy: Set<string>): CasillaEstado =>
    progreso.learned.has(c) ? 'learned' : hoy.has(c) ? 'today' : 'pending';

  return (
    <div className="flex flex-1 flex-col" ref={scroller}>
      <div className="flex items-center gap-2 px-3.5 py-2">
        <button
          type="button"
          onClick={() => setSelector(true)}
          aria-label="Cambiar de nivel"
          className="kj-press flex h-[40px] shrink-0 items-center gap-1 rounded-xl bg-tray pl-3 pr-2 text-[15px] font-bold text-ink"
        >
          {level ?? ''}
          <Chevron />
        </button>
        <Link
          to="/buscar"
          className="kj-press flex h-[40px] min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-paper px-3.5 text-[15px] text-ink-3 shadow-[0_0_0_1px_var(--rail)]"
        >
          <Lupa />
          <span className="truncate">Kanji o significado</span>
        </Link>
        <Link
          to="/cuenta"
          title="Tu cuenta"
          aria-label="Tu cuenta"
          className="kj-press flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-tray text-ink"
        >
          <Persona />
        </Link>
      </div>

      <Hoja className="flex-1">
        <h1 className="sr-only">漢字表</h1>
        {plan && (
          <>
            {plan.hechas.length > 0 && <Terminadas lessons={plan.hechas} />}
            {plan.lesson && (
              <Leccion
                number={plan.lesson.number}
                kanji={plan.lesson.kanji}
                actual
                separada={plan.hechas.length > 0}
                aprendidos={plan.lesson.kanji.filter((c) => progreso.learned.has(c)).length}
                estado={(c) => estado(c, plan.hoy)}
              />
            )}
            {plan.siguientes.map((l) => (
              <Perezosa key={l.number} estimate={estimarAlto(l.kanji.length)}>
                <Leccion
                  number={l.number}
                  kanji={l.kanji}
                  aprendidos={l.kanji.filter((c) => progreso.learned.has(c)).length}
                  estado={() => 'pending'}
                />
              </Perezosa>
            ))}
          </>
        )}
      </Hoja>

      {selector && level && (
        <SelectorNivel
          level={level}
          learned={progreso.learned}
          hoy={plan?.hoy ?? new Set()}
          onPick={elegir}
          onClose={() => setSelector(false)}
        />
      )}
    </div>
  );
}

// ---------- Lecciones ----------

function rango(a: number, b: number) {
  return a === b ? `Lección ${a}` : `Lecciones ${a} a ${b}`;
}

function Terminadas({ lessons }: { lessons: { number: number; kanji: string[] }[] }) {
  const todos = lessons.flatMap((l) => l.kanji);
  return (
    <section className="pt-1">
      <div className="flex items-center gap-3">
        <h2 className="text-[17px] font-bold text-ink">
          {rango(lessons[0].number, lessons[lessons.length - 1].number)}
        </h2>
        <SelloSumi />
      </div>
      <Bandeja className="mt-2.5 block p-3">
        <p className="font-kanji text-[22px] leading-[1.45] tracking-[0.06em] text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>
          {todos.map((c) => (
            <Link key={c} to={`/kanji/${c}`} aria-label={c} className="kj-press">
              {c}
            </Link>
          ))}
        </p>
      </Bandeja>
    </section>
  );
}

function Leccion({
  number,
  kanji,
  actual,
  separada,
  aprendidos,
  estado,
}: {
  number: number;
  kanji: string[];
  actual?: boolean;
  separada?: boolean;
  aprendidos: number;
  estado: (c: string) => CasillaEstado;
}) {
  const navigate = useNavigate();
  return (
    <section className={separada ? 'pt-6' : undefined}>
      <div className="flex min-h-8 flex-wrap items-center gap-x-2.5 gap-y-1.5">
        {actual && <Washi label="Hoy" rotation={-3} className="-ml-1 mr-0.5" />}
        <h2 className={cx('whitespace-nowrap text-[17px] font-bold', actual ? 'text-ink' : 'text-ink-3')}>Lección {number}</h2>
        <span className={cx('whitespace-nowrap text-[15px]', actual ? 'text-ink-3' : 'text-faded')}>
          {aprendidos} de {kanji.length}
        </span>
        {actual && (
          <BotonSecundario className="ml-auto" onClick={() => navigate('/examen')}>
            Examen
          </BotonSecundario>
        )}
      </div>
      <Bandeja className="mt-2.5">
        {kanji.map((c) => (
          <Link key={c} to={`/kanji/${c}`} aria-label={c} className="kj-press">
            <CasillaKanji kanji={c} size="lg" state={estado(c)} />
          </Link>
        ))}
      </Bandeja>
    </section>
  );
}

// ---------- Lecciones perezosas (solo se construye lo cercano a la pantalla) ----------

const estimarAlto = (n: number) => 24 + 32 + 10 + 12 + Math.ceil(n / 6) * 44 + (Math.ceil(n / 6) - 1) * 6;

function scrollPadre(el: HTMLElement | null): HTMLElement | null {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if (o === 'auto' || o === 'scroll') return p;
  }
  return null;
}

function Perezosa({ estimate, children }: { estimate: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const alto = useRef(estimate);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      root: scrollPadre(el),
      rootMargin: '900px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (visible && ref.current) alto.current = ref.current.offsetHeight;
  }, [visible]);

  return (
    <div ref={ref} className="pt-6" style={visible ? undefined : { height: alto.current }}>
      {visible ? children : null}
    </div>
  );
}

// ---------- Selector de nivel ----------

const BADGE: Record<Level, string> = {
  N5: 'bg-paper text-sakura-deep shadow-[0_0_0_1.5px_var(--rail)]',
  N4: 'bg-n4-bg text-n4-ink',
  N3: 'bg-n3-bg text-n3-ink',
  N2: 'bg-n2-bg text-n2-ink',
  N1: 'bg-n1-bg text-n1-ink',
};
const TINTE: Record<Level, string> = {
  N5: 'bg-sakura-chip text-sakura-ink',
  N4: 'bg-n4-bg/40 text-n4-ink/80',
  N3: 'bg-n3-bg/40 text-n3-ink/80',
  N2: 'bg-n2-bg/40 text-n2-ink/80',
  N1: 'bg-n1-bg/40 text-n1-ink/80',
};

function SelectorNivel({
  level,
  learned,
  hoy,
  onPick,
  onClose,
}: {
  level: Level;
  learned: Set<string>;
  hoy: Set<string>;
  onPick: (l: Level) => void;
  onClose: () => void;
}) {
  const [files, setFiles] = useState<Partial<Record<Level, LevelFile>>>({});

  useEffect(() => {
    let vivo = true;
    LEVELS.forEach((l) =>
      loadLevel(l).then((f) => vivo && setFiles((prev) => ({ ...prev, [l]: f }))),
    );
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nivel"
        onClick={(e) => e.stopPropagation()}
        className="mx-auto w-full max-w-[480px] rounded-t-[22px] bg-paper px-3.5 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-[var(--shadow-sheet)]"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-rail" />
        <ul className="flex flex-col gap-1">
          {LEVELS.map((l) => {
            const f = files[l];
            const todos = f ? f.lessons.flatMap((x) => x.kanji) : [];
            const actual = l === level;
            return (
              <li key={l}>
                <button
                  type="button"
                  onClick={() => onPick(l)}
                  aria-pressed={actual}
                  className={cx(
                    'kj-press flex w-full items-start gap-3.5 rounded-2xl p-3 text-left',
                    actual ? 'bg-sakura-bg shadow-[0_0_0_2px_var(--ink)]' : '',
                  )}
                >
                  <span
                    className={cx(
                      'flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl text-[19px] font-bold',
                      BADGE[l],
                    )}
                  >
                    {l}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="min-h-[22px] text-[17px] font-semibold text-ink">
                      {f
                        ? actual
                          ? `${todos.filter((c) => learned.has(c)).length} de ${fmt(todos.length)}`
                          : `${fmt(todos.length)} kanji`
                        : ''}
                    </span>
                    <span className="flex min-h-7 gap-1">
                      {todos.slice(0, 8).map((c) =>
                        actual ? (
                          <CasillaKanji
                            key={c}
                            kanji={c}
                            size="sm"
                            state={learned.has(c) ? 'learned' : hoy.has(c) ? 'today' : 'pending'}
                          />
                        ) : (
                          <span
                            key={c}
                            className={cx('inline-flex h-7 w-7 items-center justify-center rounded-lg', TINTE[l])}
                            style={{ fontFamily: 'var(--font-kanji)', fontSize: 18, lineHeight: 1 }}
                          >
                            {c}
                          </span>
                        ),
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ---------- Iconos locales ----------

const Chevron = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Persona = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
  </svg>
);
const Lupa = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
