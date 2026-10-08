import Image from "next/image";
import type { ApplicationCase } from "@/data/products";
import Reveal from "./Reveal";

/**
 * 사진 있는 적용 분야 격자.
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
 * ⚠️ 카드에 이름만 있고 설명이 없다. 한때 두 줄짜리 설명이 붙어 블록이
 *    629px 를 먹었는데, 적용 분야는 제품 설명을 **돕는** 자리이지 주인공이
 *    아니다. 설명을 걷고 열을 셋에서 넷으로 늘려 395px 로 줄였다.
 *    되살리려면 products.ts 의 ApplicationCase 주석을 함께 볼 것.
 *
 * 열은 넷까지만 간다. 다섯으로 나누면 1280 에서 글상자가 173px 인데 가장 긴
 * 이름("수지 · 세라믹 등 깨지기 쉬운 부품")이 13px 로 184px 라 두 줄로
 * 접힌다 — 한 칸만 두 줄이 되면 그 카드만 길어져 아랫변이 어긋난다.
 * 넷이면 글상자가 228px 라 스무 개 이름이 모두 한 줄이다(실측).
 *
 * 분야 수는 제품마다 다르다(볼피더 5 · 진동기.컨트롤러.우레탄 3 ·
 * 직진피더.호퍼피더.방음커버 2). 격자로 4열을 고정하면 칸이 모자라도 자리가
 * 남아 구멍이 생긴다. 그래서 격자 대신 flex-wrap 을 쓰고 칸 폭을 basis 로
 * 준다 — 모자란 줄은 자리를 차지하지 않고 그냥 끝난다. 볼피더만 다섯이라
 * 둘째 줄에 한 칸이 서는데, 왼쪽 정렬이라 어색하지 않다.
 *
 * 왼쪽 정렬이다(flex 기본값). 한때 justify-center 로 모자란 줄을 가운데
 * 모았는데, 첫 카드가 184px 안으로 들어가 "적용 분야" 제목.제작 사양 표와
 * 선이 어긋났다. 왼쪽에 세우면 그 셋이 한 선에 선다.
 *
 * ⚠️ 칸 폭은 개수와 무관하다. 한동안 "둘 이하면 lg 에서도 2열" 로 두었는데,
 *    그러면 카드가 칸을 꽉 채워 호퍼피더.방음커버의 사진이 커졌다 — 같은
 *    자리의 같은 성격 사진이 제품에 따라 갈리면 안 된다.
 *
 *   폭      열   Container   카드   사진
 *   320     1       265      265   265x149
 *   640     2       560      272   272x153
 *   1024    3       944      304   304x171
 *   1280    4      1088      260   260x146
 *
 * 사진 칸은 16:9 다. 받아 둔 파일이 640x360 이라 object-cover 가 잘라 내는
 * 것이 없고, 1280 에서 260px 로 그리므로 2배 화면에서도 원본 안쪽이다
 * (한때 352px 라 오히려 원본에 빠듯했다).
 *
 * 링크가 아니다. 분야는 눌러서 갈 곳이 없다 — 카드 모양만 빌려 왔고 호버
 * 효과도 두지 않는다.
 */
/* 칸 폭. gap-4(1rem) 기준이라 2열은 간격 하나, 3열은 둘, 4열은 셋을 빼면
   폭이 정확히 맞아떨어진다. 개수에 기대지 않는 값이라 밖에 둔다. */
const BASIS =
  "basis-full sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)] xl:basis-[calc((100%-3rem)/4)]";

export default function ApplicationCases({
  cases,
}: {
  cases: ApplicationCase[];
}) {
  return (
    <ul className="mt-4 flex flex-wrap gap-4">
      {cases.map((c, i) => (
        <Reveal as="li" key={c.name} delay={i * 70} className={BASIS}>
          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
            {/* py-3 이다. 이름 한 줄이라 py-5 면 글보다 여백이 커진다. */}
            <p className="border-t border-line px-4 py-3 text-13 font-bold leading-snug text-ink">
              {c.name}
            </p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
