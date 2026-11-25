import { ZORA_CATALOG, ZORA_PROFILES } from '../src/data/moviesData.js';

export type MediaType = 'movie' | 'series';
export type NavTab = 'home' | 'movies' | 'series' | 'mylist';
export type CategoryFilter = 'All' | 'Action' | 'Thriller' | 'Drama' | 'Web Series';
export type MoodId = 'action' | 'thrillers' | 'drama' | 'series';
export type ProfileId = 'prashant' | 'recruiter-demo' | 'kids';

export const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Action',
  'Thriller',
  'Drama',
  'Web Series',
];

export interface MoodOption {
  id: MoodId;
  title: string;
  description: string;
  eyebrow: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'action',
    eyebrow: 'Adrenaline Rush',
    title: 'High-Octane Action',
    description: 'Explosive stunts, daring rebels, and relentless mass-action spectacles.',
  },
  {
    id: 'thrillers',
    eyebrow: 'Edge of Your Seat',
    title: 'Mind-Bending Thrillers',
    description: 'Twisted mysteries, cyber conspiracies, and taut crime investigations.',
  },
  {
    id: 'drama',
    eyebrow: 'Deeply Moving',
    title: 'Heartfelt Drama',
    description: 'Emotionally charged stories of family bonds, courage, and justice.',
  },
  {
    id: 'series',
    eyebrow: 'Episode After Episode',
    title: 'Binge Web Series',
    description: 'Addictive originals spanning suspenseful crime drops and family comedy.',
  },
];

export interface MovieItem {
  id: string;
  title: string;
  subtitle?: string;
  type: MediaType;
  isHero?: boolean;
  rank?: number;
  matchScore: string;
  year: number;
  maturity: string;
  duration: string;
  language: 'Hindi';
  quality: string;
  genres: string[];
  cast: string;
  synopsis: string;
  youtubeId: string;
  thumbnail: string;
}

export interface ProfileOption {
  id: ProfileId;
  name: string;
  role: string;
  initials: string;
  accentBg: string;
  isKids: boolean;
}

export interface ContinueWatchingEntry {
  movieId: string;
  progress: number; // 0 to 100
  lastPlayedAt: number;
}

export interface FilterCatalogParams {
  catalog: MovieItem[];
  navTab: NavTab;
  category?: CategoryFilter;
  mood?: MoodId | null;
  searchQuery: string;
  myListIds: string[];
  isKidsProfile: boolean;
}

export const CATALOG: MovieItem[] = ZORA_CATALOG as MovieItem[];
export const PROFILES: ProfileOption[] = ZORA_PROFILES as ProfileOption[];

/**
 * Returns true if the movie is appropriate for the Kids profile (U or U/A 13+).
 */
export function isAllowedForKids(item: MovieItem): boolean {
  const normalized = item.maturity.trim().toUpperCase();
  return normalized === 'U' || normalized === 'U/A 13+';
}

/**
 * Returns true if the item matches the selected category pill.
 */
export function matchesCategory(item: MovieItem, category: CategoryFilter): boolean {
  if (category === 'All') return true;
  if (category === 'Web Series') return item.type === 'series';
  const needle = category.toLowerCase();
  return item.genres.some((genre) => genre.toLowerCase().includes(needle));
}

/**
 * Returns true if the item matches one of the 4 'Explore by Mood' cards.
 */
export function matchesMood(item: MovieItem, mood: MoodId | null | undefined): boolean {
  if (!mood) return true;
  const genresLower = item.genres.map((g) => g.toLowerCase());

  switch (mood) {
    case 'action':
      return (
        item.type === 'movie' &&
        genresLower.some((g) => g.includes('action'))
      );
    case 'thrillers':
      return genresLower.some(
        (g) => g.includes('thriller') || g.includes('mystery') || g.includes('suspense')
      );
    case 'drama':
      return genresLower.some(
        (g) => g.includes('drama') || g.includes('family') || g.includes('slice of life')
      );
    case 'series':
      return item.type === 'series';
    default:
      return true;
  }
}

/**
 * Returns count of titles matching a specific mood given profile constraints.
 */
export function countByMood(
  catalog: MovieItem[],
  mood: MoodId,
  isKidsProfile: boolean
): number {
  return catalog.filter((item) => {
    if (isKidsProfile && !isAllowedForKids(item)) return false;
    return matchesMood(item, mood);
  }).length;
}

/**
 * Filters the catalog based on profile restrictions, active nav tab, category pill, mood card, and search query.
 */
export function filterCatalog({
  catalog,
  navTab,
  category = 'All',
  mood = null,
  searchQuery,
  myListIds,
  isKidsProfile,
}: FilterCatalogParams): MovieItem[] {
  const query = searchQuery.trim().toLowerCase();

  return catalog.filter((item) => {
    if (isKidsProfile && !isAllowedForKids(item)) {
      return false;
    }

    if (navTab === 'movies' && item.type !== 'movie') {
      return false;
    }

    if (navTab === 'series' && item.type !== 'series') {
      return false;
    }

    if (navTab === 'mylist' && !myListIds.includes(item.id)) {
      return false;
    }

    if (!matchesCategory(item, category)) {
      return false;
    }

    if (!matchesMood(item, mood)) {
      return false;
    }

    if (query.length > 0) {
      const searchable = [
        item.title,
        item.language,
        item.cast,
        item.synopsis,
        item.type === 'series' ? 'web series show' : 'movie film',
        ...item.genres,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Picks a random movie from the catalog, avoiding the previously picked ID when possible.
 */
export function pickRandomMovie(
  catalog: MovieItem[],
  excludeId?: string | null,
  randomFn: () => number = Math.random
): MovieItem | null {
  if (catalog.length === 0) return null;
  const pool =
    excludeId && catalog.length > 1
      ? catalog.filter((item) => item.id !== excludeId)
      : catalog;
  const index = Math.floor(Math.max(0, Math.min(0.999999, randomFn())) * pool.length);
  return pool[index] ?? pool[0];
}

/**
 * Returns the designated hero billboard title (SEMBI) or falls back to the first item.
 */
export function getHeroItem(catalog: MovieItem[]): MovieItem {
  return catalog.find((item) => item.isHero) ?? catalog[0];
}

/**
 * Returns titles for Row 1 ("Critically Acclaimed Cinema"), sorted by match score descending.
 */
export function getCriticallyAcclaimed(items: MovieItem[]): MovieItem[] {
  return [...items].sort((a, b) => {
    const scoreA = Number.parseInt(a.matchScore, 10) || 0;
    const scoreB = Number.parseInt(b.matchScore, 10) || 0;
    return scoreB - scoreA;
  });
}

/**
 * Returns ranked titles for Row 2 ("Top 10 on ZORA Today"), ordered ascending by rank (1, 2, 3, 4).
 */
export function getTopTen(items: MovieItem[]): MovieItem[] {
  return items
    .filter((item) => typeof item.rank === 'number')
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
}

/**
 * Returns related recommendations for the Detail Modal ("More Like This").
 */
export function getMoreLikeThis(
  current: MovieItem,
  catalog: MovieItem[],
  limit = 4
): MovieItem[] {
  const candidates = catalog.filter((item) => item.id !== current.id);

  const scored = candidates.map((candidate) => {
    let score = 0;
    if (candidate.type === current.type) score += 1;
    for (const genre of candidate.genres) {
      if (current.genres.includes(genre)) score += 3;
    }
    score += (Number.parseInt(candidate.matchScore, 10) || 0) / 100;
    return { candidate, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.candidate);
}

/**
 * Toggles a movie ID in the user's My List without mutating the original array.
 */
export function toggleMyList(currentIds: string[], movieId: string): string[] {
  if (currentIds.includes(movieId)) {
    return currentIds.filter((id) => id !== movieId);
  }
  return [movieId, ...currentIds];
}

/**
 * Adds or updates a movie in Continue Watching, placing the most recently played item first.
 */
export function recordContinueWatching(
  entries: ContinueWatchingEntry[],
  movieId: string,
  progress = 18,
  timestamp = Date.now()
): ContinueWatchingEntry[] {
  const clampedProgress = Math.max(5, Math.min(95, Math.round(progress)));
  const existing = entries.find((entry) => entry.movieId === movieId);
  const nextProgress = existing
    ? Math.min(95, Math.max(existing.progress + 12, clampedProgress))
    : clampedProgress;

  const filtered = entries.filter((entry) => entry.movieId !== movieId);
  return [
    {
      movieId,
      progress: nextProgress,
      lastPlayedAt: timestamp,
    },
    ...filtered,
  ].slice(0, 10);
}

/**
 * Removes an item from Continue Watching.
 */
export function removeContinueWatching(
  entries: ContinueWatchingEntry[],
  movieId: string
): ContinueWatchingEntry[] {
  return entries.filter((entry) => entry.movieId !== movieId);
}

/**
 * Builds the YouTube embed URL for either full cinema playback or ambient muted hero preview.
 */
export function buildYoutubeEmbedUrl(
  youtubeId: string,
  options: {
    ambient?: boolean;
    muted?: boolean;
  } = {}
): string {
  const params = new URLSearchParams({
    autoplay: '1',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
  });

  if (options.ambient) {
    params.set('controls', '0');
    params.set('loop', '1');
    params.set('playlist', youtubeId);
    params.set('mute', options.muted === false ? '0' : '1');
    params.set('playsinline', '1');
  } else {
    params.set('controls', '1');
    params.set('playsinline', '1');
    if (options.muted) {
      params.set('mute', '1');
    }
  }

  return `https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?${params.toString()}`;
}

/**
 * Returns the fallback YouTube thumbnail URL when maxresdefault.jpg is unavailable.
 */
export function getFallbackThumbnail(
  currentSrc: string,
  youtubeId: string
): string | null {
  if (currentSrc.includes('maxresdefault.jpg')) {
    return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  if (currentSrc.includes('hqdefault.jpg')) {
    return `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;
  }
  return null;
}
