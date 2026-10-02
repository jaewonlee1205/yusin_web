import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import { site, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "파츠피더 제작 문의. 공급할 부품의 종류와 필요한 공급 속도를 알려 주시면 제작 가능 여부와 예상 일정을 회신드립니다.",
};

export default function ContactPage() {
  return (
    <>
      {/* 전에는 55자라 320·360px 에서 세 줄이 되어, 이 배너만 232 -> 258px 로
          길었다. 뜻은 그대로 두고 길이만 줄였다. 위 검색 설명은 그대로 둔다 —
          거기서는 긴 문장이 불리하지 않다.

          그 뒤 PageHero 가 sm 부터 lead 에 한 줄만 비우게 바뀌면서 앞머리
          "부품 " 을 한 번 더 덜었다. 43자일 때 글 폭이 573.8px 로 640px
          칸(560.8px)을 13px 넘겨, 15개 배너 중 이 페이지만 640~767 에서
          두 줄이었다. 제목이 "문의하기" 고 바로 아래가 문의 양식이라
          "부품" 을 안 적어도 읽힌다. */}
      <PageHero
        eyebrow="CONTACT"
        title="문의하기"
        lead="샘플이나 도면 한 장이면 됩니다. 제작 가능 여부와 일정을 회신드립니다."
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
                  href={telHref(site.tel)}
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
                  {/* 대표번호는 위 큰 버튼이 맡는다. 여기는 나머지 회선이다. */}
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 text-ink-soft">전화</dt>
                    <dd className="tabular-nums">
                      {site.telExtra.map((number) => (
                        <a
                          key={number}
                          href={telHref(number)}
                          className="block transition-colors hover:text-brand"
                        >
                          {number}
                        </a>
                      ))}
                    </dd>
                  </div>
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
