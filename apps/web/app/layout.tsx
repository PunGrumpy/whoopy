import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "whoopy";

export const metadata: Metadata = { description: "Next.js app", title };

interface RootLayoutProps {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body className="min-h-dvh antialiased">{children}</body>
  </html>
);

export default RootLayout;
