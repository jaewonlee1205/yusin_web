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
 */

import { yearsInBusiness } from "./site";

/** 회사 소개글. /company 첫 섹션에 들어간다. */
export const intro = {
  title: "변화에 앞서가는 기업, 유신",
  paragraphs: [
    "유신 F.A 시스템은 자동공급기(볼피더) 제조 및 전자제품 제조기계 설치 전문 기업입니다. 제조 현장에서 필요한 자동화 설비를 직접 제작하고, 설치와 정비까지 책임감 있게 수행하며 안정적인 생산 운영을 지원하고 있습니다.",
    "현장 경험을 바탕으로 고객의 요구에 맞는 최적의 설비를 제공하는 것을 목표로 하고 있으며, 품질과 신뢰를 바탕으로 꾸준히 경쟁력을 높여가고 있습니다. 앞으로도 기술력과 성실함을 바탕으로 고객과 함께 성장하는 기업이 되겠습니다.",
  ],
};

export const overview: { label: string; value: string }[] = [
  { label: "회사명", value: "유신 F.A 시스템 (YUSIN F.A SYSTEM)" },
  { label: "설립연도", value: "1992년 6월 6일" },
  { label: "대표", value: "이 준 희" },
  {
    label: "주 사업",
    value:
      "파츠피더(부품 자동정렬 공급기) 설계·제작, 전자제품 제조기계 설치·정비",
  },
  {
    label: "제작 품목",
    value: "볼피더, 직진피더, 호퍼피더, 방음커버, 컨트롤러, 전용기",
  },
  {
    label: "소재지",
    value: "경기도 시흥시 정왕동 1288-2 동우디지털파크 A동 323~324호",
  },
];

/** 조직도. 대표 아래 공장장이 4개 생산 부서를, 영업마케팅부는 대표 직속. */
export const organization = {
  head: "대표",
  direct: ["영업마케팅부"],
  plant: {
    title: "공장장",
    teams: [
      { name: "설계부", role: "부품 분석 · 지그 설계 · 도면 작성" },
      { name: "가공부", role: "밀링 · 선반 · 용접 등 기계 가공" },
      { name: "튜닝부", role: "진동 특성 조정 · 공급 속도 세팅" },
      { name: "조립부", role: "본체 조립 · 배선 · 최종 검사" },
    ],
  },
};

export const philosophy: { title: string; body: string }[] = [
  {
    title: "사회복지",
    body: "젊은 구성원이 꿈과 희망을 키울 수 있도록, 동종 업계 최고의 대우를 스스로 만들어 가는 회사를 지향합니다.",
  },
  {
    title: "연구개발",
    body: "국내 기관·해외 메이커와 협조해 자동화에 필요한 제품을 조사·연구하고, 최고 품질의 제품을 만듭니다.",
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
    body: "밀링·선반·연마기·알곤 용접기 등 21종 55대의 설비로 특수 형상도 직접 가공합니다.",
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
