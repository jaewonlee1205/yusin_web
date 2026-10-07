/**
 * 제품 상세 "제품 특징" 카드에 쓰는 사진을 받아
 * public/images/features/<slug>-<n>.webp 로 저장한다. 일곱 제품 28칸이다.
 *
 * ⚠️⚠️ 유신이 찍은 사진이 아니다. 적용 분야(fetch-application-photos.mjs)·공정
 *      사진(fetch-process-photos.mjs)과 같은 처지다.
 *
 *      ⚠️ **이 28장은 앞의 둘보다 연결이 약하다.** 특징이 "선별 · 방향 판별
 *         지그" "붙이거나 따로 둔다" 처럼 유신 고유 기술이라 꼭 맞는 스톡이
 *         아예 없다. 검색해 보면 "트랙.슈트" 는 철도 선로가, "우레탄 코팅" 은
 *         육상 트랙과 타이어가 나온다. 그래서 **특징이 다루는 소재나 동작**으로
 *         치환해 골랐다 — "네 가지 기본 볼 형상" 에 금속 그릇, "슈트 면을 직접
 *         다듬는다" 에 연마 불꽃 하는 식이다.
 *
 *         README 자료 요청 11번(공장 · 작업 현장 사진)을 받으면 **가장 먼저
 *         갈아 끼울 자리가 여기다.**
 *
 * 출처는 전부 Pexels 다. Pexels License — 상업적 이용 가능, 출처 표기 의무
 * 없음, 사진 자체를 되파는 것만 금지(https://www.pexels.com/license/).
 *
 * 고르는 기준은 앞의 두 스크립트와 같고 하나를 더했다.
 *  - 브랜드 로고.상호.외국어 라벨이 보이지 않을 것
 *  - 사람 얼굴이 없을 것(손끝은 괜찮다)
 *  - 다른 업종이 아닐 것
 *  - 피사체가 프레임을 채울 것 — 카드에서 255~313px 다
 *  - **적용 분야 19장.공정 4장과 겹치지 않을 것.** 같은 사진이 두 뜻을
 *    가리키면 둘 다 거짓이 된다. 아래 ID 는 전부 그 23장과 다르다.
 *  - **한 제품 안의 네 장이 서로 한눈에 구별될 것**
 *
 * ⚠️⚠️ **이 스크립트를 돌리면 영상 프레임 두 장이 스톡으로 되돌아간다.**
 *      bowl-feeder-4(볼 안에 세운 선별 지그)와 urethane-coating-4(우레탄을
 *      입힌 볼과 트랙)는 지금 유신 촬영 영상에서 뽑은 프레임이 덮고 있다
 *      (scripts/capture-video-frames.mjs). 파일 이름이 같아서다.
 *
 *      그러니 이 스크립트 뒤에는 반드시 한 번 더 돌린다:
 *        npm run feature-photos && npm run video-frames
 *
 *      ⚠️ 컨트롤러 · 호퍼피더 · 방음커버 12칸은 **영상으로 바꿀 수 없다.**
 *         원본 촬영본 넷이 전부 볼피더가 도는 장면이라 그 장비가 찍힌
 *         프레임이 아예 없다(README 자료 요청 8번).
 *
 * 사진을 바꾼 뒤에는:  npm run feature-photos
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const OUT_DIR = path.join(ROOT, "public", "images", "features");

/** 카드 사진 칸이 16:9 다. 가장 클 때 313x176px 라 두 배쯤 받아 둔다. */
const WIDTH = 640;
const HEIGHT = 360;
const QUALITY = 72;

/** [출력 이름, Pexels id, 어떤 특징에 어떤 뜻으로 붙였는가] */
const PHOTOS = [
  // ── 볼피더 ───────────────────────────────────────────────────────
  ["bowl-feeder-1", 5846174, "부품별 맞춤 볼 설계 — 공구 옆에 펼친 기술 도면"],
  ["bowl-feeder-2", 32297816, "네 가지 기본 볼 형상 — 금속 그릇이 겹쳐 만든 기하 패턴"],
  ["bowl-feeder-3", 35568191, "소형부터 대형까지 — 크기가 다른 볼베어링 매크로"],
  ["bowl-feeder-4", 28248457, "선별 · 방향 판별 지그 — 같은 자세로 줄 맞춘 황동 부품"],

  // ── 직진피더 ─────────────────────────────────────────────────────
  ["linear-feeder-1", 28752153, "부품 폭에 맞춘 슈트 — 깎아 낸 금속 부품 단면"],
  ["linear-feeder-2", 35686446, "독립 진동 제어 — 단독으로 놓인 포텐셔미터"],
  ["linear-feeder-3", 39584965, "라인 길이에 맞춘 크기 — 칸마다 크기가 다른 부품 보관대"],
  ["linear-feeder-4", 12684865, "슈트 면을 직접 다듬는다 — 금속을 갈 때 튀는 불꽃"],

  // ── 진동기 ───────────────────────────────────────────────────────
  ["vibrator-1", 7221094, "판스프링 진동 방식 — 스프링 코일 흑백 클로즈업"],
  ["vibrator-2", 36068829, "현장 튜닝 대응 — 0.5 눈금이 새겨진 금속 다이얼"],
  ["vibrator-3", 38166366, "전압까지 함께 조정 — 나란히 선 계기 바늘"],
  ["vibrator-4", 7568421, "진동부만 바꿔 단다 — 떼어 쌓아 둔 금속 기어"],

  // ── 호퍼피더 ─────────────────────────────────────────────────────
  ["hopper-feeder-1", 35686444, "센서 연동 자동 보충 — 초음파 센서 모듈"],
  ["hopper-feeder-2", 18471551, "무인 운전 — 사람 없이 도는 배선 설비"],
  ["hopper-feeder-3", 38575500, "소모량에 맞춘 용량 — 칸칸이 담긴 체결 부품"],
  ["hopper-feeder-4", 36564992, "라인과 함께 선다 — 제어반이 달린 자동화 설비"],

  // ── 방음커버 ─────────────────────────────────────────────────────
  ["soundproof-cover-1", 8425988, "15~20dB 소음 저감 — 검은 흡음 폼 결"],
  ["soundproof-cover-2", 19265071, "개폐형 구조 — 클램프로 여닫는 원통 장비"],
  /* ⚠️ 28231807 을 버렸다 — 캘리퍼스에 제조사 상호가 또렷해 기준에 걸렸다.
     이쪽은 공구가 여럿이라 한 브랜드가 두드러지지 않는다. */
  ["soundproof-cover-3", 5290119, "씌울 피더를 재서 만든다 — 캘리퍼스와 컴퍼스 등 측정 공구"],
  ["soundproof-cover-4", 12951633, "금속 부품 라인에 효과 — 쌓여 있는 금속 링"],

  // ── 컨트롤러 ─────────────────────────────────────────────────────
  ["controller-1", 39425448, "진동 세기 무단 조절 — 숫자가 새겨진 회전 노브"],
  ["controller-2", 18471565, "볼 · 직진 개별 제어 — 두 갈래로 나뉜 배선과 센서"],
  ["controller-3", 38697864, "붙이거나 따로 둔다 — 패널에 박힌 둥근 조작 버튼"],
  ["controller-4", 15770386, "스위치와 다이얼뿐 — 눈금 다이얼 둘만 있는 조작부"],

  // ── 우레탄 코팅 ──────────────────────────────────────────────────
  ["urethane-coating-1", 6587323, "충격 흡수 · 소음 저감 — 흡음 폼 단면 흑백"],
  ["urethane-coating-2", 39624844, "부품 손상 방지 — 미끄럼을 막는 고무 매트 결"],
  ["urethane-coating-3", 28179316, "샘플로 등급을 정한다 — 결이 다른 금속 링을 포개 둔 모습"],
  ["urethane-coating-4", 36564247, "트랙 · 슈트에도 입힌다 — 결이 고르게 덮인 검은 표면"],
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

  console.log(`특징 사진 ${PHOTOS.length}장을 저장했습니다.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
