import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { useState } from "react";
import { Provider } from "react-redux";
import { useEffect } from "react";
import {NextIntlClientProvider} from 'next-intl';
import { store } from "@/src/store/store";
import { Toaster } from "@/components/ui/toaster";
import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import '@/styles/config.css'
import "remixicon/fonts/remixicon.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const isAuthenticated = !!token;
  
    // Các đường dẫn công khai không yêu cầu đăng nhập
    const publicRoutes = ['/', '/login'];
    const isPublicRoute = publicRoutes.includes(router.pathname);
  
    // Kiểm tra nếu đường dẫn khớp với /share/:shareId
    const isShareRoute = router.pathname.startsWith('/share/');
  
    if (!isAuthenticated && !isPublicRoute && !isShareRoute) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);
  

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Asia/Ho_Chi_Minh"
      messages={pageProps.messages}
    >
    <Provider store={store}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <Component {...pageProps} />
          <Toaster />
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
    </NextIntlClientProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
