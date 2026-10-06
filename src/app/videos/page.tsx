import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import VideoCard from "@/components/VideoCard";
import { YoutubeIcon } from "@/components/icons";
import { site } from "@/data/site";
import { videos } from "@/data/videos";

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

      <Section
        eyebrow="IN OPERATION"
        title={`구동 영상 ${videos.length}편`}
        lead="부품의 형상이 다르면 트랙과 선별 지그도 달라집니다. 아래 영상은 서로 다른 부품을 다룬 사례입니다."
      >
        {/* 적용 분야·다른 제품 격자와 같은 등장 방식이다. 전에는 영상만
            Reveal 이 없어 스크롤하면 혼자 먼저 떠 있었다. */}
        <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {videos.map((video, i) => (
            <Reveal as="li" key={video.id} delay={i * 70}>
              <VideoCard video={video} />
            </Reveal>
          ))}
        </ul>

        {/* 전에는 본문과 같은 크기의 글씨 한 줄이라 눈에 걸리지 않았다.
            채널에는 여기 넷 말고도 영상이 더 있을 수 있어, 다음 행동으로
            제시할 만한 자리다. 버튼 모양으로 올리고 아이콘을 붙인다
            (푸터가 쓰는 YoutubeIcon 과 같은 마크다). */}
        <a
          href={site.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2.5 rounded-lg border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand"
        >
          <YoutubeIcon className="shrink-0 text-brand" />
          유튜브 채널에서 더 보기
        </a>
      </Section>

      <ContactCTA />
    </>
  );
}
