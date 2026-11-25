'use client';

import React from 'react';

interface ZoraLogoProps {
  className?: string;
}

export default function ZoraLogo({ className = '' }: ZoraLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="0.5"
          y="0.5"
          width="35"
          height="35"
          rx="7.5"
          fill="#1A1A1A"
          stroke="rgba(255,255,255,0.12)"
        />
        {/* Crimson Z play mark */}
        <path
          d="M9.5 10H26.5L16.2 21.6H26.5V26H9.5L19.8 14.4H9.5V10Z"
          fill="#E50914"
        />
        <polygon points="22.8,15.4 27.6,18 22.8,20.6" fill="#E50914" />
      </svg>
      <span className="font-sans text-xl font-extrabold tracking-[0.26em] text-white whitespace-nowrap leading-none">
        ZORA
      </span>
    </span>
  );
}
