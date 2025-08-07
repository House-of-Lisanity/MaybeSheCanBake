import "@/styles/globals.scss";
import { siteConfig } from "@/lib/siteConfig";
import type { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata: Metadata = {
  title: siteConfig.siteName,
  description: siteConfig.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
