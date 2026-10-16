/**
 * 납품 설비 사진.
 *
 * ⚠️⚠️⚠️ **2026-10-16 — 두 번째 판이다. 첫 판 56장은 대부분 클로즈업이었다.**
 *    유신에게서 받았다 — *"각 **전체 풀 샷** 나온걸로만 해야 할거 같고 …
 *    중간에 짤린거 이런거는 의미가 없어서"*.
 *    맞는 말이었다. 볼 안쪽·트랙 한 토막·슈트 모서리만 보여서는 **무엇을
 *    만들어 파는 회사인지** 전해지지 않는다.
 *
 * **어떻게 다시 골랐나** — 뜨는 자리를 바꿨다.
 *    첫 판은 폴더의 **뒤쪽 55%부터** 고르게 떠서 클로즈업이 잔뜩 섞였다.
 *    이번에는 **설비 전체를 찍었을 자리**만 노렸다 —
 *      ① **영상이 있는 날짜 폴더**만 (완성해 돌려 본 곳)
 *      ② 폴더의 **마지막 3장** — 다 만들어 놓고 전체를 찍는다
 *      ③ **영상 직전 2장** — 시운전을 찍기 전에 전체 모습을 남긴다
 *      ④ 회사마다 **가장 최근 폴더 하나**만
 *    후보 509장 → 격자로 구워 **160장을 눈으로 보고 31장.**
 *
 * ⚠️⚠️ **같은 폴더에서 두 장을 쓰지 않는다.** 유신이 짚었다 —
 *    *"서로 동일한 사진은 사용 하지 말라는 거야 똑같은거 또 보여주는 꼴이니깐"*.
 *    한 작업의 연속 컷은 거의 같은 그림이다. 굽는 스크립트가 **회사+날짜를
 *    키로 중복을 막는다** — 겹치면 멈춘다. 지금 31장은 **31개 폴더**에서 왔다.
 *
 * **뺀 것** — 부품 접사 · 센서 포장지 · 도면 · 케이블 뭉치 · 빈 금속판 ·
 * **다른 회사 컨트롤러**(DSD ELEC) · **손글씨 작업 메모**(치수가 드러난다) ·
 * **사람이 찍힌 것** · **벗어 둔 작업복과 신발이 보이는 것**.
 *
 * **규격** — 격자용 1000 × 667(3:2) q76, 합계 1.34MB.
 * 크게보기용 1800 × 1200 q80, 합계 3.74MB.
 * ⚠️ **두 벌인 까닭** — `output: "export"` 라 Next.js 가 리사이즈해 주지
 *    않는다. 한 파일을 두 용도로 쓰면 **격자에서도 큰 파일을 받는다.**
 *    큰 쪽은 **클릭할 때만** 받으므로 첫 화면 무게에 들어가지 않는다.
 *
 * ⚠️ 파일명은 **번호만**이다. 유신이 *"거래처 이름은 안 붙인다"* 고 정했고,
 *    파일명은 **그대로 URL 이 된다.** 어느 원본에서 왔는지는 스크래치패드의
 *    `map2.json` 에만 둔다.
 */

/**
 * ⚠️⚠️ **`kind` 는 자막이다.** 유신이 *"뭘 납품 했는지 제품 볼피더 직진피더
 *    인지"* 를 적어 달라고 했고, **수량과 연도는 넣지 않기로** 했다.
 *
 * ⚠️ **근거가 둘이고 섞여 있다** —
 *      ① 폴더·파일 이름에 적힌 기종 (가장 확실)
 *      ② 없으면 **내가 사진을 보고 판별한 것** (추정)
 *    870개 날짜 폴더 가운데 기종이 적힌 것은 **125개(14.4%)** 뿐이고,
 *    그나마 호퍼 55 · 방음커버 45 · 직진피더 21 · 진동기 19 · **볼피더 2** 다.
 *    볼피더가 2건뿐인 까닭은 **기본 제품이라 적지 않기** 때문이다 —
 *    「호퍼만」 「리니어피더만」처럼 **특별할 때만** 적는다.
 *    ⚠️ 그래서 대부분은 ②다. **유신 확인 항목이다.**
 *
 * ⚠️ **폴더 이름의 기종과 사진이 어긋나는 경우가 있다.** 폴더 이름은 *그 작업
 *    전체*를 말하고 사진은 *그중 한 장면*이다 — 이름에 「호퍼·방음커버·진동기」가
 *    적힌 폴더에서 **볼피더 세 대만 찍힌** 사진이 나왔다. 자막은 **사진에
 *    보이는 것**을 적었다. 사진과 글이 어긋나면 더 이상하기 때문이다.
 *
 * 지금 구성 —
 *   볼피더              17장
 *   볼피더 + 직진피더       10장
 *   볼피더 + 호퍼         3장
 *   방음커버             1장
 */
export type Work = {
  src: string;
  /** 크게보기용 1800px. 클릭해야 받는다. */
  full: string;
  /** 자막에 뜨는 기종. */
  kind: string;
  alt: string;
};

export const works: Work[] = [
  { src: "/images/works/work-01.webp", full: "/images/works/full/work-01.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-02.webp", full: "/images/works/full/work-02.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-03.webp", full: "/images/works/full/work-03.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-04.webp", full: "/images/works/full/work-04.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-05.webp", full: "/images/works/full/work-05.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-06.webp", full: "/images/works/full/work-06.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-07.webp", full: "/images/works/full/work-07.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-08.webp", full: "/images/works/full/work-08.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-09.webp", full: "/images/works/full/work-09.webp", kind: "볼피더 + 호퍼", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼" },
  { src: "/images/works/work-10.webp", full: "/images/works/full/work-10.webp", kind: "방음커버", alt: "유신 F.A 시스템이 제작·납품한 방음커버" },
  { src: "/images/works/work-11.webp", full: "/images/works/full/work-11.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-12.webp", full: "/images/works/full/work-12.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-13.webp", full: "/images/works/full/work-13.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-14.webp", full: "/images/works/full/work-14.webp", kind: "볼피더 + 호퍼", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼" },
  { src: "/images/works/work-15.webp", full: "/images/works/full/work-15.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-16.webp", full: "/images/works/full/work-16.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-17.webp", full: "/images/works/full/work-17.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-18.webp", full: "/images/works/full/work-18.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-19.webp", full: "/images/works/full/work-19.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-20.webp", full: "/images/works/full/work-20.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-21.webp", full: "/images/works/full/work-21.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-22.webp", full: "/images/works/full/work-22.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-23.webp", full: "/images/works/full/work-23.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-24.webp", full: "/images/works/full/work-24.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-25.webp", full: "/images/works/full/work-25.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-26.webp", full: "/images/works/full/work-26.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-27.webp", full: "/images/works/full/work-27.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-28.webp", full: "/images/works/full/work-28.webp", kind: "볼피더 + 직진피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" },
  { src: "/images/works/work-29.webp", full: "/images/works/full/work-29.webp", kind: "볼피더 + 호퍼", alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼" },
  { src: "/images/works/work-30.webp", full: "/images/works/full/work-30.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
  { src: "/images/works/work-31.webp", full: "/images/works/full/work-31.webp", kind: "볼피더", alt: "유신 F.A 시스템이 제작·납품한 볼피더" },
];

export const totalWorks = works.length;

/** 홈에서 미리 보여 줄 만큼. ⚠️ 홈은 영상이 무겁다 — 여덟을 넘기지 않는다. */
export const featuredWorks = works.slice(0, 8);
