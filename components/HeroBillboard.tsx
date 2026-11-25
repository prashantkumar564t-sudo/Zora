'use client';

import React, { useState } from 'react';
import { Check, Info, Play, Plus, Volume2, VolumeX } from 'lucide-react';
import MediaImage from './MediaImage';
import { buildYoutubeEmbedUrl, type MovieItem } from '@/lib/catalog';

interface HeroBillboardProps {
  movie: MovieItem;
  isInMyList: boolean;
  onPlay: (movie: MovieItem) => void;
  onMoreInfo: (movie: MovieItem) => void;
  onToggleMyList: (movieId: string) => void;
  isPlayerOpen: boolean;
}

export default function HeroBillboard({
  movie,
  isInMyList,
  onPlay,
  onMoreInfo,
  onToggleMyList,
  isPlayerOpen,
}: HeroBillboardProps) {
  const [ambientUnmuted, setAmbientUnmuted] = useState(false);

  const showAmbientVideo = ambientUnmuted && !isPlayerOpen;
  const ambientEmbedUrl = buildYoutubeEmbedUrl(movie.youtubeId, {
    ambient: true,
    muted: false,
  });

  return (
    <section
      aria-label={`Featured premiere: ${movie.title}`}
      className="relative w-full min-h-[78vh] md:min-h-[84vh] max-h-[860px] flex items-end overflow-hidden bg-[#141414]"
    >
      {/* Full-bleed Widescreen Background Poster */}
      <div className="absolute inset-0">
        <MediaImage
          src={movie.thumbnail}
          youtubeId={movie.youtubeId}
          alt={`${movie.title} theatrical banner`}
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.03]"
        />

        {/* Ambient Trailer Background Preview when Unmuted */}
        {showAmbientVideo && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              src={ambientEmbedUrl}
              title={`${movie.title} ambient trailer preview`}
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 border-0"
            />
          </div>
        )}

        {/* Cinematic Multi-Stop Scrims blending organically into #141414 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#141414]/80 to-transparent"
        />
      </div>

      {/* Hero Editorial Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14 pt-32 pb-12 md:pb-16 lg:pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            {/* Exclusive Premiere Pill (requested explicitly in prompt) */}
            <div className="inline-flex items-center gap-2 rounded bg-[#E50914] px-3 py-1 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white whitespace-nowrap">
                {movie.subtitle ?? 'ZORA EXCLUSIVE PREMIERE'}
              </span>
            </div>

            {/* Bold Serif Display Title */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[74px] font-black tracking-[-0.02em] leading-[1.02] text-white text-balance">
              {movie.title}
            </h1>

            {/* Clean Unboxed Metadata Line */}
            <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs sm:text-[13px] font-medium text-[#E5E2E1] tabular-nums">
              <span className="font-bold text-[#46D369]">{movie.matchScore}</span>
              <span aria-hidden="true" className="text-[#737373]">
                •
              </span>
              <span>{movie.year}</span>
              <span aria-hidden="true" className="text-[#737373]">
                •
              </span>
              <span className="rounded bg-[#1F1F1F]/90 border border-white/15 px-1.5 py-0.5 text-[11px] font-bold text-[#E5E2E1]">
                {movie.maturity}
              </span>
              <span aria-hidden="true" className="text-[#737373]">
                •
              </span>
              <span>{movie.duration}</span>
              <span aria-hidden="true" className="text-[#737373]">
                •
              </span>
              <span className="rounded bg-white/15 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                Hindi
              </span>
              <span aria-hidden="true" className="text-[#737373]">
                •
              </span>
              <span className="text-[11px] font-bold tracking-[0.04em] text-[#A3A3A3]">
                {movie.quality}
              </span>
            </div>

            {/* Synopsis */}
            <p className="mt-4 max-w-xl text-sm sm:text-[15px] leading-relaxed text-[#E5E2E1]/90">
              {movie.synopsis}
            </p>

            {/* Primary & Secondary Action Controls */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onPlay(movie)}
                className="inline-flex h-11 items-center justify-center gap-2.5 rounded bg-white px-6 text-sm font-bold text-[#141414] hover:bg-white/90 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <span>Play Now</span>
              </button>

              <button
                type="button"
                onClick={() => onMoreInfo(movie)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded bg-white/15 backdrop-blur-sm px-5 text-sm font-semibold text-white hover:bg-white/25 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
                <span>More Info</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleMyList(movie.id)}
                aria-pressed={isInMyList}
                aria-label={
                  isInMyList
                    ? `Remove ${movie.title} from My List`
                    : `Add ${movie.title} to My List`
                }
                className={`inline-flex h-11 items-center justify-center gap-2 rounded px-5 text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                  isInMyList
                    ? 'bg-[#282828] text-white border border-white/25 hover:bg-[#353534]'
                    : 'bg-[#1F1F1F]/80 text-white border border-white/15 hover:bg-[#282828]'
                }`}
              >
                {isInMyList ? (
                  <>
                    <Check className="h-4 w-4 text-[#46D369]" aria-hidden="true" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>My List</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right-Aligned Ambient Trailer Mute/Unmute Toggle + Maturity Badge */}
          <div className="flex items-center gap-3 self-start md:self-end shrink-0">
            <button
              type="button"
              onClick={() => setAmbientUnmuted((prev) => !prev)}
              aria-pressed={ambientUnmuted}
              aria-label={
                ambientUnmuted
                  ? 'Mute ambient trailer preview'
                  : 'Unmute ambient trailer preview'
              }
              title={
                ambientUnmuted
                  ? 'Mute trailer preview'
                  : 'Unmute ambient trailer preview'
              }
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                ambientUnmuted
                  ? 'border-white/60 bg-white/15 text-white'
                  : 'border-white/25 bg-[#141414]/65 text-[#E5E2E1] hover:border-white/50 hover:bg-[#1F1F1F]'
              }`}
            >
              {ambientUnmuted ? (
                <>
                  <Volume2 className="h-4 w-4 text-white" aria-hidden="true" />
                  <span className="whitespace-nowrap">Preview Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 text-[#A3A3A3]" aria-hidden="true" />
                  <span className="whitespace-nowrap">Trailer Muted</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center h-11 rounded bg-[#1F1F1F]/85 border border-white/15 px-3.5 text-xs font-bold tracking-wider text-[#E5E2E1]">
              {movie.maturity}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
