"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const SEQUENCE = [0, 2, 4, 1, 3];

interface StarPoint {
  id: number;
  x: number;
  y: number;
}

const stars: StarPoint[] = [
  { id: 0, x: 20, y: 30 },
  { id: 1, x: 45, y: 15 },
  { id: 2, x: 70, y: 25 },
  { id: 3, x: 85, y: 50 },
  { id: 4, x: 55, y: 45 },
];

export function Constellation() {
  const t = useTranslations("constellation");
  const [clicks, setClicks] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  const handleClick = (id: number) => {
    if (revealed) return;
    const next = [...clicks, id];
    const expected = SEQUENCE.slice(0, next.length);
    const matches = next.every((v, i) => v === expected[i]);

    if (!matches) {
      setClicks([]);
      return;
    }

    setClicks(next);
    if (next.length === SEQUENCE.length) {
      setRevealed(true);
    }
  };

  return (
    <div className="relative h-20 w-full max-w-sm opacity-50 transition-opacity hover:opacity-80">
      <svg viewBox="0 0 100 60" className="h-full w-full" aria-hidden>
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={star.x}
            cy={star.y}
            r={clicks.includes(star.id) ? 2 : 1.2}
            fill={
              clicks.includes(star.id)
                ? "var(--accent-primary)"
                : "rgba(160, 200, 175, 0.35)"
            }
            className="cursor-pointer transition-all duration-300"
            onClick={() => handleClick(star.id)}
          />
        ))}
      </svg>
      {revealed && (
        <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-[var(--accent-primary)]/80">
          {t("revealed")}
        </p>
      )}
    </div>
  );
}
