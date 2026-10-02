import type { Metadata } from "next";
import Image from "next/image";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import {
  EQUIPMENT_GROUPS,
  equipmentByGroup,
  equipmentTotals,
  process,
} from "@/data/company";

export const metadata: Metadata = {
  title: "보유 설비",
  description: `밀링·선반·연마기·알곤 용접기 등 ${equipmentTotals.kinds}종 ${equipmentTotals.units}대. 유신 F.A 시스템은 볼 본체와 정렬 지그를 외주 없이 사내에서 직접 가공합니다.`,
};

export default function FacilityPage() {
  return (
    <>
      <PageHero
        eyebrow="EQUIPMENT"
        title="보유 설비"
        lead={`밀링·선반·용접기 등 ${equipmentTotals.kinds}종 ${equipmentTotals.units}대. 도면이 나오면 그다음은 전부 이 공장 안에서 진행됩니다.`}
      />

      {/* 공정별 설비 목록.

          배너 아래에 그룹별 합계만 보여 주는 요약 띠를 따로 두었다가 없앴다.
          바로 이 섹션이 같은 네 그룹을 또 보여 줘서, 한 화면 안에 "절삭 · 가공 /
          용접 / 연마 · 표면처리 / 운반 · 기타" 가 두 번 나왔다. 합계는 아래
          카드 제목 줄로 옮겼고, 총계는 배너 lead 가 이미 말한다. */}
      <Section
        eyebrow="BY PROCESS"
        title="공정별 보유 설비"
        lead="피더는 부품마다 새로 만드는 물건이라, 표준 부품을 사다 조립하는 방식으로는 끝나지 않습니다. 깎고 붙이고 다듬는 설비를 직접 갖춘 이유입니다."
      >
        {/* items-start: 항목 수가 다른 카드가 억지로 늘어나 빈 공간이 생기지 않게 한다 */}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {EQUIPMENT_GROUPS.map((group) => {
            const items = equipmentByGroup(group.key);
            const units = items.reduce((sum, item) => sum + item.count, 0);

            return (
              <div
                key={group.key}
                className="flex flex-col rounded-lg border border-line p-6 sm:p-7"
              >
                {/* 아래 품목 행과 같은 틀(이름 왼쪽 / 수 오른쪽)이라 그룹 합계가
                    품목 대수와 한 열로 선다. 합계를 품목보다 약하게 둔다 —
                    text-xs muted 대 text-sm bold navy. 합계가 개별 항목보다
                    세 보이면 위계가 뒤집힌다.
                    단위는 종 → 대 순서다. 배너 lead("21종 55대")와 맞춘다. */}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold text-ink">{group.title}</h3>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {items.length}종 {units}대
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {group.body}
                </p>
                <ul className="mt-5 border-t border-line">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-baseline justify-between gap-3 border-b border-line py-2.5"
                    >
                      <span className="text-sm text-ink-soft">{item.name}</span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-navy">
                        {item.count}대
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 설계 도면 */}
      <Section
        tone="surface"
        eyebrow="ENGINEERING"
        title="도면부터 직접 그립니다"
        lead="부품 샘플을 받으면 형상·재질·무게를 분석해 그 부품만을 위한 볼 형상과 정렬 지그를 새로 설계합니다."
      >
        <figure>
          <div className="overflow-hidden rounded-lg border border-line bg-white p-4 sm:p-8">
            <Image
              src="/images/blueprint.webp"
              alt="유신 F.A 시스템 설계부에서 작성한 피더 부품 가공 도면"
              width={1280}
              height={1024}
              className="mx-auto h-auto w-full max-w-3xl"
            />
          </div>
          <figcaption className="mt-4 text-xs leading-relaxed text-muted">
            설계부에서 작성한 가공 도면. 치수 공차와 표면 거칠기까지 지정해
            가공부로 넘어갑니다.
          </figcaption>
        </figure>
      </Section>

      {/* 제작 공정 */}
      <Section
        tone="navy"
        eyebrow="PROCESS"
        title="제작 공정"
        lead="부품 샘플 한 점에서 시작해 현장에서 도는 피더가 되기까지."
      >
        <ol className="grid gap-px overflow-hidden rounded-lg bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <li key={p.step} className="bg-navy-deep p-7 sm:p-8">
              <span className="text-3xl font-bold tabular-nums text-brand-light">
                {p.step}
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <ContactCTA />
    </>
  );
}
