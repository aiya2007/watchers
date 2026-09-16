'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import MediaCard from './MediaCard';
import { MediaItem, Genre, Country } from '@/lib/types';
import { COUNTRIES } from '@/lib/data/genres';

interface MediaCatalogProps {
  type: 'movie' | 'tv';
  title: string;
  description: string;
  genres: Genre[];
  initialItems: MediaItem[];
  totalPages?: number;
}

export default function MediaCatalog({
  type,
  title,
  description,
  genres,
  initialItems,
  totalPages = 1,
}: MediaCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get('genres') || '';
  const currentSort = searchParams.get('sort_by') || 'popularity.desc';
  const currentCountry = searchParams.get('country') || '';
  const currentPage = Number(searchParams.get('page') || '1');
  const currentQuery = searchParams.get('query') || '';

  const [searchInput, setSearchInput] = useState(currentQuery);
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [pageCount, setPageCount] = useState<number>(totalPages);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state and fetch from TMDB API whenever URL params change
  useEffect(() => {
    // If we have default params and initialItems match, keep them
    const isDefaultInitial =
      !currentGenre &&
      !currentCountry &&
      !currentQuery &&
      currentSort === 'popularity.desc' &&
      currentPage === 1;

    if (isDefaultInitial && initialItems && initialItems.length > 0) {
      setItems(initialItems);
      setPageCount(totalPages);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const queryParams = new URLSearchParams();
    queryParams.set('type', type);
    queryParams.set('page', String(currentPage));
    if (currentGenre) queryParams.set('genres', currentGenre);
    if (currentSort) queryParams.set('sort_by', currentSort);
    if (currentCountry) queryParams.set('country', currentCountry);
    if (currentQuery) queryParams.set('query', currentQuery);

    fetch(`/api/tmdb/discover?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data && Array.isArray(data.results)) {
          setItems(data.results);
          setPageCount(data.total_pages || 1);
        } else {
          setItems([]);
          setPageCount(1);
        }
      })
      .catch(err => {
        console.error('Failed to load catalog page from TMDB:', err);
        if (isMounted) setItems([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [type, currentGenre, currentSort, currentCountry, currentQuery, currentPage, initialItems, totalPages]);

  const updateParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '' || (key === 'page' && value === 1)) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    // Always reset to page 1 if changing filters
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`/${type}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(`/${type}`);
    setSearchInput('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('query', searchInput.trim() || null);
  };

  const hasActiveFilters = Boolean(currentGenre || currentCountry || currentQuery || currentSort !== 'popularity.desc');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Title & Description */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 max-w-2xl">{description}</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        {/* Search within category */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder={`Search ${type === 'movie' ? 'movies' : 'TV shows'} by title or keywords...`}
            className="w-full pl-9 pr-8 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateParam('query', null);
              }}
              className="absolute right-2.5 top-2.5 p-0.5 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Filters and Sort Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Genre select */}
          <select
            id="filter-genre"
            value={currentGenre}
            onChange={e => updateParam('genres', e.target.value || null)}
            className="px-3 py-2 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-800 dark:text-zinc-200 outline-none"
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g.id} value={g.slug || g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Country select */}
          <select
            id="filter-country"
            value={currentCountry}
            onChange={e => updateParam('country', e.target.value || null)}
            className="px-3 py-2 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-800 dark:text-zinc-200 outline-none"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By select */}
          <select
            id="filter-sort"
            value={currentSort}
            onChange={e => updateParam('sort_by', e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-800 dark:text-zinc-200 outline-none"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="release_date.desc">Newest First</option>
            <option value="vote_count.desc">Most Reviewed</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-2.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Quick active badges */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Showing {items.length} titles</span>
        {currentGenre && (
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
            Genre: {genres.find(g => g.slug === currentGenre || String(g.id) === currentGenre)?.name || currentGenre}
          </span>
        )}
      </div>

      {/* Grid of Movie/TV cards */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full" />
          <p className="text-xs text-zinc-500 font-medium">Fetching real catalog from TMDB...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {items.map(media => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
          <p className="text-zinc-800 dark:text-zinc-200 font-semibold text-base">
            No {type === 'movie' ? 'movies' : 'TV shows'} found
          </p>
          <p className="text-xs text-zinc-500">Try adjusting your filters or search keywords.</p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="px-4 py-2 mt-2 text-xs font-semibold rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => updateParam('page', currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <span className="text-xs text-zinc-500">Page {currentPage} of {pageCount}</span>
        <button
          type="button"
          disabled={currentPage >= pageCount || isLoading}
          onClick={() => updateParam('page', currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
