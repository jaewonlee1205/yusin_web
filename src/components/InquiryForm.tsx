"use client";

import { useState } from "react";
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
 * 문의 분야 칩.
 *
 * 전에는 select 였다. 브라우저 기본 화살표가 칸 오른쪽 끝에 붙어 글자와
 * 580px 떨어져 있었고, 펼친 목록은 OS 가 그려서 CSS 가 닿지 않았다. 아홉
 * 가지뿐이라 펼쳐 놓으면 그 두 문제가 원점에서 사라진다.
 *
 * 고른 칩은 네이비다. 빨강은 제출 버튼이 쓰므로 폼 안에 빨간 덩어리가 둘이면
 * 다시 겨룬다.
 *
 * ⚠️ 라디오가 sr-only 라 전역 :focus-visible 아웃라인이 화면에 안 나타난다.
 *    그래서 칩 쪽에 peer-focus-visible:ring 을 건다 — 이게 빠지면 키보드로
 *    분야를 고를 때 지금 어디 있는지 알 수 없다.
 *
 * ⚠️ peer-checked:hover 를 빼면 안 된다. hover:bg-line 하나만 두었더니 고른
 *    칩에 마우스를 올리는 순간 네이비가 회색으로 바뀌어, 선택이 풀린 것처럼
 *    보였다. 고른 칩의 호버는 navy-deep 으로 따로 정해 둔다.
 */
const chip =
  "block cursor-pointer rounded-full bg-field px-4 py-2.5 text-sm text-ink-soft " +
  "transition-colors hover:bg-line " +
  "peer-checked:bg-navy peer-checked:text-white peer-checked:hover:bg-navy-deep " +
  "peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

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
        category: String(data.get("category") ?? ""),
        message: String(data.get("message") ?? ""),
        botcheck: String(data.get("botcheck") ?? ""),
      });
      setStatus("success");
      form.reset();
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
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t, i) => (
            <label key={t}>
              <input
                type="radio"
                name="category"
                value={t}
                defaultChecked={i === 0}
                className="peer sr-only"
              />
              <span className={chip}>{t}</span>
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
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#d5261e]"
          />
          <span>
            개인정보 수집·이용에 동의합니다.
            {/* 고지 요건(항목.목적.기간)을 그대로 담되 사람 말로 적는다.
                앞의 "수집 항목: … 이용 목적: … 보유 기간: …" 은 글폭이
                547.7px 라 529.3px 글상자를 18.4px 넘겨 두 줄이었다. */}
            <span className="mt-1.5 block text-xs leading-relaxed text-muted">
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
