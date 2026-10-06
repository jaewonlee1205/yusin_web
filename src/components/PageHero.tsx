import Container from "./Container";

/**
 * 하위 페이지 공통 상단 배너. 설계 도면을 옅게 깔아 제조업 톤을 잡는다.
 *
 * 리드 문구 길이가 페이지마다 달라 배너 높이가 들쭉날쭉하면, 메뉴를 옮겨 다닐 때
 * 화면이 들썩인다. 그래서 배너 높이를 고정하고 내용을 세로 가운데로 맞춘다.
 *
 * 리드에 비워 두는 자리가 폭마다 다르다. 좁은 화면(sm 미만)은 두 줄,
 * sm 부터는 한 줄이다. 전에는 sm 에서도 두 줄을 비워 뒀는데, 15개 배너의
 * 리드가 640px 이상에서 모두 한 줄이라 27px 이 늘 비어 있었다. 바닥값
 * (sm:min-h)도 304 -> 240px 로 내렸다 — 내용 높이 238px 에 2px 만 남긴
 * 값이라, 모든 배너가 240px 로 같아진다.
 *
 * ⚠️ lead 를 새로 쓰거나 고칠 때 — 640px 에서 한 줄에 들어가는지 확인할 것.
 *    글상자가 560.8px 이고 18px 한글 기준 약 41자다. 넘기면 그 배너만
 *    29px 길어져 다른 페이지와 어긋난다. 좁은 화면에서는 두 줄까지 괜찮다.
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
      <Container className="relative flex min-h-[13.5rem] flex-col justify-center py-12 sm:min-h-[15rem] sm:py-14">
        {/* 글자가 아래에서 올라오며 나타난다.

            한동안 여기만 애니메이션을 두지 않았다. 메뉴를 옮겨 다닐 때마다
            매번 기다리게 된다는 이유였는데, 맞는 걱정이지만 답이 "빼기" 는
            아니었다. 홈 히어로가 느린 것이지(.rise 0.7초 + 지연 300ms =
            약 1초) 움직임 자체가 문제가 아니다.

            그래서 .rise-quick 을 따로 뒀다. 거리 0.6rem, 0.45초, 지연
            0/70/140ms — 전부 끝나는 데 약 0.59초라 기다린다는 느낌이 들기
            전에 끝난다. 홈 히어로는 첫 화면 연출이라 .rise 그대로다.

            배너 높이가 min-h 로 고정이고 justify-center 라, opacity 와
            transform 만 움직이는 이 연출은 아래 내용을 밀지 않는다(CLS 0).
            prefers-reduced-motion 에서는 globals.css 끝 블록이 모든
            애니메이션을 꺼 버리므로 글자가 즉시 보인다. */}
        <p
          className="rise-quick text-xs font-bold tracking-[0.2em] text-brand-light"
          style={{ animationDelay: "0ms" }}
        >
          {eyebrow}
        </p>
        <h1
          className="rise-quick mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl"
          style={{ animationDelay: "70ms" }}
        >
          {title}
        </h1>
        {lead && (
          <p
            className="rise-quick mt-5 min-h-[3.25rem] max-w-2xl text-base leading-relaxed text-white/70 sm:min-h-[1.875rem] sm:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            {lead}
          </p>
        )}
      </Container>
    </div>
  );
}
