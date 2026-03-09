import { Component, type ReactNode } from "react";
import { useLocaleStore } from "@/stores/locale";

function SectionErrorFallback({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const t = useLocaleStore((s) => s.t);
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div>
        <p className="text-sm text-muted-foreground mb-2">{t.common.errorTitle}</p>
        <p className="text-xs text-muted-foreground mb-3">{error.message}</p>
        <button
          onClick={onRetry}
          className="text-xs px-3 py-1.5 rounded bg-accent hover:bg-accent/80 text-foreground transition-colors"
        >
          {t.common.retry}
        </button>
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return <SectionErrorFallback error={this.state.error} onRetry={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}
