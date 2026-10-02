/**
 * 제품 영상. /videos 페이지와 홈 영상 섹션이 함께 쓴다.
 * 배열이 비어 있으면 홈 섹션은 통째로 렌더되지 않는다.
 *
 * ⚠️ title 은 유튜브 제목이 아니라 사이트용으로 따로 붙인 것이다.
 *    유튜브 쪽 제목이 넷 다 "자동공급기(볼피더) 제조 전문기업, 유신F.A시스템 01~04"로
 *    사실상 같아서, 그대로 쓰면 목록에서 네 줄이 구별되지 않는다.
 *
 * ⚠️ TODO — 아래 제목은 썸네일을 보고 붙인 것이라 실제 영상 내용과 다를 수 있다.
 *    유신 측 확인 후 고칠 것. 고칠 곳은 이 파일 하나뿐이다.
 *
 * 썸네일은 scripts/fetch-video-thumbs.mjs 가 public/images/videos/<id>.webp 로
 * 받아 둔다. 영상 ID를 늘리거나 바꾸면 `npm run video-thumbs` 를 다시 돌린다.
 */
export type Video = { id: string; title: string };

export const videos: Video[] = [
  { id: "DzUOtS_O2ko", title: "소형 부품 정렬 · 에어 선별" },
  { id: "_zG4dYTCWpc", title: "금속 부품 정렬" },
  { id: "qbBMoY2g_WE", title: "커넥터 부품 정렬" },
  { id: "KiiYXbIajog", title: "볼 내부 선별 지그" },
];

/** 홈에 맛보기로 띄울 두 개. 나머지는 /videos 에서 본다. */
export const featuredVideos = videos.slice(0, 2);

/* 채널 주소는 site.ts 의 site.youtube 로 옮겼다 — 푸터가 모든 페이지에
   걸게 되면서 영상 데이터가 아니라 회사 상수가 됐다. */
