/**
 * 납품 설비 사진.
 *
 * ⚠️⚠️⚠️ **2026-10-16 — 납품실적을 거래처 이름에서 설비 사진으로 갈았다.**
 *    유신에게서 받았다 — *"회사 별로 납품한 이미지 있으니깐 … 고객사
 *    보여주는거 말고 **우리가 납품한거 이미지로 올리는 방향**"*.
 *    파츠피더 회사의 실적은 *누구와 거래하는가* 보다 **무엇을 만들어 냈는가** 다.
 *    이름 격자는 글자뿐이라 **설비를 한 번도 보여 주지 못했다.**
 *
 * **어디서 왔나** — USB 「회사별 분류」의 사진 **52,081장(30GB)** 에서 골랐다.
 *
 * ⚠️ **회사 폴더 최상단 사진 1,822장은 손대지 않았다.** 표본을 보니 **전부
 *    고객이 보낸 샘플 부품 접사**였다(핀 · 너트 · 커넥터 · 고무 벨로우즈…).
 *    파일명도 `140604(아이비테크).JPG` 처럼 회사명을 달고 있다. 그것을 올리면
 *    **설비가 아니라 고객 제품을 공개**하는 것이 된다.
 *
 * **추린 방법** — ① 최상단 사진 제외 ② **영상이 있는 날짜 폴더**만(설비가
 * 완성되어 작동 영상을 찍은 곳이다) ③ 폴더 **뒤쪽** 사진(앞쪽은 받은 부품을
 * 찍은 것이다) ④ 한 회사 최대 3장 → 후보 372장 → **눈으로 보고 56장.**
 *
 * ⚠️ **자동으로는 가려지지 않았다.** 영상 연번 바로 뒤가 설비일 것이라는
 *    단서로 120장을 뽑아 봤는데 **절반이 부품 접사**였다. 결국 격자로 구워
 *    한 장씩 봤다. 뺀 것 — 부품 접사 · 센서 포장지 · 도면 ·
 *    **다른 회사 컨트롤러**(DSD ELEC) · 케이블 뭉치 · 빈 금속판.
 *
 * ⚠️⚠️ **파일명에 거래처 이름을 넣지 않는다.** 유신이 *"거래처 이름은
 *    안 붙인다"* 고 정했다. 파일명은 **그대로 URL 이 되므로**
 *    `crion-2026.webp` 같은 이름은 그 뜻을 어기는 셈이다. 어느 원본에서
 *    왔는지는 스크래치패드의 `map.json` 에만 둔다.
 *
 * **규격** — 1000 × 667(3:2) · webp q76 · 합계 **2.0MB** · 평균 37KB.
 * ⚠️ 3:2 로 **통일**한 까닭은 원본이 4:3 · 16:9 가 섞여 있어 그대로 두면 격자
 *    칸 높이가 들쭉날쭉해지기 때문이다. `output: "export"` 라 Next.js 가
 *    최적화해 주지 않는다 — **구운 것이 곧 배포본**이다.
 *
 * ⚠️ `alt` 가 전부 같은 문구에 번호만 다르다. 사진마다 무엇이 찍혔는지
 *    (볼피더인지 리니어인지 호퍼인지) **내가 보고 단정하면 틀릴 수 있어**
 *    일반 문구로 두었다. 유신이 알려 주시면 사진마다 제대로 적는다.
 */

export type Work = { src: string; alt: string };

export const works: Work[] = [
  { src: "/images/works/work-01.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 1" },
  { src: "/images/works/work-02.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 2" },
  { src: "/images/works/work-03.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 3" },
  { src: "/images/works/work-04.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 4" },
  { src: "/images/works/work-05.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 5" },
  { src: "/images/works/work-06.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 6" },
  { src: "/images/works/work-07.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 7" },
  { src: "/images/works/work-08.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 8" },
  { src: "/images/works/work-09.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 9" },
  { src: "/images/works/work-10.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 10" },
  { src: "/images/works/work-11.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 11" },
  { src: "/images/works/work-12.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 12" },
  { src: "/images/works/work-13.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 13" },
  { src: "/images/works/work-14.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 14" },
  { src: "/images/works/work-15.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 15" },
  { src: "/images/works/work-16.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 16" },
  { src: "/images/works/work-17.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 17" },
  { src: "/images/works/work-18.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 18" },
  { src: "/images/works/work-19.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 19" },
  { src: "/images/works/work-20.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 20" },
  { src: "/images/works/work-21.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 21" },
  { src: "/images/works/work-22.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 22" },
  { src: "/images/works/work-23.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 23" },
  { src: "/images/works/work-24.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 24" },
  { src: "/images/works/work-25.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 25" },
  { src: "/images/works/work-26.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 26" },
  { src: "/images/works/work-27.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 27" },
  { src: "/images/works/work-28.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 28" },
  { src: "/images/works/work-29.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 29" },
  { src: "/images/works/work-30.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 30" },
  { src: "/images/works/work-31.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 31" },
  { src: "/images/works/work-32.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 32" },
  { src: "/images/works/work-33.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 33" },
  { src: "/images/works/work-34.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 34" },
  { src: "/images/works/work-35.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 35" },
  { src: "/images/works/work-36.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 36" },
  { src: "/images/works/work-37.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 37" },
  { src: "/images/works/work-38.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 38" },
  { src: "/images/works/work-39.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 39" },
  { src: "/images/works/work-40.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 40" },
  { src: "/images/works/work-41.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 41" },
  { src: "/images/works/work-42.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 42" },
  { src: "/images/works/work-43.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 43" },
  { src: "/images/works/work-44.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 44" },
  { src: "/images/works/work-45.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 45" },
  { src: "/images/works/work-46.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 46" },
  { src: "/images/works/work-47.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 47" },
  { src: "/images/works/work-48.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 48" },
  { src: "/images/works/work-49.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 49" },
  { src: "/images/works/work-50.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 50" },
  { src: "/images/works/work-51.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 51" },
  { src: "/images/works/work-52.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 52" },
  { src: "/images/works/work-53.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 53" },
  { src: "/images/works/work-54.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 54" },
  { src: "/images/works/work-55.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 55" },
  { src: "/images/works/work-56.webp", alt: "유신 F.A 시스템이 제작·납품한 파츠피더 설비 56" },
];

export const totalWorks = works.length;

/** 홈에서 미리 보여 줄 만큼. ⚠️ 홈은 영상이 무겁다 — 여덟을 넘기지 않는다. */
export const featuredWorks = works.slice(0, 8);
