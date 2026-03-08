import { NewsArticle } from '@/lib/types';
import NewsCard from './NewsCard';
import { useState } from 'react';

const PAGE_SIZE = 12;

const NewsGrid = ({ articles }: { articles: NewsArticle[] }) => {
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.slice(0, visible).map((article, i) => (
          <NewsCard key={`${article.link}-${i}`} article={article} index={i} />
        ))}
      </div>

      {visible < articles.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="glow-button px-8 py-3 rounded-xl font-accent text-sm"
          >
            Load More Articles
          </button>
        </div>
      )}

      {articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-accent text-lg">No articles found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default NewsGrid;
