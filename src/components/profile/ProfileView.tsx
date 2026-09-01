import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ProfileHeader } from './ProfileHeader';
import { PatientIdentityCard } from './PatientIdentityCard';
import { ProfileHealthScoreCard } from './ProfileHealthScoreCard';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { PersonalInfoCard } from './PersonalInfoCard';
import { HealthOverviewGrid } from './HealthOverviewGrid';
import { BMIVisualizerCard } from './BMIVisualizerCard';
import { AllergiesSection } from './AllergiesSection';
import { ChronicConditionsSection } from './ChronicConditionsSection';
import { SurgeriesSection } from './SurgeriesSection';
import { CurrentMedicinesSection } from './CurrentMedicinesSection';
import { LifestyleWellnessGrid } from './LifestyleWellnessGrid';
import { EmergencyInfoCard } from './EmergencyInfoCard';
import { PrivacyControlsCard } from './PrivacyControlsCard';
import { EditProfileDrawer } from './EditProfileDrawer';
import type { ProfileFormData } from './EditProfileDrawer';
import { ProfileSkeleton } from './ProfileSkeleton';
import { QRModal } from '../dashboard/QRModal';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface ProfileViewProps {
  user?: UserProfile;
  onNavigate: (id: string) => void;
  onOpenEmergencyModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onNavigate
}) => {
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  // Profile Form Data state initialized with user prop or defaults
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Samson L.',
    dob: '15 March 1994',
    age: user?.age || 32,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: user?.email || 'samson.l@abdm.in',
    location: 'Chennai, India',
    bloodGroup: user?.bloodGroup || 'O+',
    height: '174 cm',
    weight: '72 kg',
    patientId: user?.abhaId || 'HR-2026-00124'
  });

  // Sync profileData with user prop if user prop changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        bloodGroup: user.bloodGroup || prev.bloodGroup,
        age: user.age || prev.age,
        patientId: user.abhaId || prev.patientId
      }));
    }
  }, [user]);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_profile_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfileData(prev => ({
          ...prev,
          ...parsed,
          name: user?.name || parsed.name || prev.name
        }));
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (newData: ProfileFormData) => {
    setProfileData(newData);
    localStorage.setItem('user_profile_data', JSON.stringify(newData));
    showToast('✓ Profile updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#00a896] text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* 1. HEADER */}
          <ProfileHeader
            onOpenEditDrawer={() => setEditDrawerOpen(true)}
            lastUpdated="Today, 10:42 AM"
          />

          {/* 2. IDENTITY CARD & HEALTH SCORE GRID */}
          <section className="flex flex-col xl:flex-row gap-6 items-stretch">
            <div className="flex-[2] min-w-0">
              <PatientIdentityCard
                name={profileData.name}
                age={profileData.age}
                gender={profileData.gender}
                patientId={profileData.patientId}
                bloodGroup={profileData.bloodGroup}
                onOpenQR={() => setQrModalOpen(true)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <ProfileHealthScoreCard onNavigate={onNavigate} />
            </div>

            <div className="flex-1 min-w-0">
              <ProfileCompletionCard
                onOpenEdit={() => setEditDrawerOpen(true)}
                onOpenAllergy={() => showToast('Scroll down to Allergies section to add info')}
              />
            </div>
          </section>

          {/* 3 & 4. PERSONAL INFO & HEALTH OVERVIEW */}
          <section className="flex flex-col xl:flex-row gap-6 items-stretch">
            <div className="flex-1 min-w-0 flex flex-col">
              <PersonalInfoCard
                name={profileData.name}
                dob={profileData.dob}
                age={profileData.age}
                gender={profileData.gender}
                phone={profileData.phone}
                email={profileData.email}
                location={profileData.location}
                onOpenEdit={() => setEditDrawerOpen(true)}
              />
            </div>

            <div className="flex-[1.2] min-w-0 flex flex-col">
              <HealthOverviewGrid
                bloodGroup={profileData.bloodGroup}
                height={profileData.height}
                weight={profileData.weight}
              />
            </div>
          </section>
          <BMIVisualizerCard bmi={23.8} />

          {/* 5. ALLERGIES & CHRONIC CONDITIONS GRID */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllergiesSection onToast={showToast} />
            <ChronicConditionsSection onToast={showToast} />
          </section>

          {/* 6. SURGERIES & MEDICATIONS GRID */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SurgeriesSection onToast={showToast} />
            <CurrentMedicinesSection onNavigate={onNavigate} />
          </section>

          {/* 7. LIFESTYLE & WELLNESS */}
          <LifestyleWellnessGrid />

          {/* 8. EMERGENCY INFORMATION */}
          <EmergencyInfoCard onToast={showToast} />

          {/* 9. PRIVACY CONTROLS */}
          <PrivacyControlsCard onToast={showToast} />
        </motion.div>
      )}

      {/* HEALTH ID QR MODAL */}
      <QRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        abhaId={profileData.patientId}
        userName={profileData.name}
      />

      {/* EDIT PROFILE SLIDE-IN DRAWER */}
      <EditProfileDrawer
        isOpen={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        initialData={profileData}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
