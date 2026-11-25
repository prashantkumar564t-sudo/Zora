import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATALOG,
  MOOD_OPTIONS,
  filterCatalog,
  getHeroItem,
  getCriticallyAcclaimed,
  getTopTen,
  getMoreLikeThis,
  toggleMyList,
  recordContinueWatching,
  removeContinueWatching,
  buildYoutubeEmbedUrl,
  getFallbackThumbnail,
  countByMood,
  pickRandomMovie,
} from './catalog';

test('catalog loads exact 7 verified Hindi titles with SEMBI as hero', () => {
  assert.equal(CATALOG.length, 7);
  assert.ok(CATALOG.every((item) => item.language === 'Hindi'));
  const hero = getHeroItem(CATALOG);
  assert.equal(hero.id, 'sembi-2026');
  assert.equal(hero.title, 'SEMBI');
  assert.equal(hero.youtubeId, '2iyH4GMTO98');
});

test('Top 10 returns ranked titles 1 through 4 in ascending order', () => {
  const topTen = getTopTen(CATALOG);
  assert.deepEqual(
    topTen.map((item) => [item.rank, item.id]),
    [
      [1, 'needa-thriller'],
      [2, 'arrambam-action'],
      [3, 'the-don-south'],
      [4, 'collegegiri-1980'],
    ]
  );
});

test('filterCatalog filters accurately by nav tab, search, and Kids profile', () => {
  const series = filterCatalog({
    catalog: CATALOG,
    navTab: 'series',
    searchQuery: '',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.equal(series.length, 2);
  assert.ok(series.every((m) => m.type === 'series'));

  const search = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    searchQuery: 'nayanthara',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    search.map((m) => m.id),
    ['needa-thriller', 'arrambam-action']
  );

  const kids = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    searchQuery: '',
    myListIds: [],
    isKidsProfile: true,
  });
  assert.ok(kids.every((m) => m.maturity === 'U' || m.maturity === 'U/A 13+'));
  assert.ok(!kids.some((m) => m.id === 'todays-episode-series'));
});

test('Explore by Mood filters all 4 moods accurately and counts match', () => {
  assert.equal(MOOD_OPTIONS.length, 4);

  const action = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    mood: 'action',
    searchQuery: '',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    action.map((m) => m.id),
    ['arrambam-action', 'the-don-south', 'collegegiri-1980']
  );
  assert.equal(countByMood(CATALOG, 'action', false), 3);

  const thrillers = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    mood: 'thrillers',
    searchQuery: '',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    thrillers.map((m) => m.id),
    ['sembi-2026', 'needa-thriller', 'arrambam-action', 'todays-episode-series']
  );
  assert.equal(countByMood(CATALOG, 'thrillers', false), 4);

  const drama = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    mood: 'drama',
    searchQuery: '',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    drama.map((m) => m.id),
    ['sembi-2026', 'the-don-south', 'north-indian-chennai']
  );
  assert.equal(countByMood(CATALOG, 'drama', false), 3);

  const series = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    mood: 'series',
    searchQuery: '',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    series.map((m) => m.id),
    ['todays-episode-series', 'north-indian-chennai']
  );
  assert.equal(countByMood(CATALOG, 'series', false), 2);
});

test('pickRandomMovie returns a catalog item and avoids repeating the excluded ID', () => {
  const picked = pickRandomMovie(CATALOG, 'sembi-2026', () => 0);
  assert.ok(picked !== null);
  assert.notEqual(picked?.id, 'sembi-2026');

  assert.equal(pickRandomMovie([], null), null);
  const single = pickRandomMovie([CATALOG[0]], CATALOG[0].id);
  assert.equal(single?.id, CATALOG[0].id);
});

test('toggleMyList adds and removes titles immutably', () => {
  const added = toggleMyList([], 'sembi-2026');
  assert.deepEqual(added, ['sembi-2026']);

  const addedSecond = toggleMyList(added, 'needa-thriller');
  assert.deepEqual(addedSecond, ['needa-thriller', 'sembi-2026']);

  const removed = toggleMyList(addedSecond, 'sembi-2026');
  assert.deepEqual(removed, ['needa-thriller']);
});

test('recordContinueWatching moves latest watched to front and advances progress', () => {
  const first = recordContinueWatching([], 'sembi-2026', 20, 1000);
  assert.equal(first.length, 1);
  assert.equal(first[0].movieId, 'sembi-2026');
  assert.equal(first[0].progress, 20);

  const second = recordContinueWatching(first, 'needa-thriller', 15, 2000);
  assert.equal(second[0].movieId, 'needa-thriller');
  assert.equal(second[1].movieId, 'sembi-2026');

  const resumed = recordContinueWatching(second, 'sembi-2026', 18, 3000);
  assert.equal(resumed[0].movieId, 'sembi-2026');
  assert.equal(resumed[0].progress, 32);

  const cleared = removeContinueWatching(resumed, 'sembi-2026');
  assert.equal(cleared.length, 1);
  assert.equal(cleared[0].movieId, 'needa-thriller');
});

test('getCriticallyAcclaimed sorts by match score descending and getMoreLikeThis excludes current item', () => {
  const acclaimed = getCriticallyAcclaimed(CATALOG);
  assert.equal(acclaimed[0].id, 'sembi-2026');
  assert.equal(acclaimed[1].id, 'needa-thriller');

  const hero = getHeroItem(CATALOG);
  const similar = getMoreLikeThis(hero, CATALOG, 4);
  assert.equal(similar.length, 4);
  assert.ok(!similar.some((m) => m.id === hero.id));
});

test('buildYoutubeEmbedUrl includes required player flags and thumbnail fallback downgrades properly', () => {
  const cinemaUrl = buildYoutubeEmbedUrl('2iyH4GMTO98');
  assert.ok(cinemaUrl.includes('https://www.youtube.com/embed/2iyH4GMTO98'));
  assert.ok(cinemaUrl.includes('autoplay=1'));
  assert.ok(cinemaUrl.includes('controls=1'));
  assert.ok(cinemaUrl.includes('modestbranding=1'));
  assert.ok(cinemaUrl.includes('rel=0'));
  assert.ok(cinemaUrl.includes('iv_load_policy=3'));

  const ambientMuted = buildYoutubeEmbedUrl('2iyH4GMTO98', {
    ambient: true,
    muted: true,
  });
  assert.ok(ambientMuted.includes('mute=1'));
  assert.ok(ambientMuted.includes('controls=0'));

  const hq = getFallbackThumbnail(
    'https://i.ytimg.com/vi/2iyH4GMTO98/maxresdefault.jpg',
    '2iyH4GMTO98'
  );
  assert.equal(hq, 'https://i.ytimg.com/vi/2iyH4GMTO98/hqdefault.jpg');

  const mq = getFallbackThumbnail(hq!, '2iyH4GMTO98');
  assert.equal(mq, 'https://i.ytimg.com/vi/2iyH4GMTO98/mqdefault.jpg');

  assert.equal(getFallbackThumbnail(mq!, '2iyH4GMTO98'), null);
});

test('filterCatalog supports category pills (All, Action, Thriller, Drama, Web Series) and combined live search', () => {
  const action = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    category: 'Action',
    searchQuery: '',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    action.map((m) => m.id),
    ['arrambam-action', 'the-don-south', 'collegegiri-1980']
  );

  const combined = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    category: 'Action',
    searchQuery: 'mahesh babu',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    combined.map((m) => m.id),
    ['the-don-south']
  );

  const searchByGenre = filterCatalog({
    catalog: CATALOG,
    navTab: 'home',
    category: 'All',
    searchQuery: 'cyber thriller',
    myListIds: [],
    isKidsProfile: false,
  });
  assert.deepEqual(
    searchByGenre.map((m) => m.id),
    ['arrambam-action']
  );
});
