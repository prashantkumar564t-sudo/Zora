'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Brain,
  Check,
  Flame,
  Heart,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Tv,
} from 'lucide-react';
import MediaImage from './MediaImage';
import {
  MOOD_OPTIONS,
  countByMood,
  type MoodId,
  type MovieItem,
} from '@/lib/catalog';

interface ExploreByMoodProps {
  activeMood: MoodId | null;
  onSelectMood: (mood: MoodId | null) => void;
  catalog: MovieItem[];
  filteredMoodItems: MovieItem[];
  myListIds: string[];
  isKidsProfile: boolean;
  onPlay: (movie: MovieItem) => void;
  onSelect: (movie: MovieItem) => void;
  onToggleMyList: (movieId: string) => void;
}

const MOOD_ICON_MAP: Record<MoodId, React.ComponentType<{ className?: string }>> = {
  action: Flame,
  thrillers: Brain,
  drama: Heart,
  series: Tv,
};

export default function ExploreByMood({
  activeMood,
  onSelectMood,
  catalog,
  filteredMoodItems,
  myListIds,
  isKidsProfile,
  onPlay,
  onSelect,
  onToggleMyList,
}: ExploreByMoodProps) {
  const activeMoodMeta = MOOD_OPTIONS.find((m) => m.id === activeMood) ?? null;

  return (
    <section
      aria-label="Explore by Mood"
      className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#A3A3A3]">
            <Sparkles className="h-3.5 w-3.5 text-[#E50914]" aria-hidden="true" />
            <span>Curated Discovery · Hindi Audio</span>
          </div>
          <h2 className="mt-1.5 font-sans text-xl sm:text-2xl font-bold tracking-[-0.02em] text-white">
            Explore by Mood
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#A3A3A3]">
            Pick a vibe to filter ZORA&apos;s Hindi catalog in real time
          </p>
        </div>

        {activeMood && (
          <button
            type="button"
            onClick={() => onSelectMood(null)}
            className="inline-flex h-9 items-center gap-1.5 rounded bg-[#1F1F1F] border border-white/10 px-3.5 text-xs font-semibold text-[#E5E2E1] hover:bg-[#282828] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Clear Mood</span>
          </button>
        )}
      </div>

      {/* 4 Glassmorphic Mood Cards */}
      <div
        role="group"
        aria-label="Filter catalog by mood"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {MOOD_OPTIONS.map((mood) => {
          const Icon = MOOD_ICON_MAP[mood.id];
          const isActive = activeMood === mood.id;
          const count = countByMood(catalog, mood.id, isKidsProfile);

          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelectMood(isActive ? null : mood.id)}
              aria-pressed={isActive}
              data-mood-active={isActive ? 'true' : 'false'}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-lg p-5 text-left backdrop-blur-md border hover:-translate-y-1.5 hover:border-[#E50914]/60 hover:shadow-[0_10px_30px_rgba(229,9,20,0.2)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] ${
                isActive
                  ? '-translate-y-1 border-[#E50914] bg-[#E50914]/[0.12] shadow-[0_10px_32px_rgba(229,9,20,0.28)]'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.06]'
              }`}
            >
              {/* Subtle top ambient sheen */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-100'
                    : 'bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60 group-hover:via-[#E50914]/70 group-hover:opacity-100'
                }`}
              />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors duration-300 ${
                      isActive
                        ? 'border-[#E50914]/50 bg-[#E50914]/20 text-white'
                        : 'border-white/10 bg-white/[0.06] text-[#E5E2E1] group-hover:border-[#E50914]/40 group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums transition-colors ${
                      isActive
                        ? 'bg-[#E50914] text-white'
                        : 'bg-white/[0.07] text-[#A3A3A3] group-hover:text-white'
                    }`}
                  >
                    {count} {count === 1 ? 'title' : 'titles'}
                  </span>
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.09em] text-[#A3A3A3]">
                  {mood.eyebrow}
                </p>
                <h3 className="mt-1 font-sans text-base sm:text-[17px] font-bold tracking-[-0.015em] text-white">
                  {mood.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#A3A3A3]">
                  {mood.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] font-semibold">
                <span className={isActive ? 'text-[#E50914]' : 'text-[#A3A3A3] group-hover:text-white transition-colors'}>
                  {isActive ? 'Active Mood Filter' : 'Explore Mood →'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Smoothly Animated Filtered Catalog Shelf Directly Below Mood Cards */}
      <AnimatePresence mode="wait">
        {activeMood && activeMoodMeta && (
          <motion.div
            key={activeMood}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            data-testid="mood-filtered-results"
            className="mt-7 rounded-lg bg-[#1A1A1A]/85 border border-white/[0.08] p-4 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-sans text-base sm:text-lg font-bold tracking-[-0.015em] text-white">
                  {activeMoodMeta.title} Picks
                </h3>
                <p className="mt-0.5 text-xs text-[#A3A3A3] tabular-nums">
                  {filteredMoodItems.length}{' '}
                  {filteredMoodItems.length === 1 ? 'title' : 'titles'} ready to stream in Hindi
                </p>
              </div>
            </div>

            {filteredMoodItems.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#A3A3A3]">
                No titles match this mood under the current profile restrictions.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredMoodItems.map((movie) => {
                  const isSaved = myListIds.includes(movie.id);
                  return (
                    <article
                      key={movie.id}
                      className="group relative flex flex-col overflow-hidden rounded bg-[#1F1F1F] transition-all duration-300 ease-out hover:z-20 hover:scale-[1.04] hover:bg-[#282828] hover:shadow-[0_16px_38px_rgba(0,0,0,0.85)]"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-[#141414]">
                        <button
                          type="button"
                          onClick={() => onSelect(movie)}
                          aria-label={`View details for ${movie.title}`}
                          className="relative block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                        >
                          <MediaImage
                            src={movie.thumbnail}
                            youtubeId={movie.youtubeId}
                            alt={movie.title}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-[#141414]/20 to-transparent opacity-90 group-hover:from-[#282828] transition-colors"
                          />
                        </button>

                        <span className="pointer-events-none absolute top-2.5 left-2.5 rounded bg-[#141414]/80 px-2 py-0.5 text-[10px] font-bold tracking-[0.05em] text-[#E5E2E1]">
                          {movie.quality.split('•')[0].trim()}
                        </span>

                        <button
                          type="button"
                          onClick={() => onPlay(movie)}
                          aria-label={`Play ${movie.title}`}
                          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#141414] shadow-lg opacity-95 sm:opacity-0 sm:translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="px-3.5 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => onSelect(movie)}
                            className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                          >
                            <h4 className="text-sm font-semibold text-white truncate">
                              {movie.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#A3A3A3] tabular-nums truncate">
                              <span className="font-bold text-[#46D369] shrink-0">
                                {movie.matchScore}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{movie.year}</span>
                              <span aria-hidden="true">·</span>
                              <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-[#E5E2E1]">
                                Hindi
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleMyList(movie.id)}
                            aria-label={
                              isSaved
                                ? `Remove ${movie.title} from My List`
                                : `Add ${movie.title} to My List`
                            }
                            aria-pressed={isSaved}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                          >
                            {isSaved ? (
                              <Check className="h-4 w-4 text-[#46D369]" aria-hidden="true" />
                            ) : (
                              <Plus className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
