import { Search, Sparkles, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function OmniPromptBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Determine context
  const isFrontPage = location.pathname === "/";
  const { t } = useTranslation();
  
  const placeholderText = isFrontPage 
    ? t('prompt.search_macro')
    : t('prompt.search_micro');

  // Keyboard shortcut: Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (isFrontPage) {
      // Mock routing to a deep dive analysis
      navigate("/analysis/new-synthesis-mock");
    } else {
      // Mock appending a query (just clear for now)
      setQuery("");
      // In a real app, you would pass this to an API or global state
    }
  };

  return (
    <div className="bg-[#0f1011] p-4 md:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-[#5F5F5F] group-focus-within:text-[#ef4444] transition-colors" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderText}
            className="w-full pl-14 pr-24 py-5 text-[15px] outline-none bg-[#0a0a0b] text-white placeholder:text-[#5F5F5F] border border-[#1C1C1D] shadow-sm rounded-lg focus:border-[#ef4444] transition-all focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className="hidden sm:flex items-center justify-center h-7 px-2 text-[10px] text-[#5F5F5F] font-bold bg-[#111112] rounded border border-[#1C1C1D] font-mono">
              CMD + K
            </kbd>
            <button 
              type="submit"
              disabled={!query.trim()}
              className="w-8 h-8 flex items-center justify-center bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-50 disabled:bg-[#1C1C1D] text-white rounded transition-all"
            >
              <Sparkles className="size-4" />
            </button>
          </div>
        </form>
        
        {/* Quick Queries (Optional, just matching original query area functionality) */}
        {!isFrontPage && (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-stone-500 dark:text-stone-500 uppercase tracking-wider font-bold">Quick Actions:</span>
            <div className="flex gap-2">
              {["Expand Timeline", "Find Contradictions", "Summarize Sentiment"].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600 rounded transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
