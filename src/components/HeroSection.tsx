import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  headlines: string[];
}

const HeroSection = ({ searchQuery, onSearchChange, headlines }: HeroSectionProps) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-12 px-4 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-muted-foreground font-accent text-sm tracking-widest uppercase mb-4"
      >
        {today}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold glow-text mb-6 leading-tight"
      >
        Your Gateway to<br />
        <span className="text-primary">the Universe</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground font-accent text-lg mb-8 max-w-xl"
      >
        Aggregating the cosmos — real-time space news from NASA, ESA, SpaceX and more.
      </motion.p>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative w-full max-w-lg mb-8"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
        <input
          type="text"
          placeholder="Search the cosmos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl glow-input text-foreground font-body placeholder:text-muted-foreground outline-none"
        />
      </motion.div>

      {/* Ticker */}
      {headlines.length > 0 && (
        <div className="w-full max-w-3xl overflow-hidden rounded-lg glass-card px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="shrink-0 text-xs font-heading text-accent uppercase tracking-wider">Breaking</span>
            <div className="overflow-hidden flex-1">
              <div className="ticker-scroll flex gap-12 whitespace-nowrap">
                {[...headlines, ...headlines].map((h, i) => (
                  <span key={i} className="text-sm text-foreground/80 font-accent">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
