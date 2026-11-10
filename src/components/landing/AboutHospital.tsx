import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Shield, UserCheck, Clock } from 'lucide-react';
import { useSiteConfig } from '../../context/ConfigContext';

interface AboutHospitalProps {
  onLearnMore?: () => void;
}

export const AboutHospital: React.FC<AboutHospitalProps> = ({ onLearnMore }) => {
  let aboutConfig: any = null;
  let brandingConfig: any = null;
  try {
    const siteConfig = useSiteConfig();
    aboutConfig = siteConfig.landing?.about;
    brandingConfig = siteConfig.branding;
  } catch {}

  const badge = aboutConfig?.badge || 'Patient-Centered PHR Platform';
  const title = aboutConfig?.title || 'About Us';
  const description = aboutConfig?.description || 'MediCare is an advanced digital personal health record (PHR) and caregiver companion platform committed to delivering secure medical record management, emergency SOS accessibility, and seamless doctor sharing with advanced privacy standards and patient-centered technology.';
  const learnMoreText = aboutConfig?.learnMoreText || 'Learn More About Us';
  const imageUrl = aboutConfig?.imageUrl || '/about-us-phr.jpg';
  const secondaryImageUrl = aboutConfig?.secondaryImageUrl || '/about_us_healthcare.jpg';
  const primaryColor = brandingConfig?.primaryColor || '#00a896';

  const defaultIcons = [Building2, Shield, UserCheck, Clock];
  const highlightTitles: string[] = aboutConfig?.highlights && aboutConfig.highlights.length > 0
    ? aboutConfig.highlights
    : [
        'Modern Infrastructure',
        'Advanced Medical Equipment',
        'Experienced Medical Professionals',
        '24/7 Emergency Services',
      ];

  const highlights = highlightTitles.map((t, idx) => ({
    title: t,
    icon: defaultIcons[idx % defaultIcons.length],
  }));

  return (
    <section id="about" className="py-14 sm:py-16 bg-slate-50 dark:bg-[#0f172a] transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div 
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span 
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                {badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                {title}
              </h2>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              {description}
            </p>

            {/* CHECKLIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${primaryColor}20`,
                        color: primaryColor,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-4">
              <button
                onClick={onLearnMore}
                style={{ backgroundColor: primaryColor }}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-98 gap-2 cursor-pointer hover:opacity-90"
              >
                <span>{learnMoreText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT HOSPITAL BUILDING MEDIA */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                <img 
                  src={imageUrl} 
                  alt={title}
                  className="w-full h-[360px] sm:h-[420px] object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-700"
                  onError={(e: any) => {
                    e.currentTarget.src = '/about-us-phr.jpg';
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

                {/* SECONDARY THUMBNAIL CHIP */}
                {secondaryImageUrl && (
                  <div className="absolute top-4 right-4 z-10 hidden sm:block">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/80 dark:border-slate-700 shadow-lg">
                      <img
                        src={secondaryImageUrl}
                        alt="Facility"
                        className="w-full h-full object-cover"
                        onError={(e: any) => { e.currentTarget.src = '/about_us_healthcare.jpg'; }}
                      />
                    </div>
                  </div>
                )}

                {/* OVERLAY BADGE */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-700 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{brandingConfig?.appName || 'MediCare Health Network'}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Connected Digital Health Ecosystem</p>
                    </div>
                    <span 
                      className="px-3 py-1 text-xs font-bold text-white rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Secure & Private
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
