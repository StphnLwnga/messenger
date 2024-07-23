import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ApolloProviderWrapper } from "@/components/providers/apollo-provider";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"
import { ToggleDarkMode } from "@/components/ui/toggle-dark";
import { Toaster } from "@/components/ui/toaster";
import { AuthContext } from "./context/auth-context";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Messenger App",
  description: "React Messenger App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthContext>
            <ApolloProviderWrapper>
              <ToggleDarkMode />
              {children}
              <Toaster />
            </ApolloProviderWrapper>
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
