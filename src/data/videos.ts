/**
 * 홈 '제품 영상' 섹션에 띄울 YouTube 영상.
 * 배열이 비어 있으면 섹션 자체가 렌더되지 않는다.
 *
 * TODO: 유신 측 유튜브 채널 영상 ID를 받아 채울 것.
 *   예) { id: "dQw4w9WgXcQ", title: "볼피더 부품 정렬 구동" }
 */
export type Video = { id: string; title: string };

export const videos: Video[] = [];
