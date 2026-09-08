import { useState } from 'react';
import {
  X,
  User,
  Phone,
  CreditCard,
  Upload,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';
import type { Tour } from '../types';
import { formatToman } from '../types';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface BookingFormProps {
  tour: Tour;
  roomSharing: boolean;
  price: number;
  onClose: () => void;
  onBack: () => void;
}

export default function BookingForm({
  tour,
  roomSharing,
  price,
  onClose,
  onBack,
}: BookingFormProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [nationalId, setNationalId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !nationalId.trim()) {
      setError('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    if (nationalId.length !== 10) {
      setError('کد ملی باید ۱۰ رقم باشد.');
      return;
    }

    if (!receiptFile) {
      setError('لطفاً فیش واریزی را بارگذاری کنید.');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('bookings').insert({
        tour_id: tour.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        national_id: nationalId.trim(),
        room_sharing: roomSharing,
        receipt_file_name: receiptFile.name,
        status: 'pending',
      });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch {
      setError('خطا در ثبت رزرو. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-stone-800 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-stone-50" />
          </div>
          <h3 className="text-lg font-bold text-stone-800 mb-2">رزرو شما ثبت شد!</h3>
          <p className="text-sm text-stone-500 leading-relaxed mb-6">
            رزرو تور «{tour.title}» با نام {fullName} ثبت شد. این تور به لیست «سفرهای من»
            شما اضافه شد و تیم هم‌کوچ در اسرع وقت برای هماهنگی نهایی با شما تماس خواهد گرفت.
          </p>
          <div className="bg-white rounded-2xl p-4 border border-stone-200 mb-6 text-right">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-stone-400">تور</span>
              <span className="font-medium text-stone-700">{tour.title}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-stone-400">مسافر</span>
              <span className="font-medium text-stone-700">{fullName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">مبلغ</span>
              <span className="font-medium text-stone-700">{formatToman(price)} تومان</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-stone-800 hover:bg-stone-700 text-stone-50 font-medium py-3 rounded-2xl transition"
          >
            بازگشت به تورها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-stone-900/50 backdrop-blur-sm p-2 md:p-6 animate-fade-in">
      <div className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-lg my-4 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-stone-50" />
            </div>
            <h3 className="text-sm font-bold text-stone-800">فرم رزرو</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-stone-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Tour summary */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200">
            <div className="flex items-center gap-3">
              <img
                src={tour.image_url}
                alt={tour.title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-stone-800 text-sm truncate">{tour.title}</h4>
                <p className="text-xs text-stone-400">{tour.destination}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {roomSharing && (
                  <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full">اشتراک اتاق</span>
                )}
              </div>
              <span className="font-bold text-stone-800">{formatToman(price)} تومان</span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              نام و نام خانوادگی
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="نام کامل خود را وارد کنید"
                className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
              />
            </div>
            {user?.fullName && (
              <p className="text-xs text-stone-400 mt-1">پر شده از پروفایل شما</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              شماره تماس
            </label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
                dir="ltr"
                style={{ textAlign: 'right' }}
              />
            </div>
          </div>

          {/* National ID */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              کد ملی
              <span className="text-xs font-normal text-stone-400 mr-2">(برای احراز هویت)</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="کد ملی ۱۰ رقمی"
                className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
                dir="ltr"
                style={{ textAlign: 'right' }}
              />
            </div>
          </div>

          {/* Receipt upload */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              فیش واریزی (کارت به کارت)
            </label>
            <div className="bg-white rounded-xl p-3 border border-stone-200 mb-3">
              <p className="text-xs text-stone-500 mb-1">شماره کارت برای واریز:</p>
              <p className="text-sm font-bold text-stone-800 tracking-wider" dir="ltr" style={{ textAlign: 'right' }}>
                ۶۰۳۷-۷۰۷۰-۹۰۹۰-۱۲۳۴
              </p>
              <p className="text-xs text-stone-400 mt-1">به نام: هم‌کوچ</p>
            </div>
            <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-500 hover:bg-stone-100 cursor-pointer transition-all duration-200 group">
              {receiptFile ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-stone-600" />
                  <span className="text-sm text-stone-700 font-medium truncate max-w-full px-4">
                    {receiptFile.name}
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-stone-400 group-hover:text-stone-600 transition" />
                  <span className="text-sm text-stone-500">تصویر فیش را اینجا بارگذاری کنید</span>
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    PNG, JPG
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          {/* Safety note */}
          <div className="flex items-start gap-2 bg-stone-100 rounded-xl p-3">
            <ShieldCheck className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-stone-500 leading-relaxed">
              اطلاعات شما محرمانه می‌ماند و صرفاً برای احراز هویت و هماهنگی تور استفاده می‌شود.
            </p>
          </div>

          {error && (
            <div className="bg-stone-100 border border-stone-200 text-stone-600 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 text-stone-50 font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                رزرو و رزرو نهایی سفر
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
