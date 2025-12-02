'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Up from '@/public/images/up.svg';
import Loading from '@/components/loading';
import MessageBubble from '@/app/consultation/components/MessageBubble';
import axios from 'axios';

export default function Consultation() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([{ sender: 'bot', content: '안녕하세요! ADHD 관련 질문을 해주세요!' }]);
  const [input, setInput] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);


  const chatRef = useRef<HTMLDivElement>(null);

  const sendToGPT = async (text: string) => {
    try {
      const response = await axios.post('/api/chat', { message: text });
      return response.data.reply || '응답 생성 오류';
    } catch (error) {
      return '서버와 통신 오류';
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", content: input };
    setMessages(prev => [...prev, userMessage]);

    const userInput = input;
    setInput("");

    setIsBotThinking(true);
    setMessages(prev => [...prev, { sender: "bot", content: "답변 생성중..." }]);

    const botResponse = await sendToGPT(userInput);

    setMessages(prev => {
      const filtered = prev.filter(msg => msg.content !== "답변 생성중...");
      return [...filtered, { sender: "bot", content: botResponse }];
    });

    setIsBotThinking(false);
  };


  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 200);
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

      <div className="w-full flex justify-center px-4 pb-6 pt-4 bg-white">
        <div className="w-[60%] h-[60px] bg-[#F5F5F5] border border-[#D2D2D2] rounded-[60px] p-[10px] flex items-center justify-between">
          <input
            className="flex-1 bg-transparent focus:outline-none ml-2 text-base"
            placeholder="무엇을 알고 싶으세요?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyUp={e => {
              if (e.key === 'Enter') {
                sendMessage();
              }
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
