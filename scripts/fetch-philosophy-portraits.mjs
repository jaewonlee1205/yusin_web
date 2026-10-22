/**
 * 회사소개 "경영이념" 세 칸에 쓰는 **세로 사진**을 받아
 * public/images/philosophy/<이름>-portrait.webp 로 저장한다.
 *
 * ⚠️⚠️ **fetch-philosophy-photos.mjs 를 대신하지 않는다.** 그쪽이 만드는
 *    welfare.webp · rnd.webp(640x360)는 **그대로 둔다.** 이 스크립트는
 *    세로판 세 장을 **더할** 뿐이다. 되돌릴 일이 생기면 옛 파일이 그대로 있다.
 *
 * ── 왜 세로판이 필요한가 (2026-10-22 판 (43))
 *
 *    경영이념 패널이 **가로 3칸 카드**로 바뀌었다. 1280 에서 한 칸이
 *    **120.4 x 167**, 비율 **0.72 로 세로로 길다.** 그런데 16:9(비율 1.78)
 *    사진을 cover 로 넣으면 **세로를 맞추느라 좌우를 잘라** 가운데
 *    **41% 만** 남는다. 시안에서 연구개발 칸이 통째로 회색 면이 됐다.
 *
 *      칸 비율 0.72  <  사진 비율 1.78   ->  남는 가로 = 0.72/1.78 = 41%
 *
 *    ⚠️ cover 는 **모자란 축을 채우고 남는 축을 자른다.** 어느 축이 잘리는지는
 *       비율의 대소가 정한다 — 변수 이름이 아니라 수를 보고 판단할 것.
 *
 * ── 세 장을 고른 경위
 *
 *    welfare  #10016886  **원본이 1600x2133 세로 사진이었다.** 지금까지
 *                        640x360 으로 받아 가로 41% 만 쓰고 있었다. 세로로
 *                        받으면 96% 가 살아 공구판 전체가 보인다.
 *
 *    rnd      #716661    **사진을 바꾸지 않았다. 자르는 위치만 바꿨다.**
 *                        원본이 1600x900 가로라 세로 칸에서 41% 만 남는데,
 *                        하필 가운데가 가는 선뿐이라 회색 면이 됐다. 아홉
 *                        가지를 비교해(rcand.png) **왼쪽**을 쓰면 컴퍼스와
 *                        연필이 들어와 뜻이 산다는 것을 찾았다. 거기에
 *                        **대비를 세워(linear 1.4, -34)** 가는 도면 선을 띄운다.
 *                        ⚠️ 세로 원본으로 갈아타려고 네 장을 더 받아 봤지만
 *                           (7257156 흐림 · 36419261 녹색 점 · 5915147 계산기가
 *                           크다 · 4737237 공구판과 소재가 겹침) 전부 이만
 *                           못했다.
 *
 *    quality  #36003973  **새로 받은 한 장.** 마이크로미터가 금속판 두께를
 *                        재는 모습이다. 원본 1600x2396 세로라 100% 가 산다.
 *                        ⚠️ 함께 받아 본 #15598486(나사 피치 게이지)·
 *                           #34718932(게이지 핀)은 **눈금과 숫자가 자막 뒤에서
 *                           어수선해** 글이 묻혔다.
 *                        ⚠️ #5290119(「캘리퍼스와 컴퍼스」)는 **이미 방음커버
 *                           특징 3번이 쓰고 있다.** 측정 공구 사진이 둘이 되면
 *                           안 되어 뺐다.
 *                        ⚠️ 사람·손이 나온 후보(33712451 · 36003972 · 32845674)는
 *                           기존 둘과 톤이 어긋나 뺐다 — 경영이념 사진 둘은
 *                           모두 사물 클로즈업이다.
 *
 * 출처는 Pexels 다. Pexels License — 상업적 이용 가능, 출처 표기 의무 없음,
 * 사진 자체를 되파는 것만 금지(https://www.pexels.com/license/).
 *
 * ⚠️⚠️ 유신이 찍은 사진이 아니다. README 자료 요청 11번(공장 · 작업 현장
 *    사진)을 받으면 여기부터 갈아 끼운다 — 경영이념은 회사가 스스로를 말하는
 *    자리라 남의 공장 사진이 가장 어색한 곳이다.
 *
 * 사진을 바꾼 뒤에는:  npm run philosophy-portraits
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const OUT_DIR = path.join(ROOT, "public", "images", "philosophy");

/**
 * 칸이 가장 클 때가 **768**(패널이 전폭 704가 되어 한 칸 206.7px)이다.
 * 1280 에서는 120.4px 다. 두 배 해상도로 480 폭을 받아 둔다.
 * 높이는 1280 칸 비율(0.72)에 맞춘 667 — 768 에서는 칸이 가로로 길어져
 * **위아래가 잘리므로** 피사체가 가운데 오는 사진만 골랐다.
 */
const WIDTH = 480;
const HEIGHT = 667;
const QUALITY = 72;

/**
 * ── 채도를 왜 건드리는가
 *
 *    박고 나서 보니 **품질신뢰 칸만 튀어 보였다.** 그런데 평균 밝기를 재면
 *    셋 중 **가장 어둡다**(81.6 · 사회복지 91.4 · 연구개발 111.0). 밝기만
 *    봤으면 "문제 없다" 로 넘어갔을 것이다.
 *
 *    범인은 **채도**였다 —
 *
 *        사회복지   채도 17.3%   (녹슨 공구, 거의 무채색)
 *        연구개발   채도  0.0%   (흑백 스케치)
 *        품질신뢰   채도 47.0%   <- 파란 금속판이 둘 사이에서 혼자 튄다
 *
 *    ⚠️ **한 축만 재고 통과시키지 말 것.** 색은 밝기와 채도 두 축이다.
 *
 *    배수를 전수로 돌려 **결과**가 사회복지와 맞는 값을 찾았다(값을 맞추는
 *    것이 아니라 결과를 맞춘다) — 0.6 -> 32.1% · 0.4 -> 23.6% ·
 *    **0.25 -> 15.8%** · 0.2 -> 13.3%. 밝기는 어느 값에서도 안 변한다(81.9).
 */
/** [출력 이름, Pexels id, 크롭 위치, 대비 보정, 채도 배수, 무엇을 왜] */
const PHOTOS = [
  [
    "welfare-portrait",
    10016886,
    "center",
    false,
    1,
    "사회복지 — 나무판에 가지런히 걸린 스패너. 세로 원본이라 공구판 전체가 보인다",
  ],
  [
    "rnd-portrait",
    716661,
    "left",
    true,
    1,
    "연구개발 — 컴퍼스·연필과 함께 놓인 기계 부품 투상도. 왼쪽을 잘라 공구를 살렸다",
  ],
  [
    "quality-portrait",
    36003973,
    "center",
    false,
    0.25,
    "품질신뢰 — 마이크로미터로 금속판 두께를 재는 모습. 채도를 47% -> 15.8% 로",
  ],
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const [out, id, position, boost, sat, why] of PHOTOS) {
    const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
    const res = await fetch(`${url}?auto=compress&cs=tinysrgb&w=1600`);
    if (!res.ok) {
      console.log(`  ! ${out}  HTTP ${res.status}  (id ${id})`);
      continue;
    }
    const input = Buffer.from(await res.arrayBuffer());

    let pipe = sharp(input).resize(WIDTH, HEIGHT, { fit: "cover", position });
    // 가는 도면 선이 덮개(네이비 62%) 아래에서 바탕에 묻힌다 — 대비를 세운다
    if (boost) pipe = pipe.linear(1.4, -34);
    // 옆 칸들과 **채도**를 맞춘다. 위 주석의 전수 측정 참고
    if (sat !== 1) pipe = pipe.modulate({ saturation: sat });
    const output = await pipe.webp({ quality: QUALITY }).toBuffer();

    await writeFile(path.join(OUT_DIR, `${out}.webp`), output);
    console.log(`  ${out}.webp  ${(output.length / 1024).toFixed(1)}KB  — ${why}`);
  }

  console.log(`경영이념 세로 사진 ${PHOTOS.length}장을 저장했습니다.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
