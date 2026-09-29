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
  id?: string;
  className?: string;
};

const TONE = {
  white: "bg-white",
  surface: "bg-surface",
  navy: "bg-navy-deep text-white",
} as const;

/** 홈·하위 페이지에서 반복되는 섹션 껍데기. 제목 블록의 간격을 한곳에서 관리한다. */
export default function Section({
  children,
  eyebrow,
  title,
  lead,
  tone = "white",
  id,
  className = "",
}: Props) {
  const dark = tone === "navy";

  return (
    <section id={id} className={`${TONE[tone]} py-16 sm:py-24 ${className}`}>
      <Container>
        {(eyebrow || title || lead) && (
          <div className="mb-10 max-w-2xl sm:mb-14">
            {eyebrow && (
              <p
                className={`mb-3 text-xs font-bold tracking-[0.2em] ${
                  dark ? "text-brand-light" : "text-brand"
                }`}
              >
                {eyebrow}
              </p>
            )}
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
        )}
        {children}
      </Container>
    </section>
  );
}
