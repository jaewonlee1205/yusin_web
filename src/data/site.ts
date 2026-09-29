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

/**
 * 설립 후 햇수. "30년"처럼 글에 박아 두면 해가 갈수록 회사를 깎아 말하게 된다.
 * (1992년 설립인데 본문은 30년이라 적혀 있었다 — 홈 통계는 계산값이라 34였다)
 *
 * 정적 배포라 빌드 시점에 값이 굳는다. 해가 바뀌면 다시 빌드해야 따라온다.
 */
export const yearsInBusiness =
  new Date().getFullYear() - Number(site.founded.slice(0, 4));

export type NavChild = { href: string; label: string };

export type NavItem = {
  href: string;
  label: string;
  /** 드롭다운으로 펼칠 하위 메뉴 */
  children?: NavChild[];
  /**
   * 하위 항목을 src/data/products.ts에서 가져온다는 표시. 제품을 추가하면
   * 메뉴도 따라 늘어난다. 생략하면 위 children을 그대로 쓴다.
   * 그리는 모양은 어느 쪽이든 같다 (ListPanel 하나뿐이다).
   */
  childrenFrom?: "products";
};

export const nav: NavItem[] = [
  {
    href: "/company",
    label: "회사소개",
    children: [
      // 메뉴는 스캔하는 곳이라 항목마다 한 낱말만 둔다. 부모가 이미 "회사소개"라
      // 첫 항목까지 같은 이름이면 어색해서, 페이지 안에 실제로 있는 것을 부른다.
      // ("회사 개요"로 하면 부모와 "회사"가 겹치고, 경영이념은 조직도와 같은
      //  페이지에 있다.)
      { href: "/company", label: "개요" },
      { href: "/company/vision", label: "조직도" },
      { href: "/company/facility", label: "보유 설비" },
    ],
  },
  { href: "/products", label: "제품", childrenFrom: "products" },
  { href: "/clients", label: "납품실적" },
  { href: "/videos", label: "영상자료" },
  { href: "/location", label: "오시는 길" },
  { href: "/contact", label: "문의하기" },
];

/**
 * 헤더 오른쪽 CTA 버튼.
 * 데스크톱 메뉴에서는 이 버튼과 목적지가 겹치는 항목을 감춘다 — 바로 옆에 같은 곳으로
 * 가는 링크가 둘 있으면 중복이다. 모바일 메뉴와 푸터에는 그대로 남는다.
 */
export const headerCta = { href: "/contact", label: "견적 문의" };
