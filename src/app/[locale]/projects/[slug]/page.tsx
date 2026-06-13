import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ProjectDetail } from "@/components/portfolio/ProjectDetail";
import { getProject, projects } from "@/lib/portfolio";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return projects.flatMap((project) =>
    (["pt", "en"] as const).map((locale) => ({
      locale,
      slug: project.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug, locale as Locale);
  if (!project) return {};
  return {
    title: `${project.title} — Kaizen`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.thumbnail }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug, locale as Locale);
  if (!project) notFound();

  const t = await getTranslations("projects");

  return (
    <ProjectDetail
      project={project}
      labels={{
        back: t("backToProjects"),
        problem: t("problem"),
        solution: t("solution"),
        role: t("role"),
        highlights: t("highlights"),
        stack: t("stack"),
        result: t("result"),
        viewProject: t("viewProject"),
        viewCode: t("viewCode"),
        readTechPost: t("readTechPost"),
      }}
    />
  );
}
