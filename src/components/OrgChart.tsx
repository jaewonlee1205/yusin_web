import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import { organization } from "@/data/company";

/**
 * 조직도.
 *
 * 대표 아래로 영업마케팅부와 공장장이 나란히 서고(둘 다 대표 직속이라 같은
 * 층이다), 각 아래에 팀이 붙는다. 두 갈래가 같은 모양이라 divisions 를 그냥
 * 순회한다.
 *
 * 마크업은 중첩 목록 하나뿐이다 — 계층을 ul/li 로 그대로 표현하고, 화면 폭에
 * 따른 두 모양은 CSS 로만 만든다.
 *
 *   모바일  왼쪽 세로선 + 들여쓰기 트리. 좁은 화면에 가로 트리를 욱여넣으면
 *           위계가 무너진다.
 *   lg      대표 직속 두 칸을 같은 폭으로 나눠 대표가 정확히 그 가운데에
 *           온다. 팀은 각 칸 안에서 2열로 놓는다.
 *
 * 애니메이션은 차트 전체를 Reveal 로 한 번 감싸고 안쪽은 CSS(.org-*)가 맡는다.
 * 노드마다 Reveal 을 씌우면 가로선이 끊겨 보인다 — 그 선은 두 칸의 ::after 가
 * 가운데에서 만나 하나로 보이는 것이라 서로 다른 지연으로 움직이면 어긋난다.
 */

/** 위에서 아래로 그어지는 순서(ms). 마지막 카드까지 약 0.9초. */
const STEP = {
  head: 0,
  headDrop: 120,
  span: 240,
  divisionDrop: 360,
  division: 420,
  teamDrop: 540,
  team: 620,
  teamGap: 60,
} as const;

/** CSS 변수를 style 로 넘기려면 캐스팅이 필요하다. */
const delay = (d: number, d2?: number) =>
  ({ "--d": `${d}ms`, ...(d2 === undefined ? {} : { "--d2": `${d2}ms` }) }) as CSSProperties;

export default function OrgChart() {
  const { head, divisions } = organization;

  return (
    <Reveal className="rounded-lg border border-line bg-surface p-6 sm:p-10">
      <ul>
        <li className="lg:flex lg:flex-col lg:items-center">
          <Node label={head} tone="brand" style={delay(STEP.head)} />

          <ul className={BRANCH} style={delay(STEP.headDrop)}>
            {divisions.map((division, di) => (
              <li
                key={division.title}
                className={`${BRANCH_ITEM} ${di === 0 ? "org-span-l" : "org-span-r"} lg:flex lg:flex-col lg:items-center lg:justify-start`}
                style={delay(STEP.divisionDrop, STEP.span)}
              >
                <Node
                  label={division.title}
                  tone="navy"
                  style={delay(STEP.division)}
                />

                {/* 갈래 -> 팀. lg 에서는 격자라 개별 연결선 대신 가운데로
                    내려오는 세로선 하나로 묶는다. */}
                <ul className={LEAF} style={delay(STEP.teamDrop)}>
                  {division.teams.map((team, ti) => (
                    <li key={team.name} className={LEAF_ITEM}>
                      {/* 팀은 이름만으로 부족해 하는 일을 함께 적는다 */}
                      <div
                        className="org-node h-full rounded-lg border border-line bg-white p-4 sm:p-5 lg:text-center"
                        style={delay(STEP.team + ti * STEP.teamGap)}
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
            ))}
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
 * 대표 직속. lg 에서 두 칸을 같은 폭으로 나눈다.
 *
 * pt 가 64px 인 이유 — 위 32px 은 대표에서 내려오는 세로선 자리(DROP),
 * 아래 32px 은 가로선에서 각 칸으로 내려가는 세로선 자리다. 그래야 대표
 * 아래가 ㅗ 모양이 된다.
 */
const BRANCH = `${INDENT} ${DROP} lg:mt-0 lg:grid lg:w-full lg:grid-cols-2 lg:gap-x-6 lg:space-y-0 lg:border-l-0 lg:pl-0 lg:pt-16`;

/**
 * 대표 직속 항목의 연결선.
 * lg 에서 before 는 위로 뻗는 세로선, after 는 대표 쪽으로 가는 가로선이다.
 * 왼쪽 칸은 오른쪽 절반만, 오른쪽 칸은 왼쪽 절반만 그어 둘이 대표 밑에서 만난다.
 */
const BRANCH_ITEM =
  `${TICK} org-drop lg:before:left-1/2 lg:before:top-[-32px] lg:before:h-8 lg:before:w-px ` +
  "lg:after:absolute lg:after:top-[-32px] lg:after:h-px lg:after:bg-line " +
  "lg:first:after:left-1/2 lg:first:after:right-[-12px] " +
  "lg:last:after:left-[-12px] lg:last:after:right-1/2";

/** 팀 목록. lg 에서 2열 격자이고, 위로 세로선 하나가 갈래까지 올라간다. */
const LEAF = `${INDENT} ${DROP} lg:mt-0 lg:grid lg:w-full lg:grid-cols-2 lg:gap-3 lg:space-y-0 lg:border-l-0 lg:pl-0 lg:pt-8`;

/** 팀 항목 — lg 에서는 격자로 묶여 있어 개별 연결선이 필요 없다. */
const LEAF_ITEM = `${TICK} lg:before:hidden`;

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
