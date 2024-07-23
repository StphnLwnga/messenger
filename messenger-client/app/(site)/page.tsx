"use client"

import Image from "next/image";
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import AuthForm from "./components/auth-form";

export default function Home() {
  const { resolvedTheme } = useTheme();

  return (
    <div className={cn(
      "flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8",
      resolvedTheme === 'light' && "bg-gray-100",
    )}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height={48}
          width={48}
          className="mx-auto w-auto h-auto"
          src="/images/rocket.png"
        />
        <h2 className={cn(
          "mt-6 text-center text-3xl font-bold tracking-tight",
          // resolvedTheme === 'light' && "text-gray-900",
        )}>
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}
