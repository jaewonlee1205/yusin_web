import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

/**
 * 가로 카드. 제품 상세 페이지 아래 "다른 제품" 에서만 쓴다.
 *
 * ProductCard(목록 페이지용 세로 카드)를 그대로 쓰다가 바꿨다. 그 카드는
 * 1440에서 347x437px 인데, "다른 제품" 은 보던 제품을 다 읽은 뒤 곁눈으로
 * 보는 보조 목록이라 본문과 같은 무게를 가질 자리가 아니다. 가로로 누이면
 * 347x96px 이 되고 섹션이 698 -> 357px 가 된다.
 *
 * ProductCard 에 변형(prop)을 더하지 않고 파일을 따로 뒀다. 그쪽은 사진
 * 채우기.호버 막.요약 줄 수까지 측정해 맞춰 둔 것이 많아, 분기를 넣으면
 * 두 쓰임새의 근거가 한 파일에서 섞인다.
 *
 * 영문명은 넣지 않는다. 글 칸이 211px(1440 3열에서 카드 347 - 썸네일 96 -
 * 간격 16 - 패딩 24)인데 컨트롤러의 "Parts Feeder Controller" 가 230px 라
 * 혼자 잘린다. 글자를 더 줄이거나 truncate 로 자르는 것보다 빼는 쪽이
 * 낫다 - 분류(최대 68px)와 제품명(최대 73px "우레탄 코팅")만 두면 어느
 * 카드도 잘리지 않고, 영문명은 들어간 뒤 h1 아래에 있다.
 *
 * 사진 위 "상세보기" 막은 쓰지 않는다. 96px 썸네일에 글자가 들어가지 않는다.
 * 호버는 세로 카드와 같은 언어로 두되 한 단계 약하게 한다(-translate-y-0.5,
 * shadow-md).
 */
export default function ProductRowCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-line bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
    >
      {/* 원본이 모두 4:3 이라 contain 으로도 한 픽셀 잘리지 않는다. 받침을
          카드와 같은 흰색으로 둬, 비율이 4:3 이 아닌 두 장(진동기 0.98,
          컨트롤러 1.06)도 회색 띠 없이 제품컷으로 보인다. */}
      <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded bg-white">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="96px"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* min-w-0 — 없으면 플렉스 항목의 최소 폭이 내용 크기라 좁은 화면에서
          썸네일을 밀어낸다. */}
      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-[0.15em] text-brand">
          {product.category}
        </p>
        <h3 className="mt-0.5 text-[15px] font-bold text-ink transition-colors duration-300 group-hover:text-brand">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
