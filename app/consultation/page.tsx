'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Up from '@/public/images/up.svg';
import Loading from '@/components/loading';
import MessageBubble from '@/app/consultation/components/MessageBubble';
import axios from 'axios';

interface ChatMessage {
  sender: 'user' | 'bot';
  content: string;
}

export default function Consultation() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([{ sender: 'bot', content: '안녕하세요! 무엇을 도와드릴까요?' }]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const sendToGPT = async (text: string) => {
    try {
      const res = await axios.post('/api/chat', { message: text });
      return res.data.reply || '응답 생성 오류';
    } catch (error: any) {
      return '서버와 통신 오류';
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    const userInputBackup = input;
    setInput('');

    const botResponse = await sendToGPT(userInputBackup);
    const botMsg: ChatMessage = { sender: 'bot', content: botResponse };

    setMessages(prev => [...prev, botMsg]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="w-full h-screen flex flex-col bg-white pt-[80px]">
      <div className="flex-1 w-full flex justify-center overflow-y-auto px-4" ref={chatRef}>
        <div className="w-[60%] flex flex-col gap-[75px] py-6">
          {messages.map((msg, index) => (
            <MessageBubble key={index} sender={msg.sender} content={msg.content} />
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center px-4 pb-6 pt-4 bg-white border-t border-gray-100">
        <div className="w-[60%] h-[60px] bg-[#F5F5F5] border border-[#D2D2D2] rounded-[60px] p-[10px] flex items-center justify-between">
          <input
            className="flex-1 bg-transparent focus:outline-none ml-2 text-base"
            placeholder="무엇을 알고 싶으세요?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyUp={e => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button className="w-[45px] h-[45px] bg-[#4A8AEE] rounded-full flex items-center justify-center hover:bg-[#3A7ADE] transition-colors flex-shrink-0" onClick={sendMessage}>
            <Image src={Up} alt="up" width={22} height={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
