import { useState } from "react";
import { LiveTicker } from "@/app/components/LiveTicker";
import { CategoryNav } from "@/app/components/CategoryNav";
import { TriageFilterBar } from "@/app/components/TriageFilterBar";
import { TriageCard } from "@/app/components/TriageCard";
import { ParkingLot, BookmarkedItem } from "@/app/components/ParkingLot";
import { OmniPromptBar } from "@/app/components/OmniPromptBar";
import { MOCK_TRIAGE_DATA } from "@/app/data/mockTriageData";

export function CommandCenter() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(0);
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Initialize with 3 dummy items simulating different countdown states
  const [bookmarkedItems, setBookmarkedItems] = useState<BookmarkedItem[]>(() => {
    return MOCK_TRIAGE_DATA.slice(2, 5).map((item, index) => {
      const now = new Date();
      if (index === 0) now.setMinutes(now.getMinutes() + 45); // Under 1h (critical)
      else if (index === 1) now.setHours(now.getHours() + 2);   // Medium
      else now.setHours(now.getHours() + 5);                    // safe
      return { ...item, expiresAt: now.toISOString() };
    });
  });

  // Toggle Bookmark logic
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Stop Link navigation

    setBookmarkedItems(prev => {
      const exists = prev.find(item => item.id === id);
      if (exists) {
        return prev.filter(item => item.id !== id);
      }
      const newItem = MOCK_TRIAGE_DATA.find(item => item.id === id);
      if (newItem) {
        // Add new bookmark with default 6 hour lifespan
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 6);
        return [{ ...newItem, expiresAt: expiry.toISOString() }, ...prev];
      }
      return prev;
    });
  };

  // Filter data based on threshold
  const filteredData = MOCK_TRIAGE_DATA.filter((item: any) => item.metrics.confidence >= confidenceThreshold);

  return (
    <div className="flex-1 overflow-y-auto bg-stone-100 dark:bg-black flex flex-col no-scrollbar">
      {/* Global Telemetry & Nav */}
      <LiveTicker />
      <CategoryNav />
      <OmniPromptBar />
      
      {/* Sticky Triage Controls */}
      <TriageFilterBar 
        confidenceThreshold={confidenceThreshold}
        setConfidenceThreshold={setConfidenceThreshold}
        isCompactMode={isCompactMode}
        setIsCompactMode={setIsCompactMode}
      />

      {/* Bookmarked Staging Area (Auto-expands if items exist) */}
      <ParkingLot 
        items={bookmarkedItems} 
        onRemove={toggleBookmark}
      />

      {/* Main Triage Feed */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto min-h-full">
          
          <div className="mb-6 flex items-end justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
            <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tighter uppercase">
              Triage Feed <span className="text-[#E94E3D] ml-2">{filteredData.length}</span>
            </h1>
            <span className="text-xs font-mono text-stone-500 uppercase">Live Output</span>
          </div>

          {/* Dynamic Grid / Flex Layout */}
          {isCompactMode ? (
            // Force Compact List Mode
            <div className="flex flex-col bg-white dark:bg-[#0a0a0b] border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden shadow-sm">
               {filteredData.map((item: any) => (
                 <TriageCard 
                   key={item.id} 
                   data={item} 
                   forceCompact={true} 
                   isBookmarked={bookmarkedItems.some(b => b.id === item.id)}
                   onToggleBookmark={toggleBookmark}
                 />
               ))}
               {filteredData.length === 0 && (
                 <div className="p-12 text-center text-stone-500 font-mono text-sm">No synthesis matches current filters.</div>
               )}
            </div>
          ) : (
            // Variable Density Masonry-style Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
              {filteredData.map((item: any) => (
                <div key={item.id} className={item.metrics.confidence >= 85 ? 'md:col-span-2 lg:col-span-2 xl:col-span-2' : 'col-span-1'}>
                   <TriageCard 
                     data={item} 
                     forceCompact={false} 
                     isBookmarked={bookmarkedItems.some(b => b.id === item.id)}
                     onToggleBookmark={toggleBookmark}
                   />
                </div>
              ))}
               {filteredData.length === 0 && (
                 <div className="col-span-full p-24 text-center text-stone-500 font-mono text-sm">No synthesis matches current filters.</div>
               )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
