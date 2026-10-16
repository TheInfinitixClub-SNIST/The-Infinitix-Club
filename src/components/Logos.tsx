import React from 'react';

/**
 * SNIST (Sreenidhi Institute of Science and Technology) Logo Mark
 */
export const SnistLogo: React.FC<{ className?: string; showText?: boolean }> = ({
  className = '',
  showText = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official SNIST Logo from /public/SNIST.png */}
      <img
        src="/SNIST.png"
        alt="SNIST"
        className="h-8 sm:h-9 w-auto object-contain rounded-lg sm:rounded-xl shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-transform duration-200 group-hover:scale-105"
        loading="eager"
      />

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className="text-xs font-bold tracking-wider text-white">
            SNIST
          </span>
          <span className="text-[9px] font-medium tracking-tight text-amber-300/90 uppercase">
            Sreenidhi
          </span>
        </div>
      )}
    </div>
  );
};

import infinitixLogoImg from '../assets/images/infinitix_logo.png';

/**
 * Official Infinitix Club Logo
 * Kept exactly as provided by the user ("do not redesign it, just keep it as it is").
 */
export const InfinitixEmblem: React.FC<{ className?: string; alt?: string }> = ({
  className = 'w-14 h-7',
  alt = 'THE INFINITIX CLUB',
}) => {
  return (
    <img
      src={infinitixLogoImg}
      alt={alt}
      className={`${className} object-contain shrink-0`}
      loading="eager"
    />
  );
};

/**
 * Official Infinitix Club Logo Component
 * Combines the authentic logo with the club title
 */
export const InfinitixLogo: React.FC<{
  className?: string;
  showText?: boolean;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'stacked';
}> = ({
  className = '',
  showText = false,
  showSubtitle = false,
  size = 'sm',
  layout = 'horizontal',
}) => {
  const emblemSize =
    size === 'lg'
      ? 'w-24 h-12'
      : size === 'md'
      ? 'w-18 h-9'
      : 'w-12 h-6';

  const titleSize =
    size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'md'
      ? 'text-lg sm:text-xl'
      : 'text-xs sm:text-sm';

  const subSize =
    size === 'lg'
      ? 'text-xs'
      : size === 'md'
      ? 'text-[11px]'
      : 'text-[9px]';

  return (
    <div
      className={`flex ${
        layout === 'stacked' ? 'flex-col items-center text-center' : 'items-center text-left'
      } gap-2.5 select-none ${className}`}
    >
      <InfinitixEmblem className={emblemSize} />

      {showText && (
        <div className={`flex flex-col ${layout === 'stacked' ? 'items-center text-center' : 'items-start text-left'} leading-tight`}>
          <span
            className={`${titleSize} font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]`}
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            THE INFINITIX CLUB
          </span>

          {showSubtitle && (
            <span
              className={`${subSize} font-medium tracking-wide text-slate-300/90 italic mt-0.5`}
            >
              Ingiting data into insights....
            </span>
          )}
        </div>
      )}
    </div>
  );
};
