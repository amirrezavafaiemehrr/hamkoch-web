import {
  MapPin,
  Clock,
  Users,
  Star,
  Crown,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import type { Tour } from '../types';
import { tourTypeLabels, difficultyLabels, formatToman } from '../types';

interface TourCardProps {
  tour: Tour;
  onView: (tour: Tour) => void;
}

const difficultyStyles: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  moderate: 'bg-amber-100 text-amber-700',
  hard: 'bg-rose-100 text-rose-700',
};

export default function TourCard({ tour, onView }: TourCardProps) {
  return (
    <div
      onClick={() => onView?.(tour)}
      className="group bg-ivory-100 rounded-2xl overflow-hidden border border-amber-200/60 shadow-sm hover:shadow-2xl hover:shadow-royalRose-900/10 hover:border-amber-400/80 transition-all duration-500 flex flex-col cursor-pointer relative"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={tour?.image_url || ''}
          alt={tour?.title || 'تور'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royalRose-950/70 via-royalRose-900/10 to-transparent" />

        {/* Crown badge — verified host */}
        <div className="absolute top-3 right-3 bg-royalRose-950/80 backdrop-blur-md border border-amber-400/50 text-amber-200 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
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
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-medium text-amber-100 bg-royalRose-950/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-amber-400/20">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{tour?.destination || 'ایران زیبا'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Top section */}
        <div>
          {/* Duration + type */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1 text-royalRose-800 bg-amber-100/60 px-2.5 py-1 rounded-md font-medium border border-amber-200/50">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>{tour?.duration_days ? `${tour.duration_days} روزه` : '—'}</span>
            </div>
            <span className="text-royalRose-700/70 bg-royalRose-50 px-2.5 py-1 rounded-md font-medium border border-royalRose-200/40">
              {tourTypeLabels[tour?.tour_type] || 'تور'}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-royalRose-950 text-base mb-2 leading-snug group-hover:text-royalRose-800 transition-colors">
            {tour?.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span className="text-sm font-semibold text-royalRose-900">
              {tour?.rating?.toFixed(1) || '—'}
            </span>
            <span className="text-xs text-stone-400">امتیاز</span>
          </div>
        </div>

        {/* Guide + capacity */}
        <div className="pt-3 border-t border-amber-200/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={tour?.guide_avatar_url || ''}
                  alt={tour?.guide_name || 'راهنما'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-400/60"
                />
                <Sparkles className="w-3 h-3 text-amber-500 absolute -bottom-1 -right-1 drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-stone-400 tracking-wide">بانوی راهنما</span>
                <span className="text-xs font-semibold text-royalRose-900">
                  {tour?.guide_name || 'بانوی هم‌کوچ'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-royalRose-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/50">
              <Users className="w-3 h-3 text-amber-600" />
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
                <span className="font-extrabold text-royalRose-950 text-base tracking-tight">
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
              className="bg-gradient-to-l from-royalRose-900 via-royalRose-950 to-royalRose-900 text-amber-200 text-xs px-4 py-2.5 rounded-xl hover:brightness-125 transition-all duration-300 shadow-md hover:shadow-royalRose-900/30 font-medium border border-amber-400/30 flex items-center gap-1.5"
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
