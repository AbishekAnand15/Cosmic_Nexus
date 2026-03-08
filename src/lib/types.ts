export interface NewsArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  source: string;
  sourceLogo: string;
  category: string;
}

export interface APODData {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  date: string;
  media_type: string;
}

export type Category = 'all' | 'solar-system' | 'deep-space' | 'mars' | 'launches' | 'black-holes' | 'exoplanets' | 'telescopes' | 'asteroids';

export type SortOption = 'latest' | 'source';

export const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Solar System', value: 'solar-system' },
  { label: 'Deep Space', value: 'deep-space' },
  { label: 'Mars', value: 'mars' },
  { label: 'Launches', value: 'launches' },
  { label: 'Black Holes', value: 'black-holes' },
  { label: 'Exoplanets', value: 'exoplanets' },
  { label: 'Telescopes', value: 'telescopes' },
  { label: 'Asteroids', value: 'asteroids' },
];

export const RSS_SOURCES = [
  { name: 'NASA', url: 'https://www.nasa.gov/news-release/feed/', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/110px-NASA_logo.svg.png' },
  { name: 'Space.com', url: 'https://www.space.com/feeds/all', logo: 'https://www.space.com/favicon.ico' },
  { name: 'Universe Today', url: 'https://www.universetoday.com/feed', logo: 'https://www.universetoday.com/favicon.ico' },
  { name: 'Spaceflight Now', url: 'https://spaceflightnow.com/feed/', logo: 'https://spaceflightnow.com/favicon.ico' },
  { name: 'The Planetary Society', url: 'https://www.planetary.org/articles/rss', logo: 'https://www.planetary.org/favicon.ico' },
  { name: 'ESA', url: 'https://www.esa.int/rssfeed/Our_Activities/Space_Science', logo: 'https://www.esa.int/favicon.ico' },
  { name: 'Sky & Telescope', url: 'https://skyandtelescope.org/astronomy-news/feed/', logo: 'https://skyandtelescope.org/favicon.ico' },
  { name: 'Phys.org Space', url: 'https://phys.org/rss-feed/space-news/', logo: 'https://phys.org/favicon.ico' },
];
