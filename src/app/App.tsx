import { LeftNav } from "@/app/components/LeftNav";
import { SourceStrip } from "@/app/components/SourceStrip";
import { QueryArea } from "@/app/components/QueryArea";
import { AnswerArea } from "@/app/components/AnswerArea";
import { RightSidebar } from "@/app/components/RightSidebar";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-white dark:bg-stone-950 overflow-hidden">
        {/* Left Navigation */}
        <LeftNav />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <SourceStrip />
          <QueryArea />
          <AnswerArea />
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </ThemeProvider>
  );
}