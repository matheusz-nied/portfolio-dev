import rehypeSlug from "rehype-slug";
import { defineConfig, s } from "velite";

const postSchema = s
  .object({
    title: s.string().max(120),
    description: s.string().max(500),
    date: s.isodate(),
    locale: s.enum(["pt", "en"]),
    translationSlug: s.string(),
    tags: s.array(s.string()).default([]),
    published: s.boolean().default(true),
    hidden: s.boolean().default(false),
    code: s.mdx(),
  })
  .transform((data, { meta }) => {
    const segments = meta.path.replace(/\\/g, "/").split("/");
    const filename = segments.at(-1)?.replace(/\.mdx$/, "") ?? "";
    const words = (meta.content ?? "").split(/\s+/).filter(Boolean).length;

    return {
      ...data,
      slug: filename,
      readingTime: Math.max(1, Math.ceil(words / 200)),
    };
  });

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: {
    techPosts: {
      name: "TechPost",
      pattern: "tech/**/*.mdx",
      schema: postSchema,
    },
    reflectionPosts: {
      name: "ReflectionPost",
      pattern: "reflections/**/*.mdx",
      schema: postSchema,
    },
  },
  mdx: {
    rehypePlugins: [rehypeSlug],
  },
});
