import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Barra, BotonPrincipal, BotonSecundario, CasillaKanji, Hanamaru, Hoja, StickerSakura, PaginaDerecha, PaginaIzquierda } from '../../design';
import { getKanji } from '../../data/levels';
import type { Kanji } from '../../data/types';
import { allCards, markStudyDay, putCard } from '../../store/repo';
import { newCard } from '../../store/scheduler';
import { score } from '../../exam/questions';
import type { ExamAnswer, ExamQuestion, ExamSelection } from '../../exam/questions';

interface Estado {
  sel: ExamSelection;
  questions: ExamQuestion[];
  answers: ExamAnswer[];
}

export default function ExamenResultadoPage() {
  const st = useLocation().state as Estado | null;
  if (!st?.questions?.length || st.answers?.length !== st.questions.length) return <Navigate to="/examen" replace />;
  return <Resultado st={st} />;
}

const seg = (ms: number) => `${Math.max(1, Math.round(ms / 1000))} s`;

function Resultado({ st }: { st: Estado }) {
  const navigate = useNavigate();
  const { questions, answers, sel } = st;
  const puntos = score(answers);
  const stickers = puntos >= 90 ? 3 : puntos >= 60 ? 2 : puntos >= 30 ? 1 : 0;
  const promedio = answers.reduce((s, a) => s + a.ms, 0) / answers.length;
  const falladas = questions.map((q, n) => ({ q, a: answers[n] })).filter((x) => !x.a.right);

  const [kanji, setKanji] = useState<Record<string, Kanji>>({});
  const [enRepasos, setEnRepasos] = useState<Set<string>>(new Set());

  useEffect(() => {
    let vivo = true;
    void markStudyDay();
    (async () => {
      const [cards, ks] = await Promise.all([allCards(), Promise.all(falladas.map((f) => getKanji(f.q.char)))]);
      if (!vivo) return;
      setEnRepasos(new Set(cards.map((c) => c.char)));
      const m: Record<string, Kanji> = {};
      for (const k of ks) if (k) m[k.char] = k;
      setKanji(m);
    })();
    return () => {
      vivo = false;
    };
    // Solo al abrir la pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const repasar = async (char: string) => {
    await putCard(newCard(char, 'exam'));
    setEnRepasos((p) => new Set(p).add(char));
  };

  return (
    <div className="flex flex-1 flex-col">
      <Barra kind="close" onClick={() => navigate('/indice')}>
        <span
          title="Tiempo medio por pregunta"
          className="flex h-[38px] items-center gap-1.5 rounded-lg bg-tray px-3 text-[15px] font-semibold text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          {seg(promedio)}
        </span>
      </Barra>
      <Hoja doble className="flex flex-1 flex-col">
        <h1 className="sr-only">Resultado</h1>
        <PaginaIzquierda className="xl:items-center">
        <div className="relative mx-auto mt-2 h-[240px] w-[260px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Hanamaru size={210} spiral={false} draw>
              <span className="flex items-baseline" style={{ fontSize: 78 }}>
                {puntos}
                <span style={{ fontSize: 30, marginLeft: 4 }}>点</span>
              </span>
            </Hanamaru>
          </div>
          {stickers >= 1 && (
            <span className="absolute left-0 top-2">
              <StickerSakura size={36} rotation={-14} land />
            </span>
          )}
          {stickers >= 2 && (
            <span className="absolute right-3 top-0">
              <StickerSakura size={28} rotation={12} land />
            </span>
          )}
          {stickers >= 3 && (
            <span className="absolute bottom-4 right-1">
              <StickerSakura size={32} rotation={8} land />
            </span>
          )}
        </div>

        <ul className="mx-auto mt-4 grid max-w-full grid-cols-5 gap-1.5 rounded-[14px] bg-tray p-1.5" aria-label="Tus respuestas">
          {questions.map((q, n) => {
            const a = answers[n];
            return (
              <li
                key={q.id}
                title={seg(a.ms)}
                className="relative flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-paper text-[26px] shadow-[0_0_0_1px_var(--rail)]"
                style={{ fontFamily: 'var(--font-kanji)', lineHeight: 1 }}
              >
                {q.char}
                {a.right ? (
                  <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full p-0.5" fill="none" stroke="var(--red-pen)" strokeWidth="1.6" aria-label="Correcta">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full p-1" fill="none" stroke="var(--red-pen)" strokeWidth="1.8" strokeLinecap="round" aria-label="Incorrecta">
                    <path d="M4 20 20 4" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>

        </PaginaIzquierda>
        <PaginaDerecha className="xl:gap-0">
        {falladas.length > 0 && (
          <div className="mt-4 flex flex-col gap-2.5 xl:mt-0">
            {falladas.map(({ q, a }) => {
              const k = kanji[q.char];
              const mia = q.options[a.chosen]?.text;
              const ya = enRepasos.has(q.char);
              return (
                <div key={q.id} className="flex items-center gap-3 rounded-xl bg-sakura-bg px-4 py-3">
                  <CasillaKanji kanji={q.char} size="lg" state="empty" />
                  <div className="min-w-0 flex-1">
                    <div className="font-voice text-[18px] leading-snug text-ink">
                      {(k?.meanings ?? q.hint.meanings).slice(0, 2).join(', ')}
                    </div>
                    <div className="flex items-baseline gap-2 font-voice text-[16px] leading-snug text-faded">
                      <span className="truncate" style={{ textDecoration: 'line-through', textDecorationColor: 'var(--red-pen)' }}>{mia}</span>
                      <span className="shrink-0 text-[13px] text-ink-3" style={{ fontFamily: 'var(--font-ui)' }}>{seg(a.ms)}</span>
                    </div>
                  </div>
                  {ya ? (
                    <span className="shrink-0 text-[14px] font-medium text-ink-3">En mis repasos</span>
                  ) : (
                    <BotonSecundario onClick={() => void repasar(q.char)} className="!h-10 shrink-0">
                      + Repasar
                    </BotonSecundario>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="sticky bottom-0 mt-auto bg-paper pb-1 pt-6">
          <BotonPrincipal
            onClick={() => navigate('/examen/jugar', { replace: true, state: { chars: sel.chars, mode: sel.mode } })}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            }
          >
            Otra vez
          </BotonPrincipal>
        </div>
        </PaginaDerecha>
      </Hoja>
    </div>
  );
}
