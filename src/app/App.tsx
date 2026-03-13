import { LeftNav } from "@/app/components/LeftNav";
import { SourceStrip } from "@/app/components/SourceStrip";
import { OmniPromptBar } from "@/app/components/OmniPromptBar";
import { AnswerArea } from "@/app/components/AnswerArea";
import { RightSidebar } from "@/app/components/RightSidebar";
import { ThemeProvider } from "next-themes";
import { Routes, Route, Outlet } from "react-router-dom";
import { SettingsLayout } from "@/app/pages/SettingsLayout";
import { UserProfileSettings } from "@/app/pages/UserProfileSettings";
import { CompanySettings } from "@/app/pages/CompanySettings";
import { CommandCenter } from "@/app/pages/CommandCenter";

function DashboardLayout() {
  return (
    <>
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f1011]">
        {/* Browser Top Bar Mockup */}
        <div className="h-12 border-b border-stone-800/50 bg-[#0a0a0b] flex items-center px-4 shrink-0 relative">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="px-6 py-1 rounded-full border border-stone-800/60 bg-[#111112] text-xs font-mono text-stone-400">
              et.20thousandleagues.com
            </div>
          </div>
        </div>
        <SourceStrip />
        <OmniPromptBar />
        <AnswerArea />
      </main>
      <RightSidebar />
    </>
  );
}

function RootLayout() {
  return (
    <div className="flex h-[100dvh] w-[100dvw] bg-[#0f1011] overflow-hidden text-stone-200">
      <LeftNav />
      <div className="flex-1 overflow-hidden m-2 sm:m-4 md:m-6 xl:m-8 border border-stone-800/50 rounded-xl bg-[#0a0a0b] shadow-2xl flex relative max-h-[1400px] max-w-[2000px] mx-auto w-full h-[calc(100vh-2rem)]">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="analysis/:id" element={<DashboardLayout />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<UserProfileSettings />} />
            <Route path="profile" element={<UserProfileSettings />} />
            <Route path="company" element={<CompanySettings />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}