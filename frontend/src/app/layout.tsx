import { Metadata } from 'next';
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ClientProviders } from './CilentProviders';
import { ReactNode } from "react";
import "@/styles/globals.css";
import "@/styles/config.css";
import "remixicon/fonts/remixicon.css";

// Metadata configuration
export const metadata: Metadata = {
  title: "Viet",
  description: "Your app description",
  icons: {
    icon: "/favicon.ico",
  },
};

// Export viewport independently
export const viewport = "width=device-width, initial-scale=1";

type Props = {
  children: ReactNode;
  params: { locale: string }
};

export default async function RootLayout({
  children,
  params: { locale }
}: Props) {
  const messages = await getMessages();

  return (
    <html dir='ltr' lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Ho_Chi_Minh">
          <ClientProviders>{children}</ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
