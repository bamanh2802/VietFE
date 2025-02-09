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

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};

function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  useEffect(() => {
    // Sync initial theme with system preference
    setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode, setTheme]);

  // Expose theme handling function globally
  // @ts-ignore - Window type extension
  window.handleTheme = () => {
    toggleDarkMode();
    setTheme(isDarkMode ? "light" : "dark");
  };

  return <>{children}</>; // Wrap children in a fragment to ensure valid JSX
}

export function ClientProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isAuthenticated = !!token;

    const publicRoutes = ["/", "/login"];
    const isPublicRoute = publicRoutes.includes(pathname);
    const isShareRoute = pathname.startsWith("/share/");

    if (isAuthenticated && isPublicRoute) {
      // If logged in and on public routes, redirect to /home
      router.push("/home");
    } else if (!isAuthenticated && !isPublicRoute && !isShareRoute) {
      // If not logged in and not on public or share routes, redirect to /login
      router.push("/login");
    }

    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <Provider store={store}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {/* You could add a loading spinner here if desired */}
          </NextThemesProvider>
        </NextUIProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeWrapper>
            {children}
            <Toaster />
          </ThemeWrapper>
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
  );
}
