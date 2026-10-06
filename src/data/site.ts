/**
 * 사이트 전역 상수. 연락처·주소처럼 자주 바뀌는 값은 전부 여기 모아둔다.
 *
 * 전화·팩스·이메일·사업자등록번호·영업시간·호수는 2026-09-30 유신 측에서
 * 받은 실제 값이다. 그 전까지 쓰던 임시값은 git 이력에 남아 있다.
 *
 * ⚠️ TODO — 아직 확인이 필요한 것
 *   1. 도로명 주소   : 아래는 여전히 지번이다. 지도·검색 노출에 쓰인다.
 *   2. 우편번호      : 15090 은 추정값이다.
 *   (3. 도메인은 2026-10-06 에 yusin.co.kr 로 확정했다. url 을 바꾸면
 *    JSON-LD·sitemap·robots·OG 가 한꺼번에 따라간다.)
 */

export const site = {
  name: "유신 F.A 시스템",
  nameEn: "YUSIN F.A SYSTEM",
  tagline: "FEEDING AUTOMATION SYSTEM",
  description:
    "1992년 설립 이래 볼피더·직진피더·호퍼피더·방음커버·컨트롤러를 자체 설계부터 가공·튜닝까지 일관 제작해 온 부품 자동정렬 공급기 전문 기업입니다.",
  url: "https://yusin.co.kr",
  founded: "1992-06-06",
  ceo: "이준희",

  /** 대표번호. 헤더·푸터·하단 CTA 에는 이 번호 하나만 나간다. */
  tel: "031-434-0065",
  /**
   * 대표번호 말고 쓰는 회선들. 오시는 길·문의하기·회사 개요처럼 자리가
   * 넉넉한 곳에만 펼친다 — 좋은 자리에 번호 넷이 줄지어 서면 어디를
   * 눌러야 하는지 흐려진다.
   * "7241~2" 는 7241·7242 두 회선이라는 뜻이다(받은 표기 그대로).
   */
  telExtra: ["031-434-7241~2", "031-318-0052", "032-341-0045"],
  fax: "031-434-7243",
  email: "jh1730jh@hanmail.net",
  businessNumber: "130-13-71640",

  /**
   * 회사 유튜브 채널. 푸터·영상자료 페이지·홈 JSON-LD 가 함께 쓴다.
   *
   * 핸들에 한글이 들어가 퍼센트 인코딩된 형태로 둔다(@유신F.A시스템-m9o8e).
   * 전에는 videos.ts 에 @이재원-m9o8e 로 적혀 있었다 — 채널 이름을 개인명에서
   * 회사명으로 바꾸기 전 주소다. 뒤의 -m9o8e 가 같아 옛 주소로도 같은 채널에
   * 닿지만, 화면에 거는 주소는 회사 이름 쪽이라야 한다.
   */
  youtube:
    "https://www.youtube.com/@%EC%9C%A0%EC%8B%A0F.A%EC%8B%9C%EC%8A%A4%ED%85%9C-m9o8e",

  /**
   * 네이버 플레이스. 상호는 "유신에프에이시스템", 업종은 산업용기계제조로
   * 등재돼 있고 블로그 리뷰가 27건 달려 있다. place id 를 쓴 고정 주소라
   * 검색어 링크보다 안 흔들린다.
   *
   * ⚠️ 업체 미등록 상태다 — "이 장소의 관리자라면 무료로 직접 관리하세요"가
   *    뜬다. 그래서 거기 적힌 전화가 대표번호가 아닌 031-434-7241 이고
   *    영업시간이 비어 있다. 유신 측이 "권한 받기"로 등록하면 주소·시간·
   *    대표번호·사진을 직접 고칠 수 있다. 등록되면 이 주석을 지운다.
   *
   * ⚠️ 거기 도로명 주소가 "경기 시흥시 정왕천로 197" 로 적혀 있다(아래
   *    address.road 는 아직 지번이다). 다만 호수 표기가 달라 — 네이버는
   *    "동우디지털파크A동 323,324", 우리는 "A동 201호, 323~324호" — 201호가
   *    맞는지 확인을 받고 한 번에 고친다.
   */
  naverPlace: "https://map.naver.com/p/entry/place/12991198",

  address: {
    // TODO: 도로명 주소 확정 필요. 아래는 지번이다.
    road: "경기도 시흥시 정왕동 1288-2 동우디지털파크 A동 201호, 323~324호",
    jibun: "경기도 시흥시 정왕동 1288-2",
    detail: "동우디지털파크 A동 201호, 323~324호",
    postalCode: "15090", // TODO: 추정값이라 확인 필요
    region: "경기도 시흥시",
  },

  hours: {
    weekday: "평일 08:30 – 18:00",
    holiday: "토·일요일, 공휴일 휴무",
  },
} as const;

/**
 * tel: 링크용 문자열. 숫자만 남긴다.
 *
 * "031-434-7241~2" 처럼 범위로 적힌 번호는 앞 번호만 건다 — 하이픈만
 * 지우면 tel:0314347241~2 라는 깨진 링크가 된다. 번호를 화면에 쓰는 곳은
 * 헤더·푸터·CTA·문의하기·오시는 길·회사 개요로 여섯 군데라 여기 모아 둔다.
 */
export const telHref = (n: string) =>
  `tel:${n.replace(/~.*$/, "").replace(/-/g, "")}`;

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
