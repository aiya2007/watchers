export type MediaType = 'movie' | 'tv' | 'person';

export interface WatchProviderItem {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
  url?: string;
}

export interface WatchProvidersResult {
  link?: string;
  flatrate?: WatchProviderItem[];
  rent?: WatchProviderItem[];
  buy?: WatchProviderItem[];
  ads?: WatchProviderItem[];
  free?: WatchProviderItem[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface VideoTrailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MediaItem {
  id: number;
  title: string;
  name?: string; // For TV
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  media_type: 'movie' | 'tv';
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  origin_country?: string[];
  original_language?: string;
  budget?: number;
  revenue?: number;
  cast?: CastMember[];
  crew?: CrewMember[];
  trailers?: VideoTrailer[];
  watch_providers?: WatchProvidersResult;
  recommendations?: MediaItem[];
  palette?: {
    dominant: string;
    accent: string;
    text: string;
  };
}

export interface FilmographyCredit {
  id: number;
  title: string;
  character?: string;
  job?: string;
  department?: string;
  release_date?: string;
  poster_path?: string | null;
  media_type: 'movie' | 'tv';
  popularity?: number;
  vote_average?: number;
}

export interface PersonItem {
  id: number;
  name: string;
  profile_path: string | null;
  biography?: string;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string;
  known_for_department: string;
  popularity: number;
  known_for?: MediaItem[];
  filmography?: FilmographyCredit[];
  credits?: {
    cast: MediaItem[];
    crew: MediaItem[];
  };
}

export interface Genre {
  id: number;
  name: string;
  slug?: string;
}

export interface Country {
  code: string;
  name: string;
}
