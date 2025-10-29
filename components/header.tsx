'use client';

import Logo from '@/public/images/logo.png';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <>
      <div className="w-full h-[80px] bg-white flex flex-row justify-between items-center fixed z-100">
        <div className="w-[600px] h-full ml-[25px] flex flex-row justify-between">
          <Link href="/">
            <Image src={Logo} alt="logo" className="w-[106px] h-[71px]" />
          </Link>
          <div className="w-full h-full flex flex-row justify-center gap-[100px]">
            <Link href="/test" className="w-auto h-full center">
              <p className="font-medium text-[18px]">검사</p>
            </Link>
            <Link href="/consultation" className="w-auto h-full center">
              <p className="font-medium text-[18px]">상담 챗봇</p>
            </Link>
            <Link href="/mypage" className="w-auto h-full center">
              <p className="font-medium text-[18px]">마이페이지</p>
            </Link>
          </div>
        </div>
        <div className="w-auto h-full mr-[50px] gap-[40px] flex flex-row items-center">
          <Link href="/signin">
            <p className="text-[#4A8AEE] text-[18px] font-medium">로그인</p>
          </Link>
          <Link href="/register">
            <p className="text-[#4A8AEE] text-[18px] font-medium">회원가입</p>
          </Link>
        </div>
      </div>
    </>
  );
}
