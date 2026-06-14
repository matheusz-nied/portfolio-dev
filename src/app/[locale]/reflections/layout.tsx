import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ReflectionFootnote } from "@/components/easter-eggs/ReflectionFootnote";
import { SignalMeshBackground } from "@/components/portfolio/SignalMeshBackground";
import { getTranslations } from "next-intl/server";

export default async function ReflectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("reflections");

  return (
    <div className="theme-reflections relative min-h-screen">
      <SignalMeshBackground />
      <div className="relative z-10">
      <header className="border-b border-[var(--refl-border)] px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <Link
              href="/reflections"
              className="font-[family-name:var(--font-serif)] text-2xl font-medium text-[var(--refl-text)]"
            >
              {t("siteName")}
            </Link>
            <p className="mt-1.5 text-sm text-[var(--refl-muted)]">{t("tagline")}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[var(--refl-muted)] transition-colors hover:text-[var(--refl-text)]"
            >
              {t("backToPortfolio")}
            </Link>
            <LanguageSwitcher variant="reflections" />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-14">{children}</main>
      <ReflectionFootnote />
      </div>
    </div>
  );
}
