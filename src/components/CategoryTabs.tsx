import { CATEGORIES, Category } from '@/lib/types';

interface CategoryTabsProps {
  active: Category;
  onChange: (c: Category) => void;
}

const CategoryTabs = ({ active, onChange }: CategoryTabsProps) => (
  <div className="relative z-10 flex flex-wrap justify-center gap-2 px-4 mb-8">
    {CATEGORIES.map((cat) => (
      <button
        key={cat.value}
        onClick={() => onChange(cat.value)}
        className={`tab-glow px-4 py-2 rounded-full text-sm font-accent transition-all ${
          active === cat.value
            ? 'active text-primary glass-card border-primary/30'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {cat.label}
      </button>
    ))}
  </div>
);

export default CategoryTabs;
