"use client"

import { User } from "@/graphql/types";
import UserBox from "./user-box";

interface UsersListProps {
  users: User[];
}


const UsersList = ({ users }: UsersListProps) => {

  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 dark:border-gray-800 block w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 py-4">
            Users
          </div>
        </div>
        {users.map((user) => (
          <UserBox key={user.id} user={user} />
        ))}
      </div>
    </aside>
  );
}

export default UsersList;