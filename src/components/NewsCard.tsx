import { motion } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { NewsArticle } from '@/lib/types';
import { timeAgo } from '@/lib/rss';
import { useState } from 'react';

const NewsCard = ({ article, index }: { article: NewsArticle; index: number }) => {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {article.thumbnail && !imgError ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={() => setImgError(true)}
            loading="lazy"
            width={400}
            height={225}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-muted">
            <span className="text-4xl">🌌</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2 glass-card rounded-full px-3 py-1">
          <img
            src={article.sourceLogo}
            alt={article.source}
            className="w-4 h-4 rounded-full"
            width={16}
            height={16}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-xs font-accent text-foreground/80">{article.source}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-sm font-semibold leading-tight mb-2 line-clamp-2 text-foreground">
          {article.title}
        </h3>
        <p className={`text-muted-foreground text-sm font-body mb-2 flex-1 ${expanded ? '' : 'line-clamp-2'}`}>
          {article.description}
        </p>
        {article.description && article.description.length > 100 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs font-accent text-accent hover:text-primary transition-colors mb-3 self-start"
          >
            {expanded ? 'Show less' : 'Read more'}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-muted-foreground font-accent">{timeAgo(article.pubDate)}</span>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-accent text-primary hover:text-glow-gold transition-colors"
          >
            Full Article <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;
