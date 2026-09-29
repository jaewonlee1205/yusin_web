/**
 * 회사 소개서 PPTX에 박혀 있는 이미지를 꺼내 웹용 자산으로 변환한다.
 *
 *   node scripts/extract-assets.mjs
 *
 * PPTX는 zip이라 ppt/media/imageN.* 를 그대로 읽을 수 있다. 원본은 2000년대 초에
 * 찍은 1024x768급 사진이라 확대는 하지 않고, webp 변환 + 상한 리사이즈만 한다.
 * 한 번 돌리면 public/images/ 가 채워지므로 빌드 파이프라인에는 넣지 않았다.
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const PPTX = path.resolve(root, "..", "유신 회사 소개서.pptx");
const OUT = path.join(root, "public", "images");

/** PPTX 안의 imageN -> 웹 자산. crop은 원본 픽셀 기준 sharp extract 옵션. */
const PLAN = [
  // --- 브랜드 ---
  { src: "image3.png", out: "logo.png", kind: "logo" },

  // --- 히어로 / 배경 ---
  // 투명 배경 3D 렌더. 네이비 히어로 위에 얹는다.
  { src: "image12.png", out: "hero-unit.webp", kind: "cutout", max: 1200 },
  // 설계 도면. 회사소개 '보유 설비'에서는 도면으로 읽히도록 큰 판을 쓴다.
  { src: "image18.png", out: "blueprint.webp", max: 1280 },
  // 홈 히어로 배경 질감. 스테인리스 볼피더 클로즈업을 블러 처리해 깐다.
  // 원본이 756x567이지만 블러를 먹여 어둡게 덮을 것이라 해상도가 문제되지 않고,
  // 오히려 파일이 20KB 아래로 떨어진다.
  {
    src: "image9.jpeg",
    out: "hero-bg.webp",
    cover: { width: 1600, height: 900 },
    blur: 6,
    modulate: { saturation: 0.45, brightness: 0.8 },
    quality: 52,
  },

  // --- 제품 ---
  { src: "image8.jpeg", out: "products/bowl-feeder-01.webp", max: 1200 },
  { src: "image9.jpeg", out: "products/bowl-feeder-02.webp", max: 1200 },
  { src: "image10.jpeg", out: "products/linear-feeder-01.webp", max: 1200 },
  { src: "image11.png", out: "products/linear-feeder-02.webp", kind: "cutout", max: 800 },
  { src: "image12.png", out: "products/vibrator-01.webp", kind: "cutout", max: 1200 },
  { src: "image15.jpeg", out: "products/hopper-feeder-01.webp", max: 1200 },
  { src: "image14.jpeg", out: "products/soundproof-cover-01.webp", max: 1200 },
  { src: "image13.jpeg", out: "products/soundproof-cover-02.webp", max: 1200 },
  { src: "image16.jpeg", out: "products/urethane-coating-01.webp", max: 1400 },
  { src: "image17.jpeg", out: "products/urethane-coating-02.webp", max: 500 },
  // 컨트롤러 단독 사진이 없어 우레탄 코팅 사진에서 OPC-50TH 부분을 잘라 쓴다.
  // 원본은 장비 뒤쪽에서 찍어 패널 글씨가 뒤집혀 있어 180도 돌린다.
  // TODO: 유신 측 컨트롤러 실사진 확보되면 교체할 것.
  {
    src: "image16.jpeg",
    out: "products/controller-01.webp",
    crop: { left: 520, top: 590, width: 520, height: 490 },
    rotate: 180,
    max: 900,
  },

];

/** 거의 흰색인 픽셀을 투명하게 바꾼다. sharp에 chroma key가 없어 raw로 처리. */
async function whiteToAlpha(input, cutoff = 242) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] >= cutoff && data[i + 1] >= cutoff && data[i + 2] >= cutoff) {
      data[i + 3] = 0;
    }
  }
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function main() {
  if (!existsSync(PPTX)) {
    console.error(`PPTX를 찾을 수 없습니다: ${PPTX}`);
    process.exit(1);
  }

  const entries = new Map(
    new AdmZip(PPTX)
      .getEntries()
      .filter((e) => e.entryName.startsWith("ppt/media/"))
      .map((e) => [path.basename(e.entryName), e.getData()])
  );

  await rm(OUT, { recursive: true, force: true });
  await mkdir(path.join(OUT, "products"), { recursive: true });

  for (const item of PLAN) {
    const raw = entries.get(item.src);
    if (!raw) {
      console.warn(`  ! ${item.src} 없음 — 건너뜀`);
      continue;
    }

    let buf = raw;
    // 로고는 흰 배경을 지우고 여백을 잘라낸다.
    if (item.kind === "logo" || item.kind === "cutout") {
      buf = await whiteToAlpha(buf);
      buf = await sharp(buf).trim({ threshold: 5 }).png().toBuffer();
    }

    // sharp는 한 파이프라인 안에서 rotate를 extract보다 먼저 적용한다.
    // 원본 좌표 기준으로 자르려면 crop을 따로 끝낸 뒤 회전시켜야 한다.
    if (item.crop) buf = await sharp(buf).extract(item.crop).toBuffer();
    if (item.rotate) buf = await sharp(buf).rotate(item.rotate).toBuffer();

    let pipe = sharp(buf);
    if (item.cover) {
      // 배경용 — 지정 비율로 꽉 채워 자른다 (확대 허용)
      pipe = pipe.resize({ ...item.cover, fit: "cover", position: "centre" });
    } else if (item.max) {
      pipe = pipe.resize({
        width: item.max,
        height: item.max,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    if (item.blur) pipe = pipe.blur(item.blur);
    if (item.modulate) pipe = pipe.modulate(item.modulate);

    const dest = path.join(OUT, item.out);
    await mkdir(path.dirname(dest), { recursive: true });
    const out = item.out.endsWith(".png")
      ? await pipe.png({ compressionLevel: 9 }).toBuffer()
      : await pipe.webp({ quality: item.quality ?? 86 }).toBuffer();
    await writeFile(dest, out);

    const meta = await sharp(out).metadata();
    console.log(
      `  ${item.src.padEnd(13)} -> ${item.out.padEnd(38)} ${meta.width}x${meta.height}  ${(out.length / 1024).toFixed(0)}KB`
    );
  }

  await makeBrandMarks();
  console.log("\n완료. public/images/");
}

/**
 * 로고 아랫줄 "FEEDING AUTOMATION SYSTEM"의 마지막 M을 복원한다.
 *
 * PPT 안의 로고 원본(image3.png)은 파일 끝이 잘려 있어 마지막 M의 오른쪽 기둥이
 * 중간 아래로 통째로 비어 있다. 복원할 픽셀이 원본에 없으므로,
 * **같은 줄 "AUTOMATION"의 M을 그대로 떼어다 붙인다.** 같은 서체·같은 크기로
 * 래스터라이즈된 글자라 이식해도 티가 나지 않는다.
 *
 * 좌표를 박아 넣었으므로 트림 결과가 예상과 다르면 건너뛰고 경고만 찍는다.
 * (PPT가 바뀌거나 트림 임계값을 손대면 조용히 깨지는 대신 눈에 띄게 하려는 것)
 *
 * 유신 측에서 벡터 원본(AI/SVG)을 받으면 이 함수를 지우고
 * images/logo.png만 갈아 끼우면 된다.
 */
const LOGO_EXPECTED = { width: 400, height: 52 };

/** 태그라인이 놓인 세로 구간 (트림된 로고 기준) */
const TAGLINE_BAND = { top: 39, bottom: 52 };

const LOGO_REPAIR = {
  /**
   * 떼어 올 온전한 M — "AUTOMATION"의 다섯 번째 글자.
   * 태그라인 잉크 덩어리를 스캔해 확인한 정확한 범위다 (x 266..277, 12px).
   */
  source: { left: 266, top: 39, width: 12, height: 13 },
  /**
   * 손상된 M 자리. 앞 글자 E가 x 385에서 끝나므로 386부터 지워도 안전하다.
   * 지우개는 반드시 **불투명**이어야 한다 — dest-out은 소스가 불투명한 곳을
   * 지우므로, 투명한 사각형을 넣으면 아무것도 지워지지 않는다.
   */
  erase: { left: 386, top: 39, width: 14, height: 13 },
  /** E(…385) 다음 글자 간격이 2px이므로 388에서 시작한다. 12px이라 399에서 끝난다. */
  paste: { left: 388, top: 39 },
  /**
   * 오른쪽 투명 여백. M이 캔버스 끝에 딱 붙어 있으면 브라우저가 줄여 그릴 때
   * 마지막 기둥이 흐려져 또 잘려 보인다.
   */
  padRight: 3,
};

/** 태그라인에서 글자 덩어리들의 x 범위를 찾는다. 복원이 됐는지 스스로 확인하는 데 쓴다. */
async function taglineGlyphRuns(buf) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width } = info;
  const bottom = Math.min(TAGLINE_BAND.bottom, info.height);

  const runs = [];
  let run = null;
  for (let x = 0; x < width; x++) {
    let hasInk = false;
    for (let y = TAGLINE_BAND.top; y < bottom; y++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > 60 && (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235)) {
        hasInk = true;
        break;
      }
    }
    if (hasInk) {
      if (run) run.end = x;
      else run = { start: x, end: x };
    } else if (run) {
      runs.push(run);
      run = null;
    }
  }
  if (run) runs.push(run);
  return runs;
}

async function repairLogo() {
  const file = path.join(OUT, "logo.png");
  const meta = await sharp(file).metadata();

  if (
    meta.width !== LOGO_EXPECTED.width ||
    meta.height !== LOGO_EXPECTED.height
  ) {
    console.warn(
      `  ! 로고 크기가 ${meta.width}x${meta.height} 입니다 (예상 ${LOGO_EXPECTED.width}x${LOGO_EXPECTED.height}).
` +
        `    마지막 M 복원을 건너뜁니다 — scripts/extract-assets.mjs의 LOGO_REPAIR 좌표를 다시 잡으세요.`
    );
    return;
  }

  const original = await sharp(file).toBuffer();
  const goodM = await sharp(original)
    .extract(LOGO_REPAIR.source)
    .png()
    .toBuffer();

  const cleared = await sharp(original)
    .composite([
      {
        input: {
          create: {
            width: LOGO_REPAIR.erase.width,
            height: LOGO_REPAIR.erase.height,
            channels: 4,
            // 불투명이어야 dest-out이 실제로 지운다.
            background: { r: 0, g: 0, b: 0, alpha: 1 },
          },
        },
        left: LOGO_REPAIR.erase.left,
        top: LOGO_REPAIR.erase.top,
        blend: "dest-out",
      },
    ])
    .png()
    .toBuffer();

  const repaired = await sharp(cleared)
    .composite([{ input: goodM, ...LOGO_REPAIR.paste }])
    .extend({
      right: LOGO_REPAIR.padRight,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // 복원이 진짜 됐는지 확인한다. 예전에 "고쳤다"고 하고 안 고쳐진 적이 있다.
  const runs = await taglineGlyphRuns(repaired);
  const last = runs[runs.length - 1];
  const lastWidth = last ? last.end - last.start + 1 : 0;
  const expected = LOGO_REPAIR.source.width;

  if (lastWidth !== expected) {
    console.warn(
      `  ! 마지막 M 복원 실패 — 폭이 ${lastWidth}px 입니다 (예상 ${expected}px).
` +
        `    LOGO_REPAIR 좌표를 다시 잡으세요. 로고는 복원 전 상태로 둡니다.`
    );
    return;
  }

  await writeFile(file, repaired);
  const out = await sharp(repaired).metadata();
  console.log(
    `  logo -> images/logo.png  ${out.width}x${out.height} (잘린 마지막 M 복원 확인)`
  );
}

/** 로고 다듬기, 파비콘, OG 이미지를 만든다. */
async function makeBrandMarks() {
  await repairLogo();

  // 로고 래스터가 400x52밖에 안 돼 아이콘으로 확대하면 뭉개진다.
  // 로고의 기울어진 서체를 따라 'Y'를 패스로 그려 선명한 아이콘을 만든다.
  const iconSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="104" fill="#E8322A"/>
  <g transform="translate(256 256) skewX(-11) translate(-256 -256)"
     stroke="#fff" stroke-width="60" stroke-linecap="square" fill="none">
    <path d="M152 138 L256 272 L360 138"/>
    <path d="M256 272 L256 392"/>
  </g>
</svg>`);

  const icon = await sharp(iconSvg).resize(512, 512).png().toBuffer();
  await writeFile(path.join(root, "src", "app", "icon.png"), icon);
  await writeFile(
    path.join(root, "src", "app", "apple-icon.png"),
    await sharp(icon).resize(180, 180).png().toBuffer()
  );

  // OG 이미지: 흰 바탕 + 로고, 하단에 네이비 바.
  const logo = await sharp(path.join(OUT, "logo.png")).toBuffer();
  const ogLogo = await sharp(logo).resize({ width: 760, fit: "inside" }).toBuffer();
  const ogLogoMeta = await sharp(ogLogo).metadata();
  const og = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: ogLogo,
        left: Math.round((1200 - ogLogoMeta.width) / 2),
        top: Math.round((630 - ogLogoMeta.height) / 2) - 30,
      },
      {
        input: {
          create: {
            width: 1200,
            height: 96,
            channels: 4,
            background: { r: 11, g: 60, b: 141, alpha: 1 },
          },
        },
        left: 0,
        top: 534,
      },
    ])
    .png()
    .toBuffer();
  await writeFile(path.join(OUT, "og-image.png"), og);

  console.log("  brand marks -> src/app/icon.png, apple-icon.png, images/og-image.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
