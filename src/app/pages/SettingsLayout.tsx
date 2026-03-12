import { Outlet, Link, useLocation } from "react-router-dom";
import { User, Building2 } from "lucide-react";

export function SettingsLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Brugerprofil", path: "/settings/profile", icon: User },
    { name: "Organisation", path: "/settings/company", icon: Building2 },
  ];

  return (
    <div className="flex-1 flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 flex flex-col overflow-y-auto">
        <h2 className="text-lg font-bold text-black dark:text-white mb-6">Indstillinger</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-stone-100 dark:bg-stone-800 text-black dark:text-white font-medium"
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-black dark:hover:text-white"
                }`}
              >
                <item.icon className="size-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Settings Content Area */}
      <main className="flex-1 overflow-y-auto p-8 max-w-4xl">
        <Outlet />
      </main>
    </div>
  );
}
