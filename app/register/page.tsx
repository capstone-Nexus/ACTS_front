'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../public/images/logo.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendEmailCode = async () => {
    if (!email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/send-code`, { email: email });
      toast.success(response.data.message || '인증번호가 이메일로 전송되었습니다.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || '이메일 전송 중 오류가 발생했습니다.');
    }
  };

  const verifyEmailCode = async () => {
    if (!code) {
      toast.error('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/verify-code`, {
        email: email,
        code: code
      });
      toast.success(response.data.message || '이메일 인증이 완료되었습니다.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!username || !email || !password || !gender || !birth) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/user/signup`, {
        username: username,
        email: email,
        code: code,
        password: password,
        confirmPassword: confirmPassword,
        gender: gender,
        birth: birth
      });

      toast.success(response.data.message || '회원가입 완료', {
        autoClose: 2000,
        onClose: () => router.push('/signin')
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          '--toastify-color-light': '#FFFFFF',
          '--toastify-text-color-light': '#000000',
        } as React.CSSProperties}
        toastStyle={{
          borderLeft: '4px solid #4A8AEE',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="mt-[160px] bg-white shadow-lg rounded-4xl p-8 w-[500px] h-auto mb-[110px]">
          <Image src={logo} alt="Logo" width={180} height={120} className="mx-auto mt-5 mb-4" />
          <h1 className="text-[40px] font-bold text-center mb-2">회원가입</h1>
          <p className="text-[#000000] font-medium opacity-70 text-[18px] text-center mb-6">다양한 기능을 경험해보세요!</p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="mb-[30px]">
              <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">이름</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required maxLength={10} placeholder="10글자 아래로 입력해주세요" className="border-1 px-3 rounded-[10px] w-[400px] h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
              {username && username.length > 10 && <p className="text-xs mt-1 text-red-600">이름은 10자 이하여야 합니다</p>}
            </div>

            <div className="mb-[30px]">
              <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">이메일</label>
              <div className="relative w-[400px]">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="example@gmail.com" className="border-1 px-3 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
                <button type="button" onClick={sendEmailCode} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4A8AEE] text-[11px] text-white font-bold w-[60px] h-[30px] rounded-[5px] hover:bg-[#3A7ADE] transition">
                  인증번호
                </button>
              </div>
            </div>

            <div className="mb-[30px]">
              <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">인증번호</label>
              <div className="relative w-[400px]">
                <input value={code} onChange={e => setCode(e.target.value)} placeholder="XXXXXX" required className="border-1 px-3 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
                <button type="button" onClick={verifyEmailCode} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4A8AEE] text-[11px] text-white font-bold w-[60px] h-[30px] rounded-[5px] hover:bg-[#3A7ADE] transition">
                  확인
                </button>
              </div>
            </div>

            <div className="mb-[30px]">
              <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">비밀번호</label>
              <div className="relative w-[400px]">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="off" required minLength={7} placeholder="대문자, 숫자, 특수문자 포함 7자 이상" className="border-1 px-3 pr-12 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && password.length < 7 && <p className="text-xs mt-1 text-red-600">비밀번호는 최소 7자 이상이며, 대문자, 숫자, 특수문자를 포함해야 합니다</p>}
            </div>

            <div className="mb-[30px]">
              <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">비밀번호 확인</label>
              <div className="relative w-[400px]">
                <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="off" required className="border-1 px-3 pr-12 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && <p className={`text-xs mt-1 font-medium ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>{password === confirmPassword ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}</p>}
            </div>

            <div className="mb-[30px]">
              <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">성별</label>
              <div className="flex gap-4 text-[14px]">
                <button type="button" onClick={() => setGender('male')} className={`w-[190px] h-[47px] rounded-lg flex items-center justify-center transition border-1 cursor-pointer ${gender === 'male' ? 'bg-[#4A8AEE] text-white border-[#4A8AEE] font-bold' : 'bg-white text-[#000000] border-gray-300 hover:border-[#4A8AEE]'}`}>
                  남성
                </button>
                <button type="button" onClick={() => setGender('female')} className={`w-[190px] h-[47px] rounded-lg flex items-center justify-center transition border-1 cursor-pointer ${gender === 'female' ? 'bg-[#4A8AEE] text-white border-[#4A8AEE] font-bold' : 'bg-white text-[#000000] border-gray-300 hover:border-[#4A8AEE]'}`}>
                  여성
                </button>
              </div>
            </div>

            <div className="mb-[30px]">
              <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">생년월일</label>
              <input type="date" value={birth} onChange={e => setBirth(e.target.value)} required max={new Date().toISOString().split('T')[0]} className="border-1 px-3 text-[#737373] rounded-[10px] w-[400px] h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
            </div>

            <button type="submit" className="cursor-pointer px-4 py-2 w-[400px] h-[47px] bg-[#4A8AEE] font-bold text-white rounded-[10px] hover:bg-[#4077CE] transition">
              회원가입
            </button>
          </form>

          <div className="text-center mt-7">
            <span className="text-[#737373] text-[16px]">이미 계정이 있으신가요?</span>{' '}
            <button type="button" onClick={() => router.push('/signin')} className="text-[#4A8AEE] font-bold text-[16px] hover:underline cursor-pointer">
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}