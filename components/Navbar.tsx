'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Dices, Search, X } from 'lucide-react';
import ZoraLogo from './ZoraLogo';
import MediaImage from './MediaImage';
import type { MovieItem, NavTab, ProfileOption } from '@/lib/catalog';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectMovie: (movie: MovieItem) => void;
  onSurpriseMe: () => void;
  isShuffling: boolean;
  activeProfile: ProfileOption;
  onOpenProfileSwitcher: () => void;
  myListCount: number;
  featuredReleases: MovieItem[];
}

const NAV_ITEMS: Array<{ id: NavTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'movies', label: 'Movies' },
  { id: 'series', label: 'Web Series' },
  { id: 'mylist', label: 'My List' },
];

export default function Navbar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSelectMovie,
  onSurpriseMe,
  isShuffling,
  activeProfile,
  onOpenProfileSwitcher,
  myListCount,
  featuredReleases,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        searchQuery.trim() === ''
      ) {
        setSearchOpen(false);
      }
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotificationsOpen(false);
        if (searchOpen && searchQuery === '') {
          setSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchOpen, searchQuery]);

  const isSearchExpanded = searchOpen || searchQuery.length > 0;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#141414]/95 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-gradient-to-b from-[#141414]/90 via-[#141414]/45 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 md:h-[72px] max-w-[1440px] items-center justify-between gap-4 md:gap-8 px-4 sm:px-8 xl:px-14">
        {/* Zone 1: Brand + Primary Navigation */}
        <div className="flex items-center gap-6 lg:gap-10 min-w-0">
          <button
            type="button"
            onClick={() => {
              onSelectTab('home');
              onSearchChange('');
              setSearchOpen(false);
            }}
            aria-label="ZORA Home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
          >
            <ZoraLogo />
          </button>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 lg:gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 text-sm whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded ${
                    isActive
                      ? 'font-semibold text-white'
                      : 'font-medium text-[#A3A3A3] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'mylist' && myListCount > 0 && (
                    <span className="ml-1.5 text-xs font-medium text-[#A3A3A3] tabular-nums">
                      ({myListCount})
                    </span>
                  )}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 inset-x-0 h-[2px] bg-[#E50914] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 2: Interactive Controls (Surprise Me, Search, Notifications, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Animated 'Surprise Me' Picker Button */}
          <button
            type="button"
            onClick={onSurpriseMe}
            disabled={isShuffling}
            aria-label="Surprise Me — pick a random movie"
            className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.06] px-3 sm:px-3.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-[#E50914]/70 hover:bg-[#E50914]/15 hover:shadow-[0_0_22px_rgba(229,9,20,0.28)] active:scale-95 disabled:opacity-75 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914]"
          >
            {/* Subtle Hover Shimmer Sweep */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <Dices
              className={`relative h-4 w-4 text-[#E50914] transition-transform duration-300 ${
                isShuffling
                  ? 'animate-spin'
                  : 'group-hover:rotate-12 group-hover:scale-110'
              }`}
              aria-hidden="true"
            />
            <span className="relative hidden sm:inline">
              {isShuffling ? 'Shuffling...' : 'Surprise Me'}
            </span>
          </button>

          {/* Expanding Live Search Bar */}
          <div ref={searchContainerRef} className="relative">
            <div
              className={`flex items-center rounded transition-all duration-200 ${
                isSearchExpanded
                  ? 'w-48 sm:w-64 md:w-72 bg-[#1F1F1F] border border-white/15 px-3 py-1.5'
                  : 'w-10 bg-transparent border border-transparent justify-center'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (!isSearchExpanded) {
                    setSearchOpen(true);
                  } else {
                    searchInputRef.current?.focus();
                  }
                }}
                aria-label="Search titles, actors, or genres"
                aria-expanded={isSearchExpanded}
                className="flex h-7 w-7 items-center justify-center text-[#E5E2E1] hover:text-white transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
              >
                <Search className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>

              {isSearchExpanded && (
                <>
                  <input
                    ref={searchInputRef}
                    type="text"
                    role="searchbox"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search titles, actors, genres..."
                    aria-label="Search ZORA catalog"
                    className="ml-2 w-full bg-transparent text-sm text-white placeholder-[#A3A3A3] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange('');
                      setSearchOpen(false);
                    }}
                    aria-label="Clear and close search"
                    className="ml-1.5 flex h-6 w-6 items-center justify-center text-[#A3A3A3] hover:text-white transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification Bell */}
          <div ref={notifContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              aria-label="Premiere notifications"
              aria-expanded={notificationsOpen}
              className="relative flex h-10 w-10 items-center justify-center rounded text-[#E5E2E1] hover:text-white hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-[#E50914]"
              />
            </button>

            {notificationsOpen && (
              <div
                role="region"
                aria-label="New premieres on ZORA"
                className="absolute right-0 mt-2 w-80 rounded bg-[#1F1F1F] border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.75)] overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/[0.07]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3]">
                    Premiere Alerts
                  </p>
                </div>
                <ul className="divide-y divide-white/[0.06]">
                  {featuredReleases.slice(0, 3).map((release) => (
                    <li key={release.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectMovie(release);
                          setNotificationsOpen(false);
                        }}
                        className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-[#282828] transition-colors"
                      >
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-[#141414]">
                          <MediaImage
                            src={release.thumbnail}
                            youtubeId={release.youtubeId}
                            alt={release.title}
                            sizes="80px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#E50914]">
                            Now Streaming in {release.quality.split('•')[0].trim()}
                          </p>
                          <p className="text-sm font-semibold text-white truncate mt-0.5">
                            {release.title}
                          </p>
                          <p className="text-xs text-[#A3A3A3] truncate">
                            {release.language} · {release.duration}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile Avatar Switcher Button */}
          <button
            type="button"
            onClick={onOpenProfileSwitcher}
            aria-label={`Switch profile, currently ${activeProfile.name}`}
            className="flex items-center gap-2 rounded p-1 pr-1.5 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold text-white tracking-tight ${activeProfile.accentBg}`}
            >
              {activeProfile.initials}
            </span>
            <span className="hidden lg:inline text-xs font-medium text-[#E5E2E1] whitespace-nowrap max-w-[100px] truncate">
              {activeProfile.name}
            </span>
            <ChevronDown
              className="h-3.5 w-3.5 text-[#A3A3A3]"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Mobile Compact Navigation Row */}
      <nav
        aria-label="Mobile navigation"
        className="flex md:hidden items-center gap-5 overflow-x-auto no-scrollbar border-t border-white/[0.06] bg-[#141414]/95 px-4 py-2"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`text-xs whitespace-nowrap shrink-0 pb-0.5 transition-colors ${
                isActive
                  ? 'font-semibold text-white border-b-2 border-[#E50914]'
                  : 'font-medium text-[#A3A3A3]'
              }`}
            >
              {item.label}
              {item.id === 'mylist' && myListCount > 0 ? ` (${myListCount})` : ''}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
