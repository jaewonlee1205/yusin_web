/**
 * 회사소개 페이지 콘텐츠. 전부 `유신 회사 소개서.pptx`에서 옮겨 왔다.
 *
 * 원문을 옮기며 손본 곳 (사실관계는 그대로 두고 표기만 정정):
 *   - "CONTROLLORER" -> "CONTROLLER"
 *   - "방음 카바" -> "방음 커버"
 *   - "기술 계발" -> "기술 개발"
 *   - 경영이념 본문의 "카이스 맨" -> "유신의 구성원"
 *     (타사 소개서에서 복사된 흔적으로 보여 회사명에 맞게 고쳤다)
 *
 * ⚠️ PPT의 대표이사 인사말은 더 이상 쓰지 않는다. 의례적인 문구뿐이라
 *    "이 회사가 무슨 일을 하는가"가 드러나지 않아, 유신 측이 준 회사 소개글
 *    (아래 intro)로 교체했다. 옛 인사말 원문은 git 이력에 남아 있다.
 *    교체하며 원문의 "유신F.A시스템"을 사이트 표기인 "유신 F.A 시스템"으로
 *    띄어 썼다.
 *
 * ⚠️ 사명 풀이(有信 - 신의가 있는, 신뢰가 있는)도 뺐다. 회사소개 페이지에서
 *    그 자리를 경영이념(philosophy)이 맡는다. 원문은 git 이력에 있다.
 *
 * ⚠️ 경영이념 두 문단은 원문의 절반 길이로 줄였다. 소개글 옆 좁은 칸에
 *    들어가야 해서다. 뜻은 그대로 두었고, 원문은 git 이력에 있다.
 *
 * ⚠️ 경영이념 모토는 문구 자체를 바꿨다. 위 항목들이 표기 정정인 것과 달리
 *    이건 회사가 내건 말을 다른 말로 바꾼 것이라 성격이 다르다.
 *      원문: "社會발전에 貢獻하는 기업"
 *      현재: "좋은 제품, 좋은 일터"
 *    바꾼 이유 — (1) 한자 혼용이 낡아 보이고, (2) 이 섹션에서 "기업"이
 *    네 번째로 나오며(제목·소개글 두 곳·모토), (3) 어느 회사나 쓰는 말이라
 *    이 회사의 색이 없었다. 새 문구는 아래 두 항목(일터·제품)과 바로 이어진다.
 *    ⚠️ 유신 측 확인을 받아야 하는 항목이다. 되돌리려면 이 줄만 고치면 된다.
 *
 * ⚠️ 경영이념 두 항목의 본문도 문구 자체를 바꿨다(모토와 같은 성격이라
 *    역시 유신 측 확인이 필요하다). "꿈과 희망"·"스스로 만들어 가는" 같은
 *    낡은 표현과, 한 문장에 "제품"이 두 번 나오던 것을 걷어내고 주문
 *    제작품을 만드는 회사라는 색을 담았다. 원문은 git 이력에 있다.
 */

import { site, telHref, yearsInBusiness } from "./site";

/** 회사 소개글. /company 첫 섹션에 들어간다. */
export const intro = {
  title: "변화에 앞서가는 기업, 유신",
  paragraphs: [
    "유신 F.A 시스템은 자동공급기(볼피더) 제조 및 전자제품 제조기계 설치 전문 기업입니다. 제조 현장에서 필요한 자동화 설비를 직접 제작하고, 설치와 정비까지 책임감 있게 수행하며 안정적인 생산 운영을 지원하고 있습니다.",
    "현장 경험을 바탕으로 고객의 요구에 맞는 최적의 설비를 제공하는 것을 목표로 하고 있으며, 품질과 신뢰를 바탕으로 꾸준히 경쟁력을 높여가고 있습니다. 앞으로도 기술력과 성실함을 바탕으로 고객과 함께 성장하는 기업이 되겠습니다.",
  ],
};

/**
 * 회사 개요. 라벨은 왼쪽 고정 폭, 값은 그 오른쪽 — 한 줄에 한 항목이다.
 * 값이 전부 같은 x 에서 시작해야 눈이 아래로만 내려간다. 폭을 채우겠다고
 * 값 길이에 맞춰 칸을 나눴더니(6열 격자) 그 정렬선이 사라져 훑기 어려웠다.
 *
 * 순서가 의미를 갖는다 — 회사 자체(회사명·설립연도·자본금·대표) -> 어디서 어떻게
 * 닿나(소재지·대표번호·팩스·이메일) -> 무엇을 하나(주 사업·제작 품목).
 * 짧은 값이 앞, 긴 값이 뒤라 아래로 갈수록 줄이 길어진다.
 *
 * 회사명·소재지·연락처는 site.ts 에 같은 값이 있어 거기서 가져온다. 도로명
 * 주소나 번호가 확정되면 site.ts 한 곳만 고치면 이 표도 같이 따라온다.
 */
export const overview: {
  label: string;
  /** 값이 여럿이면 배열이다 — 전화처럼 회선이 여러 개인 항목. */
  value: string | string[];
  /** 한글 상호 옆에 작게 붙일 영문 표기 */
  sub?: string;
  /**
   * 값 자체가 동작을 갖는 항목(전화·이메일). 팩스는 걸 수 없어 비운다.
   * 푸터·헤더·문의하기·오시는 길도 전부 같은 규칙이다.
   * href 를 직접 쓰지 않고 종류만 적는다 — 값이 배열이면 줄마다 링크가
   * 달라지기 때문이다.
   */
  link?: "tel" | "mailto";
}[] = [
  // 원문은 "유신 F.A 시스템 (YUSIN F.A SYSTEM)" 한 줄이었다. 사실은 그대로 두고
  // 한글/영문만 나눠 담는다 — 영문을 작게 붙이려는 것이다.
  { label: "회사명", value: site.name, sub: site.nameEn },
  { label: "설립연도", value: "1992년 6월 6일" },
  // 설립연도 바로 뒤다. 둘 다 회사의 수치라 붙여 두고 사람(대표)을 뒤에 둔다.
  // 받은 값은 1,200,000,000원. 한눈에 크기가 읽히도록 억 단위로 줄여 적는다 —
  // 등기부·사업자등록증과 대조할 일이 생기면 위 숫자가 정확한 금액이다.
  { label: "자본금", value: "12억원" },
  { label: "대표", value: "이 준 희" },
  { label: "소재지", value: site.address.road },
  // 대표번호를 맨 위에 두고 나머지 회선을 아래로 쌓는다.
  { label: "대표번호", value: [site.tel, ...site.telExtra], link: "tel" },
  { label: "팩스", value: site.fax },
  { label: "이메일", value: site.email, link: "mailto" },
  {
    label: "주 사업",
    value:
      "파츠피더(부품 자동정렬 공급기) 설계·제작, 전자제품 제조기계 설치·정비",
  },
  {
    label: "제작 품목",
    value: "볼피더, 직진피더, 호퍼피더, 방음커버, 컨트롤러, 전용기",
  },
];

/**
 * 조직도. 대표 아래 공장장이 있고, 그 아래 다섯 부서가 나란히 선다.
 * 영업마케팅부도 그중 하나다 — 문의·수주가 먼저고 제작이 뒤라 맨 앞에 둔다.
 * tasks 는 그 부서가 맡는 일이고, 화면에서 부서 아래 작은 네모로 매달린다.
 *
 * ⚠️ 유신 측 확인 필요 — PPT 조직도에는 부서 이름까지만 있었다.
 *   아래 tasks 는 모두 하는 일을 짐작해 적은 것이다. 다만 아무렇게나
 *   지어내지 않고 이 파일에 이미 있는 실제 자료에서 끌어왔다 — 설계부와
 *   튜닝부는 process(제작 프로세스) 문장에서, 가공부는 EQUIPMENT_GROUPS
 *   (보유 설비 공정 분류)에서 그대로 가져왔다. 실제 담당 업무를 받으면
 *   이 배열만 고치면 화면이 따라온다. README 의 자료 요청 표에도 적어 뒀다.
 */
export const organization: {
  head: string;
  plant: {
    title: string;
    /**
     * tasks 는 개수가 자유롭되 **비어 있으면 안 된다**. string[] 로 두면
     * 빈 배열도 통과하는데, 그러면 그 부서 밑에 아래로 뻗다 마는 세로선만
     * 남는다. 비어 있지 않은 배열 타입이면 컴포넌트에 길이 검사 분기를
     * 넣지 않고도 그 경우만 막힌다.
     */
    teams: { name: string; tasks: [string, ...string[]] }[];
  };
} = {
  head: "대표",
  plant: {
    title: "공장장",
    teams: [
      // 개수는 부서마다 다르다 — 하는 일의 가짓수가 실제로 다르기 때문이다.
      // 근거 문장이 열거하는 만큼만 적는다. 설계부가 넷인 것은 process[1]
      // ("볼 형상과 정렬 지그를 설계하고 레이아웃 도면을 작성") 이 셋을
      // 열거하고 거기에 부품 분석이 붙기 때문이고, 튜닝부가 둘인 것은
      // process[3] 의 "공급 속도와 정렬률을 맞춘" 이 한 동작이기 때문이다.
      //
      // 개수가 달라도 화면은 견딘다. lg 에서 부서 칸은 flex 아이템이라
      // stretch 로 바닥이 저절로 맞고 칩 기둥만 길이가 달라진다. 모바일은
      // flex-wrap 이라 넘치면 다음 줄로 접힌다.
      //
      // 길이는 지켜야 한다. 한 항목은 가장 좁은 칸에서도 한 줄이어야 하는데,
      // 1024px 에서 칸이 161px, 여백을 빼면 쓸 수 있는 폭이 125px 다. 여기
      // 가장 긴 "연마 · 표면처리" 가 text-xs 로 80px 라 45px 남는다. 문구를
      // 바꿀 때 이 125px 를 넘기지 않는다 — 후보였던 "볼 형상 · 지그 설계" 는
      // 97px 로 들어가긴 해도 여유가 28px 뿐이라 폰트가 폴백되면 줄이 바뀐다.
      // 모바일에서는 한 줄에 나란히 놓이므로(390px 에서 짧은 칩 기준 네 개
      // 까지) 짧을수록 좋다.
      { name: "영업마케팅부", tasks: ["문의 접수", "견적", "수주"] },
      {
        name: "설계부",
        tasks: ["부품 분석", "볼 형상 설계", "정렬 지그", "레이아웃 도면"],
      },
      { name: "가공부", tasks: ["밀링 · 선반", "용접", "연마 · 표면처리"] },
      { name: "튜닝부", tasks: ["진동 조정", "속도 세팅"] },
      { name: "조립부", tasks: ["본체 조립", "배선", "검사"] },
    ],
  },
};

export const philosophy: { title: string; body: string }[] = [
  {
    title: "사회복지",
    body: "오래 일한 사람이 만든 물건은 다릅니다. 구성원이 자리 잡고 성장할 수 있는 일터를 지킵니다.",
  },
  {
    // 첫 문장을 "부품이 바뀌면 설계도 달라집니다"로 쓰지 않는다. 같은 형태가
    // 납품실적·영상자료 lead 에 이미 두 번 있어 세 번째가 된다.
    title: "연구개발",
    body: "같은 피더는 두 대가 없습니다. 자동화에 필요한 기술을 꾸준히 연구해 제품에 담습니다.",
  },
];

export const philosophyMotto = "좋은 제품, 좋은 일터";

/**
 * 보유 설비. PPT 11페이지 목록 그대로이고, 읽기 쉽도록 공정별로 묶었다.
 * "무엇을 직접 할 수 있는 회사인가"가 단순 나열보다 잘 드러난다.
 */
export const EQUIPMENT_GROUPS = [
  {
    key: "cutting",
    title: "절삭 · 가공",
    body: "볼 본체와 정렬 지그를 도면대로 깎아 냅니다.",
  },
  {
    key: "welding",
    title: "용접",
    body: "스테인리스 박판부터 구조 프레임까지 사내에서 접합합니다.",
  },
  {
    key: "finishing",
    title: "연마 · 표면처리",
    body: "부품이 지나는 면을 매끄럽게 다듬어 걸림과 흠집을 없앱니다.",
  },
  {
    key: "handling",
    title: "운반 · 기타",
    body: "대형기 이송과 작업 환경 유지에 쓰는 설비입니다.",
  },
] as const;

export type EquipmentGroup = (typeof EQUIPMENT_GROUPS)[number]["key"];

export const equipment: {
  name: string;
  count: number;
  group: EquipmentGroup;
}[] = [
  { name: "2호 범용 밀링", count: 2, group: "cutting" },
  { name: "선반 9자반", count: 1, group: "cutting" },
  { name: "콘타", count: 2, group: "cutting" },
  { name: "탭핑기", count: 3, group: "cutting" },
  { name: "보루방", count: 3, group: "cutting" },
  { name: "원형 절단기", count: 1, group: "cutting" },
  { name: "카타기", count: 1, group: "cutting" },
  { name: "에어 밀러", count: 8, group: "cutting" },
  { name: "뽄스", count: 1, group: "cutting" },

  { name: "알곤 용접기", count: 5, group: "welding" },
  { name: "스포트 용접기", count: 1, group: "welding" },
  { name: "산소 용접기", count: 1, group: "welding" },

  { name: "연마기", count: 1, group: "finishing" },
  { name: "샌딩기", count: 1, group: "finishing" },
  { name: "그라인더", count: 10, group: "finishing" },
  { name: "탁상 그라인더", count: 3, group: "finishing" },
  { name: "링구샤", count: 5, group: "finishing" },

  { name: "지게차", count: 1, group: "handling" },
  { name: "로라", count: 1, group: "handling" },
  { name: "공구대", count: 2, group: "handling" },
  { name: "집진기", count: 2, group: "handling" },
];

/** 설비 종류 수와 총 대수. 화면 문구가 데이터와 어긋나지 않게 계산해 쓴다. */
export const equipmentTotals = {
  kinds: equipment.length,
  units: equipment.reduce((sum, item) => sum + item.count, 0),
};

export function equipmentByGroup(group: EquipmentGroup) {
  return equipment.filter((item) => item.group === group);
}

/** 제작 프로세스 — 문의부터 납품까지 어떻게 진행되는지. */
export const process: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "부품 접수 · 분석",
    body: "공급할 부품 샘플과 도면을 받아 형상·재질·무게·요구 공급 속도를 확인합니다.",
  },
  {
    step: "02",
    title: "설계",
    body: "부품에 맞는 볼 형상과 정렬 지그를 설계하고 레이아웃 도면을 작성합니다.",
  },
  {
    step: "03",
    title: "가공 · 조립",
    body: "밀링·선반·용접 등 사내 설비로 직접 가공하고 본체를 조립합니다.",
  },
  {
    step: "04",
    title: "튜닝 · 납품",
    body: "실제 부품으로 진동을 조정해 공급 속도와 정렬률을 맞춘 뒤 현장에 설치합니다.",
  },
];

/** 홈 '유신의 강점' 섹션. */
export const strengths: { title: string; body: string }[] = [
  {
    title: "설계부터 튜닝까지 사내 일관 제작",
    body: "설계부·가공부·튜닝부·조립부를 모두 자체 보유해, 외주 없이 한 공장 안에서 제작이 끝납니다.",
  },
  {
    title: "20종 이상의 가공 설비",
    // 수치는 equipment 배열에서 뽑는다. 여기만 "21종 55대" 로 박아 두는 바람에
    // 설비가 늘면 이 한 줄만 조용히 틀어지는 상태였다.
    body: `밀링·선반·연마기·알곤 용접기 등 ${equipmentTotals.kinds}종 ${equipmentTotals.units}대의 설비로 특수 형상도 직접 가공합니다.`,
  },
  {
    title: "튜닝 전담 부서",
    body: "피더의 성능은 결국 진동 튜닝에서 갈립니다. 전담 인력이 실제 부품으로 세팅을 맞춥니다.",
  },
  {
    title: "1992년부터 쌓은 제작 데이터",
    body: `${yearsInBusiness}년 동안 축적한 부품별 볼 형상·지그 사례를 바탕으로 시행착오를 줄입니다.`,
  },
];
