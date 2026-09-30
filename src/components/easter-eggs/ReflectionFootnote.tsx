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
    return <p className="cj-hint">{t("scrollHint")}</p>;
  }

  return (
    <aside>
      <p className="cj-footnote">
        <small>{t("footnote")}</small>
        {tc("revealed")}
      </p>
    </aside>
  );
}
