import { ShieldCheck, Compass, Home, Headset } from 'lucide-react';

const pillars = [
  {
    icon: ShieldCheck,
    title: 'احراز هویت بانوان',
    description: '۱۰۰٪ گروه‌های سفر کاملاً بانوان، با تایید هویت هر مسافر پیش از ثبت‌نام.',
  },
  {
    icon: Compass,
    title: 'راهنماهای مجرب خانم',
    description: 'راهنمایان زن رسمی با سابقه بررسی شده و آموزش‌دیده برای راهنمایی سفرهای امن.',
  },
  {
    icon: Home,
    title: 'اقامتگاه‌های امن و اختصاصی',
    description: 'اقامتگاه‌های بررسی‌شده و تایید شده با استانداردهای ایمنی و خصوصیت کامل بانوان.',
  },
  {
    icon: Headset,
    title: 'پشتیبانی ۲۴/۷ سفر',
    description: 'خط پشتیبانی اضطراری اختصاصی در طول تمام سفرها، در دسترس شبانه‌روز.',
  },
];

export default function SafetySection() {
  return (
    <section className="bg-stone-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 mb-4">
            <ShieldCheck className="w-4 h-4 text-stone-600" />
            <span className="text-xs font-medium text-stone-600">ایمنی و اعتماد هم‌کوچ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">
            چرا سفر با هم‌کوچ امن است؟
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed max-w-xl mx-auto">
            ما در هم‌کوچ، امنیت و آرامش بانوان را در اولویت قرار می‌دهیم. چهار ستون ایمنی ما،
            تجربه‌ای مطمئن و دل‌انگیز را برای شما تضمین می‌کند.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-stone-50 rounded-3xl p-6 border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-stone-50" />
                </div>
                <h3 className="text-sm font-bold text-stone-800 mb-2 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
