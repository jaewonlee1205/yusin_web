import { products } from "./products";
import { HOME_ONLY, videos, type Video } from "./videos";

/**
 * `/videos` 가 거는 **열두 편 전부.** 홈(featuredVideos)과는 다른 묶음이다.
 *
 * ⚠️⚠️ **2026-10-19 — 제품 구동 영상 일곱이 여기로 함께 올라왔다.**
 *    유신이 /videos 를 갤러리(/clients)처럼 **옆에 기종 거르개를 둔 꼴**로
 *    바꿔 달라고 했는데, 거기에 걸림돌이 하나 있었다 —
 *
 *      videos.ts 에 있던 영상은 **다섯 편뿐이고 전부 볼피더**다.
 *      갤러리 거르개의 일곱 기종 중 여섯(직진피더 · 진동기 · 호퍼피더 ·
 *      방음커버 · 컨트롤러 · 표면처리)은 제목에도 note 에도 단어가 없다.
 *      즉 **거를 것이 없는 거르개**가 된다.
 *
 *    그 여섯의 영상은 제품 상세가 이미 들고 있었다(products.ts 의
 *    `video.src`, product-*.mp4 일곱 편). 유신에게 물어 **함께 거는 쪽**을
 *    골랐다.
 *
 * ⚠️ 제품 쪽 글은 **베끼지 않고 끌어 쓴다**(`p.video.note` 등). 베껴 두면
 *    제품 상세와 /videos 가 말이 어긋난다. 고칠 곳은 products.ts 하나다.
 *
 * ⚠️⚠️ **2026-10-19(4) — 「열둘은 격자와 맞물린 수」가 더는 아니다.**
 *    격자가 **1열**이 되어(VideoBrowser) 마지막 줄 외톨이라는 것이 없다.
 *    아래 문단은 2·3열이던 때의 기록이다. 지우지 않는다 — 열이 다시
 *    늘면 그대로 살아난다. 다만 **홈 전용 한 편을 여기 올린 까닭**은
 *    그 수 때문이었으니, 뺄지 말지는 이제 수가 아니라 **내용**으로 정한다
 *    (「플라스틱 블록 정렬」은 다른 열하나에 없는 장면이라 둔다).
 *
 * ⚠️ **열둘은 격자와 맞물린 수다.** /videos 격자가 2열(lg)과 3열(xl)을
 *    쓰는데 12 는 둘 다 나누어떨어진다. 홈 전용 한 편(white-blocks)을
 *    함께 올린 까닭이 그것이다 — 빼면 열하나라 2열 마지막 줄에 한 칸만
 *    남는다. 영상을 더하거나 뺄 때 이 수를 본다.
 */

/**
 * 제품 slug → 기종 이름.
 *
 * ⚠️ `p.category` 를 쓰지 않는다. 그쪽은 「파츠피더 · 구동부」인데 갤러리
 *    거르개는 「볼피더 · 진동기」라 같은 것을 다른 이름으로 부르게 된다.
 *    거르개 두 쪽이 같은 글자여야 하므로 여기서 명시한다.
 * ⚠️ 「우레탄 코팅」만 제품 이름과 기종 이름이 다르다 — works.ts 도
 *    표면처리로 센다.
 */
const KIND_OF_PRODUCT: Record<string, string> = {
  "bowl-feeder": "볼피더",
  "linear-feeder": "직진피더",
  vibrator: "진동기",
  "hopper-feeder": "호퍼피더",
  "soundproof-cover": "방음커버",
  controller: "컨트롤러",
  "urethane-coating": "표면처리",
};

/**
 * 제품 구동 영상 일곱. 제목은 **제품 이름 + "구동"** 으로 짓는다 —
 * 유튜브 넷처럼 사이트용 제목이 따로 없고, 격자에서 일곱 줄이 서로
 * 구별되어야 한다.
 */
const productVideos: Video[] = products.map((p) => ({
  id: p.slug,
  title: `${p.name} 구동`,
  note: p.video.note,
  kinds: [KIND_OF_PRODUCT[p.slug] ?? p.category],
  src: p.video.src,
  poster: p.video.poster,
}));

/**
 * 영상 길이(초). **한 자리에 모은다** — 열두 편이 세 군데(videos ·
 * HOME_ONLY · products)에서 오는데, 길이를 쓰는 곳은 `/videos` 카드
 * 하나뿐이라 거기 가까운 여기가 맞다.
 *
 * ⚠️⚠️ **출처가 둘이고 성격도 둘이다.**
 *
 *   유튜브 넷 — 2026-10-19 에 공개 페이지의 `lengthSeconds` 를 받아 왔다.
 *      유신이 영상을 다시 올리면 바뀌므로 **그때 다시 받는다.**
 *      받는 법: watch 페이지 HTML 에서 lengthSeconds 를 찾으면 된다
 *      (oEmbed 는 길이를 안 주고 Data API 는 키가 필요하다).
 *
 *   로컬 여덟 — `ffprobe` 로 쟀다. **전부 7초다**(product 일곱이 7.007,
 *      white-blocks 가 7.4). README 의 ffmpeg 가 전부 `-t 7` 로 자른
 *      장식 클립이기 때문이다.
 *
 * ⚠️⚠️⚠️ **여덟 칸에 「0:07」이 똑같이 찍히는 것은 흠이 아니라 설명이다.**
 *    2026-10-19(3) 에 길이를 한 번 접었던 까닭이 바로 그것이었는데
 *    (*"여덟 칸에 7초가 여덟 번"*), 유신이 1열로 바꾸며 다시 물었다 —
 *    *"이제 공간에 여유가 있다보니 영상 길이도 넣어도 될거 같은데"*.
 *    그래서 **로컬에는 「반복」을 함께 적는다**(VideoEmbed 의 배지).
 *    「0:07 반복」은 *"이건 짧은 반복 클립이지 본 영상이 아니다"* 를
 *    누르기 전에 알려 준다 — 전에는 눌러 봐야 알았다.
 * ⚠️ 「반복」 여부는 여기 적지 않는다. `src` 가 있으면 로컬이고 로컬이면
 *    반복이다(VideoEmbed 의 `isLocal` 과 같은 조건). 두 번 적으면 어긋난다.
 * ⚠️ 영상을 더하면 **여기도 더한다.** 빠뜨리면 배지만 안 붙고 조용히
 *    지나간다 — 눈으로 열두 칸을 센다.
 */
const SECONDS: Record<string, number> = {
  // 유튜브 넷 (받아 온 값)
  DzUOtS_O2ko: 26,
  _zG4dYTCWpc: 89,
  qbBMoY2g_WE: 129,
  KiiYXbIajog: 126,
  // 홈 전용 하나 + 제품 구동 일곱 (ffprobe)
  "white-blocks": 7,
  "bowl-feeder": 7,
  "linear-feeder": 7,
  vibrator: 7,
  "hopper-feeder": 7,
  "soundproof-cover": 7,
  controller: 7,
  "urethane-coating": 7,
};

export const videoLibrary: Video[] = [
  ...videos,
  ...HOME_ONLY,
  ...productVideos,
].map((v) => ({ ...v, seconds: SECONDS[v.id] }));

/**
 * 거르개에 쓸 기종. **영상이 있는 것만** 낸다.
 *
 * ⚠️ 순서를 고정한다 — works.ts 의 `workKinds` 와 **같은 순서 · 같은 일곱
 *    글자**다. /clients 와 /videos 의 패널이 같아 보여야 한다.
 * ⚠️ 지금 세어 보면 볼피더 여섯, 나머지 여섯 기종이 각 하나다. 한 편짜리
 *    칸이 많지만 **개수는 적지 않는다** — ProductBrowser 가 같은 이유로
 *    개수를 걷었다(분류 수와 항목 수가 비슷하면 숫자가 전부 1 이 되어
 *    아무것도 알려 주지 않는다).
 */
export const videoKinds: string[] = [
  "볼피더",
  "직진피더",
  "진동기",
  "호퍼피더",
  "방음커버",
  "컨트롤러",
  "표면처리",
].filter((k) => videoLibrary.some((v) => v.kinds.includes(k)));
