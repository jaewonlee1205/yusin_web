/**
 * 여러 곳에서 쓰는 SVG 아이콘.
 *
 * PhoneIcon 은 원래 Header.tsx 안에 있었는데, Header 는 "use client" 라
 * 서버 컴포넌트인 ContactCTA 가 가져다 쓰기에 적절치 않아 여기로 옮겼다.
 * 이 파일은 순수 SVG 라 지시어가 없다 — 양쪽에서 쓸 수 있다.
 */
/** 전화번호 앞 수화기. 번호만 읽히도록 스크린리더에서는 숨긴다. */
export function PhoneIcon({ className = "shrink-0" }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
