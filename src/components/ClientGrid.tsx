import Reveal from "./Reveal";

/**
 * 거래처 그리드.
 *
 * 로고 이미지를 쓰지 않고 회사명을 같은 서체·같은 크기로 렌더한다.
 * (사유는 src/data/clients.ts 주석 참고)
 * 카드 높이를 고정해 이름 길이가 달라도 격자가 흐트러지지 않게 한다.
 *
 * 칸이 차례로 올라온다. 지연이 i * 25ms 인 것은 /clients 가 34칸이기
 * 때문이다 — 사이트의 다른 격자가 쓰는 70ms 면 마지막 칸이 2.3초 뒤에 떠서
 * 다 뜨기 전에 읽기 시작한다. 25ms 면 825ms 다. 홈은 12칸이라 275ms.
 *
 * Reveal 이 li 자체가 되므로(as="li") gap-px + bg-line 격자가 깨지지 않는다.
 * 움직임을 끈 사람에게는 globals.css 가 곧바로 보여 준다.
 */
export default function ClientGrid({
  names,
  className = "",
}: {
  names: string[];
  className?: string;
}) {
  return (
    <ul
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {names.map((name, i) => (
        <Reveal
          as="li"
          key={name}
          delay={i * 25}
          className="flex h-20 items-center justify-center bg-white px-4 text-center transition-colors hover:bg-surface sm:h-24"
        >
          <span className="text-sm font-medium leading-snug text-ink-soft sm:text-15">
            {name}
          </span>
        </Reveal>
      ))}

      {/* ⚠️⚠️ 마지막 줄의 빈 트랙을 흰 칸으로 **채운다.** 이 격자는
             gap-px + bg-line 으로 선을 그리는데(칸 사이 1px 틈으로 바탕색이
             비친다), 칸이 모자라면 **그 빈 트랙도 바탕색을 그대로 칠해**
             회색 덩어리가 남는다. /clients 는 34개라 4열에서 2칸, 3열에서
             1칸이 비어 페이지 **마지막 픽셀이 깨진 칸**이었다.

          ⚠️ 12 의 배수로 맞춘다. 열 수가 2(기본) / 3(sm) / 4(lg) 로 바뀌므로
             최소공배수까지 채워야 **세 폭 모두** 빈 칸이 없다.
             34 -> 36 (2칸 추가) · 홈의 12개는 이미 배수라 0칸.

          ⚠️ aria-hidden 이다. 읽을 것이 없는 자리 채우개다. */}
      {Array.from({ length: (12 - (names.length % 12)) % 12 }).map((_, i) => (
        <li
          key={`pad-${i}`}
          aria-hidden="true"
          className="h-20 bg-white sm:h-24"
        />
      ))}
    </ul>
  );
}
