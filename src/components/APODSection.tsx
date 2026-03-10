import { motion } from 'framer-motion';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { fetchAPOD } from '@/lib/apod';
import { useQuery } from '@tanstack/react-query';

const APODSection = () => {
  const { data: apod, isLoading, error } = useQuery({
    queryKey: ['apod'],
    queryFn: fetchAPOD,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  if (error) {
    return (
      <section className="relative z-10 max-w-5xl mx-auto px-4 mb-16">
        <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center gap-4">
          <AlertCircle className="text-destructive w-12 h-12" />
          <div>
            <h3 className="text-lg font-semibold">Unable to load APOD</h3>
            <p className="text-muted-foreground text-sm">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading || !apod) {
    return (
      <section className="relative z-10 max-w-5xl mx-auto px-4 mb-16">
        <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 text-center skeleton-pulse w-64 h-8 mx-auto rounded" />
        <div className="glass-card rounded-2xl overflow-hidden md:flex min-h-[400px]">
          <div className="md:w-1/2 skeleton-pulse" />
          <div className="p-6 md:w-1/2 flex flex-col justify-center space-y-4">
            <div className="h-4 w-24 skeleton-pulse rounded" />
            <div className="h-8 w-3/4 skeleton-pulse rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full skeleton-pulse rounded" />
              <div className="h-4 w-full skeleton-pulse rounded" />
              <div className="h-4 w-full skeleton-pulse rounded" />
              <div className="h-4 w-2/3 skeleton-pulse rounded" />
            </div>
            <div className="h-10 w-40 skeleton-pulse rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative z-10 max-w-5xl mx-auto px-4 mb-16"
    >
      <h2 className="font-heading text-xl md:text-2xl font-bold mb-6 text-center">
        <span className="text-accent">✦</span> Astronomy Picture of the Day
      </h2>
      <div className="glass-card rounded-2xl overflow-hidden md:flex">
        <div className="md:w-1/2">
          {apod.media_type === 'image' ? (
            <img src={apod.url} alt={apod.title} className="w-full h-64 md:h-full object-cover" />
          ) : (
            <iframe src={apod.url} title={apod.title} className="w-full h-64 md:h-full" allowFullScreen />
          )}
        </div>
        <div className="p-6 md:w-1/2 flex flex-col justify-center">
          <p className="text-xs text-muted-foreground font-accent mb-2">{apod.date}</p>
          <h3 className="font-heading text-lg font-semibold mb-3">{apod.title}</h3>
          <p className="text-sm text-muted-foreground font-body line-clamp-6 mb-4">{apod.explanation}</p>
          <a
            href="https://apod.nasa.gov/apod/astropix.html"
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm w-fit"
          >
            View on NASA APOD <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default APODSection;
