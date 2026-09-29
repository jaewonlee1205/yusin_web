import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
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
            <p className="mt-5 text-sm leading-relaxed text-muted">
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
                  검색엔진이 따라갈 수 있는 평범한 링크가 하나는 있어야 한다. */}
              <ul className="mt-4 space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-brand"
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
                                className="text-sm text-muted transition-colors hover:text-brand"
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
              <dl className="mt-4 space-y-2.5 text-sm text-muted">
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 text-ink-soft">전화</dt>
                  <dd>
                    <a
                      href={`tel:${site.tel.replace(/-/g, "")}`}
                      className="tabular-nums transition-colors hover:text-brand"
                    >
                      {site.tel}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 text-ink-soft">팩스</dt>
                  <dd className="tabular-nums">{site.fax}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 text-ink-soft">이메일</dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="transition-colors hover:text-brand"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 text-ink-soft">주소</dt>
                  <dd className="leading-relaxed">{site.address.road}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-10 shrink-0 text-ink-soft">운영</dt>
                  <dd>
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
