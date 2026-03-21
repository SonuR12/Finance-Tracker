import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SettingsProvider } from "@/lib/settings-context";
import { I18nProvider } from "@/lib/i18n-context";
import Providers from "@/components/Providers";
import { auth } from "@/lib/auth";
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
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance Tracker",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Track and manage your personal finances",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var html = document.documentElement;
              var t = localStorage.getItem('theme') || 'system';
              html.dataset.theme = t;
              if (t === 'dark') {
                html.classList.add('dark');
              } else if (t === 'light') {
                html.classList.remove('dark');
              } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                html.classList.add('dark');
              }
              var lang = localStorage.getItem('language');
              if (lang) html.lang = lang;
              var color = localStorage.getItem('chartColor');
              if (color) html.style.setProperty('--app-accent', color);
            } catch(e) {}
          })();
        `}} />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>
          <SettingsProvider>
            <I18nProvider>
              {children}
            </I18nProvider>
          </SettingsProvider>
        </Providers>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
