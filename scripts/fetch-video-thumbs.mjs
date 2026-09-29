/**
 * 유튜브 썸네일을 받아 public/images/videos/<id>.webp 로 저장한다.
 *
 * 왜 받아 두나 — 정적 배포 사이트라 외부 요청이 하나라도 줄어드는 편이 낫고,
 * 무엇보다 방문자가 재생 버튼을 누르기 전까지는 유튜브에 아무 요청도 가지
 * 않게 된다. (VideoEmbed 가 썸네일만 먼저 보여 주고 클릭 시 iframe 을 끼운다)
 *
 * maxresdefault 를 쓴다. hqdefault 는 4:3 캔버스에 16:9 화면을 넣은 것이라
 * 위아래에 검은 띠가 있어 그대로 쓰면 영상이 레터박스처럼 보인다.
 *
 * 영상을 추가하거나 ID를 바꾼 뒤에는:  npm run video-thumbs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const VIDEOS_TS = path.join(ROOT, "src", "data", "videos.ts");
const OUT_DIR = path.join(ROOT, "public", "images", "videos");

/** 썸네일 저장 크기. 카드가 가장 커지는 곳이 640px 언저리라 그 두 배는 필요 없다. */
const WIDTH = 640;
const HEIGHT = 360;
const QUALITY = 72;

/**
 * 목록의 출처를 videos.ts 하나로 유지하려고 여기서 직접 파싱한다.
 * (.ts 라 그냥 import 할 수 없다)
 */
async function readVideoIds() {
  const source = await readFile(VIDEOS_TS, "utf8");
  const ids = [...source.matchAll(/\bid:\s*"([A-Za-z0-9_-]{11})"/g)].map(
    (m) => m[1]
  );
  if (ids.length === 0) {
    throw new Error(`${VIDEOS_TS} 에서 영상 ID를 하나도 찾지 못했습니다.`);
  }
  return [...new Set(ids)];
}

async function fetchThumb(id) {
  const url = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${id}: maxresdefault 를 받지 못했습니다 (HTTP ${res.status})`);
  }
  const buf = Buffer.from(await res.arrayBuffer());

  // 비공개·삭제된 영상은 회색 플레이스홀더가 200으로 내려온다. 크기로 걸러낸다.
  const meta = await sharp(buf).metadata();
  if (meta.width < 640) {
    throw new Error(
      `${id}: 썸네일이 ${meta.width}px 뿐입니다. 영상이 비공개이거나 삭제되지 않았는지 확인하세요.`
    );
  }
  return buf;
}

const ids = await readVideoIds();
await mkdir(OUT_DIR, { recursive: true });

for (const id of ids) {
  const buf = await fetchThumb(id);
  const out = path.join(OUT_DIR, `${id}.webp`);
  const info = await sharp(buf)
    .resize(WIDTH, HEIGHT, { fit: "cover" })
    .webp({ quality: QUALITY })
    .toFile(out);
  console.log(
    `${id}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)}KB`
  );
}

console.log(`\n썸네일 ${ids.length}개를 public/images/videos/ 에 저장했습니다.`);
