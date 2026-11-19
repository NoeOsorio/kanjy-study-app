import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bandeja, Barra, BotonPrincipal, CasillaKanji, Hanamaru, Hoja, StickerSakura, Washi } from '../../design';
import { todayPlan } from '../../study/plan';
import { weekStickers } from '../../study/week';
import type { Sticker } from '../../study/week';
import { leerResumen } from '../repaso/resumen';

const FILAS = 'max-h-[176px] overflow-y-auto content-start';

export default function RepasoListoPage() {
  const navigate = useNavigate();
  const resumen = leerResumen();
  const [semana, setSemana] = useState<Sticker[] | null>(null);
  const [nuevo, setNuevo] = useState<string[] | null>(null);

  useEffect(() => {
    if (!resumen) navigate('/', { replace: true });
  }, [resumen, navigate]);
  useEffect(() => {
    let alive = true;
    void Promise.all([weekStickers(), todayPlan()]).then(([w, p]) => {
      if (!alive) return;
      setSemana(w);
      setNuevo(p.newKanji);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!resumen) return <div className="flex-1" />;
  const { summary, repasados } = resumen;
  const costaron = new Set(summary.costaron);
  const manana = [...summary.tomorrow.filter((c) => costaron.has(c)), ...summary.tomorrow.filter((c) => !costaron.has(c))];
  const n = nuevo?.length ?? 0;

  const irA = () => navigate(n > 0 && nuevo ? `/kanji/${encodeURIComponent(nuevo[0])}` : '/indice');

  return (
    <div className="flex flex-1 flex-col">
      <Barra kind="close" onClick={() => navigate('/indice')} />
      <Hoja className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-5 pt-1">
          <Hanamaru size={104}>{summary.reviewed}</Hanamaru>
          <div className="flex min-w-0 flex-col gap-1.5">
            <h1 className="m-0 font-voice text-[36px] leading-none text-ink">Listo por hoy</h1>
            <p className="m-0 text-[15px] text-ink-3">
              {summary.reviewed === 1 ? 'kanji repasado' : 'kanji repasados'}, {summary.minutes}{' '}
              {summary.minutes === 1 ? 'minuto' : 'minutos'}
            </p>
          </div>
        </div>

        {semana && (
          <div className="flex items-end justify-between rounded-[14px] bg-tray px-4 py-5">
            {semana.map((d, i) => {
              const hoy = i === semana.length - 1;
              return (
                <div key={i} className="flex w-10 flex-col items-center gap-2.5">
                  <StickerSakura size={hoy ? 46 : 30} rotation={d.studied ? ((i * 37) % 24) - 12 : 0} empty={!d.studied} land={hoy && d.studied} />
                  <span className={`text-[13px] font-semibold ${hoy ? 'text-ink' : d.studied ? 'text-sakura-deep' : 'text-faded'}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-[17px] font-semibold text-ink">Hoy repasaste</h2>
            {costaron.size > 0 && (
              <span className="rounded-lg bg-sakura-chip px-3 py-1.5 text-[14px] font-semibold text-sakura-deep">
                {costaron.size} te costaron
              </span>
            )}
          </div>
          <Bandeja className={FILAS}>
            {repasados.map((c) => (
              <CasillaKanji key={c} kanji={c} size="md" state={costaron.has(c) ? 'missed' : 'learned'} />
            ))}
          </Bandeja>
        </section>

        {manana.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <Washi label="Mañana" rotation={-3} />
              <span className="text-[17px] font-semibold text-ink">
                {manana.length} {manana.length === 1 ? 'repaso' : 'repasos'}
              </span>
            </div>
            <Bandeja className={FILAS}>
              {manana.map((c) => (
                <CasillaKanji key={c} kanji={c} size="md" state={costaron.has(c) ? 'missed' : 'pending'} />
              ))}
            </Bandeja>
          </section>
        )}

        <div className="mt-auto pt-2">
          <BotonPrincipal onClick={irA} disabled={nuevo === null}>
            {n > 0 ? `Aprender ${n} ${n === 1 ? 'kanji nuevo' : 'kanji nuevos'}` : 'Ir al índice'}
          </BotonPrincipal>
        </div>
      </Hoja>
    </div>
  );
}
