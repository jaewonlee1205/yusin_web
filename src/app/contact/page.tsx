import type { Metadata } from "next";
import Container from "@/components/Container";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
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
              {/* 카드는 바탕색으로만 선다. 테두리와 바탕을 함께 쓰면 경계가
                  두 겹이 된다. */}
              <div className="rounded-2xl bg-surface p-7">
                <h2 className="text-sm font-bold tracking-[0.08em] text-ink">
                  바로 연락하기
                </h2>
                {/* 네이비로 꽉 채웠던 버튼을 흰 바탕으로 낮췄다. 폼의
                    "문의 보내기" 와 둘 다 진하면 화면에서 둘이 겨룬다 —
                    진한 주 버튼은 하나여야 한다. */}
                <a
                  href={telHref(site.tel)}
                  className="mt-5 flex h-14 items-center justify-center rounded-xl border border-line bg-white text-base font-bold tabular-nums text-navy transition-colors hover:border-navy/40"
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
                <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted">
                  {/* 대표번호는 위 큰 버튼이 맡는다. 여기는 나머지 회선이다. */}
                  {/* dt 와 dd 가 같은 세로 패딩을 갖는다. 전에는 전화 행의
                      링크에만 py-1.5 가 있어(target-size 를 넓히려고 넣었다)
                      "전화" 라는 라벨 글자와 번호 글자가 6px 어긋나 보였다.
                      전화 행만 dd 에 패딩이 없다 — 안의 링크가 그 몫을 한다. */}
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 py-1.5 text-ink-soft">전화</dt>
                    <dd className="tabular-nums">
                      {/* -mx-2 px-2 py-1.5 로 터치 영역을 넓힌다. 글자만
                          두면 103x20px 라 target-size(24px)에 못 미친다.
                          음수 마진이라 글자 자리는 그대로다. */}
                      {site.telExtra.map((number) => (
                        <a
                          key={number}
                          href={telHref(number)}
                          className="-mx-2 block rounded-lg px-2 py-1.5 transition-colors hover:text-brand"
                        >
                          {number}
                        </a>
                      ))}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 py-1.5 text-ink-soft">팩스</dt>
                    <dd className="py-1.5 tabular-nums">{site.fax}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 py-1.5 text-ink-soft">운영</dt>
                    <dd className="py-1.5">
                      {site.hours.weekday}
                      <br />
                      {site.hours.holiday}
                    </dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-12 shrink-0 py-1.5 text-ink-soft">주소</dt>
                    <dd className="py-1.5 leading-relaxed">
                      {/* 한때 여기 "오시는 길 보기" 버튼이 붙어 있었다.
                          헤더.푸터 메뉴에 "오시는 길" 이 있어 길은 그대로
                          남으므로 걷었다. */}
                      {site.address.road}
                    </dd>
                  </div>
                </dl>
              </div>

            </Reveal>
          </div>
        </Container>
      </div>
    </>
  );
}
