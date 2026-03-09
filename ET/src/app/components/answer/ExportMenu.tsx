import { Download } from "lucide-react";
import { safeFormatDateTime } from "@/lib/utils";
import type { Translations } from "@/lib/i18n/en";

export interface ExportMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onExport: (format: string) => void;
  t: Translations;
}

export function buildMarkdownExport(
  query: string,
  content: string,
  citations: { position: number; title: string; source: string; url: string; excerpt: string }[],
  t: Translations,
) {
  const dateStr = safeFormatDateTime(new Date().toISOString());
  let md = `# ${t.export.title}\n\n**${t.export.queryLabel}:** ${query}\n**${t.export.dateLabel}:** ${dateStr}\n\n## ${t.export.analysisHeading}\n\n${content}\n\n`;
  if (citations.length > 0) {
    md += `## ${t.export.sourcesHeading}\n\n`;
    for (const c of citations) {
      md += `${c.position}. **${c.title}** — ${c.source}\n   ${c.url}\n   > ${c.excerpt}\n\n`;
    }
  }
  return md;
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportMenu({ isOpen, onToggle, onClose, onExport, t }: ExportMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background rounded transition-colors"
        title={t.common.export}
        aria-label={t.common.export}
      >
        <Download className="size-4" />
        <span>{t.common.export}</span>
      </button>
      {/* Mobile export - icon only */}
      <button
        onClick={onToggle}
        className="sm:hidden p-1.5 rounded hover:bg-accent transition-colors"
        title={t.common.export}
        aria-label={t.common.export}
      >
        <Download className="size-4 text-muted-foreground" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-card border-2 border-foreground rounded shadow-lg z-20">
            <div className="py-1">
              <button onClick={() => onExport("md")} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                {t.common.exportMd}
              </button>
              <button onClick={() => onExport("txt")} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                {t.answer.exportText}
              </button>
              <div className="border-t border-border my-1" />
              <button onClick={() => onExport("email")} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                {t.common.sendEmail}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
