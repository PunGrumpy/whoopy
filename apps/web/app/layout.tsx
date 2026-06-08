import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { fonts } from "@/lib/fonts/index";
import { cn } from "@/lib/utils";

const title = "Whoopy";
const description = "Whoop visualise your data in a fun way";

export const metadata: Metadata = { description, title };

interface RootLayoutProps {
  readonly children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body data-scroll-behavior="smooth" className={cn("scroll-smooth", fonts)}>
      <main className="min-h-dvh text-lg tracking-[-0.01em]">{children}</main>
    </body>
  </html>
);

export default RootLayout;
