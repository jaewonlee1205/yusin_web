import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import {
  EQUIPMENT_GROUPS,
  equipmentByGroup,
  equipmentTotals,
} from "@/data/company";

export const metadata: Metadata = {
  title: "보유 설비",
  // 여기는 기계 이름을 남긴다. 배너 lead 에서는 뺐지만(아래 참고) 검색 결과에서
  // "밀링" "선반" "연마기" "알곤 용접기" 는 실제로 찾는 말이라 키워드로 일한다.
  // 화면과 검색이 각자 할 일이 달라서 다른 것이니 도로 맞추지 않는다.
  description: `밀링·선반·연마기·알곤 용접기 등 ${equipmentTotals.kinds}종 ${equipmentTotals.units}대. 유신 F.A 시스템은 볼 본체와 정렬 지그를 외주 없이 사내에서 직접 가공합니다.`,
};

export default function FacilityPage() {
  return (
    <>
      {/* lead 에서 기계 이름 나열을 뺐다. 홈 '강점' 카드가 "밀링·선반·연마기·알곤
          용접기 등 21종 55대" 로 거의 같은 말을 하고, 바로 아래 섹션이 품목 21개를
          전부 이름으로 보여 준다 — 배너에서 미리 세 개를 꺼낼 이유가 없다.

          뒷문장도 "한 공장 안에서" 를 쓰지 않는다. 그 말은 홈 본문·홈 강점 01·
          조직도 검색 설명·이 페이지 검색 설명까지 네 곳이 이미 쓰고 있다.

          총계를 말하는 책임은 배너에 있다(아래 섹션 주석 참고). 그래서 숫자는
          남기고 equipmentTotals 에서 뽑는다.

          길이 주의 — 390px 에서 3줄이 되면 배너가 232 -> 258px 로 커져 다른
          페이지와 어긋난다. 이 문구는 390·768·1440 모두 2줄이다. */}
      <PageHero
        eyebrow="EQUIPMENT"
        title="보유 설비"
        lead={`설비 ${equipmentTotals.kinds}종 ${equipmentTotals.units}대. 도면이 나온 뒤로는 바깥으로 나가는 공정이 없습니다.`}
      />

      {/* 공정별 설비 목록.

          배너 아래에 그룹별 합계만 보여 주는 요약 띠를 따로 두었다가 없앴다.
          바로 이 섹션이 같은 네 그룹을 또 보여 줘서, 한 화면 안에 "절삭 · 가공 /
          용접 / 연마 · 표면처리 / 운반 · 기타" 가 두 번 나왔다. 합계는 아래
          카드 제목 줄로 옮겼고, 총계는 배너 lead 가 이미 말한다.

          lead 는 두지 않는다 — 표가 곧 설명이라 앞에 문장을 세울 자리가 없다.
          /company/vision 의 조직도 섹션과 /company 의 회사 개요 섹션이 같은
          이유로 lead 없이 eyebrow + title 만 둔다. */}
      <Section eyebrow="BY PROCESS" title="공정별 보유 설비">
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

      <ContactCTA />
    </>
  );
}
