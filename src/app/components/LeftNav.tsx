import { Search, BookmarkCheck, Database, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export function LeftNav() {
  const navSections = [
    {
      title: "Daily Scan",
      icon: Search,
      items: ["Today's Briefing", "Market Movers", "Policy Updates"],
    },
    {
      title: "Saved Queries",
      icon: BookmarkCheck,
      items: ["US-China Trade", "Green Energy Policy", "Supply Chain Shifts"],
    },
    {
      title: "Sources",
      icon: Database,
      items: ["All Sources", "Premium Tier", "Custom Feeds"],
    },
  ];

  return (
    <aside className="w-64 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col h-screen">
      <div className="p-6 border-b border-stone-200 dark:border-stone-800">
        {/* Company logo */}
        <div className="mb-4">
          <ImageWithFallback
            src="https://images.squarespace-cdn.com/content/v1/6556194e9cc0e30b3030a441/78761e90-5e4a-4a8b-9224-6fdb54cde2c9/Et_Prim%E2%94%9C%C2%AAr_Vertikalt_Logo_Sort_R%E2%94%9C%E2%95%95d_RGB.png?format=1500w"
            alt="Et Primær Logo"
            className="h-16 w-auto object-contain object-left dark:invert"
          />
        </div>
        <h1 className="font-bold text-black dark:text-white tracking-tight">Jægeren</h1>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Geo-økonomisk efterretning</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="flex items-center gap-2 px-2 mb-2 text-stone-900 dark:text-stone-100">
              <section.icon className="size-4" />
              <h2 className="text-sm font-medium">{section.title}</h2>
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item}>
                  <button className="w-full text-left px-2 py-1.5 text-sm text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800 rounded flex items-center justify-between group transition-colors">
                    <span>{item}</span>
                    <ChevronRight className="size-3 text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center justify-between mb-3">
          <span>v1.2.4</span>
          <button className="text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors">Indstillinger</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-stone-500 dark:text-stone-500">Tema</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}