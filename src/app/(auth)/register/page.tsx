'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/services/auth';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuthUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creationStep, setCreationStep] = useState<number>(1);
  const [creationProgress, setCreationProgress] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف');
      return;
    }

    setLoading(true);
    setCreationStep(1);
    setCreationProgress(30);

    try {
      await new Promise((res) => setTimeout(res, 500));
      setCreationStep(2);
      setCreationProgress(65);

      // Send register request to NestJS backend
      const result = await authService.register({ name, email, password });

      setCreationStep(3);
      setCreationProgress(100);
      await new Promise((res) => setTimeout(res, 600));

      // Update global context state
      if (result.user) {
        setAuthUser({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          phone: result.user.phone,
          bio: result.user.bio,
          avatar: result.user.avatar,
        });
      }

      // Redirect user to home page
      router.push('/');
    } catch (err: any) {
      // Format NestJS backend validation or auth errors
      const responseMessage = err.response?.data?.message;
      let formattedMsg = 'حدث خطأ أثناء إنشاء الحساب. يرجى التأكد من تشغيل السيرفر والمحاولة مجدداً.';
      if (Array.isArray(responseMessage)) {
        formattedMsg = responseMessage[0];
      } else if (typeof responseMessage === 'string') {
        formattedMsg = responseMessage;
      } else if (err.message) {
        formattedMsg = err.message;
      }
      setError(formattedMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 dir-rtl" dir="rtl">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Top Decorative Soft Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0E6875]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-[#0E6875] to-teal-400 text-white mb-4 shadow-lg shadow-teal-900/30">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">إنشاء حساب جديد</h1>
          <p className="text-slate-400 text-sm">انضم إلى مجتمع رواد الأعمال في تايم فالي</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-fadeIn">
            <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="مثال: أحمد محمد"
              className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0110.123 7c-.504 1.637-1.39 3.093-2.562 4.254M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-[#0E6875] to-teal-500 hover:from-[#0b545f] hover:to-teal-600 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-6"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-teal-300 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>
                  {creationStep === 1 && "جاري تشفير البيانات وتجهيز الحساب..."}
                  {creationStep === 2 && "جاري إنشاء بيئة الطالب وحفظ البيانات..."}
                  {creationStep === 3 && "تم الحفظ! جاري إصدار رمز الدخول..."}
                </span>
              </div>
            ) : (
              'إنشاء الحساب'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400 relative z-10 border-t border-slate-800/80 pt-5">
          <span>لديك حساب بالفعل؟ </span>
          <Link href="/login" className="text-teal-400 font-bold hover:underline transition-all">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
