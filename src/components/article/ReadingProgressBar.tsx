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
    reflections:
      "bg-gradient-to-r from-[#a8ceff] via-white to-[#d7e9ff] shadow-[0_0_8px_rgba(180,214,255,0.5)]",
  };

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 bg-transparent pointer-events-none ${
        variant === "tech" ? "h-[2px]" : "h-[3px]"
      }`}
      aria-hidden="true"
    >
      <div
        className={`h-full transition-[width] duration-75 ease-out ${barStyles[variant]}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
