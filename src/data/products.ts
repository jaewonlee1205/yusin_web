/**
 * 제품 데이터. 설명은 `유신 회사 소개서.pptx` 6~10페이지 원문을 다듬어 썼다.
 *
 * ⚠️ 파츠피더는 공급할 부품에 맞춰 만드는 주문 제작품이라 카탈로그형 표준 사양표가
 *    존재하지 않는다. 그래서 `specs`에는 "제작 시 선택하는 항목"을 적었고,
 *    볼 직경·처리 능력·소비 전력 같은 수치는 넣지 않았다.
 *    유신 측에서 기종별 실측값을 받으면 그때 수치 사양표로 교체할 것.
 */

export const CATEGORIES = [
  "파츠피더",
  "직진피더",
  "호퍼피더",
  "방음커버",
  "컨트롤러",
  "표면처리",
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];

export type Product = {
  slug: string;
  name: string;
  nameEn: string;
  category: ProductCategory;
  /**
   * 카드에 들어가는 한 문장.
   *
   * ⚠️ 길이 주의 — 35자를 넘기지 말 것. 이 값은 두 곳에 쓰인다.
   *   1) 제품 카드 요약. 가장 좁은 글상자가 217px(1280 이상 3열)와
   *      219px(640~767 2열)인데, 14px 글자로 두 줄에 들어가려면 35자가
   *      한계다. 넘기면 그 카드만 세 줄이 되어 격자가 들쭉날쭉해진다.
   *   2) 제품 상세 페이지 배너 lead(products/[slug]/page.tsx). PageHero 는
   *      lead 에 두 줄 자리만 비워 두므로, 세 줄이 되면 그 배너만
   *      232 -> 258px 로 커져 다른 페이지와 어긋난다.
   *
   * 자세한 설명은 lead 와 features 가 맡는다. 여기서 다 말하려 하지 않는다.
   */
  summary: string;
  /** 상세 페이지 첫 문단 */
  lead: string;
  features: { title: string; body: string }[];
  specs: { label: string; value: string }[];
  applications: string[];
  images: { src: string; alt: string }[];
};

/** 피더가 무엇인지 — PPT 5페이지 원문. */
export const feederDefinition = {
  title: "부품 자동정렬 공급기",
  body: "본래 음식을 준다는 뜻의 feed에서 온 말로, 널리 원료 공급 장치를 가리킵니다. 산업기계 및 공작기계 작업에서 작업자의 위험 부담을 덜고 불필요한 작업 인원을 줄이는 역할을 합니다.",
};

export const products: Product[] = [
  {
    slug: "bowl-feeder",
    name: "볼피더",
    nameEn: "Bowl Feeder",
    category: "파츠피더",
    summary:
      "흩어진 부품을 진동으로 끌어올려 한 방향으로 정렬해 내보냅니다.",
    lead: "볼피더는 소형에서부터 대형까지 다양한 기종이 있으며, 공급할 부품에 따라 계단형·단종형·접시형·원통형 등 여러 형태로 제작됩니다. 볼 내부의 정렬 지그는 부품 형상을 분석해 하나하나 직접 설계·가공합니다.",
    features: [
      {
        title: "부품별 맞춤 볼 설계",
        body: "샘플 부품을 받아 형상·재질·무게를 분석하고, 그 부품만을 위한 트랙과 정렬 지그를 설계합니다.",
      },
      {
        title: "네 가지 기본 볼 형상",
        body: "계단형, 단종형, 접시형, 원통형 중 부품 특성과 요구 공급 속도에 맞는 형상을 선택합니다.",
      },
      {
        title: "소형부터 대형까지",
        body: "미세 전자부품용 소형기부터 볼트·금속 부품용 대형기까지 폭넓게 대응합니다.",
      },
      {
        title: "선별 · 방향 판별 지그",
        body: "역방향 부품을 되돌려 보내거나 불량 형상을 떨어뜨리는 선별 기구를 볼 안에 함께 구성합니다.",
      },
    ],
    specs: [
      { label: "볼 형상", value: "계단형 · 단종형 · 접시형 · 원통형" },
      { label: "볼 재질", value: "스테인리스, 알루미늄 (부품 특성에 따라 선정)" },
      { label: "표면 처리", value: "우레탄 코팅(UN-1~UN-3), 무처리 중 선택" },
      { label: "회전 방향", value: "시계 방향 / 반시계 방향" },
      { label: "구동", value: "전자석 진동기 + 전용 컨트롤러" },
      { label: "옵션", value: "방음커버, 호퍼피더, 직진피더 연결" },
    ],
    applications: [
      "커넥터 · 단자 등 전자부품",
      "볼트 · 너트 · 나사 등 체결부품",
      "제약 · 화장품 용기 캡",
      "가전 · 전기기기 조립 부품",
    ],
    images: [
      {
        src: "/images/products/bowl-feeder-01.webp",
        alt: "구리 소형 부품을 정렬해 배출하고 있는 계단형 볼피더",
      },
      {
        src: "/images/products/bowl-feeder-02.webp",
        alt: "스테인리스 볼과 다단 트랙으로 구성된 대형 볼피더",
      },
    ],
  },
  {
    slug: "linear-feeder",
    name: "직진피더",
    nameEn: "Linear Feeder",
    category: "직진피더",
    summary:
      "볼피더에서 나온 부품을 다음 공정까지 곧게 이송합니다.",
    lead: "직진피더는 볼피더에서 나오는 부품들을 일정한 방향과 모양으로 나오게 하는 공급 장치입니다. 볼피더와 조립 설비 사이를 이어 주며, 부품 폭에 맞춘 슈트(chute)를 얹어 자세를 유지한 채 이송합니다.",
    features: [
      {
        title: "부품 폭에 맞춘 슈트",
        body: "이송하는 부품의 형상과 폭에 맞춰 슈트를 제작해, 이송 중 자세가 흐트러지지 않게 합니다.",
      },
      {
        title: "세 가지 크기",
        body: "소형·중형·대형으로 제작되며 볼피더 용량과 라인 길이에 맞춰 선정합니다.",
      },
      {
        title: "독립 진동 제어",
        body: "볼피더와 별도의 컨트롤러로 진동을 조절해, 후공정 속도에 맞춰 이송량을 맞춥니다.",
      },
    ],
    specs: [
      { label: "크기", value: "소형 · 중형 · 대형 (라인 길이에 맞춰 제작)" },
      { label: "슈트", value: "부품 형상별 전용 제작 (교체 가능)" },
      { label: "구동", value: "전자석 진동기 + 전용 컨트롤러" },
      { label: "설치", value: "볼피더 배출구 직결 / 독립 설치" },
    ],
    applications: [
      "볼피더 – 조립기 사이 부품 이송",
      "부품 정렬 자세 유지 구간",
      "센서 검사 구간 통과 이송",
    ],
    images: [
      {
        src: "/images/products/linear-feeder-01.webp",
        alt: "대·중·소 세 가지 크기로 나란히 놓인 직진피더",
      },
      {
        src: "/images/products/linear-feeder-02.webp",
        alt: "직진피더 본체 구조를 보여 주는 3D 도면",
      },
    ],
  },
  {
    slug: "vibrator",
    name: "진동기",
    nameEn: "Vibrator",
    category: "직진피더",
    summary:
      "피더에 진동을 주는 구동부. 공급 성능을 좌우합니다.",
    lead: "진동기는 피더 자체에 진동을 줌으로써 부품이 움직이는 원동력이 되는 장치입니다. 판스프링의 각도와 매수, 전자석의 흡인력에 따라 이송 속도와 방향이 결정되므로, 부품마다 튜닝이 필요합니다.",
    features: [
      {
        title: "판스프링 진동 방식",
        body: "경사진 판스프링과 전자석의 조합으로 부품을 밀어 올리는 나선 운동을 만들어 냅니다.",
      },
      {
        title: "현장 튜닝 대응",
        body: "스프링 매수와 각도를 조정해 공급 속도를 맞춥니다. 튜닝 전담 부서가 직접 세팅합니다.",
      },
      {
        title: "볼피더 · 직진피더 공용",
        body: "볼피더 하부와 직진피더 하부에 동일한 원리로 적용됩니다.",
      },
    ],
    specs: [
      { label: "방식", value: "전자석 + 판스프링 진동" },
      { label: "조정 요소", value: "스프링 매수 · 각도 · 전압" },
      { label: "적용", value: "볼피더 하부, 직진피더 하부" },
      { label: "제어", value: "파츠피더 컨트롤러 연결" },
    ],
    applications: ["볼피더 구동부", "직진피더 구동부", "기존 피더 진동부 교체"],
    images: [
      {
        src: "/images/products/vibrator-01.webp",
        alt: "판스프링과 전자석으로 구성된 파츠피더용 진동기 3D 도면",
      },
    ],
  },
  {
    slug: "hopper-feeder",
    name: "호퍼피더",
    nameEn: "Hopper Feeder",
    category: "호퍼피더",
    summary:
      "볼피더에 부품을 자동 보충해 작업자 없이 라인을 돌립니다.",
    lead: "호퍼피더는 많은 양의 부품들을 자동으로 볼피더에 공급해 주어 무인 자동 시스템을 가능하게 하며, 센서 제어를 통해 적당한 분량을 공급해 줍니다. 볼피더 안의 부품이 줄어들면 센서가 이를 감지해 필요한 만큼만 내려보냅니다.",
    features: [
      {
        title: "센서 연동 자동 보충",
        body: "볼피더 내 잔량을 센서로 감지해 필요한 양만 공급합니다. 과다 투입으로 인한 부품 손상을 막습니다.",
      },
      {
        title: "무인 운전",
        body: "한 번에 많은 양을 적재해 두면 작업자가 부품을 채워 넣지 않아도 라인이 이어집니다.",
      },
      {
        title: "투명 상부 커버",
        body: "잔량을 눈으로 바로 확인할 수 있고, 손잡이로 커버를 열어 부품을 보충합니다.",
      },
    ],
    specs: [
      { label: "적재 용량", value: "라인 소모량에 맞춰 제작" },
      { label: "제어", value: "레벨 센서 연동 자동 공급" },
      { label: "커버", value: "투명 아크릴 상부 커버 + 손잡이" },
      { label: "배출", value: "볼피더 직상부 투입 슈트" },
    ],
    applications: [
      "장시간 무인 운전 라인",
      "소형 부품 대량 공급 공정",
      "야간 · 주말 연속 가동 설비",
    ],
    images: [
      {
        src: "/images/products/hopper-feeder-01.webp",
        alt: "투명 커버와 배출 슈트를 갖춘 호퍼피더 3기",
      },
    ],
  },
  {
    slug: "soundproof-cover",
    name: "방음커버",
    nameEn: "Sound Proof Cover",
    category: "방음커버",
    summary:
      "피더 소음을 약 15~20dB 낮춰 주는 흡음 커버입니다.",
    lead: "방음커버는 투명한 커버와 원통 커버로 구성되어 있고, 원통 커버 내벽에는 방음 흡음재가 부착되어 있기 때문에 소음을 약 15~20데시벨 정도 저감할 수 있습니다. 금속 부품을 다루는 라인일수록 효과가 큽니다.",
    features: [
      {
        title: "15~20dB 소음 저감",
        body: "원통 커버 내벽의 흡음재가 볼 내부에서 발생하는 충돌음을 흡수합니다.",
      },
      {
        title: "투명 상부 커버",
        body: "상부는 투명 재질이라 커버를 씌운 채로 볼 내부의 부품 흐름과 잔량을 확인할 수 있습니다.",
      },
      {
        title: "개폐형 구조",
        body: "경첩과 잠금 구조로 되어 있어 부품 보충과 지그 점검 시 손쉽게 열 수 있습니다.",
      },
    ],
    specs: [
      { label: "소음 저감", value: "약 15 ~ 20 dB" },
      { label: "구성", value: "투명 상부 커버 + 원통 커버" },
      { label: "흡음재", value: "원통 커버 내벽 부착" },
      { label: "제작", value: "볼피더 외경에 맞춰 전용 제작" },
    ],
    applications: [
      "금속 부품 취급 라인",
      "작업자 상주 구역 인접 설비",
      "소음 규제 대응이 필요한 현장",
    ],
    images: [
      {
        src: "/images/products/soundproof-cover-01.webp",
        alt: "방음커버를 씌운 벌브 부품용 파츠피더. 투명 상부로 내부가 보인다",
      },
      {
        src: "/images/products/soundproof-cover-02.webp",
        alt: "스프링 부품용 파츠피더에 적용된 원통형 방음커버",
      },
    ],
  },
  {
    slug: "controller",
    name: "컨트롤러",
    nameEn: "Parts Feeder Controller",
    category: "컨트롤러",
    summary:
      "볼피더와 직진피더의 진동 세기와 운전을 각각 조절합니다.",
    lead: "파츠피더 컨트롤러는 진동기에 공급되는 전압을 조절해 부품 이송 속도를 제어합니다. 볼피더와 직진피더의 속도를 따로 맞춰야 부품이 밀리거나 끊기지 않고 균일하게 공급됩니다.",
    features: [
      {
        title: "진동 세기 무단 조절",
        body: "다이얼로 진동 세기를 조절해 부품 종류와 후공정 속도에 맞춥니다.",
      },
      {
        title: "볼 · 직진 개별 제어",
        body: "볼피더와 직진피더를 각각의 컨트롤러로 제어해 구간별 이송량을 맞춥니다.",
      },
      {
        title: "센서 입력 연동",
        body: "호퍼피더 레벨 센서나 후공정 센서 신호를 받아 자동 기동·정지시킬 수 있습니다.",
      },
    ],
    specs: [
      { label: "제어 방식", value: "전압 조절식 진동 제어" },
      { label: "조작", value: "운전·정지, 진동 세기 다이얼" },
      { label: "연동", value: "레벨 센서 · 후공정 센서 입력" },
      { label: "설치", value: "피더 본체 일체형 / 별치형" },
    ],
    applications: ["볼피더 속도 제어", "직진피더 속도 제어", "호퍼피더 자동 공급 제어"],
    images: [
      {
        src: "/images/products/controller-01.webp",
        alt: "파츠피더 전용 컨트롤러 OPC-50TH의 조작 패널",
      },
    ],
  },
  {
    slug: "urethane-coating",
    name: "우레탄 코팅",
    nameEn: "Urethane Coating",
    category: "표면처리",
    summary:
      // 가운뎃점이 아니라 쉼표다. "진동·소음" 으로 쓰면 217px 에서 줄이
      // "…충격과 진동" / "·소음을 줄입니다" 로 끊겨 둘째 줄이 가운뎃점으로
      // 시작했다. 쉼표는 앞 줄 끝에 붙어 떨어진다.
      "볼 내면에 우레탄을 입혀 충격과 진동, 소음을 줄입니다.",
    lead: "우레탄 코팅의 우수성은 이미 국내에 많이 알려져 있습니다. 충격 흡수력이 우수하며 진동과 소음을 현저하게 줄여 줍니다. 부품에 흠집이 남으면 안 되는 공정에서 특히 효과적입니다.",
    features: [
      {
        title: "충격 흡수 · 소음 저감",
        body: "금속 볼 내면에 직접 닿을 때 생기는 충돌음과 진동을 우레탄 층이 흡수합니다.",
      },
      {
        title: "부품 손상 방지",
        body: "도금 부품이나 수지 부품처럼 흠집에 민감한 부품의 표면을 보호합니다.",
      },
      {
        title: "거칠기 조절 가공",
        body: "코팅 기술과 철분·플라스틱·세라믹 등을 이용해 표면 거칠기를 조절합니다. UN-1부터 UN-3까지 부품 용도에 맞는 등급을 선택할 수 있습니다.",
      },
    ],
    specs: [
      { label: "거칠기 등급", value: "UN-1 · UN-2 · UN-3" },
      { label: "첨가재", value: "철분 · 플라스틱 · 세라믹 등" },
      { label: "적용 부위", value: "볼 내면, 트랙, 직진피더 슈트" },
      { label: "효과", value: "충격 흡수, 진동·소음 저감, 부품 표면 보호" },
    ],
    applications: [
      "도금 · 도장 부품",
      "수지 · 세라믹 등 깨지기 쉬운 부품",
      "소음 저감이 필요한 라인",
    ],
    images: [
      {
        src: "/images/products/urethane-coating-01.webp",
        alt: "우레탄 코팅이 적용된 볼피더 2기와 전용 컨트롤러",
      },
      {
        src: "/images/products/urethane-coating-02.webp",
        alt: "우레탄 코팅 표면 거칠기 등급 UN-1, UN-2, UN-3 비교 샘플",
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
