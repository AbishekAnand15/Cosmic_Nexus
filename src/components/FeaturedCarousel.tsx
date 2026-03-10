import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { NewsArticle } from '@/lib/types';
import { timeAgo } from '@/lib/rss';

const FeaturedCarousel = ({ articles }: { articles: NewsArticle[] }) => {
  const [current, setCurrent] = useState(0);
  const items = articles.slice(0, 5);
  const isLoading = items.length === 0;

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => setCurrent((p) => (p + 1) % items.length), 6000);

    // Dynamic Preload for LCP discovery
    const firstImage = items.find(item => item.thumbnail)?.thumbnail;
    if (firstImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = firstImage;
      // @ts-ignore
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    }

    return () => clearInterval(interval);
  }, [items.length, isLoading]);

  const article = items[current];

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 mb-12">
      <div className="relative rounded-2xl overflow-hidden glass-card min-h-[300px] md:min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 skeleton-pulse flex flex-col justify-end p-6 md:p-10">
            <div className="h-6 w-32 bg-muted rounded-full mb-4" />
            <div className="h-10 w-3/4 bg-muted rounded mb-4" />
            <div className="h-4 w-1/2 bg-muted rounded mb-4" />
            <div className="h-10 w-40 bg-muted rounded" />
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 aspect-video md:aspect-[21/9]"
              >
                {article.thumbnail ? (
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="w-full h-full object-cover opacity-40"
                    loading="eager"
                    // @ts-ignore - fetchpriority is a new attribute
                    fetchpriority="high"
                    width={1200}
                    height={600}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 flex flex-col justify-end p-6 md:p-10 min-h-[300px] md:min-h-[400px]">
              <span className="inline-block glass-card rounded-full px-3 py-1 text-xs font-accent text-primary mb-3 w-fit">
                {article.source} · {timeAgo(article.pubDate)}
              </span>
              <h2 className="font-heading text-xl md:text-3xl font-bold mb-3 leading-tight max-w-2xl">
                {article.title}
              </h2>
              <p className="text-muted-foreground font-body text-sm max-w-xl mb-4 line-clamp-2">
                {article.description}
              </p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm w-fit"
              >
                Read Full Story <ExternalLink size={14} />
              </a>
            </div>

            {/* Navigation */}
            <button
              onClick={() => setCurrent((p) => (p - 1 + items.length) % items.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 glass-card rounded-full p-2 text-foreground/70 hover:text-foreground transition z-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrent((p) => (p + 1) % items.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 glass-card rounded-full p-2 text-foreground/70 hover:text-foreground transition z-20"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-foreground/30'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
