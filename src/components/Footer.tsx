import { ShieldCheck, FileText, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-deepTeal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-roseGold-400 to-softSand-400 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">هم‌کوچ</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              بازار تورهای اختصاصی بانوان در ایران — سفرهای امن با راهنمای خانم و اقامتگاه‌های مطمئن.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-softSand-300">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#tours" className="text-white/60 hover:text-white transition flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  همه تورها
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  قوانین و مقررات
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  خط‌مشی‌های ایمنی
                </a>
              </li>
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h4 className="font-semibold mb-4 text-softSand-300">ایمنی بانوان</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-deepTeal-400 flex-shrink-0 mt-0.5" />
                راهنمای خانم در تمام طول تور
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-deepTeal-400 flex-shrink-0 mt-0.5" />
                اقامتگاه‌های امن و اختصاصی
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-deepTeal-400 flex-shrink-0 mt-0.5" />
                پشتیبانی ۲۴ ساعته
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-deepTeal-400 flex-shrink-0 mt-0.5" />
                بیمه کامل مسافرتی
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-softSand-300">تماس با ما</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-deepTeal-400" />
                <span dir="ltr" style={{ textAlign: 'right' }}>۰۲۱-۸۸۸۸۲۲۲۲</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-deepTeal-400" />
                info@torban.ir
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-deepTeal-400" />
                تهران، خیابان ولیعصر
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© ۱۴۰۵ هم‌کوچ — تمام حقوق محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            ساخته شده با <Heart className="w-3.5 h-3.5 text-roseGold-400 fill-roseGold-400" /> برای بانوان ایران
          </p>
        </div>
      </div>
    </footer>
  );
}
