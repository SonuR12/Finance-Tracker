import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Finance AI Terms of Service. Understand your rights, responsibilities, and how we operate.",
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
