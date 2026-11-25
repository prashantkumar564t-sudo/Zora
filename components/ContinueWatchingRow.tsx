'use client';

import React from 'react';
import { Info, Play, X } from 'lucide-react';
import MediaImage from './MediaImage';
import type { ContinueWatchingEntry, MovieItem } from '@/lib/catalog';

interface ContinueWatchingRowProps {
  entries: ContinueWatchingEntry[];
  catalog: MovieItem[];
  onPlay: (movie: MovieItem) => void;
  onSelect: (movie: MovieItem) => void;
  onRemove: (movieId: string) => void;
}

export default function ContinueWatchingRow({
  entries,
  catalog,
  onPlay,
  onSelect,
  onRemove,
}: ContinueWatchingRowProps) {
  const resolved = entries
    .map((entry) => {
      const movie = catalog.find((item) => item.id === entry.movieId);
      return movie ? { entry, movie } : null;
    })
    .filter(
      (item): item is { entry: ContinueWatchingEntry; movie: MovieItem } =>
        item !== null
    );

  if (resolved.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Continue Watching"
      className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14"
    >
      <div className="mb-4">
        <h2 className="font-sans text-xl sm:text-[22px] font-bold tracking-[-0.015em] text-white">
          Continue Watching
        </h2>
        <p className="mt-1 text-xs sm:text-[13px] text-[#A3A3A3]">
          Resume where you left off in 4K UHD
        </p>
      </div>

      <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-3 -mx-1 px-1">
        {resolved.map(({ entry, movie }) => (
          <article
            key={movie.id}
            className="group relative w-[270px] sm:w-[310px] shrink-0 overflow-hidden rounded bg-[#1F1F1F] transition-all duration-300 ease-out hover:z-20 hover:scale-[1.04] hover:bg-[#282828] hover:shadow-[0_16px_38px_rgba(0,0,0,0.85)]"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#141414]">
              <button
                type="button"
                onClick={() => onPlay(movie)}
                aria-label={`Resume ${movie.title}`}
                className="relative block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              >
                <MediaImage
                  src={movie.thumbnail}
                  youtubeId={movie.youtubeId}
                  alt={movie.title}
                  sizes="310px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#141414]/85 via-transparent to-transparent"
                />
                <span className="absolute inset-0 flex items-center justify-center opacity-95 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#141414] shadow-lg transition-transform duration-200 group-hover:scale-110">
                    <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden="true" />
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => onRemove(movie.id)}
                aria-label={`Remove ${movie.title} from Continue Watching`}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#141414]/80 text-[#E5E2E1] hover:bg-[#141414] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {movie.title}
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[#A3A3A3] tabular-nums">
                  <span>{entry.progress}% watched</span>
                  <span aria-hidden="true">·</span>
                  <span>{movie.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-[#E5E2E1]">
                    Hindi
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelect(movie)}
                aria-label={`More info about ${movie.title}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#E5E2E1] hover:bg-white/20 hover:text-white transition-colors"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Subtle Crimson Progress Bar at Bottom of Card */}
            <div
              aria-label={`${entry.progress}% watched`}
              className="h-[3px] w-full bg-white/15"
            >
              <div
                className="h-full bg-[#E50914] transition-all duration-300"
                style={{ width: `${entry.progress}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
