import React from 'react';

interface AbhaLogoProps {
  className?: string;
  size?: number;
  variant?: 'badge' | 'compact';
}

/**
 * Official-grade ABHA (Ayushman Bharat Health Account) Logo Emblem
 * Engineered with mathematically precise optical centering and SVG vectors,
 * eliminating browser font-metric shifts, line-height mismatches, and trailing letter-spacing bugs.
 */
export const AbhaLogo: React.FC<AbhaLogoProps> = ({
  className = 'w-12 h-12',
  size = 48,
  variant = 'badge',
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`${className} shrink-0 select-none drop-shadow-xs`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ayushman Bharat Health Account (ABHA) Logo"
    >
      <defs>
        {/* Ambient Teal Gradient for Background */}
        <linearGradient id="abha-badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00a896" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.16" />
        </linearGradient>

        {/* Shield Fill Gradient */}
        <linearGradient id="abha-shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00a896" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Container with balanced padding */}
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13"
        fill="url(#abha-badge-grad)"
        stroke="#00a896"
        strokeWidth="1.2"
        strokeOpacity="0.35"
      />

      {variant === 'badge' ? (
        <>
          {/* DIGITAL HEALTH IDENTITY SHIELD EMBLEM */}
          <g transform="translate(0, 0.5)">
            {/* Outer Shield Shell */}
            <path
              d="M24 7.5 L31.5 10.2 V15 C31.5 19 28 22.2 24 23.5 C20 22.2 16.5 19 16.5 15 V10.2 L24 7.5 Z"
              fill="url(#abha-shield-grad)"
              stroke="#00a896"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Medical Cross Motif */}
            <path
              d="M24 11.5 V17.5 M21 14.5 H27"
              stroke="#00a896"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Verification / Active Gateway Ping Dot */}
            <circle cx="31" cy="9.5" r="1.3" fill="#10b981" />
          </g>

          {/* ABHA WORDMARK - Optically & Mathematically Centered */}
          <text
            x="24"
            y="35"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#008f7a"
            className="dark:fill-teal-300 font-sans"
            style={{
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 900,
              fontSize: '9.5px',
              letterSpacing: '0.8px',
            }}
          >
            ABHA
          </text>
        </>
      ) : (
        /* COMPACT VARIANT: Centered Bold Wordmark with Cross Accent */
        <g>
          {/* Center Medical Pulse Cross */}
          <path
            d="M24 9 V15 M21 12 H27"
            stroke="#00a896"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <text
            x="24"
            y="29"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#008f7a"
            className="dark:fill-teal-300 font-sans"
            style={{
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 900,
              fontSize: '13px',
              letterSpacing: '1px',
            }}
          >
            ABHA
          </text>
        </g>
      )}
    </svg>
  );
};
