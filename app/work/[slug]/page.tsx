import { readdirSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import Link from "next/link";
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
    <div
      className={`${styles.root} ${styles.isHovering} relative min-h-screen overflow-x-hidden text-text-100`}
    >
      <WorkDetailBackground project={project} />
      <Link
        className="fixed left-5 top-[78px] z-40 inline-flex text-sm leading-none text-text-70 transition-colors hover:text-text-100 max-[640px]:top-[70px]"
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
