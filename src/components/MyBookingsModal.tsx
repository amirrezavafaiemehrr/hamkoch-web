import { useState, useEffect } from 'react';
import {
  X,
  Plane,
  Calendar,
  MapPin,
  Phone,
  QrCode,
  Loader2,
  Ticket,
  ChevronLeft,
  Heart,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface MyBookingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface BookingWithTour {
  id: string;
  tour_id: string;
  full_name: string;
  phone: string;
  national_id: string;
  room_sharing: boolean;
  status: string;
  created_at: string;
  tour: {
    title: string;
    destination: string;
    image_url: string;
    duration_days: number;
    guide_name: string;
  } | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'در انتظار حرکت', className: 'bg-stone-100 text-stone-600' },
  confirmed: { label: 'تایید شده', className: 'bg-stone-800 text-stone-50' },
  completed: { label: 'تکمیل شده', className: 'bg-stone-200 text-stone-500' },
};

export default function MyBookingsModal({ open, onClose }: MyBookingsModalProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithTour | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    fetchBookings();
  }, [open, user]);

  async function fetchBookings() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          tour_id,
          full_name,
          phone,
          national_id,
          room_sharing,
          status,
          created_at,
          tour:tours ( title, destination, image_url, duration_days, guide_name )
        `)
        .eq('phone', user!.phone)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookings((data || []) as unknown as BookingWithTour[]);
    } catch {
      setError('خطا در بارگذاری رزروها. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-start justify-center overflow-y-auto bg-stone-900/40 backdrop-blur-sm p-2 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-2xl my-4 animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          {selectedBooking ? (
            <button
              onClick={() => setSelectedBooking(null)}
              className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              بازگشت
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-stone-50" />
              </div>
              <h3 className="font-bold text-stone-800 text-sm">سفرهای من</h3>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-stone-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-stone-400 animate-spin mb-3" />
              <p className="text-sm text-stone-400">در حال بارگذاری سفرهای شما...</p>
            </div>
          ) : error ? (
            <div className="bg-stone-100 border border-stone-200 text-stone-600 text-sm rounded-2xl p-4 text-center">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-stone-400" />
              </div>
              <h4 className="text-base font-semibold text-stone-700 mb-1">سفری ثبت نشده</h4>
              <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
                هنوز توری رزرو نکرده‌اید. پس از رزرو تور، سفرهای شما اینجا نمایش داده می‌شوند.
              </p>
            </div>
          ) : selectedBooking ? (
            /* Digital Ticket Card */
            <div className="animate-fade-in">
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
                {/* Tour image header */}
                {selectedBooking.tour?.image_url && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={selectedBooking.tour.image_url}
                      alt={selectedBooking.tour.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                    <div className="absolute bottom-3 right-4 left-4">
                      <h4 className="text-lg font-bold text-white">{selectedBooking.tour.title}</h4>
                      <div className="flex items-center gap-1.5 text-white/80 text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedBooking.tour.destination}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ticket body */}
                <div className="p-5 space-y-4">
                  {/* Status badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400">وضعیت رزرو</span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${(statusConfig[selectedBooking.status] || statusConfig.pending).className}`}>
                      {(statusConfig[selectedBooking.status] || statusConfig.pending).label}
                    </span>
                  </div>

                  {/* Ticket details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        تاریخ حرکت
                      </div>
                      <p className="text-sm font-medium text-stone-800">
                        {formatDate(selectedBooking.created_at)}
                      </p>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        محل rendezvous
                      </div>
                      <p className="text-sm font-medium text-stone-800">
                        {selectedBooking.tour?.destination || '—'}
                      </p>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        راهنمای تور
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-stone-800">
                          {selectedBooking.tour?.guide_name || '—'}
                        </p>
                        <button
                          className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition"
                          title="تماس با راهنما"
                        >
                          <Phone className="w-3.5 h-3.5 text-stone-50" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                      <div className="flex items-center gap-2 text-stone-400 text-xs mb-1.5">
                        <Plane className="w-3.5 h-3.5" />
                        شماره رزرو
                      </div>
                      <p className="text-sm font-medium text-stone-800" dir="ltr">
                        {selectedBooking.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* QR code placeholder */}
                  <div className="flex flex-col items-center bg-stone-50 rounded-2xl p-5 border border-stone-200">
                    <div className="w-32 h-32 bg-white rounded-2xl border-2 border-stone-200 flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-stone-700" />
                    </div>
                    <p className="text-xs text-stone-400 mt-3 text-center leading-relaxed">
                      این کد را در روز حرکت برای ثبت ورود به همراه داشته باشید
                    </p>
                  </div>
                </div>

                {/* Perforated edge */}
                <div className="flex items-center gap-2 px-5">
                  <div className="w-5 h-5 rounded-full bg-stone-50 -ml-5 border border-stone-200" />
                  <div className="flex-1 border-t-2 border-dashed border-stone-200" />
                  <div className="w-5 h-5 rounded-full bg-stone-50 -mr-5 border border-stone-200" />
                </div>

                {/* Footer */}
                <div className="px-5 py-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-stone-400" />
                  <span className="text-xs text-stone-400">هم‌کوچ — سفرهای امن بانوان</span>
                </div>
              </div>
            </div>
          ) : (
            /* Bookings list */
            <div className="space-y-3">
              {bookings.map((booking) => {
                const status = statusConfig[booking.status] || statusConfig.pending;
                return (
                  <button
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full bg-white rounded-2xl p-4 border border-stone-200 hover:border-stone-400 transition-all duration-200 flex items-center gap-4 text-right"
                  >
                    {booking.tour?.image_url && (
                      <img
                        src={booking.tour.image_url}
                        alt={booking.tour.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-stone-800 text-sm truncate">
                        {booking.tour?.title || 'تور'}
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {booking.tour?.destination}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-stone-400">
                          {formatDate(booking.created_at)}
                        </span>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-stone-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
