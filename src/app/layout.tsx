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
{/* 홈 히어로 배경 영상의 정지컷. 영상이 뜨기 전까지 이게 보이므로
            미리 알려 LCP를 앞당긴다. 영상 자체는 preload 하지 않는다 —
            첫 화면 페인트가 늦어진다.
            (React가 이 link 태그를 <head>로 끌어올린다) */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-poster.webp"
          fetchPriority="high"
        />
        {/* 스크롤 리빌은 opacity:0 에서 시작한다. JS가 막히면 내용이 영영
            안 보이므로 되돌려 준다. */}
        <noscript>
          <style>{`.reveal,.sign-ink{opacity:1;transform:none}`}</style>
        </noscript>
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
