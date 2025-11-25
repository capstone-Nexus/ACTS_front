'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function Mypage() {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      alert('로그인이 필요합니다.');
      router.replace('/signin');
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthChecked) return;

    const token = sessionStorage.getItem('accessToken');

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/my`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        console.log('서버 응답:', data); // 서버 응답 확인용

        if (!res.ok) {
          alert(data.message || '유저 정보를 불러오지 못했습니다.');
          return;
        }

        setUserData(data);
      } catch (err) {
        console.error(err);
        alert('서버 요청 실패');
      }
    };

    fetchUser();
  }, [isAuthChecked]);

  // 로딩 처리
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthChecked) return null;
  if (isLoading || !userData) return <Loading />;

  const birthFormatted = userData.birth?.split('T')[0] || '';

  const mockResult = {
    score: 100
  };

  let message = '';
  let imageUrl = '';

  if (mockResult.score >= 80 && mockResult.score <= 100) {
    message = '최고에요!';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png';
  } else if (mockResult.score >= 50 && mockResult.score < 80) {
    message = '그럭저럭..';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Raised%20Eyebrow.png';
  } else {
    message = '별로에요..';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Crossed-Out%20Eyes.png';
  }

  return (
    <div className="w-full min-h-screen p-[135px] bg-[#F9FAFB] flex flex-row justify-center gap-[60px]">
      <div className="w-[480px] p-[40px] flex flex-col bg-white border border-[#CDD0D4] rounded-[10px]">
        <p className="text-[22px] text-black font-bold">최근 검사</p>

        <div className="w-[400px] h-[130px] bg-[#F9FAFB] border border-[#CDD0D4] rounded-[10px] flex flex-row items-center mt-[30px]">
          <img src={imageUrl} alt="score emoji" width="100" height="100" className="mx-[20px]" />

          <div className="w-[250px] h-full flex flex-col justify-center">
            <p className="text-[14px] font-medium text-[#474747]">현재 나의 점수는...</p>
            <p className="text-[32px] font-bold text-[#474747]">
              <span className="text-[#4A8AEE]">{mockResult.score}</span>점! {message}
            </p>
          </div>
        </div>
      </div>

      <div className="w-[700px] p-[40px] flex flex-col bg-white border border-[#CDD0D4] rounded-[10px]">
        <p className="text-[32px] text-[#4A8AEE] font-bold">{userData.username}</p>

        <p className="text-[22px] text-black font-bold mt-[30px]">내 정보</p>

        <div className="w-auto h-[45px] flex flex-row mt-[30px] gap-[80px]">
          <div className="flex flex-col justify-between">
            <p className="text-[12px] text-[#474747] font-medium">이름</p>
            <p className="text-[16px] text-black font-medium">{userData.username}</p>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-[12px] text-[#474747] font-medium">이메일</p>
            <p className="text-[16px] text-black font-medium">{userData.email}</p>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-[12px] text-[#474747] font-medium">성별</p>
            <p className="text-[16px] text-black font-medium">{userData.gender === 'male' ? '남성' : '여성'}</p>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-[12px] text-[#474747] font-medium">생년월일</p>
            <p className="text-[16px] text-black font-medium">{birthFormatted}</p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#CDD0D4] mt-[30px]" />

        <div className="w-full flex flex-col mt-[40px] p-[30px] border border-[#A5E1FF] bg-[#F6FCFF] rounded-[10px]">
          <p className="text-[18px] text-black font-bold">비밀번호 변경</p>

          <div className="flex flex-col mt-[30px]">
            <p className="text-[12px] text-[#474747] font-medium mb-[5px]">현재 비밀번호</p>
            <input type="password" className="w-full h-[45px] rounded-[10px] border border-[#CDD0D4] bg-[#FDFDFD] p-[14px] text-[14px] focus:outline-none focus:border-2 focus:border-[#4A8AEE]" placeholder="현재 비밀번호 입력" />
          </div>

          <div className="flex flex-col mt-[20px]">
            <p className="text-[12px] text-[#474747] font-medium mb-[5px]">새 비밀번호</p>
            <input type="password" className="w-full h-[45px] rounded-[10px] border border-[#CDD0D4] bg-[#FDFDFD] p-[14px] text-[14px] focus:outline-none focus:border-2 focus:border-[#4A8AEE]" placeholder="새 비밀번호 입력" />
          </div>

          <div className="flex flex-col mt-[20px]">
            <p className="text-[12px] text-[#474747] font-medium mb-[5px]">새 비밀번호 확인</p>
            <input type="password" className="w-full h-[45px] rounded-[10px] border border-[#CDD0D4] bg-[#FDFDFD] p-[14px] text-[14px] focus:outline-none focus:border-2 focus:border-[#4A8AEE]" placeholder="새 비밀번호 확인" />
          </div>

          <button className="w-[130px] h-[45px] bg-[#4A8AEE] flex items-center justify-center mt-[20px] rounded-[10px] duration-200 hover:bg-[#4077CE]">
            <p className="text-white text-[14px] font-medium">비밀번호 변경</p>
          </button>
        </div>
      </div>
    </div>
  );
}
