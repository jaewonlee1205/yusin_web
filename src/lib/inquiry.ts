/**
 * 문의 폼 전송.
 *
 * 운영 서버 없이 정적 호스팅에 올리므로, 브라우저에서 외부 폼 서비스로 바로
 * POST한다. 기본값은 Web3Forms(무료 250건/월, 서버·빌드 설정 불필요).
 *
 * 다른 서비스로 바꿀 일이 생기면 이 파일 하나만 고치면 된다.
 * 엔드포인트와 키는 .env.local 에서 주입한다:
 *
 *   NEXT_PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
 *   NEXT_PUBLIC_FORM_ACCESS_KEY=<web3forms.com에서 발급받은 키>
 *
 * access key는 공개돼도 안전하다. 등록된 수신 이메일로만 전달되며,
 * 키만으로는 수신 주소를 바꾸거나 기존 문의를 읽을 수 없다.
 *
 * ⚠️⚠️ **전송은 FormData 로 한다(JSON 아님).** 까닭은 아래 submitInquiry 안에
 *       적어 뒀다 — 요약하면 JSON 은 CORS preflight 를 부르고 그 preflight 가
 *       간헐적으로 막혀 "될 때 있고 안 될 때 있는" 증상이 났다.
 */

export type InquiryPayload = {
  company: string;
  name: string;
  phone: string;
  email: string;
  /**
   * 문의 분야. **여러 개가 " · " 로 이어진 하나의 문자열**이다 —
   * InquiryForm 이 체크박스 값을 getAll 로 모아 합쳐 넘긴다.
   *
   * ⚠️ 빈 문자열일 수 있다. 분야는 고르지 않아도 보낼 수 있다(라디오이던
   *    때는 첫 칸이 미리 골라져 있어 늘 값이 있었다). 아래 submitInquiry 가
   *    제목과 본문 두 군데서 그 경우를 받는다.
   */
  category: string;
  message: string;
  /** 봇 잡이용 숨김 필드. 값이 채워져 있으면 스팸으로 본다. */
  botcheck?: string;
};

const ENDPOINT =
  process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "";

export class InquiryError extends Error {}

export function isFormConfigured(): boolean {
  return ACCESS_KEY.length > 0;
}

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  if (payload.botcheck) {
    // 사람이 채울 수 없는 필드다. 조용히 성공한 척하고 버린다.
    return;
  }

  if (!isFormConfigured()) {
    throw new InquiryError(
      "문의 폼이 아직 설정되지 않았습니다. 전화나 이메일로 연락 부탁드립니다."
    );
  }

  /* 메일 **제목**에 들어갈 분야. 본문과 달리 줄인다.

     분야를 여러 개 고를 수 있게 되면서 제목이 길어졌다 — 열 개를 다 고르면
     이어 붙인 값만 60자가 넘어 메일함 목록에서 회사명이 잘린다. 그래서 제목은
     "첫 분야 외 N건" 으로 줄이고, **본문 문의분야에는 고른 것을 전부** 넣는다
     (아래 payload.category 그대로).

     하나도 안 골랐으면 "문의" 다. 그냥 두면 제목이 " - " 로 끝나 잘린 것처럼
     보인다. */
  const topics = payload.category ? payload.category.split(" · ") : [];
  const subjectTopic =
    topics.length === 0
      ? "문의"
      : topics.length === 1
        ? topics[0]
        : `${topics[0]} 외 ${topics.length - 1}건`;

  /* ⚠️⚠️⚠️ **FormData 로 보낸다. JSON 으로 되돌리지 말 것.**
             web3forms 공식 예제는 Content-Type: application/json 을 쓰는데,
             그러면 CORS **preflight(OPTIONS)** 가 발생하고 **그 preflight 가
             간헐적으로 차단된다.** 브라우저가 preflight 결과를 캐시하므로 한 번
             통과하면 한동안 성공하고 만료되면 다시 실패해서, "될 때 있고 안 될
             때 있다" 는 증상이 됐다.

             실측으로 가렸다 — 같은 페이지(https://yusin.co.kr)에서 두 방식을
             나란히 호출하고 콘솔 오류를 비교했다 —

               JSON      "Response to preflight request doesn't pass access
                          control check"        -> preflight 단계에서 막힘
               FormData  "No 'Access-Control-Allow-Origin' header is present"
                                                -> preflight 가 없고 POST 가
                                                   서버에 **도달**했다

             FormData 는 Content-Type 이 multipart/form-data 로 자동 설정돼
             **CORS simple request** 가 되고, 그래서 preflight 가 아예 발생하지
             않는다.

      ⚠️ **headers 를 주지 말 것.** 하나라도 직접 넣으면(특히 Content-Type)
         simple request 조건이 깨져 preflight 가 되살아난다. Accept 도 넣지
         않는다 — 없어도 web3forms 는 JSON 을 돌려준다.

      ⚠️ 필드 이름은 JSON 때와 같다. web3forms 는 FormData 의 모든 칸을 메일
         본문에 그대로 넣는다(access_key · subject · from_name 만 예약 필드). */
  const form = new FormData();
  form.append("access_key", ACCESS_KEY);
  form.append(
    "subject",
    `[홈페이지 문의] ${payload.company || payload.name} - ${subjectTopic}`
  );
  form.append("from_name", "유신 F.A 시스템 홈페이지");
  form.append("회사명", payload.company);
  form.append("담당자", payload.name);
  form.append("연락처", payload.phone);
  form.append("이메일", payload.email);
  form.append("문의분야", payload.category || "선택 안 함");
  form.append("문의내용", payload.message);

  const res = await fetch(ENDPOINT, { method: "POST", body: form });

  if (!res.ok) {
    throw new InquiryError(
      "전송에 실패했습니다. 잠시 후 다시 시도하시거나 전화로 연락 부탁드립니다."
    );
  }

  const data: { success?: boolean; message?: string } = await res.json();
  if (!data.success) {
    throw new InquiryError(
      data.message ??
        "전송에 실패했습니다. 잠시 후 다시 시도하시거나 전화로 연락 부탁드립니다."
    );
  }
}
