/**
 * 격자에 깔린 칸이 **몇 번째 열**에 놓이는지 센다.
 *
 * 쓰는 곳은 **선표 셋**이다 — 회사 개요(company/page.tsx) · 오시는 길
 * 연락처(location/page.tsx) · 제품 규격표(products/[slug]/page.tsx).
 * 셋 다 2026-10-19 에 **열 사이에 세로 hairline** 을 넣으면서 "둘째 열부터
 * 왼쪽 선을 긋는다" 가 필요해졌다.
 *
 * ⚠️⚠️ **CSS 로는 못 고른다.** 격자에서 "둘째 열에 놓인 칸" 을 집는 선택자가
 *    없고, `nth-child(2n)` 은 전폭 행(col-span-2)이 하나 끼는 순간 어긋난다.
 *    그래서 **데이터에서 센다.**
 *
 * ⚠️ 브라우저의 자동 배치 규칙을 흉내 낸 것이라, 전폭 행이 **줄 가운데**에
 *    끼면 빈칸이 생기고 그 뒤 열이 밀린다. 그 경우까지 맞춘다 —
 *    전폭 행을 만나면 (ㄱ) 쓰던 줄을 닫고 (ㄴ) 자기도 한 줄을 통째로 쓰므로
 *    다음 칸은 새 줄 첫 열에서 시작한다.
 *
 * ⚠️ 그래도 **눈으로 맞춰 보는 것을 대신하지 않는다.** 행을 더하거나 wide 를
 *    섞은 뒤에는 DOM 좌표로 재서 이 계산과 같은지 확인한다(그 검사를 돌린
 *    기록이 세 쪽의 주석에 있다).
 *
 * @param isWide i 번째 칸이 한 줄을 통째로 쓰는가
 * @returns 칸마다의 열 번호(0부터). 전폭 칸은 늘 0 이다.
 */
export function gridColumns(
  count: number,
  cols: number,
  isWide: (i: number) => boolean = () => false,
): number[] {
  const out: number[] = [];
  let col = 0;
  for (let i = 0; i < count; i++) {
    if (isWide(i)) {
      out.push(0);
      col = 0; // 전폭 칸이 줄을 닫는다 — 다음은 새 줄 첫 열이다
      continue;
    }
    out.push(col);
    col = (col + 1) % cols;
  }
  return out;
}
