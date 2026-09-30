"use client";

import { useEffect, useMemo, useState } from "react";

export interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

interface ArticleTocProps {
  items: TocItem[];
  label: string;
  /** CSS class prefix: "tl" (Transmission Log) or "cj" (Cosmic Journal). */
  classPrefix?: "tl" | "cj";
}

interface FlatItem {
  title: string;
  id: string;
  depth: 2 | 3;
}

function flatten(items: TocItem[], depth: 2 | 3 = 2): FlatItem[] {
  return items.flatMap((item) => [
    { title: item.title, id: item.url.replace(/^#/, ""), depth },
    ...(depth === 2 && item.items ? flatten(item.items, 3) : []),
  ]);
}

export function ArticleToc({ items, label, classPrefix = "tl" }: ArticleTocProps) {
  const flat = useMemo(() => flatten(items), [items]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const headings = flat
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Track the heading closest to the top band of the viewport.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [flat]);

  if (flat.length === 0) return null;

  return (
    <nav aria-label={label}>
      <p className={`${classPrefix}-hud`}>{label}</p>
      <div className={`${classPrefix}-toc`}>
        {flat.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-depth={item.depth}
            aria-current={active === item.id ? "location" : undefined}
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
