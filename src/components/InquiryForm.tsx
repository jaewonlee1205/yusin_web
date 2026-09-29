"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/products";
import { site } from "@/data/site";
import { InquiryError, submitInquiry } from "@/lib/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

const TOPICS = [...CATEGORIES, "전용기 제작", "기존 설비 수리 · 튜닝", "기타"];

const field =
  "w-full rounded border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 transition-colors focus:border-navy";
const label = "mb-2 block text-sm font-semibold text-ink";
const required = <span className="ml-1 text-brand">*</span>;

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
      <div className="rounded-lg border border-navy/20 bg-navy/5 p-8 text-center sm:p-12">
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
      {/* 봇 잡이. 사람 눈에는 보이지 않는다. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className={label}>
            회사명{required}
          </label>
          <input
            id="company"
            name="company"
            required
            autoComplete="organization"
            placeholder="(주)유신"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="name" className={label}>
            담당자명{required}
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="홍길동"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            연락처{required}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="010-0000-0000"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            이메일{required}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="name@company.com"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className={label}>
          문의 분야{required}
        </label>
        <select id="category" name="category" required className={field}>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          문의 내용{required}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          placeholder={
            "공급할 부품의 종류와 크기, 필요한 공급 속도, 희망 납기 등을 적어 주시면 더 정확하게 답변드릴 수 있습니다.\n부품 도면이나 사진은 회신 메일에 첨부해 주셔도 됩니다."
          }
          className={`${field} resize-y leading-relaxed`}
        />
      </div>

      <div className="rounded border border-line bg-surface p-4">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#d5261e]"
          />
          <span>
            개인정보 수집·이용에 동의합니다.{required}
            <span className="mt-1.5 block text-xs leading-relaxed text-muted">
              수집 항목: 회사명, 담당자명, 연락처, 이메일 · 이용 목적: 문의 응대
              및 견적 회신 · 보유 기간: 문의 처리 후 3년
            </span>
          </span>
        </label>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded bg-brand px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "전송 중…" : "문의 보내기"}
      </button>
    </form>
  );
}
