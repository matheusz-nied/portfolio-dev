"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ProjectCarouselProps {
  images: string[];
  title: string;
}

export function ProjectCarousel({ images, title }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const go = useCallback(
    (next: number) => {
      setIndex((next + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, index]);

  if (total === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="relative aspect-[16/9] w-full">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={src}
              alt={`${title} — ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority={i === 0}
            />
          </div>
        ))}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-space)]/80 px-3 py-2 text-sm text-[var(--text-primary)] backdrop-blur-sm transition-colors hover:border-[var(--accent-primary)]/40"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-space)]/80 px-3 py-2 text-sm text-[var(--text-primary)] backdrop-blur-sm transition-colors hover:border-[var(--accent-primary)]/40"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-[var(--border-subtle)] py-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-[var(--accent-primary)]"
                  : "w-2 bg-[var(--text-muted)]/40 hover:bg-[var(--text-muted)]/70"
              }`}
              aria-label={`Image ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
