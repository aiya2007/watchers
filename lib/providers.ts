/**
 * Helper to build direct watch/search links to streaming providers
 */
export function getWatchProviderUrl(
  providerName: string,
  mediaTitle: string,
  mediaType: 'movie' | 'tv' = 'movie',
  fallbackLink?: string
): string {
  if (!providerName) {
    return fallbackLink && fallbackLink.startsWith('http') ? fallbackLink : '#';
  }

  const normalized = providerName.trim().toLowerCase();
  const encodedTitle = encodeURIComponent(mediaTitle.trim());
  const typeSuffix = mediaType === 'tv' ? 'tv+series' : 'movie';

  // Major subscription streaming services
  if (normalized.includes('netflix')) {
    return `https://www.netflix.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('amazon') || normalized.includes('prime video')) {
    return `https://www.amazon.com/s?k=${encodedTitle}&i=instant-video`;
  }
  if (normalized.includes('disney')) {
    return `https://www.disneyplus.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('apple') || normalized.includes('itunes')) {
    return `https://tv.apple.com/search?term=${encodedTitle}`;
  }
  if (normalized.includes('max') || normalized.includes('hbo')) {
    return `https://www.max.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('hulu')) {
    return `https://www.hulu.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('paramount')) {
    return `https://www.paramountplus.com/search/?query=${encodedTitle}`;
  }
  if (normalized.includes('peacock')) {
    return `https://www.peacocktv.com`;
  }
  if (normalized.includes('youtube')) {
    return `https://www.youtube.com/results?search_query=${encodedTitle}+${typeSuffix}`;
  }
  if (normalized.includes('google play')) {
    return `https://play.google.com/store/search?q=${encodedTitle}&c=movies`;
  }
  if (normalized.includes('vudu') || normalized.includes('fandango')) {
    return `https://www.vudu.com/content/movies/search?searchString=${encodedTitle}`;
  }
  if (normalized.includes('tubi')) {
    return `https://tubitv.com/search/${encodedTitle}`;
  }
  if (normalized.includes('pluto')) {
    return `https://pluto.tv/search/details?query=${encodedTitle}`;
  }
  if (normalized.includes('criterion')) {
    return `https://www.criterionchannel.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('crunchyroll')) {
    return `https://www.crunchyroll.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('britbox')) {
    return `https://www.britbox.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('mubi')) {
    return `https://mubi.com/search?query=${encodedTitle}`;
  }
  if (normalized.includes('shudder')) {
    return `https://www.shudder.com/search?q=${encodedTitle}`;
  }
  if (normalized.includes('starz')) {
    return `https://www.starz.com/us/en/search?q=${encodedTitle}`;
  }
  if (normalized.includes('amc')) {
    return `https://www.amcplus.com/search?q=${encodedTitle}`;
  }

  // Fallback to JustWatch deep link if available
  if (fallbackLink && fallbackLink.startsWith('http')) {
    return fallbackLink;
  }

  // Safe search fallback
  return `https://www.google.com/search?q=${encodedTitle}+${typeSuffix}+watch+on+${encodeURIComponent(providerName)}`;
}
