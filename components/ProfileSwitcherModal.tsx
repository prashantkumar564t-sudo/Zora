'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, X } from 'lucide-react';
import ZoraLogo from './ZoraLogo';
import { PROFILES, type ProfileId } from '@/lib/catalog';

interface ProfileSwitcherModalProps {
  activeProfileId: ProfileId;
  onSelectProfile: (profileId: ProfileId) => void;
  onClose: () => void;
}

export default function ProfileSwitcherModal({
  activeProfileId,
  onSelectProfile,
  onClose,
}: ProfileSwitcherModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-switcher-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl rounded-md bg-[#1C1B1B] border border-white/10 p-6 sm:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.85)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile switcher"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#E5E2E1] hover:bg-white/20 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center">
          <ZoraLogo className="mb-6" />
          <h2
            id="profile-switcher-heading"
            className="font-sans text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white"
          >
            Who&apos;s watching?
          </h2>
          <p className="mt-2 text-sm text-[#A3A3A3]">
            Select a viewing profile to load its personalized watchlist and playback history.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROFILES.map((profile) => {
            const isSelected = profile.id === activeProfileId;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  onSelectProfile(profile.id);
                  onClose();
                }}
                aria-pressed={isSelected}
                className={`group relative flex flex-col items-center rounded p-6 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isSelected
                    ? 'bg-[#282828] border border-white/40'
                    : 'bg-[#141414] border border-white/[0.08] hover:bg-[#242424] hover:border-white/20'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#E50914] text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                )}

                <span
                  className={`flex h-20 w-20 items-center justify-center rounded text-2xl font-extrabold tracking-tight text-white transition-transform duration-200 group-hover:scale-105 ${profile.accentBg}`}
                >
                  {profile.initials}
                </span>

                <span className="mt-4 text-base font-semibold text-white">
                  {profile.name}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-[#A3A3A3]">
                  {profile.isKids && (
                    <ShieldCheck className="h-3.5 w-3.5 text-[#46D369]" aria-hidden="true" />
                  )}
                  <span>{profile.role}</span>
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
