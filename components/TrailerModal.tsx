'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

export default function TrailerModal() {
  const { trailerKey, closeTrailer } = useModal();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTrailer();
    };
    if (trailerKey) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [trailerKey, closeTrailer]);

  if (!trailerKey) return null;

  return (
    <div
      id="trailer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-150"
      onClick={e => {
        if (e.target === e.currentTarget) closeTrailer();
      }}
    >
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl border border-zinc-800">
        <button
          type="button"
          onClick={closeTrailer}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white backdrop-blur-sm"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title="Weflixd Trailer Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
