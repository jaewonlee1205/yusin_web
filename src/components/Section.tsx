import type { ReactNode } from "react";
import Container from "./Container";

type Props = {
  children: ReactNode;
  /** 섹션 위 작은 라벨 (예: PRODUCTS) */
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** 회색 배경 */
  tone?: "white" | "surface" | "navy";
  /**
   * 세로 여백.
   *  - "default" : 홈·하위 페이지처럼 섹션이 한두 개인 곳
   *  - "compact" : 제품 상세처럼 섹션이 연달아 셋 이상 오는 곳.
   *    default 로 두면 섹션 사이가 192px 이라 중간이 휑해 보인다.
   */
  size?: "default" | "compact";
  /**
   * 제목 블록 정렬.
   *
   * "center" 는 정렬만 바꾸지 않는다 — eyebrow 를 알약 배지로 감싼다. 둘을 한
   * prop 으로 묶은 이유는 가운데 정렬에서 12px 글자만 홀로 떠 있으면 약해
   * 보이기 때문이다. 가운데 변형은 배지를 함께 가져야 균형이 맞는다.
   *
   * 참고한 ansanfa.com/sub03.html 의 .section-title 은 text-align:center 에
   * 작은 라벨(13px) + 큰 제목(32px) + 설명(16px) 구조이고, 포인트는 크기가
   * 아니라 색이었다("PRODUCT" 만 32px 그대로 파랑). 우리 제목은 "특징" 두
   * 글자라 색을 쪼갤 수 없어 배지로 대신한다.
   *
   * ⚠️ 배지 바탕은 흰색이다. 처음에 bg-brand/5 를 깔았는데 bg-surface(246,247,
   *    249) 위에 레드 5%% 가 섞여 배경이 (244,237,238)이 되고, 레드 글자 대비가
   *    4.40:1 로 떨어져 Lighthouse color-contrast 가 미통과했다(접근성 96).
   *    흰 바탕이면 5.09:1 이고, 회색 섹션 위에서 배지가 더 또렷하게 뜬다.
   *    어두운 쪽은 바탕을 깔지 않는다 — navy 위 brand-light 대비를 그대로 쓴다.
   */
  align?: "left" | "center";
  /**
   * 제목 줄 오른쪽에 둘 링크·버튼. "영상 더 보기" 처럼 그 섹션에서 이어갈
   * 곳이 있을 때만 쓴다.
   *
   * 주면 제목 블록과 두 칸짜리 줄이 되고(sm 이상), sm 미만에서는 세로로
   * 쌓여 제목 아래로 내려간다. sm:items-end 로 아랫변을 제목에 맞춘다.
   *
   * ⚠️ align="center" 와 같이 쓰지 않는다 — 가운데로 모은 제목 옆에 오른쪽
   *    액션이 붙으면 축이 둘이 되어 읽는 자리가 흔들린다.
   */
  action?: ReactNode;
  id?: string;
  className?: string;
};

const TONE = {
  white: "bg-white",
  surface: "bg-surface",
  navy: "bg-navy-deep text-white",
} as const;

const PAD = {
  default: "py-16 sm:py-24",
  compact: "py-12 sm:py-16",
} as const;

/** 홈·하위 페이지에서 반복되는 섹션 껍데기. 제목 블록의 간격을 한곳에서 관리한다. */
export default function Section({
  children,
  eyebrow,
  title,
  lead,
  tone = "white",
  size = "default",
  align = "left",
  action,
  id,
  className = "",
}: Props) {
  const dark = tone === "navy";
  const centered = align === "center";

  return (
    <section id={id} className={`${TONE[tone]} ${PAD[size]} ${className}`}>
      <Container>
        {(eyebrow || title || lead || action) && (
          <div
            className={
              action
                ? "mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"
                : `mb-10 max-w-2xl sm:mb-14 ${centered ? "mx-auto text-center" : ""}`
            }
          >
            <div className={action ? "max-w-2xl" : ""}>
            {eyebrow &&
              (centered ? (
                <p
                  className={`mb-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold tracking-[0.08em] ${
                    dark
                      ? "border-brand-light/30 text-brand-light"
                      : "border-brand/20 bg-white text-brand"
                  }`}
                >
                  {eyebrow}
                </p>
              ) : (
                <p
                  className={`mb-3 text-xs font-bold tracking-[0.08em] ${
                    dark ? "text-brand-light" : "text-brand"
                  }`}
                >
                  {eyebrow}
                </p>
              ))}
            {title && (
              <h2
                className={`text-2xl font-bold leading-snug tracking-tight sm:text-4xl ${
                  dark ? "text-white" : "text-ink"
                }`}
              >
                {title}
              </h2>
            )}
            {lead && (
              <p
                className={`mt-4 text-base leading-relaxed sm:text-lg ${
                  dark ? "text-white/70" : "text-ink-soft"
                }`}
              >
                {lead}
              </p>
            )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
