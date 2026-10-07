import type { Metadata } from "next";
import type { ReactNode } from "react";
import ContactCTA from "@/components/ContactCTA";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { site, telHref } from "@/data/site";

export const metadata: Metadata = {
  title: "오시는 길",
  description: `${site.name} 위치 안내. ${site.address.road}`,
};

const query = encodeURIComponent(site.address.jibun);

/**
 * 지도는 API 키가 필요 없는 구글 지도 embed를 쓴다.
 * 네이버·카카오 지도는 정식 연동에 키가 필요해 검색 링크로 대신한다.
 *
 * TODO: 도로명 주소가 확정되면 site.address 를 고치고 지도 위치를 확인할 것.
 */
const MAP_SRC = `https://maps.google.com/maps?q=${query}&z=16&hl=ko&output=embed`;

/**
 * 표의 칸은 컴포넌트 안에서 만든다(아래 cells). 전화와 운영 시간이 값을
 * 두 줄로 그려야 해서 문자열 배열로는 담기지 않는다.
 *
 * ⚠️ 칸이 여섯인 것은 2열 x 3행 격자에 꼭 맞추기 위해서다. 일곱이면 한 칸이
 *    비고 그 자리에서 테두리가 끊긴다. 칸을 더하거나 뺄 때 이 수를 본다.
 *
 * 마지막 칸은 두 번 바뀌었다. 사업자번호는 거래 서류에 적는 값이지 연락하는
 * 방법이 아니었고, 대표 이름은 연락처이긴 해도 "오시는 길" 에서 찾는 것이
 * 아니었다. 주차는 이 페이지에 온 사람이 주소 다음으로 궁금해하는 것이다.
 *
 * ⚠️ 도로명(정왕천로 197)은 화면에 넣지 않는다. 한때 따로 한 행이었고 그
 *    다음에는 주소 칸의 둘째 줄이었는데, 주소 윗줄이 이미 건물명까지
 *    말하고 바로 위에 지도가 있어 같은 곳을 두 번 적는 줄이었다.
 *    값은 site.address.roadName 에 남아 있다 — 호수가 확인되면 road 를
 *    그 도로명으로 갈아 끼울 때 쓴다(site.ts TODO 1).
 *
 *    다시 넣지 말 것. "2열에 맞추려면 여섯 칸" 이라는 조건만 보고 빈
 *    자리를 찾으면 여기가 먼저 눈에 띈다.
 *
 * ⚠️ 한때 "내비게이션 | 동우디지털파크로 검색" 행이 있었다. 표의 다른 칸은
 *    모두 값인데 거기만 쓰는 방법을 일러 주는 안내문이라 결이 달랐다.
 *    건물명은 주소 칸에 이미 들어 있다.
 *
 * ⚠️ 대중교통 칸도 일부러 넣지 않았다. 노선이 자료마다 엇갈려(1광명.25.8856
 *    <-> 20-1.11-A.11-B) 확인 없이 적으면 방문객이 헤맨다. README 자료 요청
 *    표 16번에 적어 뒀다.
 *
 * ⚠️ 라벨 칸이 좁다. dt 가 sm:w-28(112px) 에 좌우 패딩 16px 씩이라 글이 쓸 수
 *    있는 폭이 80px 다 — 14px bold 로 "운영 시간" 이 68px, "사업자등록번호"
 *    는 90px 라 넘친다. 라벨을 바꿀 때 이 80px 를 넘기지 말 것.
 */

export default function LocationPage() {
  /* 표의 여섯 칸. 이 순서가 그대로 배치가 된다 —
     왼쪽 열(전화.주소.팩스)을 다 채우고 오른쪽 열(이메일.주차.운영 시간).

     "언제 가면 되나"(운영 시간)가 맨 끝인 이유: 어디로.어떻게를 먼저 읽고
     그것이 뒤따르는 순서가 자연스럽다. */
  const cells: { label: string; body: ReactNode }[] = [
    {
      label: "전화",
      /* 대표번호는 ink-soft(주소.팩스.이메일과 같은 색), 추가 회선은 한 단계
         연한 muted 다. 크기는 둘 다 표의 다른 값과 같은 14px 로 둔다.

         site.ts 는 대표번호(tel)와 추가 회선(telExtra)을 나눠 두는데, 세
         번호를 똑같이 쌓으면 그 구분이 묻혀 어디로 걸어야 하는지가 화면에서
         사라진다. 가르는 수단은 색 하나다 — 한동안 크기(15px)와
         굵기(semibold)까지 함께 썼는데, 그러면 표 안에 글자 크기가
         13/14/15px 세 가지가 되고 그중 둘만 굵어 눈이 두 번 멈췄다. */
      body: (
        <>
          <a
            href={telHref(site.tel)}
            className="block tabular-nums text-ink-soft transition-colors hover:text-brand"
          >
            {site.tel}
          </a>
          <span className="mt-1 block text-muted">
            {site.telExtra.map((number, i) => (
              <span key={number}>
                {i > 0 && " · "}
                <a
                  href={telHref(number)}
                  className="tabular-nums transition-colors hover:text-brand"
                >
                  {number}
                </a>
              </span>
            ))}
          </span>
        </>
      ),
    },
    /* 이름은 road 지만 담긴 값은 지번이다 — 호수 표기가 확인되면 도로명으로
       바꾼다(site.ts TODO 1). 건물명(동우디지털파크)과 호수가 그 안에 이미
       들어 있어 이 칸 하나로 충분하다. */
    { label: "주소", body: site.address.road },
    /* 팩스는 걸 수 없어 링크가 없다(헤더.푸터.CTA와 같은 규칙). */
    { label: "팩스", body: <span className="tabular-nums">{site.fax}</span> },
    {
      label: "이메일",
      body: (
        <a
          href={`mailto:${site.email}`}
          className="transition-colors hover:text-brand"
        >
          {site.email}
        </a>
      ),
    },
    { label: "주차", body: site.parking },
    {
      label: "운영 시간",
      /* CTA와 푸터에도 같은 값이 나오지만 그 둘은 모든 페이지에 깔리는 사이트
         크롬이고, 여기서는 방문 시간이다.

         한때 이 아래 "길찾기 | 네이버 지도 · 카카오맵" 칸이 하나 더 있었다.
         표의 다른 칸은 모두 값인데 거기만 나가는 링크 둘이라 결이 달랐다.
         지도앱으로 가는 길은 푸터에 남아 있다. */
      body: (
        <>
          <span className="block tabular-nums">{site.hours.weekday}</span>
          <span className="mt-1 block text-muted">{site.hours.holiday}</span>
        </>
      ),
    },
  ];

  return (
    <>
      {/* "시화공단 내에 위치해 있습니다" 는 바로 아래 주소를 한 번 더 말할
          뿐이었다. 설계실과 공장이 한자리에 있다는 사실로 바꾸면, 와서 볼
          것이 있다는 뜻이 된다.

          그런데 그 문구("시화공단에 설계실과 공장이 함께 있습니다")도 결국
          조직도 배너와 같은 말이었다 — 거기는 "영업·설계·가공·튜닝·조립,
          다섯 부서가 한 공장 안에 모두 있습니다" 로 훨씬 구체적이다. 같은
          사실을 둘로 줄여 다시 말하니 힘이 빠졌고, "시화공단" 은 아래 주소
          표에 또 나왔다.

          지금 문구는 이 페이지만 할 수 있는 말을 한다. 오시는 길이 답할 것은
          "어디냐"(주소 표가 답한다)가 아니라 "가면 무엇이 되느냐" 다.
          문의하기 배너("샘플이나 도면 한 장이면 됩니다")와 짝이 되되 겹치지
          않는다 — 거기는 보내는 길, 여기는 들고 오는 길이다.

          길이는 글자 수가 아니라 폭이 정한다. 후보 여섯을 실제 배너 글상자에
          그려 320 에서 두 줄, 640 에서 한 줄인 것만 남겼다(39자). */}
      <PageHero
        eyebrow="LOCATION"
        title="오시는 길"
        lead="샘플을 들고 오시면 현장에서 함께 검토합니다. 방문 전 연락 바랍니다."
      />

      <div className="py-14 sm:py-20">
        <Container>
          {/* 지도가 전폭으로 눕고 연락처가 그 아래 선다.

              정렬을 두 번 바꿨다. 처음엔 이 꼴이었는데 지도가 1088x462 라
              1440 화면에서 바닥이 863px 였고, 전화번호를 보려면 반드시 한 번
              굴려야 했다. 그래서 2열(지도 약 620px + 연락처)로 좁혔다.

              다시 전폭으로 돌아오면서 세로를 두 군데서 줄여 그 문제를 덜었다
              — 지도를 3:1 로 눕혀 478 -> 363px, 표를 2열 x 3행으로 접어
              382 -> 207px. 지도를 크게 보이려면 이만큼이 한계다.

              lg 미만에서는 지도가 고정 높이로 서고 표가 1열로 떨어진다. */}
          <div className="flex flex-col gap-10">
            {/* lg 부터 3:1 이다(1088x363) — 홈 PERFORMANCE 영상과 같은
                비율로 가로로 시원하게 눕는다. 한때 칸 높이를 받는 lg:flex +
                lg:min-h-[25rem] 였는데, 그건 오른쪽에 연락처가 있어 행 높이를
                그쪽이 정하던 2열 배치에서 쓰던 방식이다.

                lg 미만은 고정 높이다 — 좁은 폭에서 3:1 로 두면 지도가 너무
                납작해져 길이 안 보인다.

                아래 표와 함께 테두리로 선다(2D). 그림자로 띄우면 지도.표가
                입체로 읽혀 자료를 읽는 자리에 맞지 않고, 한쪽만 바꾸면
                위아래로 선 둘의 결이 갈린다. */}
            <Reveal className="overflow-hidden rounded-2xl border border-line">
              <iframe
                src={MAP_SRC}
                title={`${site.name} 위치 지도`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 sm:h-[400px] lg:aspect-[3/1] lg:h-auto"
              />
            </Reveal>

            {/* Section 컴포넌트를 쓰지 않는다. 그쪽은 제목을 항상 맨 위에
                놓는데, 오시는 길에 온 사람은 위치부터 보므로 지도가 먼저
                와야 한다. 생김새만 Section 의 제목 블록과 맞춘다.

                제목은 "연락처" 다. "오시는 길" 로 하면 바로 위 h1 과 같은
                말을 두 번 하게 된다. */}
            <Reveal delay={90}>
              <p className="text-xs font-bold tracking-[0.08em] text-brand">
                CONTACT
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-4xl">
                연락처
              </h2>

              {/* 테두리로 선다(2D). 한때 shadow-card 로 떠 있었는데, 표는
                  떠 있는 카드가 아니라 읽는 자료다 — 제품 상세의 사양 표와
                  같은 1px line 테두리로 맞춘다. 칸 사이 선도 같은 색이라
                  바깥과 안쪽이 한 벌로 읽힌다.

                  사이트의 다른 shadow-card(제품 카드.적용 분야.영상 카드.
                  PROCESS 카드)는 그대로 둔다 — 그쪽은 떠 있는 카드가 맞다.

                  lg 부터 2열 x 3행으로 접힌다. 지도가 전폭이 되면서 표도
                  1088px 를 받는데, 한 줄짜리 값(팩스.주차)을 그 폭에 늘어놓으면
                  라벨과 값만 왼쪽에 몰리고 오른쪽이 텅 빈다. 접으면 높이도
                  382 -> 207px 로 준다. 지도가 3:1 로 눕는 폭(lg)과 같은 지점
                  에서 접는다 — md 로 당기면 768~1024 에서 지도만 세로로 서고
                  표만 2열이 되어 결이 갈린다.

                  grid-flow-col + 행 셋이라 DOM 순서대로 왼쪽 열(전화.주소.
                  팩스)을 다 채우고 오른쪽 열(이메일.주차.운영 시간)로 넘어간다.
                  행 우선이면 전화와 주소가 좌우로 갈라져 읽는 순서가 끊긴다.

                  ⚠️ 행 높이는 [auto_auto_auto] 다. grid-rows-3 은
                     repeat(3, minmax(0,1fr)) 로 펴져 세 행이 똑같아지는데,
                     그러면 한 줄짜리 팩스가 두 줄짜리 주소와 같은 89px 가 되고
                     표가 아니라 격자로 보인다(268px). auto 면 행마다 그 행에서
                     가장 큰 칸이 높이를 정한다.

                  행 높이를 나눠 갖던 flex-1/flex-auto 는 걷었다 — 지도가 더는
                  표 높이를 따라오지 않으므로 남는 높이가 없다. */}
              <dl className="mt-7 grid overflow-hidden rounded-2xl border border-line lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[auto_auto_auto]">
                {cells.map((cell, i) => (
                  /* 테두리는 인덱스로 준다.
                       i === 5   항상 마지막 칸 — 아래 선 없음
                       i === 2   1열에서는 중간이라 아래 선이 필요하고,
                                 2열에서는 왼쪽 열의 마지막이라 없앤다
                       i < 3     왼쪽 열 — 2열일 때만 오른쪽 선 */
                  <div
                    key={cell.label}
                    className={`flex flex-col sm:flex-row ${
                      i === 5
                        ? ""
                        : i === 2
                          ? "border-b border-line lg:border-b-0"
                          : "border-b border-line"
                    } ${i < 3 ? "lg:border-r lg:border-line" : ""}`}
                  >
                    {/* 라벨은 칸 높이 가운데. 값이 여러 줄인 칸에서 맨 위에
                        붙어 보였다. bg-surface 칸은 그대로 칸을 다 채운다.

                        패딩이 px-4 py-3 인 것은 제품 상세의 사양 표와 맞추기
                        위해서다. 한때 px-5 py-4 에 dd 가 leading-relaxed 라
                        한 줄 칸이 56px 였는데(사양 표는 44px), 자료를 읽는
                        표 둘의 두께가 서로 달랐다. 45px 로 내려 1px 차이만
                        남는다 — 이쪽은 sm:flex 라 줄 상자 계산이 다르다. */}
                    <dt className="bg-surface px-4 py-3 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                      {cell.label}
                    </dt>
                    <dd className="px-4 py-3 text-sm text-ink-soft sm:flex sm:flex-col sm:justify-center">
                      {cell.body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
