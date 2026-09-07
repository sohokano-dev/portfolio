import Image from "next/image";
import { workMarkdownCaptionClassName } from "@/components/mdx/markdownStyles";
import { workInlineMediaColumnClassName } from "@/components/work/layout";

type ImageBlockProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  variant?: "default" | "main";
};

export function ImageBlock({
  src,
  alt,
  width,
  height,
  caption,
  variant = "default",
}: ImageBlockProps) {
  const isMain = variant === "main";
  const figureClassName = isMain
    ? "col-span-full mb-12 mt-10 w-screen max-w-[1920px] justify-self-center"
    : `${workInlineMediaColumnClassName} mb-10 mt-6`;
  const imageFrameClassName = isMain
    ? "overflow-hidden bg-bg-800"
    : "overflow-hidden border border-border bg-bg-800";
  const imageSizes = isMain
    ? "(min-width: 1920px) 1920px, 100vw"
    : "(min-width: 1024px) 48rem, 100vw";

  return (
    <figure className={figureClassName}>
      <div className={imageFrameClassName}>
        <Image
          alt={alt}
          className="h-auto w-full object-cover"
          height={height}
          sizes={imageSizes}
          src={src}
          width={width}
        />
      </div>
      {!isMain && caption ? (
        <figcaption className={workMarkdownCaptionClassName}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
