/**
 * 제품 영상. /videos 페이지와 홈 영상 섹션이 함께 쓴다.
 * 배열이 비어 있으면 홈 섹션은 통째로 렌더되지 않는다.
 *
 * ⚠️ title 은 유튜브 제목이 아니라 사이트용으로 따로 붙인 것이다.
 *    유튜브 쪽 제목이 넷 다 "자동공급기(볼피더) 제조 전문기업, 유신F.A시스템 01~04"로
 *    사실상 같아서, 그대로 쓰면 목록에서 네 줄이 구별되지 않는다.
 *
 * ⚠️ TODO — 아래 title 과 note 는 썸네일을 보고 붙인 것이라 실제 영상 내용과
 *    다를 수 있다. 유신 측 확인 후 고칠 것. 고칠 곳은 이 파일 하나뿐이다.
 *    화면에 보이는 것만 적었고, 영상에서 확인되지 않는 수치나 공정 이름은
 *    쓰지 않았다.
 *
 * note 길이 — 카드 글상자가 1440 에서 486px, 320 에서 223px 로 두 배 넘게
 * 차이 나 모든 폭에서 같은 줄 수로 맞출 수 없다. 1440 에서 한 줄이 되게
 * 쓰고(13px 로 486px 이내) 좁은 폭에서 두 줄이 되는 것은 둔다 — 카드 높이는
 * VideoCard 의 flex 가 맞춘다.
 *
 * 썸네일은 scripts/fetch-video-thumbs.mjs 가 public/images/videos/<id>.webp 로
 * 받아 둔다. 영상 ID를 늘리거나 바꾸면 `npm run video-thumbs` 를 다시 돌린다.
 */
export type Video = { id: string; title: string; note: string };

export const videos: Video[] = [
  {
    id: "DzUOtS_O2ko",
    title: "소형 부품 정렬 · 에어 선별",
    note: "트랙에 한 줄로 선 부품을 위쪽 노즐이 공기로 걸러 냅니다.",
  },
  {
    id: "_zG4dYTCWpc",
    title: "금속 부품 정렬",
    note: "구멍 뚫린 판금 브래킷이 트랙을 타고 한 방향으로 올라갑니다.",
  },
  {
    id: "qbBMoY2g_WE",
    title: "커넥터 부품 정렬",
    note: "커넥터 하우징이 볼에서 트랙으로 올라서며 자세를 잡습니다.",
  },
  {
    id: "KiiYXbIajog",
    title: "볼 내부 선별 지그",
    note: "볼 안쪽에 세운 지그가 지나가는 부품의 자세를 가려냅니다.",
  },
];

/** 홈에 맛보기로 띄울 두 개. 나머지는 /videos 에서 본다. */
export const featuredVideos = videos.slice(0, 2);

/* 채널 주소는 site.ts 의 site.youtube 로 옮겼다 — 푸터가 모든 페이지에
   걸게 되면서 영상 데이터가 아니라 회사 상수가 됐다. */
