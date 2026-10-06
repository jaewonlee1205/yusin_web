import Image from "next/image";
import type { ApplicationCase } from "@/data/products";
import Reveal from "./Reveal";

/**
 * 사진 있는 적용 분야 격자. 지금은 볼피더만 쓴다.
 *
 * 분야 이름만 적힌 칩으로는 "어떤 부품을 공급하는가" 가 와닿지 않아 사진을
 * 붙였다.
 *
 * ⚠️ 사진은 유신이 찍은 것이 아니다. 어떤 부품·어떤 자리인지 보여 주는 바깥
 *    산업 사진이고, 출처와 라이선스는 scripts/fetch-application-photos.mjs 에
 *    적어 두었다. 유신 실물 사진을 받으면 같은 이름으로 파일만 갈아 끼우면
 *    된다. (한때 격자 아래에 "실제 납품 사례가 아닙니다" 를 적어 두었는데
 *    빼 달라고 하셔서 지웠다 — 사실 자체는 이 주석과 README 에 남는다)
 *
 * 열은 셋까지만 간다. 다섯 칸이라 1280 에서 다섯으로 나누면 한 줄에 딱
 * 들어가지만, 그때 카드가 205px 이고 글상자가 171px 뿐이라 분야 이름이
 * 어떤 칸은 한 줄, 어떤 칸은 두 줄로 접혔다 — 다섯 장의 글 시작 높이가
 * 어긋난다. 셋으로 끊으면 어느 폭에서도 이름 한 줄, 설명 두 줄이다.
 *
 * 분야 수는 제품마다 다르다(볼피더 5 · 진동기.컨트롤러.우레탄 3 ·
 * 직진피더.호퍼피더.방음커버 2). 격자로 3열을 고정하면 칸이 모자라도 자리가
 * 남아 구멍이 생긴다. 그래서 격자 대신 flex-wrap 을 쓰고 칸 폭을 basis 로
 * 준다 — 모자란 줄은 자리를 차지하지 않고 그냥 끝난다.
 *
 * 왼쪽 정렬이다(flex 기본값). 한때 justify-center 로 모자란 줄을 가운데
 * 모았는데, 첫 카드가 184px 안으로 들어가 "적용 분야" 제목.제작 사양 표와
 * 선이 어긋났다. 왼쪽에 세우면 그 셋이 한 선에 선다.
 *
 * ⚠️ 칸 폭은 개수와 무관하다. 한동안 "둘 이하면 lg 에서도 2열" 로 두었는데,
 *    그러면 카드가 칸을 꽉 채워 호퍼피더.방음커버의 사진이 536x302 가 됐다 —
 *    셋 이상인 제품의 352x198 보다 면적이 2.3배다. 같은 자리의 같은 성격
 *    사진이 제품에 따라 갈리면 안 되고, 바로 위에 적은 "제품 사진보다 커서는
 *    안 된다" 는 기준도 깨진다. 분야가 둘이어도 352px 두 장을 왼쪽에 둔다.
 *
 *   폭      열   Container   카드   사진
 *   320     1       265      265   263x148
 *   640     2       560      272   271x152
 *   1024    3       944      304   303x170
 *   1280    3      1088      352   350x197
 *
 * 사진 칸은 16:9 다. 4:3 으로 두면 1280 에서 350x263 이 되어 제품 사진
 * (/products 265x199)보다 커진다 — 적용 분야는 제품 설명을 돕는 자리라
 * 그보다 커서는 안 된다. 16:9 면 197px 로 거의 같아진다. 받아 둔 파일도
 * 16:9 라 object-cover 가 잘라 내는 것이 없다.
 *
 * 링크가 아니다. 분야는 눌러서 갈 곳이 없다 — 카드 모양만 빌려 왔고 호버
 * 효과도 두지 않는다.
 */
/* 칸 폭. gap-4(1rem) 기준이라 2열은 간격 하나, 3열은 둘을 빼면 폭이 정확히
   맞아떨어진다. 개수에 기대지 않는 값이라 밖에 둔다. */
const BASIS =
  "basis-full sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]";

export default function ApplicationCases({
  cases,
}: {
  cases: ApplicationCase[];
}) {
  return (
    <ul className="mt-4 flex flex-wrap gap-4">
      {cases.map((c, i) => (
        <Reveal as="li" key={c.name} delay={i * 70} className={BASIS}>
          <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            {/* 위아래 여백을 같게 둔다. 한동안 아래만 40px 로 두 배였는데,
                설명이 두 줄로 끝나는 카드에서 그 아래가 빈 채로 남아 보였다. */}
            <div className="flex flex-1 flex-col border-t border-line px-4 py-5">
              <p className="text-sm font-bold leading-snug text-ink">
                {c.name}
              </p>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-soft">
                {c.note}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
