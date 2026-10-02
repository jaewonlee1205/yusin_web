/**
 * 제품 상세 "적용 분야" 카드에 쓰는 사진을 받아
 * public/images/applications/<slug>.webp 로 저장한다.
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
 * 고르는 기준은 두 가지였다.
 *  - 볼피더가 실제로 다루는 모양이어야 한다. 낱개로 흩어진 같은 부품이지,
 *    완성된 제품이나 사람이 든 장면이 아니다.
 *  - 카드가 작다(가장 넓을 때 사진 203x152px). 부품이 프레임을 채우지 않으면
 *    그 크기에서 무엇인지 읽히지 않는다.
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
    out: "vial",
    // https://www.pexels.com/photo/transparent-glass-vials-in-a-blue-tray-6129873/
    url: "https://images.pexels.com/photos/6129873/pexels-photo-6129873.jpeg",
    position: "center",
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
