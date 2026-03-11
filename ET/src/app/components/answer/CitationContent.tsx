import { useMemo } from "react";
import { safeFormatDate } from "@/lib/utils";
import type { RagCitation } from "@/types/database";

export interface CitationContentProps {
  content: string;
  citations: RagCitation[];
  showBrackets?: boolean;
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function CitationContent({ content, citations, showBrackets = true }: CitationContentProps) {
  const citationMap = useMemo(() => {
    const map = new Map<number, RagCitation>();
    for (const c of citations) map.set(c.position, c);
    return map;
  }, [citations]);

  const parts = useMemo(() => {
    const result: { type: "text" | "citation"; value: string; citation?: RagCitation }[] = [];
    const regex = /\[(\d+)\]/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: "text", value: content.slice(lastIndex, match.index) });
      }
      const num = parseInt(match[1] ?? "0", 10);
      const cit = citationMap.get(num);
      result.push({ type: "citation", value: match[0], citation: cit });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      result.push({ type: "text", value: content.slice(lastIndex) });
    }
    return result;
  }, [content, citationMap]);

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "text") {
          return <span key={i}>{part.value}</span>;
        }
        const cit = part.citation;
        if (!showBrackets) return null;
        if (!cit)
          return (
            <span key={i} className="text-muted-foreground">
              {part.value}
            </span>
          );
        return (
          <span key={i} className="relative group/cite inline">
            {cit.url && isSafeUrl(cit.url) ? (
              <a
                href={cit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--brand)] font-medium hover:underline cursor-pointer"
              >
                {part.value}
              </a>
            ) : (
              <span className="text-[var(--brand)] font-medium cursor-help">{part.value}</span>
            )}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-card border-2 border-foreground rounded shadow-lg text-xs z-50 hidden group-hover/cite:block pointer-events-none">
              <span className="font-bold text-foreground block mb-1">{cit.title}</span>
              <span className="text-muted-foreground block">
                {cit.source_name} &bull; {safeFormatDate(cit.published_at)}
              </span>
              {cit.excerpt && <span className="text-muted-foreground block mt-1 line-clamp-2">{cit.excerpt}</span>}
            </span>
          </span>
        );
      })}
    </>
  );
}
