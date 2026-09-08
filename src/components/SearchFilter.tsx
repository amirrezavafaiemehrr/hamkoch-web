import { Search, Gauge, Wallet, X } from 'lucide-react';
import type { Difficulty } from '../types';

export interface SearchFilterValues {
  destination: string;
  difficulty: Difficulty | '';
  maxBudget: string;
}

interface SearchFilterProps {
  values: SearchFilterValues;
  onChange: (values: SearchFilterValues) => void;
  onClear: () => void;
}

const difficultyOptions: { value: Difficulty | ''; label: string }[] = [
  { value: '', label: 'همه' },
  { value: 'easy', label: 'ساده' },
  { value: 'moderate', label: 'متوسط' },
  { value: 'hard', label: 'چالش‌برانگیز' },
];

const budgetOptions = [
  { value: '', label: 'بدون محدودیت' },
  { value: '500000', label: 'تا ۵۰۰ هزار' },
  { value: '1000000', label: 'تا ۱ میلیون' },
  { value: '2000000', label: 'تا ۲ میلیون' },
  { value: '5000000', label: 'تا ۵ میلیون' },
];

export default function SearchFilter({ values, onChange, onClear }: SearchFilterProps) {
  const hasActiveFilters =
    values.destination !== '' ||
    values.difficulty !== '' ||
    values.maxBudget !== '';

  return (
    <div className="bg-stone-50 rounded-3xl border border-stone-200 p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-stone-500" />
          <span className="text-sm font-semibold text-stone-800">جستجوی تور</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs text-stone-500 hover:text-stone-700 font-medium transition flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            پاک کردن
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Destination search */}
        <div>
          <label className="block text-xs text-stone-500 mb-1.5">مقصد</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={values.destination}
              onChange={(e) => onChange({ ...values, destination: e.target.value })}
              placeholder="مثلاً مرنجاب، هرمز..."
              className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs text-stone-500 mb-1.5">سطح سختی</label>
          <div className="relative">
            <Gauge className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <select
              value={values.difficulty}
              onChange={(e) => onChange({ ...values, difficulty: e.target.value as Difficulty | '' })}
              className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition appearance-none cursor-pointer"
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Max budget */}
        <div>
          <label className="block text-xs text-stone-500 mb-1.5">بیشترین بودجه</label>
          <div className="relative">
            <Wallet className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <select
              value={values.maxBudget}
              onChange={(e) => onChange({ ...values, maxBudget: e.target.value })}
              className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition appearance-none cursor-pointer"
            >
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
