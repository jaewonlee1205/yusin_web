"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import { ListPanel } from "./NavPanel";
import { products } from "@/data/products";
import {
  headerCta,
  nav,
  site,
  telHref,
  type NavChild,
  type NavItem,
} from "@/data/site";
import { PhoneIcon } from "./icons";
import { scrollToTop } from "@/lib/scrollToTop";

/** 마우스가 메뉴를 스쳐 지날 때 깜빡이지 않도록 닫기를 약간 늦춘다. */
const CLOSE_DELAY = 140;

/**
 * 같은 페이지를 가리키는지. trailingSlash: true 라 pathname 은 "/company/"
 * 인데 nav 가 들고 있는 href 는 "/company" 라 그냥 비교하면 안 맞는다.
 */
const samePath = (a: string, b: string) =>
  a.replace(/\/+$/, "") === b.replace(/\/+$/, "");

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  /** 열려 있는 데스크톱 드롭다운의 href. 없으면 null */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  /** 모바일 아코디언에서 펼쳐진 항목 */
  const [expanded, setExpanded] = useState<string | null>(null);
  /** 조금이라도 내리면 본문 위에 떠 있는 느낌을 주려고 그림자를 더한다 */
  const [scrolled, setScrolled] = useState(false);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  /**
   * 데스크톱 메뉴. 오른쪽 CTA 버튼과 같은 곳으로 가는 항목은 뺀다.
   * 모바일 메뉴와 푸터는 nav 전체를 그대로 쓴다.
   */
  const desktopNav = useMemo(
    () => nav.filter((item) => item.href !== headerCta.href),
    []
  );

  /**
   * 제품 메뉴의 하위 항목. products.ts에서 만들어 데스크톱·모바일이 같이 쓴다.
   *
   * 맨 앞 "전체"는 회사소개의 "개요"와 같은 자리 — 펼친 목록 안에서 부모
   * 페이지로 가는 칸이다. 부모 메뉴가 이미 "제품"이라 라벨에서 그 말을
   * 반복하지 않는다.
   *
   * 전에는 이 줄이 보루였다. 데스크톱 "제품"이 링크가 아니라 여닫는 버튼이라
   * 이 줄이 없으면 /products 로 갈 길이 헤더에서 사라졌다. 지금은 "제품"
   * 자체가 링크라 그 역할은 끝났지만, 펼쳐 놓고 고르는 사람에게는 여전히
   * 필요한 칸이라 남긴다(참고한 신창에프에이도 부모를 다시 가리키는 줄을 둔다).
   */
  const productChildren = useMemo<NavChild[]>(
    () => [
      { href: "/products", label: "전체" },
      ...products.map((p) => ({
        href: `/products/${p.slug}`,
        label: p.name,
      })),
    ],
    []
  );

  /** 드롭다운에 넣을 항목. 제품만 products.ts에서 오고 나머지는 nav가 들고 있다. */
  const childrenFor = useCallback(
    (item: NavItem): NavChild[] =>
      item.childrenFrom === "products" ? productChildren : (item.children ?? []),
    [productChildren]
  );

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  }, [cancelClose]);

  // 라우트가 바뀌면 열려 있던 메뉴를 모두 닫는다.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape로 닫고, 헤더 밖을 누르면 드롭다운을 닫는다.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  // 모바일 메뉴가 열린 동안 뒤 페이지가 스크롤되지 않게 한다.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /**
   * 지금 보고 있는 페이지를 헤더에서 다시 누르면 맨 위로 올린다.
   *
   * 라우터는 같은 경로로 가라는 요청에 아무것도 하지 않는다. 그래서 홈에서
   * 로고를 눌러도, /company 에서 회사소개를 눌러도 반응이 없었다. 다른
   * 경로로 갈 때는 라우터가 알아서 맨 위로 보내 주므로 건드리지 않는다.
   */
  const onSameRouteClick = (e: React.MouseEvent, href: string) => {
    if (!samePath(pathname, href)) return;
    // 새 탭으로 열려는 클릭(Ctrl/Cmd 등)은 가로채지 않는다.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    scrollToTop();
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-ink/[0.07]" : ""
      }`}
    >
      <Container width="wide">
        {/*
          lg 이상에서는 3칸 그리드를 쓴다. justify-between 으로 두면 로고(279px)와
          우측 그룹(225px)의 폭 차이만큼 메뉴가 한쪽으로 밀린다.
          minmax(0,1fr) 이라야 양옆 칸이 정확히 같은 폭이 되어 메뉴가 화면 정중앙에 온다.
          (그냥 1fr 은 칸의 최소 폭이 내용 크기라 다시 치우친다)
        */}
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <Link
            href="/"
            onClick={(e) => onSameRouteClick(e, "/")}
            className="shrink-0 lg:justify-self-start"
            aria-label={`${site.name} 홈으로`}
          >
            {/* lg(1024~1280px)에서 h-8 을 유지하는 것은 의도다. 이 구간은 메뉴가
                쓸 수 있는 폭이 가장 빠듯한데, 로고가 h-9(자연 폭 279px)이면
                메뉴에 밀려 폭만 266px로 줄어든다 — 높이는 고정이라 로고가
                찌그러진다. xl 부터 키운다. (lg:h-9 로 되돌리지 말 것) */}
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={403}
              height={52}
              priority
              className="h-7 w-auto sm:h-8 xl:h-9"
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {desktopNav.map((item) => {
              const active = isActive(item.href);
              const hasPanel =
                item.childrenFrom === "products" || !!item.children;
              const open = openMenu === item.href;
              const panelId = `menu-${item.href.replace(/\//g, "")}`;

              if (!hasPanel) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => onSameRouteClick(e, item.href)}
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-2 py-2 text-[15px] font-medium transition-colors xl:px-4 ${
                      active ? "text-brand" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(item.href);
                  }}
                  onMouseLeave={scheduleClose}
                  onFocus={() => {
                    cancelClose();
                    setOpenMenu(item.href);
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpenMenu(null);
                    }
                  }}
                >
                  {/* 버튼이 아니라 링크다. 전에는 여닫기 버튼이라 눌러도
                      아무 데도 가지 않았다 — 하위 메뉴를 펼쳐 첫 줄을 다시
                      눌러야 /company·/products 로 갈 수 있었다. 드롭다운은
                      그대로 감싸는 div 의 호버·포커스로 연다.

                      aria-controls 는 열렸을 때만 준다. 패널은 열릴 때만
                      그려지는데 닫힌 동안에도 그 id 를 가리키고 있었다. */}
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={open}
                    aria-controls={open ? panelId : undefined}
                    onClick={(e) => {
                      // 라우트가 바뀌면 useEffect 가 닫아 주지만, 같은
                      // 경로를 누른 경우엔 안 바뀌어 열린 채 남는다.
                      setOpenMenu(null);
                      onSameRouteClick(e, item.href);
                    }}
                    className={`flex items-center gap-1.5 rounded px-2 py-2 text-[15px] font-medium transition-colors xl:px-4 ${
                      active ? "text-brand" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <Chevron open={open} />
                  </Link>

                  {open && (
                    <div
                      id={panelId}
                      className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2"
                    >
                      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-xl shadow-ink/10">
                        <ListPanel
                          items={childrenFor(item)}
                          onNavigate={() => setOpenMenu(null)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 lg:flex lg:justify-self-end">
            <a
              href={telHref(site.tel)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-navy transition-colors hover:text-brand"
            >
              <PhoneIcon />
              {site.tel}
            </a>
            <Link
              href={headerCta.href}
              className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              {headerCta.label}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="-mr-2 flex h-10 w-10 items-center justify-center lg:hidden"
          >
            <span className="sr-only">
              {mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <>
                  <path d="M5 5l14 14" />
                  <path d="M19 5L5 19" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* 모바일 메뉴 — 하위 항목은 아코디언으로 펼친다 */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <Container width="wide" className="py-2">
            <nav aria-label="모바일 메뉴" className="flex flex-col">
              {nav.map((item) => {
                const children = childrenFor(item);
                const isOpen = expanded === item.href;

                if (children.length === 0) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="border-b border-line py-4 text-base font-medium text-ink"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <div key={item.href} className="border-b border-line">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-ink"
                    >
                      {item.label}
                      <Chevron open={isOpen} />
                    </button>
                    {isOpen && (
                      <ul className="pb-3 pl-3">
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block border-l-2 border-line py-2.5 pl-4 text-sm text-ink-soft"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="my-5 flex flex-col gap-3">
              <a
                href={telHref(site.tel)}
                className="rounded border border-line py-3 text-center text-sm font-semibold text-navy"
              >
                전화 {site.tel}
              </a>
              <Link
                href="/contact"
                className="rounded bg-brand py-3 text-center text-sm font-semibold text-white"
              >
                견적 문의
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
