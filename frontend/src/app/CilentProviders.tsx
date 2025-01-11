"use client";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/src/store/store";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import đúng từ next/navigation
import { fontSans, fontMono } from "@/config/fonts";

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};

export function ClientProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Lấy pathname từ next/navigation
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isAuthenticated = !!token;

    // Các route công khai không yêu cầu đăng nhập
    const publicRoutes = ["/", "/login"];
    const isPublicRoute = ""

    // Kiểm tra nếu đường dẫn là một route chia sẻ
    const isShareRoute = ""

    if (!isAuthenticated && !isPublicRoute && !isShareRoute) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  if (isLoading) {
    return null; // Hoặc một spinner load dữ liệu
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
