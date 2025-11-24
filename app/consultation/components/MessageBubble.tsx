import Image from "next/image";
import Chatbot from "@/public/images/chatbot.png";

interface MessageBubbleProps {
  sender: 'user' | 'bot';
  content: string;
}

export default function MessageBubble({ sender, content }: MessageBubbleProps) {
  const isUser = sender === 'user';

  if (isUser) {
    return (
      <div
        className="max-w-[600px] border rounded-[18px] px-[18px] py-[10px] 
          bg-[#F5F5F5] border-[#D2D2D2] self-end"
      >
        <p className="text-[17px] text-black whitespace-pre-wrap">{content}</p>
      </div>
    );
  }
  return (
    <div className="w-auto flex flex-row gap-4">
      <div className="w-[50px] h-[50px] rounded-full bg-black overflow-hidden flex items-center justify-center">
        <Image src={Chatbot} alt="chatbot" width={50} height={50} />
      </div>
      <div
        className="max-w-[600px] border rounded-[18px] px-[18px] py-[10px] 
        bg-[#DFF4FF] border-[#ADE4FF] self-start"
      >
        <p className="text-[17px] text-black whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
