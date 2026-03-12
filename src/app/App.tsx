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
      <main className="flex-1 flex flex-col min-w-0">
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
    <div className="flex h-screen bg-white dark:bg-stone-950 overflow-hidden">
      <LeftNav />
      <Outlet />
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