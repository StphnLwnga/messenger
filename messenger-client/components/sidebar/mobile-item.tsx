"use client"

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import TooltipComponent from "../tooltip-component";
import { NavItemProps } from "./desktop-item";


const MobileItem = ({ href, label, icon: Icon, active, onClick }: NavItemProps) => {
  const handleClick = () => {
    if (onClick) return onClick();
  }

  return ( 
    <TooltipComponent 
      tooltipTrigger={
        <Link
          href={href}
          onClick={handleClick}
          className={cn(
            "group flex gap-x-3 text-sm leading-6 font-semibold w-[100%] justify-center p-4 hover:bg-gray-100 dark:hover:bg-slate-800/50",
            active && "bg-gray-100 dark:bg-slate-600/50",
          )}
        >
          <span className="sr-only">{label}</span>
          <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        </Link>
      } 
      tooltipContent={label}
    />
   );
}
 
export default MobileItem;