'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Modal from './components/Modal';
import RadarChart from './components/RadarChart';
import API from '@/lib/axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getReports, ReportResponse } from '@/lib/reportApi';

export default function Mypage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    gender: string;
    birth: string;
  } | null>(null);
  const [testResult, setTestResult] = useState<ReportResponse | null>(null);
  const [previousResult, setPreviousResult] = useState<ReportResponse | null>(null);
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
        // 사용자 정보 가져오기
        const userResponse = await API.get('/user/my');
        setUserData(userResponse.data.data);
        
        // 백엔드에서 검사 결과 목록 가져오기
        const reports = await getReports();
        
        if (reports && reports.length > 0) {
          // 날짜순으로 정렬 (최신순)
          const sortedReports = reports.sort((a, b) => 
            new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
          );
          
          // 최신 결과
          setTestResult(sortedReports[0]);
          console.log('✅ 최신 검사 결과:', sortedReports[0]);
          
          // 이전 결과 (두 번째)
          if (sortedReports.length > 1) {
            setPreviousResult(sortedReports[1]);
            console.log('✅ 이전 검사 결과:', sortedReports[1]);
          }
        } else {
          console.log('ℹ️ 저장된 검사 결과가 없습니다.');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (isLoading || !userData) {
    return <Loading />;
  }

  const birthFormatted = userData.birth?.split('T')[0] || '';

  // AI 점수 계산
  const score = testResult ? Math.round(testResult.p_final * 100) : 0;
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

  // 영역별 점수 가져오기
  const currentDomainScores = testResult?.cat_score ? {
    simple: testResult.cat_score.simple || 0,
    sustained: testResult.cat_score.sustained || 0,
    interference: testResult.cat_score.interference || 0,
    divided: testResult.cat_score.divided || 0,
    working_memory: testResult.cat_score.working_memory || 0,
  } : null;

  const previousDomainScores = previousResult?.cat_score ? {
    simple: previousResult.cat_score.simple || 0,
    sustained: previousResult.cat_score.sustained || 0,
    interference: previousResult.cat_score.interference || 0,
    divided: previousResult.cat_score.divided || 0,
    working_memory: previousResult.cat_score.working_memory || 0,
  } : undefined;

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
      <div className="w-[480px] min-h-[400px] p-[40px] flex flex-col bg-white border border-[#CDD0D4] rounded-[10px]">
        <p className="text-[22px] text-black font-bold">최근 검사</p>

        {testResult ? (
          <>
            <div className="w-[400px] min-h-[130px] bg-[#F9FAFB] border border-[#CDD0D4] rounded-[10px] flex flex-row items-center mt-[30px]">
              <img alt="score emoji" src={imageUrl} width="100" height="100" className="mx-[20px]" />

              <div className="flex-1 h-full flex flex-col justify-center">
                <p className="text-[14px] font-medium text-[#474747]">ADHD 가능성 점수</p>
                <p className="text-[32px] font-bold text-[#474747]">
                  <span className="text-[#4A8AEE]">{score}</span>점
                </p>
                <p className="text-[14px] font-medium text-[#737373]">{message}</p>
              </div>
            </div>

            {/* 레이더 차트 */}
            {currentDomainScores && (
              <div className="w-full mt-[30px] p-[20px] bg-[#F9FAFB] border border-[#CDD0D4] rounded-[10px]">
                <p className="text-[16px] font-bold text-black mb-3">영역별 분석</p>
                <RadarChart 
                  currentData={currentDomainScores}
                  previousData={previousDomainScores}
                />
              </div>
            )}

            <button
              onClick={() => {
                setModalOpen(true);
              }}
              className="w-[120px] h-[45px] center text-white font-medium text-[14px] bg-[#4a8aee] rounded-[10px] cp duration-200 hover:bg-[#4077CE] mt-auto ml-auto"
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

      {testResult && (
        <Modal 
          isOpen={modalOpen} 
          setModalOpen={setModalOpen}
          testResult={testResult}
        />
      )}
    </div>
  );
}
