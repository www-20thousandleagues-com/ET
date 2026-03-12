import { Search, Sparkles, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function OmniPromptBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Determine context
  const isFrontPage = location.pathname === "/";
  
  const placeholderText = isFrontPage 
    ? "Search the firehose or instruct the Hunter to synthesize a new topic..." 
    : "Ask a follow-up or refine this analysis...";

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
    <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-[#0a0a0b] p-4 md:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400 dark:text-stone-500 group-focus-within:text-[#E94E3D] transition-colors" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholderText}
            className="w-full pl-12 pr-24 py-4 text-base border-2 border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-[#111112] text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded focus:outline-none focus:border-[#E94E3D] dark:focus:border-[#E94E3D] transition-all shadow-sm focus:shadow-[0_0_15px_rgba(233,78,61,0.15)]"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-stone-500 dark:text-stone-500 bg-white dark:bg-black rounded border border-stone-200 dark:border-stone-800 font-mono">
              <Command className="size-3" />
              <span>K</span>
            </kbd>
            <button 
              type="submit"
              disabled={!query.trim()}
              className="p-2 bg-stone-200 dark:bg-stone-800 hover:bg-[#E94E3D] hover:text-white dark:text-stone-400 disabled:opacity-50 disabled:hover:bg-stone-200 disabled:dark:hover:bg-stone-800 disabled:text-stone-400 text-stone-600 rounded transition-all"
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
