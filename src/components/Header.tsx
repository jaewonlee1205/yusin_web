"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";
import { ListPanel, ProductPanel } from "./NavPanel";
import { products } from "@/data/products";
import { nav, site, type NavChild } from "@/data/site";

/** 마우스가 메뉴를 스쳐 지날 때 깜빡이지 않도록 닫기를 약간 늦춘다. */
const CLOSE_DELAY = 140;

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  /** 열려 있는 데스크톱 드롭다운의 href. 없으면 null */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  /** 모바일 아코디언에서 펼쳐진 항목 */
  const [expanded, setExpanded] = useState<string | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  /** 모바일에서는 제품 패널도 단순 목록으로 펼친다. */
  const productChildren = useMemo<NavChild[]>(
    () => [
      ...products.map((p) => ({
        href: `/products/${p.slug}`,
        label: p.name,
      })),
      { href: "/products", label: "제품 전체 보기" },
    ],
    []
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

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur"
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link href="/" className="shrink-0" aria-label={`${site.name} 홈으로`}>
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={403}
              height={52}
              priority
              className="h-7 w-auto sm:h-8 lg:h-9"
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-0.5 lg:flex"
          >
            {nav.map((item) => {
              const active = isActive(item.href);
              const hasPanel = item.panel === "products" || !!item.children;
              const open = openMenu === item.href;
              const panelId = `menu-${item.href.replace(/\//g, "")}`;

              if (!hasPanel) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded px-4 py-2 text-[15px] font-medium transition-colors ${
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
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenMenu(open ? null : item.href)}
                    className={`flex items-center gap-1.5 rounded px-4 py-2 text-[15px] font-medium transition-colors ${
                      active ? "text-brand" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <Chevron open={open} />
                  </button>

                  {open && (
                    <div
                      id={panelId}
                      className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 ${
                        item.panel === "products" ? "w-[30rem]" : "w-72"
                      }`}
                    >
                      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-xl shadow-ink/10">
                        {item.panel === "products" ? (
                          <ProductPanel onNavigate={() => setOpenMenu(null)} />
                        ) : (
                          <ListPanel
                            items={item.children ?? []}
                            onNavigate={() => setOpenMenu(null)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${site.tel.replace(/-/g, "")}`}
              className="text-sm font-semibold tabular-nums text-navy"
            >
              {site.tel}
            </a>
            <Link
              href="/contact"
              className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              견적 문의
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
          <Container className="py-2">
            <nav aria-label="모바일 메뉴" className="flex flex-col">
              {nav.map((item) => {
                const children =
                  item.panel === "products"
                    ? productChildren
                    : (item.children ?? null);
                const isOpen = expanded === item.href;

                if (!children) {
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
                href={`tel:${site.tel.replace(/-/g, "")}`}
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
