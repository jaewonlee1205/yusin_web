/**
 * 화면을 맨 위로 올린다.
 *
 * 쓰는 곳이 둘이다 — 오른쪽 아래 [맨 위로] 버튼(BackToTop), 그리고 헤더에서
 * 지금 보고 있는 페이지를 다시 누를 때(로고·1차 메뉴). 둘 다 "누른 사람이
 * 스스로 시킨 움직임" 이라 기다린다는 느낌이 없다.
 */

/** 맨 위까지 올라가는 데 걸리는 시간(ms). */
const DURATION = 450;

export function scrollToTop() {
  // 움직임을 줄여 둔 환경에서는 부드럽게 올리지 않고 바로 올린다.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    window.scrollTo(0, 0);
    return;
  }

  // scrollTo({ behavior: "smooth" }) 를 쓰지 않고 직접 올린다.
  // 그 한 줄은 부드러움이 브라우저 안에 있어 어떤 곡선으로 움직이는지
  // 밖에서 확인할 길이 없고, 측정 환경에서는 옵션을 무시한 채 아예
  // 움직이지 않았다. 직접 올리면 어디서나 같게 동작하고 곡선도 짚인다.
  const start = window.scrollY;
  const t0 = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / DURATION);
    // easeOutCubic — 처음 빠르고 끝에서 부드럽게 멎는다
    const eased = 1 - Math.pow(1 - t, 3);
    window.scrollTo(0, Math.round(start * (1 - eased)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
