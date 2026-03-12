import React from "react";

export function CompanySettings() {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <h2 className="text-xl font-bold text-black dark:text-white">Organisation</h2>
        <p className="mt-1 text-sm text-stone-500">
          Administrer globale indstillinger for Erhvervslivets Tænketank.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Organisationsindstillinger vil være tilgængelige her i fremtidige opdateringer, 
          hvilket muliggør styring af rettigheder og opsætning for de kommende applikationer.
        </p>
      </div>
    </div>
  );
}
