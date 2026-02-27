import { Search, Sparkles, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function QueryArea() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400 dark:text-stone-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Spørg om geopolitiske skift, økonomiske politikker, handelsmønstre..."
          className="w-full pl-12 pr-24 py-4 text-base border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-black dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
            <Command className="size-3" />
            <span>K</span>
          </kbd>
          <button className="p-2 bg-[#E94E3D] text-white rounded hover:bg-[#d43d2d] transition-colors">
            <Sparkles className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-stone-600 dark:text-stone-400">Hurtige forespørgsler:</span>
        <div className="flex gap-2">
          {["US toldpolitik", "Kinas EV-subsidier", "EU's CO2-afgift"].map((q) => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="px-3 py-1 text-xs border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}