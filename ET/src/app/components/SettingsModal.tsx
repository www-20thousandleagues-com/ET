import { useState } from "react";
import { X, Plus, Trash2, Tag, Globe, Eye } from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { useLocaleStore } from "@/stores/locale";
import { toast } from "sonner";

export function SettingsModal() {
  const t = useLocaleStore((s) => s.t);
  const {
    topics,
    addTopic,
    removeTopic,
    geographies,
    addGeography,
    removeGeography,
    lenses,
    addLens,
    removeLens,
    closeSettings,
  } = useSettingsStore();

  const [newTopic, setNewTopic] = useState("");
  const [newGeo, setNewGeo] = useState("");
  const [newLensName, setNewLensName] = useState("");
  const [newLensPrompt, setNewLensPrompt] = useState("");

  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    addTopic(newTopic);
    setNewTopic("");
  };

  const handleAddGeo = () => {
    if (!newGeo.trim()) return;
    addGeography(newGeo);
    setNewGeo("");
  };

  const handleAddLens = () => {
    if (!newLensName.trim() || !newLensPrompt.trim()) return;
    addLens(newLensName, newLensPrompt);
    setNewLensName("");
    setNewLensPrompt("");
  };

  const handleSave = () => {
    toast.success(t.settings.saved);
    closeSettings();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSettings} />
      <div className="fixed inset-4 sm:inset-x-auto sm:inset-y-8 sm:max-w-2xl sm:mx-auto bg-card border-2 border-foreground rounded-lg shadow-xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{t.settings.title}</h2>
          <button
            onClick={closeSettings}
            className="p-1.5 hover:bg-accent rounded transition-colors"
            aria-label={t.settings.close}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Topics */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="size-4 text-[var(--brand)]" />
              <h3 className="text-sm font-bold text-foreground">{t.settings.topics}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t.settings.topicsDescription}</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                placeholder={t.settings.topicPlaceholder}
                className="flex-1 px-3 py-2 text-sm border-2 border-border bg-background text-foreground rounded focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                onClick={handleAddTopic}
                disabled={!newTopic.trim()}
                className="px-3 py-2 bg-[var(--brand)] text-white rounded hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
              >
                <Plus className="size-4" />
              </button>
            </div>
            {topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent text-foreground rounded-full border border-border"
                  >
                    {topic}
                    <button
                      onClick={() => removeTopic(topic)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={t.settings.remove}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">{t.settings.noTopics}</p>
            )}
          </section>

          {/* Geographies */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="size-4 text-[var(--brand)]" />
              <h3 className="text-sm font-bold text-foreground">{t.settings.geographies}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t.settings.geographiesDescription}</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newGeo}
                onChange={(e) => setNewGeo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddGeo()}
                placeholder={t.settings.geographyPlaceholder}
                className="flex-1 px-3 py-2 text-sm border-2 border-border bg-background text-foreground rounded focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                onClick={handleAddGeo}
                disabled={!newGeo.trim()}
                className="px-3 py-2 bg-[var(--brand)] text-white rounded hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
              >
                <Plus className="size-4" />
              </button>
            </div>
            {geographies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {geographies.map((geo) => (
                  <span
                    key={geo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800"
                  >
                    {geo}
                    <button
                      onClick={() => removeGeography(geo)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={t.settings.remove}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">{t.settings.noGeographies}</p>
            )}
          </section>

          {/* Lenses */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="size-4 text-[var(--brand)]" />
              <h3 className="text-sm font-bold text-foreground">{t.settings.lenses}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t.settings.lensesDescription}</p>
            <div className="space-y-2 mb-3">
              <input
                type="text"
                value={newLensName}
                onChange={(e) => setNewLensName(e.target.value)}
                placeholder={t.settings.lensNamePlaceholder}
                className="w-full px-3 py-2 text-sm border-2 border-border bg-background text-foreground rounded focus:outline-none focus:border-foreground transition-colors"
              />
              <textarea
                value={newLensPrompt}
                onChange={(e) => setNewLensPrompt(e.target.value)}
                placeholder={t.settings.lensPromptPlaceholder}
                rows={2}
                className="w-full px-3 py-2 text-sm border-2 border-border bg-background text-foreground rounded focus:outline-none focus:border-foreground transition-colors resize-none"
              />
              <button
                onClick={handleAddLens}
                disabled={!newLensName.trim() || !newLensPrompt.trim()}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--brand)] text-white rounded hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
              >
                <Plus className="size-4" />
                <span>{t.settings.addLens}</span>
              </button>
            </div>
            {lenses.length > 0 ? (
              <div className="space-y-2">
                {lenses.map((lens) => (
                  <div key={lens.id} className="p-3 border-2 border-border rounded bg-background">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full mb-1">
                          <Eye className="size-3" />
                          {lens.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lens.prompt}</p>
                      </div>
                      <button
                        onClick={() => removeLens(lens.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={t.settings.remove}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">{t.settings.noLenses}</p>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <button
            onClick={handleSave}
            className="w-full px-4 py-3 bg-[var(--brand)] text-white rounded hover:bg-[var(--brand-hover)] transition-colors font-medium"
          >
            {t.settings.save}
          </button>
        </div>
      </div>
    </>
  );
}
