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
 * ⚠️⚠️ **전송은 JSON 으로 한다(FormData 아님).** 필드 이름이 한글이기 때문이다 —
 *       까닭은 아래 submitInquiry 안에 적어 뒀다. 한때 FormData 로 바꿨다가
 *       받은 메일의 라벨이 "ÍšŒì‚¬ëª…" 처럼 전부 깨졌다.
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

  /* ⚠️⚠️⚠️ **JSON 으로 보낸다. FormData 로 바꾸지 말 것.**
             까닭은 **필드 이름이 한글**이라서다. multipart/form-data 는 필드
             이름을 `Content-Disposition: form-data; name="회사명"` 이라는
             **HTTP 헤더**에 싣는데, 헤더는 Latin-1 이 기본이라 web3forms 가
             UTF-8 로 디코딩하지 않는다. 그래서 받은 메일의 라벨이 깨졌다 —

               회사명    ->  ÍšŒì‚¬ëª…
               담당자    ->  Ë‹´ë‹¹ìž
               문의내용  ->  Ë¬¸ì ˜ë‚´ìš©

             **값과 제목은 멀쩡했다**(파트 본문은 UTF-8 로 처리된다). 라벨만
             깨지는 것이 이 증상의 특징이다. JSON 은 body 전체가 UTF-8 이고
             키도 본문 안에 있어 그런 일이 없다.

      ⚠️ JSON 이라 CORS **preflight(OPTIONS)** 가 생기는 것은 사실이고,
         **그것은 문제가 아니다.** 한때 그 preflight 를 "될 때 있고 안 될 때
         있는" 증상의 원인으로 의심해 FormData 로 바꿨는데, 진단이 틀렸고 대신
         메일 라벨을 깨뜨렸다.

      ⚠️⚠️ **CORS 에러로 보이면 거의 rate limit 이다.** web3forms 는 429 에
            CORS 헤더를 붙이지 않아, JS 가 상태 코드를 읽지 못하고 브라우저
            콘솔에 "No 'Access-Control-Allow-Origin' header is present" 로
            뜬다. 제한은 **IP 단위**다 — 같은 휴대폰에서 와이파이로는 실패하고
            모바일 데이터로는 성공하는 것으로 가렸다.
            **전송 방식이나 CORS 설정을 고치려 들지 말 것.**

      ⚠️⚠️⚠️ **개발 중 실제 전송 테스트를 반복하지 말 것.** 사무실 IP가 한
              시간 막히고 **같은 네트워크의 사용자까지 함께 막힌다.** 실제로
              그렇게 만들어 놓고 코드를 범인으로 몰았다. 폼 UI 는 status 를
              손으로 바꿔 확인하고, 전송은 배포 후 사용자가 한 번 눌러 본다.

      ⚠️ 필드 이름이 그대로 메일 본문의 라벨이 된다 — access_key · subject ·
         from_name 만 web3forms 의 예약 필드다. */
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `[홈페이지 문의] ${payload.company || payload.name} - ${subjectTopic}`,
      from_name: "유신 F.A 시스템 홈페이지",
      회사명: payload.company,
      담당자: payload.name,
      연락처: payload.phone,
      이메일: payload.email,
      문의분야: payload.category || "선택 안 함",
      문의내용: payload.message,
    }),
  });

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
