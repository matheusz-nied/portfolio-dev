"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function TechFooterEasterEgg() {
  const t = useTranslations("tech");
  const router = useRouter();
  const [input, setInput] = useState("");

  return (
    <footer className="mt-auto border-t border-[var(--tech-border)] px-6 py-8">
      <form
        className="mx-auto flex max-w-2xl items-center gap-2 text-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim().toLowerCase() === "sudo cat") {
            router.push(`/tech/hidden-transmission`);
          }
          setInput("");
        }}
      >
        <span className="font-[family-name:var(--font-mono)] text-[var(--tech-muted)]">
          $
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("footerHint")}
          className="flex-1 bg-transparent text-[var(--tech-muted)] outline-none placeholder:text-[var(--tech-muted)]/40"
          spellCheck={false}
        />
      </form>
    </footer>
  );
}
