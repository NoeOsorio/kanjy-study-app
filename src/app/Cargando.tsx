/** Esqueleto de carga: hoja con casilla de kanji, líneas de texto y bandejas. Pulso muy suave. */
export default function Cargando() {
  const barra = 'rounded-[10px] bg-rail/60';
  return (
    <div role="status" aria-label="Cargando" className="cargando flex flex-1 flex-col gap-6 px-5 pb-8 pt-4">
      <style>{`
        @keyframes cargando-pulso { 0%,100% { opacity: .6 } 50% { opacity: 1 } }
        .cargando-bloque { animation: cargando-pulso 1.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .cargando-bloque { animation: none; } }
      `}</style>
      <div className="cargando-bloque flex items-center justify-between">
        <div className={`h-[38px] w-[84px] ${barra}`} />
        <div className="h-[20px] w-[120px] rounded-full bg-rail/60" />
      </div>
      <div className="cargando-bloque flex gap-4">
        <div className="size-[116px] shrink-0 rounded-[24px] bg-sakura-chip/60" />
        <div className="flex flex-1 flex-col gap-3 pt-1">
          <div className={`h-[30px] w-[120px] ${barra}`} />
          <div className={`h-[22px] w-[150px] ${barra}`} />
          <div className={`h-[22px] w-[120px] ${barra}`} />
        </div>
      </div>
      <div className="cargando-bloque flex flex-col gap-3">
        <div className={`h-[22px] w-full ${barra}`} />
        <div className={`h-[22px] w-[85%] ${barra}`} />
        <div className={`h-[22px] w-[70%] ${barra}`} />
      </div>
      <div className="cargando-bloque flex flex-col gap-5">
        <div className="h-[106px] rounded-[24px] bg-rail/60" />
        <div className="h-[90px] rounded-[24px] bg-rail/60" />
      </div>
    </div>
  );
}
