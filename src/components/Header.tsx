import { useState, useRef, useEffect } from 'react';
import { Heart, ChevronDown, LogOut, Edit3, Plane, Check } from 'lucide-react';
import AuthModal from './AuthModal';
import MyBookingsModal from './MyBookingsModal';
import { useAuth } from '../lib/auth';

export default function Header() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<1 | 3>(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showBookings, setShowBookings] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setEditingName(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const openLoginModal = () => {
    setAuthMode(1);
    setShowAuth(true);
  };

  const openEditNameModal = () => {
    setMenuOpen(false);
    setAuthMode(3);
    setShowAuth(true);
  };

  const handleSaveName = () => {
    if (tempName.trim().length >= 3) {
      setEditingName(false);
      setMenuOpen(false);
      setAuthMode(3);
      setShowAuth(true);
    }
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-roseGold-400 to-softSand-400 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white drop-shadow-md">هم‌کوچ</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
            <a href="#tours" className="hover:text-white transition">تورها</a>
            <a href="#" className="hover:text-white transition">راهنمایان</a>
            <a href="#" className="hover:text-white transition">درباره ما</a>
            <a href="#" className="hover:text-white transition">تماس</a>
          </nav>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/25 transition flex items-center gap-2"
              >
                <span>بانو: {user.fullName}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-stone-100 border border-stone-200 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                  {editingName ? (
                    <div className="p-4 space-y-3">
                      <label className="block text-xs font-medium text-stone-600">
                        نام جدید
                      </label>
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder={user.fullName}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveName}
                          disabled={tempName.trim().length < 3}
                          className="flex-1 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 text-stone-50 text-xs font-medium py-2 rounded-xl transition flex items-center justify-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          ذخیره
                        </button>
                        <button
                          onClick={() => {
                            setEditingName(false);
                            setTempName('');
                          }}
                          className="px-3 py-2 text-xs text-stone-500 hover:text-stone-700 transition"
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-stone-200">
                        <p className="text-xs text-stone-400">شماره موبایل</p>
                        <p className="text-sm font-medium text-stone-700" dir="ltr">
                          {user.phone}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setShowBookings(true);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm text-stone-700 hover:bg-stone-200 transition"
                      >
                        <Plane className="w-4 h-4 text-stone-500" />
                        سفرهای من
                      </button>

                      <button
                        onClick={() => setEditingName(true)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm text-stone-700 hover:bg-stone-200 transition"
                      >
                        <Edit3 className="w-4 h-4 text-stone-500" />
                        ویرایش نام
                      </button>

                      <div className="border-t border-stone-200">
                        <button
                          onClick={() => {
                            logout();
                            setMenuOpen(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 text-sm text-stone-700 hover:bg-stone-200 transition"
                        >
                          <LogOut className="w-4 h-4 text-stone-500" />
                          خروج
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/25 transition"
            >
              ورود / ثبت‌نام
            </button>
          )}
        </div>
      </header>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowAuth(false)}
        initialStep={authMode}
      />

      <MyBookingsModal
        open={showBookings}
        onClose={() => setShowBookings(false)}
      />
    </>
  );
}
