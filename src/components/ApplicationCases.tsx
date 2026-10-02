import Image from "next/image";
import type { ApplicationCase } from "@/data/products";
import Reveal from "./Reveal";

/**
 * 사진 있는 적용 분야 격자. 지금은 볼피더만 쓴다.
 *
 * 분야 이름만 적힌 칩으로는 "어떤 부품을 공급하는가" 가 와닿지 않아 사진을
 * 붙였다. 사진은 유신이 찍은 것이 아니라 어떤 부품인지 보여 주는 일반 산업
 * 사진이라, 격자 아래에 그 사실을 한 줄 적어 둔다 — 납품 사례로 읽히면
 * 안 된다. (출처는 scripts/fetch-application-photos.mjs 에 있다)
 *
 * 열은 셋까지만 간다. 다섯 칸이라 1280 에서 다섯으로 나누면 한 줄에 딱
 * 들어가지만, 그때 카드가 205px 이고 글상자가 171px 뿐이라 분야 이름이
 * 어떤 칸은 한 줄, 어떤 칸은 두 줄로 접혔다 — 다섯 장의 글 시작 높이가
 * 어긋난다. 셋으로 끊으면 어느 폭에서도 이름 한 줄, 설명 두 줄이다.
 * 대신 마지막 행에 한 칸이 빈다(목록 페이지도 일곱 장이라 같은 모양이다).
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
export default function ApplicationCases({
  cases,
}: {
  cases: ApplicationCase[];
}) {
  return (
    <>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c, i) => (
          <Reveal as="li" key={c.name} delay={i * 70}>
            <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col border-t border-line p-4">
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

      {/* 사진의 출처를 밝힌다. 유신 실물 사진을 받으면 이 줄을 지운다. */}
      <p className="mt-3 text-xs leading-relaxed text-muted">
        사진은 부품 종류를 보여 주는 예시이며, 실제 납품 사례가 아닙니다.
      </p>
    </>
  );
}
