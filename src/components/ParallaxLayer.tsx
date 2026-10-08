"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * 스크롤에 따라 배경이 본문보다 **느리게** 흐르는 겹. 깊이를 만든다.
 *
 * 구조가 두 겹인 이유 —
 *   바깥 div    자리에 고정된다. useScroll 이 재는 기준(target)이다.
 *   안쪽 motion 실제로 움직인다.
 *
 * ⚠️ 바깥과 안쪽을 하나로 합치면 안 된다. 움직이는 요소를 자기 자신의
 *    측정 기준으로 쓰면 값이 스스로를 물어 흔들린다.
 *
 * ⚠️⚠️ 여유와 이동은 **기준이 다르다.** 이게 함정이다 —
 *      -inset-y-[20%] 의 20% 는 **부모 높이** 기준이고,
 *      Motion 의 y: "12%" 는 **움직이는 요소 자신의 높이** 기준이다.
 *      요소는 부모보다 (1 + 2x0.20) = 1.4배 크므로 실제 이동은 부모 기준
 *      12% x 1.4 = **16.8%** 다.
 *
 *      조건:  여유 g  >=  이동 d x (1 + 2g)      (둘 다 부모 기준으로 환산)
 *
 *        여유 12% + 이동 12%  ->  14.9%  **2.9%p 부족** (한동안 이랬다)
 *        여유 16% + 이동 12%  ->  15.8%  여유 0.2%p — 너무 빠듯하다
 *        여유 20% + 이동 12%  ->  16.8%  여유 3.2%p  <- 지금 값
 *
 *      부족하면 스크롤 끝에서 배경 위가 비어 네이비 바탕이 드러난다.
 *      12%/12% 로 두었을 때 스크롤 700px 에서 여유가 6px 까지 줄었고 끝까지
 *      가면 24px 모자랐다. **distance 를 바꾸면 이 표로 다시 계산할 것.**
 *
 * ⚠️ 바깥에 overflow-hidden 이 필요하다. 넘치는 12% 를 잘라 주는 것이
 *    그것이다. 홈 히어로는 section 쪽에 이미 걸려 있지만, 다른 자리에 쓸
 *    때는 className 에 직접 넣을 것.
 *
 * ⚠️ '움직임 줄이기' 에서는 style 을 주지 않는다 — 배경이 제자리에 선다.
 *    hook 은 순서 때문에 그대로 다 부른다.
 *
 * ⚠️ aria-hidden 을 여기서 건다. 배경 장식이라 읽을 것이 없다. 안에
 *    글자를 넣지 말 것.
 */
export default function ParallaxLayer({
  children,
  className = "",
  /** 스크롤 구간 전체에서 아래로 밀리는 거리. 겹 높이에 대한 비율이다. */
  distance = "12%",
}: {
  children: ReactNode;
  className?: string;
  distance?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 겹의 위가 화면 위에 닿을 때 0, 겹의 아래가 화면 위를 지날 때 1.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", distance]);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <motion.div
        className="absolute inset-x-0 -inset-y-[20%]"
        style={reduce ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
