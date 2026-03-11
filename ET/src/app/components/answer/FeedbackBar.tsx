import { Copy, ThumbsUp, ThumbsDown, Check, Bookmark, BookmarkCheck } from "lucide-react";
import type { Translations } from "@/lib/i18n/en";

export interface FeedbackBarProps {
  feedback: "up" | "down" | null;
  onFeedback: (type: "up" | "down") => void;
  copied: boolean;
  onCopy: () => void;
  isSaved: boolean;
  onSave: () => void;
  showCitationBrackets: boolean;
  onToggleCitationBrackets: () => void;
  t: Translations;
}

export function FeedbackBar({
  feedback,
  onFeedback,
  copied,
  onCopy,
  isSaved,
  onSave,
  showCitationBrackets,
  onToggleCitationBrackets,
  t,
}: FeedbackBarProps) {
  return (
    <>
      {/* Save button */}
      <button
        onClick={onSave}
        className={`p-1.5 rounded transition-colors ${isSaved ? "bg-amber-100 dark:bg-amber-900" : "hover:bg-accent"}`}
        title={isSaved ? t.common.unsave : t.common.save}
        aria-label={isSaved ? t.common.unsave : t.common.save}
      >
        {isSaved ? (
          <BookmarkCheck className="size-4 text-amber-600" />
        ) : (
          <Bookmark className="size-4 text-muted-foreground" />
        )}
      </button>
      <button
        onClick={onCopy}
        className={`p-1.5 rounded transition-colors ${copied ? "bg-green-100 dark:bg-green-900" : "hover:bg-accent"}`}
        title={t.common.copy}
        aria-label={t.common.copy}
      >
        {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4 text-muted-foreground" />}
      </button>
      <button
        onClick={() => onFeedback("up")}
        className={`p-1.5 rounded transition-colors ${feedback === "up" ? "bg-green-100 dark:bg-green-900" : "hover:bg-accent"}`}
        title={t.common.helpful}
        aria-label={t.common.helpful}
      >
        <ThumbsUp className={`size-4 ${feedback === "up" ? "text-green-600" : "text-muted-foreground"}`} />
      </button>
      <button
        onClick={() => onFeedback("down")}
        className={`p-1.5 rounded transition-colors ${feedback === "down" ? "bg-red-100 dark:bg-red-900" : "hover:bg-accent"}`}
        title={t.common.notHelpful}
        aria-label={t.common.notHelpful}
      >
        <ThumbsDown className={`size-4 ${feedback === "down" ? "text-red-600" : "text-muted-foreground"}`} />
      </button>

      {/* Citation visibility toggle */}
      <button
        onClick={onToggleCitationBrackets}
        className={`p-1.5 rounded transition-colors ${!showCitationBrackets ? "bg-stone-200 dark:bg-stone-700" : "hover:bg-accent"}`}
        title={showCitationBrackets ? t.answer.hideCitations : t.answer.showCitations}
        aria-label={showCitationBrackets ? t.answer.hideCitations : t.answer.showCitations}
      >
        <span className="text-xs font-mono font-bold text-muted-foreground">[·]</span>
      </button>
    </>
  );
}
