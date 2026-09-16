'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 text-zinc-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Watchers
            </span>
            <p className="text-xs leading-relaxed max-w-sm text-zinc-500 dark:text-zinc-400">
              The social cinema platform for film & television lovers. Track what you watch, save to your watchlist, rate out of five, and read reviews from the community.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movie" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                  People & Cast
                </Link>
              </li>
            </ul>
          </div>

          {/* API Attributions & Credits */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Data & API Credits
            </h4>
            <div className="space-y-2 text-xs text-zinc-500">
              <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5">
                  The Movie Database (TMDB)
                </p>
                <p className="text-[11px] leading-tight">
                  This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
              </div>

              <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-0.5">
                  JustWatch
                </p>
                <p className="text-[11px] leading-tight">
                  Streaming platform availability and watch provider data provided by JustWatch.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & tech details */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© {new Date().getFullYear()} Watchers. Built for film lovers worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              Built with 😡 and NextJS by @emjjkk & @aiya2007
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
