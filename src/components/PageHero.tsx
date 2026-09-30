import Container from "./Container";

/**
 * 하위 페이지 공통 상단 배너. 설계 도면을 옅게 깔아 제조업 톤을 잡는다.
 *
 * 리드 문구 길이가 페이지마다 달라 배너 높이가 들쭉날쭉하면, 메뉴를 옮겨 다닐 때
 * 화면이 들썩인다. 그래서 배너 높이를 고정하고 내용을 세로 가운데로 맞춘다.
 * 리드에는 두 줄 자리를 미리 비워 두어 한 줄짜리 문구여도 아래 여백이 같다.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-navy-deep">
      {/* 이미지 대신 CSS로 그린 미세한 기술 그리드. 어느 해상도에서도 또렷하고
          내려받을 파일이 없다. */}
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-[0.07]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy-deep via-navy-deep/85 to-navy/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brand"
      />
      <Container className="relative flex min-h-[13.5rem] flex-col justify-center py-12 sm:min-h-[19rem] sm:py-16">
        {/* 홈 히어로와 같은 rise 스태거(60/140/220ms). CSS 애니메이션이라
            JS 가 늘지 않고, opacity/transform 만 쓰므로 배너 높이도 그대로다.
            움직임 줄이기 설정에서는 globals.css 가 통째로 끈다. */}
        <p
          className="rise text-xs font-bold tracking-[0.2em] text-brand-light"
          style={{ animationDelay: "60ms" }}
        >
          {eyebrow}
        </p>
        <h1
          className="rise mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl"
          style={{ animationDelay: "140ms" }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="rise mt-5 min-h-[3.25rem] max-w-2xl text-base leading-relaxed text-white/70 sm:min-h-[3.5rem] sm:text-lg"
            style={{ animationDelay: "220ms" }}
          >
            {lead}
          </p>
        )}
      </Container>
    </div>
  );
}
