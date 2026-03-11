export const config = {
  runtime: 'edge',
};

const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json';

const RSS_SOURCES = [
  { name: 'NASA', url: 'https://www.nasa.gov/news-release/feed/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/110px-NASA_logo.svg.png' },
  { name: 'Space.com', url: 'https://www.space.com/feeds/all', logo: 'https://www.space.com/favicon.ico' },
  { name: 'Universe Today', url: 'https://www.universetoday.com/feed', logo: 'https://www.universetoday.com/favicon.ico' },
  { name: 'Spaceflight Now', url: 'https://spaceflightnow.com/feed/', logo: 'https://spaceflightnow.com/favicon.ico' },
  { name: 'The Planetary Society', url: 'https://www.planetary.org/articles/rss', logo: 'https://www.planetary.org/favicon.ico' },
  { name: 'ESA', url: 'https://www.esa.int/rssfeed/Our_Activities/Space_Science', logo: 'https://www.esa.int/favicon.ico' },
  { name: 'Sky & Telescope', url: 'https://skyandtelescope.org/astronomy-news/feed/', logo: 'https://skyandtelescope.org/favicon.ico' },
  { name: 'Phys.org Space', url: 'https://phys.org/rss-feed/space-news/', logo: 'https://phys.org/favicon.ico' },
];

function categorizeArticle(title, description) {
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

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function extractImageFromContent(html) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1] || '';
}

async function fetchSource(source) {
  try {
    const res = await fetch(`${RSS2JSON_BASE}?rss_url=${encodeURIComponent(source.url)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !data.items) return [];

    return data.items.map((item) => {
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
      };
    });
  } catch {
    return [];
  }
}

export default async function handler(req) {
  try {
    const results = await Promise.allSettled(RSS_SOURCES.map(fetchSource));
    const articles = [];
    
    for (const r of results) {
      if (r.status === 'fulfilled') {
        articles.push(...r.value);
      }
    }

    // Sort by date
    articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache entire bundle for 1 hour at the edge
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
