'use client';

import { useEffect, useState } from 'react';
import Logo from '@/public/images/logo.png';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
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
          setUsername(data.username);
          // accessToken도 필요하면 여기서 저장 가능
          localStorage.setItem('accessToken', data.accessToken);
        } else {
          // refreshToken 만료 → 로그아웃 처리
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('username');
          setUsername(null);
        }
      } catch (err) {
        console.error('로그인 상태 확인 중 오류:', err);
        setUsername(null);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUsername(null);
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
            <p className="text-[#3C3C3C] text-[18px] font-medium">
              <span className="text-[#4A8AEE]">{username}</span>님, 환영합니다!
            </p>
            <button onClick={handleLogout} className="text-[#4A8AEE] text-[18px] font-medium">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/signin">
              <p className="text-[#4A8AEE] text-[18px] font-medium">로그인</p>
            </Link>
            <Link href="/register">
              <p className="text-[#4A8AEE] text-[18px] font-medium">회원가입</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}