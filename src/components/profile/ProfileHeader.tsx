import React from 'react';
import { Edit3, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { useLanguage } from '../../context/LanguageContext';

interface ProfileHeaderProps {
  onOpenEditDrawer: () => void;
  lastUpdated?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onOpenEditDrawer,
  lastUpdated = 'Today, 10:42 AM'
}) => {
  const { t } = useLanguage();

  return (
    <PageHeader
      title={t('nav.profile', 'My Health Profile')}
      subtitle={`${t('profile.header_subtitle', 'Manage your personal and health information in one secure place.')} • ${t('profile.last_updated', 'Last updated')}: ${lastUpdated}`}
      badgeText={t('profile.badge_encrypted', 'Encrypted ABDM Profile')}
      badgeIcon={<ShieldCheck className="w-3.5 h-3.5" />}
      rightElement={
        <button
          onClick={onOpenEditDrawer}
          className="px-5 py-2.5 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span>{t('profile.edit', 'Edit Profile')}</span>
        </button>
      }
    />
  );
};

