"use client"

import useRoutes from "@/lib/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "./desktop-item";
import { User } from "@/graphql/types";
import Avatar from "../avatar";

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar = ({ currentUser }: DesktopSidebarProps) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="hidden lg:fixed lg:left-0 lg:inset-y-0 lg:w-20 xl:px-6 
      lg:overflow-y-auto dark:lg:bg-slate-800/50 lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between
    ">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((item) => (
            <DesktopItem key={item.label} {...item} />
          ))}
        </ul>
      </nav>
      <nav className="mt-4 flex flex-col justify-between items-center">
        <div
          className="cursor-pointer hover:opacity-75 transition"
          onClick={() => setIsOpen(true)}
        >
          <Avatar user={currentUser} />
        </div>
      </nav>
    </div>
  );
}

export default DesktopSidebar;