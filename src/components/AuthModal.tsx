import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  Loader2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  Heart,
  User,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialStep?: 1 | 3;
}

const RESEND_SECONDS = 120;

function toInternational(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('09')) return '+98' + digits.slice(1);
  if (digits.startsWith('98')) return '+' + digits;
  if (digits.startsWith('+98')) return digits;
  return '+98' + digits;
}

export default function AuthModal({ open, onClose, onSuccess, initialStep = 1 }: AuthModalProps) {
  const { user, login, updateName } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startCountdown = useCallback(() => {
    setCountdown(RESEND_SECONDS);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (open) {
      setStep(initialStep);
      setPhone(user?.phone || '');
      setFullName(user?.fullName || '');
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setSuccess(false);
      setDemoCode(null);
      setCountdown(0);
    }
  }, [open, initialStep, user]);

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    setPhone(digits);
    setError(null);
  };

  const isPhoneValid = phone.length === 11 && phone.startsWith('09');

  const handleSendOtp = async () => {
    if (!isPhoneValid) {
      setError('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.');
      return;
    }

    setLoading(true);
    setError(null);

    const internationalPhone = toInternational(phone);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: internationalPhone,
      });

      if (otpError) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setDemoCode(code);
      }

      setStep(2);
      startCountdown();
    } catch {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoCode(code);
      setStep(2);
      startCountdown();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits.length > 0) {
      const newOtp = ['', '', '', '', '', ''];
      for (let i = 0; i < digits.length; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const otpValue = otp.join('');

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setError('کد ۶ رقمی را کامل وارد کنید.');
      return;
    }

    setLoading(true);
    setError(null);

    const internationalPhone = toInternational(phone);

    try {
      if (demoCode) {
        if (otpValue !== demoCode) {
          setError('کد تایید اشتباه است.');
          setLoading(false);
          return;
        }
      } else {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          phone: internationalPhone,
          token: otpValue,
          type: 'sms',
        });

        if (verifyError) {
          setError('کد تایید اشتباه است یا منقضی شده.');
          setLoading(false);
          return;
        }
      }

      setStep(3);
    } catch {
      setError('خطا در تایید کد. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError(null);

    const internationalPhone = toInternational(phone);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: internationalPhone,
      });

      if (otpError) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setDemoCode(code);
      }

      setOtp(['', '', '', '', '', '']);
      startCountdown();
      otpRefs.current[0]?.focus();
    } catch {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoCode(code);
      setOtp(['', '', '', '', '', '']);
      startCountdown();
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitName = () => {
    if (fullName.trim().length < 3) {
      setError('نام و نام خانوادگی خود را کامل وارد کنید.');
      return;
    }

    if (user && user.phone === phone) {
      updateName(fullName.trim());
    } else {
      login(phone, fullName.trim());
    }

    setSuccess(true);
    setTimeout(() => {
      onSuccess?.();
      onClose();
    }, 1800);
  };

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center">
              <Heart className="w-4 h-4 text-stone-50" />
            </div>
            <span className="font-bold text-stone-800 text-sm">هم‌کوچ</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-stone-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-stone-50" />
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">خوش آمدید</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              {fullName ? `بانو: ${fullName}` : 'با موفقیت وارد هم‌کوچ شدید.'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-stone-800' : 'bg-stone-200'}`} />
              <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-stone-800' : 'bg-stone-200'}`} />
              <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-stone-800' : 'bg-stone-200'}`} />
            </div>

            {/* Step 1: Phone input */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-1.5">
                    ورود یا ثبت‌نام در هم‌کوچ
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    جهت حفظ امنیت و حریم خصوصی بانوان، شماره موبایل خود را وارد کنید.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full pr-10 pl-4 py-3 rounded-2xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
                      dir="ltr"
                      style={{ textAlign: 'right' }}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && isPhoneValid && handleSendOtp()}
                    />
                  </div>
                  {phone.length > 0 && !phone.startsWith('09') && (
                    <p className="text-xs text-stone-400 mt-1.5">شماره باید با ۰۹ شروع شود.</p>
                  )}
                </div>

                {error && (
                  <div className="bg-stone-100 border border-stone-200 text-stone-600 text-sm rounded-xl p-3">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={!isPhoneValid || loading}
                  className="w-full bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 text-stone-50 font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      دریافت کد تایید
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-start gap-2 bg-stone-100 rounded-xl p-3">
                  <ShieldCheck className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-stone-500 leading-relaxed">
                    اطلاعات شما محرمانه می‌ماند و صرفاً برای تایید هویت استفاده می‌شود.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: OTP input */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError(null);
                      setDemoCode(null);
                      setCountdown(0);
                    }}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition mb-3"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    تغییر شماره
                  </button>
                  <h2 className="text-xl font-bold text-stone-800 mb-1.5">
                    کد تایید را وارد کنید
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    کد ۶ رقمی به شماره{' '}
                    <span dir="ltr" className="font-medium text-stone-700">
                      {phone}
                    </span>{' '}
                    ارسال شد.
                  </p>
                </div>

                {/* Demo code banner */}
                {demoCode && (
                  <div className="bg-stone-800 text-stone-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-stone-300 mb-1">کد تایید (حالت نمایشی):</p>
                    <p className="text-2xl font-bold tracking-[0.5em]" dir="ltr">
                      {demoCode}
                    </p>
                  </div>
                )}

                {/* OTP boxes */}
                <div className="flex justify-center gap-2" dir="ltr">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 ${
                        digit
                          ? 'border-stone-800 bg-white text-stone-800'
                          : 'border-stone-200 bg-white text-stone-800'
                      } focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent`}
                    />
                  ))}
                </div>

                {error && (
                  <div className="bg-stone-100 border border-stone-200 text-stone-600 text-sm rounded-xl p-3 text-center">
                    {error}
                  </div>
                )}

                {/* Resend timer */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-stone-400">
                      ارسال مجدد کد تا{' '}
                      <span className="font-medium text-stone-600" dir="ltr">
                        {formatCountdown(countdown)}
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      className="text-sm text-stone-600 hover:text-stone-800 font-medium flex items-center justify-center gap-1.5 mx-auto transition disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      ارسال مجدد کد
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otpValue.length !== 6 || loading}
                  className="w-full bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 text-stone-50 font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      در حال تایید...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      تایید و ورود به هم‌کوچ
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 3: Name input */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-stone-800 mb-1.5">
                    نام و نام خانوادگی
                  </h2>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    لطفاً نام کامل خود را وارد کنید تا بتوانیم شما را بهتر بشناسیم.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    نام و نام خانوادگی
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setError(null);
                      }}
                      placeholder="مثلاً: مریم علوی"
                      className="w-full pr-10 pl-4 py-3 rounded-2xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && fullName.trim().length >= 3 && handleSubmitName()}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-stone-100 border border-stone-200 text-stone-600 text-sm rounded-xl p-3">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmitName}
                  disabled={fullName.trim().length < 3 || loading}
                  className="w-full bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 text-stone-50 font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  تکمیل و ورود
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
