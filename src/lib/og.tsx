import { ImageResponse } from "next/og";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const THEMES = {
  default: {
    bg: "#0b0d0c",
    accent: "#8fbaa0",
    textPrimary: "#dde3df",
    textMuted: "#8a948c",
    border: "rgba(143, 186, 160, 0.35)",
    glow: "rgba(143,186,160,0.16)",
    bgFallback: "rgba(11,13,12,0)",
  },
  reflections: {
    bg: "#0e1117",
    accent: "#b8aee6",
    textPrimary: "#e6e9f2",
    textMuted: "#a9b1c4",
    border: "rgba(184, 174, 230, 0.35)",
    glow: "rgba(110,120,190,0.18)",
    bgFallback: "rgba(14,17,23,0)",
  },
} as const;

export type OgTheme = keyof typeof THEMES;

const OG_EYEBROWS = {
  portfolio: { pt: "PORTFÓLIO", en: "PORTFOLIO" },
  project: { pt: "PROJETO", en: "PROJECT" },
  reflections: { pt: "COSMIC JOURNAL", en: "COSMIC JOURNAL" },
  tech: { pt: "TRANSMISSION LOG", en: "TRANSMISSION LOG" },
} satisfies Record<string, Record<Locale, string>>;

export type OgSection = keyof typeof OG_EYEBROWS;

export function getOgLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

export function getOgEyebrow(section: OgSection, locale: Locale) {
  return OG_EYEBROWS[section][locale];
}
export interface OgImageProps {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
  footerLeft: string;
  footerRight?: string | null;
  theme?: OgTheme;
}

function OgTemplate({
  eyebrow,
  title,
  subtitle,
  footerLeft,
  footerRight,
  theme = "default",
}: OgImageProps) {
  const host = new URL(getSiteUrl()).host;
  const palette = THEMES[theme];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: palette.bg,
        backgroundImage: `radial-gradient(circle at 12% -10%, ${palette.glow}, ${palette.bgFallback} 55%)`,
        padding: "70px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          display: "flex",
          backgroundColor: palette.accent,
          opacity: 0.75,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: palette.accent,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: palette.accent,
            }}
          />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: 20, color: palette.textMuted, letterSpacing: 2 }}>
          {host}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 40 ? 54 : 66,
            fontWeight: 700,
            color: palette.textPrimary,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ display: "flex", fontSize: 27, color: palette.textMuted, lineHeight: 1.5 }}>
            {subtitle.length > 140 ? `${subtitle.slice(0, 140)}…` : subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${palette.border}`,
          paddingTop: 26,
          fontSize: 22,
          color: palette.textMuted,
        }}
      >
        <div style={{ display: "flex" }}>{footerLeft}</div>
        {footerRight && <div style={{ display: "flex", color: palette.accent }}>{footerRight}</div>}
      </div>
    </div>
  );
}

export async function renderOgImage(props: OgImageProps) {
  return new ImageResponse(<OgTemplate {...props} />, {
    ...ogSize,
  });
}
