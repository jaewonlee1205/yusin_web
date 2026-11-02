"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import Container from "./Container";
import { getProduct, listedProducts } from "@/data/products";
import { nav, type NavChild } from "@/data/site";

/**
 * 배너(PageHero) 바로 아래 서는 **바로가기 띠**.
 *
 * ⚠️⚠️⚠️ **2026-11-02 판 (114) — 새로 생긴 부품이다.** 유신이 레퍼런스를
 *    주며 *"여기 회사소개 밑에 … 홈버튼 미디어센터 언론보도 이렇게 밑에
 *    바로 가기로 선택할 수 있게 디자인 하고 싶은데"* 라고 했다
 *    (https://itcenglobal.com/user/bbs/BD_selectBbsList.do?q_bbsSn=1020).
 *
 *    꼴은 **breadcrumb 인데 각 단계가 드롭다운**이다. 홈 네모 하나, 그 뒤에
 *    단계 둘, 단계마다 아래로 목록이 펼쳐진다. 레퍼런스를 브라우저로 열어
 *    쟀다 — 띠 50px · 홈 50x50 파란 네모 · 단계 칸 **260px 고정** · 글자
 *    16px 가운데 · 칸 오른쪽 0.8px 세로선 · 현재 쪽만 굵게.
 *
 * ⚠️ **자료를 새로 만들지 않는다.** site.ts 의 `nav` 를 그대로 읽는다 —
 *    메뉴가 이미 2단이라 그대로 들어맞는다. 제품이 늘거나 숨으면
 *    (products.ts 의 HIDDEN_SLUGS) 이 띠도 저절로 따라간다.
 *
 * ── 시안에서 고르신 것 (cmp-196 · cmp-197) ──────────────────────
 *
 * cmp-196 에서 **바탕 셋 x 칸 꼴 둘**을 보여 드렸고(월~토), cmp-197 에서
 * **칸 폭 다섯**을 보여 드렸다(차 카 타 파 하). 유신이 **「타」**를 고르셨다 —
 * 옅은 회색 바탕 · 세로선 칸 · **칸 200px**.
 *
 * ⚠️⚠️ **2026-11-02 판 (115) — cmp-198 에서 두 가지가 바뀌었다.**
 *    판 (114) 를 화면에서 보신 유신이 셋을 짚으셨다 —
 *      ① *"홈버튼 경우 위에 회사소개 하고 색상이 동일해서 구분이 잘 안가고"*
 *      ② *"회사소개 개요 같은 경우 음 너무 가로가 작게 느껴지게 크기 좀 더
 *         키우거나 다른 방향으로 이쁘게 할 수 있는 방법 찾아주고"*
 *      ③ *"드롭박스 경우도 더 이쁘게 안되나"*
 *    축 셋으로 열둘을 보여 드렸고(ㄲ~ㅉ · ⒲~⒵ · ㊇~㊉) 유신이 고른 것은
 *    **「ㅉ + ⒲」** 이고 ③ 은 *"드롭박스 쪽은 기존 그대로"* 라고 하셨다.
 *      → 홈 네모 **빨강** · 칸 **260px** · 펼친 목록은 **판 114 그대로**.
 *    ⚠️ ~~**③ 을 안 고른 것은 잊은 게 아니라 고른 것이다.** 살 붙임(㊇) ·
 *       빨강 머리선(㊈) · 빨강 왼쪽 막대(㊉)를 1.8배 확대로 나란히 보시고
 *       **지금 꼴을 고르셨다.** 나중에 "드롭다운이 밋밋하다"는 생각이 들어도
 *       여기 손대기 전에 이 줄을 먼저 볼 것~~ [[rejected-options-are-conditional]].
 *       ⚠️⚠️ **2026-11-02 판 (118) 에서 이 기각이 풀렸다 — 그리고 기각이
 *          틀렸던 게 아니다.** ㊇ 가 바로 **「항목 높이 44px」** 이었고, 그것이
 *          지금 선 값이다. 달라진 것은 **띠의 바탕**이다 — 이 글을 쓸 때
 *          띠는 옅은 회색이라 흰 드롭다운이 어울렸고, 바로 아래 판 (116)
 *          에서 **네이비가 되면서** 검정 띠 아래 흰 판이 떨어져 나와 보이게
 *          됐다. 그 뒤에 유신이 *"드롭박스 위에 헤더처럼 검정으로"* 라고
 *          하셨다. **기각 사유를 한 줄씩 꺼내 아직 유효한지 재는 것**이
 *          이 자리의 교훈이다.
 *
 * ⚠️⚠️⚠️ **2026-11-02 판 (116) — 띠가 네이비가 되고, 제품 상세 7쪽에도 선다.**
 *
 *    유신: *"홈 / 제품 / 직진피더 여기 경우도 디자인이 홈 / 제품 / 전체
 *    이렇게 디자인으로 변경 되어야 이쁠거 같은데 … 텍스트로 되어 있는거
 *    별로 인거 같은데"* — 제품 상세의 글자 빵부스러기(`Breadcrumb`)를 이
 *    띠로 바꿔 달라는 말이다.
 *
 *    cmp-199 에서 **색 다섯**을 드렸다. 칸 260 · 글자 15 · 띠 48 · 드롭다운은
 *    다섯이 다 같고 **색만** 달랐다 —
 *      ㅏ 옅은 회색(목록과 같게, 아래 경계 16.04) · **ㅓ 네이비**(1) ·
 *      ㅗ 네이비+홈도 네이비(1) · ㅜ 흰색(17.19) ·
 *      **ㅡ 네이비 + 목록 7쪽까지 함께**(1)
 *    내 추천은 **ㅓ**(상세 7쪽만 네이비)였고 유신은 **「ㅡ」**를 고르셨다.
 *      → **사이트 열네 쪽의 띠가 모두 네이비 한 가지가 된다.**
 *
 *    ⚠️⚠️ **이것은 cmp-196 의 결정을 뒤집은 것이다.** 그때 바탕 셋(흰 ·
 *       옅은 회색 · 네이비)을 보시고 **옅은 회색**을 고르셨다. 그 선택이
 *       틀려서 뒤집힌 게 아니라 **보신 자리가 달라졌다** —
 *       cmp-196 은 **배너 아래** 한 자리만 보고 고른 것이었고, cmp-199 는
 *       **제품 상세(네이비 헤더와 네이비 히어로 사이)까지 함께** 본 판이다.
 *       그 자리에서 회색 띠는 네이비 사이에 낀 한 칸이 된다
 *       [[rejected-options-are-conditional]].
 *    ⚠️ **되돌릴 때는 이 파일만 고치면 된다** — 겉의 바탕/테두리와 글자 색
 *       넉 줄이다. 옛 값은 surface 바탕 · line 테두리 · ink-soft/ink 글자.
 *       ⚠️⚠️ 위 토큰들을 **클래스 꼴로 적지 말 것**(배경·테두리·글자 접두어를
 *          붙여 적지 말 것). Tailwind 가 주석까지 긁어 **아무도 안 쓰는
 *          규칙이 빌드 CSS 에 남는다** [[tailwind-scrapes-comments]].
 *
 * ⚠️⚠️⚠️ **2026-11-02 판 (118) — 펼친 목록이 헤더 드롭다운을 따라갔다.**
 *
 *    유신: *"드롭박스 위에 헤더처럼 검정으로 하고 지금 여기 드롭박스는
 *    텍스트가 위아래로 너무 붙어 있는데 … 헤더쪽 드롭박스는 텍스트 간에
 *    여백이 있거든 이렇게"* — 짚으신 것은 **둘**이다. ① 바탕 색 ② 줄 여백.
 *    둘 다 **헤더 드롭다운이 과녁**이라고 이름까지 대 주셨다.
 *
 *    cmp-202 에서 **헤더를 어디까지 가져올지**로 넷을 드렸다(색은 말씀대로
 *    하나로 못박았다) —
 *      ㅑ 헤더를 그대로(둥근 판 · 8px 뗌 · 224px) · ㅕ 띠에 맞추고 속살은
 *      헤더(알약 칸 + 화살표) · **ㅣ 띠에 맞추고 조용히** · ㅚ 칸 40
 *    내 추천과 유신의 선택이 **둘 다 「ㅣ」** 였다.
 *      → 바탕 **dark-deep** · 테두리 **흰 15%** · 칸 **44px** · 글자 흰색 700
 *        · hover 흰 10% + brand-light. **겉모습(각짐·붙음·왼쪽)은 그대로.**
 *
 *    ⚠️ 재 보니 헤더 44px 대 띠 36px, 꼭 **8px 차이**였다. 그 8px 이
 *       *"너무 붙어 있다"* 의 정체다. 곁B 에서 36·40·44·48 을 나란히 드렸다.
 *    ⚠️ **글자 대비가 7.64 → 18.41 로 올랐다**(픽셀로 쟀다). 흰 판의
 *       진회색보다 검정 판의 흰 글자가 훨씬 또렷하다.
 *    ⚠️ 바뀐 자리는 **이 파일의 `<ul>` 한 줄과 그 안 `<Link>` 한 줄**뿐이다.
 *       `NavPanel.tsx`(헤더 드롭다운)는 **과녁이지 대상이 아니라** 안 건드렸다.
 *    ⚠️ 「지금 쪽」 표시는 곁A ①(바탕 흰 10%)이다. 까닭과 ② 로 바꾸는 법은
 *       아래 `<Link>` 주석에 적어 두었다.
 *
 * ⚠️⚠️ **칸 폭은 cmp-196 에서 한 번 틀렸던 자리다.** 처음에 글자에 맞춘
 *    자동 폭(119/90px)으로 드렸더니 *"너무 따닥 따닥 붙어 있는 느낌이야 …
 *    너무 답답한 느낌이 드는데"* 를 들었다. 같은 자로 재 보니 —
 *      ITCEN GLOBAL   칸 260px · 1단계 글자 끝에서 2단계 글자 시작까지 200px
 *      cmp-196        칸 119/90px · 같은 거리 **63px**
 *    3.2배였다. **고정 폭의 빈자리가 이 띠의 숨구멍**이었다. 200px 에서는
 *    그 거리가 **159px** 이 된다(실측). **이 수를 좁히지 말 것.**
 *
 * ── 왜 이 색인가 ────────────────────────────────────────────────
 *
 * ⚠️⚠️⚠️ **띠는 네이비다(판 116). 아래는 뒤집히기 전의 기록이다.**
 *
 *    ~~바로 위가 **네이비 배너**다. 흰 띠는 본문과 같은 색이라 띠가 안 보이고
 *    본문의 첫 줄처럼 읽히고, 네이비 띠는 배너와 한 덩어리로 이어져 배너가
 *    48px 길어진 것으로 보인다. **옅은 회색만 배너와 본문 사이의 한 단**이
 *    되어 양쪽 어디에도 붙지 않는다.~~
 *
 *    **이 셈 자체는 틀리지 않았다.** 목록 일곱 쪽만 보면 지금도 참이다 —
 *    네이비 띠는 배너와 이어져 **배너가 48px 길어진 것처럼** 보인다.
 *    유신은 그것을 보고도 ㅡ 를 고르셨다. 바뀐 것은 **무게**다. 띠가 열네
 *    쪽에 서게 되자 *"배너 아래에서 한 단으로 보이는가"* 보다 *"사이트의
 *    띠가 한 가지인가"* 가 더 커졌다.
 *    ⚠️ 그러니 **배너와 이어져 보이는 것은 지금도 그대로 있는 대가다.**
 *       나중에 "목록 쪽 띠가 배너에 묻힌다"는 생각이 들면 그것은 새로 생긴
 *       문제가 아니라 **알고 치른 값**이다 [[yusin-decisions-live-in-comments]].
 *
 * ⚠️ **글자 색은 흰 바탕 기준이 아니라 네이비 기준으로 다시 골랐다.**
 *    Breadcrumb 이 2026-10-14 에 네이비로 뒤집히며 **화면 픽셀로 재서**
 *    고른 짝을 그대로 가져왔다 — 상위 white/70 **8.9:1**, 지금 쪽 white
 *    **17.19:1** (둘 다 AA 4.5 를 넘는다). cmp-199 에서 다시 재서 17.19 를
 *    확인했다 [[copy-the-neighbor-not-just-the-value]].
 *
 * ⚠️⚠️⚠️ **홈 네모는 빨강이다(판 115). 아래는 뒤집히기 전의 기록이다.**
 *
 *    ~~홈 네모는 네이비다. 레퍼런스는 그 회사의 메인 컬러인 파랑으로
 *    채웠는데, 여기서 같은 자리를 빨강으로 채우면 **빨강 채움은 견적 문의
 *    전용**이라는 규칙과 부딪친다(판 104 에서 아이콘 원을 빨강에서 네이비로
 *    돌린 그 규칙이다). 시안 cmp-196 의 곁가지 B 가 빨강 모습이었고
 *    유신이 고르지 않으셨다.~~
 *
 *    **왜 네이비가 틀렸나** — 레퍼런스(ITCEN)는 **띠 위가 흰 헤더**인데
 *    여기는 **띠 위가 네이비 배너(PageHero)** 다. 색만 옮기고 **그 색이
 *    놓일 이웃을 안 봤다.** 재 보니 배너도 홈도 #0d1b33 이라 홈 윗변의
 *    경계 대비가 **1.01 — 경계가 아예 없었다.** 홈이 띠 높이와 같은 48px
 *    라 배너에 틈 없이 닿아 **배너의 꼬리로 읽혔다.**
 *
 *    **빨강 규칙은 알고 깬 것이다.** cmp-198 에서 다섯 안을 드리며 ㅉ 에만
 *    *"고르시면 그 규칙이 깨진다"* 고 적었고, 유신이 그것을 보고 **ㅉ 를
 *    고르셨다.** 내 추천은 ㄸ(네이비를 띄워 색을 안 바꾸는 안, 경계 16.04)
 *    였다. 수치로는 —
 *      ㄲ 흰 네모 16.99 · ㄸ 띄운 네모 16.04 · ㅃ 빨강 윗선 3.34 ·
 *      ㅆ 회색 네모 15.41 · **ㅉ 빨강 네모 3.34**
 *    ⚠️ **그러니 「빨강은 견적 문의 전용」은 더 이상 통째로 참이 아니다.**
 *       다른 자리에서 빨강을 쓸지 말지는 그때 다시 물을 것 — 이 한 곳이
 *       허락됐다고 규칙이 사라진 것은 아니다 [[dont-promote-inference-to-fact]].
 *    ⚠️ 되돌릴 때는 `bg-brand` 를 `bg-dark` 로, hover 색을 brand-dark 에서
 *       dark-deep 토큰으로 돌리면 된다. 다만 **그러면 ① 지적이 그대로
 *       돌아온다** — ㄸ(36x36 으로 줄여 띄우기)가 그때의 답이다.
 *       ⚠️⚠️ 위 두 토큰 이름을 **클래스 꼴로 적지 말 것**(hover 접두어를
 *          붙여 적지 말 것). Tailwind 가 주석까지 긁어 **아무도 안 쓰는
 *          규칙이 빌드 CSS 에 남는다** [[tailwind-scrapes-comments]].
 *
 * ── 안 건드린 것 ────────────────────────────────────────────────
 *
 * ⚠️⚠️⚠️ **제품 상세에도 단다(판 116). 아래는 뒤집히기 전의 기록이다.**
 *
 *    ~~**제품 상세 일곱 쪽에는 달지 않는다.** 거기만 PageHero 가 없고
 *    네이비 `Breadcrumb` 이 배너 자리를 맡고 있어, 이 띠를 그대로 깔면
 *    비슷한 띠가 둘이 된다. 시안 cmp-196 의 곁가지 E 로 갈아끼운 모습을
 *    보여 드리고 **셋 중 하나를 고르셔야 한다**고 적었는데 말씀이 없어
 *    **그대로 두었다**.~~
 *
 *    *"달 때는 `PageHero` 에 `path` 를 넘기는 대신 `Breadcrumb` 자리를 이
 *    부품으로 바꾼다"* — 그때 적어 둔 그대로 했다. **띠가 둘이 되는 일은
 *    없다. `Breadcrumb` 을 걷고 그 자리를 이 띠가 맡기 때문이다.**
 *    ⚠️ `Breadcrumb.tsx` 는 **지우지 않았다.** 이제 아무도 쓰지 않는
 *       부품이고, 그 사실을 그 파일 머리에 적어 두었다.
 *
 * ⚠️ **홈(/)에는 여전히 달지 않는다** — 거기는 PageHero 가 없고, `nav` 에
 *    `/` 가 없어 `stepsFor` 가 빈 배열을 돌려준다(저절로 빠진다).
 */

/** 한 단계. 라벨은 지금 자리, 항목은 그 자리에서 고를 수 있는 것들.
 *
 * ⚠️ `current` 는 **펼친 목록에서 굵게 설 항목**이다. 거의 늘 지금 쪽
 *    주소지만, **제품 상세에서는 1단계가 다르다** — 거기서 path 는
 *    `/products/linear-feeder` 인데 1단계 목록에 있는 것은 `/products` 다.
 *    이것을 안 두면 상세에서 1단계를 펼쳤을 때 **「제품」이 안 굵어진다**
 *    (판 116 실측에서 `지금「없음」`으로 잡혔다). 목록 쪽에서는 멀쩡하고
 *    상세에서만 빠지는, **같은 부품이 쪽마다 다르게 서는** 어긋남이었다.
 * ⚠️ 숨긴 제품(진동기)의 2단계는 `current` 를 **일부러 안 넘긴다** — 그
 *    쪽이 목록에 없으니 굵게 설 항목도 없는 것이 맞다. */
type Step = { label: string; items: NavChild[]; current?: string };

/**
 * 지금 쪽에서 설 단계들을 `nav` 에서 뽑는다.
 *
 * ⚠️ **오시는 길과 문의하기는 2단계가 없다** — 그 쪽에서는 칸이 하나만
 *    선다. 시안 cmp-196 의 곁가지 D 가 그 모습이고, 허전하지 않다는 것을
 *    보고 넘어갔다.
 * ⚠️ `childrenFrom: "products"` 는 Header 와 **같은 꼴로** 푼다 —
 *    맨 앞이 「전체」이고 그 뒤가 제품들이다. 두 곳이 어긋나면 같은 메뉴가
 *    두 이름으로 불린다.
 *
 * ⚠️⚠️ **판 (116) — 제품 상세가 여기서 걸러지고 있었다.** `/products/
 *    linear-feeder` 는 `nav` 의 어느 href 와도 같지 않고, 제품 항목은
 *    `childrenFrom` 으로 받아 `children` 이 아예 없다. 그래서 이 함수가
 *    **빈 배열**을 돌려주고 띠가 안 섰다 — 판 114 주석에 *"이 함수를
 *    고쳐야 한다"* 고 적어 둔 자리다. 세 번째 조건이 그 고침이다.
 *    ⚠️ `startsWith` 를 쓰므로 **`/products` 자신은 걸리지 않는다**
 *       (슬래시까지 보기 때문이다). 그 쪽은 첫 조건에서 이미 걸린다.
 *
 * ⚠️⚠️⚠️ **2026-11-02 판 (117) — 그 세 번째 조건을 이제 아무도 밟지 않는다.**
 *    제품 상세 일곱 쪽에서 띠를 걷었다(cmp-201 「ㅐ」). 그러니 지금
 *    `path` 로 `/products/<slug>` 가 들어오는 일이 없다.
 *    ⚠️ **지우지 않았다.** 하루 만에 Breadcrumb → 띠 → 없앰 으로 세 번
 *       바뀐 자리다. 되살리자는 말이 나오면 이 조건과 아래 숨긴 제품
 *       블록이 **그때 바로 선다** — 다시 짤 필요가 없다
 *       [[yusin-decisions-live-in-comments]].
 *    ⚠️ **목록 일곱 쪽은 그대로다** — 거기는 첫 조건(`i.href === path`)과
 *       두 번째 조건으로 걸린다. 이 판에서 이 파일의 **동작은 한 줄도
 *       바뀌지 않았다**(주석만 더했다).
 */
function stepsFor(path: string): Step[] {
  const top = nav.find(
    (i) =>
      i.href === path ||
      (i.children ?? []).some((c) => c.href === path) ||
      (i.childrenFrom === "products" && path.startsWith("/products/"))
  );
  if (!top) return [];

  const tops: NavChild[] = nav.map((i) => ({ href: i.href, label: i.label }));
  const steps: Step[] = [{ label: top.label, items: tops, current: top.href }];

  const kids: NavChild[] =
    top.childrenFrom === "products"
      ? [
          { href: "/products", label: "전체" },
          ...listedProducts.map((p) => ({
            href: `/products/${p.slug}`,
            label: p.name,
          })),
        ]
      : (top.children ?? []);

  if (kids.length > 0) {
    const here = kids.find((c) => c.href === path);
    if (here) {
      steps.push({ label: here.label, items: kids, current: here.href });
    } else if (top.childrenFrom === "products") {
      /* ⚠️⚠️ **숨긴 제품(HIDDEN_SLUGS)의 쪽.** 목록(`listedProducts`)에서
         걷혀 `kids` 안에 없지만, **2단계는 선다** — 거기 서 있는데 띠가
         「제품」 하나만 보이면 지금 어디인지 알 수 없다. 펼친 목록 안에
         그 쪽이 없으니 **지금 쪽 표시만 안 뜬다.**
         ⚠️ cmp-199 의 곁D 가 이 모습이고, 그때 꼬리말에 *"1단계만 선다"* 고
            적었다가 **그림과 어긋나 고쳤다.** 시안이 정하지 못하는 자리라
            적고 *"제 생각은 그림처럼 세우는 쪽"* 이라고 드렸다 — 지금 이
            코드가 그 쪽이다 [[dont-promote-inference-to-fact]]. */
      const hidden = getProduct(path.slice("/products/".length));
      if (hidden) steps.push({ label: hidden.name, items: kids });
    }
  }
  return steps;
}

export default function PageNav({ path }: { path: string }) {
  const steps = stepsFor(path);
  const [open, setOpen] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  /* Escape 로 닫고, 띠 밖을 누르면 닫는다. Header 가 쓰는 짝과 같은
     꼴이다 — 한 쪽에서 두 드롭다운이 다르게 닫히면 안 된다. */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  if (steps.length === 0) return null;

  return (
    /* ⚠️ `z-20` 이 필요하다 — 펼친 목록이 아래 본문 위에 떠야 한다.
          헤더는 `z-50` 이라 스크롤해도 이 띠가 헤더를 덮지 않는다.
          ⚠️⚠️ 제품 상세에서는 **아래가 네이비 히어로**라 이 수가 더 중요해졌다
             (판 116). 히어로는 position 이 static 이라 z 값이 없고, 펼친
             목록이 그 위에 뜬다 — 빌드해서 눈으로 확인한 것이다.

          ⚠️⚠️ **바탕이 네이비다(판 116, 시안 ㅡ).** 아래 테두리는 Breadcrumb 이
             쓰던 값과 **같은 짝**이다 — 그 자리를 이 띠가 물려받았으니 헤더와
             가르는 선도 그대로 물려받는다. */
    <div ref={rootRef} className="relative z-20 border-b border-white/10 bg-dark">
      <Container>
        <nav aria-label="바로가기" className="flex h-12 items-stretch">
          {/* 홈 — 48x48 **빨강** 네모(판 115). 레퍼런스가 메인 컬러로 채운
              자리이고, 유신이 cmp-198 에서 「ㅉ」로 고르셨다. 까닭과 뒤집힌
              기록은 이 파일 머리 주석에 있다. */}
          <Link
            href="/"
            aria-label="홈으로"
            className="flex h-12 w-12 shrink-0 items-center justify-center bg-brand text-white transition-colors hover:bg-brand-dark"
          >
            <HomeIcon />
          </Link>

          {steps.map((step, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-${i}`;
            return (
              /* ⚠️⚠️ **칸 폭 260px 은 유신이 cmp-198 에서 고른 수다**(「⒲」).
                    판 114 는 **200px**(cmp-197 의 「타」)였는데, 화면에서 보신
                    유신이 *"너무 가로가 작게 느껴지게"* 라고 하셨다. 재 보니
                    띠 안쪽 1088px 중 **448px 만 쓰고 640px 가 빈 회색**이었다.
                    260px 에서는 568px 를 쓴다.
                    ⚠️ **cmp-197 의 「타」를 뒤집은 것이 아니다.** 그때 물은
                       축은 *칸 사이가 얼마나 벌어지는가*였고 200px 로 「따닥
                       붙어 답답」은 풀렸다(글자 사이 63 → 158px). 이번은
                       *칸 자체가 작아 보인다* 는 **다른 축**이다.
                    ⚠️ **1088 을 꽉 채우는 안(⒳, 칸 520px)은 안 고르셨다.**
                       그 안에는 펼친 목록도 522px 가 되는 대가가 있었다.
                    ⚠️ 260px 은 **레퍼런스(ITCEN)와 같은 수**이기도 하다.

                    `flex-[0_1_260px]` 와 `min-w-0` 이 **한 쌍**이다 — 390 에서
                    홈 48 + 260x2 = 568px 은 안쪽 350px 에 안 들어가므로
                    줄어들 수 있어야 한다. `min-w-0` 이 없으면 flex 항목의
                    기본 min-width 가 auto 라 내용 폭 아래로 안 내려가고
                    가로 스크롤이 생긴다. 실측 — 390 에서 151/151px 로
                    **200px 일 때와 같아진다**(남는 자리를 나눠 갖는다). */
              <div
                key={step.label + i}
                className="relative flex min-w-0 flex-[0_1_260px] items-center"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  /* ⚠️ 마지막 단계가 **지금 보고 있는 쪽**이라 굵고 진하다.
                        앞 단계는 가늘고 한 단 옅다 — 레퍼런스와 같은 짝이다
                        (상위 #4a4a4a 400 · 현재 #161616 700).

                     ⚠️⚠️⚠️ **아래 다섯 문단은 띠가 옅은 회색이던 때(판 114)의
                        기록이다. 판 116 에서 바탕이 네이비가 되어 전제가
                        사라졌다** — 지금 쓰는 값은 바로 위 주석에 있다.
                        지우지 않는 까닭은 **되돌릴 때 이 함정이 그대로
                        돌아오기 때문**이다.

                     ~~**앞 단계를 한 단 옅은 회색으로 내리지 말 것.** 처음에
                        그렇게 썼다가 **화면 픽셀로 재서** 되돌렸다 — 그 바탕
                        (#f6f7f9) 위에서 muted(#6b7280)는 **4.51** 이다.
                        AA(4.5)를 0.01 로 넘기는 수는 재는 판마다 오르내려
                        통과로 볼 수 없다(배너 eyebrow 를 390 에서 4.48 로
                        본 그 자리와 같은 판단이다 — PageHero.tsx 주석).
                        ink-soft(#414751)는 같은 바탕에서 **8.70** 이고,
                        레퍼런스의 상위 색(흰 바탕 8.9)과 거의 같은 자리다.
                        ⚠️ 글자 셈이 아니라 **픽셀**로 잰 값이다.~~

                     ⚠️ **아래 둘은 색이 바뀌어도 그대로 유효하다.**
                        · Tailwind v4 는 computed color 를 oklab 으로 내보내
                          **토큰으로 셈하면 어긋난다** — 늘 픽셀로 잴 것.
                        · 두 단계는 색이 아니라 **굵기로** 갈린다(400 ↔ 700).
                          색으로만 가르려 하면 둘 중 하나가 반드시 흐려진다
                          [[weak-line-means-contrast-not-width]]. */
                  /* ⚠️⚠️ **색 넉 줄이 판 116 에서 뒤집힌 자리다.** 흰 바탕에서
                        고른 ink-soft/ink 짝은 네이비 위에서 안 읽힌다. 위 머리
                        주석의 네이비 기준 짝(white/70 8.9 · white 17.19)으로
                        갈아 끼웠다. 칸 구분선도 line 에서 흰 15% 로 바꿨다 —
                        네이비 위에서 회색 선은 보이지 않는다. */
                  className={`flex h-12 w-full min-w-0 items-center justify-center gap-2.5 border-r border-white/15 px-3.5 text-15 transition-colors hover:text-white ${
                    i === 0 ? "border-l border-white/15" : ""
                  } ${
                    i === steps.length - 1
                      ? "font-bold text-white"
                      : "font-normal text-white/70"
                  }`}
                >
                  <span className="truncate">{step.label}</span>
                  <Chevron open={isOpen} />
                </button>

                {isOpen && (
                  /* ⚠️⚠️⚠️ **2026-11-02 판 (118) — 펼친 목록을 헤더 드롭다운에
                        맞췄다.** 유신: *"드롭박스 위에 헤더처럼 검정으로 하고
                        지금 여기 드롭박스는 텍스트가 위아래로 너무 붙어 있는데
                        … 헤더쪽 드롭박스는 텍스트 간에 여백이 있거든 이렇게"*
                        cmp-202 에서 **「ㅣ」**(띠에 맞추고 조용히)를 고르셨다.

                     옛 값(⚠️ 접두어를 붙여 **클래스 꼴로 적지 않는다** —
                     Tailwind 가 주석을 긁는다 [[tailwind-scrapes-comments]]) —
                     판은 line 테두리에 흰 바탕, 항목은 좌우 20px·위아래 8px
                     (칸 36px)에 ink-soft 글자, 지금 쪽은 field 바탕 + 굵게 +
                     ink 글자, hover 는 field 바탕 + brand 글자였다.

                     ⚠️ **겉모습은 일부러 안 바꿨다.** 각짐 · `border-t-0` ·
                        `top-12`(칸에 붙음) · `left-0` · `min-w-full` 이 그대로다.
                        헤더 드롭다운은 **메뉴 아래 떠 있는 판**이라 둥글고
                        8px 떨어져 있어도 되지만, 이 띠는 **칸에 이어 붙은
                        서랍**이라 아래가 떨어져 나오면 띠가 두 조각으로 보인다.
                        시안에서 그 안(「ㅑ」 — 헤더를 그대로)도 나란히 드렸고,
                        유신이 **ㅣ** 를 고르셨다 [[copy-the-neighbor-not-just-the-value]].
                     ⚠️ 그래서 **화살표(→)도 안 단다**(「ㅕ」가 그 안이었다).

                     ⚠️⚠️ **이 자리는 cmp-198 에서 한 번 기각하신 곳이다 — 그
                        기각이 틀렸던 게 아니다.** 아래 판 (115) 블록을 볼 것.
                        그때 띠는 **옅은 회색**이라 흰 판이 어울렸고, 판 116 에서
                        **네이비가 되면서** 검정 띠 아래 흰 판이 떨어져 나와
                        보이게 됐다. 헤더도 같은 길을 먼저 갔다 — 흰 헤더 시절
                        `NavPanel.tsx` 도 흰 판이었고 2026-10-14 에 어두운 판으로
                        갈았다 [[rejected-options-are-conditional]].

                     ⚠️ **칸이 44px 이 되면 목록이 길어진다.** 가장 긴 제품
                        2단계(7항목)가 **265 → 321px**(+56)이다. 재서 확인했다. */
                  <ul
                    id={panelId}
                    className="absolute left-0 top-12 z-30 min-w-full border border-t-0 border-white/15 bg-dark-deep py-1.5 shadow-overlay"
                  >
                    {step.items.map((it) => {
                      /* ⚠️ `path` 가 아니라 **이 단계의 `current`** 와 견준다.
                            까닭은 Step 의 주석에 있다(판 116). */
                      const now = it.href === step.current;
                      return (
                        <li key={it.href}>
                          <Link
                            href={it.href}
                            aria-current={now ? "page" : undefined}
                            onClick={() => setOpen(null)}
                            /* ⚠️ `py-3` 이 칸을 **44px** 로 만든다(12 + 20 + 12).
                                  헤더 `ListPanel` 의 `p-3` 과 같은 값이다 —
                                  36px 과의 8px 차이가 *"너무 붙어 있다"* 였다.
                                  **위아래 8px(칸 36) 으로 되돌리지 말 것.**
                                  시안 곁B 에서 36 · 40 · 44 · 48 을 나란히
                                  보시고 고르셨다.

                               ⚠️⚠️ **지금 쪽은 바탕으로만 갈린다.** 글자는 전부
                                  흰색 700 이다(헤더와 같게) — `font-bold` 가
                                  모두에게 걸려 **굵기로는 못 가른다.**
                                  ⚠️ 그래서 **`hover:text-brand-light` 를 걷지 말
                                     것.** 그것이 없으면 「지금 쪽」과 「마우스
                                     올린 칸」이 바탕(둘 다 white/10)·글자·굵기가
                                     전부 같아져 **구별이 사라진다.**
                                  ⚠️ 시안 곁A 에서 세 안을 재서 드렸다 —
                                     ①(지금 이것) · ②왼쪽 빨강 3px 막대 ·
                                     ③글자만 빨강. 내 추천은 ② 였고 말씀이
                                     없으셔서 **ㅣ 를 그린 그림 그대로인 ①** 로
                                     뒀다. ② 로 바꾸려면 아래 `now` 자리의 바탕
                                     대신 **brand 색 왼쪽 inset 그림자 3px** 를
                                     임의값 shadow 로 걸면 된다 — 한 줄이다.
                                     ⚠️⚠️ 그 임의값을 여기 **클래스 꼴로 적지
                                        않는다.** Tailwind 가 주석까지 긁어 아무도
                                        안 쓰는 규칙을 빌드 CSS 에 남긴다
                                        [[tailwind-scrapes-comments]].

                               ⚠️ 색은 토큰으로 셈하지 말고 **픽셀로** 잴 것.
                                  Tailwind v4 는 oklab 으로 내보낸다(머리 주석). */
                            className={`block whitespace-nowrap px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 hover:text-brand-light ${
                              now ? "bg-white/10" : ""
                            }`}
                          >
                            {it.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}

/** 집 모양. 사이트에 홈 아이콘이 없어 여기서 그린다(19px, 선 1.8). */
function HomeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.6V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.6" />
    </svg>
  );
}

/** Header 의 Chevron 과 **같은 그림**이다. 한 사이트에서 화살표가 둘이면
    같은 뜻을 두 모양으로 말하는 꼴이라, 크기만 12px 로 줄여 쓴다. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      /* ⚠️ 판 116 에서 0.65 → **0.75**. 네이비 위의 흰 화살표는 회색 위의
            진회색보다 가라앉아 보여, 시안 ㅡ 에서 쓴 값을 그대로 옮겼다
            [[match-the-result-not-the-value]]. */
      className={`shrink-0 opacity-75 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
