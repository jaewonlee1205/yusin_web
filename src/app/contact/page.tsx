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
              {/* 제목.버튼 둘.표가 한 네모 안에 든다. 경계는 이 테두리
                  한 겹뿐이고, 안쪽 표는 바깥 테두리 없이 행 구분선만 갖는다.

                  정체를 세 번 바꿨다. 처음엔 rounded-2xl bg-surface p-7 짜리
                  회색 카드였다. 연락처를 표로 바꾸면서 걷었는데(표의 라벨 칸이
                  bg-surface 라 카드 바탕에 녹았다), 이번엔 제목.버튼.표가
                  각자 떠서 한 묶음으로 안 읽혔다.

                  지금은 네모가 둘을 나눠 갖는다 — 위는 bg-surface,
                  아래(표)는 흰 바탕. 한 네모 안에서 "눌러서 연락하는 곳" 과
                  "읽는 자료" 가 색으로 갈리고, 흰 버튼이 회색 위에서
                  또렷해진다. 시안 셋을 찍어 비교했다. */}
              <div className="overflow-hidden rounded-2xl border border-line">
                <div className="bg-surface p-6">
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
                </div>
                {/* 오시는 길의 연락처 표와 같은 표다 — 패딩(px-4 py-3).
                    라벨 폭(w-28).글자 크기가 모두 location/page.tsx 와 같은
                    값이다. 한때 여기는 라벨과 값을 gap-3 으로 띄운 글 목록
                    이었는데, 값이 여러 줄인 행에서 어디까지가 한 항목인지
                    경계가 없어 읽기 불편했다.

                    바깥 테두리와 radius 는 갖지 않는다 — 위 네모가 맡는다.
                    border-t 하나로 버튼 영역과 갈린다.

                    행 순서도 오시는 길과 맞췄다 — 전화.주소.팩스.운영 시간.
                    주소가 팩스보다 위인 것은 방문.발송에 더 자주 쓰여서다.
                    (오시는 길에 있는 이메일.주차 행은 여기 없다. 이메일은
                     바로 위 버튼이 맡고, 주차는 길 찾아온 사람의 정보다.)

                    ⚠️ 640 미만에서는 sm:flex-row 가 풀려 라벨이 값 위로
                       쌓인다. 좁은 폭에서 w-28 라벨 열을 떼면 값 칸이
                       너무 좁아진다. */}
                <dl className="flex flex-col border-t border-line">
                  {/* 대표번호는 위 큰 버튼이 맡는다. 여기는 나머지 회선이다.
                      오시는 길은 두 번호를 한 줄에 · 로 잇지만, 이 칸은
                      426.7px 라 두 줄로 둔다. 둘째 줄이 muted 인 것은 오시는
                      길 표의 추가 회선과 같은 처리다.

                      전에 있던 -mx-2 px-2 py-1.5(터치 영역 넓히기)는 걷었다 —
                      행이 py-3 라 링크 높이가 target-size 24px 를 넘긴다. */}
                  <div className="flex flex-col border-b border-line sm:flex-row">
                    <dt className="bg-surface px-4 py-3 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                      전화
                    </dt>
                    <dd className="px-4 py-3 sm:flex sm:flex-col sm:justify-center">
                      {site.telExtra.map((number, i) => (
                        <a
                          key={number}
                          href={telHref(number)}
                          className={`block text-sm tabular-nums transition-colors hover:text-brand ${
                            i === 0 ? "text-ink-soft" : "mt-1 text-muted"
                          }`}
                        >
                          {number}
                        </a>
                      ))}
                    </dd>
                  </div>

                  <div className="flex flex-col border-b border-line sm:flex-row">
                    <dt className="bg-surface px-4 py-3 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                      주소
                    </dt>
                    {/* 한때 이 아래 "오시는 길 보기" 버튼이 붙어 있었다.
                        헤더.푸터 메뉴에 "오시는 길" 이 있어 길은 그대로
                        남으므로 걷었다. */}
                    <dd className="px-4 py-3 text-sm text-ink-soft sm:flex sm:items-center">
                      {site.address.road}
                    </dd>
                  </div>

                  <div className="flex flex-col border-b border-line sm:flex-row">
                    <dt className="bg-surface px-4 py-3 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                      팩스
                    </dt>
                    <dd className="px-4 py-3 text-sm tabular-nums text-ink-soft sm:flex sm:items-center">
                      {site.fax}
                    </dd>
                  </div>

                  <div className="flex flex-col sm:flex-row">
                    <dt className="bg-surface px-4 py-3 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                      운영 시간
                    </dt>
                    <dd className="px-4 py-3 sm:flex sm:flex-col sm:justify-center">
                      <span className="block text-sm tabular-nums text-ink-soft">
                        {site.hours.weekday}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {site.hours.holiday}
                      </span>
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
