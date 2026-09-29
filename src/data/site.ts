/**
 * 사이트 전역 상수. 연락처·주소처럼 자주 바뀌는 값은 전부 여기 모아둔다.
 *
 * ⚠️ TODO — 유신 F.A 시스템 측 확인 필요 (회사 소개서 PPT에 없던 항목)
 *   1. 대표전화 / 팩스 / 이메일        : 아래 값은 전부 임시다. 오픈 전 반드시 교체.
 *   2. 도로명 주소                     : PPT에는 지번과 건물명이 섞인 주소만 있었다.
 *   3. 사업자등록번호                  : 푸터 표기용.
 *   4. 영업시간                        : 동종업계 관행대로 적어둔 값.
 */

export const site = {
  name: "유신 F.A 시스템",
  nameEn: "YUSIN F.A SYSTEM",
  tagline: "FEEDING AUTOMATION SYSTEM",
  description:
    "1992년 설립 이래 볼피더·직진피더·호퍼피더·방음커버·컨트롤러를 자체 설계부터 가공·튜닝까지 일관 제작해 온 부품 자동정렬 공급기 전문 기업입니다.",
  url: "https://yusin-fa.com", // TODO: 실제 도메인 확정 후 교체
  founded: "1992-06-06",
  ceo: "이준희",

  // TODO: 아래 4개 값은 임시입니다. 실제 정보로 교체하세요.
  tel: "031-000-0000",
  fax: "031-000-0000",
  email: "yusinfa@naver.com",
  businessNumber: "000-00-00000",

  address: {
    // TODO: 도로명 주소 확정 필요.
    road: "경기도 시흥시 정왕동 1288-2 동우디지털파크 A동 323~324호",
    jibun: "경기도 시흥시 정왕동 1288-2",
    detail: "동우디지털파크 A동 323~324호",
    postalCode: "15090", // TODO: 확인 필요
    region: "경기도 시흥시",
  },

  hours: {
    weekday: "평일 09:00 – 18:00",
    lunch: "점심 12:00 – 13:00",
    holiday: "토·일요일, 공휴일 휴무",
  },
} as const;

export type NavChild = { href: string; label: string; desc?: string };

export type NavItem = {
  href: string;
  label: string;
  /** 드롭다운으로 펼칠 하위 메뉴 */
  children?: NavChild[];
  /**
   * 하위 메뉴를 어떻게 그릴지.
   *  - "list"  : 단순 목록 (기본)
   *  - "products" : 제품 썸네일 패널 (src/data/products.ts를 직접 읽는다)
   */
  panel?: "list" | "products";
};

export const nav: NavItem[] = [
  {
    href: "/company",
    label: "회사소개",
    panel: "list",
    children: [
      {
        href: "/company",
        label: "회사소개",
        desc: "인사말 · 회사 개요 · 사명",
      },
      {
        href: "/company/vision",
        label: "조직 · 경영이념",
        desc: "조직도 · 사회복지 · 연구개발",
      },
      {
        href: "/company/facility",
        label: "보유 설비",
        desc: "21종 55대 · 가공 도면 · 제작 공정",
      },
    ],
  },
  { href: "/products", label: "제품", panel: "products" },
  { href: "/clients", label: "납품실적" },
  { href: "/location", label: "오시는 길" },
  { href: "/contact", label: "문의하기" },
];

/** 회사소개 그룹의 하위 탭. SubNav가 쓴다. */
export const companyTabs: NavChild[] =
  nav.find((item) => item.href === "/company")?.children ?? [];
