import { Antonio, Cardo, Cormorant_Garamond, Courier_Prime } from "next/font/google";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ReflectionFootnote } from "@/components/easter-eggs/ReflectionFootnote";
import { ThemeToggle } from "@/components/transmission/ThemeToggle";
import { CelestialBackdrop } from "@/components/journal/CelestialBackdrop";
import { Ornament } from "@/components/journal/Ornament";
import { toRoman } from "@/lib/roman";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Loaded here (not in the locale layout) so the portfolio and tech blog don't preload them.
// Antonio: tall condensed capitals for display. Cormorant: italic accents. Cardo (after Bembo,
// 1495): the reading face. Courier Prime: typewriter labels.
const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cardo = Cardo({
  variable: "--font-cardo",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default async function ReflectionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reflections");
  const tn = await getTranslations("nav");

  return (
    <div
      className={`theme-reflections cj-shell ${antonio.variable} ${cormorant.variable} ${cardo.variable} ${courier.variable}`}
      suppressHydrationWarning
    >
      {/* Applies the saved theme before first paint to avoid a dark flash. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(localStorage.getItem("cj-theme")==="light")document.currentScript.parentElement.setAttribute("data-cj-theme","light")}catch(e){}`,
        }}
      />
      <CelestialBackdrop />
      <div className="cj-frame" aria-hidden="true" />

      <div className="cj-page">
        <header className="cj-masthead">
          <div className="cj-masthead-bar">
            <nav className="cj-nav cj-nav-left" aria-label={t("siteName")}>
              <Link href="/" aria-label={t("backToPortfolio").replace(/^←\s*/, "")}>
                <span className="cj-nav-arrow" aria-hidden="true">
                  ←
                </span>
                <span className="cj-nav-label">{t("backToPortfolio").replace(/^←\s*/, "")}</span>
              </Link>
              <Link href="/tech" className="cj-nav-label">
                {tn("techBlog")}
              </Link>
            </nav>

            <Link href="/reflections" className="cj-logo">
              <span>Cosmic</span>
              <span>Journal</span>
            </Link>

            <div className="cj-nav cj-nav-right">
              <Link href="/reflections" className="cj-nav-label">
                {t("indexLabel")}
              </Link>
              <ThemeToggle
                label={t("toggleTheme")}
                shell=".theme-reflections"
                attr="data-cj-theme"
                storageKey="cj-theme"
                className="cj-theme"
              />
              <LanguageSwitcher variant="reflections" />
            </div>
          </div>
        </header>

        <main className="cj-main">{children}</main>

        <footer className="cj-colophon">
          <Ornament />
          <p className="cj-scripsit">
            Scripsit Matheus Fernandes · {toRoman(new Date().getFullYear())}
          </p>
          <ReflectionFootnote />
        </footer>
      </div>
    </div>
  );
}
