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
 */

export type InquiryPayload = {
  company: string;
  name: string;
  phone: string;
  email: string;
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

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `[홈페이지 문의] ${payload.company || payload.name} - ${payload.category}`,
      from_name: "유신 F.A 시스템 홈페이지",
      회사명: payload.company,
      담당자: payload.name,
      연락처: payload.phone,
      이메일: payload.email,
      문의분야: payload.category,
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
