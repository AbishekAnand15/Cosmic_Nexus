import { useState, useEffect, useMemo } from 'react';
import Starfield from '@/components/Starfield';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import CategoryTabs from '@/components/CategoryTabs';
import SortBar from '@/components/SortBar';
import NewsGrid from '@/components/NewsGrid';
import SkeletonGrid from '@/components/SkeletonGrid';
import APODSection from '@/components/APODSection';
import ISSTracker from '@/components/ISSTracker';

import PlanetComparison from '@/components/PlanetComparison';
import CelestialObjects from '@/components/CelestialObjects';

import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

import { fetchAllFeeds } from '@/lib/rss';
import { NewsArticle, Category, SortOption } from '@/lib/types';

const Index = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [sort, setSort] = useState<SortOption>('latest');

  useEffect(() => {
    fetchAllFeeds().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = articles;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      );
    }

    if (category !== 'all') {
      result = result.filter((a) => a.category === category);
    }

    if (sort === 'source') {
      result = [...result].sort((a, b) => a.source.localeCompare(b.source));
    }

    return result;
  }, [articles, searchQuery, category, sort]);

  const headlines = articles.slice(0, 10).map((a) => `${a.source}: ${a.title}`);

  return (
    <div className="min-h-screen relative">

      <Starfield />
      <Navbar />
      <HeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} headlines={headlines} />
      <FeaturedCarousel articles={articles.filter((a) => a.thumbnail)} />
      <CategoryTabs active={category} onChange={setCategory} />
      <SortBar sort={sort} onSortChange={setSort} count={filtered.length} />
      {loading ? <SkeletonGrid /> : <NewsGrid articles={filtered} />}
      <APODSection />
      <ISSTracker />
      <PlanetComparison />
      <CelestialObjects />


      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
