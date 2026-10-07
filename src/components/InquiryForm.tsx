"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/data/products";
import { site } from "@/data/site";
import { InquiryError, submitInquiry } from "@/lib/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

const TOPICS = [...CATEGORIES, "전용기 제작", "기존 설비 수리 · 튜닝", "기타"];

/**
 * 입력칸은 테두리 대신 바탕색으로 칸을 그린다. 선이 하나 줄면 폼 전체에서
 * 선 열몇 개가 사라져 화면이 조용해진다.
 *
 * ⚠️ 포커스 표시를 여기서 건드리지 않는다. globals.css 끝의
 *    :where(a, button, input, textarea, select, summary):focus-visible 이
 *    브랜드 레드 2px 아웃라인을 이미 그린다. 여기서 outline-none 을 주면
 *    테두리도 없고 포커스도 없는 칸이 되어 키보드로 쓸 수 없게 된다.
 *
 * 글자는 16px 다. 15px 이하로 두면 iOS 사파리가 칸을 누를 때 화면을 확대한다.
 *
 * 높이(h-14)는 input·select 만 쓴다. textarea 는 따로 min-h 를 준다 —
 * 같은 상수에 h-14 를 넣어 두면 textarea 쪽에서 덮어쓰기가 CSS 순서에
 * 좌우돼 불안정하다.
 */
const field =
  "w-full rounded-xl bg-field px-4 text-base text-ink placeholder:text-muted/60";
const fieldLine = `${field} h-14`;
const label = "mb-2.5 block text-sm font-medium text-muted";

/**
 * 문의 분야 — **네모 체크박스**. 여러 개를 고를 수 있다.
 *
 * 생김새가 세 번 바뀌었다.
 *
 *   select    브라우저 기본 화살표가 칸 오른쪽 끝에 붙어 글자와 580px 떨어져
 *             있었고, 펼친 목록은 OS 가 그려서 CSS 가 닿지 않았다
 *   알약 칩   라디오 -> 체크박스. 고른 것이 네이비로 채워졌다
 *   네모 상자 지금. "기존 네모 체크박스 형태" 로 해 달라는 요청이다
 *
 * ⚠️ 알약을 버린 데는 디자인 근거도 있다. rounded-full 은 이 사이트에서
 *    제품 상세 분류 배지 · 적용 분야 칩이 쓰는 모양이고, 그 둘은 **고르는
 *    것이 아니라 보여 주는 것**이다. 같은 모양으로 열 개를 고르게 하면
 *    "하나만 고르는 것" 처럼 읽힌다 — 알약이던 동안 그것을 체크 아이콘으로
 *    메우고 있었다. 네모 체크박스는 그 일이 필요 없다.
 *
 * ⚠️ 상자 안 체크를 켜는 선택자가 peer-checked:[&>svg]:block 이다.
 *    peer-checked: 는 **형제**에만 걸리는데 svg 는 이 span 의 자식이라,
 *    자식까지 내려가는 [&>svg] 를 겹쳐야 닿는다. Tailwind v4 는 소스에
 *    글자 그대로 있는 것만 CSS 로 만드니 이 문자열을 쪼개 쓰지 말 것.
 *
 * ⚠️ 입력칸이 sr-only 라 전역 :focus-visible 아웃라인이 화면에 안 나타난다.
 *    그래서 상자 쪽에 peer-focus-visible:ring 을 건다 — 이게 빠지면 키보드로
 *    분야를 고를 때 지금 어디 있는지 알 수 없다.
 *
 * ⚠️ 고른 것은 **네이비**다. 빨강은 제출 버튼이 쓰므로 폼 안에 빨간 덩어리가
 *    둘이면 다시 겨룬다.
 *
 *    ⚠️ 바로 아래 개인정보 동의는 네이티브 체크박스(accent-[#d5261e])라 색이
 *       레드다. 둘이 다른 것은 의도다 — 저쪽은 **반드시 눌러야 넘어가는** 한
 *       줄이고 이쪽은 골라도 되고 말아도 되는 열 개다. 저기까지 네이비로
 *       맞추면 필수 항목이 조용해진다.
 */
const boxBase =
  "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] " +
  "border-[1.5px] border-line bg-white transition-colors " +
  "peer-checked:border-navy peer-checked:bg-navy " +
  "peer-checked:[&>svg]:block " +
  "peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2";
const boxLabel =
  "text-sm leading-snug text-ink-soft transition-colors peer-checked:font-semibold peer-checked:text-ink";
/**
 * 개인정보 동의 체크박스. 위 문의 분야와 **같은 상자**이고 mt-0.5 만 다르다 —
 * 글이 두 줄이라 첫 줄 가운데에 맞춘다.
 *
 * ⚠️ 한때 네이티브 체크박스(h-4 w-4 accent-[#d5261e])였다. 그때 주석에
 *    "저쪽은 네이비, 여기는 레드다 — 반드시 눌러야 넘어가는 한 줄이라 색으로
 *    알린다" 고 적어 두었는데, 문의 분야와 같은 모양으로 해 달라는 요청에
 *    뒤집었다. 같은 모양에 다른 색이면 둘이 다른 장치로 읽힌다.
 *    이제 폼 안의 레드는 제출 버튼 하나뿐이다.
 *
 * ⚠️⚠️ input 의 required 를 빼지 말 것. 동의 없이는 제출되지 않아야 하는
 *      유일한 칸이다.
 *
 *      sr-only 로 숨겨도 **검증은 제대로 돈다.** 눌러서 확인했다 — 동의를
 *      비우고 제출하면 폼이 그대로 남고(제출 안 됨) 브라우저가 이 input 에
 *      포커스를 준다. sr-only 가 position:absolute 이지만 top/left 를 주지
 *      않아 **원래 자리에 1px 로** 있기 때문에, 검증 말풍선도 상자 옆에 뜬다.
 *
 *      ⚠️ 그래서 이 input 에 left/top 을 주거나 display:none 으로 바꾸지 말
 *         것. display:none 이면 Chrome 이 "An invalid form control is not
 *         focusable" 로 제출을 **조용히** 막는다 — 사용자는 버튼이 먹통인
 *         줄 안다. 숨기는 방식을 바꿀 때마다 직접 눌러서 확인한다.
 */
const boxAgree = `mt-0.5 ${boxBase}`;
/**
 * 문의 분야 "전체 선택" 상자. 분야 칸과 같은 모양에 **중간 상태**가 더해진다.
 *
 * peer-indeterminate: 는 일부만 골랐을 때다 — 바탕을 네이비로 채우되 체크
 * 대신 가로줄을 보인다. indeterminate 는 HTML 속성이 아니라 DOM 프로퍼티라
 * 컴포넌트에서 ref + useEffect 로 세운다.
 */
const boxAll =
  `${boxBase} peer-indeterminate:border-navy peer-indeterminate:bg-navy ` +
  "peer-indeterminate:[&>span]:block";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  /**
   * 고른 문의 분야. **"전체 선택" 때문에 상태를 들였다.**
   *
   * 그 전까지 분야 체크박스는 비제어였다(DOM 이 상태를 들고 handleSubmit 이
   * FormData.getAll 로 읽었다). 전체 선택은 "열 개가 다 켜졌는가" 를 알아야
   * 하므로 React 가 그 목록을 쥐어야 한다.
   *
   * ⚠️ handleSubmit 의 data.getAll("category") 는 **그대로 둔다.** 제어
   *    컴포넌트여도 DOM 의 checked 가 이 상태를 따르므로 FormData 가 그대로
   *    읽는다. 합치는 자리를 한 곳에 두는 편이 낫다.
   *
   * ⚠️ 제출이 성공하면 form.reset() 만으로는 안 비워진다 — 제어 컴포넌트는
   *    상태가 진실이다. setPicked([]) 를 함께 부른다.
   */
  const [picked, setPicked] = useState<string[]>([]);
  const allOn = picked.length === TOPICS.length;
  const someOn = picked.length > 0 && !allOn;

  /* 일부만 골랐을 때 전체 선택을 중간 상태로 둔다. indeterminate 는 HTML
     속성이 아니라 DOM 프로퍼티라 ref 로만 세울 수 있다. */
  const allRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = someOn;
  }, [someOn]);

  const toggle = (topic: string) =>
    setPicked((prev) =>
      prev.includes(topic) ? prev.filter((x) => x !== topic) : [...prev, topic],
    );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setError("");

    try {
      await submitInquiry({
        company: String(data.get("company") ?? ""),
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        /* ⚠️ getAll 이다. 체크박스는 같은 name 으로 여럿이 넘어오는데 get
           은 **첫 하나만** 돌려준다(라디오이던 때는 그래도 됐다). 합치는
           자리를 여기 하나로 둔다 — lib/inquiry.ts 는 문자열 하나를 받고,
           거기서 다시 쪼개 메일 제목을 줄인다. */
        category: data.getAll("category").map(String).join(" · "),
        message: String(data.get("message") ?? ""),
        botcheck: String(data.get("botcheck") ?? ""),
      });
      setStatus("success");
      form.reset();
      setPicked([]);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof InquiryError
          ? err.message
          : "전송 중 문제가 발생했습니다. 전화로 연락 부탁드립니다."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-bold text-ink">
          문의가 접수되었습니다
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          영업일 기준 1~2일 내에 담당자가 연락드리겠습니다.
          <br />
          급한 건이시라면 {site.tel}로 전화 주시면 더 빠릅니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-navy underline underline-offset-4"
        >
          문의 하나 더 남기기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate={false}>
      {/* 봇 잡이. 사람 눈에는 보이지 않는다. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={label}>
            회사명
          </label>
          <input
            id="company"
            name="company"
            required
            autoComplete="organization"
            placeholder="(주)유신"
            className={fieldLine}
          />
        </div>
        <div>
          <label htmlFor="name" className={label}>
            담당자명
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="홍길동"
            className={fieldLine}
          />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            연락처
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="010-0000-0000"
            className={fieldLine}
          />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="name@company.com"
            className={fieldLine}
          />
        </div>
      </div>

      <fieldset>
        <legend className={label}>문의 분야</legend>
        {/* **열이 맞는 격자다.** 한때 flex-wrap 이라 줄마다 개수가 달라
            들쭉날쭉했는데, 가지런히 정렬해 달라는 요청에 격자로 바꿨다.

            ⚠️ 1024 부터 **4열**이다. "5개씩 2줄" 로 해 달라는 말씀이었지만
               5열은 들어가지 않는다 — 폼이 768px 라 5열 한 칸이 144px 인데,
               가장 긴 라벨 "기존 설비 수리 · 튜닝" 이 14px 로 135px 이고
               체크(18)와 간격(10)을 더하면 163px 가 필요하다(실측).
               4열은 183px 라 들어간다. 열 개가 4+4+2 로 선다.

               라벨을 줄여 5열에 맞추는 길도 있지만, 분야 이름은 메일 본문에
               그대로 들어가는 값이라 화면 사정으로 깎지 않는다.

            gap-y-3(12px)은 알약이던 때 쓰던 값 그대로다. 가로는 gap-x-4 로
            넓혔다 — 바탕이 없어져 칸 경계가 글자뿐이라, 좁으면 옆 항목과
            붙어 읽힌다. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          {/* ⚠️ defaultChecked 가 없다. 라디오이던 때는 첫 칸("파츠피더")이
              미리 골라져 있었고, 그것이 "분야 값이 늘 있다" 를 보장하는 유일한
              장치였다(required 는 어디에도 없다). 체크박스에서는 사용자가
              그것을 풀 수 있으므로 **아무것도 안 고른 상태가 정상**이다 —
              lib/inquiry.ts 가 그 경우를 받는다.

              체크박스 그룹에 HTML required 를 쓰지 말 것. 브라우저는 그것을
              "이 칸 하나가 필수" 로 읽어, 열 개 모두에 걸면 전부 체크해야
              제출된다(이 폼은 noValidate 를 끄지 않아 브라우저 검증이 돈다). */}
          {/* 격자 **첫 칸**이 전체 선택이다.

              ⚠️ name 을 주지 않는다. name="category" 를 붙이면 메일 본문
                 "문의분야" 에 "전체 선택" 이라는 값이 섞여 들어간다.

              ⚠️ 분야 칸과 **같은 네모 상자**를 쓴다(boxBase). 다른 모양을
                 주면 격자 안에서 혼자 튄다. 대신 라벨을 늘 굵게 둬서, 고르지
                 않은 상태에서도 분야 이름과 성격이 다르다는 것을 보인다.

              ⚠️ 그래도 첫 칸이라 **"전체 선택" 이 분야 이름처럼 읽힐 수 있다.**
                 거슬리면 fieldset 의 legend 줄 오른쪽으로 옮긴다 — 거기면
                 격자가 열 칸 그대로고 "목록을 조종하는 장치" 라는 것이 자리로
                 드러난다.

              peer-indeterminate: 는 일부만 골랐을 때다. 상자 안에 체크 대신
              가로줄이 뜬다(위 useEffect 가 그 프로퍼티를 세운다). */}
          <label className="flex cursor-pointer items-center gap-2.5 py-1">
            <input
              ref={allRef}
              type="checkbox"
              checked={allOn}
              onChange={() => setPicked(allOn ? [] : [...TOPICS])}
              className="peer sr-only"
              aria-label="문의 분야 전체 선택"
            />
            <span className={boxAll}>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="hidden"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {/* 중간 상태의 가로줄. 체크와 같은 자리에 겹쳐 두고 둘 중
                  하나만 보이게 한다. */}
              <span
                aria-hidden="true"
                className="hidden h-[2px] w-[9px] rounded-full bg-white"
              />
            </span>
            <span className="text-sm font-semibold leading-snug text-ink">
              전체 선택
            </span>
          </label>

          {TOPICS.map((t) => (
            <label
              key={t}
              className="flex cursor-pointer items-center gap-2.5 py-1"
            >
              {/* ⚠️ input 이 두 span 보다 **앞**에 있어야 한다. peer-checked:
                  가 뒤따르는 형제에만 걸린다. */}
              <input
                type="checkbox"
                name="category"
                value={t}
                checked={picked.includes(t)}
                onChange={() => toggle(t)}
                className="peer sr-only"
              />
              <span className={boxBase}>
                {/* 사이트 공통 체크다(제품 특징 카드 · 문의 완료 화면과 같은
                    path). hidden 으로 두고 boxBase 의
                    peer-checked:[&>svg]:block 이 켠다. */}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="hidden"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span className={boxLabel}>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className={label}>
          문의 내용
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          placeholder={
            "예) 커넥터 단자를 시간당 3,000개 공급하려 합니다. 조립기 앞단에 놓을 예정이고, 도면은 회신 메일에 첨부하겠습니다."
          }
          className={`${field} min-h-[12.5rem] resize-y py-4 leading-relaxed`}
        />
      </div>

      <div className="rounded-xl bg-surface p-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="privacy"
            required
            className="peer sr-only"
          />
          <span className={boxAgree}>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="hidden"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          {/* ⚠️ 고르면 **첫 줄만** 굵어진다(위 문의 분야 라벨과 같은 처리).
              아래 작은 고지 문구까지 같이 굵어지면 두 줄이 한 덩어리로
              무거워진다 — 거기는 text-xs text-muted 그대로 둔다. */}
          <span className="transition-colors peer-checked:font-semibold peer-checked:text-ink">
            개인정보 수집·이용에 동의합니다.
            {/* 고지 요건(항목.목적.기간)을 그대로 담되 사람 말로 적는다.
                앞의 "수집 항목: … 이용 목적: … 보유 기간: …" 은 글폭이
                547.7px 라 529.3px 글상자를 18.4px 넘겨 두 줄이었다. */}
            <span className="mt-1.5 block text-xs font-normal leading-relaxed text-muted">
              회사명·담당자명·연락처·이메일을 문의 응대와 견적 회신에 쓰고, 3년
              뒤 파기합니다.
            </span>
          </span>
        </label>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-xl bg-brand/5 px-4 py-3.5 text-sm text-brand-dark"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="h-14 w-full rounded-xl bg-brand text-[17px] font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "전송 중…" : "문의 보내기"}
      </button>
    </form>
  );
}
