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

    setTimeout(() => {
      router.push('/');
    }, 1000);
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
      로그인 처리 중입니다
    </div>
  );
}