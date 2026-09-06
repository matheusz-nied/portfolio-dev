import { getTechPost } from "@/lib/content";
import { techPosts } from "#site/content";
import {
  getOgEyebrow,
  getOgLocale,
  renderOgImage,
  ogSize,
  ogContentType,
} from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Transmission Log — Matheus Fernandes";

export function generateStaticParams() {
  return techPosts.map((post) => ({
    locale: post.locale,
    slug: post.slug,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = getOgLocale(locale);
  const post = getTechPost(slug, loc);

  return renderOgImage({
    eyebrow: getOgEyebrow("tech", loc),
    title: post?.title ?? slug,
    subtitle: post?.description,
    footerLeft: "Matheus Fernandes",
    footerRight: post ? `${post.readingTime} min` : undefined,
  });
}
