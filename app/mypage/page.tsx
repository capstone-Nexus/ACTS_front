'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import API from '@/lib/axios';

export default function Mypage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.replace('/signin');
      return;
    }

    const getUser = async () => {
      try {
        const response = await API.get('/user/my');
        setUserData(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        alert('유저 정보를 불러오지 못했습니다.');
        setIsLoading(false);
      }
    };

    getUser();

    return () => {
      ``;
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (isLoading || !userData) {
    return <Loading />;
  }

  // 생년월일 포맷
  const birthFormatted = userData.birth?.split('T')[0] || '';

  // 검사 연동할 때 까지 임시 데이터
  const score = 100;
  let message = '';
  let imageUrl = '';

  if (score >= 80) {
    message = '최고에요!';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png';
  } else if (score >= 50) {
    message = '그럭저럭..';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Raised%20Eyebrow.png';
  } else {
    message = '별로에요..';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Crossed-Out%20Eyes.png';
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await API.patch('/user/password', {
        currentPassword: currentPassword,
        newPassword: newPassword
      });
      alert('비밀번호가 변경되었습니다.');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(err.response?.data?.message || '비밀번호 변경 실패');
    }
  };

  return (
    <div className="w-full min-h-screen p-[135px] bg-[#F9FAFB] flex flex-row justify-center gap-[60px]">
      <div className="w-[480px] p-[40px] flex flex-col bg-white border border-[#CDD0D4] rounded-[10px]">
        <p className="text-[22px] text-black font-bold">최근 검사</p>

        <div className="w-[400px] h-[130px] bg-[#F9FAFB] border border-[#CDD0D4] rounded-[10px] flex flex-row items-center mt-[30px]">
          <img src={imageUrl} alt="score emoji" width="100" height="100" className="mx-[20px]" />

          <div className="w-[250px] h-full flex flex-col justify-center">
            <p className="text-[14px] font-medium text-[#474747]">현재 나의 점수는...</p>
            <p className="text-[32px] font-bold text-[#474747]">
              <span className="text-[#4A8AEE]">{score}</span>점! {message}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setModalOpen(true);
          }}
          className="w-[120px] h-[45px] center text-white font-medium text-[14px] bg-[#4a8aee] rounded-[10px] cp duration-200 hover:bg-[#4077CE] mt-auto ml-auto"
        >
          상세 보기 →
        </button>
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
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full h-[45px] rounded-[10px] border border-[#CDD0D4] bg-[#FDFDFD] p-[14px] text-[14px] focus:outline-none focus:border-2 focus:border-[#4A8AEE]" placeholder="현재 비밀번호 입력" />
          </div>

          <div className="flex flex-col mt-[20px]">
            <p className="text-[12px] text-[#474747] font-medium mb-[5px]">새 비밀번호</p>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full h-[45px] rounded-[10px] border border-[#CDD0D4] bg-[#FDFDFD] p-[14px] text-[14px] focus:outline-none focus:border-2 focus:border-[#4A8AEE]" placeholder="새 비밀번호 입력" />
          </div>

          <div className="flex flex-col mt-[20px]">
            <p className="text-[12px] text-[#474747] font-medium mb-[5px]">새 비밀번호 확인</p>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full h-[45px] rounded-[10px] border border-[#CDD0D4] bg-[#FDFDFD] p-[14px] text-[14px] focus:outline-none focus:border-2 focus:border-[#4A8AEE]" placeholder="새 비밀번호 확인" />
          </div>

          <button onClick={handlePasswordChange} className="w-[130px] h-[45px] bg-[#4A8AEE] flex items-center justify-center mt-[20px] rounded-[10px] duration-200 hover:bg-[#4077CE] cp">
            <p className="text-white text-[14px] font-medium">비밀번호 변경</p>
          </button>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-100">
          <div className="w-[60%] h-[600px] bg-white rounded-[20px] p-10"></div>
        </div>
      )}
    </div>
  );
}
