import React from 'react';
import { Edit3, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';

interface ProfileHeaderProps {
  onOpenEditDrawer: () => void;
  lastUpdated?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onOpenEditDrawer,
  lastUpdated = 'Today, 10:42 AM'
}) => {
  return (
    <PageHeader
      title="My Health Profile"
      subtitle={`Manage your personal and health information in one secure place. • Last updated: ${lastUpdated}`}
      badgeText="Encrypted ABDM Profile"
      badgeIcon={<ShieldCheck className="w-3.5 h-3.5" />}
      rightElement={
        <button
          onClick={onOpenEditDrawer}
          className="px-5 py-2.5 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      }
    />
  );
};
