import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Header from "@/components/Header";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import { site } from "@/data/site";
import "./globals.css";

/* ⚠️⚠️ weight 키가 **없다.** 지우면 next/font 가 가변 폰트로 선언한다
       (font-weight: 100 900). 무게를 적어 넣으면 그 값으로 **축이 고정된다.**

       한동안 weight: ["400","500","700"] 이었다. 그런데 소스는
       font-semibold(600) 23곳 · font-extrabold(800) 3곳을 쓴다. 브라우저에서
       100px 라틴 렌더 폭을 재 보면 —

         무게   고정 3개일 때   가변일 때
         400      1227.3        1227.3
         500      1251.8        1251.8
         600      1283.4  <-!   1267.5
         700      1283.4        1283.4
         800      1283.4  <-!   1299.3

       600·800 은 합성 볼드가 아니라 **700 페이스로 떨어졌다.** 그래서
       semibold(23) · bold(54) · extrabold(3) 80곳이 화면에서 똑같아 보였고,
       의도한 3단 계층(medium/semibold/bold)이 2단으로 눌려 있었다.

       ⚠️ 바꾸는 값이 공짜다. 빌드 산출물을 뜯어 보면 **고정 세 무게가 같은
          woff2 124개를 가리키고 있었다** — next/font 는 처음부터 가변 파일을
          받아 놓고 @font-face 를 세 벌로 복사해 무게만 박아 넣어, 중간 값을
          버리고 있었다. 그래서 가변으로 바꿔도 받는 폰트 파일은 **한 바이트도
          안 늘고**, 중복 선언만 걷힌다 —

            @font-face   373 -> 125
            공용 CSS     gzip 78.6KB -> 26.2KB  (-52.4KB, -67%)
            쓸 수 있는 무게  400·500·700 -> 100~900 전 구간

       ⚠️ weight 를 되살리지 말 것. 한 무게만 쓰고 싶어도 고정으로 적는 순간
          축이 잘리고 CSS 는 오히려 늘어난다(무게당 @font-face 124개).
          한글은 Noto Sans KR 에서 **전진폭이 무게와 무관하게 고정**이라,
          무게를 바꿔도 한글 줄바꿈은 변하지 않는다(라틴만 폭이 변한다). */
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
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
        {/* 스크롤 리빌은 opacity:0 에서 시작한다. JS가 막히면 내용이 영영
            안 보이므로 되돌려 준다. */}
        <noscript>
          <style>{`.reveal,.sign-ink,.org-node{opacity:1;transform:none}.org-drop::before,.org-span-l::after,.org-span-r::after{transform:none}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
