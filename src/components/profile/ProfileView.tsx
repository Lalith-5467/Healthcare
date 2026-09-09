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

  const resolvePatientName = (u?: any, dbName?: string): string => {
    if (dbName && dbName.trim() && !dbName.includes('Pharmacist') && !dbName.includes('R.Ph') && !dbName.includes('Suresh Nair')) {
      return dbName.trim();
    }
    try {
      const custom = localStorage.getItem('patient_user_name');
      if (custom && custom.trim() && !custom.includes('Pharmacist') && !custom.includes('R.Ph') && !custom.includes('Suresh Nair')) {
        return custom.trim();
      }
      const prof = localStorage.getItem('user_profile_data');
      if (prof) {
        const parsed = JSON.parse(prof);
        if (parsed?.name && !parsed.name.includes('Pharmacist') && !parsed.name.includes('R.Ph') && !parsed.name.includes('Suresh Nair') && parsed.name !== 'Patient') {
          return parsed.name.trim();
        }
      }
      const appUser = localStorage.getItem('app_user');
      if (appUser) {
        const parsed = JSON.parse(appUser);
        if (parsed?.name && !parsed.name.includes('Pharmacist') && !parsed.name.includes('R.Ph') && !parsed.name.includes('Suresh Nair') && parsed.name !== 'Patient') {
          return parsed.name.trim();
        }
      }
    } catch {}

    if (u?.name && u.name !== 'Patient' && !u.name.includes('Pharmacist') && !u.name.includes('R.Ph') && !u.name.includes('Suresh Nair')) {
      return u.name.trim();
    }

    return 'Lalith Velarasi';
  };

  // Profile Form Data state initialized with user prop or session data
  const [profileData, setProfileData] = useState({
    name: resolvePatientName(user),
    dob: (user as any)?.dateOfBirth ? new Date((user as any).dateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '15 March 1994',
    age: user?.age || 30,
    gender: (user as any)?.gender || 'Male',
    phone: (user as any)?.phone || '+91 98765 43210',
    email: user?.email || '',
    location: (user as any)?.address || 'Chennai, India',
    bloodGroup: user?.bloodGroup || 'O+',
    height: (user as any)?.heightCm ? `${(user as any).heightCm} cm` : '174 cm',
    weight: '72 kg',
    patientId: user?.abhaId || 'HR-2026-00124'
  });

  // Fetch real patient profile from backend and sync with current user
  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        const { apiClient } = await import('../../services/apiClient');
        const res = await apiClient.get<any>('/profile/patient');
        if (res && res.data && isMounted) {
          const p = res.data;
          const formattedDob = p.dateOfBirth
            ? new Date(p.dateOfBirth).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
            : '15 March 1994';
          const calculatedAge = p.dateOfBirth
            ? Math.max(1, new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear())
            : (user?.age || 30);

          setProfileData(prev => ({
            ...prev,
            name: resolvePatientName(user, p.fullName),
            dob: formattedDob,
            age: calculatedAge,
            gender: p.gender || prev.gender,
            phone: p.emergencyContactPhone || p.familyPhone || (user as any)?.phone || prev.phone,
            email: user?.email || prev.email,
            location: p.address || prev.location,
            bloodGroup: p.bloodGroup || user?.bloodGroup || prev.bloodGroup,
            height: p.heightCm ? `${p.heightCm} cm` : prev.height,
            patientId: user?.abhaId || p.id || prev.patientId
          }));
        }
      } catch {
        // Fallback to local user prop
        if (user && isMounted) {
          setProfileData(prev => ({
            ...prev,
            name: resolvePatientName(user),
            email: user.email || prev.email,
            bloodGroup: user.bloodGroup || prev.bloodGroup,
            age: user.age || prev.age,
            patientId: user.abhaId || prev.patientId
          }));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Sync profileData when user prop updates
  useEffect(() => {
    if (user?.name) {
      setProfileData(prev => ({
        ...prev,
        name: user.name,
        email: user.email || prev.email,
        bloodGroup: user.bloodGroup || prev.bloodGroup,
        age: user.age || prev.age,
        patientId: user.abhaId || prev.patientId
      }));
    }
  }, [user?.name, user?.email, user?.bloodGroup, user?.age, user?.abhaId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = async (newData: ProfileFormData) => {
    setProfileData(newData);
    
    // Save locally
    try {
      localStorage.setItem('user_profile_data', JSON.stringify(newData));
      if (user?.email) {
        localStorage.setItem(`user_profile_data_${user.email}`, JSON.stringify(newData));
      }

      // Update app_user in localStorage
      const appUserStr = localStorage.getItem('app_user');
      if (appUserStr) {
        const appUser = JSON.parse(appUserStr);
        appUser.name = newData.name;
        appUser.bloodGroup = newData.bloodGroup;
        localStorage.setItem('app_user', JSON.stringify(appUser));
        window.dispatchEvent(new Event('app_user_updated'));
      }
    } catch (e) {
      console.error(e);
    }

    // Persist to backend database
    try {
      const { apiClient } = await import('../../services/apiClient');
      await apiClient.put('/profile/patient', {
        fullName: newData.name,
        gender: newData.gender,
        bloodGroup: newData.bloodGroup,
        address: newData.location,
        emergencyContactPhone: newData.phone,
      });
    } catch (backendErr) {
      console.warn('Backend profile update note:', backendErr);
    }

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
