import { organization } from "@/data/company";

/**
 * 조직도.
 *
 * 대표 아래로 공장장이 이어지고, 영업마케팅부는 대표 직속이라 척추선에서
 * 옆으로 뻗은 가지로 그린다. 공장장 아래 네 개 부서는 가로 막대로 묶는다.
 * 연결선은 640px 미만에서는 숨기고 위아래 순서만으로 위계를 보여 준다.
 */
export default function OrgChart() {
  const { head, direct, plant } = organization;

  return (
    <div className="rounded-lg border border-line bg-surface p-6 sm:p-10">
      <div className="flex flex-col items-center">
        <Box label={head} tone="brand" />

        {/* 대표 -> 공장장 척추선. 그 중간에서 영업마케팅부가 옆으로 갈라진다. */}
        <div className="relative flex w-full flex-col items-center">
          <Stem className="h-6 sm:h-16" />

          <div className="absolute left-1/2 top-8 hidden items-center sm:flex">
            <span aria-hidden="true" className="h-px w-16 bg-line lg:w-28" />
            <Box label={direct[0]} tone="outline" />
          </div>

          {/* 모바일에서는 가지를 접고 세로로 세운다. */}
          <div className="flex flex-col items-center sm:hidden">
            <Box label={direct[0]} tone="outline" />
            <Stem className="h-6" />
          </div>
        </div>

        <Box label={plant.title} tone="navy" />
        <Stem className="h-6 sm:h-8" />

        {/* 공장장 -> 4개 부서 */}
        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {plant.teams.map((team, i) => (
            <li key={team.name} className="relative lg:px-2 lg:pt-8">
              {/* 부서 위로 올라가는 세로선과, 이웃을 잇는 가로 막대 */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 hidden h-8 w-px -translate-x-1/2 bg-line lg:block"
              />
              <span
                aria-hidden="true"
                className={`absolute top-0 hidden h-px bg-line lg:block ${
                  i === 0
                    ? "left-1/2 right-0"
                    : i === plant.teams.length - 1
                      ? "left-0 right-1/2"
                      : "left-0 right-0"
                }`}
              />
              <div className="h-full rounded-lg border border-line bg-white p-5 text-center">
                <p className="text-base font-bold text-ink">{team.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {team.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stem({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`w-px bg-line ${className}`} />;
}

function Box({
  label,
  tone,
}: {
  label: string;
  tone: "brand" | "navy" | "outline";
}) {
  const styles = {
    brand: "bg-brand text-white border-brand",
    navy: "bg-navy text-white border-navy",
    outline: "bg-white text-ink border-line",
  } as const;

  return (
    <div
      className={`whitespace-nowrap rounded border px-8 py-3 text-center text-sm font-bold ${styles[tone]}`}
    >
      {label}
    </div>
  );
}
