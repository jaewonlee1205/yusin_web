/**
 * 회사소개 "경영이념" 두 카드에 쓰는 사진을 받아
 * public/images/philosophy/<이름>.webp 로 저장한다. 두 장뿐이다.
 *
 * ⚠️⚠️ 유신이 찍은 사진이 아니다. 적용 분야(fetch-application-photos.mjs)·
 *      공정(fetch-process-photos.mjs)·특징(fetch-feature-photos.mjs)과 같은
 *      처지다. README 자료 요청 11번(공장 · 작업 현장 사진)을 받으면 여기도
 *      갈아 끼운다 — 경영이념은 회사가 스스로를 말하는 자리라 **남의 공장
 *      사진이 가장 어색한 곳**이기도 하다.
 *
 * 출처는 Pexels 다. Pexels License — 상업적 이용 가능, 출처 표기 의무 없음,
 * 사진 자체를 되파는 것만 금지(https://www.pexels.com/license/).
 *
 * 고르는 기준은 앞 세 스크립트와 같다.
 *  - 브랜드 로고 · 상호 · 외국어 라벨이 보이지 않을 것
 *  - 사람 얼굴이 없을 것
 *  - 다른 업종이 아닐 것
 *  - 피사체가 프레임을 채울 것 — 카드에서 약 317px 다(1280 기준)
 *  - 기존 51장(적용 19 · 공정 4 · 특징 28)과 겹치지 않을 것
 *
 * ⚠️ 후보 열하나를 받아 카드 크기로 그려 보고 아홉을 버렸다. 버린 이유가
 *    둘로 갈린다 —
 *
 *      외국어 간판이 선명  5432282(한자 간판) · 29286299(러시아어 표지)
 *      업종이 다름(건축)   4134179("PROPOSED BUILDING") · 6615086 ·
 *                        34573691 · 5582585  — 전부 건축 도면이다
 *      도면 제목이 또렷    38908429(독일어 표제)
 *      어수선 · 목공 느낌  30361320 · 38030789
 *
 *    "도면" 을 검색하면 대부분 **건축** 도면이 나온다. 유신은 기계 가공이라
 *    평면도·입면도가 아니라 **부품 투상도**여야 뜻이 맞는다. 아래 716661 이
 *    그것이고, 글자가 없어 외국어 문제도 없다.
 *
 * ⚠️ 연구개발 사진은 볼피더 특징 1번(bowl-feeder-1, "공구 옆에 펼쳐 둔 기술
 *    도면")과 소재가 가깝다. 같은 사진은 아니고 — 이쪽은 **흑백 스케치 투상도**,
 *    저쪽은 컬러 도면에 공구가 얹힌 것이라 카드에서 구별된다. 다만 사이트에
 *    도면이 둘이라는 점은 알고 두는 것이다. 바꾼다면 이쪽을 먼저 본다.
 *
 * 사진을 바꾼 뒤에는:  npm run philosophy-photos
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const OUT_DIR = path.join(ROOT, "public", "images", "philosophy");

/** 카드 사진 칸이 16:9 다. 가장 클 때 317x178px 라 두 배쯤 받아 둔다. */
const WIDTH = 640;
const HEIGHT = 360;
const QUALITY = 72;

/** [출력 이름, Pexels id, 어떤 이념에 어떤 뜻으로 붙였는가] */
const PHOTOS = [
  ["welfare", 10016886, "사회복지 — 나무판에 가지런히 걸린 스패너. 오래 쓴 공구가 제자리에 있는 일터다"],
  ["rnd", 716661, "연구개발 — 컴퍼스와 함께 놓인 기계 부품 투상도(흑백). 건축 도면이 아니라 부품 도면이다"],
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const [out, id, why] of PHOTOS) {
    const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
    const res = await fetch(`${url}?auto=compress&cs=tinysrgb&w=1600`);
    if (!res.ok) {
      console.log(`  ! ${out}  HTTP ${res.status}  (id ${id})`);
      continue;
    }
    const input = Buffer.from(await res.arrayBuffer());

    const output = await sharp(input)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "center" })
      .webp({ quality: QUALITY })
      .toBuffer();

    await writeFile(path.join(OUT_DIR, `${out}.webp`), output);
    console.log(`  ${out}.webp  ${(output.length / 1024).toFixed(1)}KB  — ${why}`);
  }

  console.log(`경영이념 사진 ${PHOTOS.length}장을 저장했습니다.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
