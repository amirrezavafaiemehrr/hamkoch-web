import { Sparkles, Mountain, Leaf, Landmark } from 'lucide-react';
import type { TourType, Difficulty } from '../types';

interface FilterBarProps {
  selectedTypes: TourType[];
  selectedDifficulty: Difficulty | '';
  selectedDuration: string;
  onTypeToggle: (type: TourType) => void;
  onDifficultyChange: (difficulty: Difficulty | '') => void;
  onDurationChange: (duration: string) => void;
  onClear: () => void;
}

const tourTypeFilters: { value: TourType; label: string; icon: typeof Sparkles }[] = [
  { value: 'yoga', label: 'یوگا و سلامتی', icon: Sparkles },
  { value: 'hiking', label: 'کوهپیمایی', icon: Mountain },
  { value: 'eco', label: 'اکوتور', icon: Leaf },
  { value: 'cultural', label: 'فرهنگی', icon: Landmark },
];

const difficultyFilters: { value: Difficulty | ''; label: string }[] = [
  { value: '', label: 'همه' },
  { value: 'easy', label: 'آسان' },
  { value: 'moderate', label: 'متوسط' },
  { value: 'hard', label: 'سخت' },
];

const durationFilters = [
  { value: '', label: 'همه' },
  { value: 'short', label: '۱ تا ۳ روز' },
  { value: 'medium', label: '۴ تا ۵ روز' },
  { value: 'long', label: 'بیشتر از ۵ روز' },
];

export default function FilterBar({
  selectedTypes,
  selectedDifficulty,
  selectedDuration,
  onTypeToggle,
  onDifficultyChange,
  onDurationChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedDifficulty !== '' ||
    selectedDuration !== '';

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-softSand-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-semibold text-softSand-800">فیلترها</span>
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="text-xs text-roseGold-600 hover:text-roseGold-700 font-medium transition flex items-center gap-1"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-softSand-600 mb-2">نوع تور</label>
              <div className="flex flex-wrap gap-2">
                {tourTypeFilters.map(({ value, label, icon: Icon }) => {
                  const active = selectedTypes.includes(value);
                  return (
                    <button
                      key={value}
                      onClick={() => onTypeToggle(value)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        active
                          ? 'bg-deepTeal-500 text-white border-deepTeal-500 shadow-md shadow-deepTeal-500/25'
                          : 'bg-white text-softSand-700 border-softSand-200 hover:border-deepTeal-300 hover:text-deepTeal-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:w-auto">
              <label className="block text-xs text-softSand-600 mb-2">سطح سختی</label>
              <div className="flex flex-wrap gap-2">
                {difficultyFilters.map(({ value, label }) => {
                  const active = selectedDifficulty === value;
                  return (
                    <button
                      key={value}
                      onClick={() => onDifficultyChange(value)}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        active
                          ? 'bg-roseGold-500 text-white border-roseGold-500 shadow-md shadow-roseGold-500/25'
                          : 'bg-white text-softSand-700 border-softSand-200 hover:border-roseGold-300 hover:text-roseGold-600'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:w-auto">
              <label className="block text-xs text-softSand-600 mb-2">مدت تور</label>
              <div className="flex flex-wrap gap-2">
                {durationFilters.map(({ value, label }) => {
                  const active = selectedDuration === value;
                  return (
                    <button
                      key={value}
                      onClick={() => onDurationChange(value)}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        active
                          ? 'bg-softSand-400 text-white border-softSand-400 shadow-md shadow-softSand-400/25'
                          : 'bg-white text-softSand-700 border-softSand-200 hover:border-softSand-400 hover:text-softSand-600'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
