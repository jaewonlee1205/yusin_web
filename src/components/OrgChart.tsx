import { organization } from "@/data/company";

/**
 * 조직도.
 *
 * 대표 아래로 영업마케팅부와 공장장이 나란히 서고(둘 다 대표 직속이라 같은
 * 층이다), 공장장 아래에 네 개 제작 부서가 붙는다.
 *
 * 마크업은 중첩 목록 하나뿐이다 — 계층을 ul/li 로 그대로 표현하고, 화면 폭에
 * 따른 두 모양은 CSS 로만 만든다. 전에는 데스크톱용과 모바일용 박스를 따로
 * 그려 영업마케팅부가 DOM 에 두 번 있었다(스크린리더가 두 번 읽었다).
 *
 *   모바일  왼쪽 세로선 + 들여쓰기 트리. 좁은 화면에 가로 트리를 욱여넣으면
 *           위계가 무너진다 — 전에는 영업마케팅부가 공장장 위에 와서 마치
 *           상위 조직처럼 읽혔다.
 *   lg      대표 직속 두 칸을 같은 폭으로 나눠 대표가 정확히 그 가운데에
 *           오게 한다. 네 부서는 공장장 칸 안에서 2x2 로 놓는다 — 한 줄로
 *           펼치면 공장장 칸이 한없이 넓어져 대표가 오른쪽으로 밀리고,
 *           칸을 반씩 나누면 카드가 135px 까지 좁아져 역할 설명이 깨진다.
 */
export default function OrgChart() {
  const { head, direct, plant } = organization;

  return (
    <div className="rounded-lg border border-line bg-surface p-6 sm:p-10">
      <ul>
        <li className="lg:flex lg:flex-col lg:items-center">
          <Node label={head} tone="brand" />

          <ul className={BRANCH}>
            {direct.map((name) => (
              <li key={name} className={`${BRANCH_ITEM} lg:flex lg:items-start lg:justify-center`}>
                <Node label={name} tone="navy" />
              </li>
            ))}

            <li
              className={`${BRANCH_ITEM} lg:flex lg:flex-col lg:items-center lg:justify-start`}
            >
              <Node label={plant.title} tone="navy" />

              {/* 공장장 -> 네 부서. lg 에서는 격자라 개별 연결선 대신
                  가운데로 내려오는 세로선 하나로 묶는다. */}
              <ul className={LEAF}>
                {plant.teams.map((team) => (
                  <li key={team.name} className={LEAF_ITEM}>
                    {/* 부서는 이름만으로 부족해 하는 일을 함께 적는다 */}
                    <div className="h-full rounded-lg border border-line bg-white p-4 sm:p-5 lg:text-center">
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
    </div>
  );
}

/** 모바일 들여쓰기 트리의 공통 뼈대 — 왼쪽 세로선과 안쪽 여백. */
const INDENT = "mt-3 space-y-3 border-l border-line pl-5";
/** 왼쪽 세로선에서 박스로 뻗는 짧은 가로선. 박스 첫 줄 높이에 맞춘다. */
const TICK =
  "relative before:absolute before:left-[-20px] before:top-7 before:h-px before:w-5 before:bg-line";

/** 대표 직속. lg 에서 두 칸을 같은 폭으로 나눈다. */
const BRANCH = `${INDENT} lg:mt-0 lg:grid lg:w-full lg:grid-cols-2 lg:gap-x-6 lg:space-y-0 lg:border-l-0 lg:pl-0 lg:pt-8`;

/**
 * 대표 직속 항목의 연결선.
 * lg 에서 before 는 위로 뻗는 세로선, after 는 대표 쪽으로 가는 가로선이다.
 * 왼쪽 칸은 오른쪽 절반만, 오른쪽 칸은 왼쪽 절반만 그어 둘이 대표 밑에서 만난다.
 */
const BRANCH_ITEM =
  `${TICK} lg:before:left-1/2 lg:before:top-[-32px] lg:before:h-8 lg:before:w-px ` +
  "lg:after:absolute lg:after:top-[-32px] lg:after:h-px lg:after:bg-line " +
  "lg:first:after:left-1/2 lg:first:after:right-[-12px] " +
  "lg:last:after:left-[-12px] lg:last:after:right-1/2";

/** 네 부서. lg 에서 2x2 격자이고, 위로 세로선 하나가 공장장까지 올라간다. */
const LEAF = `${INDENT} lg:relative lg:mt-0 lg:grid lg:w-full lg:grid-cols-2 lg:gap-3 lg:space-y-0 lg:border-l-0 lg:pl-0 lg:pt-8 lg:before:absolute lg:before:left-1/2 lg:before:top-0 lg:before:h-8 lg:before:w-px lg:before:bg-line`;

/** 부서 항목 — lg 에서는 격자로 묶여 있어 개별 연결선이 필요 없다. */
const LEAF_ITEM = `${TICK} lg:before:hidden`;

function Node({ label, tone }: { label: string; tone: "brand" | "navy" }) {
  const styles = {
    brand: "bg-brand text-white",
    navy: "bg-navy text-white",
  } as const;

  return (
    <div
      className={`inline-block whitespace-nowrap rounded-lg px-6 py-3 text-center text-sm font-bold ${styles[tone]}`}
    >
      {label}
    </div>
  );
}
