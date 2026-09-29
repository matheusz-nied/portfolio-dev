"use client";

import { useEffect, useRef, useState } from "react";

type Dense = "left" | "right" | "top" | "bottom";

interface DitherBlockProps {
  /** Side where the grain is densest. */
  dense?: Dense;
  /** Varies the noise so neighbouring blocks don't look cloned. */
  seed?: number;
  /** CSS pixels per dither pixel. */
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ACCENT_RGB = "110, 196, 146";

function bayerMatrix(size: number): number[][] {
  if (size === 1) return [[0]];
  const half = size / 2;
  const prev = bayerMatrix(half);
  const quad = [
    [0, 2],
    [3, 1],
  ];
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const base = prev[y % half][x % half];
      return 4 * base + quad[Math.floor(y / half)][Math.floor(x / half)];
    }),
  );
}

const BAYER_SIZE = 8;
const BAYER = bayerMatrix(BAYER_SIZE);

function hash(x: number, y: number, seed: number) {
  let h = Math.imul(x + 374761393, 668265263) ^ Math.imul(y + seed * 97 + 1274126177, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function readAccent(element: HTMLElement): [number, number, number] {
  const themed = element.closest(".theme-tech, .theme-portfolio, .theme-reflections");
  const raw =
    (themed ? getComputedStyle(themed).getPropertyValue("--signal-accent-rgb").trim() : "") ||
    DEFAULT_ACCENT_RGB;
  const [r, g, b] = raw.split(",").map((n) => Number.parseInt(n, 10));
  return [r, g, b];
}

/**
 * Ordered-dither gradient rendered once to a low-resolution canvas.
 * Static by design: no per-frame work, nothing that competes with reading.
 */
export function DitherBlock({
  dense = "right",
  seed = 1,
  scale = 3,
  className = "",
  style,
}: DitherBlockProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const draw = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(width / scale));
      const h = Math.max(1, Math.floor(height / scale));
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const [r, g, b] = readAccent(wrap);
      const image = ctx.createImageData(w, h);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const u = w > 1 ? x / (w - 1) : 0;
          const v = h > 1 ? y / (h - 1) : 0;
          const axis =
            dense === "right" ? u : dense === "left" ? 1 - u : dense === "bottom" ? v : 1 - v;
          // Density ramps up along the axis; noise breaks up the banding.
          const grain = (hash(x, y, seed) - 0.5) * 0.22;
          const density = Math.min(1, Math.max(0, 0.04 + 0.96 * axis ** 1.35 + grain));
          const threshold = (BAYER[y % BAYER_SIZE][x % BAYER_SIZE] + 0.5) / (BAYER_SIZE * BAYER_SIZE);
          const on = density > threshold;
          const i = (y * w + x) * 4;
          image.data[i] = r;
          image.data[i + 1] = g;
          image.data[i + 2] = b;
          image.data[i + 3] = on ? Math.round(255 * (0.3 + 0.5 * axis)) : 0;
        }
      }
      ctx.putImageData(image, 0, 0);
      setReady(true);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(wrap);
    // Colours are baked into the canvas, so repaint when the theme flips.
    const themed = wrap.closest(".theme-tech");
    const themeObserver = new MutationObserver(draw);
    if (themed) themeObserver.observe(themed, { attributes: true, attributeFilter: ["data-tl-theme"] });
    return () => {
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [dense, seed, scale]);

  return (
    <span
      ref={wrapRef}
      aria-hidden="true"
      className={`tl-dither ${ready ? "is-ready" : ""} ${className}`}
      style={style}
    >
      <canvas ref={canvasRef} />
    </span>
  );
}
