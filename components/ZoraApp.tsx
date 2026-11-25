'use client';

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bookmark,
  Check,
  Dices,
  Film,
  Play,
  Plus,
  RotateCcw,
  Search,
} from 'lucide-react';
import Navbar from './Navbar';
import HeroBillboard from './HeroBillboard';
import ContinueWatchingRow from './ContinueWatchingRow';
import CategoryFilterBar from './CategoryFilterBar';
import AcclaimedRow from './AcclaimedRow';
import TopTenRow from './TopTenRow';
import ExploreByMood from './ExploreByMood';
import DetailModal from './DetailModal';
import CinemaPlayer from './CinemaPlayer';
import ProfileSwitcherModal from './ProfileSwitcherModal';
import ZoraLogo from './ZoraLogo';
import MediaImage from './MediaImage';
import {
  CATALOG,
  PROFILES,
  filterCatalog,
  getCriticallyAcclaimed,
  getHeroItem,
  getTopTen,
  pickRandomMovie,
  recordContinueWatching,
  removeContinueWatching,
  toggleMyList,
  type CategoryFilter,
  type MoodId,
  type MovieItem,
  type NavTab,
  type ProfileId,
} from '@/lib/catalog';
import {
  getClientPersistedState,
  getServerPersistedState,
  subscribePersistedState,
  updatePersistedState,
} from '@/lib/storage';

const SHUFFLE_DURATION_MS = 600;
const SHUFFLE_STEP_MS = 95;

export default function ZoraApp() {
  const persisted = useSyncExternalStore(
    subscribePersistedState,
    getClientPersistedState,
    getServerPersistedState
  );

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [activeMood, setActiveMood] = useState<MoodId | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [playingMovie, setPlayingMovie] = useState<MovieItem | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [shufflingTitle, setShufflingTitle] = useState<string | null>(null);
  const shuffleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSurpriseIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (shuffleIntervalRef.current !== null) {
        clearInterval(shuffleIntervalRef.current);
      }
      if (shuffleTimeoutRef.current !== null) {
        clearTimeout(shuffleTimeoutRef.current);
      }
    };
  }, []);

  const activeProfile =
    PROFILES.find((p) => p.id === persisted.activeProfile) ?? PROFILES[0];
  const profileState = persisted.profiles[activeProfile.id];

  const heroMovie = useMemo(() => getHeroItem(CATALOG), []);
  const isSearching = searchQuery.trim().length > 0;

  const profileAllowedCatalog = useMemo(
    () =>
      filterCatalog({
        catalog: CATALOG,
        navTab: 'home',
        searchQuery: '',
        myListIds: profileState.myList,
        isKidsProfile: activeProfile.isKids,
      }),
    [profileState.myList, activeProfile.isKids]
  );

  // Main catalog filtered in real time by profile + nav tab + category pill + live search query
  const filteredItems = useMemo(
    () =>
      filterCatalog({
        catalog: CATALOG,
        navTab: isSearching ? 'home' : activeTab,
        category: activeTab === 'mylist' && !isSearching ? 'All' : activeCategory,
        searchQuery,
        myListIds: profileState.myList,
        isKidsProfile: activeProfile.isKids,
      }),
    [
      isSearching,
      activeTab,
      activeCategory,
      searchQuery,
      profileState.myList,
      activeProfile.isKids,
    ]
  );

  // Catalog filtered specifically for the active 'Explore by Mood' card
  const filteredMoodItems = useMemo(
    () =>
      activeMood
        ? filterCatalog({
            catalog: CATALOG,
            navTab: 'home',
            mood: activeMood,
            searchQuery: '',
            myListIds: profileState.myList,
            isKidsProfile: activeProfile.isKids,
          })
        : [],
    [activeMood, profileState.myList, activeProfile.isKids]
  );

  const criticallyAcclaimed = useMemo(
    () => getCriticallyAcclaimed(filteredItems),
    [filteredItems]
  );

  const topTenItems = useMemo(() => getTopTen(filteredItems), [filteredItems]);

  const webSeriesItems = useMemo(
    () => filteredItems.filter((item) => item.type === 'series'),
    [filteredItems]
  );

  const handleToggleMyList = (movieId: string) => {
    updatePersistedState((prev) => {
      const current = prev.profiles[prev.activeProfile];
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfile]: {
            ...current,
            myList: toggleMyList(current.myList, movieId),
          },
        },
      };
    });
  };

  const handlePlayMovie = (movie: MovieItem) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
    updatePersistedState((prev) => {
      const current = prev.profiles[prev.activeProfile];
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfile]: {
            ...current,
            continueWatching: recordContinueWatching(
              current.continueWatching,
              movie.id
            ),
          },
        },
      };
    });
  };

  const handleRemoveContinueWatching = (movieId: string) => {
    updatePersistedState((prev) => {
      const current = prev.profiles[prev.activeProfile];
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfile]: {
            ...current,
            continueWatching: removeContinueWatching(
              current.continueWatching,
              movieId
            ),
          },
        },
      };
    });
  };

  const handleSelectProfile = (profileId: ProfileId) => {
    updatePersistedState((prev) => ({
      ...prev,
      activeProfile: profileId,
    }));
  };

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setActiveCategory('All');
    if (tab === 'mylist') {
      setActiveMood(null);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value: string) => {
    const wasEmpty = searchQuery.trim().length === 0;
    setSearchQuery(value);
    if (
      wasEmpty &&
      value.trim().length > 0 &&
      typeof window !== 'undefined' &&
      window.scrollY > 120
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setActiveMood(null);
    setSearchQuery('');
  };

  const handleSurpriseMe = () => {
    if (shufflingTitle !== null || profileAllowedCatalog.length === 0) return;

    const chosen = pickRandomMovie(profileAllowedCatalog, lastSurpriseIdRef.current);
    if (!chosen) return;
    lastSurpriseIdRef.current = chosen.id;

    let step = 0;
    setShufflingTitle(profileAllowedCatalog[0].title);

    shuffleIntervalRef.current = setInterval(() => {
      step += 1;
      const next = profileAllowedCatalog[step % profileAllowedCatalog.length];
      setShufflingTitle(next.title);
    }, SHUFFLE_STEP_MS);

    shuffleTimeoutRef.current = setTimeout(() => {
      if (shuffleIntervalRef.current !== null) {
        clearInterval(shuffleIntervalRef.current);
        shuffleIntervalRef.current = null;
      }
      shuffleTimeoutRef.current = null;
      setShufflingTitle(null);
      setSelectedMovie(chosen);
    }, SHUFFLE_DURATION_MS);
  };

  const tabHeadingMap: Record<NavTab, { title: string; subtitle: string }> = {
    home: {
      title: 'Critically Acclaimed Cinema',
      subtitle: 'Curated features and original series streaming in Hindi · 4K UHD',
    },
    movies: {
      title: 'Feature Films',
      subtitle: 'Blockbuster action, gripping thrillers & acclaimed dramas in Hindi',
    },
    series: {
      title: 'ZORA Original Web Series',
      subtitle: 'Binge-worthy crime thrillers and slice-of-life comedy specials in Hindi',
    },
    mylist: {
      title: 'My List',
      subtitle: `Saved watchlist for ${activeProfile.name}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSelectMovie={setSelectedMovie}
        onSurpriseMe={handleSurpriseMe}
        isShuffling={shufflingTitle !== null}
        activeProfile={activeProfile}
        onOpenProfileSwitcher={() => setProfileModalOpen(true)}
        myListCount={profileState.myList.length}
        featuredReleases={profileAllowedCatalog}
      />

      {/* Animated 0.6s 'Surprise Me' Shuffle Overlay */}
      <AnimatePresence>
        {shufflingTitle !== null && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            role="status"
            aria-live="polite"
            data-testid="surprise-shuffle-banner"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-[#E50914]/60 bg-[#141414]/95 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl shadow-[0_12px_36px_rgba(229,9,20,0.35)]"
          >
            <Dices className="h-4 w-4 text-[#E50914] animate-spin shrink-0" aria-hidden="true" />
            <span className="text-[#A3A3A3]">Picking your movie:</span>
            <span className="text-white font-bold truncate max-w-[200px]">
              {shufflingTitle}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* Live Real-Time Search View */}
        {isSearching ? (
          <div className="pt-28 md:pt-28 pb-20 space-y-8">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A3A3A3]">
                    Live Catalog Search
                  </p>
                  <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-white">
                    Results for &ldquo;{searchQuery.trim()}&rdquo;
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-[#A3A3A3] tabular-nums">
                    {filteredItems.length}{' '}
                    {filteredItems.length === 1 ? 'matching title' : 'matching titles'}
                    {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex h-9 items-center gap-2 self-start rounded bg-[#1F1F1F] border border-white/10 px-3.5 text-xs font-semibold text-[#E5E2E1] hover:bg-[#282828] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Clear Search</span>
                </button>
              </div>
            </div>

            <CategoryFilterBar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              totalCount={filteredItems.length}
              onResetAll={() => setActiveCategory('All')}
            />

            <section
              aria-label="Live search results"
              className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14"
            >
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded bg-[#1F1F1F] border border-white/[0.06] px-6 py-16 text-center">
                  <Search className="h-10 w-10 text-[#737373] mb-4" aria-hidden="true" />
                  <h2 className="font-sans text-xl font-bold text-white">
                    No matches for &ldquo;{searchQuery.trim()}&rdquo;
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-[#A3A3A3]">
                    Try searching by movie title, actor (e.g. Nayanthara, Mahesh Babu), or genre (Action, Thriller, Drama).
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-6 inline-flex h-10 items-center rounded bg-white px-5 text-sm font-bold text-[#141414] hover:bg-white/90 transition-colors"
                  >
                    Reset Search &amp; Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredItems.map((movie) => {
                    const isSaved = profileState.myList.includes(movie.id);
                    return (
                      <article
                        key={movie.id}
                        className="group relative flex flex-col overflow-hidden rounded bg-[#1F1F1F] transition-all duration-300 ease-out hover:z-20 hover:scale-[1.04] hover:bg-[#282828] hover:shadow-[0_16px_38px_rgba(0,0,0,0.85)]"
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-[#141414]">
                          <button
                            type="button"
                            onClick={() => setSelectedMovie(movie)}
                            aria-label={`View details for ${movie.title}`}
                            className="relative block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                          >
                            <MediaImage
                              src={movie.thumbnail}
                              youtubeId={movie.youtubeId}
                              alt={movie.title}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
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
                            onClick={() => handlePlayMovie(movie)}
                            aria-label={`Play ${movie.title}`}
                            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#141414] shadow-lg opacity-95 sm:opacity-0 sm:translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            <Play className="h-4 w-4 fill-current ml-0.5" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="px-3.5 py-3 flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedMovie(movie)}
                              className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                            >
                              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-white truncate">
                                {movie.title}
                              </h2>
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
                              <p className="mt-1.5 text-xs text-[#737373] truncate">
                                {movie.genres.join(' · ')}
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleMyList(movie.id)}
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
            </section>
          </div>
        ) : (
          <>
            {/* Hero Billboard on Home View */}
            {activeTab === 'home' && (
              <HeroBillboard
                movie={heroMovie}
                isInMyList={profileState.myList.includes(heroMovie.id)}
                onPlay={handlePlayMovie}
                onMoreInfo={setSelectedMovie}
                onToggleMyList={handleToggleMyList}
                isPlayerOpen={playingMovie !== null}
              />
            )}

            {/* Secondary View Top Spacer & Editorial Header */}
            {activeTab !== 'home' && (
              <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14 pt-28 md:pt-28 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
                  <div>
                    <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-[-0.025em] text-white">
                      {tabHeadingMap[activeTab].title}
                    </h1>
                    <p className="mt-1.5 text-sm text-[#A3A3A3]">
                      {tabHeadingMap[activeTab].subtitle}
                    </p>
                  </div>
                  {activeCategory !== 'All' && activeTab !== 'mylist' && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex h-9 items-center gap-2 self-start rounded bg-[#1F1F1F] border border-white/10 px-3.5 text-xs font-semibold text-[#E5E2E1] hover:bg-[#282828] transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Content Rails Stack */}
            <div
              className={`space-y-10 sm:space-y-12 pb-20 ${
                activeTab === 'home' ? '-mt-4 relative z-20' : 'mt-6'
              }`}
            >
              {/* Automatic Continue Watching Row (immediately right below Hero Banner after playing a title) */}
              {activeTab === 'home' && profileState.continueWatching.length > 0 && (
                <ContinueWatchingRow
                  entries={profileState.continueWatching}
                  catalog={profileAllowedCatalog}
                  onPlay={handlePlayMovie}
                  onSelect={setSelectedMovie}
                  onRemove={handleRemoveContinueWatching}
                />
              )}

              {/* Interactive Category Filter Pills (All, Action, Thriller, Drama, Web Series) */}
              {activeTab !== 'mylist' && (
                <CategoryFilterBar
                  activeCategory={activeCategory}
                  onSelectCategory={setActiveCategory}
                  totalCount={filteredItems.length}
                  onResetAll={handleResetFilters}
                />
              )}

              {/* Empty States for My List or Filtered Views */}
              {filteredItems.length === 0 ? (
                <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 xl:px-14 py-12">
                  <div className="flex flex-col items-center justify-center rounded bg-[#1F1F1F] border border-white/[0.06] px-6 py-16 text-center">
                    {activeTab === 'mylist' ? (
                      <>
                        <Bookmark className="h-10 w-10 text-[#737373] mb-4" aria-hidden="true" />
                        <h2 className="font-sans text-xl font-bold text-white">
                          Your watchlist is empty
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-[#A3A3A3]">
                          Add films or web series using the &ldquo;+ My List&rdquo; button on
                          any title to keep them ready for your next premiere night.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('home');
                            handleResetFilters();
                          }}
                          className="mt-6 inline-flex h-10 items-center rounded bg-white px-5 text-sm font-bold text-[#141414] hover:bg-white/90 transition-colors"
                        >
                          Explore Catalog
                        </button>
                      </>
                    ) : (
                      <>
                        <Film className="h-10 w-10 text-[#737373] mb-4" aria-hidden="true" />
                        <h2 className="font-sans text-xl font-bold text-white">
                          No matching titles in this filter
                        </h2>
                        <p className="mt-2 max-w-md text-sm text-[#A3A3A3]">
                          Try selecting another category filter to explore more titles on ZORA.
                        </p>
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="mt-6 inline-flex h-10 items-center rounded bg-white px-5 text-sm font-bold text-[#141414] hover:bg-white/90 transition-colors"
                        >
                          Show All Titles
                        </button>
                      </>
                    )}
                  </div>
                </section>
              ) : (
                <>
                  {/* Row 1: Critically Acclaimed Cinema (16:9 Borderless Widescreen Cards) */}
                  <AcclaimedRow
                    title={
                      activeTab === 'home'
                        ? activeCategory === 'All'
                          ? 'Critically Acclaimed Cinema'
                          : `${activeCategory} on ZORA`
                        : tabHeadingMap[activeTab].title
                    }
                    subtitle={
                      activeTab === 'home' && activeCategory !== 'All'
                        ? `Showing ${criticallyAcclaimed.length} ${activeCategory.toLowerCase()} ${
                            criticallyAcclaimed.length === 1 ? 'title' : 'titles'
                          } in Hindi`
                        : tabHeadingMap[activeTab].subtitle
                    }
                    items={criticallyAcclaimed}
                    myListIds={profileState.myList}
                    onPlay={handlePlayMovie}
                    onSelect={setSelectedMovie}
                    onToggleMyList={handleToggleMyList}
                  />

                  {/* Row 2: Top 10 on ZORA Today (Unclipped Silver-Outlined Numbers + 2:3 Posters) */}
                  {(activeTab === 'home' || activeTab === 'movies') &&
                    topTenItems.length > 0 && (
                      <TopTenRow
                        items={topTenItems}
                        onPlay={handlePlayMovie}
                        onSelect={setSelectedMovie}
                      />
                    )}

                  {/* Animated 'Explore by Mood' Glassmorphic Section */}
                  {activeTab !== 'mylist' && (
                    <ExploreByMood
                      activeMood={activeMood}
                      onSelectMood={setActiveMood}
                      catalog={CATALOG}
                      filteredMoodItems={filteredMoodItems}
                      myListIds={profileState.myList}
                      isKidsProfile={activeProfile.isKids}
                      onPlay={handlePlayMovie}
                      onSelect={setSelectedMovie}
                      onToggleMyList={handleToggleMyList}
                    />
                  )}

                  {/* Row 3 on Home: ZORA Original Web Series */}
                  {activeTab === 'home' &&
                    activeCategory !== 'Web Series' &&
                    activeMood !== 'series' &&
                    webSeriesItems.length > 0 && (
                      <AcclaimedRow
                        title="ZORA Original Web Series"
                        subtitle="Episodic crime thrillers and slice-of-life comedies streaming in Hindi"
                        items={webSeriesItems}
                        myListIds={profileState.myList}
                        onPlay={handlePlayMovie}
                        onSelect={setSelectedMovie}
                        onToggleMyList={handleToggleMyList}
                      />
                    )}
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0E0E0E]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 xl:px-14 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <ZoraLogo />
              <p className="mt-3 text-xs text-[#A3A3A3]">
                Prestige Indian cinema &amp; original web series streaming in Hindi · 4K UHD.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A3A3A3]">
              <button
                type="button"
                onClick={() => handleSelectTab('home')}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => handleSelectTab('movies')}
                className="hover:text-white transition-colors"
              >
                Movies
              </button>
              <button
                type="button"
                onClick={() => handleSelectTab('series')}
                className="hover:text-white transition-colors"
              >
                Web Series
              </button>
              <button
                type="button"
                onClick={() => handleSelectTab('mylist')}
                className="hover:text-white transition-colors"
              >
                My List
              </button>
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                Switch Profile
              </button>
              <span className="text-[#737373]">© 2026 ZORA Cinema</span>
            </div>
          </div>

          <p className="mt-6 border-t border-white/[0.05] pt-5 text-[11px] text-[#737373]">
            Learning demo built for educational showcase purposes using public YouTube embeds. All media rights belong to their respective owners.
          </p>
        </div>
      </footer>

      {/* Modals & Full-Screen Cinema Player */}
      <AnimatePresence>
        {selectedMovie && (
          <DetailModal
            key={selectedMovie.id}
            movie={selectedMovie}
            catalog={profileAllowedCatalog}
            isInMyList={profileState.myList.includes(selectedMovie.id)}
            onClose={() => setSelectedMovie(null)}
            onPlay={handlePlayMovie}
            onToggleMyList={handleToggleMyList}
            onSelectSimilar={(similar) => setSelectedMovie(similar)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {playingMovie && (
          <CinemaPlayer
            key="cinema-player"
            movie={playingMovie}
            catalog={profileAllowedCatalog}
            isInMyList={profileState.myList.includes(playingMovie.id)}
            onToggleMyList={handleToggleMyList}
            onPlayMovie={handlePlayMovie}
            onClose={() => setPlayingMovie(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileModalOpen && (
          <ProfileSwitcherModal
            activeProfileId={activeProfile.id}
            onSelectProfile={handleSelectProfile}
            onClose={() => setProfileModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
