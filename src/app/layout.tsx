import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://foodoem-connect.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FoodOEM Connect | 飲食店とOEM工場をつなぐ",
    template: "%s | FoodOEM Connect",
  },
  description:
    "音声AIであなたの要望を伝えるだけ。最適な食品OEM工場が見つかるマッチングプラットフォーム。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "FoodOEM Connect",
    title: "FoodOEM Connect | 飲食店とOEM工場をつなぐ",
    description:
      "音声AIであなたの要望を伝えるだけ。最適な食品OEM工場が見つかるマッチングプラットフォーム。",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodOEM Connect",
    description:
      "音声AIで最適な食品OEM工場が見つかるマッチングプラットフォーム。",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="theme-color" content="#EA580C" />
        <link rel="apple-touch-icon" href="/apple-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
