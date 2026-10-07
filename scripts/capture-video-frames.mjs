/**
 * 유신 촬영 영상(public/videos/*.mp4)에서 정지 화면을 뽑아, 스톡 사진으로
 * 채워 두었던 칸 **여덟 개**를 덮어쓴다.
 *
 * 이 여덟 장은 사이트에서 **유신이 실제로 만든 장비가 찍힌 유일한 사진**이다.
 * 나머지 적용 분야 13칸 · 특징 26칸은 여전히 Pexels 스톡이다
 * (fetch-application-photos.mjs · fetch-feature-photos.mjs).
 *
 * ⚠️⚠️ **덮어쓰기다.** 출력 파일 이름이 스톡 사진과 같다 — 데이터(products.ts)가
 *      경로만 보므로 거기는 고칠 것이 없다. 대신 위 두 fetch 스크립트를 다시
 *      돌리면 **이 여덟 장이 스톡으로 되돌아간다.** 그때는 이 스크립트를 뒤에
 *      한 번 더 돌린다:
 *
 *        npm run app-photos && npm run feature-photos && npm run video-frames
 *
 * ⚠️ ffmpeg 가 필요하다. 저장소에 들어 있지 않고 시스템 PATH 에서 찾는다
 *    (개발 PC 에 winget 으로 설치된 8.0.1 로 만들었다). README 의 영상 포스터
 *    만드는 절차가 같은 도구를 쓴다.
 *
 * ── 왜 여덟 장뿐인가 ────────────────────────────────────────────────
 *
 * 영상 열 편을 전부 열어 네 시점씩 그려 보고 정한 수다. 두 가지 한계가 있다.
 *
 *  1. **컨트롤러 · 호퍼피더 · 방음커버는 그 장비가 영상에 없다.** 이름이
 *     product-controller.mp4 여도 찍힌 것은 볼피더가 도는 장면이다. 원본
 *     촬영본 넷이 전부 볼피더라 그렇다(README 자료 요청 8번에 같은 내용).
 *     그 세 제품의 특징 사진은 스톡으로 둔다.
 *
 *  2. **한 영상 안에서는 시점을 바꿔도 장면이 같다.** 고정 카메라에 7~9초라
 *     0.5초와 6.5초가 구별되지 않는다. 즉 **쓸 수 있는 장면은 영상 수만큼**
 *     이고, 한 영상에서 네 장을 뽑아 특징 네 칸을 채우는 식은 안 된다.
 *
 * 그래서 **한 영상은 한 칸에만** 쓴다. 적용 분야 · 특징 사진이 지키는
 * "같은 사진이 두 뜻을 가리키면 둘 다 거짓이 된다" 를 그대로 따른 것이다.
 *
 * 쓰지 않는 영상 둘 —
 *   hero.mp4              히어로와 홈 PERFORMANCE 가 이미 쓴다. 세 번째가 된다
 *   product-controller    스테인리스 볼 전경이라 product-vibrator 와 구별 안 됨
 *
 * ── at 값이 곧 "어느 장면을 골랐나" 의 기록이다 ─────────────────────
 *
 * 초 단위다. 옮기면 다른 장면이 되므로, 바꿀 때는 뽑아서 카드 크기로 그려
 * 보고 무엇인지 읽히는지 확인한다.
 *
 * 사진을 바꾼 뒤에는:  npm run video-frames
 */
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const VIDEO_DIR = path.join(ROOT, "public", "videos");
const IMAGE_DIR = path.join(ROOT, "public", "images");

/** 받는 쪽 칸이 전부 16:9 다. 적용 분야 카드가 가장 커서 350x197px 다. */
const WIDTH = 640;
const HEIGHT = 360;
const QUALITY = 72;

/**
 * [소스 mp4, 뽑을 시각(초), 덮어쓸 파일, 자를 때 남길 쪽, 무엇을 가리키는가]
 *
 * position 은 1280x720 을 16:9 로 맞출 때 어디를 남길지다. 원본이 이미
 * 16:9 라 대부분 center 로 그대로지만, 프레임 가장자리에 현장 물건이
 * 들어온 것만 따로 정했다.
 */
const FRAMES = [
  /* ── 적용 분야 (public/images/applications/) ───────────────────── */
  {
    video: "product-bowl-feeder",
    at: 2.5,
    out: "applications/connector",
    why: "커넥터 · 단자 등 전자부품 — 초록 볼 트랙을 올라오는 검은 커넥터",
  },
  {
    video: "preview-metal-parts",
    at: 3.5,
    out: "applications/appliance",
    why: "가전 · 전기기기 조립 부품 — 트랙에 줄지어 선 판금 브래킷",
  },
  {
    video: "product-linear-feeder",
    at: 3.5,
    out: "applications/linear-transfer",
    why: "직선 트랙 이송 — 직진피더 트랙을 지나는 은색 부품",
  },
  {
    video: "product-vibrator",
    at: 3.5,
    out: "applications/vibrator-bowl",
    why: "볼피더 구동부 — 볼 안쪽 나선 트랙(진동으로 부품이 올라가는 면)",
  },
  {
    video: "product-hopper-feeder",
    at: 2.5,
    out: "applications/hopper-bulk",
    why: "벌크 공급 — 볼에 가득 담긴 작은 부품",
  },
  {
    video: "product-soundproof-cover",
    at: 4.5,
    out: "applications/cover-metal",
    why: "금속 부품 취급 라인 — 트랙에 줄 선 검은 금속 부품",
  },

  /* ── 제품 특징 (public/images/features/) ───────────────────────── */
  {
    video: "preview-bowl-jig",
    at: 3.5,
    out: "features/bowl-feeder-4",
    why: "선별 · 방향 판별 지그 — 볼 안에 세운 지그. 사이트에서 가장 정확한 한 장이다",
  },
  {
    video: "product-urethane-coating",
    at: 3.5,
    out: "features/urethane-coating-4",
    /* 프레임 오른쪽 끝에 빨간 작업 의자가 들어온다. left 로 잘라 밀어낸다. */
    position: "left",
    why: "트랙 · 슈트에도 입힌다 — 우레탄을 입힌 초록 볼과 트랙",
  },
];

function grab(video, at) {
  const src = path.join(VIDEO_DIR, `${video}.mp4`);
  try {
    /* -ss 를 -i 앞에 둔다(빠른 탐색). 한 프레임을 PNG 로 표준출력에 보낸다 —
       중간 파일을 만들지 않으려는 것이고, maxBuffer 는 1280x720 PNG 가
       2~3MB 라 넉넉히 잡는다. */
    return execFileSync(
      "ffmpeg",
      [
        "-nostdin", "-loglevel", "error",
        "-ss", String(at),
        "-i", src,
        "-frames:v", "1",
        "-f", "image2pipe",
        "-vcodec", "png",
        "-",
      ],
      { maxBuffer: 64 * 1024 * 1024 },
    );
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(
        "ffmpeg 를 찾지 못했습니다. 시스템에 설치하고 PATH 에 넣어 주세요 " +
          "(Windows: winget install Gyan.FFmpeg).",
      );
    }
    throw new Error(`${video}.mp4 @${at}s 를 뽑지 못했습니다 — ${err.message}`);
  }
}

async function main() {
  for (const { video, at, out, position = "center", why } of FRAMES) {
    const png = grab(video, at);

    const webp = await sharp(png)
      .resize(WIDTH, HEIGHT, { fit: "cover", position })
      .webp({ quality: QUALITY })
      .toBuffer();

    const dest = path.join(IMAGE_DIR, `${out}.webp`);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, webp);

    console.log(
      `  ${out}.webp  ${(webp.length / 1024).toFixed(1)}KB  ` +
        `<- ${video}.mp4 @${at}s  — ${why}`,
    );
  }

  console.log(`영상 프레임 ${FRAMES.length}장을 저장했습니다.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
