import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
