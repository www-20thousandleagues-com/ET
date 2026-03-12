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
    <aside className="w-64 border-l border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex flex-col h-screen overflow-y-auto">
      <div className="p-3">
        {/* Send to Analytikeren - Danish style CTA */}
        <button className="w-full px-2 py-1.5 bg-[#E94E3D] text-white rounded hover:bg-[#d43d2d] transition-colors flex items-center justify-center gap-1.5 mb-4 text-xs font-bold">
          <Send className="size-3.5" />
          <span>Send to Analyst</span>
        </button>

        {/* Related Questions */}
        <div className="mb-4 text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-1.5 mb-2">
            <HelpCircle className="size-3.5 text-stone-500" />
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">Key Questions</h3>
          </div>
          <div className="space-y-1.5">
            {relatedQuestions.map((question, index) => (
              <button
                key={index}
                className="w-full text-left px-2 py-1.5 text-[11px] font-medium text-stone-700 dark:text-stone-300 
                  bg-white dark:bg-stone-900 
                  border border-stone-200 dark:border-stone-800 
                  hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600
                  rounded transition-all duration-200 flex items-start gap-1.5 group"
              >
                <div className="mt-0.5 shrink-0 w-3 h-3 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center group-hover:bg-stone-300 dark:group-hover:bg-stone-500 transition-colors">
                   <div className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500 group-hover:bg-stone-600 dark:group-hover:bg-stone-900 transition-colors" />
                </div>
                <span className="leading-snug flex-1">{question}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-stone-700 dark:text-stone-300">
            <TrendingUp className="size-3.5 text-stone-500" />
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">Trending</h3>
          </div>
          <div className="space-y-1.5">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                className="w-full text-left p-1.5 rounded border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-500 transition-colors flex items-center justify-between group bg-white dark:bg-stone-900"
              >
                <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                  {topic.title}
                </span>
                <span className="text-[10px] font-bold text-[#E94E3D]">
                  {topic.trend}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 p-2.5 bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wide">Queries Today</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">47</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wide">Monitored Sources</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">2,341</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wide">New Articles</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">892</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}