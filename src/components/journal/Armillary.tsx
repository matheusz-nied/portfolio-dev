/** An armillary sphere drawn in hairlines. Rings turn slowly (CSS); colour is currentColor. */
const STAR = "M0 -10 Q0 0 10 0 Q0 0 0 10 Q0 0 -10 0 Q0 0 0 -10Z";

export function Armillary({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`cj-armillary ${className}`}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {/* graduated limb: a degree scale between two rings */}
      <circle cx="200" cy="200" r="188" strokeWidth="0.9" />
      <circle cx="200" cy="200" r="174" strokeWidth="0.9" opacity="0.55" />
      <circle
        cx="200"
        cy="200"
        r="181"
        strokeWidth="11"
        pathLength="360"
        strokeDasharray="0.28 4.72"
        opacity="0.42"
      />
      <circle
        cx="200"
        cy="200"
        r="181"
        strokeWidth="14"
        pathLength="360"
        strokeDasharray="0.5 29.5"
        opacity="0.75"
      />

      {/* axes */}
      <path d="M200 26V374M26 200H374" strokeWidth="0.6" opacity="0.4" />

      {/* fixed tilted equator */}
      <ellipse
        cx="200"
        cy="200"
        rx="168"
        ry="44"
        transform="rotate(-23.5 200 200)"
        strokeWidth="1.1"
      />

      {/* two colures, turning about the polar axis */}
      <ellipse className="cj-arm-ring cj-arm-ring-a" cx="200" cy="200" rx="150" ry="150" strokeWidth="1.2" />
      <g transform="rotate(58 200 200)">
        <ellipse className="cj-arm-ring cj-arm-ring-b" cx="200" cy="200" rx="150" ry="150" strokeWidth="1" opacity="0.8" />
      </g>

      {/* inner orbit and its wanderer */}
      <circle cx="200" cy="200" r="112" strokeWidth="0.9" strokeDasharray="1 5" opacity="0.7" />
      <g className="cj-arm-orbit">
        <circle cx="312" cy="200" r="4.5" fill="currentColor" stroke="none" />
      </g>

      {/* the earth, at the centre of all things */}
      <circle cx="200" cy="200" r="17" strokeWidth="1.2" fill="currentColor" fillOpacity="0.14" />
      <ellipse cx="200" cy="200" rx="17" ry="6" strokeWidth="0.8" />
      <path d="M200 183V217" strokeWidth="0.8" />

      {/* cardinal stars */}
      {[
        [200, 14],
        [200, 386],
        [14, 200],
        [386, 200],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={STAR} transform={`translate(${x} ${y})`} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}
