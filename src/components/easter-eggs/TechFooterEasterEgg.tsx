"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function TechFooterEasterEgg() {
  const t = useTranslations("tech");
  const router = useRouter();
  const [input, setInput] = useState("");

  return (
    <div className="tl-footer-cell">
      <form
        className="tl-prompt"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim().toLowerCase() === "sudo cat") {
            router.push(`/tech/hidden-transmission`);
          }
          setInput("");
        }}
      >
        <span aria-hidden="true">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("footerHint")}
          aria-label={t("footerHint")}
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
