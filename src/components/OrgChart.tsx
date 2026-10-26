import type { CSSProperties } from "react";
import Reveal from "./Reveal";
import { organization } from "@/data/company";

/**
 * 조직도. 대표 -> 공장장 -> 다섯 부서 -> 부서별 담당 업무로 내려가는 트리다.
 *
 * 마크업은 중첩 목록 하나뿐이다 — 계층을 ul/li 로 그대로 표현하고, 화면 폭에
 * 따른 두 모양은 CSS 로만 만든다.
 *
 *   모바일  대표와 공장장이 **가로로 한 줄**, 그 아래 부서가 세로로 쌓이고
 *           업무는 **2열 격자**로 놓인다. 업무를 한 줄에 하나씩 세우면
 *           조직도가 스크롤 긴 목록이 된다(판 (70) 실측 390px 에서 835px).
 *           2열이면 623px 로 떨어진다.
 *   lg      대표와 공장장이 가운데 한 줄로 내려오고, 다섯 부서가 그 아래
 *           가로로 펼쳐진다. 대표 밑이 한 갈래뿐이라 가로선 없이 세로선만
 *           내려온다. 업무는 부서 이름 아래로 세로로 쌓인다.
 *
 * ⚠️⚠️ **2026-10-26 판 (74) — 상자를 걷고 선과 글자만 남겼다.**
 *   유신: *"너무 큰데 텍스트는 엄청 작은데 여백은 너무 크게 … 기존 조직도
 *   보다 훨씬 더 안좋다"* 라는 지적에서 시작해 판 (70)~(74) 를 거쳤다.
 *   바뀐 것 —
 *     ⓐ **업무 네모 열다섯과 부서 카드 다섯을 걷었다.** 상자는 대표·공장장
 *        둘만 남는다(22개 -> 2개). 부서는 **이름 + 2px 네이비 밑선**,
 *        업무는 **14px 글자 목록**이다. 회사개요 표와 같은 언어(선 + 글자)라
 *        쪽 안에서 겉돌지 않는다.
 *     ⓑ **업무 글자를 12px -> 14px 로 키웠다.** 칸 높이 ÷ 글자가 2.9 에서
 *        2.5 가 된다. 판 (69) 가 「크고 비었다」였던 까닭이 이 비가 5.0 까지
 *        간 것이었다.
 *     ⓒ **세로 칸 구분선은 업무 쪽에만** 둔다. 부서 이름 옆에 선이 있으면
 *        이름이 칸에 갇히고, 2px 네이비 밑선과 만나 **십자 교차가 넷** 난다.
 *     ⓓ **마지막 업무 아래를 닫는다.** 닫지 않으면 업무가 둘뿐인 튜닝부는
 *        빈 자리에 세로선만 덩그러니 남는다. 세로선도 그 끝선에서 끝난다
 *        (목록에 flex 를 주지 않는 이유다 — 주면 선이 바닥까지 내려간다).
 *     ⓔ **빈 칸을 만들지 않는다.** 다섯 칸을 모두 네 줄로 맞추려고 빈 행을
 *        선으로 채운 안도 있었지만, 유신: *"밑에 아무것도 텍스트 없는 공백을
 *        만드는게 아니라"*. 업무 수가 3/4/3/2/3 이라 끝선 높이는 칸마다
 *        다르다(계단) — 그것이 맞다고 고르셨다.
 *
 * 애니메이션은 차트 전체를 Reveal 로 한 번 감싸고 안쪽은 CSS(.org-*)가 맡는다.
 * 노드마다 Reveal 을 씌우면 가로선이 끊겨 보인다 — 그 선은 여러 칸의 ::after 가
 * 이어져 하나로 보이는 것이라 서로 다른 지연으로 움직이면 어긋난다.
 */

/**
 * 위에서 아래로 그어지는 순서(ms).
 *
 * 끝나는 시각은 **가장 칸이 많은 부서**가 정한다. 지금은 설계부가 네 칸이라
 * 마지막 줄이 task + 3 × taskGap = 1000ms 에 시작하고, 0.45s 동안 올라오므로
 * 전체가 약 1.45초에 끝난다. 부서 칸을 더 늘리면 이 수치도 같이 늘어난다.
 *
 * ⚠️ 판 (74) 에서 업무 네모가 글자 목록이 되면서 taskDrop(부서 카드에서
 *    업무로 내려오던 세로선)이 사라졌다 — 그 자리를 **부서 이름 밑선**이
 *    대신한다. 숫자는 그대로 둔다. 이름(team)과 업무(task) 사이 260ms 는
 *    밑선이 그어지고 나서 글자가 뜨는 간격이다.
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
  task: 880,
  /**
   * 업무는 **행 단위**로 나온다 — 다섯 칸의 첫째 줄이 같이, 그다음 둘째가
   * 같이. 칸마다 누적시키면 업무 수만큼 지연이 쌓여 지나치게 길어지고,
   * 세로로 쌓인 것을 세로로 또 훑는 움직임이라 읽는 방향과 싸운다.
   * 부서마다 칸 수가 달라도 각자 가진 만큼만 나오고 끊기지 않는다.
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
    <Reveal className="rounded-2xl bg-surface p-6 sm:p-10">
      <ul>
        <li className="flex flex-wrap items-center gap-x-2.5 lg:flex-col lg:flex-nowrap lg:items-center lg:gap-0">
          <Node label={head} tone="brand" style={delay(STEP.head)} />

          {/* 대표 -> 공장장. 칸이 하나뿐이라 가로선이 없다 — ::before 를
              flex 항목으로 두면 모바일에선 가로선, lg 에선 세로선이 된다. */}
          <ul className={LINK} style={delay(STEP.headDrop)}>
            <li className="contents lg:flex lg:w-full lg:flex-col lg:items-center">
              <Node label={plant.title} tone="dark" style={delay(STEP.plant)} />

              {/* 공장장 -> 다섯 부서 */}
              <ul className={BRANCH} style={delay(STEP.plantDrop)}>
                {plant.teams.map((team, i) => (
                  <li
                    key={team.name}
                    className={`${ITEM} ${i === plant.teams.length - 1 ? "org-span-r" : "org-span-l"}`}
                    style={delay(STEP.teamDrop, STEP.span)}
                  >
                    {/* 부서는 이름만 담는다. 밑선은 칸 전폭이다 — border 는
                        padding 바깥이라 좌우 10px 을 넘어 세로 칸선까지 닿는다.
                        아래 업무의 행 구분선(안쪽)과 폭이 다른 것이 맞다:
                        여는 선은 칸을 가로지르고, 가르는 선은 글자만 나눈다. */}
                    <div
                      className={NAME}
                      style={delay(STEP.team + i * STEP.teamGap)}
                    >
                      {team.name}
                    </div>

                    {/* 부서 -> 담당 업무.
                        ⚠️ flex-1 을 주지 않는다. 주면 목록이 칸 바닥까지
                           늘어나 세로선이 마지막 업무 아래로 계속 내려간다 —
                           업무가 둘뿐인 튜닝부에서 선만 남는 그 문제다. */}
                    <ul className={tasksClass(i)}>
                      {team.tasks.map((task, j) => (
                        <li
                          key={task}
                          className={taskClass(j, j === team.tasks.length - 1)}
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

/* ⚠️⚠️ **2026-10-21 판 (31) — 연결선을 진한 값(line-strong)으로 올렸다.**
      조직도는 **선이 내용**인데(대표에서 공장장, 다시 부서로) 그 선이 흰
      바탕에서 대비 **1.24:1** 이라 화면에서 가장 약했다. 캡처로 보면 노드
      상자만 떠 있고 상자들이 어떻게 이어지는지가 안 읽혔다.
      ⚠️ **굵기는 그대로다.** 색만 바꿨다 — 올리지 않는다.
      ⚠️ 판 (74) 메모 — line-strong 은 **연결선 전용**이다. 아래 부서 칸의
         세로 구분선과 업무 행 구분선은 연결선이 아니라 **표의 괘선**이라
         연한 line 을 쓴다. 두 가지가 같은 값이 되면 무엇이 계층이고 무엇이
         구획인지 흐려진다. */

/**
 * 대표 -> 공장장을 잇는 한 칸.
 *
 * ::before 를 absolute 가 아니라 **flex 항목**으로 둔다. 그래야 모바일에서는
 * 가로선(h-px w-4), lg 에서는 세로선(h-8 w-px)으로 같은 요소가 두 몫을 한다.
 *
 * ⚠️ lg 의 32px 은 판 (74) 에서 유신이 고른 값이다(㉡ 32 / 24 / 24).
 *    *"대표 | | 공장장 | | | 영업마케팅부 이렇게"* — 대표 아래 두 칸,
 *    공장장 아래 세 칸, 곧 **2 : 3** 비례를 그려 주셨다. 공장장 아래는
 *    BRANCH 의 24 + ITEM 의 24 = 48px 이라 32 : 48 이 된다.
 *
 * ⚠️⚠️ 모바일에서 이 ul 과 그 안의 li 를 **display:contents** 로 푸는 이유 —
 *    부서 목록은 공장장 li 안에 있는데, 이 래퍼가 박스를 만들면 부서가
 *    **대표 옆 좁은 열에 갇힌다**(대표가 그 긴 열의 세로 가운데로 밀려났다).
 *    contents 로 풀면 대표 · 가로선 · 공장장 · 부서 목록이 **한 flex 줄의
 *    형제**가 되고, 부서 목록만 w-full 이라 다음 줄로 떨어진다.
 *    목록 의미는 유지된다 — display:contents 가 ul/li 의 semantics 를
 *    지우던 버그는 Chrome 102 · Firefox 90 · Safari 16.4 에서 고쳐졌다.
 */
const LINK =
  "org-drop contents " +
  "before:block before:h-px before:w-4 before:shrink-0 before:bg-line-strong " +
  "lg:flex lg:w-full lg:flex-col lg:items-center " +
  "lg:before:h-8 lg:before:w-px";

/**
 * 다섯 부서가 놓이는 단. lg 에서 가로로 펼치고 칸을 균등하게 나눈다.
 *
 * pt 가 48px 인 이유 — 위 24px 은 공장장에서 내려오는 세로선 자리(::before),
 * 아래 24px 은 가로 분배선에서 각 칸으로 내려가는 세로선 자리(ITEM 의
 * ::before)다. 그래야 공장장 아래가 ㅗ 모양이 된다.
 * **lg:pt-12 와 before:h-6 / ITEM 의 top-[-24px] 는 항상 짝으로 움직인다.**
 */
const BRANCH =
  "org-drop mt-3.5 w-full " +
  "lg:relative lg:mt-0 lg:flex lg:pt-12 " +
  "lg:before:absolute lg:before:left-1/2 lg:before:top-0 lg:before:h-6 " +
  "lg:before:w-px lg:before:bg-line-strong";

/**
 * 부서 한 칸.
 * lg 에서 before 는 가로 분배선에서 내려오는 세로선, after 는 형제를 잇는
 * 가로선이다. 첫째는 오른쪽 절반, 마지막은 왼쪽 절반, 가운데는 전체를 긋는다.
 *
 * ⚠️ 칸을 flex column 으로 둔다 — 부서 이름과 업무 목록이 위에서부터 쌓이고,
 *    목록이 제 높이만큼만 차지한다. align-items 가 stretch 라 칸 자체의
 *    높이는 다섯이 같지만, 그 안의 목록은 각자 내용만큼만이다.
 *
 * ⚠️⚠️ **2026-10-26 판 (76) — lg 의 pt 24px 은 「얼마를 띄울지」의 답이다.**
 *   ::before(내림선)와 ::after(분배선)는 top 이 음수라 **이 li 바깥**에 있다.
 *   그래서 padding-top 을 줘도 **선은 그대로 있고 글자만 내려간다** — 선을
 *   줄이지 않고 숨만 주는 유일한 자리다.
 *
 *   유신: *"얼만큼 띄는게 이쁜지 최적화는 니가 다 고민하고 줬어야지"*
 *   차트의 수직 빈자리를 전부 재니 (1440 · CSS px)
 *       41 · 32 · 24 · **4.5** · 11.5 · 11.5 · 23.5 · 23.5 · 23.5
 *   4.5 하나만 유독 작았다 — 두 번째로 작은 값의 1/2.6 이다. 게다가 그
 *   4.5px 은 여백이 아니라 17px 글자의 줄 높이(23.4px)가 남긴 자리였고,
 *   내림선 끝은 글자 상자 꼭대기에 **닿아** 있었다(실제 여백 0).
 *
 *   그래서 생긴 두 가지 —
 *     ⓐ **소속이 뒤집힌다.** 이름이 위 4.5 · 아래 11.5 라 위가 2.6배
 *        가깝다. 가까운 쪽에 묶여 보이므로 이름이 *위의 선 묶음* 소속으로
 *        읽힌다 — 실제로는 아래 업무들의 머리인데도.
 *     ⓑ **묶음 밖이 묶음 안보다 좁다.** 업무 줄 사이가 23.5 인데 그 묶음
 *        바깥이 4.5 였다.
 *
 *   24px 을 고른 까닭 (판 (76) 의 ㉠, 보이는 틈 **28.5px**) —
 *     · 아래 틈 11.5 의 **2.48배**. 2~2.5배면 소속이 아래로 뒤집힌다
 *     · 업무 줄 틈 23.5 보다 **+5px**. 묶음 밖 > 묶음 안이 된다
 *     · 내림선 24 보다 크다. 선이 끝난 뒤의 숨이 선보다 길어진다
 *     · 24 는 BRANCH 와 이 ::before 가 **이미 쓰는 값**이다. 새 숫자를
 *       들이지 않는다
 *   보내 주신 조직도.png 는 32.5px 이었다(배수 1.09~1.13 추정). 방향은
 *   같고 4px 차이이며, 차트는 그만큼 덜 길어진다 — 411 -> **435px**.
 *
 *   ⚠️ 이 값을 키우려면 **아래 틈(NAME 의 pb)과 밑선 아래(업무 첫 li 의
 *      pt)도 같이** 봐야 한다. 위만 벌리면 이름이 2px 밑선에 눌린다
 *      (판 (76) 의 ㉣ 가 셋을 같이 올린 안이었다).
 *   ⚠️ 390 에는 걸리지 않는다 — 거기엔 분배선도 내림선도 없다.
 */
const ITEM =
  "org-drop mt-2.5 first:mt-0 " +
  "lg:relative lg:mt-0 lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:pt-6 " +
  "lg:before:absolute lg:before:left-1/2 lg:before:top-[-24px] lg:before:h-6 " +
  "lg:before:w-px lg:before:bg-line-strong " +
  "lg:after:absolute lg:after:top-[-24px] lg:after:h-px lg:after:bg-line-strong " +
  "lg:first:after:left-1/2 lg:first:after:right-0 " +
  "lg:last:after:left-0 lg:last:after:right-1/2 " +
  "lg:[&:not(:first-child):not(:last-child)]:after:left-0 " +
  "lg:[&:not(:first-child):not(:last-child)]:after:right-0 " +
  "lg:only:after:hidden";

/**
 * 부서 이름 + 2px 네이비 밑선.
 * 상자(카드)를 걷은 자리를 이 선이 대신한다 — 「이름에 무게를 준다」가
 * 유신이 준 레퍼런스에서 가져온 두 생각 중 하나다(다른 하나는 「업무를
 * 선으로 묶는다」, 곧 아래 목록의 괘선).
 */
const NAME =
  "org-node border-b-2 border-dark pb-2 text-[15px] font-bold leading-snug " +
  "tracking-[-0.01em] text-dark lg:px-2.5 lg:pb-[9px] lg:text-center lg:text-[17px]";

/**
 * 업무 목록.
 *
 *   모바일  2열 격자. 마지막 행 아래는 **격자 전체**에 border-b 로 닫는다 —
 *           업무가 홀수면 마지막 줄의 한 칸이 비어 li 마다 닫으면 선이
 *           한쪽에만 그어진다.
 *   lg      세로로 쌓이고, 첫 칸을 뺀 넷에 왼쪽 세로 구분선이 붙는다.
 *           닫는 선은 마지막 li 의 border-b 라 행 구분선과 폭이 같다.
 */
const tasksClass = (i: number) =>
  "mt-2.5 grid grid-cols-2 gap-x-3.5 border-b border-line " +
  "lg:mt-0 lg:block lg:border-b-0 lg:px-2.5 " +
  (i ? "lg:border-l lg:border-line" : "");

/**
 * 업무 한 줄. li 에 바로 준다 — 래퍼 div 가 필요 없다.
 * 부서 이름과의 위계는 배경색이 아니라 크기(17 -> 14px)와 색으로 낸다.
 *
 * 행 구분선이 모바일과 lg 에서 다른 까닭 — 모바일은 2열이라 **세 번째
 * 칸부터** 새 행이고, lg 는 1열이라 **두 번째부터** 새 행이다.
 */
const taskClass = (j: number, last: boolean) =>
  "org-node py-1.5 text-[13.5px] leading-normal text-ink-soft " +
  "lg:py-[7px] lg:text-center lg:text-sm " +
  (j >= 2 ? "border-t border-line " : "") +
  (j >= 1 ? "lg:border-t lg:border-line " : "") +
  (last ? "lg:border-b lg:border-line" : "");

/**
 * 대표 · 공장장 상자.
 *
 * ⚠️⚠️ **2026-10-26 판 (78) — 알약에서 「라운딩된 네모 박스」로 돌아왔다.**
 *   유신: *"대표 / 공장장 **너무 동그란데** 네모로 하거나 네모에서 작게만
 *   라운딩 하거나"* → 시안 넷(12 / 8 / 6 / 4px)을 **쓸 크기 그대로** 보고
 *   **8px** 을 고르셨다.
 *
 *   ⚠️ 이 값은 제가 고른 것이 아니다. **globals.css 의 모서리 표가
 *      「조직도 노드」에 이미 지정해 둔 값**이다(판 (29) 에 전수로 세어
 *      적은 것). 판 (74) 에서 상자를 걷고 알약으로 바꾸면서 그 표를 안
 *      보고 지나갔던 것을 되돌린 셈이다 — 그러니 **표는 손대지 않는다.**
 *      같은 표를 어겼다가 되돌린 선례가 하나 더 있다(company/page.tsx 의
 *      경영이념 사진 칸 — *"썸네일이 커도 조직도 노드와 같은 단이다.
 *      크기가 아니라 역할로 고른다"*).
 *
 *   ⚠️ **좌우 20px 은 그대로 둔다.** 둥근 끝이 글자를 먹지 않게 둔
 *      값이라 각지면 줄여도 되지만(시안에서 16px 도 함께 떴다), 고르신
 *      것은 지금 폭이다.
 *   ⚠️ **두 상자의 폭은 65.5 / 78.2px 로 다르다**(대표 두 글자 · 공장장
 *      세 글자). 각지면 그 12.7px 이 전보다 또렷하다 — 같은 폭으로 맞추는
 *      안도 같이 드렸지만 고르지 않으셨다. 가운데 정렬이라 **중심 어긋남은
 *      0** 이다.
 *   ⚠️ 함께 드렸던 **업무 칸 양끝 세로선은 뺐다** — 유신: *"문의접수 왼쪽
 *      옆에 선, 본체조립 오른쪽 선 **이거 없이**"*. 업무 칸 세로선은
 *      지금도 **안쪽 넷**이다(tasksClass 참고). 다시 꺼내자는 말이 오면
 *      판 (77) 의 Ⓑ ~ Ⓔ 가 시안\77\cmp-116.png 에 있다.
 */
function Node({
  label,
  tone,
  style,
}: {
  label: string;
  tone: "brand" | "dark";
  style?: CSSProperties;
}) {
  const styles = {
    brand: "bg-brand text-white",
    dark: "bg-dark-soft text-white",
  } as const;

  return (
    <div
      style={style}
      className={`org-node inline-block whitespace-nowrap rounded-lg px-5 py-2 text-center text-sm font-bold tracking-[-0.01em] ${styles[tone]}`}
    >
      {label}
    </div>
  );
}
