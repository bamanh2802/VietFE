"use client";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/src/store/store";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fontSans, fontMono } from "@/config/fonts";
import useDarkMode from "@/src/hook/useDarkMode";
import { useTheme } from "next-themes";

declare global {
  interface Window {
    handleTheme: () => void;
  }
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};

function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const savedTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
      
      setTheme(savedTheme);
      if (savedTheme === "light" && isDarkMode) {
        toggleDarkMode();
      }
      
      localStorage.setItem("theme", savedTheme);

      window.handleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        toggleDarkMode();
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
      };
    }
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}

export function ClientProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const isAuthenticated = !!token;

      const publicRoutes = ["/", "/login"];
      const isPublicRoute = publicRoutes.includes(pathname);
      const isShareRoute = pathname.startsWith("/share/");

      if (isAuthenticated && isPublicRoute) {
        router.replace("/home");
      } else if (!isAuthenticated && !isPublicRoute && !isShareRoute) {
        router.replace("/login");
      }

      setIsLoading(false);
    }
  }, [pathname, router]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <Provider store={store}>
        <NextUIProvider>
          <NextThemesProvider 
            attribute="class" 
            defaultTheme="light" 
            enableSystem
            disableTransitionOnChange
          >
            {/* Loading state */}
          </NextThemesProvider>
        </NextUIProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem
          disableTransitionOnChange
        >
          <ThemeWrapper>
            {children}
            <Toaster />
          </ThemeWrapper>
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
  );
}