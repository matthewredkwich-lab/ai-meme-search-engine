import { getMemes } from "@/lib/db/api";
import { ErrorComponent } from "./error";
import { ImageSearch } from "./image-search";

export const SuspendedImageSearch = async ({ query }: { query?: string }) => {
  try {
    const { memes, error } = await getMemes(query);

    if (error) {
      return <ErrorComponent error={error} />;
    }

    return <ImageSearch images={memes} query={query} />;
  } catch (e) {
    console.error("Error in SuspendedImageSearch:", e);
    return <ErrorComponent error={new Error("Failed to load memes")} />;
  }
};
