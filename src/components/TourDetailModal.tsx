import { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Users,
  Star,
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  BedDouble,
  Sparkles,
  Mountain,
  Leaf,
  Landmark,
  Calendar,
  Backpack,
  Briefcase,
  Car,
  UtensilsCrossed,
  ChevronLeft,
} from 'lucide-react';
import type { Tour } from '../types';
import {
  tourTypeLabels,
  difficultyLabels,
  formatToman,
} from '../types';
import BookingForm from './BookingForm';

interface TourDetailModalProps {
  tour: Tour;
  onClose: () => void;
}

const tourTypeIconMap: Record<string, typeof Sparkles> = {
  yoga: Sparkles,
  hiking: Mountain,
  eco: Leaf,
  cultural: Landmark,
};

type Tab = 'itinerary' | 'services' | 'packing';

const defaultPackingList = [
  'کفش راحت و کوهنوردی',
  'لباس layered برای تغییرات دمایی',
  'کرم ضدآفتاب و کلاه',
  'بطری آب و فلاسک',
  'داروی شخصی و کمکی',
  'دوربین عکاسی',
  'پاوربانک و شارژر',
  'روپوش و شال برای اماکن مذهبی',
];

const serviceIconMap: { keywords: string[]; icon: typeof Briefcase }[] = [
  { keywords: ['اقامت', 'کاروانسرا', 'خانه بومی', 'اقامتگاه'], icon: BedDouble },
  { keywords: ['حمل', 'ونقل', 'قایق', 'حمل‌ونقل'], icon: Car },
  { keywords: ['غذایی', 'غذا', 'وعده', 'صبحانه', 'عصرانه'], icon: UtensilsCrossed },
];

function getServiceIcon(service: string): typeof Briefcase {
  for (const { keywords, icon } of serviceIconMap) {
    if (keywords.some((kw) => service.includes(kw))) return icon;
  }
  return Briefcase;
}

export default function TourDetailModal({ tour, onClose }: TourDetailModalProps) {
  const [activeImage, setActiveImage] = useState(tour.image_url);
  const [roomSharing, setRoomSharing] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');

  const TypeIcon = tourTypeIconMap[tour.tour_type] || Sparkles;
  const discountedPrice = roomSharing
    ? Math.round(tour.price_toman * 0.85)
    : tour.price_toman;

  const gallery = [tour.image_url, ...tour.gallery].filter(Boolean);
  const remainingCapacity = Math.max(1, tour.max_group_size - 3);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'itinerary', label: 'برنامه سفر' },
    { id: 'services', label: 'خدمات تور' },
    { id: 'packing', label: 'لوازم ضروری' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/40 backdrop-blur-sm p-2 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-5xl my-4 animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={activeImage} alt={tour.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition shadow-lg"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>

          {/* Destination tag */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-sm font-medium text-white bg-stone-900/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
            <MapPin className="w-4 h-4 text-stone-300" />
            {tour.destination}
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-sm font-medium text-white bg-stone-900/50 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
            <Clock className="w-4 h-4 text-stone-300" />
            {tour.duration_days} روزه
          </div>

          {/* Title */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-snug drop-shadow-lg">
              {tour.title}
            </h2>
          </div>
        </div>

        {/* Gallery thumbnails */}
        {gallery.length > 1 && (
          <div className="px-5 pt-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === img ? 'border-stone-800' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`تصویر ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 p-5 md:p-6">
          {/* Main content */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-4 text-center border border-stone-200">
                <Clock className="w-5 h-5 text-stone-500 mx-auto mb-1.5" />
                <span className="text-sm font-semibold text-stone-800 block">{tour.duration_days} روز</span>
                <span className="text-xs text-stone-400">مدت تور</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-stone-200">
                <Users className="w-5 h-5 text-stone-500 mx-auto mb-1.5" />
                <span className="text-sm font-semibold text-stone-800 block">{tour.max_group_size} نفر</span>
                <span className="text-xs text-stone-400">ظرفیت گروه</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-stone-200">
                <Star className="w-5 h-5 text-stone-500 mx-auto mb-1.5 fill-stone-400" />
                <span className="text-sm font-semibold text-stone-800 block">{tour.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400">امتیاز</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-stone-200">
                <TypeIcon className="w-5 h-5 text-stone-500 mx-auto mb-1.5" />
                <span className="text-sm font-semibold text-stone-800 block">{tourTypeLabels[tour.tour_type]}</span>
                <span className="text-xs text-stone-400">نوع تور</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-bold text-stone-800 mb-2">درباره تور</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{tour.description}</p>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-1 bg-stone-100 rounded-2xl p-1 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-sm font-medium py-2.5 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-stone-800 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Itinerary */}
              {activeTab === 'itinerary' && (
                <div className="space-y-3 animate-fade-in">
                  {tour.itinerary.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 bg-white rounded-2xl p-4 border border-stone-200"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-stone-800 text-stone-50 flex items-center justify-center font-bold text-sm">
                        {item.day}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-stone-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Services */}
              {activeTab === 'services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                  {tour.included_services.map((service, idx) => {
                    const Icon = getServiceIcon(service);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-stone-200"
                      >
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-stone-500" />
                        </div>
                        <span className="text-sm text-stone-700">{service}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Packing list */}
              {activeTab === 'packing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                  {defaultPackingList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-stone-200"
                    >
                      <Backpack className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      <span className="text-sm text-stone-600">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Guide profile card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200">
              <h3 className="text-base font-bold text-stone-800 mb-4">بانوی راهنما</h3>
              <div className="flex items-start gap-4">
                <img
                  src={tour.guide_avatar_url}
                  alt={tour.guide_name}
                  className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-stone-800">{tour.guide_name}</span>
                    <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                      <BadgeCheck className="w-3.5 h-3.5 text-stone-500" />
                      راهنمای تایید شده
                    </span>
                  </div>
                  <p className="text-sm text-stone-500 leading-relaxed">{tour.guide_bio}</p>
                </div>
              </div>
            </div>

            {/* Safety guidelines */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-stone-500" />
                <h3 className="text-base font-bold text-stone-800">دستورالعمل‌های ایمنی</h3>
              </div>
              <div className="space-y-2.5">
                {tour.safety_guidelines.map((guideline, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-stone-600">
                    <CheckCircle2 className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                    {guideline}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky booking sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-4">
                {/* Price */}
                <div>
                  <span className="text-xs text-stone-400 block mb-1">قیمت هر نفر</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-stone-800">{formatToman(discountedPrice)}</span>
                    <span className="text-sm text-stone-400">تومان</span>
                  </div>
                  {roomSharing && (
                    <span className="text-xs text-stone-400 line-through block mt-1">
                      {formatToman(tour.price_toman)} تومان
                    </span>
                  )}
                </div>

                {/* Capacity + Date */}
                <div className="space-y-2.5 pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-stone-400" />
                      ظرفیت باقی‌مانده
                    </span>
                    <span className="font-semibold text-stone-800">{remainingCapacity} نفر</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      تاریخ شروع
                    </span>
                    <span className="font-semibold text-stone-800">آذر ۱۴۰۵</span>
                  </div>
                </div>

                {/* Room sharing toggle */}
                <div className="pt-3 border-t border-stone-200">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800 mb-0.5">اشتراک اتاق</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">۱۵٪ تخفیف با هم‌سفر</p>
                    </div>
                    <button
                      onClick={() => setRoomSharing(!roomSharing)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
                        roomSharing ? 'bg-stone-800' : 'bg-stone-200'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                          roomSharing ? 'right-1' : 'right-7'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Book button */}
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-stone-50 font-medium py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  رزرو و رزرو نهایی سفر
                </button>

                <div className="flex items-start gap-2 text-xs text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>پرداخت ایمن و تایید رزرو توسط تیم هم‌کوچ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showBooking && (
          <BookingForm
            tour={tour}
            roomSharing={roomSharing}
            price={discountedPrice}
            onClose={() => setShowBooking(false)}
            onBack={() => setShowBooking(false)}
          />
        )}
      </div>
    </div>
  );
}
