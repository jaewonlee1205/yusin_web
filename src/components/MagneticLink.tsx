"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/**
 * 마우스를 따라 살짝 끌려오는 링크. 가장 중요한 버튼 둘에만 쓴다 —
 * 홈 히어로의 "제품 살펴보기", 문의 CTA 띠의 "온라인 문의하기".
 *
 * ⚠️ 비용을 알고 쓴다. motion 전용 청크가 **gzip 41KB** 이고 ContactCTA 가
 *    아홉 페이지 전부에 있어 **사이트 전역에 깔린다**(전체 JS gzip
 *    205 -> 246KB, +20%). 같은 효과를 CSS transition 으로 흉내내면 1.5KB
 *    면 되는데(인라인 transitionDuration/TimingFunction 만 바꾸는 방식),
 *    스프링의 질감과 스크롤 연동(ParallaxLayer)까지 함께 쓰기로 해서
 *    라이브러리를 들였다. **모션을 더 넣지 않을 거라면 그 1.5KB 판으로
 *    돌아가는 것이 맞다.**
 *
 * ⚠️ motion.create(Link) 는 **모듈 스코프에서 한 번만** 부른다. 렌더 안에서
 *    부르면 컴포넌트가 매번 새로 만들어져 DOM 이 날아간다.
 *
 * ⚠️ useState 를 쓰지 않는다. 마우스가 움직일 때마다 리렌더가 돌면 1초에
 *    수십 번 React 를 깨우게 된다. MotionValue 는 렌더 **밖에서** 값을
 *    바꾸므로 리렌더가 0 이다.
 *
 * ⚠️ hook 은 '움직임 줄이기' 에서도 **전부 그대로 부른다.** 순서가 바뀌면
 *    React 가 깨진다. 가르는 것은 style 과 핸들러뿐이다.
 *
 * ⚠️ x·y 는 transform 으로 들어가고 className 의 active:scale 은 scale
 *    속성이다. 둘이 다른 속성이라 서로 덮지 않는다. 다만 이 링크에
 *    hover:translate-* 를 붙이지는 말 것 — 그건 같은 transform 을 다툰다.
 *    안쪽 화살표의 group-hover:translate-x-1 은 자식이라 괜찮다.
 *
 * ⚠️ 터치 기기에서는 저절로 꺼진다 — mousemove 가 오지 않는다. 그래서 이
 *    효과가 없어도 잃는 정보가 없다. 누름 반응은 className 의
 *    active:scale-[0.98] 이 맡고, 그쪽은 터치에서도 돈다.
 */
const MotionLink = motion.create(Link);

export default function MagneticLink({
  href,
  className,
  children,
  /** 칸 중심에서 벗어난 거리에 곱하는 값. 0.16 이면 최대 ±10px 쯤이다. */
  strength = 0.16,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 110, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 110, damping: 18, mass: 0.5 });

  const follow = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={ref}
      href={href}
      className={className}
      style={reduce ? undefined : { x: sx, y: sy }}
      onMouseMove={follow}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </MotionLink>
  );
}
