"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import TooltipComponent from "../tooltip-component";

export interface NavItemProps {
  href: string;
  label: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const DesktopItem = ({ href, label, icon: Icon, active, onClick }: NavItemProps) => {
  const handleClick = () => {
    if (onClick) return onClick();
  }

  return (
    <li onClick={handleClick}>
      <TooltipComponent tooltipTrigger={
        <Link
          href={href}
          className={cn(
            "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800/50",
            active && "bg-gray-100 dark:bg-slate-600/50",
            label === 'Logout' && 'rotate-180'
          )}
        >
          <span className="sr-only">{label}</span>
          <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        </Link>
      } tooltipContent={label} />
    </li>
  );
}

export default DesktopItem;
