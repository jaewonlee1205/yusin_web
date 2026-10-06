import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
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
 * 값이 여럿이면 배열이다 — 전화는 대표번호를 맨 위에 두고 나머지 회선을
 * 아래로 쌓는다. 팩스는 걸 수 없어 link 가 없다(헤더·푸터·CTA와 같은 규칙).
 */
const CONTACT_ROWS: {
  label: string;
  value: string | string[];
  link?: "tel" | "mailto";
}[] = [
  { label: "주소", value: site.address.road },
  { label: "전화", value: [site.tel, ...site.telExtra], link: "tel" },
  { label: "팩스", value: site.fax },
  { label: "이메일", value: site.email, link: "mailto" },
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
          <div className="overflow-hidden rounded-lg border border-line">
            <iframe
              src={MAP_SRC}
              title={`${site.name} 위치 지도`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[320px] w-full border-0 sm:h-[460px]"
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-lg font-bold text-ink">연락처 및 위치</h2>
              <dl className="mt-5 overflow-hidden rounded-lg border border-line">
                {CONTACT_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col border-b border-line last:border-0 sm:flex-row"
                  >
                    {/* 라벨은 칸 높이 가운데. 전화처럼 값이 여러 줄인 행에서
                        맨 위에 붙어 보였다. bg-surface 칸은 그대로 행을 다 채운다. */}
                    <dt className="bg-surface px-5 py-4 text-sm font-bold text-ink sm:flex sm:w-28 sm:shrink-0 sm:items-center">
                      {row.label}
                    </dt>
                    <dd className="px-5 py-4 text-sm leading-relaxed text-ink-soft">
                      {(Array.isArray(row.value)
                        ? row.value
                        : [row.value]
                      ).map((value) => (
                        <span key={value} className="block tabular-nums">
                          {row.link ? (
                            <a
                              href={
                                row.link === "tel"
                                  ? telHref(value)
                                  : `mailto:${value}`
                              }
                              className="transition-colors hover:text-brand"
                            >
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://map.naver.com/p/search/${query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-navy/40 hover:text-ink"
                >
                  네이버 지도에서 보기
                </a>
                <a
                  href={`https://map.kakao.com/?q=${query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-line px-5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-navy/40 hover:text-ink"
                >
                  카카오맵에서 보기
                </a>
              </div>
            </div>

            <aside className="self-start rounded-lg border border-line bg-surface p-7">
              <h2 className="text-sm font-bold tracking-[0.15em] text-ink">
                운영 시간
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li>{site.hours.weekday}</li>
                <li className="text-muted">{site.hours.holiday}</li>
              </ul>

              <h2 className="mt-8 text-sm font-bold tracking-[0.15em] text-ink">
                방문 전 안내
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                부품 샘플을 가져오시면 그 자리에서 제작 가능 여부를 함께
                검토해 드립니다. 담당자가 현장에 나가 있을 수 있으니 방문
                전 전화로 일정을 잡아 주시면 좋습니다.
              </p>
            </aside>
          </div>
        </Container>
      </div>

      <ContactCTA />
    </>
  );
}
