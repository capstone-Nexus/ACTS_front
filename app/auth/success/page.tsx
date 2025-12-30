'use client';

import { useEffect } from 'react';

export default function AuthSuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accesstoken') || params.get('accessToken');
    const refreshToken = params.get('refreshtoken') || params.get('refreshToken');
    const username = params.get('username') || params.get('userName') || params.get('name');

    if (!accessToken) {
      console.error('accessToken이 없습니다. 로그인 페이지로 이동합니다.');
      window.location.href = '/signin';
      return;
    }

    sessionStorage.setItem('accessToken', accessToken);
    if (username) sessionStorage.setItem('username', username);
    
    if (refreshToken) {
      const twoWeeks = 14 * 24 * 60 * 60;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${twoWeeks}; samesite=lax`;
    }

    window.location.href = '/';
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
      로그인 처리가 완료되었습니다. 잠시 후 메인 페이지로 이동합니다.
    </div>
  );
}