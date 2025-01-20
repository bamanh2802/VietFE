"use client";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/src/store/store";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fontSans, fontMono } from "@/config/fonts";

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};

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

    if (!isAuthenticated && !isPublicRoute && !isShareRoute) {
      router.push("/login");
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <Provider store={store}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            {/* You could add a loading spinner here if desired */}
          </NextThemesProvider>
        </NextUIProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster />
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
  );
}