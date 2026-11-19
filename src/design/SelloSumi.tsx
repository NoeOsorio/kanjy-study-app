/** Sello rojo 済 de lección terminada. */
export function SelloSumi({ size = 34 }: { size?: number }) {
  return (
    <span
      aria-label="Terminada"
      className="inline-flex items-center justify-center rounded-full text-red-pen"
      style={{
        width: size,
        height: size,
        border: '1.5px solid var(--red-pen)',
        fontFamily: 'var(--font-kanji)',
        fontSize: size * 0.5,
        lineHeight: 1,
        transform: 'rotate(-12deg)',
      }}
    >
      済
    </span>
  );
}
