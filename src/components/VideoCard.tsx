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
 * 겹(dark/25)이 이미 있다 — 거기에 자막 그라데이션을 더하면 두 겹이
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
               이었다(금속 부품 쪽).

               2026-10-14 에 막 색을 여러 번 바꿔 가며 쟀다. **지금 값은**
               /85 를 덮은 뒤 흰 글씨 대비가 평균에서 16.3:1, 가장 밝은
               순간(138.8)에도 14.1:1 이다 — AAA(7:1)의 두 배다.
               영상을 갈아 끼울 때 하단이 더 밝으면 다시 잰다.

            패딩이 ProductVideo 보다 좁은 폭에서 작다. 그쪽은 본문 전체 폭을
            쓰는 띠라 영상이 크지만, 여기는 1024 부터 2열로 쪼개져 영상 높이가
            257px 다. 같은 pt-12 를 주면 자막이 영상의 절반을 덮는다.

            pointer-events-none — 누를 것이 없는 장식 영상이라 마우스를
            가로채지 않는다. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent px-4 pb-4 pt-9 sm:px-5 sm:pb-5 sm:pt-10 lg:px-6 lg:pb-6 lg:pt-12">
          {/* ⚠️⚠️ **여기는 자르지 않는다**(2026-10-19). 글자 클래스가
              PhotoLightbox 의 사진 자막과 **한 글자까지 같은데**, 그쪽에는
              같은 날 `truncate` 가 붙었고 여기는 안 붙였다. 까닭 —
              그쪽은 기종 **이름을 나열한 라벨**(조합 열여덟 가지, 최장 18자)
              이고 여기는 **문장**이다. 문장을 잘라 말줄임을 붙이면 뜻이
              끊긴다. 같은 클래스라고 따라 넣지 말 것. */}
          <p className="text-13 font-medium leading-relaxed text-white sm:text-sm">
            {video.note}
          </p>
        </div>
      </div>
    );
  }

  /* ── /videos: 기종 라벨 + 제목 두 단 ───────────────────────────── */
  //
  // ⚠️⚠️ **2026-10-19 — 설명 줄(note)을 걷었다.** 유신이 *"이런 문구는
  //    지우고"* 라고 했다. 글 칸이 세 단(기종 · 제목 · 설명)에서 **두 단**이
  //    됐다.
  //
  // ⚠️ **영상 길이를 그 자리에 넣지 않았다.** 같은 말에 *"현재 영상 길이
  //    어느정도인지 나오게"* 가 함께 있었는데, ffprobe 로 재 보니
  //    public/videos 의 mp4 **열여섯 편이 전부 7초**다(README 의 ffmpeg
  //    명령이 전부 -t 7 로 잘랐다). 로컬로 도는 여덟 칸에 붙이면 「7초」가
  //    여덟 번 찍힌다. 유튜브 넷은 길이가 저장소에 없고 받아 올 길도 없다
  //    (썸네일 스크립트는 이미지만 GET, oEmbed 는 duration 을 안 준다,
  //    Data API 는 키가 필요하다). 그래서 유신에게 물어 **「길이는 접고
  //    카드를 간결하게」** 를 골랐다.
  //    videoKinds 주석이 분류마다 개수를 안 적는 까닭과 **같은 문제**다 —
  //    열두 칸에 같은 값이 찍히면 아무것도 알려 주지 않는다.
  //    ⚠️ 유튜브 넷의 길이를 유신에게서 받으면 그때 다시 본다(README 의
  //       「받아야 할 자료」). 로컬 여덟은 원본을 다시 잘라야 뜻이 생긴다.
  //
  // h-full 과 글 칸의 flex-1 이 카드 높이를 맞춘다. flex-1 은 note 에 있던
  // 것을 **제목으로 옮겼다** — 아랫변을 미는 것은 글 칸의 마지막 줄이어야
  // 한다.
  //
  // ⚠️ 아래는 note 가 있던 때의 기록이다. 지우지 않는다 — 되살리면 다시
  //    유효하다. 「note 가 넓은 화면에서는 한 줄, 좁은 화면에서는 두 줄이
  //    되는데(글상자가 486px 와 223px 로 두 배 차이다) 그래도 한 행 안에서
  //    아랫변이 가지런하다.」
  //
  // 홈 쪽은 글 칸이 없어 두 장이 순수 aspect-video 다 — 거기서는 높이가
  // 저절로 같아 이 장치가 필요 없다.
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card">
      <VideoEmbed video={video} preview={preview} />

      <div className="flex flex-1 flex-col border-t border-line p-5">
        {/* ⚠️⚠️ **2026-10-19 — 기종 라벨이 붙었다.** /videos 에 기종 거르개가
               서면서(VideoBrowser) 카드도 제가 어느 기종인지 말해야 한다.
               거르개를 「컨트롤러」로 좁혀 놓고 한참 보다가 「전체」로 돌아오면,
               라벨이 없으면 어느 칸이 왜 거기 있었는지 알 수 없다.

            ProductCard 의 분류 라벨과 **같은 꼴**이다(text-xs · 굵게 ·
            tracking-[0.08em] · brand). 제품 카드와 영상 카드가 같은 격자
            말투를 쓰는 쪽이 낫다.

            ⚠️ 빨강 **글자**다. 빨강 **채움**은 「견적 문의」 전용이라는 규칙과
               어긋나지 않는다(README 색 위계).
            ⚠️ 홈 갈래에는 넣지 않는다. 거기는 거르개가 없어 라벨이 답할
               물음이 없고, 자막 한 줄이 영상 위에 겹치는 꼴이다.

            ⚠️⚠️⚠️ **2026-10-20(3) — 기종 라벨을 걷었다. 글 칸에 제목만
               남는다.** 유신이 *"볼피더 이런 문구도 지워도 될거 같고"*
               라고 했다.
               ⚠️ **바로 위 주석이 스스로 근거를 지웠다.** 라벨을 붙인
                  까닭이 *"거르개를 좁혀 놓고 … 어느 칸이 왜 거기 있었는지"*
                  였는데, **그 거르개는 2026-10-20(1) 에 껐다**(VideoBrowser
                  의 aside 와 칩 줄이 hidden 이다). 답할 물음이 사라진 뒤에도
                  라벨만 남아 있던 셈이다.
               ⚠️ **제목의 `mt-2` 도 함께 뗐다** — 기종 라벨 아래 간격이었다.
                  이제 제목이 글 칸의 첫 요소라 `p-5` 가 위 여백을 맡는다.
               ⚠️ 글 칸이 70px 이 되고 카드가 **367px**(1440, 2열)이 된다 —
                  VideoBrowser 의 폭별 표 주석에 적었다.

               되살리려면 아래를 꺼내고 제목에 mt-2 를 돌려준다 —

        <p className="text-xs font-bold tracking-[0.08em] text-brand">
          {video.kinds.join(" · ")}
        </p>  */}
        {/* ⚠️ flex-1 이 제목에 있다 — 아래 설명 줄을 걷으면서 옮겼다
               (머리 주석). note **필드는 videos.ts 에 그대로 있다** —
               홈 자막과 제품 상세가 계속 쓴다. 이 카드에서만 안 건다. */}
        <p className="flex-1 text-15 font-bold leading-snug text-ink">
          {video.title}
        </p>
        {/* 2026-10-19 에 걷은 설명 줄. 되살리려면 이 세 줄을 되살리고
            위 제목에서 flex-1 을 떼면 된다.
            <p className="mt-1.5 flex-1 text-13 leading-relaxed text-ink-soft">
              {video.note}
            </p> */}
      </div>
    </div>
  );
}
