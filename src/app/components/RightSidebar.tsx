import { Send, HelpCircle, TrendingUp } from "lucide-react";

export function RightSidebar() {
  const relatedQuestions = [
    "Hvad er konsekvenserne for europæiske halvlederfirmaer?",
    "Hvordan påvirker dette effektiviteten af USA's eksportkontrol?",
    "Hvilke lande vil sandsynligvis drage fordel af forsyningskædeskift?",
    "Hvad er tidslinjen for Kinas selvforsyningsmål?",
    "Hvordan reagerer Taiwan og Sydkorea på disse udviklinger?",
  ];

  const trendingTopics = [
    { title: "Grøn transition metaller", trend: "+24%" },
    { title: "Digital valutapolitik", trend: "+18%" },
    { title: "Infrastruktur finansiering", trend: "+12%" },
  ];

  return (
    <aside className="w-80 border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col h-screen overflow-y-auto">
      <div className="p-6">
        {/* Send to Analytikeren - Danish style CTA */}
        <button className="w-full px-4 py-3 bg-[#E94E3D] text-white rounded hover:bg-[#d43d2d] transition-colors flex items-center justify-center gap-2 mb-6 font-medium">
          <Send className="size-4" />
          <span>Send til Analytikeren</span>
        </button>

        {/* Related Questions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="size-4 text-stone-700 dark:text-stone-300" />
            <h3 className="text-sm font-bold text-black dark:text-white">Relaterede spørgsmål</h3>
          </div>
          <div className="space-y-2">
            {relatedQuestions.map((question, index) => (
              <button
                key={index}
                className="w-full text-left p-3 text-sm text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-black dark:hover:border-white bg-white dark:bg-stone-900 rounded transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-4 text-stone-700 dark:text-stone-300" />
            <h3 className="text-sm font-bold text-black dark:text-white">Trending emner</h3>
          </div>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded border-2 border-stone-200 dark:border-stone-700 hover:border-black dark:hover:border-white transition-colors flex items-center justify-between group bg-white dark:bg-stone-900"
              >
                <span className="text-sm text-stone-800 dark:text-stone-200 group-hover:text-black dark:group-hover:text-white">
                  {topic.title}
                </span>
                <span className="text-xs font-bold text-[#E94E3D]">
                  {topic.trend}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-950 rounded border-2 border-stone-200 dark:border-stone-700">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-700 dark:text-stone-300">Forespørgsler i dag</span>
              <span className="text-sm font-bold text-black dark:text-white">47</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-700 dark:text-stone-300">Overvågede kilder</span>
              <span className="text-sm font-bold text-black dark:text-white">2.341</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-700 dark:text-stone-300">Nye artikler</span>
              <span className="text-sm font-bold text-black dark:text-white">892</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}