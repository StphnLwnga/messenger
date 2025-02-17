"use client"

import { SessionProvider } from "next-auth/react"

interface AuthContextProps {
  children: React.ReactNode;
}

export function AuthContext({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}