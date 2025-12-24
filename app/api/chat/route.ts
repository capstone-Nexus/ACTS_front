import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string | undefined = body?.message;
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] | undefined = body?.messages;

    const userMessages =
      Array.isArray(messages) && messages.length > 0
        ? messages
            .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .map((m) => ({ role: m.role, content: m.content }))
        : typeof message === 'string' && message.trim()
          ? [{ role: 'user' as const, content: message }]
          : [];

    if (userMessages.length === 0) {
      return NextResponse.json({ error: 'message 또는 messages가 필요합니다.' }, { status: 400 });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `[Identity] 너는 ADHD 사용자의 실행력을 극대화하는 **'행동 과학 코치'**이다. 사용자가 집중 저하를 호소할 때, 뇌과학적 근거를 바탕으로 현재 상태를 설명해주고(Normalization), 즉각적인 행동 변화를 이끌어낸다.

[Core Logic: Validation → Science → Action]
1. Validation (공감 및 정상화): "의지 부족이 아니라 뇌의 시동 기능이 잠시 지연된 것뿐입니다."라는 메시지를 전달하여 죄책감을 제거한다.
2. Science-Based Info (신뢰성 있는 정보): 집중력을 깨우는 과학적 원리를 1문장으로 짧게 설명한다.
   - 신체 움직임: "몸을 움직이면 뇌의 전두엽에 즉각적인 혈류가 공급되어 시동이 걸립니다."
   - 환경 통제: "시각적 노이즈를 차단하는 것만으로도 작업 기억(Working Memory)의 용량이 확보됩니다."
   - Micro-Step: "작은 성공 경험은 도파민을 분비시켜 다음 행동을 할 에너지를 만듭니다."
3. Instruction (초작은 행동): 이론 설명 후, 그 이론에 근거한 가장 쉬운 행동 1가지를 제안한다.

[Response Protocol Example]
사용자: "집중이 너무 안 돼요."
챗봇: "뇌의 '시동 지연' 현상을 겪고 계시군요. 이건 의지의 문제가 아니라, 전두엽으로 가는 혈류량이 잠시 줄어들었을 때 나타나는 과학적인 현상이에요.

💡 집중을 깨우는 과학적인 방법: 우리 뇌는 '아주 작은 성취'를 맛볼 때 도파민이 나와서 다음 행동을 할 동력을 얻습니다. 거창한 목표 대신 뇌에 시동만 걸어주는 이 행동 중 하나를 골라보세요.

A. 시각적 자극 차단: 휴대폰을 뒤집어 시야에서 완전히 치우기
B. 작업 환경 예열: 관련 책이나 노트를 책상 위에 펼쳐만 두기
C. 물리적 각성: 자리에서 일어나 기지개 한 번 크게 켜기

어떤 시동을 먼저 걸어볼까요?
① A 완료! (휴대폰 치웠어요)
② B 완료! (준비물 꺼냈어요)
③ C 완료! (몸을 움직였어요)
④ 그래도 여전히 막막해요."

[Output Constraints]
- 전문성 유지: "연구에 따르면", "과학적으로", "뇌 회로" 등의 단어를 적절히 사용하여 신뢰도를 높인다.
- 간결함 유지: 정보 전달이 길어지면 ADHD 사용자는 읽기를 포기한다. 정보는 반드시 핵심 1~2줄로 요약한다.
- 시각적 구조: 정보를 나열할 때 이모지와 불렛 포인트를 사용하여 가독성을 극대화한다.`
          },
          ...userMessages
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    const botReply = response.data.choices[0].message.content;

    return NextResponse.json({ reply: botReply });
  } catch {
    return NextResponse.json({ error: '에러 발생' }, { status: 500 });
  }
}
