/**
 * 여러 곳에서 쓰는 SVG 아이콘.
 *
 * PhoneIcon 은 원래 Header.tsx 안에 있었는데, Header 는 "use client" 라
 * 서버 컴포넌트인 ContactCTA 가 가져다 쓰기에 적절치 않아 여기로 옮겼다.
 * 이 파일은 순수 SVG 라 지시어가 없다 — 양쪽에서 쓸 수 있다.
 */
/** 맨 위로 버튼의 화살표. 버튼에 aria-label 이 있어 아이콘은 숨긴다. */
export function ChevronUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

/**
 * 푸터 유튜브 채널 링크 앞 아이콘. 글자가 "유튜브 채널" 이라 아이콘은 숨긴다.
 *
 * 이 파일에서 유일하게 선이 아니라 면으로 그리는 아이콘이다. 위 둘은 화살표·
 * 수화기 같은 범용 기호라 선 굵기만 맞추면 되지만, 이건 남의 브랜드 마크라
 * 그쪽 형태를 따라야 알아본다. 처음엔 선 아이콘으로 그렸는데 16px·굵기 2 에서
 * 둥근 사각형 테두리와 안쪽 삼각형이 서로 뭉개져 무슨 모양인지 안 읽혔다.
 * 실제 마크가 "꽉 찬 사각형에 흰 삼각형이 뚫린" 모양이라 그대로 칠한다.
 *
 * 색은 호출하는 쪽에서 준다(푸터는 text-brand). 유튜브 원색(#FF0000)이 아니라
 * 사이트 브랜드 레드를 쓰는 이유는 Footer.tsx 에 적어 뒀다.
 */
export function YoutubeIcon({ className = "shrink-0" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z" />
    </svg>
  );
}

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
