import type { Video } from "@/data/videos";
import VideoEmbed from "./VideoEmbed";

/**
 * 영상 한 편. 쓰이는 자리가 둘이고 **생김새가 다르다.**
 *
 * ── 홈 '제품 영상' (preview) ─────────────────────────────────────────
 * 설명 한 줄이 영상 위 하단에 겹친다 — 제품 상세 구동 영상(ProductVideo)과
 * 같은 꼴이다. 제목은 쓰지 않는다.
 *
 * 한때 여기도 아래쪽 글 칸에 제목과 설명 두 단이 있었다. 영상이 저절로
 * 도는 자리인데 그 밑에 또 글 상자가 붙어, 바로 위 PERFORMANCE 영상(자막이
 * 겹친 꼴)과 결이 갈렸다.
 *
 * ── /videos (그 밖) ─────────────────────────────────────────────────
 * 테두리 있는 흰 카드에 제목과 설명 두 단 — ProductCard.ApplicationCases 와
 * 같은 꼴이다. 여기서 **제목을 뺄 수 없다.** 유튜브 쪽 제목이 네 편 다
 * 사실상 같아서 사이트용으로 따로 붙인 title 이 네 줄을 구별하는 유일한
 * 수단이다(videos.ts 머리 주석).
 *
 * 그리고 이쪽은 유튜브 파사드라 썸네일 위에 재생 버튼과 어두운
 * 겹(navy-deep/25)이 이미 있다 — 거기에 자막 그라데이션을 더하면 두 겹이
 * 된다.
 *
 * 카드에 호버를 두지 않는다. ProductCard 는 카드 전체가 링크라 떠오르는 것이
 * 자연스럽지만, 여기서 눌리는 것은 썸네일(재생 버튼)뿐이다. 카드가 떠오르면
 * 카드를 눌러야 하나 싶어진다. 호버 피드백은 VideoEmbed 가 이미 가지고
 * 있다 — 썸네일 1.03 확대, 재생 버튼 1.06 확대, 어두운 겹이 옅어짐.
 * (적용 분야 카드도 같은 이유로 호버가 없다)
 *
 * 테두리와 둥근 모서리는 이 카드가 가진다. VideoEmbed 쪽에서 뗐으므로 안에서
 * 두 겹이 되지 않는다.
 */
export default function VideoCard({
  video,
  /** 화면에 들어오면 소리 없이 자동으로 돌린다. 홈에서만 켠다 — VideoEmbed 참고 */
  preview = false,
}: {
  video: Video;
  preview?: boolean;
}) {
  // ⚠️ VideoEmbed 와 **같은 조건**이어야 한다. preview 만 보면, 미리보기
  //    파일이 없어 유튜브 파사드로 떨어진 영상 위에 자막이 얹힌다.
  const isPreview = preview && !!video.preview;

  /* ── 홈: 영상 위 자막 ───────────────────────────────────────────── */
  if (isPreview) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-card">
        <VideoEmbed video={video} preview />

        {/* ⚠️ <video> 가 아니라 **칸**의 자식이다. VideoEmbed 의 preview 분기가
               relative + aspect-video 로 높이를 만들고 이 칸에 다른 자식이
               없으므로 bottom-0 이 영상 하단과 그대로 맞는다. 그래야 '움직임
               줄이기' 에서 영상이 display:none 이 되어도 뒤에 깔린 정지컷 위에
               자막이 남는다(ProductVideo 와 같은 이유다).

            ⚠️ 흰 글씨가 읽히는 것은 그라데이션 덕이다. 두 편의 하단 22% 띠
               밝기를 420프레임씩 재니 평균 Y 60~62, 가장 밝은 순간이 138.8
               이었다(금속 부품 쪽). 거기에 navy-deep/85(Y 34.6)를 덮으면
               Y 50 으로 떨어져 흰 글씨 대비가 약 12.8:1 이 된다(AAA 7:1 의
               1.8배). 제품 영상 일곱 편(최대 116.4 -> 16:1)보다 밝지만
               충분하다. 영상을 갈아 끼울 때 하단이 더 밝으면 다시 잰다.

            패딩이 ProductVideo 보다 좁은 폭에서 작다. 그쪽은 본문 전체 폭을
            쓰는 띠라 영상이 크지만, 여기는 1024 부터 2열로 쪼개져 영상 높이가
            257px 다. 같은 pt-12 를 주면 자막이 영상의 절반을 덮는다.

            pointer-events-none — 누를 것이 없는 장식 영상이라 마우스를
            가로채지 않는다. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/40 to-transparent px-4 pb-4 pt-9 sm:px-5 sm:pb-5 sm:pt-10 lg:px-6 lg:pb-6 lg:pt-12">
          <p className="text-[13px] font-medium leading-relaxed text-white sm:text-sm">
            {video.note}
          </p>
        </div>
      </div>
    );
  }

  /* ── /videos: 제목 + 설명 두 단 ─────────────────────────────────── */
  //
  // h-full 과 글 칸의 flex-1 이 카드 높이를 맞춘다. note 가 넓은 화면에서는
  // 한 줄, 좁은 화면에서는 두 줄이 되는데(글상자가 486px 와 223px 로 두 배
  // 차이다) 그래도 한 행 안에서 아랫변이 가지런하다.
  //
  // 홈 쪽은 글 칸이 없어 두 장이 순수 aspect-video 다 — 거기서는 높이가
  // 저절로 같아 이 장치가 필요 없다.
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
