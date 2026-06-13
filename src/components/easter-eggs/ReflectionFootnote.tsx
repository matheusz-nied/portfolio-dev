"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ReflectionFootnote() {
  const t = useTranslations("reflections");
  const tc = useTranslations("constellation");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled >= total - 100) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) {
    return (
      <p className="py-10 text-center text-xs text-[var(--refl-muted)]/50">
        {t("scrollHint")}
      </p>
    );
  }

  return (
    <aside className="mx-auto max-w-lg px-6 py-12 text-center">
      <p className="font-[family-name:var(--font-serif)] text-sm italic text-[var(--refl-muted)]">
        {t("footnote")}: {tc("revealed")}
      </p>
    </aside>
  );
}
