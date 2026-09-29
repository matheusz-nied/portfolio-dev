import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { TechFooterEasterEgg } from "@/components/easter-eggs/TechFooterEasterEgg";
import { FrameRule } from "@/components/transmission/FrameRule";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TechLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tech");
  const tn = await getTranslations("nav");

  return (
    <div className="theme-tech tl-shell">
      <header className="tl-topbar">
        <div className="tl-topbar-inner">
          <Link href="/tech" className="tl-logo">
            <span className="tl-logo-mark" aria-hidden="true" />
            <span>
              Transmission<span className="tl-logo-tail">_log</span>
            </span>
          </Link>

          <nav className="tl-nav" aria-label={t("siteName")}>
            <Link href="/tech">Log</Link>
            <Link href="/reflections">{tn("reflectionsBlog")}</Link>
          </nav>

          <div className="tl-topbar-actions">
            <LanguageSwitcher variant="tech" />
            <Link href="/" className="tl-pill">
              {t("navPortfolio")}
            </Link>
          </div>
        </div>
      </header>

      <main className="tl-frame">
        {children}

        <FrameRule />
      </main>

      <footer className="tl-footer">
        <div className="tl-footer-inner">
          <div className="tl-footer-cell">© {new Date().getFullYear()} Matheus Fernandes</div>
          <TechFooterEasterEgg />
          <div className="tl-footer-cell">
            <Link href="/">{t("navPortfolio")} ↗</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
