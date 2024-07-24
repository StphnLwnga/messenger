"use client"

import useConversation from "@/lib/hooks/useConversation";
import useRoutes from "@/lib/hooks/useRoutes";
import { cn } from "@/lib/utils";

import { NavItemProps } from "./desktop-item";
import MobileItem from "./mobile-item";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation()

  return (
    <div
      className="mobile-footer fixed justify-between w-full bottom-0 z-40 flex items-center border-t-[1px] lg:hidden bg-white dark:bg-slate-800/50"
    >
      {routes.map((item) => (
        <MobileItem key={item.label} {...item}/>
      ))}
    </div>
  );
}

export default MobileFooter;