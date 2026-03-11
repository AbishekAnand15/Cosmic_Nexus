import { NewsArticle, RSS_SOURCES, Category } from './types';

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';

function categorizeArticle(title: string, description: string): Category {
  const text = `${title} ${description}`.toLowerCase();
  if (/mars|martian|perseverance|curiosity|ingenuity/.test(text)) return 'mars';
  if (/launch|rocket|starship|falcon|sls|artemis|liftoff/.test(text)) return 'launches';
  if (/black hole|event horizon|singularity/.test(text)) return 'black-holes';
  if (/exoplanet|habitable|kepler|tess|trappist/.test(text)) return 'exoplanets';
  if (/telescope|jwst|james webb|hubble|chandra/.test(text)) return 'telescopes';
  if (/asteroid|meteor|comet|near-earth/.test(text)) return 'asteroids';
  if (/solar system|jupiter|saturn|venus|mercury|neptune|uranus|pluto|moon|sun|solar/.test(text)) return 'solar-system';
  if (/galaxy|nebula|supernova|dark matter|dark energy|cosmic|universe|deep space|quasar/.test(text)) return 'deep-space';
  return 'all';
}

export async function fetchRSSFeed(sourceIndex: number): Promise<NewsArticle[]> {
  const source = RSS_SOURCES[sourceIndex];
  if (!source) return [];

  try {
    const res = await fetch(`/api/news?url=${encodeURIComponent(source.url)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !data.items) return [];

    return data.items.map((item: any) => {
      const thumbnail = item.thumbnail || item.enclosure?.link || extractImageFromContent(item.content || item.description || '') || '';
      return {
        title: item.title || '',
        description: stripHtml(item.description || item.content || '').slice(0, 200),
        link: item.link || '',
        pubDate: item.pubDate || '',
        thumbnail,
        source: source.name,
        sourceLogo: source.logo,
        category: categorizeArticle(item.title || '', item.description || ''),
      } as NewsArticle;
    });
  } catch {
    return [];
  }
}

export async function fetchAllFeeds(): Promise<NewsArticle[]> {
  try {
    const res = await fetch('/api/all-news');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function extractImageFromContent(html: string): string {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1] || '';
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
