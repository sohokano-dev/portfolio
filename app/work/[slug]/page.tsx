import { readdirSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import styles from "@/components/Work.module.css";
import { workMarkdownClassName } from "@/components/mdx/markdownStyles";
import { WorkDetailBackground } from "@/components/work/WorkDetailBackground";
import { getWorkProjectBySlug } from "@/components/work/workProjects";

type MdxModule = {
  default: ComponentType;
};

type WorkPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  const contentDirectory = path.join(process.cwd(), "content");
  const files = readdirSync(contentDirectory).filter(
    (file) => file.endsWith(".mdx") && !file.startsWith("_"),
  );

  return files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

export default async function WorkPage({ params }: WorkPageProps) {
  let workModule: MdxModule;

  if (params.slug.startsWith("_")) {
    notFound();
  }

  try {
    workModule = await import(`@/content/${params.slug}.mdx`);
  } catch {
    notFound();
  }

  const { default: Content } = workModule;
  const project = getWorkProjectBySlug(params.slug);

  return (
    <div className={`${styles.root} relative min-h-screen overflow-x-hidden text-text-100`}>
      <WorkDetailBackground project={project} />
      <Link
        className="fixed left-5 top-[68px] z-[110] inline-flex text-sm leading-none text-text-100 transition-opacity hover:opacity-80 max-[640px]:top-[68px]"
        href="/"
      >
        ← Back
      </Link>
      <main className="relative z-[1] pb-12 pt-[120px] max-[640px]:pt-[120px] md:pb-16">
        <div className="px-5 md:px-10">
          <article className={workMarkdownClassName}>
            <Content />
          </article>
        </div>
      </main>
    </div>
  );
}
