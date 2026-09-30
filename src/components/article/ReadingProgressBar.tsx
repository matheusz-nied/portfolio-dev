"use client";

import { useEffect, useState } from "react";

interface ReadingProgressBarProps {
  variant: "tech" | "reflections";
}

export function ReadingProgressBar({ variant }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollY = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setProgress(current);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const barStyles = {
    tech: "bg-[var(--tech-accent)]",
    reflections: "bg-[var(--cj-gold)]",
  };

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className={`h-full transition-[width] duration-75 ease-out ${barStyles[variant]}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
