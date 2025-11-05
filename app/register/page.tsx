'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../public/images/logo.png';
import axios from 'axios';

interface RegisterForm {
  username: string;
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female' | '';
  birth: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birth: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const sendEmailCode = async () => {
    if (!form.email) return alert('이메일을 입력해주세요.');

    try {
      const res = await axios.post(`${API_URL}/auth/send-code`, { email: form.email });
      alert(res.data.message || '인증번호가 이메일로 전송되었습니다.');
    } catch (err: any) {
      console.error('이메일 전송 에러:', err);
      alert(err.response?.data?.message || '이메일 전송 중 오류가 발생했습니다.');
    }
  };

  const verifyEmailCode = async () => {
    if (!form.code) return alert('인증번호를 입력해주세요.');

    try {
      const res = await axios.post(`${API_URL}/auth/verify-code`, {
        email: form.email,
        code: form.code
      });
      alert(res.data.message || '이메일 인증이 완료되었습니다.');
    } catch (err: any) {
      console.error('이메일 인증 에러:', err);
      alert(err.response?.data?.message || '이메일 인증 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!form.username || !form.email || !form.password || !form.gender || !form.birth) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/user/signup`, {
        ...form
      });

      alert(res.data.message || '회원가입 완료! 로그인 페이지로 이동합니다.');
      router.push('/signin');
    } catch (err: any) {
      console.error('회원가입 에러:', err);
      alert(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
      <div className="mt-[160px] bg-white shadow-lg rounded-4xl p-8 w-[500px] h-auto mb-[110px]">
        <Image src={logo} alt="Logo" width={180} height={120} className="mx-auto mt-5 mb-4" />
        <h1 className="text-[40px] font-bold text-center mb-2">회원가입</h1>
        <p className="text-[#000000] font-medium opacity-70 text-[18px] text-center mb-6">다양한 기능을 경험해보세요!</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">이름</label>
            <input name="username" value={form.username} onChange={handleChange} required  maxLength={10} placeholder="10글자 아래로 입력해주세요" className="border-1  px-3 rounded-[10px] w-[400px] h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
            {form.username && (form.username.length > 10) && <p className="text-xs mt-1 text-red-600">이름은 10자 이하여야 합니다</p>}
          </div>

          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">이메일</label>
            <div className="relative w-[400px]">
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="example@gmail.com" className="border-1 px-3 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
              <button type="button" onClick={sendEmailCode} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4A8AEE] text-[11px] text-white font-bold w-[60px] h-[30px] rounded-[5px] hover:bg-[#3A7ADE] transition">
                인증번호
              </button>
            </div>
          </div>

          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">인증번호</label>
            <div className="relative w-[400px]">
              <input name="code" value={form.code} onChange={handleChange} placeholder='XXXXXX' required className="border-1 px-3 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
              <button type="button" onClick={verifyEmailCode} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4A8AEE] text-[11px] text-white font-bold w-[60px] h-[30px] rounded-[5px] hover:bg-[#3A7ADE] transition">
                확인
              </button>
            </div>
          </div>
          
          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">비밀번호</label>
            <div className="relative w-[400px]">
              <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} autoComplete="off" required minLength={7} placeholder="대문자, 숫자, 특수문자 포함 7자 이상" className="border-1 px-3 pr-12 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {form.password && form.password.length < 7 && <p className="text-xs mt-1 text-red-600">비밀번호는 최소 7자 이상이며, 대문자, 숫자, 특수문자를 포함해야 합니다</p>}
          </div>

          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">비밀번호 확인</label>
            <div className="relative w-[400px]">
              <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} autoComplete="off" required className="border-1 px-3 pr-12 rounded-[10px] w-full h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {form.confirmPassword && <p className={`text-xs mt-1 font-medium ${form.password === form.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>{form.password === form.confirmPassword ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}</p>}
          </div>

          {/* 성별 */}
          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">성별</label>
            <div className="flex gap-4 text-[14px]">
              {['male', 'female'].map(g => (
                <button type="button" key={g} onClick={() => setForm({ ...form, gender: g as 'male' | 'female' })} className={`w-[190px] h-[47px] rounded-lg flex items-center justify-center transition border-1 cursor-pointer ${form.gender === g ? 'bg-[#4A8AEE] text-white border-[#4A8AEE] font-bold' : 'bg-white text-[#000000] border-gray-300 hover:border-[#4A8AEE]'}`}>
                  {g === 'male' ? '남성' : '여성'}
                </button>
              ))}
            </div>
          </div>

          {/* 생년월일 */}
          <div className="mb-[30px]">
            <label className="block mb-1 text-sm font-medium opacity-70 text-[#000000]">생년월일</label>
            <input type="date" name="birth" value={form.birth} onChange={handleChange} required max={new Date().toISOString().split('T')[0]} className="border-1 px-3 text-[#737373] rounded-[10px] w-[400px] h-[47px] border-[#D7D7D7] focus:outline-none focus:border-[#4A8AEE] focus:border-2" />
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
  );
}
