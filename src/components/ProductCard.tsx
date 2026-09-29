import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

/**
 * 제품 카드. 원본 사진이 2000년대 초 촬영본이라 화질이 낮다.
 * 꽉 채워 자르지 않고(object-contain) 연한 배경 위에 여백을 두어
 * 확대로 인한 뭉개짐이 드러나지 않게 한다.
 */
export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-all hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-5 sm:p-6">
        <p className="text-xs font-bold tracking-[0.15em] text-brand">
          {product.category}
        </p>
        <h3 className="mt-2 text-lg font-bold text-ink">{product.name}</h3>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted">
          {product.nameEn}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
          {product.summary}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
          상세보기
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
