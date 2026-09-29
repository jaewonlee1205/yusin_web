/**
 * Next.js 16 static export 후처리 — 세그먼트 프리페치 404 제거.
 *
 * `output: "export"`로 빌드하면 Next가 라우트별 프리페치 페이로드를
 * 디렉터리 형태로 떨어뜨린다:
 *
 *   out/products/__next.products/__PAGE__.txt
 *   out/products/bowl-feeder/__next.products/$d$slug/__PAGE__.txt
 *
 * 그런데 브라우저는 같은 파일을 경로 구분자 대신 점으로 이은 이름으로 요청한다:
 *
 *   GET /products/__next.products.__PAGE__.txt                      -> 404
 *   GET /products/bowl-feeder/__next.products.$d$slug.__PAGE__.txt  -> 404
 *
 * 내비게이션 자체는 정상 동작하지만(프리페치 실패 시 전체 문서를 받는다),
 * 콘솔에 404가 쌓이고 Lighthouse Best Practices 점수가 깎인다.
 * 여기서 브라우저가 찾는 이름으로 사본을 하나 더 만들어 준다.
 *
 * Next가 경로 규칙을 바로잡으면 이 스크립트와 package.json의 postbuild를
 * 지우면 된다. (확인 방법: 지우고 빌드한 뒤 배포본에서 콘솔 404를 본다)
 */
import { readdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(fileURLToPath(import.meta.url), "../..", "out");

let copied = 0;

/** `__next.*` 디렉터리 안의 파일을 전부 찾아 상대 경로와 함께 돌려준다. */
async function collect(dir, prefix = []) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...(await collect(full, [...prefix, entry.name])));
    } else if (entry.isFile()) {
      found.push({ from: full, segments: [...prefix, entry.name] });
    }
  }
  return found;
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);

    if (entry.name.startsWith("__next.")) {
      // 중첩 깊이에 상관없이 경로를 점으로 이어 붙인다.
      // __next.products/$d$slug/__PAGE__.txt -> __next.products.$d$slug.__PAGE__.txt
      for (const { from, segments } of await collect(full)) {
        const flat = path.join(dir, [entry.name, ...segments].join("."));
        await copyFile(from, flat);
        copied += 1;
      }
      continue;
    }

    await walk(full);
  }
}

if (!existsSync(OUT)) {
  console.error(`out/ 디렉터리가 없습니다. 먼저 next build를 실행하세요.`);
  process.exit(1);
}

await walk(OUT);
console.log(`세그먼트 프리페치 파일 ${copied}개를 납작한 이름으로 복사했습니다.`);
