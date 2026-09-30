import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import { organization } from "@/data/company";

/**
 * 조직도. 대표 -> 공장장 -> 다섯 부서로 내려가는 곧은 트리다.
 *
 * 마크업은 중첩 목록 하나뿐이다 — 계층을 ul/li 로 그대로 표현하고, 화면 폭에
 * 따른 두 모양은 CSS 로만 만든다.
 *
 *   모바일  왼쪽 세로선 + 들여쓰기 트리. 좁은 화면에 가로 트리를 욱여넣으면
 *           위계가 무너진다.
 *   lg      대표와 공장장이 가운데 한 줄로 내려오고, 다섯 부서가 그 아래
 *           가로로 펼쳐진다. 대표 밑이 한 갈래뿐이라 가로선 없이 세로선만
 *           내려온다(칸이 하나면 이을 형제가 없어 only 로 감춘다).
 *
 * 애니메이션은 차트 전체를 Reveal 로 한 번 감싸고 안쪽은 CSS(.org-*)가 맡는다.
 * 노드마다 Reveal 을 씌우면 가로선이 끊겨 보인다 — 그 선은 여러 칸의 ::after 가
 * 이어져 하나로 보이는 것이라 서로 다른 지연으로 움직이면 어긋난다.
 */

/** 위에서 아래로 그어지는 순서(ms). 마지막 카드까지 약 0.8초. */
const STEP = {
  head: 0,
  headDrop: 120,
  plant: 220,
  plantDrop: 340,
  span: 440,
  teamDrop: 540,
  team: 620,
  teamGap: 50,
} as const;

/** CSS 변수를 style 로 넘기려면 캐스팅이 필요하다. */
const delay = (d: number, d2?: number) =>
  ({
    "--d": `${d}ms`,
    ...(d2 === undefined ? {} : { "--d2": `${d2}ms` }),
  }) as CSSProperties;

export default function OrgChart() {
  const { head, plant } = organization;

  return (
    <Reveal className="rounded-lg border border-line bg-surface p-6 sm:p-10">
      <ul>
        <li className="lg:flex lg:flex-col lg:items-center">
          <Node label={head} tone="brand" style={delay(STEP.head)} />

          {/* 대표 -> 공장장. 칸이 하나뿐이라 가로선은 그려지지 않는다. */}
          <ul className={BRANCH} style={delay(STEP.headDrop)}>
            <li
              className={`${ITEM} lg:flex lg:flex-col lg:items-center`}
              style={delay(STEP.plantDrop)}
            >
              <Node label={plant.title} tone="navy" style={delay(STEP.plant)} />

              {/* 공장장 -> 다섯 부서 */}
              <ul className={BRANCH} style={delay(STEP.teamDrop)}>
                {plant.teams.map((team, i) => (
                  <li
                    key={team.name}
                    className={`${ITEM} ${i === 0 ? "org-span-l" : i === plant.teams.length - 1 ? "org-span-r" : "org-span-l"}`}
                    style={delay(STEP.teamDrop, STEP.span)}
                  >
                    {/* 부서는 이름만으로 부족해 하는 일을 함께 적는다 */}
                    <div
                      className="org-node h-full rounded-lg border border-line bg-white p-4 sm:p-5 lg:text-center"
                      style={delay(STEP.team + i * STEP.teamGap)}
                    >
                      <p className="text-base font-bold text-ink">
                        {team.name}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        {team.role}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </Reveal>
  );
}

/** 모바일 들여쓰기 트리의 공통 뼈대 — 왼쪽 세로선과 안쪽 여백. */
const INDENT = "mt-3 space-y-3 border-l border-line pl-5";
/** 왼쪽 세로선에서 박스로 뻗는 짧은 가로선. 박스 첫 줄 높이에 맞춘다. */
const TICK =
  "relative before:absolute before:left-[-20px] before:top-7 before:h-px before:w-5 before:bg-line";
/** lg 에서 부모 아래로 내려오는 세로선. 목록 위쪽 빈 자리(pt)를 지난다. */
const DROP =
  "org-drop lg:relative lg:before:absolute lg:before:left-1/2 lg:before:top-0 lg:before:h-8 lg:before:w-px lg:before:bg-line";

/**
 * 자식 목록. lg 에서 가로로 펼치고 칸을 균등하게 나눈다.
 *
 * pt 가 64px 인 이유 — 위 32px 은 부모에서 내려오는 세로선 자리(DROP),
 * 아래 32px 은 가로선에서 각 칸으로 내려가는 세로선 자리다. 그래야 부모
 * 아래가 ㅗ 모양이 된다.
 */
const BRANCH = `${INDENT} ${DROP} lg:mt-0 lg:flex lg:w-full lg:space-y-0 lg:border-l-0 lg:pl-0 lg:pt-16`;

/**
 * 항목과 연결선.
 * lg 에서 before 는 위로 뻗는 세로선, after 는 형제를 잇는 가로선이다.
 * 첫째는 오른쪽 절반, 마지막은 왼쪽 절반, 가운데는 전체를 긋고,
 * 혼자일 때(only)는 이을 형제가 없어 감춘다.
 */
const ITEM =
  `${TICK} org-drop lg:min-w-0 lg:flex-1 lg:px-1.5 ` +
  "lg:before:left-1/2 lg:before:top-[-32px] lg:before:h-8 lg:before:w-px " +
  "lg:after:absolute lg:after:top-[-32px] lg:after:h-px lg:after:bg-line " +
  "lg:first:after:left-1/2 lg:first:after:right-0 " +
  "lg:last:after:left-0 lg:last:after:right-1/2 " +
  "lg:[&:not(:first-child):not(:last-child)]:after:left-0 " +
  "lg:[&:not(:first-child):not(:last-child)]:after:right-0 " +
  "lg:only:after:hidden";

function Node({
  label,
  tone,
  style,
}: {
  label: string;
  tone: "brand" | "navy";
  style?: CSSProperties;
}) {
  const styles = {
    brand: "bg-brand text-white",
    navy: "bg-navy text-white",
  } as const;

  return (
    <div
      style={style}
      className={`org-node inline-block whitespace-nowrap rounded-lg px-6 py-3 text-center text-sm font-bold ${styles[tone]}`}
    >
      {label}
    </div>
  );
}
