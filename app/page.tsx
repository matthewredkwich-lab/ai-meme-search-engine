import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { SearchBox } from "@/components/search-box";
import { Suspense } from "react";
import { SuspendedImageSearch } from "@/components/suspended-image-search";
import TransparentHeader from "@/components/transparent-header";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q;
  
  return (
    <main className="min-h-screen bg-[#1b283a] text-white pt-16 pb-8 px-2 space-y-4">
      <div className="text-center mb-6">
        <h1 className="font-bold text-4xl text-[#34d399]">Semantic Meme Search Engine</h1>
      </div>
      <div className="w-full flex flex-col">
        <div className="pt-2 pb-4">
          <SearchBox query={query} />
        </div>
        <Suspense fallback={<CardGridSkeleton />} key={query}>
          <SuspendedImageSearch query={query} />
        </Suspense>
      </div>
    </main>
  );
}
