import Image from "next/image";
import Reveal from "./Reveal";
import type { Work } from "@/data/works";

/**
 * 납품 설비 사진 격자.
 *
 * ⚠️⚠️ **ClientGrid 에서 배운 것을 그대로 가져왔다.** 거래처가 125곳이 되자
 *    유신에게서 *"빨리 스크롤 내리면 늦게 애니메이션이 나와 기달려야 하고"* 를
 *    들었다. 지연을 줄여 봐도 소용이 없었고, 진짜 원인은 **칸마다
 *    IntersectionObserver 를 하나씩 거는 것**이었다. 그래서 여기도
 *    **스물넷을 넘으면 격자 전체를 한 번에** 띄운다 — 관찰자가 하나다.
 *    홈은 여덟 칸이라 차례로 올라온다.
 *
 * ⚠️ 사진은 `works.ts` 에서 **1000 × 667(3:2)** 로 구워 둔 것이다. 여기서
 *    `aspect-[3/2]` 를 거는 까닭은 **이미지가 뜨기 전에도 칸 높이를 잡아**
 *    레이아웃이 밀리지 않게 하기 위해서다(CLS).
 *
 * ⚠️ `loading="lazy"` 가 꼭 있어야 한다. 56장이 한 쪽에 들어가므로 전부
 *    먼저 받으면 2MB 를 첫 화면에서 끌어온다. `sizes` 도 열 수에 맞춰
 *    적어 둬야 브라우저가 작은 것을 고를 수 있다.
 *
 * 움직임을 끈 사람에게는 globals.css 가 곧바로 보여 준다.
 */
export default function PhotoGrid({
  items,
  className = "",
}: {
  items: Work[];
  className?: string;
}) {
  const many = items.length > 24;

  const cells = items.map((w, i) => {
    const inner = (
      <Image
        src={w.src}
        alt={w.alt}
        width={1000}
        height={667}
        loading="lazy"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      />
    );
    const CELL =
      "overflow-hidden rounded-xl border border-line bg-surface aspect-[3/2]";

    return many ? (
      <li key={w.src} className={CELL}>
        {inner}
      </li>
    ) : (
      <Reveal as="li" key={w.src} delay={i * 40} className={CELL}>
        {inner}
      </Reveal>
    );
  });

  const grid = (
    <ul
      className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4 ${className}`}
    >
      {cells}
    </ul>
  );

  return many ? <Reveal>{grid}</Reveal> : grid;
}
