'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UtensilsCrossed } from 'lucide-react';

interface RecipeImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function RecipeImage({
  src,
  alt,
  title,
  className = 'object-cover',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: RecipeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F3EAE0] via-[#EFE3D4] to-[#E7D6C3] p-6 text-center"
      >
        <UtensilsCrossed className="h-9 w-9 text-[#9C4A33]" aria-hidden="true" />
        <span className="font-display text-lg font-medium text-[#3B2E27] max-w-[20ch]">
          {title}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
