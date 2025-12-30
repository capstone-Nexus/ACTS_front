'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo2 from '../public/images/logo2.png';
import Logo from '../public/images/logo.png';

export default function MainHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);

    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    }
    
    sessionStorage.clear();
    localStorage.clear();
    
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    window.location.href = '/';
  };

  return (
    <div className={`w-full h-[80px] fixed flex flex-row justify-between items-center transition-all duration-300 z-50 ${isScrolled ? 'bg-white' : 'bg-none'}`}>
      <div className="w-[600px] h-full ml-[25px] flex flex-row justify-between">
        <Link href="/">
          <Image src={isScrolled ? Logo : Logo2} alt="logo" className="w-[106px] h-[71px]" />
        </Link>

        <div className="w-full h-full flex flex-row justify-center gap-[100px]">
          <Link href="/test" className="w-auto h-full flex items-center">
            <p className={`font-medium text-[18px] ${isScrolled ? 'text-black' : 'text-white'}`}>검사</p>
          </Link>
          <Link href="/consultation" className="w-auto h-full flex items-center">
            <p className={`font-medium text-[18px] ${isScrolled ? 'text-black' : 'text-white'}`}>상담 챗봇</p>
          </Link>
          <Link href="/mypage" className="w-auto h-full flex items-center">
            <p className={`font-medium text-[18px] ${isScrolled ? 'text-black' : 'text-white'}`}>마이페이지</p>
          </Link>
        </div>
      </div>

      <div className="w-auto h-full mr-[50px] gap-[40px] flex flex-row items-center">
        {username ? (
          <>
            <p className={`text-[18px] font-medium ${isScrolled ? 'text-[#3C3C3C]' : 'text-white'}`}>
              <span className={`${isScrolled ? 'text-[#4A8AEE]' : 'text-white'}`}>{username}</span>
              님, 환영합니다!
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              onClick={logoutHandler}
              className={`w-6 h-6 cp duration-200 ${isScrolled ? 'text-black hover:text-[#ff5b5b]' : 'text-white hover:text-[#ff5b5b]'}`}
            >
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
          </>
        ) : (
          <>
            <Link href="/signin">
              <p className={`text-[18px] font-medium ${isScrolled ? 'text-[#4A8AEE] hover:text-[#4a76ee]' : 'text-white'}`}>로그인</p>
            </Link>
            <Link href="/register">
              <p className={`text-[18px] font-medium ${isScrolled ? 'text-[#4A8AEE] hover:text-[#4a76ee]' : 'text-white'}`}>회원가입</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
