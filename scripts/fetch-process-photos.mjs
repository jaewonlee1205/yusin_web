/**
 * 홈 PROCESS "문의부터 납품까지" 카드에 쓰는 공정 사진을 받아
 * public/images/process/<step>.webp 로 저장한다. 네 단계다.
 *
 * ⚠️⚠️ 유신이 찍은 사진이 아니다. 적용 분야 사진(fetch-application-photos.mjs)과
 *      같은 처지다 — 그쪽은 "이런 부품을 다룬다" 는 일반 사진이고 이쪽은
 *      "이런 공정을 거친다" 는 일반 사진이다. 유신 공장을 찍은 것이 아니므로
 *      **공장 전경이나 설비 전체가 보이는 사진은 고르지 않았다.** 날 끝, 자,
 *      캘리퍼스처럼 공정을 나타내는 클로즈업만 쓴다.
 *
 *      README 자료 요청 11번(공장 · 작업 현장 사진)을 받으면 아래 목록을 지우고
 *      같은 파일 이름으로 갈아 끼우면 된다 — 데이터(company.ts)는 경로만 보므로
 *      고칠 것이 없다.
 *
 * 출처는 전부 Pexels 다. Pexels License — 상업적 이용 가능, 출처 표기 의무
 * 없음, 사진 자체를 되파는 것만 금지(https://www.pexels.com/license/).
 * 그래도 추적할 수 있게 사진마다 원본 페이지를 적어 둔다.
 *
 * 고르는 기준은 적용 분야 쪽 다섯 가지를 그대로 쓰고 둘을 더했다.
 *  - 브랜드 로고.상호.외국어 라벨이 보이지 않을 것
 *  - 사람 얼굴이 없을 것(손끝은 괜찮다)
 *  - 다른 업종이 아닐 것
 *  - 네 장이 서로 한눈에 구별될 것
 *  - 피사체가 프레임을 채울 것 — 카드가 좁아(1280 에서 사진 212px) 멀리서
 *    찍은 공장 전경은 그 크기에서 무엇인지 읽히지 않는다
 *  - **CNC 가 두드러진 사진은 피할 것.** 유신 설비는 범용 밀링.선반이다
 *    (company.ts 의 equipment 21종). 최신 CNC 전경을 쓰면 과장이 된다.
 *  - **적용 분야 19장과 겹치지 않을 것.** 같은 사진이 홈과 제품 상세에서 서로
 *    다른 뜻을 가리키면 둘 다 거짓이 된다.
 *
 * 사진을 바꾼 뒤에는:  npm run process-photos
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const OUT_DIR = path.join(ROOT, "public", "images", "process");

/** 카드 사진 칸이 16:9 다. 가장 클 때 212x119px 라 세 배쯤 받아 둔다. */
const WIDTH = 640;
const HEIGHT = 360;
const QUALITY = 72;

const PHOTOS = [
  {
    out: "01-receive",
    // https://www.pexels.com/photo/16630111/  작업대 위 금속 캘리퍼스
    // 01 "부품 접수 · 분석" — 받은 샘플을 재는 장면이다.
    url: "https://images.pexels.com/photos/16630111/pexels-photo-16630111.jpeg",
    position: "center",
  },
  {
    out: "02-design",
    // https://www.pexels.com/photo/38908429/  금속 자가 놓인 기술 도면
    // 02 "설계" — 원통 형상의 관입을 그린 **기계 도면**이다(Φ120 · M10 치수가
    // 보인다). 후보 중 건축 평면도가 압도적으로 많았는데 전부 버렸다 — 피더를
    // 만드는 회사라 도면이 기계여야 뜻이 맞는다.
    //
    // ⚠️ 표제가 독일어다("Durchdringungen an zylindrischen Werkstücken").
    //    기준상 외국어 라벨은 피하는 것이 맞지만, 카드에서 사진이 212px 라
    //    그 크기에서는 글자가 읽히지 않는 것을 그려서 확인했고, 글자 없는
    //    대안(6615086 · 4134179)이 전부 건축 도면이라 내용을 택했다.
    //    기계 도면이면서 글자가 없는 것을 찾으면 그때 바꾼다.
    url: "https://images.pexels.com/photos/38908429/pexels-photo-38908429.jpeg",
    position: "center",
  },
  {
    out: "03-machining",
    // https://www.pexels.com/photo/8865189/  금속을 절삭 중인 밀링 날
    // 03 "가공 · 조립" — 날 끝과 칩이 보이는 클로즈업이다.
    url: "https://images.pexels.com/photos/8865189/pexels-photo-8865189.jpeg",
    position: "center",
  },
  {
    out: "04-tuning",
    // https://www.pexels.com/photo/7480242/  렌치로 기계를 조이는 두 손
    // 04 "튜닝 · 납품" — 실부품으로 맞추고 현장에 세우는 단계다.
    //
    // ⚠️ 처음 고른 20821358 을 버렸다. 같은 조정 장면이지만 작업 장갑에
    //    브랜드 로고가 또렷해 기준("브랜드 로고.상호가 보이지 않을 것")에
    //    걸렸다. 이 사진은 맨손이라 그 문제가 없고, 기계 위에서 렌치를 쓰는
    //    구도가 더 분명하다.
    url: "https://images.pexels.com/photos/7480242/pexels-photo-7480242.jpeg",
    position: "center",
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const photo of PHOTOS) {
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

  console.log(`공정 사진 ${PHOTOS.length}장을 저장했습니다.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
