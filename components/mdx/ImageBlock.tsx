import Image from "next/image";

type ImageBlockProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export function ImageBlock({ src, alt, width, height, caption }: ImageBlockProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-card border border-border bg-bg2">
      <Image
        alt={alt}
        className="h-auto w-full object-cover"
        height={height}
        sizes="(min-width: 1024px) 48rem, 100vw"
        src={src}
        width={width}
      />
      {caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-sm leading-6 text-dim">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
