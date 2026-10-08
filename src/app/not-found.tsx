import Link from "next/link";
import Container from "@/components/Container";
import { products } from "@/data/products";

/**
 * 주소를 잘못 찾아온 사람에게 보이는 화면.
 *
 * ⚠️ 이 파일 하나가 **두 가지**를 다 맡는다 — 코드에서 notFound() 를 부른
 *    경우와, 어떤 라우트에도 안 맞는 주소로 들어온 경우. Next 13.3 부터
 *    루트 app/not-found 가 후자까지 처리한다.
 *
 * ⚠️ metadata 를 export 하지 않는다. not-found.js 는 그것을 읽지 않는다
 *    (읽는 것은 실험 기능인 global-not-found.js 뿐이다). 제목은 루트
 *    레이아웃의 기본값을 그대로 쓴다. robots noindex 는 Next 가 404 응답에
 *    자동으로 넣는다.
 *
 * ⚠️ 루트 레이아웃 안에서 그려지므로 헤더와 푸터가 함께 나온다. 길 잃은
 *    사람에게 전체 메뉴가 바로 보이는 것이 맞다.
 *
 * ⚠️ 제품 일곱 개를 그대로 건다. "홈으로" 버튼 하나만 두면 되돌아가 다시
 *    찾아야 한다 — 오타로 /products/bowl 같은 주소를 친 경우가 가장 흔하고,
 *    그때 필요한 것은 목록이다.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-20 sm:py-28">
      <p className="text-13 font-semibold tracking-[0.02em] text-brand">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        찾으시는 페이지가 없습니다
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
        주소가 바뀌었거나 지워진 페이지입니다. 아래에서 바로 찾아가실 수
        있습니다.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-15 font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98]"
        >
          홈으로
        </Link>
        <Link
          href="/contact/"
          className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-6 py-3.5 text-15 font-semibold text-ink transition hover:border-brand/40 hover:text-brand active:scale-[0.98]"
        >
          제작 문의하기
        </Link>
      </div>

      <div className="mt-12 border-t border-line pt-8">
        <p className="text-13 font-semibold text-muted">제품 바로가기</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
          {products.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/products/${p.slug}/`}
                className="text-sm text-ink transition-colors hover:text-brand"
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
