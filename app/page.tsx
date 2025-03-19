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
    <main className="min-h-screen bg-black text-white pt-24 pb-8 px-8 space-y-4">
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-2xl text-white">Semantic Meme Search Engine</h1>
        </div>
      </header>
      <TransparentHeader />
      <div className="w-full flex flex-col">
        <div className="pt-10 sm:pt-12 md:pt-14 lg:pt-16">
          <SearchBox query={query} />
        </div>
        <Suspense fallback={<CardGridSkeleton />} key={query}>
          <SuspendedImageSearch query={query} />
        </Suspense>
      </div>
    </main>
  );
}
