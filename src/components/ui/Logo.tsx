import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { useSiteConfig } from '../../context/ConfigContext';

interface LogoProps {
  className?: string;
  showBadge?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showBadge = false, variant = 'auto' }) => {
  let brandingConfig: any = null;
  try {
    const siteConfig = useSiteConfig();
    brandingConfig = siteConfig.branding;
  } catch {
    // If rendered outside ConfigProvider, fallback
  }

  const [imageError, setImageError] = useState(false);

  const logo = brandingConfig?.logoUrl ?? null;
  const hospitalName = brandingConfig?.appName ?? 'MediCare Digital Health Record';
  const primaryColor = brandingConfig?.primaryColor ?? '#00a896';

  const mediTextColor = variant === 'dark' 
    ? 'text-white' 
    : variant === 'light' 
    ? 'text-slate-900' 
    : 'text-slate-900 dark:text-white';

  const subtextColor = variant === 'dark' 
    ? 'text-slate-400' 
    : 'text-slate-500 dark:text-slate-400';

  const fullLogoSrc = logo && !imageError
    ? (logo.startsWith('http') ? logo : `http://localhost:5000${logo}`) 
    : null;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        {fullLogoSrc ? (
          <img
            src={fullLogoSrc}
            alt={hospitalName}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Activity className="w-6 h-6 stroke-[2.5]" />
        )}
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold text-xl tracking-tight leading-none ${mediTextColor}`}>
            Medi<span style={{ color: primaryColor }}>Care</span>
          </span>
          {showBadge && (
            <span 
              className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-full uppercase border"
              style={{
                color: primaryColor,
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}30`,
              }}
            >
              ABDM Ready
            </span>
          )}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 truncate max-w-[200px] ${subtextColor}`}>
          {hospitalName}
        </span>
      </div>
    </div>
  );
};
