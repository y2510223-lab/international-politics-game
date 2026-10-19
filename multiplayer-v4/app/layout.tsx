import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "국익의 이름으로",
  description: "국가별 관점과 상호작용을 탐구하는 국제정치 시뮬레이션. 네 국가, 열 번의 선택.",
  openGraph: {title: "국익의 이름으로", description: "국가별 관점과 상호작용을 탐구하는 국제정치 시뮬레이션", locale: "ko_KR", type: "website"},
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
