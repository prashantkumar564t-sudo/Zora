'use client';

import React from 'react';
import { Play } from 'lucide-react';
import MediaImage from './MediaImage';
import type { MovieItem } from '@/lib/catalog';

interface TopTenRowProps {
  items: MovieItem[];
  onPlay: (movie: MovieItem) => void;
  onSelect: (movie: MovieItem) => void;
}

export default function TopTenRow({ items, onPlay, onSelect }: TopTenRowProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Top 10 on ZORA Today"
      className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14"
    >
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-sans text-xl sm:text-[22px] font-bold tracking-[-0.015em] text-white">
            Top 10 on ZORA Today
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-[#A3A3A3]">
            Most-watched South Indian theatrical premieres across India
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7">
        {items.map((movie, index) => {
          const rankNumber = movie.rank ?? index + 1;
          return (
            <article
              key={movie.id}
              className="group relative flex items-end gap-2 overflow-visible"
            >
              {/* Full Large Silver-Outlined Rank Number (2px solid #737373) — Cleanly Visible & Unclipped */}
              <div
                aria-hidden="true"
                className="relative z-10 w-[84px] sm:w-[90px] shrink-0 select-none flex items-end justify-end pointer-events-none"
              >
                <svg
                  viewBox="0 0 112 168"
                  className="h-[156px] sm:h-[172px] w-full overflow-visible"
                >
                  <text
                    x="102"
                    y="150"
                    textAnchor="end"
                    fill="#141414"
                    stroke="#737373"
                    strokeWidth="2.6"
                    paintOrder="stroke fill"
                    className="font-sans font-black transition-colors duration-200 group-hover:stroke-white/90"
                    style={{
                      fontSize: '150px',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {rankNumber}
                  </text>
                </svg>
              </div>

              {/* Clean Full-Bleed Vertical 2:3 Theatrical Poster */}
              <div className="relative z-20 flex-1 aspect-[2/3] overflow-hidden rounded bg-[#1F1F1F] transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_16px_38px_rgba(0,0,0,0.85)]">
                <button
                  type="button"
                  onClick={() => onSelect(movie)}
                  aria-label={`Rank ${rankNumber}: ${movie.title} — View details`}
                  className="relative block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  <MediaImage
                    src={movie.thumbnail}
                    youtubeId={movie.youtubeId}
                    alt={`${movie.title} poster`}
                    sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 220px"
                    className="object-cover object-center scale-[1.12] transition-transform duration-300 ease-out group-hover:scale-[1.18]"
                  />

                  {/* Cinematic Bottom Vignette */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/35 to-transparent"
                  />

                  {/* Clean Theatrical Title & Metadata inside Poster Scrim */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 pr-12">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-bold text-[#46D369] tabular-nums">
                        {movie.matchScore}
                      </p>
                      <span className="rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                        Hindi
                      </span>
                    </div>
                    <h3 className="mt-1 font-sans text-base font-bold leading-snug tracking-[-0.015em] text-white line-clamp-2">
                      {movie.title}
                    </h3>
                    <p className="mt-1 text-[11px] font-medium text-[#A3A3A3] truncate">
                      {movie.maturity} · {movie.duration}
                    </p>
                  </div>
                </button>

                {/* Quick-Play Circular Action with Smooth Hover Fade-In */}
                <button
                  type="button"
                  onClick={() => onPlay(movie)}
                  aria-label={`Play ${movie.title}`}
                  className="absolute bottom-3.5 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#141414] shadow-md opacity-95 sm:opacity-0 sm:translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
