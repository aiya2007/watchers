'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  Bookmark,
  CheckCircle2,
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Eye,
  Settings,
} from 'lucide-react';
import MediaCard from './MediaCard';
import { useMedia } from '@/context/MediaContext';
import { useAuth } from '@/context/AuthContext';
import { MediaItem } from '@/lib/types';
import {
  supabase,
  UserProfile,
  FavoriteItem,
  WatchlistItem,
  WatchedItem,
  ReviewItem,
  fetchUserProfileDB,
  fetchUserFavoritesDB,
  fetchUserWatchlistDB,
  fetchUserWatchedDB,
  fetchReviewsDB,
} from '@/lib/supabase';

interface UserProfileViewProps {
  username: string;
}

type ProfileTab = 'favorites' | 'watched' | 'watchlist' | 'reviews';

export default function UserProfileView({ username }: UserProfileViewProps) {
  const { user: authUser } = useAuth();
  const {
    favorites: myFavorites,
    watchlist: myWatchlist,
    watchedLog: myWatchedLog,
    reviews: myReviews,
    voteReview,
  } = useMedia();

  const isCurrentUser = Boolean(authUser?.username && authUser.username.toLowerCase() === username.toLowerCase());

  const [activeTab, setActiveTab] = useState<ProfileTab>('favorites');
  const [isLoadingProfile, setIsLoadingProfile] = useState(!isCurrentUser);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [dbProfile, setDbProfile] = useState<UserProfile | null>(null);
  const [dbFavorites, setDbFavorites] = useState<FavoriteItem[] | null>(null);
  const [dbWatchlist, setDbWatchlist] = useState<WatchlistItem[] | null>(null);
  const [dbWatchedLog, setDbWatchedLog] = useState<WatchedItem[] | null>(null);
  const [dbReviews, setDbReviews] = useState<ReviewItem[] | null>(null);

  useEffect(() => {
    if (!isCurrentUser) {
      if (!supabase) {
        setIsLoadingProfile(false);
        setProfileNotFound(true);
        return;
      }

      setIsLoadingProfile(true);
      fetchUserProfileDB(username)
        .then(async (prof) => {
          if (prof) {
            setDbProfile(prof);
            setProfileNotFound(false);
            const [favs, wl, watched, revs] = await Promise.all([
              fetchUserFavoritesDB(prof.id),
              fetchUserWatchlistDB(prof.id),
              fetchUserWatchedDB(prof.id),
              fetchReviewsDB({ username: prof.username }),
            ]);
            setDbFavorites(favs || []);
            setDbWatchlist(wl || []);
            setDbWatchedLog(watched || []);
            setDbReviews(revs || []);
          } else {
            setProfileNotFound(true);
          }
        })
        .catch(() => {
          setProfileNotFound(true);
        })
        .finally(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [username, isCurrentUser]);

  if (!isCurrentUser && isLoadingProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-sm text-zinc-500 animate-pulse">Loading profile for @{username}...</p>
      </div>
    );
  }

  if (!isCurrentUser && profileNotFound) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Member Not Found</h2>
        <p className="text-xs text-zinc-500">
          The member <span className="font-semibold text-zinc-700 dark:text-zinc-300">@{username}</span> has not created a profile on Watchers yet.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex px-4 py-2 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Profile data
  const profileName = isCurrentUser
    ? authUser?.display_name || authUser?.username || username
    : dbProfile?.display_name || dbProfile?.username || username;

  const avatarUrl = isCurrentUser
    ? authUser?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    : dbProfile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  const provider = isCurrentUser
    ? authUser?.provider || 'google'
    : dbProfile?.provider || 'google';

  const bio = isCurrentUser
    ? authUser?.bio || ''
    : dbProfile?.bio || '';

  // Resolved collections
  const favorites = isCurrentUser ? myFavorites : (dbFavorites || []);
  const watchlist = isCurrentUser ? myWatchlist : (dbWatchlist || []);
  const watchedLog = isCurrentUser ? myWatchedLog : (dbWatchedLog || []);
  const userReviews = isCurrentUser
    ? (authUser?.username ? myReviews.filter(r => r.username.toLowerCase() === authUser.username.toLowerCase()) : [])
    : (dbReviews || []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 flex-shrink-0 bg-zinc-800 shadow-md">
          <Image
            src={avatarUrl}
            alt={username}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 capitalize">
              {profileName}
            </h1>
            <span className="text-xs font-mono text-zinc-500">@{username}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              via {provider}
            </span>

            {isCurrentUser && (
              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors ml-auto sm:ml-2"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            )}
          </div>

          {bio ? <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl">{bio}</p> : null}

          <div className="flex items-center gap-6 pt-2 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-zinc-400" />
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{watchedLog.length}</strong>{' '}
                Watched
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{favorites.length}</strong>{' '}
                Favorites
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{watchlist.length}</strong>{' '}
                Watchlist
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>
                <strong className="text-zinc-900 dark:text-zinc-100">{userReviews.length}</strong>{' '}
                Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
          { id: 'watched', label: 'Recently Watched', icon: CheckCircle2, count: watchedLog.length },
          { id: 'watchlist', label: 'Watchlist', icon: Bookmark, count: watchlist.length },
          { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: userReviews.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ProfileTab)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="opacity-60 text-[10px]">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {favorites.map(item => {
                  const mediaItem: MediaItem = {
                    id: item.media_id,
                    media_type: item.media_type,
                    title: item.title,
                    overview: '',
                    poster_path: item.poster_path,
                    backdrop_path: item.poster_path,
                    release_date: item.release_date,
                    vote_average: item.vote_average || 8.0,
                    vote_count: 100,
                    popularity: 50,
                  };
                  return <MediaCard key={`${item.media_type}-${item.media_id}`} media={mediaItem} />;
                })}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <Heart className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  No favorites added yet
                </p>
                <p className="text-xs text-zinc-500">
                  Click the heart icon on any movie or TV show to feature it on your profile.
                </p>
                <Link
                  href="/movie"
                  className="inline-block mt-2 px-4 py-2 text-xs font-semibold rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                >
                  Browse Movies
                </Link>
              </div>
            )}
          </div>
        )}

        {/* RECENTLY WATCHED TAB */}
        {activeTab === 'watched' && (
          <div className="space-y-4">
            {watchedLog.length > 0 ? (
              <div className="space-y-3">
                {watchedLog.map(log => {
                  const mediaLink = `/${log.media_type}/${log.media_id}`;
                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Link
                          href={mediaLink}
                          className="relative w-14 h-20 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-zinc-700"
                        >
                          {log.poster_path ? (
                            <Image
                              src={log.poster_path}
                              alt={log.title || log.media_title || 'Media'}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : null}
                        </Link>
                        <div className="min-w-0 space-y-1">
                          <Link
                            href={mediaLink}
                            className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block"
                          >
                            {log.title || log.media_title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                              {log.media_type}
                            </span>
                            <span>·</span>
                            <span>Watched on {log.watched_date}</span>
                          </div>
                          {log.review && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 italic pt-1 line-clamp-2">
                              &ldquo;{log.review}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* User's rating */}
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{log.rating} / 5</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Watched log is empty
                </p>
                <p className="text-xs text-zinc-500">
                  Mark movies as &ldquo;I&apos;ve Watched This&rdquo; to build your cinema diary.
                </p>
              </div>
            )}
          </div>
        )}

        {/* WATCHLIST TAB */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {watchlist.map(item => {
                  const mediaItem: MediaItem = {
                    id: item.media_id,
                    media_type: item.media_type,
                    title: item.title,
                    overview: '',
                    poster_path: item.poster_path,
                    backdrop_path: item.poster_path,
                    release_date: item.release_date,
                    vote_average: item.vote_average || 8.0,
                    vote_count: 100,
                    popularity: 50,
                  };
                  return <MediaCard key={`${item.media_type}-${item.media_id}`} media={mediaItem} />;
                })}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <Bookmark className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Your watchlist is empty
                </p>
                <p className="text-xs text-zinc-500">
                  Click &ldquo;Add to Watchlist&rdquo; on any title to save it for later.
                </p>
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {userReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userReviews.map(rev => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/${rev.media_type}/${rev.media_id}`}
                          className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:underline"
                        >
                          {rev.media_title}
                        </Link>
                        <p className="text-[11px] text-zinc-500">
                          {rev.watched_date || 'Recently logged'}
                        </p>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs font-semibold">
                        {'★'.repeat(Math.floor(rev.rating))}
                        <span className="text-zinc-600 dark:text-zinc-400 ml-1">
                          {rev.rating}/5
                        </span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {rev.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => voteReview(rev.id, 'up')}
                          className={`flex items-center gap-1 ${
                            rev.user_vote === 'up' ? 'text-emerald-500 font-bold' : ''
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{rev.upvotes}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => voteReview(rev.id, 'down')}
                          className={`flex items-center gap-1 ${
                            rev.user_vote === 'down' ? 'text-rose-500 font-bold' : ''
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{rev.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <MessageSquare className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  No reviews written yet
                </p>
                <p className="text-xs text-zinc-500">
                  Share your impressions, critiques, and thoughts on films and series.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
