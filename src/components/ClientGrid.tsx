/**
 * 거래처 그리드.
 *
 * 로고 이미지를 쓰지 않고 회사명을 같은 서체·같은 크기로 렌더한다.
 * (사유는 src/data/clients.ts 주석 참고)
 * 카드 높이를 고정해 이름 길이가 달라도 격자가 흐트러지지 않게 한다.
 */
export default function ClientGrid({
  names,
  className = "",
}: {
  names: string[];
  className?: string;
}) {
  return (
    <ul
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {names.map((name) => (
        <li
          key={name}
          className="flex h-20 items-center justify-center bg-white px-4 text-center transition-colors hover:bg-surface sm:h-24"
        >
          <span className="text-sm font-medium leading-snug text-ink-soft sm:text-[15px]">
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}
