'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accesstoken');
    const refreshToken = params.get('refreshtoken');
    const username = params.get('username');

    if (accessToken) sessionStorage.setItem('accessToken', accessToken);
    if (username) sessionStorage.setItem('username', username);
    
    if (refreshToken) {
      const twoWeeks = 14 * 24 * 60 * 60;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${twoWeeks}; samesite=lax`;
    }

    window.location.href = '/';
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
      로그인 처리가 완료되었습니다. 잠시 후 메인 페이지로 이동합니다.
    </div>
  );
}