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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  verification: {
    google: "HN3fzLREBKFaLgowG7iQcm5O02Vw3tyz5vkpwpftbiA",
  },
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance Tracker",
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance Tracker"}`,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Track and manage your personal finances with AI-powered insights.",
  applicationName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance Tracker",
  keywords: [
    "finance tracker", "personal finance", "AI finance", "expense tracker",
    "budget tracker", "income tracker", "spending insights", "CGPA calculator",
    "money management", "financial dashboard",
  ],
  authors: [{ name: "Sonu Rai", url: "https://www.linkedin.com/in/sonu-rai-55473a289/" }],
  creator: "Sonu Rai",
  publisher: "Sonu Rai",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance Tracker",
    title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance Tracker",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Track and manage your personal finances with AI-powered insights.",
    images: [{ url: "/Group.png", width: 1200, height: 630, alt: "Finance Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Finance Tracker",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "Track and manage your personal finances with AI-powered insights.",
    images: ["/Group.png"],
  },
  icons: {
    apple: "/svg/logo.svg",
  },
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
        <meta name="google-site-verification" content="xVPvfVnEJ0BB0VkgOJoeIfncc7H1Tus9oQi9j-Za1ig" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var html = document.documentElement;
              var stored = localStorage.getItem('app_settings_v2');
              var t = 'system', color = '#6366f1', lang = 'en';
              if (stored) {
                var s = JSON.parse(stored);
                t = s.theme || t;
                color = s.accentColor || color;
                lang = s.language || lang;
              } else {
                t = localStorage.getItem('theme') || t;
                color = localStorage.getItem('accentColor') || color;
                lang = localStorage.getItem('language') || lang;
              }
              html.dataset.theme = t;
              if (t === 'dark') html.classList.add('dark');
              else if (t === 'light') html.classList.remove('dark');
              else if (window.matchMedia('(prefers-color-scheme: dark)').matches) html.classList.add('dark');
              html.lang = lang;
              html.style.setProperty('--app-accent', color);
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



