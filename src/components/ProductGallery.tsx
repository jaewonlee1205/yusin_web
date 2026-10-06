"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * 제품 상세의 사진 칸. 썸네일을 누르면 위 큰 사진이 바뀐다.
 *
 * 사진이 한 장인 제품(진동기·호퍼피더·컨트롤러)에서는 썸네일 줄을 아예
 * 그리지 않는다 — 고를 것이 없는데 줄만 남으면 비어 보인다.
 *
 * 대신 lg 에서는 그 자리(84px)를 비워 둔다. 썸네일 줄이 없으면 이 칸이 384px
 * 로 끝나 오른쪽 칸(상세 페이지)이 맞출 바닥을 잃는다 — 거기 lg:mt-auto 가
 * 사양 표와 버튼을 칸 바닥에 붙이는데, 밀어 낼 공간이 없어지면 표가 위로
 * 붙어 설명과의 간격이 24px 이 된다(사진이 여러 장인 제품은 53.5px). 일곱
 * 제품의 오른쪽 리듬이 제각각으로 보이던 이유다. 84 = 썸네일 72(w-24 를
 * 4:3 으로 그린 높이) + mt-3 12 다.
 *
 * lg 미만은 한 칸으로 쌓여 맞출 상대가 없으므로 자리를 두지 않는다.
 *
 * 받침은 흰색이다. 원본이 2000년대 초 현장 촬영본이라 배경이 제각각인데,
 * 흰 받침이면 비율이 4:3 이 아닌 사진도 띠를 두른 것처럼 보이지 않는다
 * (ProductCard 와 같은 판단이다).
 */
export default function ProductGallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const [picked, setPicked] = useState(0);
  const cover = images[picked] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-card">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
        />
      </div>

      {images.length === 1 && (
        <div aria-hidden="true" className="hidden lg:block lg:h-[5.25rem]" />
      )}

      {images.length > 1 && (
        <ul className="mt-3 flex gap-3">
          {images.map((img, i) => {
            const on = i === picked;
            return (
              <li key={img.src}>
                <button
                  type="button"
                  aria-label={`사진 ${i + 1} 보기`}
                  aria-current={on ? "true" : undefined}
                  onClick={() => setPicked(i)}
                  className={`relative block aspect-[4/3] w-24 overflow-hidden rounded-lg border bg-white transition-colors ${
                    on ? "border-navy" : "border-line hover:border-navy/40"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
