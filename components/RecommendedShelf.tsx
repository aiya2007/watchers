'use client';

import React, { useState, useEffect } from 'react';
import HorizontalShelf from './HorizontalShelf';
import { useAuth } from '@/context/AuthContext';
import { useMedia } from '@/context/MediaContext';
import { MediaItem } from '@/lib/types';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function RecommendedShelf() {
  const { user } = useAuth();
  const { watchedLog, watchlist } = useMedia();
  const [recommended, setRecommended] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const seedItem = watchlist[0] || watchedLog[0];

    if (seedItem) {
      // Fetch TMDB recommendations or discover based on user's real saved item
      fetch(`/api/tmdb/discover?type=${seedItem.media_type}&page=1&sort_by=vote_average.desc`)
        .then(r => r.json())
        .then(d => {
          if (!isMounted) return;
          const loggedIds = new Set([...watchedLog.map(w => w.media_id), ...watchlist.map(w => w.media_id)]);
          const items: MediaItem[] = (d?.results || []).filter((m: MediaItem) => !loggedIds.has(m.id)).slice(0, 8);
          setRecommended(items);
        })
        .catch(() => {});
    } else {
      // If user hasn't added any yet, show top popular movies from TMDB API
      fetch(`/api/tmdb/discover?type=movie&page=1&sort_by=popularity.desc`)
        .then(r => r.json())
        .then(d => {
          if (!isMounted) return;
          setRecommended((d?.results || []).slice(0, 8));
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [user, watchedLog, watchlist]);

  if (!user) {
    return (
      <section className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Personalized Recommendations
            </h3>
          </div>
          <p className="text-xs text-zinc-500 max-w-md">
            Sign in to start logging what you watch, building your watchlist, and getting custom recommendations tuned to your taste.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-xs font-semibold rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white"
          >
            Sign up
          </Link>
        </div>
      </section>
    );
  }

  if (recommended.length === 0) {
    return null;
  }

  return (
    <HorizontalShelf
      id="recommended-shelf"
      title={`Recommended for @${user.username}`}
      subtitle="Based on your watched titles, ratings, and active watchlist"
      items={recommended}
    />
  );
}
