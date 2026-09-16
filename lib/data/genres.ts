import { Genre, Country } from '@/lib/types';

export const MOVIE_GENRES: Genre[] = [
  { id: 28, name: 'Action', slug: 'action' },
  { id: 12, name: 'Adventure', slug: 'adventure' },
  { id: 16, name: 'Animation', slug: 'animation' },
  { id: 35, name: 'Comedy', slug: 'comedy' },
  { id: 80, name: 'Crime', slug: 'crime' },
  { id: 99, name: 'Documentary', slug: 'documentary' },
  { id: 18, name: 'Drama', slug: 'drama' },
  { id: 10751, name: 'Family', slug: 'family' },
  { id: 14, name: 'Fantasy', slug: 'fantasy' },
  { id: 36, name: 'History', slug: 'history' },
  { id: 27, name: 'Horror', slug: 'horror' },
  { id: 10402, name: 'Music', slug: 'music' },
  { id: 9648, name: 'Mystery', slug: 'mystery' },
  { id: 10749, name: 'Romance', slug: 'romance' },
  { id: 878, name: 'Sci-Fi', slug: 'scifi' },
  { id: 53, name: 'Thriller', slug: 'thriller' },
  { id: 10752, name: 'War', slug: 'war' },
  { id: 37, name: 'Western', slug: 'western' },
];

export const TV_GENRES: Genre[] = [
  { id: 10759, name: 'Action & Adventure', slug: 'action' },
  { id: 16, name: 'Animation', slug: 'animation' },
  { id: 35, name: 'Comedy', slug: 'comedy' },
  { id: 80, name: 'Crime', slug: 'crime' },
  { id: 99, name: 'Documentary', slug: 'documentary' },
  { id: 18, name: 'Drama', slug: 'drama' },
  { id: 10751, name: 'Family', slug: 'family' },
  { id: 10762, name: 'Kids', slug: 'kids' },
  { id: 9648, name: 'Mystery', slug: 'mystery' },
  { id: 10763, name: 'News', slug: 'news' },
  { id: 10764, name: 'Reality', slug: 'reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy', slug: 'scifi' },
  { id: 10766, name: 'Soap', slug: 'soap' },
  { id: 10767, name: 'Talk', slug: 'talk' },
  { id: 10768, name: 'War & Politics', slug: 'war' },
  { id: 37, name: 'Western', slug: 'western' },
];

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'CA', name: 'Canada' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
];
