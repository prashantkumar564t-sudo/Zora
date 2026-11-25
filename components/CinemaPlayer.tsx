'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Play, Plus } from 'lucide-react';
import MediaImage from './MediaImage';
import {
  buildYoutubeEmbedUrl,
  getMoreLikeThis,
  type MovieItem,
} from '@/lib/catalog';

interface CinemaPlayerProps {
  movie: MovieItem;
  catalog: MovieItem[];
  isInMyList: boolean;
  onToggleMyList: (movieId: string) => void;
  onPlayMovie: (movie: MovieItem) => void;
  onClose: () => void;
}

const INACTIVITY_TIMEOUT_MS = 3000;

export default function CinemaPlayer({
  movie,
  catalog,
  isInMyList,
  onToggleMyList,
  onPlayMovie,
  onClose,
}: CinemaPlayerProps) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileDetailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileDetailsRef.current) {
      mobileDetailsRef.current.scrollTop = 0;
    }
  }, [movie.id]);

  const similarTitles = useMemo(
    () => getMoreLikeThis(movie, catalog, 4),
    [movie, catalog]
  );

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearHideTimer]);

  const wakeControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      wakeControls();
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const onWindowMouseMove = () => {
      wakeControls();
    };

    scheduleHide();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousemove', onWindowMouseMove, { passive: true });
    return () => {
      clearHideTimer();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousemove', onWindowMouseMove);
    };
  }, [onClose, wakeControls, scheduleHide, clearHideTimer]);

  const embedUrl = buildYoutubeEmbedUrl(movie.youtubeId);
  const shortQuality = movie.quality.split('•')[0].trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${movie.title}`}
      onMouseMove={wakeControls}
      onTouchStart={wakeControls}
      className="fixed inset-0 z-50 flex flex-col md:block h-screen w-screen overflow-hidden bg-[#141414] md:bg-black text-white"
    >
      {/* Mobile-Only Dedicated Sticky Top Bar (Separate from video frame — zero overlap) */}
      <header
        data-testid="mobile-player-topbar"
        className="flex md:hidden h-14 shrink-0 items-center justify-between gap-3 bg-[#141414] border-b border-white/[0.08] px-4 z-50"
      >
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center gap-2 rounded bg-[#1F1F1F] border border-white/10 px-3 text-sm font-semibold text-white active:bg-[#282828] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to ZORA</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded bg-[#1F1F1F] border border-white/10 px-2 py-1 text-[11px] font-medium text-[#A3A3A3] whitespace-nowrap">
            Hindi
          </span>
          <span className="rounded bg-[#1F1F1F] border border-white/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] text-[#E5E2E1] whitespace-nowrap">
            {shortQuality}
          </span>
        </div>
      </header>

      {/* Single Responsive YouTube IFrame — Zero CSS scale transforms */}
      <div
        data-testid="cinema-video-frame"
        className="relative w-full aspect-video shrink-0 bg-black md:absolute md:inset-0 md:aspect-auto md:h-full md:w-full"
      >
        <iframe
          key={movie.youtubeId}
          src={embedUrl}
          title={`${movie.title} — ZORA Cinema Player`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>

      {/* Desktop-Only Floating Auto-Hide Top Header */}
      <div
        data-testid="cinema-player-header"
        data-controls-visible={controlsVisible ? 'true' : 'false'}
        onMouseEnter={wakeControls}
        onMouseMove={wakeControls}
        onFocus={wakeControls}
        className={`hidden md:flex absolute top-0 inset-x-0 z-50 items-start justify-between gap-4 bg-gradient-to-b from-black/90 via-black/45 to-transparent p-6 pb-10 transition-all duration-300 ease-out ${
          controlsVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        {/* Top-Left: Back to ZORA + Movie Title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded bg-black/65 backdrop-blur-md border border-white/15 px-4 text-sm font-semibold text-white hover:bg-black/85 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to ZORA</span>
          </button>

          <div className="min-w-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <h2 className="font-sans text-lg font-bold tracking-[-0.015em] text-white truncate">
              {movie.title}
            </h2>
            <p className="text-xs text-[#E5E2E1]/85 truncate">
              {movie.maturity} · {movie.duration}
            </p>
          </div>
        </div>

        {/* Top-Right: Subtle Hindi Badge + Quality Badge */}
        <div
          data-testid="desktop-top-right-controls"
          className="flex items-center gap-2.5 shrink-0"
        >
          <span className="inline-flex h-9 items-center rounded bg-black/60 backdrop-blur-md border border-white/15 px-3 text-[11px] font-semibold tracking-[0.04em] text-[#E5E2E1] whitespace-nowrap">
            Hindi
          </span>
          <span className="inline-flex h-9 items-center rounded bg-black/65 backdrop-blur-md border border-white/15 px-3 text-[11px] font-bold tracking-[0.06em] text-[#E5E2E1] whitespace-nowrap">
            {movie.quality}
          </span>
        </div>
      </div>

      {/* Mobile-Only Scrollable Cinema Watch Details Below Video */}
      <div
        ref={mobileDetailsRef}
        data-testid="mobile-watch-details"
        className="flex-1 overflow-y-auto bg-[#141414] p-4 pb-10 space-y-6 md:hidden"
      >
        {/* Title, Metadata & Watchlist Action */}
        <div>
          {movie.subtitle && (
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#E50914]">
              {movie.subtitle}
            </p>
          )}
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-serif text-2xl font-black tracking-[-0.02em] text-white leading-tight">
              {movie.title}
            </h1>
            <button
              type="button"
              onClick={() => onToggleMyList(movie.id)}
              aria-pressed={isInMyList}
              aria-label={
                isInMyList
                  ? `Remove ${movie.title} from My List`
                  : `Add ${movie.title} to My List`
              }
              className={`inline-flex h-9 items-center gap-1.5 rounded px-3 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                isInMyList
                  ? 'bg-[#282828] text-white border border-white/25'
                  : 'bg-[#1F1F1F] text-white border border-white/15'
              }`}
            >
              {isInMyList ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#46D369]" aria-hidden="true" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>My List</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#E5E2E1] tabular-nums">
            <span className="font-bold text-[#46D369]">{movie.matchScore}</span>
            <span aria-hidden="true" className="text-[#737373]">·</span>
            <span>{movie.year}</span>
            <span aria-hidden="true" className="text-[#737373]">·</span>
            <span className="rounded bg-[#1F1F1F] border border-white/15 px-1.5 py-0.5 text-[10px] font-bold">
              {movie.maturity}
            </span>
            <span aria-hidden="true" className="text-[#737373]">·</span>
            <span>{movie.duration}</span>
            <span aria-hidden="true" className="text-[#737373]">·</span>
            <span className="text-[11px] font-semibold text-[#A3A3A3]">
              {movie.quality}
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-[#E5E2E1]/90">
            {movie.synopsis}
          </p>

          <div className="mt-3.5 space-y-1.5 text-xs text-[#A3A3A3]">
            <p>
              <span className="text-[#737373]">Cast: </span>
              <span className="text-[#E5E2E1]">{movie.cast}</span>
            </p>
            <p>
              <span className="text-[#737373]">Genres: </span>
              <span className="text-[#E5E2E1]">{movie.genres.join(', ')}</span>
            </p>
            <p>
              <span className="text-[#737373]">Audio: </span>
              <span className="text-[#E5E2E1]">Hindi</span>
            </p>
          </div>
        </div>

        {/* More Like This Cards */}
        {similarTitles.length > 0 && (
          <div>
            <h2 className="font-sans text-base font-bold tracking-[-0.015em] text-white mb-3">
              More Like This
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {similarTitles.map((similar) => (
                <article
                  key={similar.id}
                  className="flex items-center gap-3 rounded bg-[#1F1F1F] p-2.5 active:bg-[#282828] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => onPlayMovie(similar)}
                    aria-label={`Play ${similar.title}`}
                    className="relative h-20 w-36 shrink-0 overflow-hidden rounded bg-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <MediaImage
                      src={similar.thumbnail}
                      youtubeId={similar.youtubeId}
                      alt={similar.title}
                      sizes="144px"
                      className="object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#141414]">
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" aria-hidden="true" />
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPlayMovie(similar)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <h3 className="text-sm font-semibold text-white truncate">
                      {similar.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#A3A3A3] tabular-nums truncate">
                      <span className="font-bold text-[#46D369]">{similar.matchScore}</span>
                      {' · '}
                      {similar.language}
                      {' · '}
                      {similar.duration}
                    </p>
                    <p className="mt-1 text-xs text-[#A3A3A3] line-clamp-2">
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
  );
}
