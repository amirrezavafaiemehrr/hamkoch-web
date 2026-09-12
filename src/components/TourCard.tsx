import {
  MapPin,
  Clock,
  Users,
  Star,
  BadgeCheck,
  ArrowLeft,
} from 'lucide-react';
import type { Tour } from '../types';
import { tourTypeLabels, difficultyLabels, formatToman } from '../types';

interface TourCardProps {
  tour: Tour;
  onView: (tour: Tour) => void;
}

const difficultyStyles: Record<string, string> = {
  easy: 'bg-stone-100 text-stone-600',
  moderate: 'bg-stone-200 text-stone-700',
  hard: 'bg-neutral-800 text-white',
};

export default function TourCard({ tour, onView }: TourCardProps) {
  return (
    <div
      onClick={() => onView?.(tour)}
      className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl hover:shadow-stone-900/10 hover:border-stone-400 transition-all duration-500 flex flex-col cursor-pointer relative"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={tour?.image_url || ''}
          alt={tour?.title || 'تور'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent" />

        {/* Verified badge */}
        <div className="absolute top-3 right-3 bg-neutral-800 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <BadgeCheck className="w-3.5 h-3.5 text-stone-300" />
          <span className="font-medium tracking-wide">هم‌کوچ تایید شده</span>
        </div>

        {/* Difficulty badge */}
        <div
          className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full shadow-md ${
            difficultyStyles[tour?.difficulty] || 'bg-stone-100 text-stone-700'
          }`}
        >
          {difficultyLabels[tour?.difficulty] || '—'}
        </div>

        {/* Destination overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-medium text-white bg-neutral-800/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-stone-300" />
          <span>{tour?.destination || 'ایران زیبا'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Top section */}
        <div>
          {/* Duration + type */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1 text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md font-medium border border-stone-200">
              <Clock className="w-3 h-3 text-stone-500" />
              <span>{tour?.duration_days ? `${tour.duration_days} روزه` : '—'}</span>
            </div>
            <span className="text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md font-medium border border-stone-200">
              {tourTypeLabels[tour?.tour_type] || 'تور'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-800 text-base mb-2 leading-snug group-hover:text-stone-900 transition-colors">
            {tour?.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-stone-500 fill-stone-400" />
            <span className="text-sm font-semibold text-stone-800">
              {tour?.rating?.toFixed(1) || '—'}
            </span>
            <span className="text-xs text-stone-400">امتیاز</span>
          </div>
        </div>

        {/* Guide + capacity */}
        <div className="pt-3 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={tour?.guide_avatar_url || ''}
                  alt={tour?.guide_name || 'راهنما'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-stone-300"
                />
                <BadgeCheck className="w-3.5 h-3.5 text-stone-700 absolute -bottom-1 -right-1 bg-stone-50 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 tracking-wide">بانوی راهنما</span>
                <span className="text-xs font-semibold text-stone-800">
                  {tour?.guide_name || 'بانوی هم‌کوچ'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 px-2 py-1 rounded-md border border-stone-200">
              <Users className="w-3 h-3 text-stone-500" />
              <span>ظرفیت: {tour?.max_group_size || 'محدود'}</span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-[10px] text-stone-400 block tracking-wide">
                ارزش سرمایه‌گذاری سفر
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-stone-900 text-base tracking-tight">
                  {tour?.price_toman ? formatToman(tour.price_toman) : '—'}
                </span>
                <span className="text-[11px] text-stone-500 font-normal">تومان</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView?.(tour);
              }}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md font-medium flex items-center gap-1.5"
            >
              <span>مشاهده جزئیات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
