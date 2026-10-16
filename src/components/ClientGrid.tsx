import Image from "next/image";
import Reveal from "./Reveal";
import type { Client } from "@/data/clients";

/**
 * 거래처 그리드.
 *
 * ⚠️⚠️⚠️ **2026-10-16 — 거래처가 34곳에서 125곳이 되자 세 가지가 드러났다.**
 *      ① *"밑에 표 7개 아무것도 없는 빈표 있는데"*
 *      ② *"회색으로 아직 안나온것들 배경 보이는데"*
 *      ③ *"빨리 스크롤 내리면 늦게 애니메이션이 나와 기달려야 하고"*
 *
 *    **①②는 한 원인이었다.** 전에는 `gap-px + bg-line` 으로 격자를 그렸다 —
 *    ul 바탕을 선 색으로 칠하고 칸 사이 1px 틈으로 비치게 하는 방식이다.
 *      · 칸이 **뜨기 전(Reveal 투명)** 에는 바탕색이 그대로 보였고(②)
 *      · 마지막 줄이 모자라면 **그 자리도 바탕색**이라 회색 덩어리가 남았다.
 *        메우려고 **빈 칸 채우개**를 넣었는데 열 수가 2·3·4 로 바뀌므로
 *        **12의 배수**까지 채워야 했다. 125 % 12 = 5 → **7칸**(①).
 *    **카드마다 테두리**를 두니 둘 다 사라졌다. 바탕을 칠하지 않으니 비칠 것이
 *    없고 채우개도 필요 없다.
 *    ⚠️ 그래서 채우개 코드를 **지웠다.** 되살리려면 바탕 칠하는 방식부터
 *       되돌려야 한다 — 둘은 한 묶음이다.
 *
 *    **③ 은 지연이 아니라 관찰자 수가 문제였다.** 처음에 `i * 25ms` 를
 *    `Math.min(i * 8, 400)` 으로 줄여 봤는데 **소용이 없었다.** 진짜 원인은
 *    **칸마다 IntersectionObserver 를 하나씩 거는 것** — 125개를 관찰하면
 *    발동이 늦고, 빠르게 굴리면 칸이 화면을 지나간 뒤에 뜬다.
 *    ⚠️ **고칠 자리를 못 찾으면 처방이 헛돈다**(브래킷 곡면·고무 씰 모서리에서도
 *       같은 일이 있었다). 지금은 **스물넷을 넘으면 격자 전체를 한 번에**
 *       띄운다 — 관찰자가 하나다. 홈은 12칸이라 지금처럼 차례로 올라온다.
 *
 * **로고**: `logo` 가 있으면 이미지를, 없으면 이름을 그린다.
 * ⚠️ **2026-10-16 — 로고 여섯이 들어왔다**(clients.ts 의 `logos`).
 * ⚠️⚠️ **같은 날 회색조를 걷었다.** 처음에는 *"섞이면 격자가 고르지 않아
 *    보이므로"* `grayscale opacity-80` 으로 한 단계 눌러 글자 칸과 무게를
 *    맞추고 hover 에서만 원색으로 돌렸다. 유신이 보고 *"회사 로고 회색 말고
 *    원본 색깔 보이게"* 라고 했다.
 *    **고르게 보이려다 로고를 넣은 뜻을 반쯤 지우고 있었다** — 125칸 가운데
 *    여섯만 로고인데, 그 여섯이 눈에 띄는 것이 **넣은 까닭**이다.
 *    ⚠️ 되돌릴 일이 생겨도 **hover 쌍(`hover:grayscale-0 hover:opacity-100`)을
 *       함께** 되살려야 한다. 한쪽만 남기면 평상시와 hover 가 같아진다.
 * ⚠️ **높이는 여전히 맞춘다**(폭 자유) — 칸 높이가 흔들리지 않게 하는 것은
 *    색과 상관없는 일이다.
 * ⚠️ `max-w-full` 이 꼭 있어야 한다. MR인프라오토 로고는 **가로:세로가 8:1** 이라
 *    높이만 48px 로 맞추면 폭이 390px 가 된다 — 390px 화면의 2열 칸(약 160px)을
 *    **훌쩍 넘어 잘린다.** 폭을 먼저 맞추면 높이가 줄 뿐 다 보인다.
 *
 * 움직임을 끈 사람에게는 globals.css 가 곧바로 보여 준다.
 */
export default function ClientGrid({
  names,
  className = "",
  whole = false,
}: {
  /** 이름만 주면 글자로, { name, logo } 를 주면 로고로 그린다. */
  names: (string | Client)[];
  className?: string;
  /**
   * 칸이 몇 개든 **격자 전체를 한 번에** 띄운다.
   *
   * ⚠️⚠️ **분야별로 격자를 나눌 때 반드시 켜야 한다.** 아래 `many` 는 *이
   *    격자*의 칸 수만 본다 — 125곳을 일곱 분야로 쪼개면 격자마다 24칸을
   *    밑돌아 **칸마다 IntersectionObserver 가 다시 생긴다.** 관찰자 수는
   *    쪼개기 전과 같으므로, 고쳐 놓은 *"빨리 스크롤 내리면 늦게 나와
   *    기달려야"* 가 **그대로 되살아난다.**
   */
  whole?: boolean;
}) {
  const many = whole || names.length > 24;
  const CELL =
    "flex h-20 items-center justify-center rounded-xl border border-line bg-white px-4 text-center transition-colors hover:bg-surface sm:h-24";

  const cells = names.map((c, i) => {
    const name = typeof c === "string" ? c : c.name;
    const logo = typeof c === "string" ? undefined : c.logo;
    const inner = logo ? (
      <Image
        src={logo}
        alt={name}
        width={160}
        height={48}
        className="max-h-10 w-auto max-w-full object-contain sm:max-h-12"
      />
    ) : (
      <span className="text-sm font-medium leading-snug text-ink-soft sm:text-15">
        {name}
      </span>
    );

    return many ? (
      <li key={name} className={CELL}>
        {inner}
      </li>
    ) : (
      <Reveal as="li" key={name} delay={i * 25} className={CELL}>
        {inner}
      </Reveal>
    );
  });

  const grid = (
    <ul
      className={`grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4 ${className}`}
    >
      {cells}
    </ul>
  );

  return many ? <Reveal>{grid}</Reveal> : grid;
}
