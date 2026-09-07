import type { Metadata } from "next";
import { PageTransitionProvider } from "@/components/PageTransitionProvider";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "soh okano — Work",
  description: "Selected work by soh okano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PageTransitionProvider>
          <SiteHeader />
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}
