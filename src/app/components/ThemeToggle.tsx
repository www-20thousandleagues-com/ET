import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 hover:bg-stone-100 rounded transition-colors">
        <Sun className="size-4 text-stone-600" />
      </button>
    );
  }

  const themeOptions = [
    { value: "light", label: "Lys", icon: Sun },
    { value: "dark", label: "Mørk", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const currentIcon = themeOptions.find((opt) => opt.value === theme)?.icon || Sun;
  const Icon = currentIcon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
        title="Skift tema"
      >
        <Icon className="size-4 text-stone-600 dark:text-stone-400" />
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute left-0 bottom-full mb-2 w-40 bg-white dark:bg-stone-900 border-2 border-black dark:border-stone-700 rounded shadow-lg z-20">
            <div className="py-1">
              {themeOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <OptionIcon className="size-4" />
                      <span>{option.label}</span>
                    </div>
                    {theme === option.value && (
                      <Check className="size-3 text-black dark:text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
