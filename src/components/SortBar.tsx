import { SortOption } from '@/lib/types';

interface SortBarProps {
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
  count: number;
}

const SortBar = ({ sort, onSortChange, count }: SortBarProps) => (
  <div className="relative z-10 max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
    <p className="text-sm text-muted-foreground font-accent">{count} articles</p>
    <div className="flex gap-2">
      {(['latest', 'source'] as SortOption[]).map((s) => (
        <button
          key={s}
          onClick={() => onSortChange(s)}
          className={`px-3 py-1 rounded-full text-xs font-accent transition-all ${
            sort === s ? 'glass-card text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {s === 'latest' ? 'Latest' : 'By Source'}
        </button>
      ))}
    </div>
  </div>
);

export default SortBar;
