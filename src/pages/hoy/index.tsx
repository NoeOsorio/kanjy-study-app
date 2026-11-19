import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bandeja, BotonPrincipal, CasillaKanji, EtiquetaLectura, Hoja, KanjiGrande, StickerSakura, Washi } from '../../design';
import { getKanji, loadLevel } from '../../data/levels';
import type { Kanji } from '../../data/types';
import { todayPlan } from '../../study/plan';
import type { TodayPlan } from '../../study/plan';
import { weekStickers } from '../../study/week';
import type { Sticker } from '../../study/week';
import { Repaso } from '../repaso/Repaso';
import { cleanReading } from '../kanji/parts';

interface Datos {
  plan: TodayPlan;
  /** Kanji de la lección actual, para la fila de casillas. */
  leccion: string[];
  /** Primer kanji por aprender. */
  primero: Kanji | null;
  semana: Sticker[];
}

async function cargar(): Promise<Datos> {
  const plan = await todayPlan();
  const file = await loadLevel(plan.level);
  const lesson = file.lessons.find((l) => l.number === plan.currentLesson) ?? file.lessons[0];
  const c = plan.newKanji[0] ?? (plan.isFirstDay ? lesson?.kanji[0] : undefined);
  const [primero, semana] = await Promise.all([c ? getKanji(c) : Promise.resolve(null), weekStickers()]);
  return { plan, leccion: lesson?.kanji ?? [], primero, semana };
}

const kanjiUrl = (c: string) => `/kanji/${encodeURIComponent(c)}`;

/** Hora del próximo repaso en palabras: «hoy a las 15:30», «mañana a las 9:00». */
function cuando(d: Date, ahora: Date): string {
  const hora = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  const dia = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const dif = Math.round((dia(d) - dia(ahora)) / 86400000);
  if (dif <= 0) return `hoy a las ${hora}`;
  if (dif === 1) return `mañana a las ${hora}`;
  const f = d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
  return `el ${f} a las ${hora}`;
}

export default function HoyPage() {
  const [datos, setDatos] = useState<Datos | null>(null);
  const navigate = useNavigate();
  const enRaiz = useLocation().pathname === '/';

  useEffect(() => {
    let alive = true;
    void cargar().then((d) => alive && setDatos(d));
    return () => {
      alive = false;
    };
  }, []);

  const p = datos?.plan;
  const aPaginaDeHoy = enRaiz && !!p && !p.isFirstDay && p.due.length === 0 && p.newKanji.length > 0;
  useEffect(() => {
    if (aPaginaDeHoy && p) navigate(kanjiUrl(p.newKanji[0]), { replace: true });
  }, [aPaginaDeHoy, p, navigate]);

  if (!datos || !p || aPaginaDeHoy) return <div className="flex-1" />;

  if (p.isFirstDay) return <PrimerDia d={datos} />;
  if (p.due.length > 0) return enRaiz ? <Repaso plan={p} /> : <HayRepasos n={p.due.length} />;
  if (p.newKanji.length > 0 && datos.primero) return <Pendiente d={datos} />;
  return <Tranquilo d={datos} />;
}

function Marco({ children, nivel }: { children: React.ReactNode; nivel?: string }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-h-[38px] items-center justify-between px-3.5 py-2">
        {nivel ? (
          <Link
            to="/indice"
            aria-label="Ver el índice de kanji"
            className="kj-press flex h-[40px] shrink-0 items-center gap-1 rounded-xl bg-tray pl-3 pr-2 text-[15px] font-bold text-ink"
          >
            {nivel}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
        <Link
          to="/cuenta"
          aria-label="Cuenta"
          className="kj-press flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-tray text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
          </svg>
        </Link>
      </div>
      <Hoja className="flex flex-1 flex-col gap-5">{children}</Hoja>
    </div>
  );
}

function PrimerDia({ d }: { d: Datos }) {
  const navigate = useNavigate();
  const k = d.primero;
  const c = k?.char ?? d.leccion[0] ?? '';
  const on = k?.onyomi[0] ? cleanReading(k.onyomi[0]) : '';
  const kun = k?.kunyomi[0] ? cleanReading(k.kunyomi[0]) : '';
  return (
    <Marco nivel={d.plan.level}>
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-voice text-[34px] leading-tight text-ink">Tus primeros kanji</h1>
        <p className="m-0 font-voice text-[17px] leading-snug text-ink-2">Los que más se usan en japonés. Unos 10 minutos.</p>
      </div>
      <Leccion d={d} />
      <section className="flex flex-col gap-4 rounded-[20px] bg-sakura-bg p-4">
        <div className="flex items-center gap-4">
          <KanjiGrande kanji={c} size={104} tone="white" className="!rounded-[20px]" />
          <div className="flex min-w-0 flex-col gap-2.5">
            <span className="font-voice text-[28px] leading-none text-ink">{k?.meanings[0]}</span>
            <div className="flex flex-wrap gap-2">
              {on && <EtiquetaLectura variant="china" label={on} dentro reading={on} className="!px-2.5 !py-1 !text-[16px]" />}
              {kun && <EtiquetaLectura variant="japonesa" dentro reading={kun} className="!px-2.5 !py-1 !text-[16px]" />}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-1.5" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] bg-paper shadow-[0_0_0_1px_#EBCBD6]">
              <span className="absolute inset-y-1.5 left-1/2 border-l border-dashed border-[#EBCBD6]" />
              <span className="absolute inset-x-1.5 top-1/2 border-t border-dashed border-[#EBCBD6]" />
              {i === 0 && (
                <span className="relative text-[40px] text-ink" style={{ fontFamily: 'var(--font-kanji)', lineHeight: 1, clipPath: 'inset(0 0 38% 0)' }}>
                  {c}
                </span>
              )}
            </span>
          ))}
        </div>
        <p className="m-0 font-voice text-[18px] leading-snug text-ink-2">Lo trazas con el dedo y mañana te lo volvemos a preguntar.</p>
      </section>
      <div className="flex items-center gap-4 px-1">
        <StickerSakura size={44} rotation={-8} />
        <p className="m-0 font-voice text-[18px] leading-snug text-ink-2">
          Cada día que estudias se gana un sticker. Si faltas, no pasa nada.
        </p>
      </div>
      <div className="mt-auto pt-2">
        <BotonPrincipal onClick={() => navigate(kanjiUrl(c))}>Empezar con {c}</BotonPrincipal>
      </div>
    </Marco>
  );
}

function Leccion({ d }: { d: Datos }) {
  const actual = d.primero?.char ?? d.leccion[0];
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Washi label="Hoy" rotation={-4} />
        <span className="text-[16px] font-semibold text-ink">Lección {d.plan.currentLesson ?? 1}</span>
      </div>
      <Bandeja className="!flex-nowrap gap-[3px] overflow-x-auto p-1.5">
        {d.leccion.map((c) => (
          <CasillaKanji key={c} kanji={c} size="sm" state={c === actual ? 'today' : 'pending'} />
        ))}
      </Bandeja>
    </section>
  );
}

/** Solo aparece fuera de «/» (el panel de hoy del escritorio): lo que sigue es aprender. */
function Pendiente({ d }: { d: Datos }) {
  const navigate = useNavigate();
  const c = d.primero!.char;
  return (
    <Marco>
      <Leccion d={d} />
      <div className="flex items-center gap-4">
        <KanjiGrande kanji={c} size={104} />
        <span className="font-voice text-[28px] leading-none text-ink">{d.primero!.meanings[0]}</span>
      </div>
      <div className="mt-auto pt-2">
        <BotonPrincipal onClick={() => navigate(kanjiUrl(c))}>Empezar con {c}</BotonPrincipal>
      </div>
    </Marco>
  );
}

function HayRepasos({ n }: { n: number }) {
  const navigate = useNavigate();
  return (
    <Marco>
      <h1 className="m-0 font-voice text-[34px] leading-tight text-ink">{n === 1 ? '1 repaso' : `${n} repasos`}</h1>
      <div className="mt-auto pt-2">
        <BotonPrincipal onClick={() => navigate('/repaso')}>Repasar</BotonPrincipal>
      </div>
    </Marco>
  );
}

function Tranquilo({ d }: { d: Datos }) {
  const navigate = useNavigate();
  const sig = d.plan.nextReviewAt;
  return (
    <Marco>
      <h1 className="m-0 font-voice text-[34px] leading-tight text-ink">
        {sig ? `Tu próximo repaso es ${cuando(sig, new Date())}` : 'Por hoy no hay nada más'}
      </h1>
      <div className="flex items-end justify-between rounded-[14px] bg-tray px-4 py-5">
        {d.semana.map((s, i) => {
          const hoy = i === d.semana.length - 1;
          return (
            <div key={i} className="flex w-10 flex-col items-center gap-2.5">
              <StickerSakura size={hoy ? 46 : 30} rotation={s.studied ? ((i * 37) % 24) - 12 : 0} empty={!s.studied} />
              <span className={`text-[13px] font-semibold ${hoy ? 'text-ink' : s.studied ? 'text-sakura-deep' : 'text-faded'}`}>{s.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-auto pt-2">
        <BotonPrincipal onClick={() => navigate('/indice')}>Ir al índice</BotonPrincipal>
      </div>
    </Marco>
  );
}
