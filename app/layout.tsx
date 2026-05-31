import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const lineSeedJp = localFont({
  src: [
    {
      path: "./fonts/LINESeedJP-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LINESeedJP-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-line-seed-jp",
  display: "swap",
});

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
      <body className={lineSeedJp.variable}>{children}</body>
    </html>
  );
}
