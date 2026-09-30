import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { PhoneIcon } from "./icons";
import { nav, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container className="py-12 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={403}
              height={52}
              className="h-7 w-auto sm:h-8"
            />
            {/* muted 를 본문 크기 글자에 쓰면 이 배경에서 대비가 4.51:1 로
                AA(4.5)를 0.01 차로 넘는다. 여백이 없어 한 단계 올린다. */}
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              1992년부터 볼피더·직진피더·호퍼피더를 설계부터 튜닝까지 직접
              만들어 온 부품 자동정렬 공급기 전문 기업입니다.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-16">
            <div>
              <h2 className="text-xs font-bold tracking-[0.15em] text-ink">
                바로가기
              </h2>
              {/* 드롭다운에만 있는 하위 페이지도 푸터에서는 펼쳐 보여 준다.
                  검색엔진이 따라갈 수 있는 평범한 링크가 하나는 있어야 한다.

                  2열로 나누지 않는다 — 회사소개의 하위 항목(조직도·보유 설비)이
                  중첩 목록이라 격자에 넣으면 부모와 따로 놀며 깨진다. */}
              <ul className="mt-4 space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition-colors hover:text-brand"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="mt-2 space-y-2 border-l border-line pl-3">
                        {item.children
                          .filter((child) => child.href !== item.href)
                          .map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="text-sm text-ink-soft transition-colors hover:text-brand"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold tracking-[0.15em] text-ink">
                연락처
              </h2>

              {/* 대표번호는 목록에서 꺼내 칸의 초점으로 둔다. 제조업 푸터에서
                  가장 중요한 한 줄인데 팩스·이메일과 같은 무게면 묻힌다. */}
              <a
                href={`tel:${site.tel.replace(/-/g, "")}`}
                className="mt-4 inline-flex items-center gap-2 text-lg font-bold tabular-nums text-ink transition-colors hover:text-brand"
              >
                <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
                {site.tel}
              </a>

              {/* 라벨을 값보다 작고 흐리게 둔다. 원래는 반대였다 —
                  라벨 8.73:1 / 값 4.51:1 로 읽을 값이 더 약했다. */}
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 pt-px text-xs font-bold text-muted">
                    팩스
                  </dt>
                  {/* 팩스는 걸 수 없어 링크가 아니다 — 헤더·CTA·오시는 길과 같은 규칙 */}
                  <dd className="tabular-nums text-ink">{site.fax}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 pt-px text-xs font-bold text-muted">
                    이메일
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-ink transition-colors hover:text-brand"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 pt-px text-xs font-bold text-muted">
                    주소
                  </dt>
                  <dd>
                    <Link
                      href="/location"
                      className="leading-relaxed text-ink transition-colors hover:text-brand"
                    >
                      {site.address.road}
                    </Link>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 pt-px text-xs font-bold text-muted">
                    운영
                  </dt>
                  <dd className="leading-relaxed text-ink">
                    {site.hours.weekday}
                    <br />
                    {site.hours.holiday}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            대표 {site.ceo} · 사업자등록번호 {site.businessNumber}
          </p>
        </div>
      </Container>
    </footer>
  );
}
