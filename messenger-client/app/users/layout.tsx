import getUsers from "@/actions/getUsers";
import Sidebar from "@/components/sidebar/sidebar";
import UsersList from "./components/users-list";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <UsersList users={users} />
        {children}
      </div>
    </Sidebar>
  );
}