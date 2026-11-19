import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Barra, EtiquetaLectura, Hoja, Marcatextos } from '../../design';
import { useStrokes } from '../kanji/strokes';

function Baldosa({ children, sakura }: { children: ReactNode; sakura?: boolean }) {
  return (
    <div
      className={`relative flex h-[72px] w-[104px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl shadow-[0_0_0_1px_var(--rail)] ${
        sakura ? 'bg-sakura-bg' : 'bg-paper'
      }`}
    >
      {children}
    </div>
  );
}

function PasosDeHi() {
  const paths = useStrokes('日');
  return (
    <div className="flex gap-0.5">
      {paths.map((_, i) => (
        <svg key={i} viewBox="0 0 109 109" aria-hidden className="h-[20px] w-[20px]" fill="none" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
          {paths.slice(0, i + 1).map((d, j) => (
            <path key={j} d={d} stroke={j === i ? 'var(--red-pen)' : 'var(--ink)'} />
          ))}
        </svg>
      ))}
    </div>
  );
}

function Fuente({
  visual,
  titulo,
  children,
}: {
  visual: ReactNode;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-3.5 rounded-[20px] bg-tray p-3">
      {visual}
      <div className="min-w-0 flex-1">
        <h2 className="text-[18px] font-semibold leading-tight text-ink">{titulo}</h2>
        <p className="mt-1 text-[15px] leading-snug text-ink-3">{children}</p>
      </div>
    </li>
  );
}

const enlace = 'underline decoration-rail underline-offset-2 hover:decoration-ink-3';

export default function CreditosPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col">
      <div className="md:hidden">
        <Barra kind="back" onClick={() => navigate(-1)} />
      </div>
      <Hoja centrada className="flex-1">
        <h1 className="font-voice text-[32px] leading-tight text-ink">De dónde salen los kanji</h1>
        <p className="mt-3 font-voice text-[22px] leading-snug text-ink-2">
          Diccionarios abiertos. Gracias a quienes los mantienen.
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          <Fuente
            titulo="Niveles N5 a N1"
            visual={
              <Baldosa sakura>
                <span className="absolute top-1 right-1 rounded-md bg-paper px-1 text-[11px] font-semibold text-sakura-deep">N5</span>
                <span className="text-[34px] leading-none text-sakura-deep" style={{ fontFamily: 'var(--font-kanji)' }}>日</span>
              </Baldosa>
            }
          >
            Listas de Jonathan Waller, vía{' '}
            <a className={enlace} href="https://github.com/davidluzgouveia/kanji-data" target="_blank" rel="noreferrer">kanji-data</a>
            . Listas no oficiales desde 2010.
          </Fuente>
          <Fuente
            titulo="Significados y lecturas"
            visual={
              <Baldosa>
                <span className="font-voice text-[17px] italic text-ink">día, sol</span>
                <span className="flex gap-2">
                  <EtiquetaLectura variant="china" dentro reading="ニチ" className="!px-2 !py-0.5 !text-[12px] !rounded-md" />
                  <EtiquetaLectura variant="japonesa" dentro reading="ひ" className="!px-2 !py-0.5 !text-[12px] !rounded-md" />
                </span>
              </Baldosa>
            }
          >
            <a className={enlace} href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" target="_blank" rel="noreferrer">KANJIDIC2</a>
            , del EDRDG, licencia{' '}
            <a className={enlace} href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.
          </Fuente>
          <Fuente
            titulo="Palabras y frases"
            visual={
              <Baldosa>
                <span className="text-[20px] leading-none text-ink" style={{ fontFamily: 'var(--font-kanji)' }}>
                  <Marcatextos>日</Marcatextos>曜<Marcatextos>日</Marcatextos>
                </span>
                <span className="font-voice text-[15px] italic text-ink-2">domingo</span>
              </Baldosa>
            }
          >
            <a className={enlace} href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noreferrer">JMdict</a>
            {' '}en español, del EDRDG, licencia{' '}
            <a className={enlace} href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
            . Frases de{' '}
            <a className={enlace} href="https://tatoeba.org" target="_blank" rel="noreferrer">Tatoeba</a>
            , licencia{' '}
            <a className={enlace} href="https://creativecommons.org/licenses/by/2.0/fr/" target="_blank" rel="noreferrer">CC BY 2.0 FR</a>.
          </Fuente>
          <Fuente
            titulo="Orden de trazos"
            visual={
              <Baldosa>
                <PasosDeHi />
              </Baldosa>
            }
          >
            <a className={enlace} href="https://kanjivg.tagaini.net" target="_blank" rel="noreferrer">KanjiVG</a>
            , de Ulrich Apel, licencia{' '}
            <a className={enlace} href="https://creativecommons.org/licenses/by-sa/3.0/deed.es" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>.
          </Fuente>
        </ul>
      </Hoja>
    </div>
  );
}
