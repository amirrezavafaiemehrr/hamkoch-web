import { useState, useEffect, useMemo } from 'react';
import { Loader2, SearchX } from 'lucide-react';
import type { Tour, TourType, Difficulty } from './types';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import RoomSharingBanner from './components/RoomSharingBanner';
import FilterBar from './components/FilterBar';
import SearchFilter, { type SearchFilterValues } from './components/SearchFilter';
import SafetySection from './components/SafetySection';
import TourCard from './components/TourCard';
import TourDetailModal from './components/TourDetailModal';
import Footer from './components/Footer';

export default function App() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Filters
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDifficulty, setSearchDifficulty] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<TourType[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | ''>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');

  // Active search filter values
  const [searchFilterValues, setSearchFilterValues] = useState<SearchFilterValues>({
    destination: '',
    difficulty: '',
    maxBudget: '',
  });

  useEffect(() => {
    fetchTours();
  }, []);

  async function fetchTours() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('tours')
        .select('*')
        .order('rating', { ascending: false });

      if (fetchError) throw fetchError;
      setTours((data || []) as Tour[]);
    } catch {
      setError('خطا در بارگذاری تورها. لطفاً صفحه را بازخوانی کنید.');
    } finally {
      setLoading(false);
    }
  }

  const handleTypeToggle = (type: TourType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedDifficulty('');
    setSelectedDuration('');
    setSearchDestination('');
    setSearchDifficulty('');
    setSearchFilterValues({ destination: '', difficulty: '', maxBudget: '' });
  };

  const handleHeroSearch = (filters: {
    destination: string;
    date: string;
    difficulty: string;
  }) => {
    setSearchDestination(filters.destination);
    setSearchDifficulty(filters.difficulty);
    if (filters.difficulty) {
      setSelectedDifficulty(filters.difficulty as Difficulty);
    }
  };

  const handleSearchFilterChange = (values: SearchFilterValues) => {
    setSearchFilterValues(values);
    setSearchDestination(values.destination);
    if (values.difficulty) {
      setSelectedDifficulty(values.difficulty);
      setSearchDifficulty('');
    } else {
      setSelectedDifficulty('');
      setSearchDifficulty('');
    }
  };

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      if (searchDestination && !tour.destination.includes(searchDestination) && !tour.title.includes(searchDestination)) {
        return false;
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(tour.tour_type)) {
        return false;
      }
      const effectiveDifficulty = selectedDifficulty || (searchDifficulty as Difficulty | '');
      if (effectiveDifficulty && tour.difficulty !== effectiveDifficulty) {
        return false;
      }
      if (selectedDuration) {
        if (selectedDuration === 'short' && tour.duration_days > 3) return false;
        if (selectedDuration === 'medium' && (tour.duration_days < 4 || tour.duration_days > 5)) return false;
        if (selectedDuration === 'long' && tour.duration_days <= 5) return false;
      }
      if (searchFilterValues.maxBudget) {
        const max = parseInt(searchFilterValues.maxBudget);
        if (tour.price_toman > max) return false;
      }
      return true;
    });
  }, [tours, searchDestination, selectedTypes, selectedDifficulty, searchDifficulty, selectedDuration, searchFilterValues.maxBudget]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero onSearch={handleHeroSearch} />
      <RoomSharingBanner />

      <FilterBar
        selectedTypes={selectedTypes}
        selectedDifficulty={selectedDifficulty}
        selectedDuration={selectedDuration}
        onTypeToggle={handleTypeToggle}
        onDifficultyChange={(d) => {
          setSelectedDifficulty(d);
          setSearchDifficulty('');
        }}
        onDurationChange={setSelectedDuration}
        onClear={handleClearFilters}
      />

      <main id="tours" className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-1">تورهای ویژه بانوان</h2>
          <p className="text-sm text-stone-500">
            {loading
              ? 'در حال بارگذاری...'
              : `${filteredTours.length} تور یافت شد`}
          </p>
        </div>

        {/* Active search & filter bar */}
        <div className="mb-6">
          <SearchFilter
            values={searchFilterValues}
            onChange={handleSearchFilterChange}
            onClear={() => {
              setSearchFilterValues({ destination: '', difficulty: '', maxBudget: '' });
              setSearchDestination('');
              setSelectedDifficulty('');
              setSearchDifficulty('');
            }}
          />
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-stone-400 animate-spin mb-4" />
            <p className="text-stone-500">در حال بارگذاری تورها...</p>
          </div>
        )}

        {error && (
          <div className="bg-stone-100 border border-stone-200 text-stone-600 rounded-2xl p-6 text-center">
            {error}
          </div>
        )}

        {!loading && !error && filteredTours.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-800 mb-1">توری یافت نشد</h3>
            <p className="text-sm text-stone-500 mb-4">با فیلترهای انتخاب شده توری پیدا نشد.</p>
            <button
              onClick={handleClearFilters}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition"
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}

        {!loading && !error && filteredTours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, idx) => (
              <div
                key={tour.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <TourCard tour={tour} onView={setSelectedTour} />
              </div>
            ))}
          </div>
        )}
      </main>

      <SafetySection />

      <Footer />

      {selectedTour && (
        <TourDetailModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
      )}
    </div>
  );
}
