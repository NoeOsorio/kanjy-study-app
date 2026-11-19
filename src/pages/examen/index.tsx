import { useEffect, useMemo, useState } from 'react';
import Cargando from '../../app/Cargando';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Barra, BotonPrincipal, BotonSecundario, CasillaKanji, Hoja, SelloSumi, Washi, PaginaDerecha, PaginaIzquierda } from '../../design';
import type { CasillaEstado } from '../../design/CasillaKanji';
import { loadLevel } from '../../data/levels';
import type { LevelFile } from '../../data/types';
import { allCards, getSettings, isStudied } from '../../store/repo';
import { countWithWords, MAX_QUESTIONS } from '../../exam/questions';
import type { Mode } from '../../exam/questions';

const STEP = 12;

type Tipo = 'done' | 'today' | 'later';

/** Qué lecciones entran por defecto: la actual y las terminadas más recientes hasta 20 kanji. */
function porDefecto(lessons: { number: number; kanji: string[] }[], tipos: Tipo[]): Set<number> {
  const sel = new Set<number>();
  let total = 0;
  const hoy = tipos.indexOf('today');
  if (hoy >= 0) {
    sel.add(lessons[hoy].number);
    total += lessons[hoy].kanji.length;
  }
  for (let i = (hoy >= 0 ? hoy : lessons.length) - 1; i >= 0; i--) {
    if (tipos[i] !== 'done') continue;
    if (total + lessons[i].kanji.length > MAX_QUESTIONS) break;
    sel.add(lessons[i].number);
    total += lessons[i].kanji.length;
  }
  return sel;
}

export default function ExamenPage() {
  const navigate = useNavigate();
  const elegida = (useLocation().state as { leccion?: number } | null)?.leccion;
  const [file, setFile] = useState<LevelFile | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [modo, setModo] = useState<Mode>('meaning');
  const [desde, setDesde] = useState(0);
  const [hasta, setHasta] = useState(0);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const s = await getSettings();
      const [f, cards] = await Promise.all([loadLevel(s.level), allCards()]);
      if (!vivo) return;
      const learned = new Set(cards.filter(isStudied).map((c) => c.char));
      const hecha = f.lessons.map((l) => l.kanji.every((c) => learned.has(c)));
      const actual = hecha.indexOf(false);
      const t: Tipo[] = f.lessons.map((_, i) => (hecha[i] ? 'done' : i === actual ? 'today' : 'later'));
      setFile(f);
      setTipos(t);
      const inicial = elegida ? new Set([elegida]) : porDefecto(f.lessons, t);
      setSel(inicial);
      const idx = f.lessons.map((l, i) => (inicial.has(l.number) ? i : -1)).filter((i) => i >= 0);
      const centro = actual >= 0 ? actual : f.lessons.length - 1;
      setDesde(idx.length ? Math.min(...idx) : Math.max(0, centro - 1));
      setHasta(Math.min(f.lessons.length, Math.max(centro, ...idx) + 3));
    })();
    return () => {
      vivo = false;
    };
  }, []);

  const chars = useMemo(
    () => (file ? file.lessons.filter((l) => sel.has(l.number)).flatMap((l) => l.kanji) : []),
    [file, sel],
  );
  const hayPalabras = file ? countWithWords(chars, file) > 0 : false;
  const modoReal: Mode = modo === 'words' && !hayPalabras ? 'meaning' : modo;
  const cuenta = Math.min(chars.length, MAX_QUESTIONS);

  const alternar = (n: number) =>
    setSel((p) => {
      const q = new Set(p);
      if (q.has(n)) q.delete(n);
      else q.add(n);
      return q;
    });

  const empezar = () => navigate('/examen/jugar', { state: { chars, mode: modoReal } });

  return (
    <div className="flex flex-1 flex-col">
      <Barra kind="close" onClick={() => navigate('/indice')} />
      <Hoja doble className="flex flex-1 flex-col">
        <h1 className="sr-only">Examen</h1>
        <PaginaIzquierda className="xl:gap-0">
        <Etiqueta>Qué entra</Etiqueta>
        {!file && <Cargando />}
        {file && (
          <div className="mt-2.5 grid grid-cols-2 gap-x-2.5 gap-y-3">
            {desde > 0 && (
              <div className="col-span-2">
                <BotonSecundario onClick={() => setDesde(Math.max(0, desde - STEP))}>Lecciones anteriores</BotonSecundario>
              </div>
            )}
            {file.lessons.slice(desde, hasta).map((l, i) => (
              <Leccion
                key={l.number}
                number={l.number}
                kanji={l.kanji}
                tipo={tipos[desde + i]}
                on={sel.has(l.number)}
                onClick={() => alternar(l.number)}
              />
            ))}
            {hasta < file.lessons.length && (
              <div className="col-span-2">
                <BotonSecundario onClick={() => setHasta(Math.min(file.lessons.length, hasta + STEP))}>
                  Más lecciones
                </BotonSecundario>
              </div>
            )}
          </div>
        )}

        </PaginaIzquierda>
        <PaginaDerecha className="xl:gap-0">
        <div className="mt-6 xl:mt-0">
          <Etiqueta>Qué te pregunta</Etiqueta>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Qué te pregunta">
          {MODOS.map((m) => {
            const off = m.id === 'words' && !hayPalabras;
            return (
              <ModoCard
                key={m.id}
                modo={m}
                on={modoReal === m.id}
                disabled={off}
                title={off ? 'Ningún kanji de lo que elegiste tiene palabras' : undefined}
                onClick={() => setModo(m.id)}
              />
            );
          })}
        </div>

        <div className="sticky bottom-0 mt-auto bg-paper pb-1 pt-6">
          <BotonPrincipal disabled={cuenta === 0} onClick={empezar}>
            {cuenta === 0 ? 'Elige al menos una lección' : `Empezar con ${cuenta} kanji`}
          </BotonPrincipal>
        </div>
        </PaginaDerecha>
      </Hoja>
    </div>
  );
}

function Etiqueta({ children }: { children: ReactNode }) {
  return <h2 className="px-1 text-[17px] font-semibold text-ink-3">{children}</h2>;
}

function Leccion({
  number,
  kanji,
  tipo,
  on,
  onClick,
}: {
  number: number;
  kanji: string[];
  tipo: Tipo;
  on: boolean;
  onClick: () => void;
}) {
  const faded = tipo === 'later';
  const estado: CasillaEstado = faded ? 'pending' : 'empty';
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={onClick}
      className="kj-press relative rounded-[14px] bg-tray p-3 text-left"
      style={{ boxShadow: on ? '0 0 0 2px var(--ink)' : 'none' }}
    >
      <span className="flex h-[26px] items-center gap-2">
        {tipo === 'done' && <SelloSumi size={24} />}
        {tipo === 'today' && <Washi label="Hoy" rotation={-3} className="!px-2 !py-1 !text-[11px]" />}
        <span className={`text-[16px] font-semibold ${faded ? 'text-faded' : 'text-ink'}`}>Lección {number}</span>
      </span>
      <span className="mt-2 flex gap-1">
        {kanji.slice(0, 4).map((c) => (
          <CasillaKanji key={c} kanji={c} size="sm" state={estado} />
        ))}
      </span>
      <span
        aria-hidden
        className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full"
        style={
          on
            ? { background: 'var(--wine)', boxShadow: '0 0 0 2px #fff' }
            : { background: '#fff', boxShadow: '0 0 0 1.5px var(--faded)' }
        }
      >
        {on && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        )}
      </span>
    </button>
  );
}

// ---------- Modos ----------

function Ficha({ children, tone, voice }: { children: ReactNode; tone: 'sakura' | 'china' | 'japonesa'; voice?: boolean }) {
  const bg = tone === 'sakura' ? 'bg-sakura-bg' : tone === 'china' ? 'bg-china-bg' : 'bg-japonesa-bg';
  return (
    <span
      className={`inline-flex h-10 min-w-10 items-center justify-center whitespace-nowrap rounded-lg px-1.5 text-ink ${bg}`}
      style={{ fontFamily: voice ? 'var(--font-voice)' : 'var(--font-kanji)', fontSize: voice ? 17 : 24, lineHeight: 1 }}
    >
      {children}
    </span>
  );
}

const Flecha = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

const MODOS: { id: Mode; label: string; visual: ReactNode }[] = [
  {
    id: 'meaning',
    label: 'Significado',
    visual: (
      <>
        <Ficha tone="sakura">語</Ficha>
        <Flecha />
        <span className="font-voice text-[19px] text-ink">idioma</span>
      </>
    ),
  },
  {
    id: 'kanji',
    label: 'Kanji',
    visual: (
      <>
        <Ficha tone="sakura" voice>idioma</Ficha>
        <Flecha />
        <span className="text-[24px] text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>語</span>
      </>
    ),
  },
  {
    id: 'reading',
    label: 'Lectura',
    visual: (
      <>
        <Ficha tone="china">語</Ficha>
        <Flecha />
        <span className="text-[22px] text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>ゴ</span>
      </>
    ),
  },
  {
    id: 'byReading',
    label: 'Por lectura',
    visual: (
      <>
        <Ficha tone="china">ゴ</Ficha>
        <Flecha />
        <span className="text-[24px] text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>語</span>
      </>
    ),
  },
  {
    id: 'words',
    label: 'Palabras',
    visual: (
      <>
        <Ficha tone="japonesa">国語</Ficha>
        <Flecha />
        <span className="whitespace-nowrap text-[17px] text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>こくご</span>
      </>
    ),
  },
  {
    id: 'mix',
    label: 'Mezcla',
    visual: (
      <>
        <Ficha tone="sakura">語</Ficha>
        <Ficha tone="china">ゴ</Ficha>
        <Ficha tone="japonesa">国</Ficha>
      </>
    ),
  },
];

function ModoCard({
  modo,
  on,
  disabled,
  title,
  onClick,
}: {
  modo: (typeof MODOS)[number];
  on: boolean;
  disabled: boolean;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      aria-disabled={disabled}
      title={title}
      onClick={() => !disabled && onClick()}
      className={`kj-press relative flex flex-col gap-3 rounded-[14px] bg-paper p-3 text-left ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}
      style={{ boxShadow: on ? '0 0 0 2px var(--ink)' : '0 0 0 1px var(--rail)' }}
    >
      <span className="flex h-10 items-center gap-1.5">{modo.visual}</span>
      <span className="text-[15px] font-semibold text-ink-3">{modo.label}</span>
      {modo.id === 'meaning' && (
        <span className="absolute -top-2.5 right-2">
          <Washi label="Para empezar" rotation={-3} className="!px-2.5 !py-1 !text-[11px]" />
        </span>
      )}
    </button>
  );
}
