'use client';

import { useEffect, useState } from 'react';
import Logo from '@/public/images/logo.png';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const logoutHandler = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <div className="w-full h-[80px] bg-white flex flex-row justify-between items-center fixed z-100">
      <div className="w-[600px] h-full ml-[25px] flex flex-row justify-between">
        <Link href="/">
          <Image src={Logo} alt="logo" className="w-[106px] h-[71px]" />
        </Link>
        <div className="w-full h-full flex flex-row justify-center gap-[100px]">
          <Link href="/test" className="w-auto h-full flex items-center">
            <p className="font-medium text-[18px]">검사</p>
          </Link>
          <Link href="/consultation" className="w-auto h-full flex items-center">
            <p className="font-medium text-[18px]">상담 챗봇</p>
          </Link>
          <Link href="/mypage" className="w-auto h-full flex items-center">
            <p className="font-medium text-[18px]">마이페이지</p>
          </Link>
        </div>
      </div>

      <div className="w-auto h-full mr-[50px] gap-[40px] flex flex-row items-center">
        {username ? (
          <>
            <p className={`text-[18px] font-medium text-[#3C3C3C]`}>
              <span className="text-[#4A8AEE]">{username}</span>
              님, 환영합니다!
            </p>
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" onClick={logoutHandler} className={`w-6 h-6 cp duration-200 text-black hover:text-[#ff5b5b]`}>
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
          </>
        ) : (
          <>
            <Link href="/signin">
              <p className="text-[#4A8AEE] text-[18px] font-medium hover:text-[#4a76ee]">로그인</p>
            </Link>
            <Link href="/register">
              <p className="text-[#4A8AEE] text-[18px] font-medium hover:text-[#4a76ee]">회원가입</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
