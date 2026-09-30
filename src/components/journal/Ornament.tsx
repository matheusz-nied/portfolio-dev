const STAR = "M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7Z";

/** Printer's ornament: a small star flanked by lozenges and fading rules. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 16"
      className={`cj-ornament ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {[
        [96, 60, 0.75],
        [58, 26, 0.4],
        [24, 4, 0.18],
      ].map(([from, to, o]) => (
        <g key={from} opacity={o}>
          <path d={`M${from} 8H${to}`} />
          <path d={`M${240 - from} 8H${240 - to}`} />
        </g>
      ))}
      <path d="M104 8l4-4 4 4-4 4z" opacity="0.8" />
      <path d="M128 8l4-4 4 4-4 4z" opacity="0.8" />
      <path d={STAR} transform="translate(120 8)" fill="currentColor" stroke="none" />
    </svg>
  );
}
