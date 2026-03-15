import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/lib/settings-context";
import { I18nProvider } from "@/lib/i18n-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance App",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Track and manage your personal finances",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var html = document.documentElement;
              var t = localStorage.getItem('theme') || 'system';
              html.dataset.theme = t;
              if (t === 'dark') html.classList.add('dark');
              else if (t === 'light') html.classList.remove('dark');
              else if (window.matchMedia('(prefers-color-scheme: dark)').matches) html.classList.add('dark');
              var lang = localStorage.getItem('language');
              if (lang) html.lang = lang;
            } catch(e) {}
          })();
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={false}>
          <SettingsProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </SettingsProvider>
        </SessionProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
