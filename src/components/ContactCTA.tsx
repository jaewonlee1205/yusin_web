import Link from "next/link";
import Container from "./Container";
import Reveal from "./Reveal";
import { PhoneIcon } from "./icons";
import { site, telHref } from "@/data/site";

/**
 * 페이지 하단 공통 문의 유도 블록. /contact 를 뺀 9개 페이지가 쓴다.
 *
 * 가운데 1단이다. 전에는 lg 에서 [제목+본문] 과 [버튼] 을 행 양 끝에 붙였는데
 * (justify-between), 1216px 행에 내용이 805px 뿐이라 가운데가 411px 비었다.
 * 글을 읽기 좋은 폭으로 좁힐수록 그 구멍이 커져 두 요구가 서로 당겼다 —
 * 양 끝 배치를 그만두니 "사이 빈 공간" 이라는 문제 자체가 없어졌다.
 *
 * 사이트에서 글 블록을 가운데 두는 곳은 여기와 문의 접수 완료 패널
 * (InquiryForm.tsx) 뿐이다. 둘 다 "여기서 행동한다" 는 자리라 좌측 정렬 본문과
 * 구분되는 편이 낫다. 위 PageHero 도 같은 네이비 띠지만 좌측 정렬이라, 한
 * 페이지에 두 띠가 있어도 서로 섞이지 않는다.
 *
 * [버튼 두 개] 밑에 [통화 가능 시간] 을 붙여 둔다. 전화를 걸라고 하면서 언제
 * 받는지 안 알려 주면 걸기 전에 망설이게 된다.
 */
export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-navy">
      {/* 위쪽 brand 선. PageHero 아래쪽 선과 호응해 본문을 위아래로 감싼다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand"
      />
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 opacity-[0.09]"
      />
      {/* 평평한 네이비 한 장이면 면이 죽는다. 내용이 가운데로 왔으니 빛도
          가운데다 — 82% 에 두면 아무것도 없는 오른쪽만 밝아 보인다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_95%_at_50%_35%,rgba(6,38,92,0.55),transparent_70%)]"
      />
      {/* 폭 지정을 두지 않는다. wide(1280)를 쓴 이유는 왼쪽 가장자리를 헤더·
          푸터와 맞추기 위해서였는데, 가운데 1단에는 맞출 왼쪽 가장자리가 없다.
          내용이 384·421px 라 1280 이든 1152 든 화면에 드러나는 차이도 없다. */}
      <Container className="relative py-14 sm:py-20">
        <div className="flex flex-col items-center gap-8 text-center">
          <Reveal>
            <h2 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
              공급할 부품을 보내 주시면
              <br className="hidden sm:block" /> 맞는 피더를 설계해 드립니다.
            </h2>
            {/* max-w-sm(384px)은 제목이 줄바꿈하는 폭(366px)과 거의 같다.
                전에는 max-w-xl(576px)이라 제목보다 57% 넓었고, 그래서 본문
                둘째 줄이 29%(175/576px)짜리 토막으로 남아 위는 길고 아래는
                짧아 보였다. 폭을 맞추니 제목 두 줄(329·366px)과 본문 두 줄
                (369·253px)이 한 기둥으로 선다.

                폭 제약을 풀면 본문이 627px 한 줄이 되어 섹션이 26px 낮아지지만,
                그러면 본문이 제목보다 71% 넓어진다 — 고쳤던 문제가 위아래만
                뒤집힌 채 돌아온다.

                mx-auto 가 필요하다. sm 미만에서는 제목이 자연 줄바꿈하느라
                바깥 Reveal 이 384px 보다 넓어질 수 있고, 그때 본문만 왼쪽에
                붙는다.

                문구도 바꿨다. 전에 쓰던 "형상을 분석해 제작 가능 여부와 예상
                일정을 회신드립니다" 는 /contact 배너 lead 와 검색 설명에도
                글자 그대로 있었다. 이 CTA 는 /contact 를 뺀 9개 페이지에
                붙으므로, 여기서 보고 문의하기로 넘어간 사람이 같은 문장을 두
                번 읽었다. 같은 뜻을 쉬운 말로 옮겨 그 겹침을 없앴다. */}
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/70 sm:text-base">
              공급할 부품 하나만 보내 주시면 됩니다. 만들 수 있는지, 얼마나
              걸리는지 정리해 회신드립니다.
            </p>
          </Reveal>

          {/* items-center 가 필요하다. sm 이상에서 이 덩어리는 버튼 행 폭
              (421px)으로 줄어드는데, items-start 면 통화 시간 줄(228px)이 그
              안에서 왼쪽에 붙는다. 바깥의 text-center 는 글자를 줄 안에서만
              가운데로 보낼 뿐 박스는 못 옮긴다. */}
          <Reveal
            delay={120}
            className="flex w-full flex-col items-center gap-3.5 sm:w-auto"
          >
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:px-8"
              >
                온라인 문의하기
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              {/* 아이콘과 자릿수 정렬은 헤더 전화 링크와 같은 모양으로 맞춘다 */}
              <a
                href={telHref(site.tel)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/45 px-6 py-4 text-[15px] font-semibold tabular-nums text-white transition-colors hover:border-white/70 hover:bg-white/10 sm:px-8"
              >
                <PhoneIcon />
                전화 {site.tel}
              </a>
            </div>
            {/* white/55 는 이 네이비 위에서 4.21:1 로 AA 에 못 미친다.
                white/70 이 5.87:1 이다. 크기를 낮춰 아래 단계로 읽히게 한다. */}
            <p className="text-xs leading-relaxed text-white/70">
              {site.hours.weekday} · {site.hours.holiday}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
