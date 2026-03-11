import { Check, Search, Database, Sparkles } from "lucide-react";
import { useLocaleStore } from "@/stores/locale";
import type { LoadingPhase } from "@/stores/app";

export interface ProgressiveLoaderProps {
  phase: LoadingPhase;
}

export function ProgressiveLoader({ phase }: ProgressiveLoaderProps) {
  const t = useLocaleStore((s) => s.t);

  const steps: { key: LoadingPhase; label: string; icon: typeof Search }[] = [
    { key: "searching", label: t.answer.searchingSources, icon: Search },
    { key: "analyzing", label: t.answer.analyzingContent, icon: Database },
    { key: "generating", label: t.answer.generatingAnalysis, icon: Sparkles },
  ];

  const activeIndex = steps.findIndex((s) => s.key === phase);

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-6">
      <div className="max-w-sm w-full space-y-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeIndex;
          const isDone = idx < activeIndex;
          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 p-3 rounded border-2 transition-all duration-300 ${
                isActive
                  ? "border-[var(--brand)] bg-[var(--brand)]/5"
                  : isDone
                    ? "border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950"
                    : "border-stone-200 dark:border-stone-800 opacity-40"
              }`}
            >
              <div className={`flex-shrink-0 ${isActive ? "animate-pulse" : ""}`}>
                {isDone ? (
                  <Check className="size-5 text-green-600" />
                ) : (
                  <Icon className={`size-5 ${isActive ? "text-[var(--brand)]" : "text-muted-foreground"}`} />
                )}
              </div>
              <span
                className={`text-sm font-medium ${isActive ? "text-foreground" : isDone ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto flex gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
