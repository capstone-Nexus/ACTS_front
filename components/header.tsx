'use client';

import '../app/globals.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import logo from '../public/images/logo.png';

const NAV_ITEMS = [
  { name: '홈', path: '/' },
  { name: '검사', path: '/test' },
  { name: '상담', path: '/consultation' },
  { name: '마이페이지', path: '/mypage' },
];

const Navbar = () => {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);

  // 스크롤 시 navbar 숨김
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY && current > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // localStorage에서 로그인 상태 확인
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // 예: {name, token}
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || '사용자');
      } catch {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  }, []);

  const onLogoClick = () => {
    router.push('/');
  };

  const onNavClick = (path: string) => {
    router.push(path);
  };

  const onLogout = () => {
    localStorage.removeItem('user'); // 토큰/유저 정보 삭제
    setUserName(null);
    router.push('/signin');
  };

  const isLoggedIn = Boolean(userName);

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-[80px] bg-white shadow-md flex items-center justify-between px-6 z-50 transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="ml-[100px]">
        <Image
          src={logo}
          alt="logo"
          width={106}
          height={70}
          onClick={onLogoClick}
          className="cursor-pointer hover:opacity-80 transition"
          priority
        />
      </div>

      <div className="hidden md:flex gap-20 text-[18px] font-medium text-[#3C3C3C]">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavClick(item.path)}
            className="hover:text-[#4A8AEE] transition duration-400"
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-5 mr-[60px]">
        {isLoggedIn ? (
          <>
            <span className="text-[#3C3C3C] font-medium hidden sm:inline">{userName} 님</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white w-[100px] h-[40px] rounded-[10px] hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/signin')}
              className="bg-[#F1F1F1] text-[#737373] w-[90px] h-[40px] rounded-[10px] hover:bg-gray-200 transition"
            >
              로그인
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-[#4A8AEE] text-white w-[100px] h-[40px] rounded-[10px] hover:bg-[#4077CE] transition"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
