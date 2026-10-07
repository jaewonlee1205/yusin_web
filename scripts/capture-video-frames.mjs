/**
 * 유신 촬영 영상(public/videos/*.mp4)에서 정지 화면을 뽑아
 * **적용 분야 19칸과 제품 특징 28칸을 전부** 채운다. 모두 47장이다.
 *
 * ⚠️⚠️ **사이트의 적용 분야 · 특징 사진에 스톡은 한 장도 없다.** 전부 유신이
 *      실제로 만든 장비가 찍힌 그림이다. 한동안 Pexels 스톡이었고 그 가운데
 *      여덟 칸만 영상으로 바꿨었는데, 섞여 있는 것이 어색하다는 말에 전부
 *      영상으로 돌렸다.
 *
 *      출력 파일 이름이 스톡 때와 같다 — 데이터(products.ts)는 경로만 보므로
 *      거기는 고칠 것이 없다. 대신 scripts/fetch-application-photos.mjs 나
 *      fetch-feature-photos.mjs 를 돌리면 **전부 스톡으로 되돌아간다.**
 *      그 두 스크립트는 이제 화면에 보이는 사진을 만들지 않는다(출처 기록으로
 *      남겨 둔 것이다).
 *
 * ⚠️ ffmpeg 가 필요하다. 저장소에 들어 있지 않고 시스템 PATH 에서 찾는다
 *    (개발 PC 에 winget 으로 설치된 8.0.1 로 만들었다).
 *
 * ── 영상 열 편으로 47칸을 채우는 방법 ──────────────────────────────
 *
 * 쓸 수 있는 **장면**은 영상 수만큼, 열 가지뿐이다. 고정 카메라에 7~9초라
 * 한 영상 안에서 시각(-ss)을 옮겨도 거의 같은 그림이 나온다.
 *
 * 그래서 **구도(crop)** 로 가른다. 1280x720 프레임에서 일부를 떼어 640x360 으로
 * 줄이면 — 전체 / 왼쪽 / 오른쪽 / 가운데 확대 / 위 / 아래 — 서로 다른 그림이
 * 되고, 떼어 낸 뒤 줄이므로 화질도 오히려 선명해진다. 캔버스로 미리 그려 보고
 * 확인한 방법이다.
 *
 * 배분은 이렇다.
 *
 *   제품 특징 28칸   그 제품의 product-*.mp4 에서 구도 넷
 *                    (볼피더 4번만 preview-bowl-jig — 볼 안에 세운 지그라
 *                     그 특징에 꼭 맞는 장면이 따로 있다)
 *   적용 분야 19칸   볼피더는 preview-metal-parts 와 hero 에서,
 *                    나머지 여섯 제품은 자기 영상의 **다른 구도**에서
 *
 * ⚠️ 그 대가로 **한 제품 페이지에 같은 영상에서 나온 그림이 6~7장** 모인다.
 *    거기에 그 페이지의 IN OPERATION 영상까지 같은 파일이다. 업종은 일관되게
 *    보이지만 다양성은 줄어든다 — 알고 받아들인 것이다.
 *
 * ⚠️ 컨트롤러 · 호퍼피더 · 방음커버는 영상이 **볼피더가 도는 장면**이다. 원본
 *    촬영본 넷이 전부 볼피더라 그 장비가 찍힌 프레임이 아예 없다(README 자료
 *    요청 8번). 그 세 제품의 사진이 전부 볼피더인 것은 그래서다. 다만 같은
 *    페이지의 구동 영상도 같은 것이라 페이지 안에서는 어긋나지 않는다.
 *
 * ── at 과 crop 이 "어느 장면을 골랐나" 의 기록이다 ────────────────
 *
 * 둘 중 하나만 옮겨도 다른 그림이 된다. 바꿀 때는 뽑아서 **실제 크기로 그려**
 * 보고 확인한다 — 특징은 64x64 썸네일, 적용 분야는 260~350px 카드다.
 *
 * 처음 뽑은 47장을 그렇게 점검해 일곱 장을 옮겼다. 걸린 것이 두 가지였다 —
 *
 *   빈 면만 잡힘   볼 바깥 초록면 · 그늘진 벽 · 작업대 바닥. 영상마다 부품이
 *                  몰려 있는 쪽이 따로 있다(대개 왼쪽~가운데).
 *   현장 물건      product-urethane-coating 은 오른쪽 끝에 **빨간 작업 의자**가
 *                  들어온다. 그 영상에서 right · br 을 쓰지 말 것.
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
 * 구도. 원본 1280x720 에서 떼어 낼 자리이고 **전부 16:9** 다 — 비율이 다르면
 * 640x360 으로 줄일 때 찌그러진다.
 *
 * 많이 떼어 낼수록(=작은 영역) 확대가 커져 거칠어진다. center 가 640x360 으로
 * 가장 작고, 그보다 더 좁히지 않는다.
 */
const CROP = {
  full: { left: 0, top: 0, width: 1280, height: 720 },
  left: { left: 0, top: 45, width: 720, height: 405 },
  right: { left: 560, top: 45, width: 720, height: 405 },
  center: { left: 320, top: 180, width: 640, height: 360 },
  top: { left: 213, top: 0, width: 854, height: 480 },
  bottom: { left: 213, top: 240, width: 854, height: 480 },
  tl: { left: 0, top: 0, width: 853, height: 480 },
  br: { left: 427, top: 240, width: 853, height: 480 },
};

/** [출력 경로, 소스 mp4, 시각(초), 구도, 어느 칸에 어떤 뜻으로 붙였는가] */
const FRAMES = [
  /* ══ 볼피더 ═══════════════════════════════════════════════════════
     특징 넷은 bowl-feeder.mp4(초록 볼 + 검은 커넥터), 다만 4번 "선별 ·
     방향 판별 지그" 만 preview-bowl-jig(볼 안에 세운 지그)를 쓴다. */
  ["features/bowl-feeder-1", "product-bowl-feeder", 2.5, "full", "부품별 맞춤 볼 설계 — 볼과 트랙 전체"],
  ["features/bowl-feeder-2", "product-bowl-feeder", 3.0, "left", "네 가지 기본 볼 형상 — 볼 안쪽 곡면"],
  /* right 는 볼 바깥 초록 면만 잡힌다 — 이 영상은 부품이 왼쪽~가운데에 있다 */
  ["features/bowl-feeder-3", "product-bowl-feeder", 4.0, "tl", "소형부터 대형까지 — 트랙을 오르는 부품 줄"],
  ["features/bowl-feeder-4", "preview-bowl-jig", 3.5, "full", "선별 · 방향 판별 지그 — 볼 안에 세운 지그"],

  /* 적용 분야 넷은 다른 영상에서 — 이 페이지에 볼피더 영상 그림이 이미 셋이다 */
  ["applications/connector", "product-bowl-feeder", 5.0, "center", "커넥터 · 단자 등 전자부품 — 트랙 위 커넥터 클로즈업"],
  ["applications/fastener", "preview-metal-parts", 3.5, "full", "볼트 · 너트 · 나사 등 체결부품 — 트랙에 선 판금 부품"],
  /* right 는 볼 바깥면뿐이다 */
  ["applications/cosmetic", "preview-metal-parts", 5.5, "tl", "화장품 용기 캡 · 펌프 부품 — 트랙을 도는 부품"],
  ["applications/appliance", "hero", 4.5, "full", "가전 · 전기기기 조립 부품 — 볼 전체와 트랙"],

  /* ══ 직진피더 ═════════════════════════════════════════════════════ */
  ["features/linear-feeder-1", "product-linear-feeder", 1.5, "full", "부품 폭에 맞춘 슈트 — 직선 트랙 전체"],
  ["features/linear-feeder-2", "product-linear-feeder", 3.0, "left", "독립 진동 제어 — 트랙 앞쪽"],
  ["features/linear-feeder-3", "product-linear-feeder", 4.5, "right", "라인 길이에 맞춘 크기 — 트랙 끝과 적재부"],
  ["features/linear-feeder-4", "product-linear-feeder", 5.5, "center", "슈트 면을 직접 다듬는다 — 트랙 면 클로즈업"],
  ["applications/linear-transfer", "product-linear-feeder", 2.0, "top", "볼피더 – 조립기 사이 부품 이송 — 트랙 윗면"],
  ["applications/linear-inspect", "product-linear-feeder", 6.0, "bottom", "검사 공정 공급 — 트랙 아래 부품 모임"],

  /* ══ 진동기 ═══════════════════════════════════════════════════════ */
  ["features/vibrator-1", "product-vibrator", 1.5, "full", "판스프링 진동 방식 — 볼 안쪽 전체"],
  ["features/vibrator-2", "product-vibrator", 3.0, "center", "현장 튜닝 대응 — 나선 트랙 이음매"],
  ["features/vibrator-3", "product-vibrator", 4.5, "left", "전압까지 함께 조정 — 볼 벽면"],
  ["features/vibrator-4", "product-vibrator", 6.0, "right", "진동부만 바꿔 단다 — 트랙이 붙은 자리"],
  ["applications/vibrator-bowl", "product-vibrator", 2.0, "tl", "볼피더 구동부 — 볼 위쪽 트랙"],
  ["applications/vibrator-linear", "product-vibrator", 5.0, "br", "직진피더 구동부 — 트랙 아래쪽"],
  /* top 은 vibrator-bowl(tl) 과 거의 같은 그림이었다 */
  ["applications/vibrator-replace", "product-vibrator", 6.5, "center", "노후 진동기 교체 — 트랙 이음매 가까이"],

  /* ══ 호퍼피더 ═════════════════════════════════════════════════════ */
  ["features/hopper-feeder-1", "product-hopper-feeder", 1.5, "full", "센서 연동 자동 보충 — 부품이 담긴 볼 전체"],
  ["features/hopper-feeder-2", "product-hopper-feeder", 3.0, "center", "무인 운전 — 부품이 쌓인 바닥"],
  ["features/hopper-feeder-3", "product-hopper-feeder", 4.5, "left", "소모량에 맞춘 용량 — 볼 왼쪽 벽면"],
  ["features/hopper-feeder-4", "product-hopper-feeder", 6.0, "right", "라인과 함께 선다 — 트랙 출구 쪽"],
  ["applications/hopper-unattended", "product-hopper-feeder", 2.0, "top", "장시간 무인 운전 라인 — 부품이 가득한 볼"],
  ["applications/hopper-bulk", "product-hopper-feeder", 5.0, "br", "소형 부품 대량 공급 공정 — 작은 부품 더미"],

  /* ══ 방음커버 ═════════════════════════════════════════════════════ */
  ["features/soundproof-cover-1", "product-soundproof-cover", 1.5, "full", "15~20dB 소음 저감 — 트랙과 부품 전체"],
  ["features/soundproof-cover-2", "product-soundproof-cover", 3.0, "center", "개폐형 구조 — 트랙 가까이"],
  ["features/soundproof-cover-3", "product-soundproof-cover", 4.5, "left", "씌울 피더를 재서 만든다 — 볼 바깥 둘레"],
  /* right 는 그늘진 빈 면이다. 부품은 왼쪽 위에 몰려 있다 */
  ["features/soundproof-cover-4", "product-soundproof-cover", 6.0, "tl", "금속 부품 라인에 효과 — 줄지어 선 금속 부품"],
  ["applications/cover-metal", "product-soundproof-cover", 2.0, "tl", "금속 부품 취급 라인 — 트랙 위 금속 부품"],
  ["applications/cover-worker", "product-soundproof-cover", 5.5, "bottom", "작업자 상주 공정 — 트랙 아래쪽"],

  /* ══ 컨트롤러 ═════════════════════════════════════════════════════ */
  ["features/controller-1", "product-controller", 1.5, "full", "진동 세기 무단 조절 — 볼 전체"],
  ["features/controller-2", "product-controller", 3.0, "left", "볼 · 직진 개별 제어 — 트랙 왼쪽"],
  /* right 는 초록 바닥이 절반이다. bottom 이 볼 아래쪽 트랙을 잡는다 */
  ["features/controller-3", "product-controller", 4.5, "bottom", "붙이거나 따로 둔다 — 볼 아래쪽 트랙"],
  ["features/controller-4", "product-controller", 6.0, "center", "스위치와 다이얼뿐 — 볼 안쪽 바닥"],
  ["applications/controller-bowl", "product-controller", 2.0, "top", "볼피더 속도 제어 — 볼 윗면"],
  ["applications/controller-linear", "product-controller", 5.0, "br", "직진피더 속도 제어 — 트랙 아래쪽"],
  ["applications/controller-hopper", "product-controller", 6.5, "tl", "호퍼피더 자동 공급 제어 — 볼 위쪽"],

  /* ══ 우레탄 코팅 ══════════════════════════════════════════════════ */
  ["features/urethane-coating-1", "product-urethane-coating", 1.5, "full", "충격 흡수 · 소음 저감 — 코팅된 볼 전체"],
  ["features/urethane-coating-2", "product-urethane-coating", 3.0, "center", "부품 손상 방지 — 코팅면 가까이"],
  ["features/urethane-coating-3", "product-urethane-coating", 4.5, "left", "샘플로 등급을 정한다 — 볼 왼쪽 코팅면"],
  /* ⚠️ 이 영상은 오른쪽 끝에 빨간 작업 의자가 들어온다. right · br 을 쓰지 말 것 */
  ["features/urethane-coating-4", "product-urethane-coating", 6.0, "left", "트랙 · 슈트에도 입힌다 — 코팅된 트랙"],
  ["applications/urethane-plated", "product-urethane-coating", 2.0, "tl", "도금 부품 라인 — 볼 위쪽 코팅면"],
  /* br 은 빨간 작업 의자가 들어온다(위 urethane-coating-4 주석 참고) */
  ["applications/urethane-resin", "product-urethane-coating", 5.0, "center", "수지 · 플라스틱 부품 — 볼 안쪽 코팅면"],
  ["applications/urethane-noise", "product-urethane-coating", 6.5, "top", "소음이 문제인 공정 — 코팅된 볼 윗면"],
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

/** 같은 (영상, 시각)을 여러 구도가 함께 쓰므로 프레임을 한 번만 뽑는다. */
const cache = new Map();
function frame(video, at) {
  const key = `${video}@${at}`;
  if (!cache.has(key)) cache.set(key, grab(video, at));
  return cache.get(key);
}

async function main() {
  let n = 0;
  for (const [out, video, at, crop, why] of FRAMES) {
    const png = frame(video, at);
    const box = CROP[crop];
    if (!box) throw new Error(`${out}: 구도 "${crop}" 가 CROP 에 없습니다`);

    const webp = await sharp(png)
      .extract(box)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "center" })
      .webp({ quality: QUALITY })
      .toBuffer();

    const dest = path.join(IMAGE_DIR, `${out}.webp`);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, webp);
    n++;

    console.log(
      `  ${out}.webp  ${(webp.length / 1024).toFixed(1)}KB  ` +
        `<- ${video} @${at}s ${crop}  — ${why}`,
    );
  }

  console.log(`영상 프레임 ${n}장을 저장했습니다 (프레임 ${cache.size}개에서).`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
