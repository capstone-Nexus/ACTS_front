'use client';

import Logo from '@/public/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TestHeader() {
  const router = useRouter();

  const handleExit = () => {
    const result = confirm('검사를 종료하시겠습니까? 현재까지 진행된 내용은 저장되지 않습니다.');

    if (result) {
      router.push('/');
    }
  };

  return (
    <div className="w-full h-20 bg-white flex flex-row items-center justify-between fixed top-0 left-0 z-9999 shadow-sm">
      <Link href={'/'}>
        <Image src={Logo} alt="logo" className="w-26.5 h-17.75 ml-6.25" />
      </Link>

      <button onClick={handleExit} className="text-[18px] font-medium text-[#FF0000] mr-[50px] hover:text-[#ff5b5b] duration-200 cp">
        검사 종료
      </button>
    </div>
  );
}
