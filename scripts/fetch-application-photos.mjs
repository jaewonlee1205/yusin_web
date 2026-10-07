/**
 * 제품 상세 "적용 분야" 카드에 쓰는 사진을 받아
 * public/images/applications/<slug>.webp 로 저장한다. 일곱 제품 20칸이다.
 *
 * ⚠️ 유신이 찍은 사진이 아니다. 어떤 부품을 공급하는지 보여 주는 일반 산업
 *    사진이고, 화면에도 "사진은 부품 종류를 보여 주는 예시입니다" 라고 적어
 *    둔다. 유신 실물 사진을 받으면 아래 목록을 지우고 같은 파일 이름으로
 *    갈아 끼우면 된다 — 데이터(products.ts)는 경로만 보므로 고칠 것이 없다.
 *
 * 출처는 전부 Pexels 다. Pexels License — 상업적 이용 가능, 출처 표기 의무
 * 없음, 사진 자체를 되파는 것만 금지(https://www.pexels.com/license/).
 * 그래도 추적할 수 있게 사진마다 원본 페이지를 적어 둔다.
 *
 * 고르는 기준은 다섯 가지다. 하나라도 걸리면 버린다.
 *  - 기계 전경이 아니라 부품.재료.공구 클로즈업일 것. 이게 가장 중요하다 —
 *    처음에 "볼피더 구동부" 같은 분야를 기계 사진으로 찾았더니 받는 것마다
 *    FESTO 로고, "handling technology" 상호, 포르투갈어 패널, 식품 컨베이어가
 *    나왔다. 부품을 찍은 사진은 그런 것이 애초에 없다.
 *  - 브랜드 로고.상호.외국어 라벨이 보이지 않을 것(부품에 찍힌 규격 표기는
 *    괜찮다).
 *  - 사람 얼굴이 없을 것. 손끝은 괜찮다.
 *  - 다른 업종(식품.의류 등)이 아닐 것.
 *  - 한 제품 안의 사진끼리 한눈에 구별될 것. 컨트롤러 셋이 같은 패널이면
 *    칩보다 못하다.
 *
 * 카드가 작다는 것도 잊지 말 것(가장 넓을 때 사진 350x197px). 피사체가
 * 프레임을 채우지 않으면 그 크기에서 무엇인지 읽히지 않는다.
 *
 * ⚠️⚠️ **이 스크립트는 지금 화면에 보이는 사진을 만들지 않는다.** 적용 분야
 *      19칸이 전부 유신 촬영 영상에서 뽑은 프레임으로 바뀌었다
 *      (scripts/capture-video-frames.mjs). 파일 이름이 같아서, **이것을 돌리면
 *      그 19장이 전부 스톡으로 되돌아간다.**
 *
 *      그래도 지우지 않는 것은 두 가지 때문이다 — Pexels 출처 기록이고,
 *      영상으로 담을 수 없는 자리(공장 전경 같은 것)가 생기면 다시 쓸 수 있다.
 *
 *      실수로 돌렸다면 바로 되돌린다:
 *        npm run video-frames
 *
 * 사진을 바꾸거나 분야를 늘린 뒤에는:  npm run app-photos
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const OUT_DIR = path.join(ROOT, "public", "images", "applications");

/** 카드 사진 칸이 16:9 다. 가장 클 때 350x197px 라 두 배쯤 받아 둔다. */
const WIDTH = 640;
const HEIGHT = 360;
/** 기본 품질. 결이 촘촘한 사진만 PHOTOS 에서 따로 낮춘다. */
const QUALITY = 72;

/**
 * position 은 4:3 으로 자를 때 어디를 남길지다. 원본이 3:2 나 세로면
 * 가운데가 비는 경우가 있어 사진마다 정했다.
 */
const PHOTOS = [
  {
    out: "connector",
    // https://www.pexels.com/photo/socket-connectors-on-white-surface-7596181/
    url: "https://images.pexels.com/photos/7596181/pexels-photo-7596181.jpeg",
    position: "center",
  },
  {
    out: "fastener",
    // https://www.pexels.com/photo/pile-of-chromated-metal-screws-close-up-39785074/
    url: "https://images.pexels.com/photos/39785074/pexels-photo-39785074.jpeg",
    position: "center",
    // 나사 더미는 결이 촘촘해 같은 품질에서 파일이 다섯 배로 뛴다(q72 에 83KB).
    quality: 55,
  },
  {
    out: "cosmetic",
    // https://www.pexels.com/photo/empty-amber-bottles-with-black-caps-6693882/
    // 세로 사진이고 위쪽 1/3 이 빈 배경이라 아래를 남긴다.
    url: "https://images.pexels.com/photos/6693882/pexels-photo-6693882.jpeg",
    position: "bottom",
  },
  {
    out: "appliance",
    // https://www.pexels.com/photo/stainless-steel-coupling-rings-12951626/
    url: "https://images.pexels.com/photos/12951626/pexels-photo-12951626.jpeg",
    position: "center",
  },

  /* ── 직진피더 ── */
  {
    out: "linear-transfer",
    // https://www.pexels.com/photo/259958/  한 줄로 세워 둔 같은 나사
    url: "https://images.pexels.com/photos/259958/pexels-photo-259958.jpeg",
    position: "center",
  },
  {
    out: "linear-inspect",
    // https://www.pexels.com/photo/36003970/  마이크로미터로 두께를 재는 모습
    url: "https://images.pexels.com/photos/36003970/pexels-photo-36003970.jpeg",
    position: "center",
  },

  /* ── 진동기 ── */
  {
    out: "vibrator-bowl",
    // https://www.pexels.com/photo/11133641/  구리선 다발(전자석 권선)
    url: "https://images.pexels.com/photos/11133641/pexels-photo-11133641.jpeg",
    position: "center",
    quality: 60,
  },
  {
    out: "vibrator-linear",
    // https://www.pexels.com/photo/15059762/  감아 둔 강선
    url: "https://images.pexels.com/photos/15059762/pexels-photo-15059762.jpeg",
    position: "center",
    quality: 60,
  },
  {
    out: "vibrator-replace",
    // https://www.pexels.com/photo/6196893/  소켓 공구
    url: "https://images.pexels.com/photos/6196893/pexels-photo-6196893.jpeg",
    position: "center",
  },

  /* ── 호퍼피더 ── */
  {
    out: "hopper-unattended",
    // https://www.pexels.com/photo/30496227/  가득 쌓인 육각 볼트
    url: "https://images.pexels.com/photos/30496227/pexels-photo-30496227.jpeg",
    position: "center",
    quality: 55,
  },
  {
    out: "hopper-bulk",
    // https://www.pexels.com/photo/8447852/  칸마다 가득 담긴 작은 부품
    url: "https://images.pexels.com/photos/8447852/pexels-photo-8447852.jpeg",
    position: "center",
    quality: 60,
  },

  /* ── 방음커버 ── */
  {
    out: "cover-metal",
    // https://www.pexels.com/photo/27312811/  끝을 맞춰 쌓은 금속 관 수천 개
    url: "https://images.pexels.com/photos/27312811/pexels-photo-27312811.jpeg",
    position: "center",
    quality: 60,
  },
  {
    out: "cover-worker",
    // https://www.pexels.com/photo/10497629/  공구를 걸어 둔 작업장 벽(사람 없음)
    url: "https://images.pexels.com/photos/10497629/pexels-photo-10497629.jpeg",
    position: "center",
  },

  /* ── 컨트롤러 ── */
  {
    out: "controller-bowl",
    // https://www.pexels.com/photo/13401910/  회전 노브가 달린 제어 패널
    url: "https://images.pexels.com/photos/13401910/pexels-photo-13401910.jpeg",
    position: "center",
  },
  {
    out: "controller-linear",
    // https://www.pexels.com/photo/12320170/  단자대와 배선
    url: "https://images.pexels.com/photos/12320170/pexels-photo-12320170.jpeg",
    position: "center",
  },
  {
    out: "controller-hopper",
    // https://www.pexels.com/photo/5276099/  릴레이 모듈과 단자
    url: "https://images.pexels.com/photos/5276099/pexels-photo-5276099.jpeg",
    position: "center",
  },

  /* ── 우레탄 코팅 ── */
  {
    out: "urethane-plated",
    // https://www.pexels.com/photo/15608998/  크롬 도금 부품 더미
    url: "https://images.pexels.com/photos/15608998/pexels-photo-15608998.jpeg",
    position: "center",
  },
  {
    out: "urethane-resin",
    // https://www.pexels.com/photo/31115985/  흰 사출 플라스틱 부품 더미
    url: "https://images.pexels.com/photos/31115985/pexels-photo-31115985.jpeg",
    position: "center",
  },
  {
    out: "urethane-noise",
    // https://www.pexels.com/photo/38398497/  흡음 폼 결
    url: "https://images.pexels.com/photos/38398497/pexels-photo-38398497.jpeg",
    position: "center",
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const photo of PHOTOS) {
    // w=1600 으로 받아 둔다. 640 으로 줄이기 전에 원본이 충분히 커야
    // 자른 뒤에도 선명하다.
    const res = await fetch(`${photo.url}?auto=compress&cs=tinysrgb&w=1600`);
    if (!res.ok) {
      throw new Error(`${photo.out}: 내려받기 실패 (HTTP ${res.status})`);
    }
    const input = Buffer.from(await res.arrayBuffer());

    const output = await sharp(input)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: photo.position })
      .webp({ quality: photo.quality ?? QUALITY })
      .toBuffer();

    const file = path.join(OUT_DIR, `${photo.out}.webp`);
    await writeFile(file, output);
    console.log(
      `  ${photo.out}.webp  ${WIDTH}x${HEIGHT}  ${(output.length / 1024).toFixed(1)}KB`
    );
  }

  console.log(`적용 분야 사진 ${PHOTOS.length}장을 저장했습니다.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
