import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "파츠피더 제작 문의. 공급할 부품의 종류와 필요한 공급 속도를 알려 주시면 제작 가능 여부와 예상 일정을 회신드립니다.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT"
        title="문의하기"
        lead="부품 샘플이나 도면만 있으면 충분합니다. 형상을 분석해 제작 가능 여부와 예상 일정을 회신드립니다."
      />

      <div className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-lg font-bold text-ink">온라인 문의</h2>
              <p className="mt-2 text-sm text-muted">
                <span className="text-brand">*</span> 표시는 필수 항목입니다.
              </p>
              <div className="mt-8">
                <InquiryForm />
              </div>
            </div>

            <aside className="space-y-6 self-start">
              <div className="rounded-lg border border-line bg-surface p-7">
                <h2 className="text-sm font-bold tracking-[0.15em] text-ink">
                  바로 연락하기
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  급한 건이라면 전화가 가장 빠릅니다.
                </p>
                <a
                  href={`tel:${site.tel.replace(/-/g, "")}`}
                  className="mt-5 block rounded bg-navy px-6 py-4 text-center text-base font-bold tabular-nums text-white transition-colors hover:bg-navy-deep"
                >
                  {site.tel}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-3 block rounded border border-line bg-white px-6 py-3.5 text-center text-sm font-semibold text-ink-soft transition-colors hover:text-brand"
                >
                  {site.email}
                </a>
                <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted">
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 text-ink-soft">팩스</dt>
                    <dd className="tabular-nums">{site.fax}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 text-ink-soft">운영</dt>
                    <dd>
                      {site.hours.weekday}
                      <br />
                      {site.hours.holiday}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 text-ink-soft">주소</dt>
                    <dd className="leading-relaxed">
                      {site.address.road}
                      <Link
                        href="/location"
                        className="mt-1.5 block font-semibold text-navy underline underline-offset-4 hover:text-brand"
                      >
                        오시는 길 보기
                      </Link>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg border border-line p-7">
                <h2 className="text-sm font-bold tracking-[0.15em] text-ink">
                  이런 내용을 알려 주세요
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
                  {[
                    "공급할 부품의 종류와 대략적인 크기",
                    "시간당 필요한 공급 수량",
                    "연결될 후공정 설비 (조립기, 검사기 등)",
                    "설치 공간의 제약이나 소음 조건",
                    "희망 납기",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="text-brand">
                        ·
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
