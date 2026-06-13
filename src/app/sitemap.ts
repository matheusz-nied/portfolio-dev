import type { MetadataRoute } from "next";
import { techPosts, reflectionPosts } from "#site/content";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";
import { projects } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticRoutes = ["", "/resume", "/tech", "/reflections"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${base}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }
  }

  for (const post of techPosts.filter((p) => p.published && !p.hidden)) {
    entries.push({
      url: `${base}/${post.locale}/tech/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const post of reflectionPosts.filter((p) => p.published && !p.hidden)) {
    entries.push({
      url: `${base}/${post.locale}/reflections/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const locale of routing.locales) {
    for (const project of projects) {
      entries.push({
        url: `${base}/${locale}/projects/${project.id}`,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  return entries;
}
