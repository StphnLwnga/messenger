"use client"

import { User } from "@/graphql/types";
import Image from "next/image";
import TooltipComponent from "./tooltip-component";

interface AvatarProps {
  user?: User;
}

const Avatar = ({ user }: AvatarProps) => {
  return (
    <div className="relative">
      <span className="relative flex h-3 w-3 top-1 left-8 z-99999 opacity-100">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 z-100 ring-2 ring-white dark:ring-slate-800/50"></span>
      </span>
      <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11 z-index-[0]">
        <TooltipComponent
          tooltipContent={user?.name}
          tooltipTrigger={
            <Image
              alt="avatar"
              src={user?.image?.replace(/'/g, '') || "/images/avatar.png"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          }
        />
      </div>
    </div>
  );
}

export default Avatar;