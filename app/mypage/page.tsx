'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Modal from './components/Modal';
import RadarChart from './components/RadarChart';
import API from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTestResults } from '@/store/slices/testResultSlice';
import { fetchUserData } from '@/store/slices/userSlice';

export default function Mypage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentResult, previousResult } = useAppSelector((state) => state.testResult);
  const { userData } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset';
  }, [modalOpen]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      toast.error('로그인이 필요합니다.', { duration: 2000 });
      router.replace('/signin');
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUserData()).unwrap(),
          dispatch(fetchTestResults()).unwrap()
        ]);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router, dispatch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        dispatch(fetchTestResults());
      }
    };

    const handleFocus = () => {
      dispatch(fetchTestResults());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  if (isLoading || !userData) {
    return <Loading />;
  }

  const birthFormatted = userData.birth?.split('T')[0] || '';
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  const score = currentResult ? Math.round(currentResult.p_final * 100) : 0;
  let message = '';
  let imageUrl = '';

  if (score >= 80) {
    message = '높은 경향';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Anxious%20Face%20with%20Sweat.png';
  } else if (score >= 60) {
    message = '약간 높음';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Raised%20Eyebrow.png';
  } else if (score >= 40) {
    message = '보통';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Slightly%20Smiling%20Face.png';
  } else if (score >= 20) {
    message = '낮음';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face.png';
  } else {
    message = '매우 낮음';
    imageUrl = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png';
  }

  const currentDomainScores = currentResult?.cat_score ? {
    simple: currentResult.cat_score.simple || 0,
    sustained: currentResult.cat_score.sustained || 0,
    interference: currentResult.cat_score.interference || 0,
    divided: currentResult.cat_score.divided || 0,
    working_memory: currentResult.cat_score.working_memory || 0,
  } : null;

  const previousDomainScores = previousResult?.cat_score ? {
    simple: previousResult.cat_score.simple || 0,
    sustained: previousResult.cat_score.sustained || 0,
    interference: previousResult.cat_score.interference || 0,
    divided: previousResult.cat_score.divided || 0,
    working_memory: previousResult.cat_score.working_memory || 0,
  } : undefined;

  console.log('📊 Mypage - currentResult:', currentResult);
  console.log('📊 Mypage - previousResult:', previousResult);
  console.log('📊 Mypage - currentDomainScores:', currentDomainScores);
  console.log('📊 Mypage - previousDomainScores:', previousDomainScores);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await API.patch('/user/password', {
        currentPassword: currentPassword,
        newPassword: newPassword
      });
      toast.success('비밀번호가 변경되었습니다.');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || '비밀번호 변경 실패');
    }
  };

  return (
    <div className="w-full min-h-screen p-[135px] bg-[#F9FAFB] flex flex-row justify-center gap-[60px]">
      <div className="w-[480px] min-h-[400px] px-[30px] flex flex-col bg-white border border-[#CDD0D4] rounded-[10px]">
        <p className="text-[22px] text-black font-bold mt-[15px]">최근 검사</p>

        {currentResult ? (
          <>
            <div className="w-[400px] min-h-[130px] bg-[#F9FAFB] border border-[#CDD0D4] rounded-[10px] flex flex-row items-center mt-[15px]">
              <img alt="score emoji" src={imageUrl} width="100" height="100" className="mx-[20px]" />

              <div className="flex-1 h-full flex flex-col justify-center">
                <p className="text-[14px] font-medium text-[#474747]">ADHD 가능성 점수</p>
                <p className="text-[32px] font-bold text-[#474747]">
                  <span className="text-[#4A8AEE]">{score}</span>점
                </p>
                <p className="text-[14px] font-medium text-[#737373]">{message}</p>
              </div>
            </div>

            {/* 요일 정보 */}
            <div className="w-full mt-[20px] p-[15px] bg-[#F0F5FF] border border-[#B2D0FF] rounded-[10px]">
              <p className="text-[12px] font-medium text-[#4A8AEE] mb-2">
                📅 요일별 검사 기록
              </p>
              {currentResult && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] text-[#737373]">
                    최근: <span className="font-semibold text-[#4A8AEE]">{dayNames[currentResult.day_of_week]}</span>
                  </span>
                  {previousResult && (
                    <>
                      <span className="text-[11px] text-[#737373]">•</span>
                      <span className="text-[11px] text-[#737373]">
                        이전: <span className="font-semibold text-[#9CA3AF]">{dayNames[previousResult.day_of_week]}</span>
                      </span>
                    </>
                  )}
                </div>
              )}
              <p className="text-[11px] text-[#737373] leading-relaxed">
                {previousDomainScores 
                  ? '서로 다른 요일의 검사 결과를 비교하고 있어요. 다른 요일에 추가로 검사해보세요!'
                  : '다른 요일에 검사를 진행하면 이전 결과와 비교할 수 있어요.'}
              </p>
            </div>

            {/* 레이더 차트 */}
            {currentDomainScores && (
              <div className="w-full mt-[20px] p-[20px] bg-[#F9FAFB] border border-[#CDD0D4] rounded-[10px]">
                <p className="text-[16px] font-bold text-black mb-3">영역별 분석</p>
                <RadarChart 
                  currentData={currentDomainScores}
                  previousData={previousDomainScores}
                />
              </div>
            )}

            <button
              onClick={async () => {
                await dispatch(fetchTestResults());
                setModalOpen(true);
              }}
              className="w-[120px] h-[45px] mb-[15px] center text-white font-medium text-[14px] bg-[#4a8aee] rounded-[10px] cp duration-200 hover:bg-[#4077CE] mt-auto ml-auto"
            >
              상세 보기 →
            </button>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-[18px] font-medium text-[#737373] text-center mb-6">
              아직 테스트를 진행하지 않았습니다.
            </p>
            <p className="text-[14px] text-[#737373] text-center mb-8">
              테스트를 진행하고 상세정보를 받아보세요.
            </p>
            <Link
              href="/test/survey"
              className="px-6 py-3 bg-[#4A8AEE] text-white text-[14px] font-medium rounded-[10px] hover:bg-[#4077CE] transition-colors"
            >
              테스트 시작하기 →
            </Link>
          </div>
        )}
      </div>

      <div className="w-[700px] min-h-[400px] p-[40px] flex flex-col bg-white border border-[#CDD0D4] rounded-[10px]">
        <p className="text-[32px] text-[#4A8AEE] font-bold">{userData.username}</p>

        <p className="text-[22px] text-black font-bold mt-[30px]">내 정보</p>

        <div className="w-full min-h-[45px] flex flex-row mt-[30px] gap-[80px]">
          <div className="flex flex-col justify-between min-h-[45px]">
            <p className="text-[12px] text-[#474747] font-medium">이름</p>
            <p className="text-[16px] text-black font-medium">{userData.username}</p>
          </div>

          <div className="flex flex-col justify-between min-h-[45px]">
            <p className="text-[12px] text-[#474747] font-medium">이메일</p>
            <p className="text-[16px] text-black font-medium">{userData.email}</p>
          </div>

          <div className="flex flex-col justify-between min-h-[45px]">
            <p className="text-[12px] text-[#474747] font-medium">성별</p>
            <p className="text-[16px] text-black font-medium">{userData.gender === 'male' ? '남성' : '여성'}</p>
          </div>

          <div className="flex flex-col justify-between min-h-[45px]">
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

      {currentResult && (
        <Modal 
          isOpen={modalOpen} 
          setModalOpen={setModalOpen}
          testResult={currentResult}
        />
      )}
    </div>
  );
}
