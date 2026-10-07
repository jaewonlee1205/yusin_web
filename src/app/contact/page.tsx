import type { Metadata } from "next";
import Container from "@/components/Container";
import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "파츠피더 제작 문의. 공급할 부품의 종류와 필요한 공급 속도를 알려 주시면 설계 방향과 예상 납기를 회신드립니다.",
};

export default function ContactPage() {
  return (
    <>
      {/* 전에는 55자라 320·360px 에서 세 줄이 되어, 이 배너만 232 -> 258px 로
          길었다. 뜻은 그대로 두고 길이만 줄였다.

          그 뒤 PageHero 가 sm 부터 lead 에 한 줄만 비우게 바뀌면서 앞머리
          "부품 " 을 한 번 더 덜었다. 43자일 때 글 폭이 573.8px 로 640px
          칸(560.8px)을 13px 넘겨, 15개 배너 중 이 페이지만 640~767 에서
          두 줄이었다. 제목이 "문의하기" 고 바로 아래가 문의 양식이라
          "부품" 을 안 적어도 읽힌다.

          "일정" 이었던 자리가 "납기" 다. 이 페이지는 이미 그 말을 쓰고 있다 —
          오른쪽 "이런 내용을 알려 주세요" 가 희망 납기를 묻고, InquiryForm 의
          안내문도 그렇다. 방문자는 희망 납기를 적어 보내는데 회신은 일정으로
          한다고 적혀 있었다. "일정" 은 회의 일정처럼도 읽힌다.

          ⚠️ "예상 납기" 로는 못 늘린다 — 글 폭이 573.8px 가 되어 위에 적은
             13px 초과가 그대로 재현된다. 검색 설명 쪽은 폭 제약이 없어
             "예상" 을 붙여 두었다(회신이 확정 납기가 아니라는 뜻이 산다).

          ⚠️ "제작 가능 여부와" 였던 자리가 "설계 방향과" 다(세 자 짧다).
             앞말이 "못 만드는 것도 있다" 로 읽힌다는 말을 들어 걷었다 —
             만드는 것은 전제로 두고 **무엇을 어떻게** 만 알린다. 같은 뜻의
             말이 ContactCTA 본문과 company.ts 의 process 01 output 에도
             있어 함께 고쳤다. */}
      <PageHero
        eyebrow="CONTACT"
        title="문의하기"
        lead="샘플이나 도면 한 장이면 됩니다. 설계 방향과 납기를 회신드립니다."
      />

      <div className="py-14 sm:py-20">
        <Container>
          {/* 폼 하나뿐이라 가운데 한 칸이다.

              한때 오른쪽에 사이드바가 있었다(lg:grid-cols-[1.4fr_1fr]) —
              "도입 프로세스" 와 "문의처" 두 구역이 회색 박스 하나에 들어
              있었는데 둘 다 걷어 달라는 요청에 통째로 뺐다.

              ⚠️ 그래서 이 페이지에 **전화번호와 이메일이 없다.** 전화는 헤더
                 (lg 이상에서만)와 푸터 굵은 줄에, 이메일은 푸터 맨 아래 12px
                 한 줄에만 남는다. ContactCTA 는 이 페이지에 붙지 않는다(그
                 컴포넌트가 /contact 를 뺀 9개 페이지용이다). 모바일에서 폼을
                 못 쓰는 사람이 전화를 찾으려면 푸터까지 내려가야 한다는 뜻이다.
                 다시 넣으라는 말이 나오면 이 문단이 그때의 근거다.

              max-w-2xl(672px)은 전에 폼 칸이 597px 이던 것과 비슷하게 잡은
              값이다. 더 넓히면 입력칸 2열이 과하게 벌어진다.

              제목은 왼쪽 정렬 그대로다 — 가운데로 두면 바로 아래 라벨들과
              축이 어긋난다. */}
          <div className="mx-auto max-w-2xl">
            <div>
              {/* 덩어리 단위로 올린다 — 제목 / 폼이 0.90ms 다.
                  입력칸을 하나씩 올리지는 않는다. 입력하러 온 사람이 칸이
                  다 나타날 때까지 기다리게 된다. */}
              <Reveal>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  온라인 문의
                </h2>
              </Reveal>
              <Reveal delay={90} className="mt-8">
                <InquiryForm />
              </Reveal>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
