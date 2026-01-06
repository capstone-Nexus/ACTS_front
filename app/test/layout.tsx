'use client';

import { useEffect, useRef } from 'react';

export default function TestLayout({ children }: { children: React.ReactNode }) {
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false 
        });
        streamRef.current = stream;
      } catch (error) {
        console.error('카메라 접근 실패:', error);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}
