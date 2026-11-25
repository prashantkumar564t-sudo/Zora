'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Film } from 'lucide-react';
import { getFallbackThumbnail } from '@/lib/catalog';

interface MediaImageProps {
  src: string;
  youtubeId: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function MediaImage({
  src,
  youtubeId,
  alt,
  className = 'object-cover',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: MediaImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [failed, setFailed] = useState<boolean>(false);

  // Sync if prop changes to a different movie
  const [prevPropSrc, setPrevPropSrc] = useState<string>(src);
  if (src !== prevPropSrc) {
    setPrevPropSrc(src);
    setCurrentSrc(src);
    setFailed(false);
  }

  const handleFallback = () => {
    const nextUrl = getFallbackThumbnail(currentSrc, youtubeId);
    if (nextUrl) {
      setCurrentSrc(nextUrl);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#282828] via-[#1F1F1F] to-[#141414] p-4 text-center"
        role="img"
        aria-label={alt}
      >
        <Film className="h-7 w-7 text-[#737373] mb-2" aria-hidden="true" />
        <span className="text-xs font-semibold tracking-wide text-[#A3A3A3] line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      referrerPolicy="no-referrer"
      className={className}
      onError={handleFallback}
      onLoad={(event) => {
        const img = event.currentTarget;
        // YouTube serves a 120x90 gray placeholder with HTTP 200 when maxresdefault does not exist
        if (
          currentSrc.includes('maxresdefault.jpg') &&
          img.naturalWidth > 0 &&
          img.naturalWidth <= 120
        ) {
          handleFallback();
        }
      }}
    />
  );
}
