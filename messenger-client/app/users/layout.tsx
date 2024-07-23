import DesktopSidebar from "@/components/sidebar/desktop-sidebar";
import MobileFooter from "@/components/sidebar/mobile-footer";
import Sidebar from "@/components/sidebar/sidebar";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      <div className="h-full">
        <DesktopSidebar />
        <MobileFooter />
        <main className="pl-20 h-full">
          {children}
        </main>
      </div>
    </Sidebar>
  );
}