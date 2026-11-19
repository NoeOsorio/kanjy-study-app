import type { ReactNode } from 'react';
import {
  Bandeja, Barra, BotonPrincipal, BotonSecundario, CasillaKanji, CirculoRojo, EtiquetaLectura,
  FilaDatos, Furigana, Hanamaru, Hoja, HojaRespuestas, KanjiGrande, Marcatextos, NotaPropia,
  SelloSumi, StickerSakura, Washi,
} from './index';
import { IconLapiz } from './icons';

function Grupo({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <div className="mb-7 break-inside-avoid">
      <h2 className="mb-2 px-1 text-[12px] font-semibold text-ink-3">{nombre}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Fila({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

const PALETA: Array<[string, string]> = [
  ['paper', '#FFFFFF'], ['tray', '#FBF2F5'], ['rail', '#F2E1E7'], ['wine', '#A8325A'],
  ['ink', '#1D1B18'], ['ink-2', '#4A463F'], ['ink-3', '#6B665C'], ['faded', '#B8A9AF'],
  ['sakura', '#FDF0F3'], ['sakura chip', '#FBE4EA'], ['sakura ink', '#C2456A'], ['sakura deep', '#9E2A44'],
  ['china', '#CADDFF'], ['japonesa', '#BDEBD6'], ['marcatextos', '#FFE08A'], ['pluma roja', '#C8402F'],
  ['N4', '#FFE08A'], ['N3', '#BDEBD6'], ['N2', '#CADDFF'], ['N1', '#E3D5FF'],
];

function Contenido() {
  return (
    <>
      <Grupo nombre="Color">
        <div className="grid grid-cols-4 gap-1.5">
          {PALETA.map(([n, c]) => (
            <div key={n} className="rounded-lg p-2 text-[11px] text-ink" style={{ background: c, boxShadow: '0 0 0 1px var(--rail)' }}>
              <span style={{ color: ['wine', 'ink', 'ink-2', 'ink-3', 'pluma roja', 'sakura deep'].includes(n) ? '#fff' : undefined }}>{n}</span>
            </div>
          ))}
        </div>
      </Grupo>

      <Grupo nombre="Tipografía">
        <div className="rounded-[14px] bg-tray p-4">
          <p className="m-0 text-[17px] font-semibold">Geist para la interfaz</p>
          <p className="m-0 text-[22px]" style={{ fontFamily: 'var(--font-voice)' }}>Newsreader para el español con voz</p>
          <p className="m-0 text-[28px]" style={{ fontFamily: 'var(--font-kanji)' }}>国語 こくご カタカナ</p>
        </div>
      </Grupo>

      <Grupo nombre="Barra">
        <div className="rounded-[14px] bg-paper shadow-[var(--shadow-sheet)]"><Barra kind="back" label="Índice" title="Atajo: Esc"><StickerSakura size={22} /><StickerSakura size={22} /><StickerSakura size={22} empty /></Barra></div>
        <div className="rounded-[14px] bg-paper shadow-[var(--shadow-sheet)]"><Barra kind="close" /></div>
      </Grupo>

      <Grupo nombre="Hoja y bandeja">
        <Hoja className="!mx-0">
          <Bandeja>
            <CasillaKanji kanji="日" /><CasillaKanji kanji="国" /><CasillaKanji kanji="人" />
          </Bandeja>
        </Hoja>
      </Grupo>

      <Grupo nombre="Casilla de kanji">
        <Bandeja className="items-center">
          <CasillaKanji kanji="国" size="sm" /><CasillaKanji kanji="国" size="md" /><CasillaKanji kanji="国" size="lg" />
          <CasillaKanji kanji="国" size="lg" state="today"><IconLapiz size={20} /></CasillaKanji>
          <CasillaKanji kanji="国" size="lg" state="pending" />
          <CasillaKanji kanji="国" size="lg" state="missed" />
          <CasillaKanji size="lg" state="empty" />
        </Bandeja>
      </Grupo>

      <Grupo nombre="Kanji grande">
        <Fila>
          <KanjiGrande kanji="国" onPlay={() => {}} />
          <KanjiGrande kanji="猫" size={96} tone="white" />
        </Fila>
      </Grupo>

      <Grupo nombre="Etiquetas de lectura">
        <EtiquetaLectura variant="china" label="china" reading="コク" />
        <EtiquetaLectura variant="japonesa" label="japonesa" reading="くに" />
        <Fila><EtiquetaLectura variant="china" reading="ビョウ" dentro /><EtiquetaLectura variant="japonesa" reading="ねこ" dentro /></Fila>
      </Grupo>

      <Grupo nombre="Datos">
        <FilaDatos dificultad={1} chips={['Fácil', 'Muy común', '2.º de primaria', '8 trazos']} />
        <FilaDatos dificultad={3} chips={['Difícil', '14 trazos']} />
      </Grupo>

      <Grupo nombre="Furigana y marcatextos">
        <div className="rounded-[14px] bg-sakura-bg p-4">
          <Furigana tokens={[{ text: 'いつか' }, { text: '外国', reading: 'がいこく', highlight: true }, { text: 'に住みたい。' }]} />
          <p className="m-0 text-[17px] text-ink-2" style={{ fontFamily: 'var(--font-voice)' }}>Algún día quiero vivir en el extranjero.</p>
        </div>
        <div className="rounded-[14px] bg-paper p-4 shadow-[0_0_0_1px_var(--rail)]">
          <Furigana tokens={[
            { text: '猫', reading: 'ねこ', showReading: true, highlight: true },
            { text: 'が' },
            { text: '好', reading: 'す', showReading: true },
            { text: 'きです。' },
          ]} />
          <div className="mt-1 text-[22px]" style={{ fontFamily: 'var(--font-kanji)' }}>日本<Marcatextos>語</Marcatextos></div>
        </div>
      </Grupo>

      <Grupo nombre="Papelería">
        <Fila>
          <Washi label="Hoy" /><Washi label="Mañana" rotation={2} /><Washi label="Para empezar" />
          <SelloSumi />
        </Fila>
        <Fila>
          <StickerSakura size={28} /><StickerSakura size={28} rotation={20} /><StickerSakura size={40} rotation={-12} /><StickerSakura size={28} empty />
        </Fila>
      </Grupo>

      <Grupo nombre="Hanamaru y círculo rojo">
        <Fila>
          <Hanamaru size={120}>24</Hanamaru>
          <Hanamaru size={80} soft />
          <CirculoRojo><span className="text-[20px]" style={{ fontFamily: 'var(--font-voice)' }}>idioma</span></CirculoRojo>
        </Fila>
      </Grupo>

      <Grupo nombre="Nota propia">
        <NotaPropia onEdit={() => {}}>Un rey 王 cuidado dentro de su muralla 囗.</NotaPropia>
      </Grupo>

      <Grupo nombre="Hoja de respuestas">
        <HojaRespuestas items={['right', 'right', 'wrong', 'right', 'current', 'pending', 'pending', 'pending']} />
      </Grupo>

      <Grupo nombre="Botones">
        <BotonPrincipal icon={<IconLapiz size={20} />}>Escribir de memoria</BotonPrincipal>
        <BotonPrincipal disabled>Empezar</BotonPrincipal>
        <Fila><BotonSecundario>Examen</BotonSecundario><BotonSecundario disabled>Examen</BotonSecundario></Fila>
      </Grupo>
    </>
  );
}

export default function ComponentSheet() {
  return (
    <div className="min-h-screen bg-paper pb-16">
      <div className="mx-auto w-[375px] px-4 pt-6" data-sheet="movil">
        <Contenido />
      </div>
      <div className="mx-auto mt-16 max-w-[1200px] px-8" data-sheet="escritorio">
        <div className="columns-3 gap-8">
          <Contenido />
        </div>
      </div>
    </div>
  );
}
