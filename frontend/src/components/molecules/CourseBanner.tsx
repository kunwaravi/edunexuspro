import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { resolveCourseBanner } from '../../api';

interface CourseBannerProps {
  /** Course.banner path/URL from the catalog API (may be null). */
  banner?: string | null;
  /** Accessible image description. */
  alt: string;
  /** Category-based fallback visual — used when no banner is configured OR the
   *  image fails to load, so every card keeps a clean subject-aware header. */
  fallbackColor?: string;
  fallbackIcon?: LucideIcon;
  /** Tailwind aspect-ratio class for the banner band. */
  aspectClass?: string;
}

/**
 * TASK 6 — course-specific banner band for catalog cards. Renders the course
 * banner from the API with object-cover + lazy loading. Falls back to a
 * category-based gradient visual (icon + accent) when there is no banner or the
 * image is broken/missing — graceful and self-contained.
 */
const CourseBanner: React.FC<CourseBannerProps> = ({
  banner,
  alt,
  fallbackColor = 'from-blue-500 to-blue-700',
  fallbackIcon: FallbackIcon,
  aspectClass = 'aspect-[16/9]',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const resolved = resolveCourseBanner(banner);
  const showImage = resolved && !imgFailed;

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden bg-slate-950/60`}>
      {showImage ? (
        <img
          src={resolved!}
          alt={alt}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackColor || 'from-blue-500 to-blue-700'} flex items-center justify-center`}>
          {FallbackIcon && (
            <div className="text-white/85 drop-shadow-lg">
              <FallbackIcon size={44} strokeWidth={1.5} />
            </div>
          )}
        </div>
      )}

      {/* legibility gradient at the bottom of the banner */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

      {!showImage && (
        <div className="absolute bottom-2 right-2 text-slate-400/80" aria-hidden="true">
          <ImageOff size={14} />
        </div>
      )}
    </div>
  );
};

export default CourseBanner;
