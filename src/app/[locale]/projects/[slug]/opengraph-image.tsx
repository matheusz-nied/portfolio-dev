import { getProject, projects } from "@/lib/portfolio";
import {
  getOgEyebrow,
  getOgLocale,
  renderOgImage,
  ogSize,
  ogContentType,
} from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Case study — Matheus Fernandes";

export function generateStaticParams() {
  return projects.flatMap((project) =>
    (["pt", "en"] as const).map((locale) => ({
      locale,
      slug: project.id,
    })),
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = getOgLocale(locale);
  const project = getProject(slug, loc);

  return renderOgImage({
    eyebrow: getOgEyebrow("project", loc),
    title: project?.title ?? slug,
    subtitle: project?.summary,
    footerLeft: "Matheus Fernandes",
    footerRight: project?.status,
  });
}
