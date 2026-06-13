import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ResumeView } from "@/components/portfolio/ResumeView";
import { getProfile } from "@/lib/portfolio";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const profile = getProfile(locale as Locale);
  return {
    title: `Resume — ${profile.name}`,
    description: profile.summary,
  };
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ResumeView locale={locale as Locale} />;
}
