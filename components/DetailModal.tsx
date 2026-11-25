'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Play, Plus, Share2, X } from 'lucide-react';
import MediaImage from './MediaImage';
import { getMoreLikeThis, type MovieItem } from '@/lib/catalog';

interface DetailModalProps {
  movie: MovieItem;
  catalog: MovieItem[];
  isInMyList: boolean;
  onClose: () => void;
  onPlay: (movie: MovieItem) => void;
  onToggleMyList: (movieId: string) => void;
  onSelectSimilar: (movie: MovieItem) => void;
}

export default function DetailModal({
  movie,
  catalog,
  isInMyList,
  onClose,
  onPlay,
  onToggleMyList,
  onSelectSimilar,
}: DetailModalProps) {
  const [copiedToast, setCopiedToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const similarTitles = getMoreLikeThis(movie, catalog, 4);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    let copied = false;

    if (shareUrl && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied && shareUrl && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        // Proceed with visual confirmation gracefully
      }
    }

    setCopiedToast(true);
    if (toastTimerRef.current !== null) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setCopiedToast(false);
      toastTimerRef.current = null;
    }, 2400);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (toastTimerRef.current !== null) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm px-3 py-6 sm:px-6 sm:py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[880px] overflow-hidden rounded-md bg-[#1C1B1B]/95 backdrop-blur-xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85)]"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
          className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#141414]/85 text-white hover:bg-[#282828] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Top Widescreen Preview Banner */}
        <div className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden bg-[#141414]">
          <MediaImage
            src={movie.thumbnail}
            youtubeId={movie.youtubeId}
            alt={movie.title}
            sizes="(max-width: 900px) 100vw, 880px"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B] via-[#1C1B1B]/65 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            {movie.subtitle && (
              <span className="inline-flex items-center rounded bg-[#E50914] px-2.5 py-1 mb-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                {movie.subtitle}
              </span>
            )}
            <h2
              id="detail-modal-title"
              className="font-serif text-3xl sm:text-5xl font-black tracking-[-0.02em] text-white"
            >
              {movie.title}
            </h2>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onPlay(movie)}
                className="inline-flex h-11 items-center gap-2.5 rounded bg-white px-6 text-sm font-bold text-[#141414] hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <span>Play Now</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleMyList(movie.id)}
                aria-pressed={isInMyList}
                className="inline-flex h-11 items-center gap-2 rounded bg-white/15 px-5 text-sm font-semibold text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {isInMyList ? (
                  <>
                    <Check className="h-4 w-4 text-[#46D369]" aria-hidden="true" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Add to My List</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label={`Share ${movie.title}`}
                title="Copy link"
                className="inline-flex h-11 w-11 items-center justify-center rounded bg-white/15 text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {copiedToast ? (
                  <Check className="h-4 w-4 text-[#46D369]" aria-hidden="true" />
                ) : (
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Detail Content Grid */}
        <div className="p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Left 2 Columns: Metadata & Full Synopsis */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs sm:text-[13px] font-medium text-[#E5E2E1] tabular-nums">
                <span className="font-bold text-[#46D369]">{movie.matchScore}</span>
                <span aria-hidden="true" className="text-[#737373]">
                  •
                </span>
                <span>{movie.year}</span>
                <span aria-hidden="true" className="text-[#737373]">
                  •
                </span>
                <span className="rounded bg-[#282828] border border-white/15 px-1.5 py-0.5 text-[11px] font-bold">
                  {movie.maturity}
                </span>
                <span aria-hidden="true" className="text-[#737373]">
                  •
                </span>
                <span>{movie.duration}</span>
                <span aria-hidden="true" className="text-[#737373]">
                  •
                </span>
                <span className="text-[11px] font-bold tracking-[0.04em] text-[#A3A3A3]">
                  {movie.quality}
                </span>
              </div>

              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#E5E2E1]">
                {movie.synopsis}
              </p>
            </div>

            {/* Right Column: Cast, Genres, Audio */}
            <div className="space-y-3.5 text-xs sm:text-[13px] leading-relaxed">
              <div>
                <span className="text-[#A3A3A3]">Cast: </span>
                <span className="text-white font-medium">{movie.cast}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Genres: </span>
                <span className="text-white font-medium">
                  {movie.genres.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Audio: </span>
                <span className="text-white font-medium">Hindi</span>
              </div>
            </div>
          </div>

          {/* More Like This Section */}
          {similarTitles.length > 0 && (
            <div className="mt-8">
              <h3 className="font-sans text-lg font-bold tracking-[-0.015em] text-white mb-4">
                More Like This
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarTitles.map((similar) => (
                  <article
                    key={similar.id}
                    className="group flex flex-col overflow-hidden rounded bg-[#201F1F] transition-all duration-300 ease-out hover:scale-[1.03] hover:bg-[#282828] hover:shadow-[0_14px_32px_rgba(0,0,0,0.8)]"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-[#141414]">
                      <button
                        type="button"
                        onClick={() => onSelectSimilar(similar)}
                        aria-label={`Inspect ${similar.title}`}
                        className="relative block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                      >
                        <MediaImage
                          src={similar.thumbnail}
                          youtubeId={similar.youtubeId}
                          alt={similar.title}
                          sizes="(max-width: 640px) 100vw, 400px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-[#201F1F] via-transparent to-transparent"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => onPlay(similar)}
                        aria-label={`Play ${similar.title}`}
                        className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#141414] shadow-md opacity-95 sm:opacity-0 sm:translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 hover:scale-110"
                      >
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectSimilar(similar)}
                      className="flex-1 p-3.5 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {similar.title}
                        </h4>
                        <span className="text-[11px] font-bold text-[#46D369] shrink-0">
                          {similar.matchScore}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#A3A3A3]">
                        <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-[#E5E2E1]">
                          Hindi
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{similar.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{similar.duration}</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#A3A3A3] line-clamp-2">
                        {similar.synopsis}
                      </p>
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Brief 'Link copied!' Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 rounded-full bg-[#1F1F1F] border border-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_12px_32px_rgba(0,0,0,0.85)]"
          >
            <Check className="h-4 w-4 text-[#46D369]" aria-hidden="true" />
            <span>Link copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
