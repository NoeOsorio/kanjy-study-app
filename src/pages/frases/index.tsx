import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cargando from '../../app/Cargando';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loadLevel } from '../../data/levels';
import { needsReading } from '../../data/furigana';
import { sentenceTokens } from '../../data/furigana';
import type { Kanji, Level, Sentence, Word } from '../../data/types';
import { getSettings } from '../../store/repo';
import { speak, useCanSpeak } from '../../sound';
import NotFound from '../../app/NotFound';
import { Barra, BotonPrincipal, CasillaKanji, Furigana, KanjiGrande, Marcatextos } from '../../design';
import type { TokenFurigana } from '../../design';
import { IconAtras, IconLapiz, IconPlay } from '../../design/icons';
import { kata2hira, sentenceRomaji } from './romaji';

const DIFICULTAD = { 1: 'Fácil', 2: 'Media', 3: 'Difícil' } as const;
const MAX_POR_KANJI = 3;

type Carta = { kanji: Kanji; sentence?: Sentence };

interface Loaded {
  level: Level;
  cards: Carta[];
}

/** Una carta por frase; un kanji sin frases queda con una carta vacía. */
function armarMazo(kanji: Kanji[]): Carta[] {
  return kanji.flatMap((k) =>
    k.sentences.length === 0
      ? [{ kanji: k }]
      : k.sentences.slice(0, MAX_POR_KANJI).map((s) => ({ kanji: k, sentence: s })),
  );
}

/** Lectura que el kanji toma en esta frase, si coincide con una de sus lecturas. */
function lecturaEnFrase(k: Kanji, s: Sentence): { kind: 'china' | 'japonesa'; text: string } | null {
  const tok = sentenceTokens(s).find((t) => t.text.includes(k.char) && t.reading);
  if (!tok?.reading) return null;
  const rd = kata2hira(tok.reading);
  const cands = [
    ...k.onyomi.map((r) => ({ kind: 'china' as const, text: r.replace(/[.\-]/g, ''), stem: kata2hira(r.replace(/[.\-]/g, '')) })),
    ...k.kunyomi.map((r) => ({ kind: 'japonesa' as const, text: r.replace(/[.\-]/g, ''), stem: kata2hira(r.split('.')[0].replace('-', '')) })),
  ]
    .filter((c) => c.stem && rd.includes(c.stem))
    .sort((a, b) => b.stem.length - a.stem.length);
  return cands[0] ? { kind: cands[0].kind, text: cands[0].text } : null;
}

function kanaDeFrase(s: Sentence): string {
  return sentenceTokens(s)
    .map((t) => t.reading ?? t.text)
    .join('');
}

const CHIP = {
  china: 'bg-china-bg text-china-ink',
  japonesa: 'bg-japonesa-bg text-japonesa-ink',
};

function BotonSonido({ text }: { text: string }) {
  const sonido = useCanSpeak();
  if (!sonido) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label="Escuchar la frase"
      className="kj-press flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-tray text-ink"
    >
      <IconPlay size={18} />
    </button>
  );
}

function Encabezado({
  k,
  lectura,
  play,
  size,
}: {
  k: Kanji;
  lectura?: { kind: 'china' | 'japonesa'; text: string } | null;
  play?: string;
  size: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <KanjiGrande kanji={k.char} size={size} className="!rounded-[14px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="m-0 font-voice text-[22px] leading-tight text-ink">{k.meanings[0]}</p>
        <div className="flex flex-wrap gap-2">
          {lectura && (
            <span
              className={`rounded-lg px-3 py-1 text-[17px] font-medium ${CHIP[lectura.kind]}`}
              style={{ fontFamily: 'var(--font-kanji)' }}
            >
              {lectura.text}
            </span>
          )}
          <span className="rounded-lg bg-tray px-3 py-1 text-[15px] font-semibold text-ink-2">
            {DIFICULTAD[k.difficulty]}
          </span>
        </div>
      </div>
      {play && <BotonSonido text={play} />}
    </div>
  );
}

function CartaFrase({ k, s, level }: { k: Kanji; s: Sentence; level: Level }) {
  const toks = sentenceTokens(s);
  const tokens: TokenFurigana[] = toks.map((t) => {
    const estudiado = t.text.includes(k.char);
    return {
      text: t.text,
      reading: t.reading,
      showReading: !!t.reading && (estudiado || (!!t.level && needsReading(t.level, level))),
      highlight: estudiado,
    };
  });
  const palabras = k.words.slice(0, 3);
  return (
    <>
      <div className="flex flex-1 flex-col gap-5 px-5 pb-4 pt-6">
        <Encabezado k={k} lectura={lecturaEnFrase(k, s)} play={kanaDeFrase(s)} size={72} />
        <div className="flex flex-col gap-2">
          <Furigana tokens={tokens} size={30} />
          <p className="m-0 text-[16px] text-ink-3">{sentenceRomaji(toks)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {palabras.map((w) => (
            <span key={w.written} className="flex items-baseline gap-2 rounded-xl bg-tray px-2.5 py-1.5">
              <span className="text-[18px] text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>
                {w.written}
              </span>
              <span className="font-voice text-[15px] text-ink-2">{w.meaning}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1 rounded-b-[20px] bg-sakura-bg px-5 pb-5 pt-4">
        <p className="m-0 text-[15px] font-semibold text-sakura-deep">Significa</p>
        <p className="m-0 font-voice text-[24px] leading-snug text-ink">{s.es}</p>
      </div>
    </>
  );
}

function PalabraDeKanji({ w, char }: { w: Word; char: string }) {
  return (
    <li className="flex items-end gap-3">
      <ruby
        className="text-[28px] leading-none text-ink"
        style={{ fontFamily: 'var(--font-kanji)', rubyPosition: 'over' }}
      >
        {[...w.written].map((c, i) => (c === char ? <Marcatextos key={i}>{c}</Marcatextos> : <span key={i}>{c}</span>))}
        <rt style={{ fontSize: 13, color: 'var(--sakura-ink)', letterSpacing: '0.08em' }}>{w.reading}</rt>
      </ruby>
      <span className="pb-0.5 font-voice text-[20px] text-ink">{w.meaning}</span>
    </li>
  );
}

function CartaVacia({ k }: { k: Kanji }) {
  const palabras = k.words.slice(0, 3);
  return (
    <>
      <div className="flex flex-1 flex-col gap-6 px-5 pb-4 pt-6">
        <Encabezado k={k} lectura={null} size={64} />
        <p className="m-0 text-center font-voice text-[19px] text-ink-2">Todavía no hay frases con este kanji.</p>
        <div className="flex flex-col gap-2">
          <p className="m-0 text-[15px] font-medium text-ink-3">Mientras, escríbelo</p>
          <Link
            to={`/kanji/${encodeURIComponent(k.char)}/escribir`}
            aria-label="Escribir el kanji"
            className="kj-press flex w-fit gap-1.5 rounded-[14px] bg-tray p-1.5"
          >
            <CasillaKanji size="lg" state="empty" className="!text-sakura-chip">{k.char}</CasillaKanji>
            <CasillaKanji size="lg" state="empty" className="!text-sakura-chip">{k.char}</CasillaKanji>
            <CasillaKanji size="lg" state="today"><IconLapiz size={20} /></CasillaKanji>
            <CasillaKanji size="lg" state="empty" />
            <CasillaKanji size="lg" state="empty" />
          </Link>
        </div>
      </div>
      {palabras.length > 0 && (
        <div className="flex flex-col gap-3 rounded-b-[20px] bg-sakura-bg px-5 pb-5 pt-4">
          <p className="m-0 text-[15px] font-semibold text-sakura-deep">Lo ves en estas palabras</p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {palabras.map((w) => (
              <PalabraDeKanji key={w.written} w={w} char={k.char} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default function FrasesPage() {
  const { lesson = '' } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<Loaded | 'missing' | null>(null);
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    setState(null);
    setI(0);
    (async () => {
      const n = Number(lesson);
      try {
        const settings = await getSettings();
        const f = await loadLevel(settings.level);
        const l = Number.isInteger(n) ? f.lessons.find((x) => x.number === n) : undefined;
        if (!l) return alive && setState('missing');
        const kanji = l.kanji.map((c) => f.kanji[c]).filter(Boolean);
        if (alive) setState({ level: settings.level, cards: armarMazo(kanji) });
      } catch {
        if (alive) setState('missing');
      }
    })();
    return () => {
      alive = false;
    };
  }, [lesson]);

  const total = state && state !== 'missing' ? state.cards.length : 0;
  const ultima = i >= total - 1;
  const siguiente = useCallback(() => {
    if (i >= total - 1) navigate('/indice');
    else setI(i + 1);
  }, [i, total, navigate]);
  const anterior = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') siguiente();
      else if (e.key === 'ArrowLeft') anterior();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [siguiente, anterior]);

  const carta = useMemo(() => (state && state !== 'missing' ? state.cards[i] : undefined), [state, i]);

  if (state === 'missing' || (state && !carta)) return <NotFound />;
  if (!state || !carta) {
    return (
      <div className="flex flex-1 flex-col">
        <Barra kind="close" onClick={() => navigate(-1)} />
        <Cargando />
      </div>
    );
  }

  const vacia = !carta.sentence;
  const sigTexto = ultima ? 'Terminar' : vacia ? 'Siguiente kanji' : 'Siguiente frase';

  return (
    <div
      className="flex flex-1 flex-col"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const x0 = touchX.current;
        touchX.current = null;
        if (x0 == null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 50) (dx < 0 ? siguiente : anterior)();
      }}
    >
      <Barra kind="close" onClick={() => navigate(-1)}>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rail">
          <div
            className="h-full w-full origin-left rounded-full bg-wine transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${(i + 1) / total})` }}
          />
        </div>
        <Link
          to={`/kanji/${encodeURIComponent(carta.kanji.char)}`}
          aria-label="Ver el kanji"
          className="kj-press text-[28px] leading-none text-ink"
          style={{ fontFamily: 'var(--font-kanji)' }}
        >
          {carta.kanji.char}
        </Link>
      </Barra>
      <div className="relative mx-4 mt-3 flex flex-1 flex-col rounded-[20px] bg-paper shadow-[var(--shadow-sheet)] ring-1 ring-rail">
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 h-4 w-20 -translate-x-1/2 -rotate-2"
          style={{
            background:
              'repeating-linear-gradient(135deg, rgba(244,163,180,0.9) 0 6px, rgba(248,190,202,0.9) 6px 12px)',
          }}
        />
        {vacia ? <CartaVacia k={carta.kanji} /> : <CartaFrase k={carta.kanji} s={carta.sentence!} level={state.level} />}
      </div>
      <div className="flex gap-3 px-4 pb-5 pt-4">
        <button
          type="button"
          onClick={anterior}
          disabled={i === 0}
          title="Frase anterior (flecha izquierda)"
          aria-label="Anterior"
          className="kj-press flex h-[52px] w-[56px] shrink-0 items-center justify-center rounded-xl bg-paper text-ink shadow-[0_0_0_1px_var(--rail)] disabled:text-faded"
        >
          <IconAtras size={20} />
        </button>
        <BotonPrincipal onClick={siguiente} title={`${sigTexto} (flecha derecha)`}>
          {sigTexto}
          {!ultima && <IconAtras size={18} className="rotate-180" />}
        </BotonPrincipal>
      </div>
    </div>
  );
}
