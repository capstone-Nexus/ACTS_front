import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/images/logo.png";
export default function Footer() {
  return (
    <div className="w-full h-50 border-t botder-[#737373] bg-white center flex-row gap-100">
      <div className="w-130 h-50 center flex-col gap-9">
        <div className="w-full h-auto flex align-center flex-row justify-between">
          <Link href="/"><p className="text-[20px] font-semibold text-[#3C3C3C]">서비스 소개</p></Link>
          <Link href="/"><p className="text-[20px] font-semibold text-[#3C3C3C]">ADHD 설문</p></Link>
          <Link href="/"><p className="text-[20px] font-semibold text-[#3C3C3C]">ADHD 테스트</p></Link>
          <Link href="/"><p className="text-[20px] font-semibold text-[#3C3C3C]">상담 챗봇</p></Link>
        </div>
        <div className="w-full h-auto">
          <p className="text-[#939393] font-medium text-[14px]">ACTS  |  경상북도 봉호로 14 (경북소프트웨어고등학교)</p>
          <p className="text-[#939393] font-medium text-[14px]">Copyright © 2025 ACTS. All rights reserved</p>
        </div>
      </div>
      <Image src={Logo} alt="로고" className="w-40"/> 
    </div>
  );
}
