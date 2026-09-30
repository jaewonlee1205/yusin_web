import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import { organization } from "@/data/company";

/**
 * 조직도. 대표 -> 공장장 -> 다섯 부서 -> 부서별 담당 업무로 내려가는 트리다.
 *
 * 마크업은 중첩 목록 하나뿐이다 — 계층을 ul/li 로 그대로 표현하고, 화면 폭에
 * 따른 두 모양은 CSS 로만 만든다.
 *
 *   모바일  왼쪽 세로선 + 들여쓰기 트리. 좁은 화면에 가로 트리를 욱여넣으면
 *           위계가 무너진다. 업무까지 네 단이 되지만 세로로 읽는 화면이라
 *           그대로 이어 간다.
 *   lg      대표와 공장장이 가운데 한 줄로 내려오고, 다섯 부서가 그 아래
 *           가로로 펼쳐진다. 대표 밑이 한 갈래뿐이라 가로선 없이 세로선만
 *           내려온다(칸이 하나면 이을 형제가 없어 only 로 감춘다).
 *           업무는 부서 아래로 세로로 쌓인다 — 형제를 잇는 가로선이 없다.
 *
 * 애니메이션은 차트 전체를 Reveal 로 한 번 감싸고 안쪽은 CSS(.org-*)가 맡는다.
 * 노드마다 Reveal 을 씌우면 가로선이 끊겨 보인다 — 그 선은 여러 칸의 ::after 가
 * 이어져 하나로 보이는 것이라 서로 다른 지연으로 움직이면 어긋난다.
 */

/**
 * 위에서 아래로 그어지는 순서(ms).
 *
 * 마지막 업무 네모가 960ms 에 시작해 0.45s 동안 올라오므로 전체가 끝나는
 * 시각은 약 1.4초다. 3단이 붙으면서 부서 카드 간격(teamGap)을 50 에서 35 로
 * 줄였다 — 그러지 않으면 카드만으로 이미 1.27초를 쓴다.
 */
const STEP = {
  head: 0,
  headDrop: 120,
  plant: 220,
  plantDrop: 340,
  span: 440,
  teamDrop: 540,
  team: 620,
  teamGap: 35,
  /** 다섯 부서의 짧은 세로선은 한꺼번에 그어진다. */
  taskDrop: 820,
  task: 880,
  /**
   * 업무는 **행 단위**로 나온다 — 다섯 칸의 첫째 네모가 같이, 그다음 둘째가
   * 같이. 칸마다 누적시키면 15번이 쌓여 지나치게 길어지고, 세로로 쌓인 것을
   * 세로로 또 훑는 움직임이라 읽는 방향과 싸운다.
   */
  taskGap: 40,
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
                    className={`${ITEM} ${i === plant.teams.length - 1 ? "org-span-r" : "org-span-l"}`}
                    style={delay(STEP.teamDrop, STEP.span)}
                  >
                    {/* 부서는 이름만 담는다 — 하는 일은 아래 3단으로 내려갔다.
                        h-full 을 주지 않는다. 그걸 주면 카드가 아래 업무 목록까지
                        포함한 칸 전체 높이를 먹어 안이 텅 빈 채 길쭉해진다.
                        다섯 칸 모두 이름 한 줄이라 높이는 저절로 맞는다. */}
                    <div
                      className="org-node rounded-lg border border-line bg-white p-4 text-base font-bold text-ink sm:p-5 lg:text-center"
                      style={delay(STEP.team + i * STEP.teamGap)}
                    >
                      {team.name}
                    </div>

                    {/* 부서 -> 담당 업무. --d 는 CSS 변수라 상속되므로 ul 과
                        네모에 각각 다시 준다 — 안 그러면 위 li 의 값(teamDrop)을
                        물려받아 다섯 칸이 한꺼번에 그려진다. */}
                    <ul className={TASKS} style={delay(STEP.taskDrop)}>
                      {team.tasks.map((task, j) => (
                        <li
                          key={task}
                          className={TASK}
                          style={delay(STEP.task + j * STEP.taskGap)}
                        >
                          {task}
                        </li>
                      ))}
                    </ul>
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

/**
 * 업무 목록(3단). INDENT/ITEM 을 재사용하지 않는다.
 *
 *   모바일  들여쓰기 트리를 한 단 더 파지 않고, 부서 카드 바로 아래 칩 세 개가
 *           한 줄로 놓인다. 세로로 쌓으면 15개가 줄줄이 늘어서 조직도가
 *           스크롤 긴 목록이 된다(실측 390px 에서 차트만 1215px). 세 항목은
 *           서로 순서도 위계도 없는 평평한 집합이라 가로 행이 정직하기도 하다.
 *           위계는 "부서 칸 안, 카드 바로 밑" 이라는 자리가 이미 말해 준다.
 *   lg      세로로 쌓이고 부서 카드에서 세로선 하나가 내려온다.
 *
 * pt 가 BRANCH 의 64px 이 아니라 32px 인 이유 — 여기는 형제를 잇는 가로선 단이
 * 없어서, 부서 카드에서 내려오는 세로선 자리 32px 만 있으면 된다. lg:pt-* 와
 * DROP 의 before:h-* 는 항상 짝으로 움직여야 한다.
 */
const TASKS = `${DROP} mt-2.5 flex flex-wrap gap-1.5 lg:mt-0 lg:flex-col lg:flex-nowrap lg:pt-8`;

/**
 * 업무 네모. li 에 바로 준다 — 래퍼 div 가 필요 없다.
 * 부서 카드와의 위계는 배경색이 아니라 크기·글자로 낸다. 차트 껍데기가
 * bg-surface 라 여기서 bg-surface 를 쓰면 배경에 묻힌다.
 */
const TASK =
  "org-node rounded border border-line bg-white px-2.5 py-1.5 " +
  "text-xs leading-normal text-ink-soft lg:py-2 lg:text-center";

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
