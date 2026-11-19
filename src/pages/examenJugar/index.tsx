import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Barra, BotonPrincipal, CirculoRojo, Furigana, HojaRespuestas, Hoja, Marcatextos } from '../../design';
import { needsReading } from '../../data/furigana';
import type { Level } from '../../data/types';
import type { RespuestaEstado } from '../../design/HojaRespuestas';
import { IconPlay } from '../../design/icons';
import { getKanji, loadLevel } from '../../data/levels';
import { getSettings } from '../../store/repo';
import { speak, useCanSpeak } from '../../sound';
import { buildQuestions } from '../../exam/questions';
import type { ExamAnswer, ExamQuestion, ExamSelection } from '../../exam/questions';

export default function ExamenJugarPage() {
  const sel = useLocation().state as ExamSelection | null;
  if (!sel || !sel.chars?.length) return <Navigate to="/examen" replace />;
  return <Jugar sel={sel} />;
}

function Jugar({ sel }: { sel: ExamSelection }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [nivel, setNivel] = useState<Level>('N5');
  const inicio = useRef(0);
  /** Milisegundos que tardó en responder la pregunta actual. */
  const tiempo = useRef(0);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const first = await getKanji(sel.chars[0]);
      const s = await getSettings();
      const file = await loadLevel(first?.level ?? s.level);
      if (!vivo) return;
      setNivel(s.level);
      const qs = buildQuestions(sel.mode, sel.chars, file);
      if (!qs.length) navigate('/examen', { replace: true });
      else setQuestions(qs);
    })();
    return () => {
      vivo = false;
    };
  }, [sel, navigate]);

  const i = answers.length;
  const q = questions?.[i];

  // El reloj de cada pregunta arranca cuando se ve.
  useEffect(() => {
    inicio.current = performance.now();
  }, [i, questions]);

  const items: RespuestaEstado[] = useMemo(
    () =>
      (questions ?? []).map((_, n) =>
        n < answers.length ? (answers[n].right ? 'right' : 'wrong') : n === answers.length ? 'current' : 'pending',
      ),
    [questions, answers],
  );
  // Al responder, la casilla actual ya muestra su marca.
  const shownItems = useMemo(() => {
    if (chosen === null || !q) return items;
    const r = [...items];
    r[i] = chosen === q.correct ? 'right' : 'wrong';
    return r;
  }, [items, chosen, q, i]);

  const responder = (n: number) => {
    if (!q || chosen !== null) return;
    tiempo.current = performance.now() - inicio.current;
    setChosen(n);
  };

  const siguiente = () => {
    if (!q || chosen === null || !questions) return;
    const hecho: ExamAnswer = {
      chosen,
      right: chosen === q.correct,
      ms: Math.round(tiempo.current),
    };
    const todas = [...answers, hecho];
    if (todas.length >= questions.length) {
      navigate('/examen/resultado', { replace: true, state: { sel, questions, answers: todas } });
      return;
    }
    setAnswers(todas);
    setChosen(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && chosen !== null) siguiente();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!questions || !q) {
    return (
      <div className="flex flex-1 flex-col">
        <Barra kind="close" onClick={() => navigate('/examen')} />
        <Hoja className="flex-1">
          <h1 className="sr-only">Examen</h1>
        </Hoja>
      </div>
    );
  }

  const ultima = i === questions.length - 1;
  const pistaOn = chosen !== null;

  return (
    <div className="flex flex-1 flex-col">
      <Barra kind="close" onClick={() => navigate('/examen')}>
        <div className="min-w-0 flex-1 rounded-xl bg-tray p-1 [&>div]:gap-1">
          <HojaRespuestas items={shownItems} />
        </div>
      </Barra>
      <Hoja className="flex flex-1 flex-col">
        <h1 className="text-center text-[18px] font-bold text-ink">{q.prompt}</h1>
        <div className="mt-3 flex justify-center">
          <Prompt q={q} />
        </div>

        <div className="mt-5 flex flex-col gap-2.5" role="group" aria-label="Respuestas">
          {q.options.map((o, n) => {
            const esCorrecta = n === q.correct;
            const esMia = chosen === n;
            const mal = chosen !== null && esMia && !esCorrecta;
            const marcarBien = chosen !== null && esCorrecta;
            return (
              <button
                key={o.text}
                type="button"
                disabled={chosen !== null}
                onClick={() => responder(n)}
                className="kj-press flex min-h-[60px] items-center justify-between gap-3 rounded-[14px] bg-paper px-5 text-left text-[22px] text-ink disabled:cursor-default"
                style={{
                  fontFamily: o.script === 'kanji' ? 'var(--font-kanji)' : 'var(--font-voice)',
                  boxShadow: esMia ? '0 0 0 2px var(--ink)' : '0 0 0 1px var(--rail)',
                }}
              >
                <span
                  className={mal ? 'text-faded' : undefined}
                  style={mal ? { textDecoration: 'line-through', textDecorationColor: 'var(--red-pen)', textDecorationThickness: 2 } : undefined}
                >
                  {o.text}
                </span>
                {marcarBien && (
                  <CirculoRojo>
                    <span className="block h-7 w-7" />
                  </CirculoRojo>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-5">
          {pistaOn && <Pista q={q} nivel={nivel} />}
          {pistaOn && (
            <BotonPrincipal onClick={siguiente} title="Enter">
              {ultima ? 'Ver resultado' : 'Siguiente'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 5 7 7-7 7" />
              </svg>
            </BotonPrincipal>
          )}
        </div>
      </Hoja>
    </div>
  );
}

function Prompt({ q }: { q: ExamQuestion }) {
  const size = 140;
  const kanjiSolo = [...q.shown.text].length === 1 && q.shown.script === 'kanji';
  const fs = kanjiSolo ? size * 0.68 : q.shown.script === 'voice' ? 32 : [...q.shown.text].length > 3 ? 36 : 48;
  const hayVoz = useCanSpeak();
  const sonar = q.speak && hayVoz ? () => speak(q.speak as string) : undefined;
  return (
    <div
      className="relative flex items-center justify-center rounded-[14px] bg-sakura-bg px-4 text-center text-ink"
      style={{
        width: kanjiSolo ? size : undefined,
        minWidth: size,
        height: size,
        maxWidth: '100%',
        fontFamily: q.shown.script === 'voice' ? 'var(--font-voice)' : 'var(--font-kanji)',
        fontSize: fs,
        lineHeight: 1.1,
      }}
    >
      {q.shown.text}
      {sonar && (
        <button
          type="button"
          onClick={sonar}
          aria-label="Escuchar"
          className="kj-press absolute -bottom-2 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink shadow-[0_0_0_1px_var(--rail),0_4px_10px_rgba(60,45,10,0.12)]"
        >
          <IconPlay size={16} />
        </button>
      )}
    </div>
  );
}

function Pista({ q, nivel }: { q: ExamQuestion; nivel: Level }) {
  const w = q.hint.word;
  return (
    <div className="rounded-xl bg-sakura-bg px-4 py-3">
      {w ? (
        <>
          {needsReading(w.level, nivel) ? (
            <Furigana tokens={[{ text: w.written, reading: w.reading, showReading: true }]} size={22} />
          ) : (
            <div className="text-[22px] text-ink" style={{ fontFamily: 'var(--font-kanji)', lineHeight: 1.6 }}>
              {[...w.written].map((ch, n) =>
                ch === q.char ? <Marcatextos key={n}>{ch}</Marcatextos> : <span key={n}>{ch}</span>,
              )}
            </div>
          )}
          <div className="font-voice text-[16px] text-ink-2">
            {needsReading(w.level, nivel) ? w.meaning : `${w.reading}, ${w.meaning}`}
          </div>
        </>
      ) : (
        <>
          <div className="text-[22px] text-ink" style={{ fontFamily: 'var(--font-kanji)', lineHeight: 1.6 }}>
            <Marcatextos>{q.char}</Marcatextos>
          </div>
          <div className="font-voice text-[16px] text-ink-2">{q.hint.meanings.join(', ')}</div>
        </>
      )}
    </div>
  );
}
