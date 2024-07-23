"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { FcIdea, FcNoIdea } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import TooltipComponent from "@/components/tooltip-component"

/**
 * Renders a mode toggle component.
 *
 * @return {JSX.Element} The rendered mode toggle component.
 */
export function ToggleDarkMode(): JSX.Element {
  const { setTheme, theme } = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = (): void => {
    setTheme(isDarkTheme ? "light" : "dark");
    setIsDarkTheme(!isDarkTheme);
  }

  useEffect(() => {
    setIsDarkTheme(theme === "dark");
  }, [theme]);

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={toggleTheme}
        style={{
          position: "fixed",
          right: 10,
          top: 2,
        }}
      >
        {!isDarkTheme ? (
          <TooltipComponent
            tooltipTrigger={
              <FcNoIdea className="h-[1.2rem] w-[1.2rem] transition-all z-55" />
            }
            tooltipContent="Dark Mode"
          />
        ) : (
          <TooltipComponent
            tooltipTrigger={
              <FcIdea className="h-[1.2rem] w-[1.2rem] transition-all z-55" />
            }
            tooltipContent="Light Mode"
          />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>

  )
}