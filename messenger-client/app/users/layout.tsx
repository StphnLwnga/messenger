import Sidebar from "@/components/sidebar/sidebar";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}