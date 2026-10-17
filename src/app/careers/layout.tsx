import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Finance AI team. Explore open roles in engineering, design, marketing and more.",
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
