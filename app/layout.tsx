import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const lineSeedJp = localFont({
  src: [
    {
      path: "./fonts/LINESeedJP_OTF_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LINESeedJP_OTF_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
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
      <body className={lineSeedJp.className}>{children}</body>
    </html>
  );
}
