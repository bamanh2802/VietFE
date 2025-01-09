"use client";

import { NextUIProvider } from "@nextui-org/system";
import { Provider } from "react-redux";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { store } from "@/src/store/store";

export const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          {children}
          <Toaster />
        </NextThemesProvider>
      </NextUIProvider>
    </Provider>
  );
};
