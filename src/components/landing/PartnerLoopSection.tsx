import React from 'react';
import { LogoLoop } from '../ui/LogoLoop';
import type { LogoItem } from '../ui/LogoLoop';

export const PartnerLoopSection: React.FC = () => {
  const brandLogos: LogoItem[] = [
    // 1. APPLE (Apple Health)
    {
      title: 'Apple Health',
      ariaLabel: 'Apple Health',
      node: (
        <svg
          viewBox="0 0 170 170"
          className="w-9 h-9 fill-slate-800 dark:fill-slate-100 hover:fill-black dark:hover:fill-white transition-colors"
        >
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.68-11.19-20.76-14.67-33.24-3.48-12.48-5.22-24.16-5.22-35.04 0-14.89 3.81-27.12 11.44-36.68 7.62-9.57 17.2-14.46 28.72-14.68 4.78 0 10.11 1.25 15.98 3.76 5.87 2.5 9.78 3.76 11.73 3.76 1.74 0 5.82-1.36 12.24-4.08 6.42-2.72 11.91-3.92 16.48-3.62 12.61.65 22.84 5.38 30.69 14.19-11.09 6.74-16.53 15.93-16.31 27.56.22 9.13 3.75 16.85 10.6 23.16 6.85 6.31 15.01 10.05 24.47 11.22-2.39 7.4-5.33 14.8-8.81 22.2zM119.22 33.64c0-7.39 2.66-14.46 7.98-21.2C132.52 5.7 139.05 1.57 146.8.05c.87 7.82-1.74 15.11-7.83 21.87-6.09 6.74-12.66 10.65-19.75 11.72z" />
        </svg>
      ),
    },

    // 2. GOOGLE (Google Health)
    {
      title: 'Google Health',
      ariaLabel: 'Google Health',
      node: (
        <svg viewBox="0 0 24 24" className="w-9 h-9">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.4 7.34 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.6 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      ),
    },

    // 3. MICROSOFT (Microsoft Cloud for Healthcare)
    {
      title: 'Microsoft Healthcare',
      ariaLabel: 'Microsoft Healthcare',
      node: (
        <svg viewBox="0 0 24 24" className="w-9 h-9">
          <rect x="1" y="1" width="10" height="10" fill="#F25022" rx="1.5" />
          <rect x="13" y="1" width="10" height="10" fill="#7FBA00" rx="1.5" />
          <rect x="1" y="13" width="10" height="10" fill="#00A4EF" rx="1.5" />
          <rect x="13" y="13" width="10" height="10" fill="#FFB900" rx="1.5" />
        </svg>
      ),
    },

    // 4. AMAZON (AWS Healthcare / Amazon Pharmacy)
    {
      title: 'Amazon Healthcare',
      ariaLabel: 'Amazon Healthcare',
      node: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#FF9900]">
          <path d="M13.91 13.43c-.76.62-1.77.98-2.73.98-1.54 0-2.3-.87-2.3-2.22 0-1.89 1.48-2.92 4.09-2.92.36 0 .68.02.94.07v4.09zm2.4-7.58c-.37-.09-.94-.14-1.57-.14-2.21 0-3.95.83-4.66 2.22l-.12-.01c-.13-.74-.82-1.31-1.63-1.31-.96 0-1.74.78-1.74 1.74 0 .22.04.42.12.61C4.4 9.77 3 11.96 3 14.5c0 3.59 2.91 6.5 6.5 6.5 2.12 0 4.01-1.02 5.19-2.58l.12.01c.13.74.82 1.31 1.63 1.31.96 0 1.74-.78 1.74-1.74 0-.22-.04-.42-.12-.61 2.31-.81 3.94-3.02 3.94-5.64 0-3.17-2.58-5.75-5.75-5.75-.05 0-.09 0-.14.01z" />
          <path d="M2.5 17.5c4.7 3.5 11.3 3.5 16 0 .4-.3.9.1.6.5-5.1 4-12.1 4-17.2 0-.4-.4.1-.8.6-.5z" />
        </svg>
      ),
    },

    // 5. RED CROSS (International Healthcare Emblem)
    {
      title: 'Red Cross',
      ariaLabel: 'Red Cross',
      node: (
        <svg viewBox="0 0 24 24" className="w-9 h-9">
          <circle cx="12" cy="12" r="11" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
          <path fill="#DC2626" d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z" />
        </svg>
      ),
    },

    // 6. META (Meta Health & PyTorch Health)
    {
      title: 'Meta Health',
      ariaLabel: 'Meta Health',
      node: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#0081FB]">
          <path d="M12 4.5c-3.14 0-5.74 2.21-6.52 5.2-.66 2.53.07 5.17 1.83 6.94C8.95 18.28 11.23 19 13.5 19c2.3 0 4.47-.73 6.19-2.36 1.76-1.77 2.49-4.41 1.83-6.94C20.74 6.71 18.14 4.5 15 4.5c-1.22 0-2.38.37-3.34 1.04C10.7 4.87 9.54 4.5 8.32 4.5H12zm0 2.25c.98 0 1.91.35 2.64.98.24.21.46.44.66.7-.49.49-1.04.9-1.63 1.22-.52-.57-1.12-1.03-1.78-1.35.04-.52.07-1.04.11-1.55zm-3.68 0c.04.51.07 1.03.11 1.55-.66.32-1.26.78-1.78 1.35-.59-.32-1.14-.73-1.63-1.22.2-.26.42-.49.66-.7.73-.63 1.66-.98 2.64-.98z" />
        </svg>
      ),
    },

    // 7. IBM (IBM Watson Health)
    {
      title: 'IBM Watson Health',
      ariaLabel: 'IBM Watson Health',
      node: (
        <svg viewBox="0 0 24 24" className="w-11 h-11 fill-[#0F62FE]">
          <path d="M2 5h4v1.5H2zm0 3h4v1.5H2zm0 3h4v1.5H2zm0 3h4v1.5H2zm0 3h4v1.5H2zm6-12h4v1.5H8zm0 3h4v1.5H8zm0 3h4v1.5H8zm0 3h4v1.5H8zm0 3h4v1.5H8zm6-12h8v1.5h-8zm0 3h8v1.5h-8zm0 3h8v1.5h-8zm0 3h8v1.5h-8zm0 3h8v1.5h-8z" />
        </svg>
      ),
    },

    // 8. INTEL (Intel Health Technologies)
    {
      title: 'Intel Health',
      ariaLabel: 'Intel Health',
      node: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#0071C5]">
          <path d="M7.74 8.79h2.36v7.42H7.74zm3.93 0h2.32v1.22c.6-.9 1.67-1.38 2.76-1.38 2.15 0 3.73 1.57 3.73 4.14 0 2.6-1.58 4.2-3.73 4.2-1.09 0-2.16-.48-2.76-1.38v1.22h-2.32V8.79zm6.45 3.98c0-1.45-.87-2.36-2.07-2.36-1.2 0-2.07.91-2.07 2.36 0 1.45.87 2.36 2.07 2.36 1.2 0 2.07-.91 2.07-2.36zM7.74 5.79h2.36v1.8H7.74z" />
        </svg>
      ),
    },

    // 9. PHILIPS (Philips Healthcare)
    {
      title: 'Philips Healthcare',
      ariaLabel: 'Philips Healthcare',
      node: (
        <svg viewBox="0 0 24 24" className="w-9 h-9">
          <circle cx="12" cy="12" r="11" fill="#0B5FFF" />
          <path
            fill="#ffffff"
            d="M12 4a8 8 0 100 16 8 8 0 000-16zm-1 3.5h2v3.2c1.2.2 2.1 1.1 2.3 2.3H12v2h3.3c-.2 1.2-1.1 2.1-2.3 2.3V20h-2v-2.7c-1.2-.2-2.1-1.1-2.3-2.3H11v-2H7.7c.2-1.2 1.1-2.1 2.3-2.3V7.5z"
          />
        </svg>
      ),
    },

    // 10. SIEMENS (Siemens Healthineers)
    {
      title: 'Siemens Healthineers',
      ariaLabel: 'Siemens Healthineers',
      node: (
        <svg viewBox="0 0 24 24" className="w-9 h-9">
          <rect width="24" height="24" rx="6" fill="#EB780A" />
          <path
            fill="#ffffff"
            d="M6 8.5c0-1.4 1.1-2.5 2.5-2.5h7c1.4 0 2.5 1.1 2.5 2.5v1c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-.5H9v2h6c1.7 0 3 1.3 3 3v1c0 1.4-1.1 2.5-2.5 2.5h-7C7.1 17.5 6 16.4 6 15v-1c0-.8.7-1.5 1.5-1.5S9 13.2 9 14v.5h6v-2H9c-1.7 0-3-1.3-3-3v-1z"
          />
        </svg>
      ),
    },

    // 11. PFIZER (Pfizer Bio-Pharma)
    {
      title: 'Pfizer Bio-Pharma',
      ariaLabel: 'Pfizer Bio-Pharma',
      node: (
        <svg viewBox="0 0 24 24" className="w-9 h-9">
          <ellipse cx="12" cy="12" rx="10" ry="8" fill="#0000EB" />
          <path
            fill="#ffffff"
            d="M8.5 7.5h4c1.7 0 3 1.1 3 2.6s-1.3 2.6-3 2.6H10.5v3.8H8.5V7.5zm2 3.4h1.8c.6 0 1.2-.4 1.2-1s-.6-1-1.2-1h-1.8v2z"
          />
        </svg>
      ),
    },

    // 12. JOHNSON & JOHNSON (J&J Innovative Medicine)
    {
      title: 'Johnson & Johnson',
      ariaLabel: 'Johnson & Johnson',
      node: (
        <svg viewBox="0 0 24 24" className="w-9 h-9">
          <rect width="24" height="24" rx="6" fill="#D51900" />
          <path
            fill="#ffffff"
            d="M7 15c0 1.7 1.3 3 3 3s3-1.3 3-3V7h-2v8c0 .6-.4 1-1 1s-1-.4-1-1v-2H7v2zm8-8h2v10h-2V7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-10 sm:py-12 bg-white dark:bg-[#0b1120] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden">
      {/* REACT BITS LOGOLOOP WITH OFFICIAL BRAND LOGOS */}
      <div className="relative py-2">
        <LogoLoop
          logos={brandLogos}
          speed={55}
          direction="left"
          gap={48}
          logoHeight={38}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Global healthcare and technology logos"
        />
      </div>
    </section>
  );
};
