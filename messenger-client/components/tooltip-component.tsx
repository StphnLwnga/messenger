import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface TooltipComponentProps {
  tooltipTrigger?: React.ReactNode | string | null;
  tooltipContent?: React.ReactNode | string | null;
}

/**
* Renders a tooltip component.
*
* @param {TooltipComponentProps} tooltipTrigger - The element that triggers the tooltip.
* @param {TooltipComponentProps} tooltipContent - The content to be displayed in the tooltip.
* @return {JSX.Element} The rendered tooltip component.
*/
const TooltipComponent = ({ tooltipTrigger, tooltipContent }: TooltipComponentProps): JSX.Element => {
  const { resolvedTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{tooltipTrigger}</TooltipTrigger>
        <TooltipContent  className={cn(
          "bg-gray-100/90 text-gray-500 text-sm z-5000",
          resolvedTheme === 'dark' && "bg-gray-900 text-gray-200",
        )}>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default TooltipComponent;