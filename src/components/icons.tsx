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

/*
 * 아래 셋은 남의 브랜드 마크다. 나머지(화살표·수화기)는 범용 기호라 선으로
 * 그리고 굵기만 맞추면 되지만, 브랜드 마크는 그쪽 형태를 그대로 따라야
 * 알아본다. 그래서 선이 아니라 면(fill)으로 칠한다.
 *
 * 유튜브는 처음에 선 아이콘으로 그렸다가 버렸다 — 16px·굵기 2 에서 둥근
 * 사각형 테두리와 안쪽 삼각형이 서로 뭉개져 무슨 모양인지 안 읽혔다.
 *
 * 색은 호출하는 쪽에서 준다. 고르는 원칙은 Footer.tsx 에 적어 뒀다.
 */

/**
 * 푸터 유튜브 채널 버튼의 마크.
 *
 * 버튼에서 글자를 뺐으므로(아이콘만 남겼다) 접근성 이름은 Footer.tsx 의
 * aria-label 이 혼자 진다. aria-hidden 인 이 마크는 이름에 보태지 않는다.
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

/**
 * 푸터 네이버 플레이스 버튼의 마크. 이름 사정은 YoutubeIcon 과 같다.
 *
 * viewBox 가 "0 0 24 24" 가 아니라 사방으로 3.4 만큼 넓다 — 광학 보정이다.
 * 유튜브 마크는 납작한 둥근 사각형이라 상자 16px 안에서 실제 잉크가
 * 16x11.27px 인데, N 은 24x24 를 꽉 채워 16x16px 이었다. 나란히 두면 높이가
 * 1.42 배라 N 만 커 보인다.
 *
 * width/height 를 줄이는 손쉬운 방법은 못 쓴다. 버튼이 p-2(8px)+테두리 라
 * 8+16+8+1.6 = 34 이고, 이 34x34 가 푸터 브랜드 열 150px 정렬의 전제다.
 * 그래서 상자는 16 으로 두고 viewBox 만 넓혀 그림을 24/30.8 = 0.779 배로
 * 줄인다. 잉크가 12.47x12.47px 이 되어 높이 비가 1.11 로 내려간다.
 *
 * 높이를 아주 같게(0.70) 맞추면 오히려 작아 보인다 — N 은 유튜브와 달리
 * 가로도 함께 좁아지기 때문이다. 1.00/0.90/0.85/0.80/0.78/0.74/0.70 을 실제
 * 버튼 모양으로 그려 놓고 고른 값이 0.78 이다.
 */
export function NaverIcon({ className = "shrink-0" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="-3.4 -3.4 30.8 30.8"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z" />
    </svg>
  );
}

/**
 * 카카오 마크.
 *
 * ⚠️ **지금은 쓰는 곳이 없다.** 오시는 길 아래쪽 "대중교통 + 지도 앱 버튼"
 *    회색 박스를 통째로 걷으면서 유일한 사용처가 사라졌다. 지우지 않고 두는
 *    것은 아래 내력 — 특히 잉크 비율 실측값(0.747) — 을 다시 재지 않기
 *    위해서다. 되살리려면 site.ts 의 coords 와 짝으로 쓴다.
 *
 *    한동안 쓰지 않고 두었다 — "정식 연동에 키가 필요하다" 고 적어 두었는데,
 *    카카오맵 길찾기는 /link/to/{이름},{위도},{경도} 라 **키가 아니라 좌표**
 *    만 있으면 된다. 좌표를 확인해(site.ts 의 coords) 되살렸다.
 *
 * ⚠️ 색은 #3C1E1E(카카오 브라운)다. 공식 노랑(#FEE500)으로 두면 흰 버튼 위에서
 *    거의 보이지 않는다 — 시안으로 확인했다.
 *
 * 카카오"맵" 전용 단색 심볼은 어디에도 없다. simple-icons 의 kakao 는 소문자
 * 워드마크라 가로로 길어 이 크기에서 안 읽히고, kakaotalk 은 둥근 사각형
 * 안에 말풍선과 TALK 글자가 들어가 16px 급에서 글자가 뭉개진다. 게다가
 * 그건 카카오"톡" 이라 지도와 다른 서비스로 읽힌다.
 *
 * 그래서 kakaotalk 아이콘에서 말풍선 서브패스만 떼어 왔다. 그 조각이 곧
 * 카카오 말풍선 심볼이라 눈대중으로 그린 모양이 아니라 공식 형태 그대로다.
 *
 * 잉크가 viewBox 를 거의 꽉 채운다(19.5x18.1 / 24). NaverIcon 은 광학 보정
 * viewBox 때문에 0.78 배로 들어가므로, 둘을 나란히 둘 때는 부르는 쪽에서
 * 상자 크기를 달리 줘 잉크를 맞춰야 한다 — 오시는 길 길찾기 버튼이 그래서
 * 네이버에 16px, 카카오에 17px 를 준다(잉크가 각각 12.5 / 12.7px 로 맞는다).
 */
export function KakaoIcon({ className = "shrink-0" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 18.75c-.591 0-1.1697-.0413-1.7317-.1209-.5626.3965-3.813 2.6797-4.1198 2.7225 0 0-.1258.0489-.2328-.0141s-.0876-.2282-.0876-.2282c.0322-.2198.8426-3.0183.992-3.5333-2.7452-1.36-4.5701-3.7686-4.5701-6.5135C2.25 6.8168 6.6152 3.375 12 3.375s9.75 3.4418 9.75 7.6875c0 4.2457-4.3652 7.6875-9.75 7.6875z" />
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
