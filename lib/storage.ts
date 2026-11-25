import type { ContinueWatchingEntry, ProfileId } from './catalog';

export interface ProfileStorageState {
  myList: string[];
  continueWatching: ContinueWatchingEntry[];
  audioTrack: string;
  subtitleTrack: string;
}

export interface ZoraPersistedState {
  activeProfile: ProfileId;
  profiles: Record<ProfileId, ProfileStorageState>;
}

const STORAGE_KEY = 'zora_streaming_state_v1';

const DEFAULT_PROFILE_STATE: ProfileStorageState = {
  myList: [],
  continueWatching: [],
  audioTrack: 'original-atmos',
  subtitleTrack: 'en-cc',
};

export const INITIAL_PERSISTED_STATE: ZoraPersistedState = {
  activeProfile: 'prashant',
  profiles: {
    prashant: { ...DEFAULT_PROFILE_STATE },
    'recruiter-demo': {
      myList: ['sembi-2026', 'needa-thriller'],
      continueWatching: [],
      audioTrack: 'original-atmos',
      subtitleTrack: 'en-cc',
    },
    kids: { ...DEFAULT_PROFILE_STATE },
  },
};

function parsePersistedState(raw: string | null): ZoraPersistedState {
  if (!raw) return INITIAL_PERSISTED_STATE;

  try {
    const parsed = JSON.parse(raw) as Partial<ZoraPersistedState>;
    const activeProfile: ProfileId =
      parsed.activeProfile === 'prashant' ||
      parsed.activeProfile === 'recruiter-demo' ||
      parsed.activeProfile === 'kids'
        ? parsed.activeProfile
        : 'prashant';

    const mergeProfile = (
      id: ProfileId,
      fallback: ProfileStorageState
    ): ProfileStorageState => {
      const candidate = parsed.profiles?.[id];
      if (!candidate || typeof candidate !== 'object') return { ...fallback };
      return {
        myList: Array.isArray(candidate.myList)
          ? candidate.myList.filter((item): item is string => typeof item === 'string')
          : [...fallback.myList],
        continueWatching: Array.isArray(candidate.continueWatching)
          ? candidate.continueWatching.filter(
              (entry): entry is ContinueWatchingEntry =>
                Boolean(
                  entry &&
                    typeof entry.movieId === 'string' &&
                    typeof entry.progress === 'number' &&
                    typeof entry.lastPlayedAt === 'number'
                )
            )
          : [...fallback.continueWatching],
        audioTrack:
          typeof candidate.audioTrack === 'string'
            ? candidate.audioTrack
            : fallback.audioTrack,
        subtitleTrack:
          typeof candidate.subtitleTrack === 'string'
            ? candidate.subtitleTrack
            : fallback.subtitleTrack,
      };
    };

    return {
      activeProfile,
      profiles: {
        prashant: mergeProfile('prashant', INITIAL_PERSISTED_STATE.profiles.prashant),
        'recruiter-demo': mergeProfile(
          'recruiter-demo',
          INITIAL_PERSISTED_STATE.profiles['recruiter-demo']
        ),
        kids: mergeProfile('kids', INITIAL_PERSISTED_STATE.profiles.kids),
      },
    };
  } catch {
    return INITIAL_PERSISTED_STATE;
  }
}

// Cached snapshot so useSyncExternalStore receives a referentially stable value
let cachedRaw: string | null = null;
let cachedState: ZoraPersistedState = INITIAL_PERSISTED_STATE;
const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function getServerPersistedState(): ZoraPersistedState {
  return INITIAL_PERSISTED_STATE;
}

export function getClientPersistedState(): ZoraPersistedState {
  if (typeof window === 'undefined') {
    return INITIAL_PERSISTED_STATE;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedState;
    }
    cachedRaw = raw;
    cachedState = parsePersistedState(raw);
    return cachedState;
  } catch {
    return cachedState;
  }
}

export function subscribePersistedState(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

export function updatePersistedState(
  updater: (prev: ZoraPersistedState) => ZoraPersistedState
): void {
  const prev = getClientPersistedState();
  const next = updater(prev);
  const serialized = JSON.stringify(next);
  cachedRaw = serialized;
  cachedState = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // Ignore storage quota or private browsing errors gracefully
    }
  }
  notifyListeners();
}
