import { cn } from "@/lib/utils";

export const MatchBadge = ({
  match,
}: {
  match: number;
}) => {
  const isDirectMatch = match === 1;
  
  return (
    <div
      className={cn(
        "text-xs font-medium me-2 px-2.5 py-0.5 rounded",
        isDirectMatch
          ? "bg-[#34d399]/20 text-[#34d399]"
          : "bg-[#b8af4f]/20 text-[#b8af4f]"
      )}
    >
      {isDirectMatch ? "Exact match" : `Similarity: ${(match * 100).toFixed(0)}%`}
    </div>
  );
};
