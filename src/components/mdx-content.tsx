"use client";

import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";

import { CodeBlock } from "@/components/article/CodeBlock";

const sharedComponents = {
  pre: CodeBlock,
  figure: ({ children, ...props }: React.ComponentPropsWithoutRef<"figure">) => (
    <div {...props}>{children}</div>
  ),
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<"table">) => (
    <div className="not-prose my-8 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
};

function compileMDX(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default as React.ComponentType<{
    components?: Record<string, React.ComponentType>;
  }>;
}

interface MDXContentProps {
  code: string;
  components?: Record<string, React.ComponentType>;
  className?: string;
}

export function MDXContent({ code, components, className }: MDXContentProps) {
  const Component = useMemo(() => compileMDX(code), [code]);
  const merged = useMemo(
    () => ({ ...sharedComponents, ...components }),
    [components],
  );

  return (
    <div className={className}>
      {/* MDX components are compiled at build time via Velite */}
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Component components={merged} />
    </div>
  );
}
