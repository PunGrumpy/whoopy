import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "../utils";

export const sans = localFont({
  display: "swap",
  src: [
    {
      path: "./soehne-buch.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "./soehne-kraftig.woff2",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fonts = cn(
  "touch-manipulation font-sans antialiased",
  sans.variable,
  mono.variable
);
