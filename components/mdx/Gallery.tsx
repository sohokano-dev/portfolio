import Image from "next/image";

type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type GalleryProps = {
  images: GalleryImage[];
};

export function Gallery({ images }: GalleryProps) {
  return (
    <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {images.map((image, index) => (
        <figure
          className="overflow-hidden rounded-card border border-border bg-bg-800"
          key={`${image.src}-${index}`}
        >
          <Image
            alt={image.alt}
            className="h-auto w-full object-cover"
            height={image.height}
            sizes="(min-width: 768px) 50vw, 100vw"
            src={image.src}
            width={image.width}
          />
        </figure>
      ))}
    </div>
  );
}
