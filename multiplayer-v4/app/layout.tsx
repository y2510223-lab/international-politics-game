import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "긴장의 시대 · 2~4인 국제정치",
  description: "네 국가, 열 번의 선택. 2~4명이 동시에 만드는 국제정치 전략 게임.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
