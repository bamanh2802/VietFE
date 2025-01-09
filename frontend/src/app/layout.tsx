import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ClientProviders } from "./CilentProviders";
import { ReactNode } from "react";
import "@/styles/globals.css";
import "@/styles/config.css";
import "remixicon/fonts/remixicon.css";

export const metadata = {
  title: "Your App Title",
  description: "Your app description",
};

type Props = {
  children: ReactNode;
  params: { locale: string }
}

export default async function RootLayout({
  children,
  params: {locale}
}: 
  Props
) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders>{children}</ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
