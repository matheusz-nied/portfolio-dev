import { ImageResponse } from "next/og";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const BG = "#0b0d0c";
const ACCENT = "#8fbaa0";
const TEXT_PRIMARY = "#dde3df";
const TEXT_MUTED = "#8a948c";
const BORDER = "rgba(143, 186, 160, 0.35)";

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
}

function OgTemplate({ eyebrow, title, subtitle, footerLeft, footerRight }: OgImageProps) {
  const host = new URL(getSiteUrl()).host;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BG,
        backgroundImage:
          "radial-gradient(circle at 12% -10%, rgba(143,186,160,0.16), rgba(11,13,12,0) 55%)",
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
          backgroundColor: ACCENT,
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
            color: ACCENT,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: ACCENT,
            }}
          />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: 20, color: TEXT_MUTED, letterSpacing: 2 }}>
          {host}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 40 ? 54 : 66,
            fontWeight: 700,
            color: TEXT_PRIMARY,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ display: "flex", fontSize: 27, color: TEXT_MUTED, lineHeight: 1.5 }}>
            {subtitle.length > 140 ? `${subtitle.slice(0, 140)}…` : subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${BORDER}`,
          paddingTop: 26,
          fontSize: 22,
          color: TEXT_MUTED,
        }}
      >
        <div style={{ display: "flex" }}>{footerLeft}</div>
        {footerRight && <div style={{ display: "flex", color: ACCENT }}>{footerRight}</div>}
      </div>
    </div>
  );
}

export async function renderOgImage(props: OgImageProps) {
  return new ImageResponse(<OgTemplate {...props} />, {
    ...ogSize,
  });
}
