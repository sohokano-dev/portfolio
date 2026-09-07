import { workDetailGridClassName } from "@/components/work/layout";

export const workMarkdownStyles = {
  root: `${workDetailGridClassName} work-mdx text-white`,
  h1: "[&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:leading-[1.2] [&_h1]:tracking-[0] [&_h1]:text-white",
  h2: "[&_h2]:mb-3 [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-[1.2] [&_h2]:tracking-[0] [&_h2]:text-white",
  h3: "[&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-[1.4] [&_h3]:tracking-[0] [&_h3]:text-white",
  body: "[&_p]:mb-5 [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:tracking-[0] [&_p]:text-white",
  caption: "[&_figcaption]:mt-2 [&_figcaption]:text-xs [&_figcaption]:leading-[1.7] [&_figcaption]:tracking-[0] [&_figcaption]:text-white",
  list: "[&_ul]:mb-5 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:text-sm [&_ul]:leading-[1.4] [&_ul]:tracking-[0] [&_ul]:text-white [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li::before]:absolute [&_ul_li::before]:left-0.5 [&_ul_li::before]:top-0 [&_ul_li::before]:content-['•'] [&_li+li]:mt-[0.5em]",
  numList: "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:leading-[1.4] [&_ol]:tracking-[0] [&_ol]:text-white [&_ol_li]:pl-0",
  table: "[&_table]:mb-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm [&_table]:leading-[1.6] [&_table]:tracking-[0] [&_table]:text-white [&_th]:border-b [&_th]:border-white/25 [&_th]:px-3 [&_th]:py-2 [&_th]:align-top [&_th]:font-semibold [&_th]:text-white [&_td]:border-b [&_td]:border-white/25 [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td:first-child]:font-semibold [&_td_div]:flex [&_td_div]:items-center [&_td_div]:gap-3 [&_td_img]:h-6 [&_td_img]:w-6 [&_td_img]:max-w-none [&_td_img]:object-contain [&_td_strong]:font-semibold [&_td_ul]:mb-0 [&_td_ul]:list-none [&_td_ul]:pl-0 [&_td_ul]:leading-[1.6] [&_td_ul_li]:relative [&_td_ul_li]:pl-5 [&_td_ul_li::before]:absolute [&_td_ul_li::before]:left-0.5 [&_td_ul_li::before]:top-0 [&_td_ul_li::before]:content-['•'] [&_td_ol]:mb-0 [&_td_ol]:pl-5 [&_td_ol]:leading-[1.6] [&_td_ol_li]:pl-0",
  link: "[&_a]:text-white [&_a]:underline [&_a]:underline-offset-4",
} as const;

export const workMarkdownClassName = Object.values(workMarkdownStyles).join(" ");

export const workMarkdownCaptionClassName =
  "mt-2 text-xs leading-[1.4] text-white";
