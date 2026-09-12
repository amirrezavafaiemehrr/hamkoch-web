import { BedDouble, ShieldCheck, Users, TrendingDown } from 'lucide-react';

export default function RoomSharingBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
      <div className="bg-stone-50 rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="flex items-center gap-4 p-5 md:p-6 flex-1">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center shadow-lg">
              <BedDouble className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-stone-800 mb-1">
                سیستم هم‌اتاقی‌ابی هم‌کوچ
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                مسافران تکی می‌توانند با هم‌سفران مطمئن اتاق خود را به اشتراک بگذارند و
                هزینه اقامت را تقسیم کنند. هم‌اتاقی‌ها توسط تیم هم‌کوچ بررسی و هماهنگ
                می‌شوند تا سفر شما امن و مقرون‌به‌صرفه باشد.
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center justify-around md:justify-center gap-4 md:gap-3 bg-stone-100 px-5 py-4 md:w-56 border-t md:border-t-0 md:border-r border-stone-200">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block leading-tight">۱۵٪</span>
                <span className="text-xs text-stone-400">کاهش هزینه</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block leading-tight">امن</span>
                <span className="text-xs text-stone-400">بررسی‌شده</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center">
                <Users className="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block leading-tight">هم‌سفر</span>
                <span className="text-xs text-stone-400">هماهنگ‌شده</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
