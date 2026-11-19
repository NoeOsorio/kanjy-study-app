import { useEffect, useState } from 'react';
import Cargando from '../../app/Cargando';
import { useNavigate } from 'react-router-dom';
import { Barra, BotonPrincipal, EtiquetaLectura, Furigana, Hoja, KanjiGrande } from '../../design';
import type { TokenFurigana } from '../../design';
import { needsReading } from '../../data/furigana';
import { getKanji } from '../../data/levels';
import type { Kanji, Level, Word } from '../../data/types';
import { getNote, getSettings } from '../../store/repo';
import type { Rating } from '../../store/types';
import type { TodayPlan } from '../../study/plan';
import { speak, useCanSpeak } from '../../sound';
import { IconPlay } from '../../design/icons';
import { cleanReading, Nota, Oracion } from '../kanji/parts';
import { useRepaso } from './useRepaso';
import type { UseRepaso } from './useRepaso';

interface Datos {
  char: string;
  kanji: Kanji | null;
  note: string;
}

const BOTONES: { rating: Rating; label: string; key: string }[] = [
  { rating: 'again', label: 'Otra vez', key: '1' },
  { rating: 'hard', label: 'Difícil', key: '2' },
  { rating: 'good', label: 'Bien', key: '3' },
  { rating: 'easy', label: 'Fácil', key: '4' },
];
const LABEL_KEY: Record<Rating, 'again' | 'hard' | 'good' | 'easy'> = {
  again: 'again',
  hard: 'hard',
  good: 'good',
  easy: 'easy',
};

/** Sesión de repaso completa: frente, reverso y las cuatro respuestas. Al terminar va a /repaso/listo. */
export function Repaso({ plan }: { plan?: Pick<TodayPlan, 'due'> }) {
  const r = useRepaso(plan);
  const navigate = useNavigate();

  useEffect(() => {
    if (r.resumen) navigate('/repaso/listo', { replace: true });
  }, [r.resumen, navigate]);
  useEffect(() => {
    if (r.empty) navigate('/', { replace: true });
  }, [r.empty, navigate]);

  if (r.loading || !r.current) return <Cargando />;
  return <Tarjeta key={r.current.char + r.remaining} r={r} char={r.current.char} />;
}

function Tarjeta({ r, char }: { r: UseRepaso; char: string }) {
  const navigate = useNavigate();
  const [mostrada, setMostrada] = useState(false);
  const [datos, setDatos] = useState<Datos | null>(null);
  const [level, setLevel] = useState<Level>('N5');

  useEffect(() => {
    let alive = true;
    void Promise.all([getKanji(char), getNote(char), getSettings()]).then(([kanji, note, s]) => {
      if (!alive) return;
      setDatos({ char, kanji, note: note?.text ?? '' });
      setLevel(s.level);
    });
    return () => {
      alive = false;
    };
  }, [char]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!mostrada) {
        if (e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          setMostrada(true);
        }
        return;
      }
      const b = BOTONES.find((x) => x.key === e.key);
      if (b) {
        e.preventDefault();
        void r.answer(b.rating);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mostrada, r]);

  const k = datos?.char === char ? datos.kanji : null;

  return (
    <div className="flex flex-1 flex-col">
      <Barra kind="close" onClick={() => navigate('/indice')}>
        <Progreso total={r.total} remaining={r.remaining} />
      </Barra>
      <div className="relative mx-[17px] mt-3 flex min-h-0 flex-1 flex-col">
        <div
          aria-hidden
          className="absolute inset-x-5 -top-[7px] h-6 rounded-t-[20px] bg-paper shadow-[0_0_0_1px_rgba(29,27,24,0.07)]"
        />
        <Hoja className={`relative mx-0 flex flex-1 flex-col overflow-y-auto rounded-[20px] p-[18px]`}>
          {!mostrada ? (
            <Frente char={char} />
          ) : (
            <Reverso char={char} k={k} level={level} nota={datos?.char === char ? datos.note : ''} />
          )}
        </Hoja>
      </div>
      <div className="px-[17px] pb-4 pt-3">
        {!mostrada ? (
          <BotonPrincipal onClick={() => setMostrada(true)} title="Espacio">
            Mostrar respuesta
          </BotonPrincipal>
        ) : (
          <Respuestas r={r} />
        )}
      </div>
    </div>
  );
}

function Progreso({ total, remaining }: { total: number; remaining: number }) {
  const hechos = Math.max(0, Math.min(total - 1, total - remaining));
  if (total > 24) {
    return (
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-rail" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={hechos}>
        <div className="h-full rounded-full bg-wine" style={{ width: `${(hechos / total) * 100}%` }} />
      </div>
    );
  }
  return (
    <div className="flex w-full gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={hechos}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{ background: i < hechos ? 'var(--wine)' : i === hechos ? '#DE8397' : 'var(--rail)' }}
        />
      ))}
    </div>
  );
}

function Frente({ char }: { char: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <span className="rounded-full bg-sakura-chip px-4 py-2 text-[15px] font-semibold text-sakura-deep">
        Significado o lectura
      </span>
      <div className="relative">
        <KanjiGrande kanji={char} size={230} className="!rounded-[26px]" />
        <span aria-hidden className="pointer-events-none absolute inset-y-5 left-1/2 border-l border-dashed border-[#E9B9C7]" />
        <span aria-hidden className="pointer-events-none absolute inset-x-5 top-1/2 border-t border-dashed border-[#E9B9C7]" />
      </div>
    </div>
  );
}

function Reverso({ char, k, level, nota }: { char: string; k: Kanji | null; level: Level; nota: string }) {
  if (!k) {
    return (
      <div className="kj-reveal flex items-center gap-4">
        <KanjiGrande kanji={char} size={96} />
      </div>
    );
  }
  const on = k.onyomi.slice(0, 1).map(cleanReading).join('、');
  const kun = k.kunyomi.slice(0, 1).map(cleanReading).join('、');
  const palabras = [...k.words.filter((w) => w.written !== char), ...k.words.filter((w) => w.written === char)].slice(0, 3);
  const frase = k.sentences[0];
  return (
    <div className="kj-reveal flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <KanjiGrande kanji={char} size={96} />
        <div className="flex min-w-0 flex-col gap-2 pt-0.5">
          <h1 className="m-0 font-voice text-[30px] leading-tight text-ink">{k.meanings[0]}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {on && <EtiquetaLectura variant="china" reading={on} />}
            {kun && <EtiquetaLectura variant="japonesa" reading={kun} />}
          </div>
        </div>
      </div>
      {palabras.length > 0 && <Palabras words={palabras} char={char} level={level} />}
      {frase && (
        <section className="rounded-[14px] bg-tray px-4 py-3.5">
          <Oracion s={frase} char={char} level={level} size={22} />
        </section>
      )}
      {nota && <Nota char={char} initial={nota} />}
    </div>
  );
}

function tokensPalabra(w: Word, char: string, level: Level): { tokens: TokenFurigana[]; furi: boolean } {
  const furi = needsReading(w.level, level);
  if (furi) return { furi, tokens: [{ text: w.written, reading: w.reading, showReading: true }] };
  return { furi, tokens: Array.from(w.written).map((c) => ({ text: c, accent: c === char })) };
}

function Palabras({ words, char, level }: { words: Word[]; char: string; level: Level }) {
  const sonido = useCanSpeak();
  return (
    <ul className={`m-0 grid list-none items-center gap-x-3 gap-y-2 p-0 ${sonido ? 'grid-cols-[auto_auto_1fr_auto]' : 'grid-cols-[auto_auto_1fr]'}`}>
      {words.map((w) => {
        const { tokens, furi } = tokensPalabra(w, char, level);
        return (
          <li key={w.written} className="col-span-full grid grid-cols-subgrid items-center">
            <Furigana size={28} tokens={tokens} />
            {!furi && (
              <span className="text-[14px] text-ink-3" style={{ fontFamily: 'var(--font-kanji)' }}>
                {w.reading}
              </span>
            )}
            <span className={`font-voice text-[19px] leading-tight text-ink-2 ${furi ? 'col-span-2' : ''}`}>{w.meaning}</span>
            {sonido && (
              <button
                type="button"
                onClick={() => speak(w.reading)}
                aria-label="Escuchar la palabra"
                className="kj-press flex h-8 w-8 items-center justify-center rounded-full bg-tray text-ink"
              >
                <IconPlay size={14} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Respuestas({ r }: { r: UseRepaso }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {BOTONES.map((b) => {
        const estilo =
          b.rating === 'again'
            ? 'bg-sakura-chip text-sakura-deep'
            : b.rating === 'good'
              ? 'bg-wine text-white'
              : 'bg-paper text-ink shadow-[0_0_0_1px_var(--rail)]';
        return (
          <button
            key={b.rating}
            type="button"
            title={`Tecla ${b.key}`}
            onClick={() => void r.answer(b.rating)}
            className={`kj-press flex h-[60px] flex-col items-center justify-center gap-0.5 rounded-xl ${estilo}`}
          >
            <span className="text-[17px] font-semibold leading-none">{b.label}</span>
            <span className="text-[13px] leading-none opacity-70">{r.labels?.[LABEL_KEY[b.rating]] ?? ''}</span>
          </button>
        );
      })}
    </div>
  );
}
