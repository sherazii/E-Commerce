import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/application/admin/AppSidebar";
import Topbar from "@/components/application/admin/Topbar";
import ThemeProvider from "@/components/application/admin/ThemeProvider";

const layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className=" md:w-[calc(100vw-16rem)]">
          <div className="px-6 min-h-[calc(100vh-54px)] pt-[60px]">
            <Topbar />
            {children}
          </div>
          <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
            © 2025 Muhammad Sheraz — Designed & Developed by Sheraz with passion
            for code.
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default layout;
