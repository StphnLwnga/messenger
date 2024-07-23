"use client"

import {useTheme} from 'next-themes';
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TooltipComponent from '@/components/tooltip-component';

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

export const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon, 
  onClick, 
} ): JSX.Element => {
  const {resolvedTheme} = useTheme();

  return ( 
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        "w-full justify-center gap-2 border-2 shadow-sm rounded-md",
        resolvedTheme === 'dark' && "hover:bg-gray-500"
      )}
    >
      <Icon/>
    </Button>
  );
}