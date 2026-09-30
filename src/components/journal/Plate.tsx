import { useId, type ReactNode } from "react";
import { toRoman } from "@/lib/roman";

/**
 * Engraved "plates": hairline diagrams from Renaissance treatises, drawn in currentColor
 * with halftone dots and hatching. Each entry gets one by number, so the index and the
 * entry page always show the same figure.
 */

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;

export const PLATE_CAPTIONS = [
  "Sphaera armillaris",
  "Mysterium cosmographicum",
  "Perspectiva pingendi",
  "Astrolabium",
  "Sectio aurea",
  "Uranometria",
];

/** 1..5 for entries; 0 is reserved for the hero plate. */
export function plateVariantFor(entryNumber: number) {
  return 1 + (Math.max(1, entryNumber) - 1) % (PLATE_CAPTIONS.length - 1);
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function polygon(sides: number, radius: number, rotation: number) {
  return Array.from({ length: sides }, (_, i) => {
    const a = rotation + (i * TAU) / sides;
    return `${(200 + radius * Math.cos(a)).toFixed(2)},${(200 + radius * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

function Rays() {
  const random = rng(7);
  return (
    <g className="cj-plate-turn">
      {Array.from({ length: 120 }, (_, i) => {
        const a = (i * TAU) / 120;
        const inner = 108;
        const outer = 150 + 42 * Math.abs(Math.sin(i * 1.7)) + 14 * random();
        return (
          <path
            key={i}
            d={`M${(200 + inner * Math.cos(a)).toFixed(2)} ${(200 + inner * Math.sin(a)).toFixed(2)}L${(200 + outer * Math.cos(a)).toFixed(2)} ${(200 + outer * Math.sin(a)).toFixed(2)}`}
            strokeWidth="0.9"
          />
        );
      })}
      <circle cx="200" cy="200" r="102" strokeWidth="1" />
      <circle cx="200" cy="200" r="196" strokeWidth="0.8" opacity="0.6" />
    </g>
  );
}

function Kepler() {
  const shapes: ReactNode[] = [];
  let r = 176;
  shapes.push(<circle key="c0" cx="200" cy="200" r={r} strokeWidth="1.2" />);
  [3, 4, 5, 6, 8].forEach((sides, i) => {
    const rotation = -Math.PI / 2 + (i % 2 ? Math.PI / sides : 0);
    shapes.push(<polygon key={`p${i}`} points={polygon(sides, r, rotation)} strokeWidth="1" />);
    r *= Math.cos(Math.PI / sides);
    shapes.push(<circle key={`c${i + 1}`} cx="200" cy="200" r={r} strokeWidth="1" opacity="0.85" />);
  });
  return (
    <g>
      {shapes}
      <path d="M200 20V380M20 200H380" strokeWidth="0.5" opacity="0.4" />
      {[176, 120, 84, 60].map((rad, i) => (
        <circle
          key={rad}
          cx={200 + rad * Math.cos(i * 1.9)}
          cy={200 + rad * Math.sin(i * 1.9)}
          r="3.4"
          fill="currentColor"
          stroke="none"
        />
      ))}
    </g>
  );
}

function Perspective() {
  const horizon = 150;
  const vanishing = 200;
  return (
    <g>
      <path d={`M0 ${horizon}H400`} strokeWidth="1.2" />
      {Array.from({ length: 17 }, (_, i) => {
        const x = -200 + i * 50;
        return <path key={x} d={`M${x} 400L${vanishing} ${horizon}`} strokeWidth="0.8" opacity="0.85" />;
      })}
      {Array.from({ length: 14 }, (_, k) => {
        const y = horizon + 250 * Math.pow(0.72, k);
        return <path key={k} d={`M0 ${y.toFixed(2)}H400`} strokeWidth="0.8" opacity="0.85" />;
      })}
      <path d={`M170 ${horizon}A30 30 0 0 1 230 ${horizon}`} strokeWidth="1.2" />
      {Array.from({ length: 19 }, (_, i) => {
        const a = Math.PI + (i * Math.PI) / 18;
        return (
          <path
            key={i}
            d={`M${(200 + 40 * Math.cos(a)).toFixed(2)} ${(horizon + 40 * Math.sin(a)).toFixed(2)}L${(200 + 62 * Math.cos(a)).toFixed(2)} ${(horizon + 62 * Math.sin(a)).toFixed(2)}`}
            strokeWidth="0.8"
          />
        );
      })}
      {[86, 116, 148].map((rad) => (
        <path
          key={rad}
          d={`M${200 - rad} ${horizon}A${rad} ${rad} 0 0 1 ${200 + rad} ${horizon}`}
          strokeWidth="0.7"
          strokeDasharray="2 5"
          opacity="0.7"
        />
      ))}
    </g>
  );
}

function Astrolabe() {
  return (
    <g>
      <circle cx="200" cy="200" r="184" strokeWidth="1.3" />
      <circle cx="200" cy="200" r="172" strokeWidth="0.9" />
      <circle cx="200" cy="200" r="178" strokeWidth="9" pathLength="360" strokeDasharray="0.3 4.7" opacity="0.5" />
      {[146, 102, 64].map((r) => (
        <circle key={r} cx="200" cy="200" r={r} strokeWidth="1" opacity="0.9" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx="200" cy={200 - 20 * i} r={126 - 17 * i} strokeWidth="0.7" opacity="0.7" />
      ))}
      <circle cx="200" cy="172" r="112" strokeWidth="1.5" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = i * 0.78 + 0.3;
        const x = 200 + 112 * Math.cos(a);
        const y = 172 + 112 * Math.sin(a);
        const tx = 200 + 138 * Math.cos(a + 0.12);
        const ty = 172 + 138 * Math.sin(a + 0.12);
        return (
          <g key={i}>
            <path d={`M${x.toFixed(1)} ${y.toFixed(1)}Q${((x + tx) / 2 + 6).toFixed(1)} ${((y + ty) / 2 - 6).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`} strokeWidth="0.9" />
            <circle cx={tx} cy={ty} r="2.6" fill="currentColor" stroke="none" />
          </g>
        );
      })}
      <g transform="rotate(32 200 200)">
        <path d="M200 16V384" strokeWidth="1" />
        <circle cx="200" cy="200" r="9" strokeWidth="1.2" />
      </g>
      <path d="M16 200H384" strokeWidth="0.6" opacity="0.5" />
    </g>
  );
}

function GoldenSpiral() {
  // Each level is the previous one turned 90° and scaled by 1/φ, so nesting transforms
  // yields the whole spiral. Strokes ignore the scaling.
  const k = 1 / PHI;
  const step = `matrix(0 ${k} ${-k} 0 ${PHI} 0)`;
  function level(n: number): ReactNode {
    return (
      <g>
        <path d="M0 0H1V1H0Z" vectorEffect="non-scaling-stroke" strokeWidth="0.9" opacity="0.85" />
        <path d="M0 1A1 1 0 0 1 1 0" vectorEffect="non-scaling-stroke" strokeWidth="1.5" />
        {n > 0 && <g transform={step}>{level(n - 1)}</g>}
      </g>
    );
  }
  const scale = 232;
  return (
    <g transform={`translate(${(400 - PHI * scale) / 2} ${(400 - scale) / 2}) scale(${scale})`}>
      {level(9)}
    </g>
  );
}

function Constellation() {
  const random = rng(11);
  const stars = Array.from({ length: 17 }, (_, i) => ({
    x: 40 + random() * 320,
    y: 40 + random() * 320,
    size: i < 5 ? 3 + random() * 2 : 1 + random() * 1.6,
  })).sort((a, b) => a.x - b.x);
  const greek = ["α", "β", "γ", "δ", "ε"];
  return (
    <g>
      <path d="M0 300Q200 90 400 260" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.7" />
      <path d="M0 330Q200 120 400 290" strokeWidth="0.5" opacity="0.4" />
      {stars.slice(1).map((s, i) => (
        <path
          key={i}
          d={`M${stars[i].x.toFixed(1)} ${stars[i].y.toFixed(1)}L${s.x.toFixed(1)} ${s.y.toFixed(1)}`}
          strokeWidth="0.7"
          opacity="0.55"
        />
      ))}
      {stars.map((s, i) => (
        <g key={i}>
          {s.size > 3 ? (
            <path
              d="M0 -10Q0 0 10 0Q0 0 0 10Q0 0 -10 0Q0 0 0 -10Z"
              transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) scale(${(s.size / 4).toFixed(2)})`}
              fill="currentColor"
              stroke="none"
            />
          ) : (
            <circle cx={s.x} cy={s.y} r={s.size} fill="currentColor" stroke="none" />
          )}
          <circle cx={s.x} cy={s.y} r={s.size + 6} strokeWidth="0.5" opacity="0.5" />
        </g>
      ))}
      {stars
        .filter((s) => s.size > 3)
        .slice(0, 5)
        .map((s, i) => (
          <text
            key={i}
            x={s.x + 12}
            y={s.y - 10}
            fontSize="13"
            fontStyle="italic"
            fill="currentColor"
            stroke="none"
            fontFamily="var(--cj-display), serif"
          >
            {greek[i]}
          </text>
        ))}
    </g>
  );
}

const DRAWINGS = [Rays, Kepler, Perspective, Astrolabe, GoldenSpiral, Constellation];

interface PlateProps {
  variant: number;
  className?: string;
  /** Figure number shown in the caption ("Fig. III"). */
  figure?: number;
  children?: ReactNode;
}

export function Plate({ variant, className = "", figure, children }: PlateProps) {
  const uid = useId().replace(/:/g, "");
  const Drawing = DRAWINGS[variant] ?? Rays;

  return (
    <figure className={`cj-figure ${className}`}>
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        className="cj-plate"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`dots-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1" fill="currentColor" stroke="none" />
          </pattern>
          <pattern id={`hatch-${uid}`} width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M0 4L4 0" strokeWidth="0.6" />
          </pattern>
          <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0.35" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <linearGradient id={`fade2-${uid}`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0.45" stopColor="#000" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <mask id={`mask-${uid}`}>
            <rect width="400" height="400" fill={`url(#fade-${uid})`} />
          </mask>
          <mask id={`mask2-${uid}`}>
            <rect width="400" height="400" fill={`url(#fade2-${uid})`} />
          </mask>
        </defs>

        <rect width="400" height="400" fill="currentColor" fillOpacity="0.05" stroke="none" />
        <rect width="400" height="400" fill={`url(#dots-${uid})`} mask={`url(#mask-${uid})`} stroke="none" opacity="0.5" />
        <rect width="400" height="400" fill={`url(#hatch-${uid})`} mask={`url(#mask2-${uid})`} stroke="none" opacity="0.5" />
        <Drawing />
        <rect x="9" y="9" width="382" height="382" strokeWidth="0.7" opacity="0.5" />
      </svg>
      {children}
      {figure !== undefined && (
        <figcaption className="cj-figcap">
          <span>Fig. {toRoman(figure)}</span>
          <span>{PLATE_CAPTIONS[variant]}</span>
        </figcaption>
      )}
    </figure>
  );
}
