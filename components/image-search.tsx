"use client";
import { ImageCard } from "./image-card";
import { Meme } from "@/lib/db/schema";
import { NoImagesFound } from "./no-images-found";
import { useSharedTransition } from "@/lib/hooks/use-shared-transition";
import { CardGridSkeleton } from "./card-grid-skeleton";

export const ImageSearch = ({
  images,
  query,
}: {
  images: Meme[];
  query?: string;
}) => {
  const { isPending } = useSharedTransition();

  if (isPending) return <CardGridSkeleton />;

  if (images.length === 0) {
    return <NoImagesFound query={query ?? ""} />;
  }

  return <ImageGrid images={images} />;
};

const ImageGrid = ({ images }: { images: Meme[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-4 w-full">
      {images.map((image) => (
        <ImageCard
          key={"meme_" + image.id}
          image={image}
          similarity={image.similarity}
        />
      ))}
    </div>
  );
};
