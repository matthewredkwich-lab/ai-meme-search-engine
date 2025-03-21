"use client";

import { Meme } from "@/lib/db/schema";
import Image from "next/image";
import { MatchBadge } from "./match-badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

export const ImageCard = ({
  image,
  similarity,
}: {
  image: Meme;
  similarity?: number;
}) => {
  return (
    <a 
      href={image.path} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "flex flex-col overflow-hidden rounded-md shadow-md border border-[#34d399]/20 transition-all",
        "bg-black/40 hover:shadow-lg hover:scale-[1.01] hover:brightness-110 group relative min-w-[300px]"
      )}
    >
      <div className="relative h-[350px] w-full rounded-md overflow-hidden">
        <Image
          src={image.path}
          alt={image.title}
          className="object-contain"
          fill
        />
      </div>
    </a>
  );
};
