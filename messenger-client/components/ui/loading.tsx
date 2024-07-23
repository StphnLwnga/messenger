"use client"

import { cn } from "@/lib/utils";
import { LiaSpinnerSolid } from "react-icons/lia";

interface SpinnerProps {
  resolvedTheme?: string;
  size?: number;
}

export const Loading = ({ resolvedTheme, size }: SpinnerProps): JSX.Element => {
  return (
    <LiaSpinnerSolid
      className={cn(
        'animate-[spin_2s_ease-in-out_infinite] text-5xl text-gray-600',
      )}
      fill={resolvedTheme === 'dark' ? 'rgba(109, 164, 193, 1)' : 'rgba(90, 101, 149)'}
      size={size ?? 20}
    />
  )
}