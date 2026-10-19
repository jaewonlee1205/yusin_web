/**
 * 납품 설비 사진.
 *
 * ⚠️⚠️⚠️ **2026-10-16 — 세 번째 판이다. 31장 → 155장.**
 *    유신에게서 받았다 — *"이미지 더 많이 있으면 좋겠는데 … **100장 넘어도
 *    좋을거 같은데**"*.
 *
 *    앞 판이 31장에 묶여 있던 까닭은 후보를 **회사마다 가장 최근 폴더 하나**로
 *    막아 두었기 때문이다. 124폴더 509장이 후보의 전부였고, **폴더당 한 장**
 *    규칙까지 더하면 **124장이 천장**이었다.
 *    이번에는 **영상이 있는 폴더를 회사당 셋까지** 봐서 후보를 **646장**으로
 *    넓히고, 격자로 구워 **전부 눈으로 보고 155장**을 골랐다.
 *
 * **뜨는 자리는 그대로다** — 설비 전체를 찍었을 곳만 노린다.
 *    ① **영상이 있는 날짜 폴더**만 (완성해 돌려 본 곳)
 *    ② 폴더의 **마지막 2장** — 다 만들어 놓고 전체를 찍는다
 *    ③ **영상 직전 1장** — 시운전을 찍기 전에 전체 모습을 남긴다
 *
 * ⚠️⚠️ **같은 폴더에서 두 장을 쓰지 않는다.** 유신이 짚었다 —
 *    *"서로 동일한 사진은 사용 하지 말라는 거야 똑같은거 또 보여주는 꼴이니깐"*.
 *    굽는 스크립트가 **회사+날짜를 키로 중복을 막는다** — 겹치면 멈춘다.
 *    지금 155장은 **155개 폴더**에서 왔다.
 *
 * **뺀 것** — 클로즈업(볼 안쪽·트랙 한 토막·슈트 모서리) · 부품 접사 ·
 * 센서 포장지 · 도면 · 케이블 뭉치 · 컨트롤러만 찍힌 것 ·
 * **손글씨 작업 메모**(치수가 드러난다 — 가장 많이 걸러낸 것이다) ·
 * **다른 회사 컨트롤러**(DSD ELEC) · **사람이 찍힌 것** ·
 * **벗어 둔 작업복과 신발이 보이는 것**.
 *
 * **규격** — 격자용 1000 × 667(3:2) q76, 합계 **6.8MB**.
 * 크게보기용 1600 × 1067 q78, 합계 **15.3MB**.
 * ⚠️ **두 벌인 까닭** — `output: "export"` 라 Next.js 가 리사이즈해 주지
 *    않는다. 한 파일을 두 용도로 쓰면 **격자에서도 큰 파일을 받는다.**
 *    큰 쪽은 **클릭할 때만** 받으므로 첫 화면 무게에 들어가지 않는다.
 * ⚠️ 앞 판은 크게보기가 1800px 이었다. 155장이 되면서 20MB 가 되기에
 *    **1600 으로 낮췄다** — 화면에서 보기엔 차이가 없다.
 *
 * ⚠️ 파일명은 **번호만**이다. 유신이 *"거래처 이름은 안 붙인다"* 고 정했고,
 *    파일명은 **그대로 URL 이 된다.** 어느 원본에서 왔는지는 스크래치패드의
 *    `map3.json` 에만 둔다.
 */

/**
 * ⚠️⚠️ **`kinds` 는 자막이자 거르개다.**
 *    앞 판은 `kind: "볼피더 + 직진피더"` 라는 **한 덩어리 문자열**이라
 *    분류 버튼을 걸 수 없었다. **배열로 바꿨다.**
 *    자막은 `kinds.join(" + ")`, 거르개는 `kinds.includes(고른 것)` 이다.
 *    ⚠️ 거르는 법이 **포함**인 것이 중요하다 — 「볼피더」를 눌렀을 때
 *       ["볼피더","직진피더"] 도 나와야 한다. 한 틀에 둘이 올라간 설비를
 *       볼피더에서 빼면 안 된다.
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
 *    전체*를 말하고 사진은 *그중 한 장면*이다. 자막은 **사진에 보이는 것**을
 *    적었다 — 사진과 글이 어긋나면 더 이상하기 때문이다.
 *
 * ⚠️ **수량과 연도는 적지 않는다.** 유신이 정했다.
 *
 * 지금 구성(한 장이 둘을 겸하므로 합이 150을 넘는다) —
 *   볼피더        140장
 *   표면처리       69장
 *   직진피더       41장
 *   방음커버       23장
 *   호퍼         19장
 *   컨트롤러       2장
 *   진동기        2장
 */
export type Work = {
  src: string;
  /** 크게보기용 1600px. 클릭해야 받는다. */
  full: string;
  /** 자막이자 거르개. 한 장이 여럿을 겸할 수 있다.
   *
   * ⚠️ 지금 조합은 **열여덟 가지**이고 최장이 **셋**이다
   *    (「호퍼피더 · 직진피더 · 표면처리」 18자). 크게보기 캡션 배지가
   *    그 18자에 맞춘 **고정 폭 320px** 이다(PhotoLightbox 의 figcaption).
   *    **기종을 넷 이어 붙이면 24자가 되어 그 폭을 넘친다** — 말줄임으로
   *    안전하게 잘리긴 하지만, 크게보기는 글을 다 보여 주는 자리다.
   *    넷짜리를 넣게 되면 **거기 폭을 다시 재서 올릴 것.** */
  kinds: string[];
  alt: string;
};

export const works: Work[] = [
  { src: "/images/works/work-001.webp", full: "/images/works/full/work-001.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-002.webp", full: "/images/works/full/work-002.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-003.webp", full: "/images/works/full/work-003.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-004.webp", full: "/images/works/full/work-004.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-005.webp", full: "/images/works/full/work-005.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-006.webp", full: "/images/works/full/work-006.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-007.webp", full: "/images/works/full/work-007.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-008.webp", full: "/images/works/full/work-008.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-009.webp", full: "/images/works/full/work-009.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-010.webp", full: "/images/works/full/work-010.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-011.webp", full: "/images/works/full/work-011.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-012.webp", full: "/images/works/full/work-012.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-013.webp", full: "/images/works/full/work-013.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-014.webp", full: "/images/works/full/work-014.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-015.webp", full: "/images/works/full/work-015.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-016.webp", full: "/images/works/full/work-016.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-017.webp", full: "/images/works/full/work-017.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-018.webp", full: "/images/works/full/work-018.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-019.webp", full: "/images/works/full/work-019.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-020.webp", full: "/images/works/full/work-020.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-021.webp", full: "/images/works/full/work-021.webp", kinds: ["볼피더", "직진피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 방음커버" }, // 볼피더 + 직진피더 + 방음커버
  { src: "/images/works/work-022.webp", full: "/images/works/full/work-022.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-023.webp", full: "/images/works/full/work-023.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-024.webp", full: "/images/works/full/work-024.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-025.webp", full: "/images/works/full/work-025.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-026.webp", full: "/images/works/full/work-026.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-027.webp", full: "/images/works/full/work-027.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-028.webp", full: "/images/works/full/work-028.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-029.webp", full: "/images/works/full/work-029.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-030.webp", full: "/images/works/full/work-030.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-031.webp", full: "/images/works/full/work-031.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-032.webp", full: "/images/works/full/work-032.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-033.webp", full: "/images/works/full/work-033.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-034.webp", full: "/images/works/full/work-034.webp", kinds: ["직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 직진피더와 표면처리" }, // 직진피더 + 표면처리
  { src: "/images/works/work-035.webp", full: "/images/works/full/work-035.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-036.webp", full: "/images/works/full/work-036.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-037.webp", full: "/images/works/full/work-037.webp", kinds: ["호퍼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 호퍼와 방음커버" }, // 호퍼 + 방음커버
  { src: "/images/works/work-038.webp", full: "/images/works/full/work-038.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-039.webp", full: "/images/works/full/work-039.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-040.webp", full: "/images/works/full/work-040.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-041.webp", full: "/images/works/full/work-041.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-042.webp", full: "/images/works/full/work-042.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-043.webp", full: "/images/works/full/work-043.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-044.webp", full: "/images/works/full/work-044.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-045.webp", full: "/images/works/full/work-045.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-046.webp", full: "/images/works/full/work-046.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-047.webp", full: "/images/works/full/work-047.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-048.webp", full: "/images/works/full/work-048.webp", kinds: ["볼피더", "호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼와 표면처리" }, // 볼피더 + 호퍼 + 표면처리
  { src: "/images/works/work-049.webp", full: "/images/works/full/work-049.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-050.webp", full: "/images/works/full/work-050.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-051.webp", full: "/images/works/full/work-051.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-052.webp", full: "/images/works/full/work-052.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-053.webp", full: "/images/works/full/work-053.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-054.webp", full: "/images/works/full/work-054.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-055.webp", full: "/images/works/full/work-055.webp", kinds: ["볼피더", "호퍼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼와 방음커버" }, // 볼피더 + 호퍼 + 방음커버
  { src: "/images/works/work-056.webp", full: "/images/works/full/work-056.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-057.webp", full: "/images/works/full/work-057.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-058.webp", full: "/images/works/full/work-058.webp", kinds: ["볼피더", "호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼와 표면처리" }, // 볼피더 + 호퍼 + 표면처리
  { src: "/images/works/work-059.webp", full: "/images/works/full/work-059.webp", kinds: ["볼피더", "호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼와 표면처리" }, // 볼피더 + 호퍼 + 표면처리
  { src: "/images/works/work-060.webp", full: "/images/works/full/work-060.webp", kinds: ["호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 호퍼와 표면처리" }, // 호퍼 + 표면처리
  { src: "/images/works/work-061.webp", full: "/images/works/full/work-061.webp", kinds: ["호퍼피더"], alt: "유신 F.A 시스템이 제작·납품한 호퍼" }, // 호퍼
  { src: "/images/works/work-062.webp", full: "/images/works/full/work-062.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-063.webp", full: "/images/works/full/work-063.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-064.webp", full: "/images/works/full/work-064.webp", kinds: ["볼피더", "호퍼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼" }, // 볼피더 + 호퍼
  { src: "/images/works/work-065.webp", full: "/images/works/full/work-065.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-066.webp", full: "/images/works/full/work-066.webp", kinds: ["볼피더", "호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼와 표면처리" }, // 볼피더 + 호퍼 + 표면처리
  { src: "/images/works/work-067.webp", full: "/images/works/full/work-067.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-068.webp", full: "/images/works/full/work-068.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-069.webp", full: "/images/works/full/work-069.webp", kinds: ["볼피더", "호퍼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼" }, // 볼피더 + 호퍼
  { src: "/images/works/work-070.webp", full: "/images/works/full/work-070.webp", kinds: ["호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 호퍼와 표면처리" }, // 호퍼 + 표면처리
  { src: "/images/works/work-071.webp", full: "/images/works/full/work-071.webp", kinds: ["호퍼피더"], alt: "유신 F.A 시스템이 제작·납품한 호퍼" }, // 호퍼
  { src: "/images/works/work-072.webp", full: "/images/works/full/work-072.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-073.webp", full: "/images/works/full/work-073.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-074.webp", full: "/images/works/full/work-074.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-075.webp", full: "/images/works/full/work-075.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-076.webp", full: "/images/works/full/work-076.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-077.webp", full: "/images/works/full/work-077.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-078.webp", full: "/images/works/full/work-078.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-079.webp", full: "/images/works/full/work-079.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-080.webp", full: "/images/works/full/work-080.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-081.webp", full: "/images/works/full/work-081.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-082.webp", full: "/images/works/full/work-082.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-083.webp", full: "/images/works/full/work-083.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-084.webp", full: "/images/works/full/work-084.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-085.webp", full: "/images/works/full/work-085.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-086.webp", full: "/images/works/full/work-086.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-087.webp", full: "/images/works/full/work-087.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-088.webp", full: "/images/works/full/work-088.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-089.webp", full: "/images/works/full/work-089.webp", kinds: ["볼피더", "호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼와 표면처리" }, // 볼피더 + 호퍼 + 표면처리
  { src: "/images/works/work-090.webp", full: "/images/works/full/work-090.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-091.webp", full: "/images/works/full/work-091.webp", kinds: ["호퍼피더"], alt: "유신 F.A 시스템이 제작·납품한 호퍼" }, // 호퍼
  { src: "/images/works/work-092.webp", full: "/images/works/full/work-092.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-093.webp", full: "/images/works/full/work-093.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-094.webp", full: "/images/works/full/work-094.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-095.webp", full: "/images/works/full/work-095.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-096.webp", full: "/images/works/full/work-096.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-097.webp", full: "/images/works/full/work-097.webp", kinds: ["호퍼피더"], alt: "유신 F.A 시스템이 제작·납품한 호퍼" }, // 호퍼
  { src: "/images/works/work-098.webp", full: "/images/works/full/work-098.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-099.webp", full: "/images/works/full/work-099.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-100.webp", full: "/images/works/full/work-100.webp", kinds: ["호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 호퍼와 표면처리" }, // 호퍼 + 표면처리
  { src: "/images/works/work-101.webp", full: "/images/works/full/work-101.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-102.webp", full: "/images/works/full/work-102.webp", kinds: ["볼피더", "직진피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더" }, // 볼피더 + 직진피더
  { src: "/images/works/work-103.webp", full: "/images/works/full/work-103.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-104.webp", full: "/images/works/full/work-104.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-105.webp", full: "/images/works/full/work-105.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-106.webp", full: "/images/works/full/work-106.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-107.webp", full: "/images/works/full/work-107.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-108.webp", full: "/images/works/full/work-108.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-109.webp", full: "/images/works/full/work-109.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-110.webp", full: "/images/works/full/work-110.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-111.webp", full: "/images/works/full/work-111.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-112.webp", full: "/images/works/full/work-112.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-113.webp", full: "/images/works/full/work-113.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-114.webp", full: "/images/works/full/work-114.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-115.webp", full: "/images/works/full/work-115.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-116.webp", full: "/images/works/full/work-116.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-117.webp", full: "/images/works/full/work-117.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-118.webp", full: "/images/works/full/work-118.webp", kinds: ["볼피더", "호퍼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 호퍼" }, // 볼피더 + 호퍼
  { src: "/images/works/work-119.webp", full: "/images/works/full/work-119.webp", kinds: ["호퍼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 호퍼와 표면처리" }, // 호퍼 + 표면처리
  { src: "/images/works/work-120.webp", full: "/images/works/full/work-120.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-121.webp", full: "/images/works/full/work-121.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-122.webp", full: "/images/works/full/work-122.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-123.webp", full: "/images/works/full/work-123.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-124.webp", full: "/images/works/full/work-124.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-125.webp", full: "/images/works/full/work-125.webp", kinds: ["볼피더", "방음커버"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버" }, // 볼피더 + 방음커버
  { src: "/images/works/work-126.webp", full: "/images/works/full/work-126.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-127.webp", full: "/images/works/full/work-127.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-128.webp", full: "/images/works/full/work-128.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-129.webp", full: "/images/works/full/work-129.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-130.webp", full: "/images/works/full/work-130.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-131.webp", full: "/images/works/full/work-131.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-132.webp", full: "/images/works/full/work-132.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-133.webp", full: "/images/works/full/work-133.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-134.webp", full: "/images/works/full/work-134.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-135.webp", full: "/images/works/full/work-135.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-136.webp", full: "/images/works/full/work-136.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-137.webp", full: "/images/works/full/work-137.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-138.webp", full: "/images/works/full/work-138.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-139.webp", full: "/images/works/full/work-139.webp", kinds: ["볼피더"], alt: "유신 F.A 시스템이 제작·납품한 볼피더" }, // 볼피더
  { src: "/images/works/work-140.webp", full: "/images/works/full/work-140.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-141.webp", full: "/images/works/full/work-141.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-142.webp", full: "/images/works/full/work-142.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-143.webp", full: "/images/works/full/work-143.webp", kinds: ["호퍼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 호퍼와 직진피더와 표면처리" }, // 호퍼 + 직진피더 + 표면처리
  { src: "/images/works/work-144.webp", full: "/images/works/full/work-144.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-145.webp", full: "/images/works/full/work-145.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-146.webp", full: "/images/works/full/work-146.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-147.webp", full: "/images/works/full/work-147.webp", kinds: ["직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 직진피더와 표면처리" }, // 직진피더 + 표면처리
  { src: "/images/works/work-148.webp", full: "/images/works/full/work-148.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-149.webp", full: "/images/works/full/work-149.webp", kinds: ["볼피더", "직진피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 직진피더와 표면처리" }, // 볼피더 + 직진피더 + 표면처리
  { src: "/images/works/work-150.webp", full: "/images/works/full/work-150.webp", kinds: ["볼피더", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 표면처리" }, // 볼피더 + 표면처리
  { src: "/images/works/work-151.webp", full: "/images/works/full/work-151.webp", kinds: ["컨트롤러"], alt: "유신 F.A 시스템이 제작·납품한 컨트롤러" }, // 컨트롤러
  { src: "/images/works/work-152.webp", full: "/images/works/full/work-152.webp", kinds: ["컨트롤러"], alt: "유신 F.A 시스템이 제작·납품한 컨트롤러" }, // 컨트롤러
  { src: "/images/works/work-153.webp", full: "/images/works/full/work-153.webp", kinds: ["볼피더", "진동기"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 진동기" }, // 볼피더 + 진동기
  { src: "/images/works/work-154.webp", full: "/images/works/full/work-154.webp", kinds: ["진동기"], alt: "유신 F.A 시스템이 제작·납품한 진동기" }, // 진동기
  { src: "/images/works/work-155.webp", full: "/images/works/full/work-155.webp", kinds: ["볼피더", "방음커버", "표면처리"], alt: "유신 F.A 시스템이 제작·납품한 볼피더와 방음커버와 표면처리" }, // 볼피더 + 방음커버 + 표면처리
];

export const totalWorks = works.length;

/**
 * 분류 버튼에 쓸 기종. **사진이 있는 것만** 낸다.
 * ⚠️ 순서를 고정한다 — 사진이 늘고 줄 때마다 버튼이 자리를 바꾸면 안 된다.
 */
export const workKinds: string[] = ["볼피더", "직진피더", "진동기", "호퍼피더", "방음커버", "컨트롤러", "표면처리"].filter((k) =>
  works.some((w) => w.kinds.includes(k)),
);

/**
 * 홈에서 미리 보여 줄 만큼.
 *
 * ⚠️ 한때 여기에 **"홈은 영상이 무겁다 — 여덟을 넘기지 않는다"** 고 적혀
 *    있었다. 2026-10-19 에 유신이 *"여기도 이미지 8개로 나오는데 8개 더
 *    추가해서 16개로 나오면 좋겠고"* 라고 해서 열여섯으로 늘렸다. 걱정하던
 *    무게는 **재 보니 첫 화면과 무관하다** —
 *
 *      앞 8장   367KB
 *      앞 16장  729KB  (+362KB)
 *
 *    사진은 `loading="lazy"` 이고 `images: { unoptimized: true }` 라 next 가
 *    따로 손대지 않는다. 즉 **그 섹션까지 내려와야 받는다** — 홈 첫 화면
 *    전송량은 그대로다. 히어로 영상이 성능을 지배한다는 사실도 그대로고,
 *    늘어난 362KB 는 그 아래에서 천천히 들어온다.
 *
 * ⚠️ 열여섯은 **격자와 맞물린 수**다. PhotoLightbox 에 `cols` 를 주어 홈만
 *    lg 부터 4열로 쓰므로 1024 위에서 4x4 로 딱 맞는다. 이 수를 바꾸면
 *    마지막 줄이 한 칸만 남는지 본다.
 */
export const featuredWorks = works.slice(0, 16);
