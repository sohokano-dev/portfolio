import { readdirSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";

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
  const files = readdirSync(contentDirectory).filter((file) => file.endsWith(".mdx"));

  return files.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

export default async function WorkPage({ params }: WorkPageProps) {
  let workModule: MdxModule;

  try {
    workModule = await import(`@/content/${params.slug}.mdx`);
  } catch {
    notFound();
  }

  const { default: Content } = workModule;

  return (
    <main className="px-5 py-12 md:px-10 md:py-16">
      <article className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="[&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:leading-[1.2] [&_h1]:text-text [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-[1.2] [&_h2]:text-text [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:text-dim">
          <Content />
        </div>
      </article>
    </main>
  );
}
