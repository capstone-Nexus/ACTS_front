import Image from 'next/image';
import Chatbot from '@/public/images/chatbot.png';

export default function MessageBubble({ sender, content }: { sender: string; content: string }) {
  // gpt응답 예쁘게 바꾸는b
  const formatText = (text: string) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  if (sender === 'user') {
    return (
      <div
        className="max-w-[600px] border rounded-tl-xl rounded-tr-xl rounded-bl-xl px-[18px] py-[10px] 
          bg-[#F5F5F5] border-[#D2D2D2] self-end"
      >
        <p className="text-[17px] text-black whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  const isEmpty = !content || content.length === 0;

  return (
    <div className="w-auto flex flex-row gap-4">
      <div className="w-[50px] h-[50px] rounded-full bg-black overflow-hidden flex items-center justify-center">
        <Image src={Chatbot} alt="chatbot" width={50} height={50} />
      </div>
      <div
        className="max-w-[600px] border rounded-tl-xl rounded-tr-xl rounded-br-xl px-[18px] py-[10px]
        bg-[#DFF4FF] border-[#ADE4FF] self-start"
      >
        {isEmpty ? (
          <div className="flex items-center gap-[6px] h-[26px]" aria-label="AI가 응답을 생성하는 중입니다">
            <span className="w-[7px] h-[7px] rounded-full bg-[#4A8AEE] animate-typing-dot [animation-delay:0ms]" />
            <span className="w-[7px] h-[7px] rounded-full bg-[#4A8AEE] animate-typing-dot [animation-delay:200ms]" />
            <span className="w-[7px] h-[7px] rounded-full bg-[#4A8AEE] animate-typing-dot [animation-delay:400ms]" />
          </div>
        ) : (
          <div className="text-[17px] text-black" dangerouslySetInnerHTML={{ __html: formatText(content) }} />
        )}
      </div>
    </div>
  );
}