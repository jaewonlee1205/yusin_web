import type { Video } from "@/data/videos";
import VideoEmbed from "./VideoEmbed";

/**
 * 영상 한 편. /videos 격자와 홈 '제품 영상' 섹션이 함께 쓴다.
 *
 * 전에는 두 곳이 같은 마크업(figure + VideoEmbed + figcaption)을 복사해
 * 쓰면서, 테두리 없이 썸네일 위에 제목만 떠 있었다. 그런데 이 사이트의 다른
 * 격자는 전부 테두리 있는 흰 카드에 제목과 설명 두 단이다(ProductCard,
 * ApplicationCases). 영상만 결이 달라 같은 페이지 안에서도 따로 놀았다.
 *
 * 카드에 호버를 두지 않는다. ProductCard 는 카드 전체가 링크라 떠오르는 것이
 * 자연스럽지만, 여기서 눌리는 것은 썸네일(재생 버튼)뿐이다. 카드가 떠오르면
 * 카드를 눌러야 하나 싶어진다. 호버 피드백은 VideoEmbed 가 이미 가지고
 * 있다 — 썸네일 1.03 확대, 재생 버튼 1.06 확대, 어두운 겹이 옅어짐.
 * (적용 분야 카드도 같은 이유로 호버가 없다)
 *
 * 테두리와 둥근 모서리는 이 카드가 가진다. VideoEmbed 쪽에서 뗐으므로 안에서
 * 두 겹이 되지 않는다.
 *
 * h-full 과 글 칸의 flex-1 이 카드 높이를 맞춘다. note 가 넓은 화면에서는
 * 한 줄, 좁은 화면에서는 두 줄이 되는데(글상자가 486px 와 223px 로 두 배
 * 차이다) 그래도 한 행 안에서 아랫변이 가지런하다.
 */
export default function VideoCard({
  video,
  /** 화면에 들어오면 소리 없이 자동으로 돌린다. 홈에서만 켠다 — VideoEmbed 참고 */
  preview = false,
}: {
  video: Video;
  preview?: boolean;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card">
      <VideoEmbed video={video} preview={preview} />

      <div className="flex flex-1 flex-col border-t border-line p-5">
        <p className="text-[15px] font-bold leading-snug text-ink">
          {video.title}
        </p>
        <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-soft">
          {video.note}
        </p>
      </div>
    </div>
  );
}
