import { ShieldCheck, MapPin, Calendar, Gauge, Search } from 'lucide-react';

interface HeroProps {
  onSearch: (filters: { destination: string; date: string; difficulty: string }) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSearch({
      destination: formData.get('destination') as string,
      date: formData.get('date') as string,
      difficulty: formData.get('difficulty') as string,
    });
    const toursSection = document.getElementById('tours');
    toursSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/12245898/pexels-photo-12245898.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-deepTeal-900/80 via-deepTeal-800/60 to-roseGold-900/40" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-6">
            <ShieldCheck className="w-5 h-5 text-softSand-200" />
            <span className="text-white text-sm font-medium">
              تأیید شده توسط تیم ایمنی هم‌کوچ 
            </span>
          </div>
        </div>

        <h1 className="animate-fade-in-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-4">
          سفرهای امن و دل‌انگیز بانوان
          <span className="block text-softSand-300 text-2xl md:text-3xl lg:text-4xl mt-3 font-medium">
            در زیباترین گوشه‌های ایران
          </span>
        </h1>

        <p className="animate-fade-in-delay-2 text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          تورهای اختصاصی بانوان با راهنمای خانم، اقامتگاه‌های امن و تجربه‌هایی
          فراموش‌نشدنی — از کویر مرنجاب تا جنگل‌های گیلان
        </p>

        <div className="animate-fade-in-delay-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 md:p-6 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <label className="block text-sm font-medium text-softSand-800 mb-1.5">
                مقصد
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-roseGold-500" />
                <input
                  type="text"
                  name="destination"
                  placeholder="مثلاً مرنجاب، هرمز..."
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-softSand-200 bg-softSand-50 text-sm text-softSand-900 placeholder:text-softSand-400 focus:outline-none focus:ring-2 focus:ring-deepTeal-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-softSand-800 mb-1.5">
                تاریخ
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-roseGold-500" />
                <input
                  type="date"
                  name="date"
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-softSand-200 bg-softSand-50 text-sm text-softSand-900 focus:outline-none focus:ring-2 focus:ring-deepTeal-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-softSand-800 mb-1.5">
                سطح سختی
              </label>
              <div className="relative">
                <Gauge className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-roseGold-500" />
                <select
                  name="difficulty"
                  defaultValue=""
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-softSand-200 bg-softSand-50 text-sm text-softSand-900 focus:outline-none focus:ring-2 focus:ring-deepTeal-400 focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value="">همه</option>
                  <option value="easy">آسان</option>
                  <option value="moderate">متوسط</option>
                  <option value="hard">سخت</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-deepTeal-500 hover:bg-deepTeal-600 text-white font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-deepTeal-500/30 hover:shadow-xl hover:shadow-deepTeal-500/40 hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                جستجو
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-softSand-50 to-transparent pointer-events-none" />
    </section>
  );
}
