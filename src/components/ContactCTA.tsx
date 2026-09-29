import Link from "next/link";
import Container from "./Container";
import { site } from "@/data/site";

/** 페이지 하단 공통 문의 유도 블록. */
export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-[0.09]"
      />
      <Container className="relative py-14 sm:py-20">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
              공급할 부품을 보내 주시면
              <br className="hidden sm:block" /> 맞는 피더를 설계해 드립니다.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              부품 샘플이나 도면, 필요한 공급 속도만 알려 주세요. 형상을 분석해
              제작 가능 여부와 예상 일정을 회신드립니다.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:px-8"
            >
              온라인 문의하기
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <a
              href={`tel:${site.tel.replace(/-/g, "")}`}
              className="inline-flex items-center justify-center rounded-lg border border-white/45 px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 sm:px-8"
            >
              전화 {site.tel}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
