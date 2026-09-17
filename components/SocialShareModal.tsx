'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

export default function SocialShareModal() {
  const { shareItem, closeShare } = useModal();
  const [copied, setCopied] = useState(false);

  if (!shareItem) return null;

  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/${shareItem.media_type}/${shareItem.id}`
    : `https://watchers.app/${shareItem.media_type}/${shareItem.id}`;

  const text = `Check out ${shareItem.title} on Weflixd!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToReddit = () => {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="social-share-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) closeShare();
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-2xl space-y-5">
        <button
          type="button"
          onClick={closeShare}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Share {shareItem.title}
            </h3>
            <p className="text-xs text-zinc-500">Share with friends or your social network</p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={shareToTwitter}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span className="text-base font-black">𝕏</span>
            <span>X / Twitter</span>
          </button>

          <button
            type="button"
            onClick={shareToFacebook}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span className="text-base font-bold text-blue-600">f</span>
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={shareToReddit}
            className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span className="text-base font-bold text-orange-600">r/</span>
            <span>Reddit</span>
          </button>
        </div>

        {/* Copy Link input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-500">Or copy direct link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full text-xs font-mono px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300 outline-none"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md text-xs font-semibold flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
