import type { Metadata } from "next";
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
 * 전화는 이 목록에서 뺐다. 세 번호를 똑같이 쌓아 두니 어디로 걸어야 하는지가
 * 화면에서 사라졌다 — site.ts 는 대표번호(tel)와 추가 회선(telExtra)을 나눠
 * 두는데 그 구분이 묻혔다. 아래 표에서 전화 행만 따로 그려 대표번호를
 * 가른다.
 *
 * 가르는 수단은 색 하나다. 한동안 크기(15px)와 굵기(semibold)까지 함께
 * 썼는데, 그러면 표 안에 글자 크기가 13/14/15px 세 가지가 되고 그중 둘만
 * 굵어 행을 훑는 눈이 두 번 멈췄다. 구분은 색 한 단계로 충분하다.
 *
 * 팩스는 걸 수 없어 link 가 없다(헤더·푸터·CTA와 같은 규칙).
 */
/**
 * 전화.운영 시간을 뺀 나머지 행. 그 둘은 값이 두 줄이라 아래에서 따로 그린다.
 *
 * 마지막 칸은 한동안 사업자번호였는데, 거래 서류에 적는 값이지 연락하는
 * 방법이 아니라 결이 달랐다. 대표 이름이 "연락처" 라는 표 제목에 맞는다.
 *
 * ⚠️ 라벨 칸이 좁다. dt 가 sm:w-28(112px) 에 좌우 패딩 20px 씩이라 글이 쓸 수
 *    있는 폭이 72px 다 — 14px bold 로 "사업자등록번호" 는 90px 라 넘쳤고
 *    "대표" 는 26px 로 넉넉하다. 라벨을 바꿀 때 이 72px 를 넘기지 말 것.
 */
const CONTACT_ROWS: {
  label: string;
  value: string;
  link?: "mailto";
}[] = [
  { label: "주소", value: site.address.road },
  { label: "팩스", value: site.fax },
  { label: "이메일", value: site.email, link: "mailto" },
  { label: "대표", value: site.ceo },
];

export default function LocationPage() {
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
          {/* 지도와 연락처를 한 줄에 둔다.

              전에는 지도가 전폭(1088x462)이고 연락처는 그 아래였다. 1440
              화면에서 지도 바닥이 863px 라, 전화번호를 보려면 반드시 한 번
              굴려야 했다. "어디냐" 와 "어떻게 연락하냐" 는 같이 보는 정보다.

              지도를 조금 좁히는 대신(1088 -> 약 620px) 둘이 한 화면에 들어온다.
              lg 미만에서는 지도 -> 연락처 순으로 쌓인다. */}
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
            {/* lg:flex — iframe 을 flex 자식으로 만들어 칸 높이를 그대로 받게
                한다(align-items: stretch). h-full 로도 되지만 그쪽은 부모
                높이가 확정돼 있어야 해서, 그리드 행 높이를 오른쪽 칸이 정하는
                이 배치에서는 flex 가 안전하다. min-h 는 지도가 너무 납작해지지
                않게 받치는 바닥값이다. */}
            <Reveal className="overflow-hidden rounded-2xl shadow-card lg:flex lg:min-h-[25rem]">
              <iframe
                src={MAP_SRC}
                title={`${site.name} 위치 지도`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[320px] w-full border-0 sm:h-[400px] lg:h-auto"
              />
            </Reveal>

            {/* Section 컴포넌트를 쓰지 않는다. 그쪽은 제목을 항상 맨 위에
                놓는데, 오시는 길에 온 사람은 위치부터 보므로 지도가 먼저
                와야 한다. 생김새만 Section 의 제목 블록과 맞춘다.

                제목은 "연락처" 다. "오시는 길" 로 하면 바로 위 h1 과 같은
                말을 두 번 하게 된다. */}
            <Reveal delay={90} className="flex flex-col">
              <p className="text-xs font-bold tracking-[0.08em] text-brand">
                CONTACT
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-4xl">
                연락처
              </h2>

              {/* flex-1 로 표가 칸 끝까지 내려오고, 행마다 flex-auto 라
                  남는 높이를 내용 비율대로 나눠 갖는다. flex-1(=basis 0)
                  이면 네 행이 똑같아져 팩스 한 줄과 주소 두 줄이 같은
                  높이가 된다 — 그건 표가 아니라 격자로 보인다. */}
              <dl className="mt-7 flex flex-1 flex-col overflow-hidden rounded-2xl shadow-card">
                {/* 전화 — 대표번호는 ink-soft(주소.팩스.이메일과 같은 색),
                    추가 회선은 한 단계 연한 muted 다. 크기는 둘 다 표의 다른
                    값과 같은 14px 로 둔다. */}
                <div className="flex flex-auto flex-col border-b border-line sm:flex-row">
                  <dt className="bg-surface px-5 py-4 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                    전화
                  </dt>
                  <dd className="px-5 py-4 sm:flex sm:flex-col sm:justify-center">
                    <a
                      href={telHref(site.tel)}
                      className="block text-sm tabular-nums text-ink-soft transition-colors hover:text-brand"
                    >
                      {site.tel}
                    </a>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted">
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
                  </dd>
                </div>

                {CONTACT_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-auto flex-col border-b border-line sm:flex-row"
                  >
                    {/* 라벨은 칸 높이 가운데. 값이 여러 줄인 행에서 맨 위에
                        붙어 보였다. bg-surface 칸은 그대로 행을 다 채운다. */}
                    <dt className="bg-surface px-5 py-4 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                      {row.label}
                    </dt>
                    <dd className="px-5 py-4 text-sm leading-relaxed text-ink-soft sm:flex sm:items-center">
                      {row.link ? (
                        <a
                          href={`mailto:${row.value}`}
                          className="transition-colors hover:text-brand"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}

                {/* 운영 시간 — 전화 행과 같은 생김새다. CONTACT_ROWS 는
                    value 가 한 줄짜리라 평일/휴무 두 줄을 담을 수 없어
                    여기서 따로 그린다.

                    표 맨 끝인 이유: 연락처(전화.주소.팩스.이메일.대표)를
                    먼저 읽고 "언제 가면 되나" 가 뒤따르는 순서가 자연스럽다.

                    한때 이 아래 "길찾기 | 네이버 지도 · 카카오맵" 행이 하나 더
                    있었다. 표의 다른 행은 모두 값인데 거기만 나가는 링크 둘이라
                    결이 달랐다. 지도앱으로 가는 길은 푸터에 남아 있다.

                    CTA와 푸터에도 같은 값이 나오지만 그 둘은 모든 페이지에
                    깔리는 사이트 크롬이고, 여기서는 방문 시간이다. */}
                <div className="flex flex-auto flex-col sm:flex-row">
                  <dt className="bg-surface px-5 py-4 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                    운영 시간
                  </dt>
                  <dd className="px-5 py-4 sm:flex sm:flex-col sm:justify-center">
                    <span className="block text-sm tabular-nums text-ink-soft">
                      {site.hours.weekday}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                      {site.hours.holiday}
                    </span>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
