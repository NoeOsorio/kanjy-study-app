import { useEffect, useState } from 'react';
import Cargando from '../../app/Cargando';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getKanji } from '../../data/levels';
import { needsReading, sentenceTokens } from '../../data/furigana';
import { search } from '../../data/search';
import type { SearchResult } from '../../data/search';
import type { Kanji, Level } from '../../data/types';
import { BotonPrincipal, CasillaKanji, EtiquetaLectura, Furigana, Hoja, KanjiGrande } from '../../design';
import { getCard, getSettings, putCard } from '../../store/repo';
import { newCard } from '../../store/scheduler';

const ORDER: Record<Level, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 };
const MAX_ROWS = 80;
const HAN = /\p{Script=Han}/u;

type View =
  | { kind: 'empty' }
  | { kind: 'loading' }
  | { kind: 'none' }
  | { kind: 'list'; rows: SearchResult[] }
  | { kind: 'outside'; best: SearchResult; kanji: Kanji; known: Set<string>; added: boolean };

const stripMarks = (s: string) => s.replace(/[.-]/g, '');

const IconBuscar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);
const IconCuenta = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
);
const IconAbajo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function BuscarPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [text, setText] = useState(q);
  const [level, setLevel] = useState<Level>('N5');
  const [view, setView] = useState<View>(q.trim() ? { kind: 'loading' } : { kind: 'empty' });

  // La URL sigue lo que se escribe, con 150 ms de espera.
  useEffect(() => {
    if (text === q) return;
    const id = setTimeout(() => setParams(text ? { q: text } : {}, { replace: true }), 150);
    return () => clearTimeout(id);
  }, [text, q, setParams]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const settings = await getSettings();
      if (!alive) return;
      setLevel(settings.level);
      if (!q.trim()) return setView({ kind: 'empty' });
      const rows = await search(q);
      if (!alive) return;
      if (rows.length === 0) return setView({ kind: 'none' });
      const best = rows[0];
      if (ORDER[best.level] <= ORDER[settings.level]) return setView({ kind: 'list', rows });
      const kanji = await getKanji(best.char);
      if (!alive) return;
      if (!kanji) return setView({ kind: 'list', rows });
      const others = new Set<string>();
      for (const w of kanji.words) for (const ch of w.written) if (HAN.test(ch) && ch !== best.char) others.add(ch);
      const cards = await Promise.all([...others, best.char].map((c) => getCard(c)));
      if (!alive) return;
      const known = new Set<string>();
      [...others].forEach((c, i) => cards[i] && known.add(c));
      setView({ kind: 'outside', best, kanji, known, added: !!cards[cards.length - 1] });
    })();
    return () => {
      alive = false;
    };
  }, [q]);

  async function agregar(char: string) {
    await putCard(newCard(char, 'search'));
    setView((v) => (v.kind === 'outside' ? { ...v, added: true } : v));
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-2 px-3.5 py-3">
        <button
          type="button"
          onClick={() => navigate('/indice?selector=1')}
          aria-label="Cambiar de nivel"
          className="kj-press flex h-[46px] shrink-0 items-center gap-1.5 rounded-xl bg-tray px-3.5 text-[17px] font-semibold text-ink"
        >
          {level}
          <IconAbajo />
        </button>
        <label className="flex h-[46px] min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-paper px-3.5 text-ink-3 shadow-[0_0_0_2px_var(--ink)]">
          <IconBuscar />
          <input
            autoFocus
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Buscar kanji"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-[18px] text-ink outline-none"
          />
        </label>
        <Link
          to="/cuenta"
          aria-label="Cuenta"
          className="kj-press flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-tray text-ink"
        >
          <IconCuenta />
        </Link>
      </header>

      {view.kind !== 'empty' && (
        <Hoja className="flex flex-1 flex-col gap-5 p-5">
          {view.kind === 'loading' && <Cargando />}
          {view.kind === 'none' && <p className="font-voice text-[22px] text-ink">No encontré nada con eso.</p>}
          {view.kind === 'list' && <Lista rows={view.rows} />}
          {view.kind === 'outside' && <Fuera view={view} level={level} onAgregar={agregar} />}
        </Hoja>
      )}
    </div>
  );
}

function Lista({ rows }: { rows: SearchResult[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {rows.slice(0, MAX_ROWS).map((r) => (
        <li key={r.char}>
          <Link to={`/kanji/${r.char}`} className="kj-press flex items-center gap-3 rounded-xl px-1 py-1.5">
            <CasillaKanji kanji={r.char} size="lg" />
            <span className="min-w-0 flex-1 truncate text-[18px] text-ink">{r.meanings.split(/[,;]/)[0].trim()}</span>
            <span className="text-[15px] text-ink-3">{r.level}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Fuera({
  view,
  level,
  onAgregar,
}: {
  view: Extract<View, { kind: 'outside' }>;
  level: Level;
  onAgregar: (char: string) => void;
}) {
  const { best, kanji, known, added } = view;
  const on = kanji.onyomi[0];
  const kun = kanji.kunyomi[0];
  const sentence = kanji.sentences[0];
  const palabras = kanji.words
    .filter((w) => {
      const otros = [...w.written].filter((c) => HAN.test(c) && c !== best.char);
      return otros.length > 0 && otros.every((c) => known.has(c));
    })
    .slice(0, 4);
  return (
    <>
      <p className="font-voice text-[24px] leading-snug text-ink">
        No está en {level}, pero sí en {best.level}.
      </p>

      <div className="flex flex-col gap-4 rounded-[20px] bg-sakura-bg p-4">
        <div className="flex gap-4">
          <KanjiGrande kanji={best.char} size={116} tone="white" />
          <div className="flex min-w-0 flex-col justify-center gap-2.5">
            <p className="font-voice text-[32px] leading-none text-ink">{kanji.meanings[0]}</p>
            <div className="flex flex-wrap gap-2">
              {on && <EtiquetaLectura variant="china" reading={stripMarks(on)} dentro />}
              {kun && <EtiquetaLectura variant="japonesa" reading={stripMarks(kun)} dentro />}
            </div>
            <p className="text-[15px] text-ink-3">{kanji.strokeCount} trazos</p>
          </div>
        </div>
        {sentence && (
          <div className="rounded-xl bg-paper px-4 py-3">
            <Furigana
              size={26}
              tokens={sentenceTokens(sentence).map((t) => ({
                text: t.text,
                reading: t.reading,
                showReading: !!t.level && !!t.reading && needsReading(t.level, level),
                highlight: t.text.includes(best.char),
              }))}
            />
            <p className="font-voice text-[18px] italic text-ink-3">{sentence.es}</p>
          </div>
        )}
      </div>

      {palabras.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-[18px] font-semibold text-ink">Con un kanji que ya sabes</h2>
          <ul className="flex flex-col gap-2">
            {palabras.map((w) => (
              <li key={w.written} className="flex items-center gap-2 rounded-2xl bg-tray px-3 py-3">
                <span className="flex gap-1.5">
                  {[...w.written].map((c, i) =>
                    c === best.char ? (
                      <CasillaKanji key={i} kanji={c} size="lg" state="empty" />
                    ) : HAN.test(c) ? (
                      <CasillaKanji key={i} kanji={c} size="lg" state="missed" />
                    ) : null,
                  )}
                </span>
                <span className="ml-1 flex flex-col">
                  <span className="text-[14px] leading-tight text-ink-3" style={{ fontFamily: 'var(--font-kanji)', letterSpacing: '0.12em' }}>
                    {w.reading}
                  </span>
                  <span className="font-voice text-[22px] leading-tight text-ink">{w.meaning}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-auto pt-4">
        {added ? (
          <p className="flex h-[52px] items-center justify-center text-[18px] font-medium text-ink-3">Está en tus repasos</p>
        ) : (
          <BotonPrincipal onClick={() => onAgregar(best.char)}>Agregar {best.char} a mis repasos</BotonPrincipal>
        )}
      </div>
    </>
  );
}
