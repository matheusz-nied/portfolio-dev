import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { TechFooterEasterEgg } from "@/components/easter-eggs/TechFooterEasterEgg";
import { SignalMeshBackground } from "@/components/portfolio/SignalMeshBackground";
import { getTranslations } from "next-intl/server";

export default async function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("tech");

  return (
    <div className="theme-tech relative flex min-h-screen flex-col">
      <SignalMeshBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
      <header className="border-b border-[var(--tech-border)] px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <Link
              href="/tech"
              className="font-[family-name:var(--font-mono)] text-base font-medium tracking-tight text-[var(--tech-text)]"
            >
              {t("siteName")}
            </Link>
            <p className="mt-1 text-sm text-[var(--tech-muted)]">{t("tagline")}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[var(--tech-muted)] transition-colors hover:text-[var(--tech-text)]"
            >
              {t("backToPortfolio")}
            </Link>
            <LanguageSwitcher variant="tech" />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">{children}</main>
      <TechFooterEasterEgg />
      </div>
    </div>
  );
}
