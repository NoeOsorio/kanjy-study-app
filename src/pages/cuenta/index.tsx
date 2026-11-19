import { useEffect, useState } from 'react';
import Cargando from '../../app/Cargando';
import { Link, useNavigate } from 'react-router-dom';
import { Barra, CasillaKanji, Hoja } from '../../design';
import { loadLevel } from '../../data/levels';
import type { Level } from '../../data/types';
import { useHasVoice } from '../../sound';
import { allCards, getSettings, newKanjiPerDay, putSettings } from '../../store/repo';
import type { Settings } from '../../store/types';

const MINUTES: Settings['minutesPerDay'][] = [5, 10, 20, 30];

/** Aprendido = ya pasó de Learning (Review o Relearning). */
function esAprendido(state: unknown): boolean {
  return state === 2 || state === 3 || state === 'Review' || state === 'Relearning';
}

function Interruptor({
  on,
  onChange,
  label,
  disabled,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`kj-press relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors duration-150 ease-[ease] disabled:cursor-not-allowed ${
        on && !disabled ? 'bg-wine' : 'bg-rail'
      }`}
    >
      <span
        className="absolute top-[3px] left-[3px] h-6 w-6 rounded-full bg-white shadow-sm"
        style={{
          transform: on && !disabled ? 'translateX(20px)' : 'none',
          transition: 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      />
    </button>
  );
}

function Fila({
  glifo,
  fondo,
  tinta,
  titulo,
  detalle,
  children,
}: {
  glifo: string;
  fondo: string;
  tinta: string;
  titulo: string;
  detalle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[60px] items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[22px] leading-none"
        style={{ background: fondo, color: tinta, fontFamily: 'var(--font-kanji)' }}
      >
        {glifo}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[18px] font-medium leading-tight text-ink">{titulo}</div>
        {detalle && <div className="text-[15px] leading-snug text-ink-3">{detalle}</div>}
      </div>
      {children}
    </div>
  );
}

export default function CuentaPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [name, setName] = useState('');
  const [aprendidos, setAprendidos] = useState(0);
  const [proximos, setProximos] = useState<string[]>([]);
  const [cards, setCards] = useState<Set<string>>(new Set());
  const [orden, setOrden] = useState<{ level: Level; chars: string[] } | null>(null);
  const voz = useHasVoice();

  useEffect(() => {
    void getSettings().then((s) => {
      setSettings(s);
      setName(s.name ?? '');
    });
    void allCards().then((cs) => {
      setAprendidos(cs.filter((c) => esAprendido((c.fsrs as { state?: unknown }).state)).length);
      setCards(new Set(cs.map((c) => c.char)));
    });
  }, []);

  const level = settings?.level;
  useEffect(() => {
    if (!level) return;
    let vivo = true;
    void loadLevel(level).then((f) => {
      if (vivo) setOrden({ level, chars: f.lessons.flatMap((l) => l.kanji) });
    });
    return () => {
      vivo = false;
    };
  }, [level]);

  const minutos = settings?.minutesPerDay ?? 10;
  const n = newKanjiPerDay(minutos);
  useEffect(() => {
    if (!orden) return;
    setProximos(orden.chars.filter((c) => !cards.has(c)).slice(0, n));
  }, [orden, cards, n]);

  const guardar = (patch: Partial<Settings>) => {
    setSettings((s) => (s ? { ...s, ...patch } : s));
    void putSettings(patch);
  };

  if (!settings) return <Cargando />;

  return (
    <div className="flex flex-1 flex-col">
      <div className="lg:hidden">
        <Barra kind="back" onClick={() => navigate(-1)} />
      </div>
      <Hoja className="flex flex-1 flex-col gap-6">
        <h1 className="sr-only">Cuenta</h1>
        <section className="rounded-[20px] bg-tray p-4">
          <label htmlFor="nombre" className="block pl-1 text-[13px] tracking-[0.3em] text-sakura-ink" style={{ fontFamily: 'var(--font-kanji)' }}>
            なまえ
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              id="nombre"
              value={name}
              maxLength={40}
              autoComplete="off"
              placeholder="Tu nombre"
              onChange={(e) => setName(e.target.value)}
              onBlur={() => guardar({ name: name.trim() })}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="h-[50px] min-w-0 flex-1 rounded-xl bg-paper px-4 font-voice text-[26px] text-ink shadow-[0_0_0_1px_var(--rail)] outline-none focus-visible:shadow-[0_0_0_2px_var(--wine)]"
            />
            <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl bg-paper text-[15px] font-semibold text-sakura-deep shadow-[0_0_0_1px_var(--rail)]">
              {settings.level}
            </span>
          </div>
          <p className="mt-3 pl-1 text-[15px] text-ink-2">
            <span className="mr-1.5 font-voice text-[26px] text-ink">{aprendidos}</span>
            {aprendidos === 1 ? 'kanji aprendido' : 'kanji aprendidos'}
          </p>
        </section>

        <section>
          <h2 className="text-[18px] font-semibold text-ink">Tiempo al día</h2>
          <div role="radiogroup" aria-label="Tiempo al día" className="mt-3 grid grid-cols-4 gap-0.5 rounded-xl bg-tray p-1">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={m === minutos}
                onClick={() => guardar({ minutesPerDay: m })}
                className={`kj-press h-10 rounded-[10px] text-[16px] transition-colors duration-150 ${
                  m === minutos ? 'bg-paper font-semibold text-ink shadow-[0_0_0_1px_var(--rail)]' : 'text-ink-2'
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
          <div className="mt-3 flex min-h-[44px] items-center gap-2.5">
            <span className="flex gap-1.5">
              {proximos.map((c) => (
                <CasillaKanji key={c} kanji={c} size="sm" state="today" />
              ))}
            </span>
            <p className="font-voice text-[19px] leading-tight text-ink-2">
              {n === 1 ? '1 kanji nuevo y tus repasos.' : `${n} kanji nuevos y tus repasos.`}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-1">
          <Fila glifo="書" fondo="var(--sakura-chip)" tinta="var(--sakura-deep)" titulo="Practicar escritura" detalle="Escribir cada kanji a mano">
            <Interruptor on={settings.writing} onChange={(v) => guardar({ writing: v })} label="Practicar escritura" />
          </Fila>
          <Fila
            glifo="音"
            fondo="var(--china-bg)"
            tinta="var(--china-ink)"
            titulo="Sonido"
            detalle={voz ? 'Oír cada lectura y frase' : 'Este dispositivo no tiene voz en japonés.'}
          >
            <Interruptor on={settings.sound} onChange={(v) => guardar({ sound: v })} label="Sonido" disabled={!voz} />
          </Fila>
          <Link to="/creditos" className="kj-press block">
            <Fila glifo="本" fondo="var(--japonesa-bg)" tinta="var(--japonesa-ink)" titulo="De dónde salen los kanji">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Fila>
          </Link>
        </section>
      </Hoja>
    </div>
  );
}
