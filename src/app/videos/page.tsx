import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import VideoBrowser from "@/components/VideoBrowser";
import { YoutubeIcon } from "@/components/icons";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "영상자료",
  description:
    "유신 F.A 시스템이 제작한 볼피더가 실제로 부품을 정렬해 내보내는 모습입니다. 소형 부품부터 금속 부품, 커넥터까지 기종별 구동 영상을 모았습니다.",
};

export default function VideosPage() {
  return (
    <>
      {/* 전에는 "사진으로는 전해지지 않는 것 — 부품이 실제로 정렬되어 나가는
          속도와 움직임입니다" 였다. 46자라 320px 에서 세 줄이 되어, 이 배너만
          232 -> 258px 로 길었다.

          320px 의 글상자는 264.8px 다(세로 스크롤막대 15.2px 가 먼저 빠지고
          Container 의 px-5 가 양쪽 20px 씩 더 빠진다). 16px 글자로 두 줄에
          들어가려면 36자 안쪽이어야 한다 — 42자짜리 안을 먼저 썼다가 여기서
          다시 걸렸다.

          그다음 안이 "사진으로는 알 수 없는 정렬 속도와 움직임을 영상으로
          담았습니다"(36자)였다. 길이는 맞았지만 영상이라는 매체를 변명하는
          문장이라, 제품 언어로 단정해 말하는 다른 배너들과 결이 달랐다
          ("표준 기종을 고르는 것이 아니라, 부품에 맞춰 새로 설계합니다").
          지금 문구는 업계 용어를 앞에 세우고 왜 영상인지를 기술적 근거로
          말한다. 33자이고 320px 두 줄·640px 한 줄을 실제로 그려서 확인했다. */}
      <PageHero
        eyebrow="VIDEO"
        title="영상자료"
        lead="정렬 자세와 공급 속도는 구동 화면에서 가장 잘 드러납니다."
      />

      {/* ⚠️⚠️ **2026-10-19 — 제목이 "부품별" 에서 "기종별" 이 됐다.**
          왼쪽에 **기종 거르개**가 서면서(VideoBrowser) 목록을 가르는 축이
          부품이 아니라 기종이 됐다. 제작실적의 「기종별 납품 설비」와 짝이
          된다 — 거르개가 같은 일곱 글자라 제목도 같은 말이어야 한다.
          ⚠️ 거르개를 걷으면 이 제목부터 다시 본다(clients/page.tsx 에 같은
             경고가 있다).

          아래는 "부품별" 이던 때의 기록이다. 지우지 않는다 —

          제목이 "부품별" 을 안고 간다. 전에는 "구동 영상 4편" 아래에
          "부품의 형상이 다르면 트랙과 선별 지그도 달라집니다 …" 라는 리드가
          있었는데, 그 문장이 말하던 축(서로 다른 부품)을 제목 한 단어로
          옮기고 리드를 걷었다. 개수는 빼 둔다 — 영상이 늘거나 줄 때마다
          제목이 흔들릴 이유가 없다.

          유튜브 버튼은 제목 줄 오른쪽에 둔다(Section 의 action). 격자 아래에
          혼자 있을 때는 눈에 걸리지 않았고, 위에 있으면 "채널에 더 있다" 를
          먼저 알리게 된다. */}
      <Section
        eyebrow="IN OPERATION"
        title="기종별 구동 영상"
        action={
          <a
            href={site.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand active:scale-[0.98]"
          >
            {/* 글자에서 "유튜브" 를 뺐다. 왼쪽 아이콘이 이미 유튜브를
                가리키므로 뜻이 흐려지지 않고, 제목 줄에 함께 서는 자리라
                짧을수록 좋다. */}
            <YoutubeIcon className="shrink-0 text-brand" />
            영상 더 보기
          </a>
        }
      >
        {/* ⚠️⚠️ **영상에는 리빌이 없다**(2026-10-19). 유신이 *"동영상 생기는
            것 보다 그냥 애니메이션 적용 안하는 편이 더 좋을거 같네"* 라고 해서
            영상이 보이는 곳 전부에서 걷었다. 그 경고는 VideoBrowser 안에도
            같이 적어 두었다.
            ⚠️ 한때는 **반대**였다 — *"전에는 영상만 Reveal 이 없어 스크롤하면
               혼자 먼저 떠 있었다"* 며 적용 분야·다른 제품 격자와 같은
               `delay={i * 70}` 을 넣었던 자리다. 이번에는 **격자 쪽이 아니라
               영상 쪽에 맞췄다.** */}
        {/* ⚠️⚠️ **2026-10-19 — 격자가 통째로 VideoBrowser 로 갔다.**
            여기 있던 것은 `videos` 넷을 그대로 거는 2열 `ul` 이었다. 이제
            거르개가 함께 서야 해서 클라이언트 부품이 됐고, 거는 목록도
            `videos`(넷)가 아니라 `videoLibrary`(**열둘** — 유튜브 넷 + 홈
            전용 하나 + 제품 구동 영상 일곱)다.
            ⚠️ 홈은 **그대로 넷**이다(featuredVideos). 두 쪽이 다른 묶음을
               본다 — videoLibrary.ts 머리 주석 참고. */}
        <VideoBrowser />
      </Section>

      <ContactCTA />
    </>
  );
}
