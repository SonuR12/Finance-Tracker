import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Finance AI Privacy Policy. Learn how we collect, use, and protect your personal data.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
