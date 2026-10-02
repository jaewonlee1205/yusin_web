import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import VideoEmbed from "@/components/VideoEmbed";
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
      <PageHero
        eyebrow="VIDEO"
        title="영상자료"
        lead="사진으로는 전해지지 않는 것 — 부품이 실제로 정렬되어 나가는 속도와 움직임입니다."
      />

      <Section
        eyebrow="IN OPERATION"
        title={`구동 영상 ${videos.length}편`}
        lead="부품의 형상이 다르면 트랙과 선별 지그도 달라집니다. 아래 영상은 서로 다른 부품을 다룬 사례입니다."
      >
        <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {videos.map((video) => (
            <li key={video.id}>
              <figure>
                <VideoEmbed video={video} />
                <figcaption className="mt-3 text-sm font-bold text-ink">
                  {video.title}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-ink-soft">
          영상은 유튜브에 올려 두었습니다.{" "}
          <a
            href={site.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-navy underline underline-offset-4 transition-colors hover:text-brand"
          >
            유튜브 채널에서 보기
          </a>
        </p>
      </Section>

      <ContactCTA />
    </>
  );
}
