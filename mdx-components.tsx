import type { MDXComponents } from "mdx/types";
import { MarkdownTableCell } from "@/components/mdx/MarkdownTableCell";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    td: MarkdownTableCell,
  };
}
