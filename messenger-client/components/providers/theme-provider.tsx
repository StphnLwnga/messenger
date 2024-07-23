"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * Creates a theme provider component that wraps the provided children with the NextThemesProvider component.
 *
 * @param {ReactNode} children - The children components to be wrapped.
 * @param {ThemeProviderProps} props - Additional props to be passed to the NextThemesProvider component.
 * @return {ReactNode} The wrapped children components.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps): React.ReactNode {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}