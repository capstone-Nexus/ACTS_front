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


    const checkLoginStatus = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          setUsername(null);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.username); // 로그인 상태 유지
        } else {
          // refreshToken 만료 → 로그아웃 처리
          localStorage.removeItem('refreshToken');
          setUsername(null);
        }
      } catch (err) {
        console.error('로그인 상태 확인 중 오류:', err);
        setUsername(null);
      }
    };

    checkLoginStatus();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <p className={`text-[18px] font-medium ${isScrolled ? 'text-[#3C3C3C]' : 'text-white'}`}>
            <span className={`${isScrolled ? 'text-[#4A8AEE]' : 'text-white'}`}>{username}</span>
            님, 환영합니다!
          </p>
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
