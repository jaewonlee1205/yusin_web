import type { Metadata } from "next";
import Container from "@/components/Container";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { process } from "@/data/company";
import { site, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "파츠피더 제작 문의. 공급할 부품의 종류와 필요한 공급 속도를 알려 주시면 제작 가능 여부와 예상 납기를 회신드립니다.",
};

export default function ContactPage() {
  return (
    <>
      {/* 전에는 55자라 320·360px 에서 세 줄이 되어, 이 배너만 232 -> 258px 로
          길었다. 뜻은 그대로 두고 길이만 줄였다.

          그 뒤 PageHero 가 sm 부터 lead 에 한 줄만 비우게 바뀌면서 앞머리
          "부품 " 을 한 번 더 덜었다. 43자일 때 글 폭이 573.8px 로 640px
          칸(560.8px)을 13px 넘겨, 15개 배너 중 이 페이지만 640~767 에서
          두 줄이었다. 제목이 "문의하기" 고 바로 아래가 문의 양식이라
          "부품" 을 안 적어도 읽힌다.

          "일정" 이었던 자리가 "납기" 다. 이 페이지는 이미 그 말을 쓰고 있다 —
          오른쪽 "이런 내용을 알려 주세요" 가 희망 납기를 묻고, InquiryForm 의
          안내문도 그렇다. 방문자는 희망 납기를 적어 보내는데 회신은 일정으로
          한다고 적혀 있었다. "일정" 은 회의 일정처럼도 읽힌다.

          ⚠️ "예상 납기" 로는 못 늘린다 — 글 폭이 573.8px 가 되어 위에 적은
             13px 초과가 그대로 재현된다. 검색 설명 쪽은 폭 제약이 없어
             "예상" 을 붙여 두었다(회신이 확정 납기가 아니라는 뜻이 산다). */}
      <PageHero
        eyebrow="CONTACT"
        title="문의하기"
        lead="샘플이나 도면 한 장이면 됩니다. 제작 가능 여부와 납기를 회신드립니다."
      />

      <div className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              {/* 덩어리 단위로 올린다 — 제목 / 폼 / 연락처가 0.90.180ms 다.
                  입력칸을 하나씩 올리지는 않는다. 입력하러 온 사람이 칸이
                  다 나타날 때까지 기다리게 된다. */}
              <Reveal>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  온라인 문의
                </h2>
              </Reveal>
              <Reveal delay={90} className="mt-8">
                <InquiryForm />
              </Reveal>
            </div>

            {/* "이런 내용을 알려 주세요" 카드가 여기 있었다. 쓸 자리에서
                멀어 읽히지 않아 문의 내용 입력란 바로 위로 옮겼다. 이제 이
                칸에는 연락처 한 장만 선다. */}
            <Reveal as="aside" delay={180} className="self-start">
              {/* 한 박스 안에 두 구역이 선다 — 위는 도입 프로세스, 아래는
                  문의처. 구분선 하나로 가른다.

                  이 칸은 여러 번 바뀌었다. 회색 카드 -> 바탕 걷음 -> 테두리
                  네모 -> 회색 박스 + 안에 연락처 표. 표에 있던 추가 회선.
                  주소.팩스는 걷었다 — 셋 다 푸터와 오시는 길 표, 회사 개요
                  표에 그대로 있고, 문의하러 온 사람에게 먼저 보일 것은
                  "맡기면 어떻게 진행되는가" 다. */}
              <div className="rounded-2xl bg-surface p-6">
                <h2 className="text-sm font-bold tracking-[0.08em] text-ink">
                  도입 프로세스
                </h2>

                {/* 홈 PROCESS 섹션이 쓰는 그 배열이다(company.ts 의 process).
                    글을 새로 짓지 않는다 — 같은 과정을 두 자리에서 다르게
                    말하면 어느 쪽이 맞는지 알 수 없게 된다.

                    홈은 가로 넉 장 카드고 여기는 세로 넉 줄이다. 칸이 379px
                    라 카드를 눕힐 자리가 없다. */}
                <ol className="mt-5 flex flex-col gap-5">
                  {process.map((p, i) => (
                    <li key={p.step} className="flex gap-3">
                      {/* 번호 배지. 홈 PROCESS 가 쓰는 레드 번호와 같은
                          언어다(그쪽은 brand/30 워터마크). 24px 원 넷이라
                          레드 면적도 좁다 — globals.css 토큰 주석의
                          "레드는 면적을 좁게" 를 지킨다.

                          ⚠️ aria-hidden 을 떼지 말 것. 순서는 ol / li 가 이미
                             전하므로 시각 보조다. 대비는 계산상 4.66:1 로
                             기준(4.5:1)을 넘지만 검사 대상에서 빼 둔다. */}
                      <span
                        aria-hidden="true"
                        className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[11px] font-bold tabular-nums text-brand"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">{p.title}</p>
                        <ul className="mt-1.5 flex flex-col gap-1">
                          {p.points.map((point) => (
                            <li key={point} className="flex items-center gap-2">
                              <span
                                aria-hidden="true"
                                className="h-1 w-1 shrink-0 rounded-full bg-muted/50"
                              />
                              <span className="text-[13px] leading-snug text-ink-soft">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* 둘째 구역. 한때 제목이 "바로 연락하기" 였다 — 위에 프로세스가
                    생기면서 둘 다 행동을 재촉하는 말이 되어, 이쪽은 "어디로
                    거는가" 를 적는 자리로 낮췄다. */}
                <div className="mt-7 border-t border-line pt-6">
                  <h2 className="text-sm font-bold tracking-[0.08em] text-ink">
                    문의처
                  </h2>
                  {/* 네이비로 꽉 채웠던 버튼을 흰 바탕으로 낮췄다. 폼의
                      "문의 보내기" 와 둘 다 진하면 화면에서 둘이 겨룬다 —
                      진한 주 버튼은 하나여야 한다. */}
                  <a
                    href={telHref(site.tel)}
                    className="mt-4 flex h-14 items-center justify-center rounded-xl border border-line bg-white text-base font-bold tabular-nums text-navy transition-colors hover:border-navy/40"
                  >
                    {site.tel}
                  </a>
                  {/* 이메일도 박스다. 맨 글자로 두니 바로 위 전화 버튼과 짝이
                      안 맞았다. 다만 한 치수 낮춘다 — 전화 h-14 / 16px bold,
                      여기 h-12 / 14px semibold. 진한 주 동선은 전화 하나다. */}
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-2 flex h-12 items-center justify-center rounded-xl border border-line bg-white text-sm font-semibold text-ink-soft transition-colors hover:border-navy/40 hover:text-brand"
                  >
                    {site.email}
                  </a>
                  {/* 연락처 표를 걷으면서 이 페이지에서 영업시간이 사라졌다.
                      한 줄만 남긴다 — 전화를 걸기 전에 보는 값이다. */}
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    {site.hours.weekday} · {site.hours.holiday}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}
