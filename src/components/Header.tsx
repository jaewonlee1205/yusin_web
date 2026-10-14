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
import { MobileIcon, PhoneIcon } from "./icons";
import { handleSameRouteClick } from "@/lib/scrollToTop";

/** 마우스가 메뉴를 스쳐 지날 때 깜빡이지 않도록 닫기를 약간 늦춘다. */
const CLOSE_DELAY = 140;

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

  /* 지금 보고 있는 페이지를 헤더에서 다시 누르면 맨 위로 올린다. 푸터 로고
     (HomeLogoLink)도 같은 함수를 쓴다 — 근거는 lib/scrollToTop.ts 에 있다. */
  const onSameRouteClick = (e: React.MouseEvent, href: string) =>
    handleSameRouteClick(e, pathname, href);

  return (
    <header
      ref={headerRef}
      /* ⚠️⚠️ **네이비 바다**(#0d1b33 95%). 2026-10-14 에 흰 바에서 갈았다 —
         "여기도 네이비 색상으로 하자. 진한 네이비로, 공급할 부품을 보내
         주시면… 여기 컬러하고 동일하게".

         ⚠️⚠️ **border-b 가 border-white/10 이어야 한다.** 홈 첫 화면이 이미
            네이비 면이라, 선이 없으면 **헤더와 히어로의 경계가 사라져 헤더가
            안 보인다.** 히어로 지표 띠가 쓰는 것과 같은 값이다.

         ⚠️ 드롭다운 패널과 모바일 메뉴는 **흰색 그대로 둔다** — 떠 있는 판은
            밝은 쪽이 자연스럽고, 어두운 바 + 흰 패널은 흔한 조합이다. */
      /* ⚠️ text-white 가 **루트에** 있다. body 기본색이 ink 라, 명시하지 않은
         자식이 하나라도 있으면 네이비 위에서 글자가 사라진다. 흰 패널
         (드롭다운 · 모바일 메뉴) 안쪽은 text-ink 가 **명시**돼 있어 안전하다. */
      className={`sticky top-0 z-50 border-b border-white/10 bg-dark/95 text-white backdrop-blur transition-shadow duration-300 ${
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
            className="shrink-0 transition-opacity hover:opacity-70 active:opacity-55 lg:justify-self-start"
            aria-label={`${site.name} 홈으로`}
          >
            {/* lg(1024~1280px)에서 h-8 을 유지하는 것은 의도다. 이 구간은 메뉴가
                쓸 수 있는 폭이 가장 빠듯한데, 로고가 h-9(자연 폭 279px)이면
                메뉴에 밀려 폭만 266px로 줄어든다 — 높이는 고정이라 로고가
                찌그러진다. xl 부터 키운다. (lg:h-9 로 되돌리지 말 것) */}
            <Image
              src="/images/logo.webp"
              alt={site.name}
              width={403}
              height={52}
              priority
              /* ⚠️ 필터로 흰 로고를 만든다. logo.webp 는 빨강+차콜 이미지라
                 색을 CSS 로 못 바꾸고, 픽셀의 75% 가 차콜이라 네이비 위에서
                 묻힌다(밝기만 올려서는 회색이 될 뿐이다).
                 ⚠️ **SVG 원본을 받으면 이 필터가 필요 없다**(README 5번).
                    지금 같은 필터를 네 곳이 쓴다 — 헤더 · 푸터 · 비교표 머리 ·
                    포지셔닝 맵 점. */
              className="h-7 w-auto [filter:brightness(0)_invert(1)] sm:h-8 xl:h-9"
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
                    className={`rounded-lg px-2 py-2 text-15 font-medium transition-colors xl:px-4 ${
                      active
                        ? "text-brand-light"
                        : "text-white/80 hover:text-white"
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
                    className={`flex items-center gap-1.5 rounded-lg px-2 py-2 text-15 font-medium transition-colors xl:px-4 ${
                      active
                        ? "text-brand-light"
                        : "text-white/80 hover:text-white"
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
                      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-overlay">
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
            {/* 번호는 ink-soft, 아이콘만 brand 다.

                한때 둘 다 navy 였는데(2026-10-14 에 사이트에서 걷은 그 파랑),
                흰 헤더 위에서 그 파랑이 로고 레드.
                회색 메뉴 어느 쪽과도 짝이 안 맞아 혼자 뜨고 링크처럼 읽혔다.
                시안 다섯을 한 화면에 찍어 비교했다 — 번호까지 brand 로 하면
                바로 옆 "견적 문의" 버튼과 레드가 둘이 되어 겨룬다.

                ⚠️ **그때 ink-soft 를 뺀 까닭은 "메뉴에 묻힌다" 였는데,
                   2026-10-14 에 ink-soft 로 옮겼다.** 그 시안 때와 달리 지금은
                   **번호 옆 아이콘이 brand 레드**라 아이콘이 이미 번호를
                   메뉴와 갈라 준다. 글자가 ink 면 너무 검게 읽힌다는 말을
                   듣고 한 단계 눅였다 — 메뉴(15px/500)보다 작고(14px) 굵어
                   (600) 묻히지 않는 것을 1280 에서 찍어 확인했다.
                   ⚠️ 아이콘의 brand 를 빼면 이 전제가 무너진다.

                아이콘 레드는 15px 짜리라 면적이 거의 없다(globals.css 토큰
                주석 — "레드는 면적을 좁게"). hover:text-brand 는 그대로 둔다.
                올리면 번호가 레드가 되고 아이콘은 이미 레드다.

                ⚠️⚠️ **번호가 둘이고, 가로가 아니라 세로로 쌓인다.** 2026-10-13
                      에 010-5276-6947 을 더해 달라는 요청이 있었다.

                      가로로 이으면 **중앙 메뉴를 깎는다.** 이 헤더는
                      lg:grid-cols-[1fr_auto_1fr] 라 양옆 칸이 같은 폭이 되는데,
                      1024 에서 메뉴 끝과 이 묶음 시작 사이가 **49px 뿐**이다
                      (실측). 한 줄로 이으면 +125px 라 메뉴가 찌그러진다 —
                      바로 위 로고 주석이 "lg 구간은 메뉴 폭이 가장 빠듯하다"
                      고 적어 둔 그 구간이다.

                      세로로 쌓으면 **가로가 113px 그대로**고, 두 줄 높이 40px
                      가 옆 "견적 문의" 버튼(40px)과 정확히 같아 줄이 맞는다.

                ⚠️ **leading 을 건드리지 말 것.** 기본 줄 높이(text-sm = 20px)
                   두 줄이라 40px 다. leading-tight 로 좁히면 35px 이 되어
                   버튼과 어긋난다.

                ⚠️⚠️ **아이콘이 줄마다 하나씩이다.** 한 라운드 동안 아이콘
                      하나를 두 줄 옆 세로 가운데에 뒀는데(가로를 15px 아끼고
                      레드 점을 하나로 두려던 것), "두 줄에 아이콘 한 개다
                      보니 시각적으로 많이 이상하다" 는 말을 들었다. 40px 짜리
                      두 줄 덩어리 옆에 16px 아이콘이 가운데 홀로 떠, 어느 줄에
                      붙은 것인지 읽히지 않았다.

                      줄마다 붙이면 **두 줄이 각각 전화번호 한 건**으로 읽힌다.
                      가로는 아이콘이 쓰던 자리를 그대로 쓰므로 늘지 않는다.

                ⚠️⚠️ **두 아이콘이 서로 다르다(수화기 / 휴대폰).** 여기까지
                      오는 데 지적을 두 번 받았다 —

                        아이콘 하나를 두 줄 옆 가운데   "두 줄에 아이콘 한 개다
                                                       보니 많이 이상하다"
                        줄마다 **같은** 수화기          "서로 아이콘이 동일하다
                                                       보니 부자연스럽다"
                        줄마다 **다른** 아이콘          지금

                      같은 글리프가 두 번 반복되면 전화 표시가 아니라 목록
                      불릿처럼 읽히고, 두 번호가 **무엇이 다른지**는 여전히
                      말하지 않는다. 031 은 유선, 010 은 휴대폰이다 — 아이콘이
                      그 차이를 맡으면 반복이 사라지면서 정보가 는다.

                      ⚠️ 둘을 같은 아이콘으로 되돌리지 말 것. 하나로 줄이는
                         것도 마찬가지다(첫 줄에만 맞춰 올리는 안도 찍어
                         봤는데, 둘째 줄이 표식 없이 들여쓰기만 된 것처럼
                         보여 더 나빴다). 셋 다 지나온 자리다.

                ⚠️ MobileIcon 의 strokeWidth 가 2.2 인 까닭은 icons.tsx 주석에
                   있다 — 사각형이 수화기보다 무거워 보이는 것을 맞춘 값이다. */}
            <div className="flex flex-col">
              {[
                { tel: site.tel, Icon: PhoneIcon },
                { tel: site.telMobile, Icon: MobileIcon },
              ].map(({ tel, Icon }) => (
                <a
                  key={tel}
                  href={telHref(tel)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-white/80 transition-colors hover:text-white"
                >
                  {/* ⚠️ 13px 다. 번호가 14px 인데 아이콘을 16px(기본)로
                         두었더니 "텍스트보다 아이콘이 더 커 보인다" 는 말을
                         들었다 — 아이콘은 **꽉 찬 도형**이라 같은 크기여도
                         글자보다 커 보인다. 한 단계 아래가 맞다. */}
                  {/* ⚠️ brand-light 다. 네이비 위에서 brand(#d5261e)는
                         3.38:1 로 어둡다. */}
                  <Icon className="h-[13px] w-[13px] shrink-0 text-brand-light" />
                  {tel}
                </a>
              ))}
            </div>
            <Link
              href={headerCta.href}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98]"
            >
              {headerCta.label}
            </Link>
          </div>

          {/* ⚠️⚠️ 모바일 바에 **전화가 있어야 한다.** 한동안 로고와
                 햄버거뿐이어서, 공장에 서 있는 담당자가 가장 쉬운 전환인
                 "탭해서 전화" 를 모든 페이지 상단에서 할 수 없었다 —
                 메뉴를 연 뒤에야 번호가 나왔다. 데스크톱(lg 이상)은 바로
                 위 블록이 이미 전화와 CTA 를 들고 있다.

              ⚠️ 둘 다 h-11(44px)이다. 햄버거가 h-10(40px)이었는데 터치
                 타깃 권장치에 못 미쳤다. */}
          <div className="-mr-2 flex items-center lg:hidden">
            <a
              href={telHref(site.tel)}
              aria-label={`전화 ${site.tel}`}
              /* ⚠️ 360px 미만에서는 접는다. 320px 의 가용 폭은
                   280px(360 - Container px-5 x2)인데 로고 217 + 전화 44 +
                   햄버거 44 = 305px 라 **21px 넘쳤다** — 재서 확인했다.
                   그 폭에서는 메뉴를 열면 전화가 나오므로 기능이 사라지는
                   것은 아니다. 360 에서는 320 가용에 305 로 15px 남는다. */
              className="hidden h-11 w-11 items-center justify-center rounded-lg text-brand-light transition active:scale-95 min-[360px]:flex"
            >
              <PhoneIcon />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="flex h-11 w-11 items-center justify-center"
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
                strokeWidth="2.5"
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
              {/* 위 데스크톱 전화 링크와 같은 ink 다. 여기는 아이콘이
                  없어 레드 포인트도 없다.

                  ⚠️ 번호가 둘이다. 여기는 flex-col 스택이라 버튼 하나가 더
                     늘어도 자리가 넉넉하다 — 바깥 모바일 바와 달리 폭 다툼이
                     없다(그쪽은 아래 320px 계산 주석 참고. **둘째 번호는
                     햄버거 안에서만 보인다**).

                  ⚠️ 휴대폰 메뉴다. hover: 를 주지 않는 것이 맞다(터치에는
                     호버가 없다) — 대신 active: 로 누름을 보여 준다. */}
              {[site.tel, site.telMobile].map((tel) => (
                <a
                  key={tel}
                  href={telHref(tel)}
                  className="rounded-xl border border-line py-3 text-center text-sm font-semibold text-ink transition active:scale-[0.98]"
                >
                  전화 {tel}
                </a>
              ))}
              <Link
                href="/contact"
                className="rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white transition active:scale-[0.98]"
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
