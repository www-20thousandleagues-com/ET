import { Info, X } from "lucide-react";
import { useLocaleStore } from "@/stores/locale";

export interface MethodologyModalProps {
  onClose: () => void;
  sourceCount: number;
}

export function MethodologyModal({ onClose, sourceCount }: MethodologyModalProps) {
  const t = useLocaleStore((s) => s.t);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className="fixed inset-x-4 top-1/4 max-w-lg mx-auto bg-card border-2 border-foreground rounded-lg shadow-xl z-50 p-6"
        role="dialog"
        aria-modal="true"
        aria-label={t.answer.viewMethodology}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="size-5 text-brand" />
            <h3 className="font-bold text-foreground">{t.answer.viewMethodology}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded" aria-label={t.answer.close}>
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong>1. {t.answer.methodologyStep1}:</strong> {t.answer.methodologyVectorSearch}
          </p>
          <p>
            <strong>2. {t.answer.methodologyStep2}:</strong> {t.answer.methodologyReranking}
          </p>
          <p>
            <strong>3. {t.answer.methodologyStep3}:</strong> {t.answer.methodologySynthesis}
          </p>
          <p>
            <strong>4. {t.answer.methodologyStep4}:</strong> {t.answer.methodologyConfidence}
          </p>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            {t.answer.methodologyFooter.replace("{count}", String(sourceCount))}
          </p>
        </div>
      </div>
    </>
  );
}
