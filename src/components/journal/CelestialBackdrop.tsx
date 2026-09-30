const SPOKES = Array.from({ length: 12 }, (_, i) => i * 30);
const DOTS: [number, number, number][] = [
  [180, 260, 1.6],
  [520, 120, 1.2],
  [1380, 200, 1.8],
  [1210, 90, 1.2],
  [90, 720, 1.4],
  [1490, 640, 1.6],
  [300, 980, 1.2],
  [1300, 1040, 1.4],
];

/** Astrolabe rings turning behind the page. Fixed, faint, and hidden from assistive tech. */
export function CelestialBackdrop() {
  return (
    <div className="cj-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1600 1600" fill="none" stroke="currentColor">
        <g className="cj-backdrop-turn">
          {[250, 380, 520, 660, 780].map((r) => (
            <circle key={r} cx="800" cy="800" r={r} strokeWidth="1" />
          ))}
          <circle
            cx="800"
            cy="800"
            r="715"
            strokeWidth="16"
            pathLength="360"
            strokeDasharray="0.3 4.7"
            opacity="0.7"
          />
          <ellipse
            cx="800"
            cy="800"
            rx="660"
            ry="180"
            transform="rotate(-23.5 800 800)"
            strokeWidth="1"
          />
          {SPOKES.map((deg) => (
            <path
              key={deg}
              d="M800 20V550"
              strokeWidth="1"
              opacity="0.55"
              transform={`rotate(${deg} 800 800)`}
            />
          ))}
        </g>
        {DOTS.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="currentColor" stroke="none" />
        ))}
      </svg>
    </div>
  );
}
