'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import API from '@/lib/axios';
import logo from '../../public/images/logo.png';
import googleIcon from '../../public/images/google.png';
import naverIcon from '../../public/images/naver.png';
import kakaoIcon from '../../public/images/kakao.png';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await API.post('/auth/signin', {
        email: email,
        password: password
      });

      const accessToken = response.data.data.accessToken;
      const refreshToken = response.data.data.refreshToken;
      const username = response.data.data.username;

      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('username', username);

      if (refreshToken) {
        const twoWeeks = 14 * 24 * 60 * 60;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${twoWeeks}; samesite=lax`;
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
      <div className="mt-[188px] bg-white shadow-lg rounded-4xl p-8 w-[500px] h-auto mb-[110px]">
        <Image src={logo} alt="Logo" width={180} height={120} className="mx-auto mt-5 mb-4" />
        <h1 className="text-[40px] font-bold text-center mb-2">로그인</h1>
        <p className="text-[#000000] opacity-70 text-[18px] font-medium text-center mb-6">다양한 기능을 경험해보세요!</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border-1 px-3 rounded-[10px] w-[400px] h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
          </div>

          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border-1 px-3 rounded-[10px] w-[400px] h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="mt-[7px] px-4 py-2 w-[400px] h-[47px] bg-[#4A8AEE] font-bold text-white rounded-[10px] hover:bg-[#4077CE] transition disabled:opacity-50 cp">
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-8">
          <div className="center w-full h-auto flex-row gap-3 mb-4">
            <div className="w-[125px] h-[1px] bg-[#737373]" />
            <div className="text-center text-[#737373] font-medium text-[14px]">소셜 계정으로 로그인</div>
            <div className="w-[125px] h-[1px] bg-[#737373]" />
          </div>

          <div className="flex items-center justify-center gap-6">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cp" disabled={isSubmitting}>
              <Image width={40} height={40} src={googleIcon} alt="Google 로그인" className="rounded-full" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cp" disabled={isSubmitting}>
              <Image width={40} height={40} src={naverIcon} alt="Naver 로그인" className="rounded-full" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cp" disabled={isSubmitting}>
              <Image width={40} height={40} src={kakaoIcon} alt="Kakao 로그인" className="rounded-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
