'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MediaItem } from '@/lib/types';
import {
  supabase,
  WatchedItem,
  WatchlistItem,
  FavoriteItem,
  ReviewItem,
  fetchUserWatchlistDB,
  addToWatchlistDB,
  removeFromWatchlistDB,
  fetchUserFavoritesDB,
  addToFavoritesDB,
  removeFromFavoritesDB,
  fetchUserWatchedDB,
  upsertWatchedDB,
  fetchReviewsDB,
  insertReviewDB,
  voteReviewDB,
  fetchUserVotesDB,
} from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface MediaContextType {
  watchlist: WatchlistItem[];
  watchedLog: WatchedItem[];
  favorites: FavoriteItem[];
  reviews: ReviewItem[];
  isWatchlisted: (mediaId: number, mediaType: 'movie' | 'tv') => boolean;
  toggleWatchlist: (media: MediaItem) => void;
  isFavorite: (mediaId: number, mediaType: 'movie' | 'tv') => boolean;
  toggleFavorite: (media: MediaItem) => void;
  isWatched: (mediaId: number, mediaType: 'movie' | 'tv') => boolean;
  getWatchedItem: (mediaId: number, mediaType: 'movie' | 'tv') => WatchedItem | undefined;
  logWatched: (media: MediaItem, rating: number, watchedDate: string, reviewText?: string) => void;
  voteReview: (reviewId: string, direction: 'up' | 'down') => void;
  getReviewsForMedia: (mediaId: number, mediaType: 'movie' | 'tv') => ReviewItem[];
  getReviewsByUser: (username: string) => ReviewItem[];
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

// Helper to identify and purge any historical dummy/mock reviews
function isDummyReview(r: any): boolean {
  if (!r) return true;
  const id = String(r.id || '');
  const userId = String(r.user_id || '');
  const username = String(r.username || '').toLowerCase();
  if (id.startsWith('rev-10') || id.startsWith('rev_dummy') || id.startsWith('rev-sample') || id === 'rev-101' || id === 'rev-102' || id === 'rev-103' || id === 'rev-104' || id === 'rev-105') return true;
  if (userId.startsWith('usr_cinephile') || userId.startsWith('usr_sarah') || userId.startsWith('usr_marcus') || userId.startsWith('usr_elena') || userId.startsWith('usr_david') || userId.startsWith('usr_chloe') || userId.startsWith('usr_google_') || userId.startsWith('usr_discord_')) return true;
  if (['cinephile_alex', 'sarah_watches', 'marcus_stream', 'elena_cinema', 'david_noir', 'chloe_indie', 'google_cinephile', 'pixel_director'].includes(username)) return true;
  return false;
}

function isDummyUserItem(item: any): boolean {
  if (!item) return true;
  const userId = String(item.user_id || '');
  const username = String(item.username || '').toLowerCase();
  if (userId.startsWith('usr_cinephile') || userId.startsWith('usr_sarah') || userId.startsWith('usr_marcus') || userId.startsWith('usr_elena') || userId.startsWith('usr_david') || userId.startsWith('usr_chloe') || userId.startsWith('usr_google_') || userId.startsWith('usr_discord_')) return true;
  if (['cinephile_alex', 'sarah_watches', 'marcus_stream', 'elena_cinema', 'david_noir', 'chloe_indie', 'google_cinephile', 'pixel_director'].includes(username)) return true;
  return false;
}

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Pure real state initialized as empty arrays
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [watchedLog, setWatchedLog] = useState<WatchedItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // Load from localStorage and Supabase on mount / user change
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchers_watchlist');
      if (savedWatchlist) {
        const parsed = JSON.parse(savedWatchlist);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(i => !isDummyUserItem(i));
          setWatchlist(cleaned);
          localStorage.setItem('watchers_watchlist', JSON.stringify(cleaned));
        }
      }

      const savedFavorites = localStorage.getItem('watchers_favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(i => !isDummyUserItem(i));
          setFavorites(cleaned);
          localStorage.setItem('watchers_favorites', JSON.stringify(cleaned));
        }
      }

      const savedLog = localStorage.getItem('watchers_log');
      if (savedLog) {
        const parsed = JSON.parse(savedLog);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(i => !isDummyUserItem(i));
          setWatchedLog(cleaned);
          localStorage.setItem('watchers_log', JSON.stringify(cleaned));
        }
      }

      const savedReviews = localStorage.getItem('watchers_reviews');
      if (savedReviews) {
        const parsed = JSON.parse(savedReviews);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(r => !isDummyReview(r));
          setReviews(cleaned);
          localStorage.setItem('watchers_reviews', JSON.stringify(cleaned));
        }
      }
    } catch {
      // clean fallback
    }

    // Fetch real data from Supabase
    if (supabase) {
      // Community reviews
      fetchReviewsDB().then(async (dbReviews) => {
        if (dbReviews !== null) {
          const cleanReviews = dbReviews.filter(r => !isDummyReview(r));
          // If user logged in, check their votes
          if (user?.id) {
            const userVotes = await fetchUserVotesDB(user.id);
            setReviews(cleanReviews.map(r => ({ ...r, user_vote: userVotes[r.id] || null })));
          } else {
            setReviews(cleanReviews);
          }
          localStorage.setItem('watchers_reviews', JSON.stringify(cleanReviews));
        }
      });

      // User specific data if logged in
      if (user?.id) {
        fetchUserWatchlistDB(user.id).then(dbWatchlist => {
          if (dbWatchlist) setWatchlist(dbWatchlist.filter(i => !isDummyUserItem(i)));
        });

        fetchUserFavoritesDB(user.id).then(dbFavorites => {
          if (dbFavorites) setFavorites(dbFavorites.filter(i => !isDummyUserItem(i)));
        });

        fetchUserWatchedDB(user.id).then(dbWatched => {
          if (dbWatched) setWatchedLog(dbWatched.filter(i => !isDummyUserItem(i)));
        });
      }

      // Realtime review synchronization
      const channel = supabase
        .channel('realtime_reviews_channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'reviews' },
          () => {
            fetchReviewsDB().then(dbReviews => {
              if (dbReviews !== null) {
                const cleanReviews = dbReviews.filter(r => !isDummyReview(r));
                setReviews(cleanReviews);
                localStorage.setItem('watchers_reviews', JSON.stringify(cleanReviews));
              }
            });
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [user?.id]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('watchers_watchlist', JSON.stringify(watchlist.filter(i => !isDummyUserItem(i))));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('watchers_favorites', JSON.stringify(favorites.filter(i => !isDummyUserItem(i))));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('watchers_log', JSON.stringify(watchedLog.filter(i => !isDummyUserItem(i))));
  }, [watchedLog]);

  useEffect(() => {
    localStorage.setItem('watchers_reviews', JSON.stringify(reviews.filter(r => !isDummyReview(r))));
  }, [reviews]);

  const isWatchlisted = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return watchlist.some(item => item.media_id === mediaId && item.media_type === mediaType);
  };

  const toggleWatchlist = (media: MediaItem) => {
    if (!user) return;
    const exists = isWatchlisted(media.id, media.media_type);
    if (exists) {
      setWatchlist(prev => prev.filter(item => !(item.media_id === media.id && item.media_type === media.media_type)));
      if (supabase && user.id) {
        removeFromWatchlistDB(user.id, media.id, media.media_type);
      }
    } else {
      const newItem: WatchlistItem = {
        id: 'wl_' + Date.now(),
        media_id: media.id,
        media_type: media.media_type,
        title: media.title,
        poster_path: media.poster_path || '',
        release_date: media.release_date || media.first_air_date,
        vote_average: media.vote_average,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };
      setWatchlist(prev => [newItem, ...prev]);
      if (supabase && user.id) {
        addToWatchlistDB({
          media_id: media.id,
          media_type: media.media_type,
          title: media.title,
          poster_path: media.poster_path || '',
          release_date: media.release_date || media.first_air_date,
          vote_average: media.vote_average,
          user_id: user.id,
          created_at: newItem.created_at,
        });
      }
    }
  };

  const isFavorite = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return favorites.some(item => item.media_id === mediaId && item.media_type === mediaType);
  };

  const toggleFavorite = (media: MediaItem) => {
    if (!user) return;
    const exists = isFavorite(media.id, media.media_type);
    if (exists) {
      setFavorites(prev => prev.filter(item => !(item.media_id === media.id && item.media_type === media.media_type)));
      if (supabase && user.id) {
        removeFromFavoritesDB(user.id, media.id, media.media_type);
      }
    } else {
      const newItem: FavoriteItem = {
        id: 'fav_' + Date.now(),
        media_id: media.id,
        media_type: media.media_type,
        title: media.title,
        poster_path: media.poster_path || '',
        release_date: media.release_date || media.first_air_date,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };
      setFavorites(prev => [newItem, ...prev]);
      if (supabase && user.id) {
        addToFavoritesDB({
          media_id: media.id,
          media_type: media.media_type,
          title: media.title,
          poster_path: media.poster_path || '',
          release_date: media.release_date || media.first_air_date,
          vote_average: media.vote_average,
          user_id: user.id,
          created_at: newItem.created_at,
        });
      }
    }
  };

  const isWatched = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return watchedLog.some(item => item.media_id === mediaId && item.media_type === mediaType);
  };

  const getWatchedItem = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return watchedLog.find(item => item.media_id === mediaId && item.media_type === mediaType);
  };

  const logWatched = (media: MediaItem, rating: number, watchedDate: string, reviewText?: string) => {
    if (!user) return;

    const existingIndex = watchedLog.findIndex(item => item.media_id === media.id && item.media_type === media.media_type);
    const newLogItem: WatchedItem = {
      id: existingIndex >= 0 ? watchedLog[existingIndex].id : 'log_' + Date.now(),
      media_id: media.id,
      media_type: media.media_type,
      title: media.title,
      poster_path: media.poster_path || '',
      backdrop_path: media.backdrop_path || '',
      rating,
      review: reviewText,
      watched_date: watchedDate,
      user_id: user.id,
      username: user.username,
      created_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const updated = [...watchedLog];
      updated[existingIndex] = newLogItem;
      setWatchedLog(updated);
    } else {
      setWatchedLog(prev => [newLogItem, ...prev]);
    }

    if (supabase && user.id) {
      upsertWatchedDB({
        media_id: media.id,
        media_type: media.media_type,
        title: media.title,
        poster_path: media.poster_path || '',
        backdrop_path: media.backdrop_path || '',
        rating,
        review: reviewText,
        watched_date: watchedDate,
        user_id: user.id,
        username: user.username,
        created_at: newLogItem.created_at,
      });
    }

    // Also add to community reviews if review text is provided
    if (reviewText && reviewText.trim().length > 0) {
      const newReview: ReviewItem = {
        id: 'rev_' + Date.now(),
        media_id: media.id,
        media_type: media.media_type,
        media_title: media.title,
        media_poster: media.poster_path || undefined,
        user_id: user.id,
        username: user.username,
        display_name: user.display_name,
        user_avatar: user.avatar_url,
        rating,
        content: reviewText.trim(),
        watched_date: watchedDate,
        created_at: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
      };
      setReviews(prev => [newReview, ...prev.filter(r => !(r.media_id === media.id && r.user_id === user.id))]);

      if (supabase && user.id) {
        insertReviewDB({
          media_id: media.id,
          media_type: media.media_type,
          media_title: media.title,
          media_poster: media.poster_path || undefined,
          user_id: user.id,
          username: user.username,
          display_name: user.display_name,
          user_avatar: user.avatar_url,
          rating,
          content: reviewText.trim(),
          watched_date: watchedDate,
        });
      }
    }
  };

  const voteReview = (reviewId: string, direction: 'up' | 'down') => {
    setReviews(prev =>
      prev.map(rev => {
        if (rev.id !== reviewId) return rev;
        const currentVote = rev.user_vote;

        if (currentVote === direction) {
          // Toggle off
          return {
            ...rev,
            user_vote: null,
            upvotes: direction === 'up' ? Math.max(0, rev.upvotes - 1) : rev.upvotes,
            downvotes: direction === 'down' ? Math.max(0, rev.downvotes - 1) : rev.downvotes,
          };
        }

        let newUp = rev.upvotes;
        let newDown = rev.downvotes;

        if (currentVote === 'up') newUp -= 1;
        if (currentVote === 'down') newDown -= 1;

        if (direction === 'up') newUp += 1;
        if (direction === 'down') newDown += 1;

        return {
          ...rev,
          user_vote: direction,
          upvotes: newUp,
          downvotes: newDown,
        };
      })
    );

    if (supabase && user?.id) {
      voteReviewDB(reviewId, user.id, direction);
    }
  };

  const getReviewsForMedia = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return reviews.filter(r => r.media_id === mediaId && r.media_type === mediaType);
  };

  const getReviewsByUser = (username: string) => {
    return reviews.filter(r => r.username.toLowerCase() === username.toLowerCase());
  };

  return (
    <MediaContext.Provider
      value={{
        watchlist,
        watchedLog,
        favorites,
        reviews,
        isWatchlisted,
        toggleWatchlist,
        isFavorite,
        toggleFavorite,
        isWatched,
        getWatchedItem,
        logWatched,
        voteReview,
        getReviewsForMedia,
        getReviewsByUser,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}
