import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
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

          뒷문장은 "도면이 나온 뒤로는 바깥으로 나가는 공정이 없습니다" 였다.
          뜻은 같지만 한 번 더 새겨야 읽힌다 — 거래처가 실제로 쓰는 말인
          "외주" 로 바꿨다.

          길이 주의 — 390px 에서 3줄이 되면 배너가 232 -> 258px 로 커져 다른
          페이지와 어긋난다. 이 문구는 390·768·1440 모두 2줄이다. */}
      <PageHero
        eyebrow="EQUIPMENT"
        title="보유 설비"
        lead={`설비 ${equipmentTotals.kinds}종 ${equipmentTotals.units}대. 가공부터 조립까지 외주 없이 끝냅니다.`}
      />

      {/* 공정별 설비 목록.

          배너 아래에 그룹별 합계만 보여 주는 요약 띠를 따로 두었다가 없앴다.
          바로 이 섹션이 같은 네 그룹을 또 보여 줘서, 한 화면 안에 "절삭 · 가공 /
          용접 / 연마 · 표면처리 / 운반 · 기타" 가 두 번 나왔다. 합계는 아래
          카드 제목 줄로 옮겼고, 총계는 배너 lead 가 이미 말한다.

          lead 는 두지 않는다 — 표가 곧 설명이라 앞에 문장을 세울 자리가 없다.
          /company/vision 의 조직도 섹션과 /company 의 회사 개요 섹션이 같은
          이유로 lead 없이 eyebrow + title 만 둔다.

          ⚠️⚠️ **2026-10-19 — 그 원칙을 카드 안에도 적용했다.** 공정마다
             한 줄씩 있던 설명("볼 본체와 정렬 지그를 도면대로 깎아
             냅니다." 등 넷)을 걷었다. 유신이 *"이런 문구는 삭제하자"* 라고
             했고, 칩을 선표로 바꾸고 나니 **제목 + 합계 + 표**만으로 카드가
             다 읽혀서 그 한 줄은 제목과 표를 떼어 놓기만 했다.

             ⚠️ **설명의 책임은 두 곳에 남는다** — 배너 lead("설비 21종
                55대. 가공부터 조립까지 외주 없이 끝냅니다.")와
                metadata.description(기계 이름을 검색 키워드로 남긴 자리).
                쪽의 글이 네 문장 얇아졌으니 그 둘을 걷을 때 함께 본다.

             ⚠️ 글은 **company.ts 의 EQUIPMENT_GROUPS[].body 에 그대로
                남아 있다**(화면에 안 나올 뿐이다). 되살리려면 아래 합계 줄
                바로 밑에 <p className="mt-2 text-sm leading-relaxed
                text-muted"> 를 되돌리면 된다. */}
      <Section eyebrow="BY PROCESS" title="공정별 보유 설비">
        {/* 그룹마다 가로로 펼친 밴드를 쌓는다. 두 열 카드였을 때는 품목 수가
            9/3/5/4 로 달라 같은 행의 높이가 245px 까지 어긋났다(절삭·가공 505 대
            용접 260). items-start 를 빼서 늘려 봤더니 용접 카드 안에 274px 짜리
            빈 공간이 생겨 더 나빴다 — /company/page.tsx:95 주석도 같은 이유로
            stretch 를 피한다.

            나란히 놓이는 칸이 없으면 높이가 어긋날 일 자체가 없다. 밴드가
            세로로만 쌓이므로 간격도 저절로 균일하다.

            그룹 순서는 바꾸지 않는다 — company.ts:174 주석대로 절삭→용접→연마
            →운반이 실제 공정 흐름이고 조직도 가공부 칩과도 짝이 맞는다. */}
        {/* ⚠️ 한때 밴드마다 `Reveal delay={i * 80}` 이었다(80ms 는 이 사이트
               카드 격자의 관례였다). 2026-10-19 에 **격자 하나당 리빌 하나**로
               바꿨다 — 사이트 전체가 같은 규칙이다. */}
        <Reveal>
        <div className="grid gap-4">
          {EQUIPMENT_GROUPS.map((group) => {
            const items = equipmentByGroup(group.key);
            const units = items.reduce((sum, item) => sum + item.count, 0);

            return (
              <div
                key={group.key}
                className="rounded-2xl bg-white p-6 shadow-card sm:p-7"
              >
                {/* 아래 품목 행과 같은 틀(이름 왼쪽 / 수 오른쪽)이라 그룹 합계가
                    품목 대수와 한 열로 선다. 합계를 품목보다 약하게 둔다 —
                    **text-xs(12px) muted 대 text-15 ink**. 합계가 개별
                    항목보다 세 보이면 위계가 뒤집힌다.
                    ⚠️ 한때 "text-xs muted 대 text-sm bold ink" 라고 적혀
                       있었다. 품목 대수가 칩에서 선표로 가며 text-sm
                       font-semibold → text-15 regular 이 됐다 — **위계는
                       그대로지만 수치가 달라졌다.**
                    단위는 종 → 대 순서다. 배너 lead("21종 55대")와 맞춘다.

                    ⚠️ 이 줄 **바로 아래**가 공정 설명 <p> 자리였다. 2026-10-19
                       에 걷었다(위 섹션 주석 참고). dl 의 mt-5 는 그대로 둔다 —
                       제목이 자기 표에 바짝 붙어 **캡션처럼** 서는 것이
                       맞는 모양이다(카드 p-6 의 24px 보다 좁은 것이 의도다). */}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-bold text-ink">{group.title}</h3>
                  <span className="shrink-0 text-xs tabular-nums text-muted">
                    {items.length}종 {units}대
                  </span>
                </div>
                {/* ⚠️⚠️⚠️ **2026-10-19 — 칩을 걷고 선표로 갔다.** 유신이
                       *"공정별 보유 설비 여기 표로 안되어 있다 보니깐 보기
                       불편해서"* · *"[회사 개요] 여기 표 디자인 스타일 동일하게
                       해서 표로 하고 싶어"* 라고 했다.

                    맞는 말이었다 — flex-wrap 칩은 **이름도 대수도 행마다 다른
                    x 에 선다.** 아래로 훑을 세로선이 없어 "무엇이 몇 대인지" 를
                    견줄 수가 없었다.

                    이 표는 사이트의 **네 번째 선표**다. 토큰(13px bold muted
                    라벨 / 15px ink 값 / gap-4 / py-4 / border-line)은 앞 셋과
                    글자 하나까지 같다 —

                      company/page.tsx         (OVERVIEW)        카드 밖
                      location/page.tsx        (연락처)          카드 안  <- 여기와 같은 조건
                      products/[slug]/page.tsx (SPECIFICATIONS)  카드 밖

                    공통 컴포넌트로 빼지 않는 까닭은 location/page.tsx:415 가
                    이미 적어 두었다 — "조건이 다르다 … 그 둘은 그대로 둔다."

                    ⚠️ **w-20 이 모든 폭에서 고정이다**(앞 셋은 w-16 sm:w-20).
                       설비명이 13px bold 로 **75.4px** 라 w-16(64px)에 안
                       들어간다(스포트 용접기 · 탁상 그라인더 75.4, 다음이
                       2호 범용 밀링 74.8). **80px 천장은 그대로 지킨다** —
                       연락처 표 주석의 "사업자등록번호(84px)는 못 들어간다"
                       와 같은 선이다. 설비명을 길게 바꿀 때 이 80px 를 먼저 본다.

                    ⚠️ **열 수는 재서 정했다.** 한 칸에 필요한 최소폭이
                       80(라벨) + 16(gap-4) + 30.5("10대" 15px tabular)
                       = **126.5px** 다.

                       아래는 **전부 실측**이다(카드 안쪽 = dl 폭).

                         폭     카드 안쪽   2열 한 칸   3열 한 칸   쓰는 것
                         1440   1032       492        **312**     3열
                         1280   1032       492        **312**     3열
                         1024    889       420        **264**     3열
                          768    633       **300**    189         2열
                          640    505       **236**    141         2열
                          390    287       135.5      -           1열
                         **360   257       120.5**    -           1열
                          320    217       100.5      -           1열

                       그래서 sm(640)부터 2열 · lg 부터 3열이고 그 아래는
                       1열이다.
                       ⚠️ **640 이 2열의 가장 빠듯한 점**인데 한 칸 236px 에
                          여유가 118px 다 — 넉넉하다.
                       ⚠️ **360 에서 2열이 깨진다**(120.5 < 126.5). r176 이
                          재는 열다섯 크기에 360x740 이 들어 있다 — 거기서
                          깨지면 안 된다. 그래서 sm 아래로는 2열을 쓰지 않는다.
                       ⚠️ Container 안쪽이 1088px 에서 멈추므로 1280 과 1440 은
                          같은 값이다. 더 넓어져도 안 바뀐다.

                    ⚠️ **tabular-nums 를 빼지 말 것.** 대수가 세로로 21개
                       쌓이는데 "10대" 만 30.5px 이고 나머지는 22.1px 라
                       그 행만 튄다.

                    ⚠️ **pt-5 를 걷었다.** border-t 아래 첫 행에 py-4 가 또
                       붙어 윗여백만 36px 이 됐다. 회사 개요처럼 border-t 만 둔다.

                    ⚠️ 마지막 행이 덜 차면 **바닥 선이 중간에서 끊긴다.** 3열
                       에서 절삭 9개는 3행 딱 맞지만 연마 5개 · 운반 4개는
                       아니다. 거슬리면 그룹마다 열 수를 달리하지 말고
                       **전체를 lg:grid-cols-2 로** 내린다 — 그룹마다 다르면
                       더 어지럽다.

                    ⚠️ **모바일이 길어진다.** 390 에서 칩 목록이 492px
                       (173/93/133/93)이던 것이 선표로 **1204px**
                       (515/172/287/230)이 됐다. 쪽 전체는 2903 → **3616px**
                       (+713 · +24.6%)다. 훑기를 얻은 대가다.

                 ── 아래는 칩이던 때의 기록이다. **지우지 않는다** — 되돌릴
                    일이 있으면 그때 근거가 여기 남아 있다.

                  · 품목 하나를 칩 한 덩어리로 묶었다.
                  · 전에는 격자 칸마다 justify-between 으로 대수를 오른쪽 끝에
                    붙였는데, 그러면 이름 길이에 따라 이름과 숫자 사이가
                    131~187px(8가지)로 벌어져 행마다 눈이 건너는 거리가
                    달라진다. 같은 함정을 회사 개요표가 먼저 겪고 적어 뒀다
                    (company/page.tsx:166 "값 시작점이 행마다 달라져 훑기가
                    어려워진다"). 숫자를 이름 옆에 붙이면 건널 거리가 아예
                    없어져 정렬선이 필요 없다.
                    ⚠️ **이 말은 지금도 맞다.** 고정폭 라벨은 같은 생각을 한
                       단계 더 민 것이다 — 이름 시작점과 대수 시작점이 **둘 다**
                       모든 행에서 같아진다.
                  · 테두리는 두지 않았다. 채움만으로 덩어리가 서는데 선을 21개
                    더하면 밴드 테두리와 경쟁한다. 대수도 굵게 하지 않았다 —
                    굵은 네이비 숫자 21개가 한 화면에서 시선을 21군데로 끌었다.
                    ⚠️ 선표에서는 그 걱정이 뒤집힌다. 선이 21개 **있어야**
                       행이 서고, 대수는 15px regular 로 더 얌전해졌다.
                  · 열 수를 정할 필요가 없었다. flex-wrap 이 접어 주고, 가장
                    넓은 칩이 136px 라 320px 에서도 한 줄에 들어갔다. */}
                <dl className="mt-5 grid border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-12">
                  {items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-4 border-b border-line py-4"
                    >
                      <dt className="w-20 shrink-0 text-13 font-bold text-muted">
                        {item.name}
                      </dt>
                      <dd className="text-15 leading-relaxed tabular-nums text-ink">
                        {item.count}대
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
        </Reveal>
      </Section>

      <ContactCTA />
    </>
  );
}
