import { MediaItem } from './types';

/**
 * Derives complementary brand colors and gradients from a media item's genres or backdrop
 */
export function derivePalette(media: Partial<MediaItem>): {
  dominant: string;
  accent: string;
  text: string;
} {
  if (media.palette) return media.palette;
  const genres = media.genres || [];
  const genreNames = genres.map(g => g.name.toLowerCase());
  const genreIds = media.genre_ids || [];

  if (genreNames.includes('sci-fi') || genreIds.includes(878) || genreIds.includes(10765)) {
    return { dominant: '#0284c7', accent: '#38bdf8', text: '#ffffff' };
  }
  if (genreNames.includes('action') || genreIds.includes(28) || genreIds.includes(10759)) {
    return { dominant: '#dc2626', accent: '#ef4444', text: '#ffffff' };
  }
  if (genreNames.includes('drama') || genreIds.includes(18)) {
    return { dominant: '#d97706', accent: '#f59e0b', text: '#ffffff' };
  }
  if (genreNames.includes('animation') || genreIds.includes(16)) {
    return { dominant: '#7c3aed', accent: '#a78bfa', text: '#ffffff' };
  }
  if (genreNames.includes('horror') || genreIds.includes(27)) {
    return { dominant: '#991b1b', accent: '#f87171', text: '#ffffff' };
  }
  if (genreNames.includes('comedy') || genreIds.includes(35)) {
    return { dominant: '#059669', accent: '#34d399', text: '#ffffff' };
  }
  return { dominant: '#2563eb', accent: '#60a5fa', text: '#ffffff' };
}
