const PETALS = [0, 72, 144, 216, 288];

/** Sticker de flor sakura de cinco pétalos; `empty` es el día sin sticker. */
export function StickerSakura({
  size = 28,
  rotation = 0,
  empty = false,
  land = false,
}: {
  size?: number;
  rotation?: number;
  empty?: boolean;
  /** Aterriza con un giro suave al aparecer. */
  land?: boolean;
}) {
  if (empty) {
    return (
      <span
        aria-hidden
        className="inline-block shrink-0 rounded-full"
        style={{ width: size, height: size, border: '1.5px dashed #D9A9BA' }}
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      className={land ? 'kj-land' : undefined}
      style={{
        ['--rot' as string]: `${rotation}deg`,
        transform: `rotate(${rotation}deg)`,
        filter: 'drop-shadow(0 2px 3px rgba(120,40,70,0.28))',
        flexShrink: 0,
      }}
    >
      <g fill="#fff" stroke="#fff" strokeWidth="9" strokeLinejoin="round">
        {PETALS.map((a) => (
          <ellipse key={a} cx="50" cy="29" rx="19" ry="21" transform={`rotate(${a} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="12" />
      </g>
      <g fill="#F4A3B4">
        {PETALS.map((a) => (
          <ellipse key={a} cx="50" cy="29" rx="19" ry="21" transform={`rotate(${a} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill="#F7D46B" />
    </svg>
  );
}
