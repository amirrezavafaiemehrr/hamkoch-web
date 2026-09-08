import { BedDouble, ShieldCheck, Users, TrendingDown } from 'lucide-react';

export default function RoomSharingBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
      <div className="bg-gradient-to-l from-deepTeal-50 via-white to-roseGold-50 rounded-2xl shadow-xl border border-softSand-200 overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="flex items-center gap-4 p-5 md:p-6 flex-1">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-roseGold-400 to-roseGold-500 flex items-center justify-center shadow-lg">
              <BedDouble className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-softSand-900 mb-1">
                سیستم هم‌اتاقی‌ابی توربان
              </h3>
              <p className="text-sm text-softSand-600 leading-relaxed">
                مسافران تکی می‌توانند با هم‌سفران مطمئن اتاق خود را به اشتراک بگذارند و
                هزینه اقامت را تقسیم کنند. هم‌اتاقی‌ها توسط تیم توربان بررسی و هماهنگ
                می‌شوند تا سفر شما امن و مقرون‌به‌صرفه باشد.
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center justify-around md:justify-center gap-4 md:gap-3 bg-deepTeal-500/5 px-5 py-4 md:w-56 border-t md:border-t-0 md:border-r border-softSand-200">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-softSand-900 block leading-tight">۱۵٪</span>
                <span className="text-xs text-softSand-500">کاهش هزینه</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-deepTeal-100 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-deepTeal-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-softSand-900 block leading-tight">امن</span>
                <span className="text-xs text-softSand-500">بررسی‌شده</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-roseGold-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-roseGold-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-softSand-900 block leading-tight">هم‌سفر</span>
                <span className="text-xs text-softSand-500">هماهنگ‌شده</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
