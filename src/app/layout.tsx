import type { Metadata } from "next";

import { appConfig } from "@/config/app";

import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
