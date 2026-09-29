import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | 파츠피더 · 볼피더 · 직진피더 제작`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "파츠피더",
    "볼피더",
    "직진피더",
    "호퍼피더",
    "방음커버",
    "부품 자동정렬 공급기",
    "유신 F.A 시스템",
    "시흥 파츠피더",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: `${site.name} | 파츠피더 · 볼피더 · 직진피더 제작`,
    description: site.description,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* 모든 페이지 상단 배너의 CSS 배경이라 LCP로 잡힌다.
            CSS 안에 있으면 브라우저가 늦게 발견하므로 문서에서 미리 알린다.
            (React가 이 link 태그를 <head>로 끌어올린다) */}
        <link
          rel="preload"
          as="image"
          href="/images/blueprint-bg.webp"
          fetchPriority="high"
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
