import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Building2,
  Users,
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type {
  EmergencyContactItem,
  EmergencyMedicalInfo,
  EmergencyServiceItem,
  EmergencyActivityItem,
  EmergencyPreferencesState
} from './emergencyData';
import {
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_MEDICAL_INFO,
  EMERGENCY_SERVICES,
  INITIAL_EMERGENCY_HISTORY,
  DEFAULT_EMERGENCY_PREFERENCES
} from './emergencyData';
import { EmergencyHeaderStatus } from './EmergencyHeaderStatus';
import { PrimarySOSCard } from './PrimarySOSCard';
import { SOSConfirmationModal } from './SOSConfirmationModal';
import { SOSCountdownOverlay } from './SOSCountdownOverlay';
import { SOSActivatedState } from './SOSActivatedState';
import { EmergencyServicesSection } from './EmergencyServicesSection';
import { CallConfirmationModal } from './CallConfirmationModal';
import { EmergencyContactsSection } from './EmergencyContactsSection';
import { AddEditContactModal } from './AddEditContactModal';
import { RemoveContactModal } from './RemoveContactModal';
import { EmergencyMedicalIDCard } from './EmergencyMedicalIDCard';
import { FullMedicalIDModal } from './FullMedicalIDModal';
import { EditMedicalInfoModal } from './EditMedicalInfoModal';
import { EmergencyLocationSection } from './EmergencyLocationSection';
import { EmergencyPreferencesModal } from './EmergencyPreferencesModal';
import { EmergencyHistorySection } from './EmergencyHistorySection';
import { TestEmergencyModal } from './TestEmergencyModal';
import { EmergencyReadinessCard } from './EmergencyReadinessCard';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface EmergencyViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const EmergencyView: React.FC<EmergencyViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MAIN STATE
  const [contacts, setContacts] = useState<EmergencyContactItem[]>(INITIAL_EMERGENCY_CONTACTS);
  const [medicalInfo, setMedicalInfo] = useState<EmergencyMedicalInfo>(INITIAL_MEDICAL_INFO);
  const [history, setHistory] = useState<EmergencyActivityItem[]>(INITIAL_EMERGENCY_HISTORY);
  const [preferences, setPreferences] = useState<EmergencyPreferencesState>(DEFAULT_EMERGENCY_PREFERENCES);
  const [locationName, setLocationName] = useState('Selaiyur, Chennai (12.9090° N, 80.1425° E)');
  const [hasTested, setHasTested] = useState(false);

  // SOS SEQUENCING STATE
  const [sosConfirmationOpen, setSosConfirmationOpen] = useState(false);
  const [sosCountdownActive, setSosCountdownActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);
  const [sosActivated, setSosActivated] = useState(false);

  // MODALS & DRAWERS
  const [callTarget, setCallTarget] = useState<EmergencyServiceItem | null>(null);
  const [addEditContactTarget, setAddEditContactTarget] = useState<EmergencyContactItem | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [removeContactTarget, setRemoveContactTarget] = useState<EmergencyContactItem | null>(null);
  const [fullIDModalOpen, setFullIDModalOpen] = useState(false);
  const [editMedicalInfoOpen, setEditMedicalInfoOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [shareIDModalOpen, setShareIDModalOpen] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('user_emergency_contacts');
    if (savedContacts) {
      try { setContacts(JSON.parse(savedContacts)); } catch (e) { console.error(e); }
    }
    const savedMedical = localStorage.getItem('user_emergency_medical_info');
    if (savedMedical) {
      try { setMedicalInfo(JSON.parse(savedMedical)); } catch (e) { console.error(e); }
    }
  }, []);

  // Countdown Interval logic
  useEffect(() => {
    let timer: any = null;
    if (sosCountdownActive && sosCountdown > 0) {
      timer = setInterval(() => {
        setSosCountdown((prev) => prev - 1);
      }, 1000);
    } else if (sosCountdownActive && sosCountdown === 0) {
      setSosCountdownActive(false);
      setSosActivated(true);
      showToast('🚨 Simulated SOS Emergency Alert Activated');
    }
    return () => clearInterval(timer);
  }, [sosCountdownActive, sosCountdown]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartSOS = () => {
    setSosConfirmationOpen(true);
  };

  const handleConfirmSOSContinue = () => {
    setSosConfirmationOpen(false);
    setSosCountdown(preferences.countdownSeconds);
    setSosCountdownActive(true);
  };

  const handleCancelSOSCountdown = () => {
    setSosCountdownActive(false);
    showToast('✓ SOS Countdown Cancelled');
  };

  const handleCancelSOSActivated = () => {
    setSosActivated(false);
    showToast('✓ SOS Simulation Deactivated');
  };

  const handleSaveContact = (contact: EmergencyContactItem) => {
    let updated = [...contacts];
    if (contact.priority === 'Primary') {
      updated = updated.map((c) => ({
        ...c,
        priority: c.priority === 'Primary' ? 'Secondary' : c.priority
      }));
    }
    const existingIdx = updated.findIndex((c) => c.id === contact.id);
    if (existingIdx >= 0) {
      updated[existingIdx] = contact;
    } else {
      updated.push(contact);
    }
    setContacts(updated);
    localStorage.setItem('user_emergency_contacts', JSON.stringify(updated));
    showToast(`✓ Contact ${contact.name} saved successfully`);
  };

  const handleRemoveContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    localStorage.setItem('user_emergency_contacts', JSON.stringify(updated));
    showToast('✓ Contact removed from emergency list');
  };

  const handleSaveMedicalInfo = (updatedInfo: EmergencyMedicalInfo) => {
    setMedicalInfo(updatedInfo);
    localStorage.setItem('user_emergency_medical_info', JSON.stringify(updatedInfo));
    showToast('✓ Emergency Medical Information updated');
  };

  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationName(`Detected Coordinates: (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`);
          showToast('📍 Browser location updated');
        },
        () => {
          setLocationName('Selaiyur, Chennai (Fallback Location)');
          showToast('📍 Location permission denied — using fallback');
        }
      );
    } else {
      showToast('📍 Geolocation not supported — using demo location');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20 font-sans">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="SOS & Emergency Care"
        subtitle="Quickly access emergency options and important contacts when you need them."
        badgeText="24x7 Safety Desk"
        badgeIcon={<AlertTriangle className="w-3.5 h-3.5" />}
      />

      {/* 2. EMERGENCY HEADER STATUS AREA */}
      <EmergencyHeaderStatus onOpenSettings={() => setPreferencesModalOpen(true)} />

      {/* 3. SOS CARD OR ACTIVATED STATE */}
      {!sosActivated ? (
        <PrimarySOSCard onTriggerSOS={handleStartSOS} />
      ) : (
        <SOSActivatedState
          contacts={contacts}
          locationName={locationName}
          onCancelSimulation={handleCancelSOSActivated}
          onOpenServices={() => {}}
        />
      )}

      {/* 4. EMERGENCY SERVICES SECTION */}
      <EmergencyServicesSection
        services={EMERGENCY_SERVICES}
        onOpenCallModal={(s) => setCallTarget(s)}
        onNavigateHospitals={() => onNavigate('hospitals')}
      />

      {/* 5. EMERGENCY CONTACTS SECTION */}
      <EmergencyContactsSection
        contacts={contacts}
        onOpenAddContact={() => {
          setAddEditContactTarget(null);
          setAddEditModalOpen(true);
        }}
        onOpenEditContact={(c) => {
          setAddEditContactTarget(c);
          setAddEditModalOpen(true);
        }}
        onOpenRemoveContact={(c) => setRemoveContactTarget(c)}
        onCallContact={(c) => showToast(`✓ Initiated demo call to ${c.name} (${c.phone})`)}
      />

      {/* 6. EMERGENCY MEDICAL ID CARD */}
      <EmergencyMedicalIDCard
        info={medicalInfo}
        onOpenFullID={() => setFullIDModalOpen(true)}
        onOpenEditInfo={() => setEditMedicalInfoOpen(true)}
        onOpenShareID={() => setShareIDModalOpen(true)}
      />

      {/* 7. LOCATION & CSS MAP */}
      <EmergencyLocationSection
        locationName={locationName}
        onRefreshLocation={handleRefreshLocation}
      />

      {/* 8. SYSTEM HISTORY & READINESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmergencyHistorySection
            history={history}
            onRunTest={() => setTestModalOpen(true)}
          />
        </div>
        <div>
          <EmergencyReadinessCard
            hasContacts={contacts.length > 0}
            hasMedicalInfo={!!medicalInfo.bloodGroup}
            hasTested={hasTested}
          />
        </div>
      </div>

      {/* 9. CROSS-MODULE SHORTCUT CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        <button
          onClick={() => onNavigate('hospitals')}
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-purple-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white">Nearby Hospitals</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Find 24x7 cashless emergency network hospitals →</p>
        </button>

        <button
          onClick={() => onNavigate('family')}
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Users className="w-5 h-5 text-[#00a896] dark:text-teal-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white">Family Connect</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Share emergency medical ID with dependents →</p>
        </button>

        <button
          onClick={() => onNavigate('insurance')}
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-[#00a896]/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <FileText className="w-5 h-5 text-[#00a896] dark:text-cyan-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white">Insurance Coverage</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">View cashless hospitalization policy limits →</p>
        </button>

        <button
          onClick={() => onNavigate('appointments')}
          className="p-5 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-amber-500/40 rounded-3xl text-left space-y-2 transition-all cursor-pointer shadow-md group"
        >
          <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="font-extrabold text-slate-900 dark:text-white">Care Appointments</h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Book follow-up specialist consultation →</p>
        </button>
      </div>

      {/* MODALS & OVERLAYS */}
      <SOSConfirmationModal
        isOpen={sosConfirmationOpen}
        contacts={contacts}
        locationName={locationName}
        onClose={() => setSosConfirmationOpen(false)}
        onConfirmContinue={handleConfirmSOSContinue}
      />

      <SOSCountdownOverlay
        countdown={sosCountdown}
        isOpen={sosCountdownActive}
        onCancel={handleCancelSOSCountdown}
      />

      <CallConfirmationModal
        service={callTarget}
        isOpen={!!callTarget}
        onClose={() => setCallTarget(null)}
        onConfirmCall={(sName, phone) => showToast(`✓ Initiated demo call to ${sName} (${phone})`)}
      />

      <AddEditContactModal
        contactToEdit={addEditContactTarget}
        isOpen={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        onSaveContact={handleSaveContact}
      />

      <RemoveContactModal
        contact={removeContactTarget}
        isOpen={!!removeContactTarget}
        onClose={() => setRemoveContactTarget(null)}
        onConfirmRemove={handleRemoveContact}
      />

      <FullMedicalIDModal
        info={medicalInfo}
        isOpen={fullIDModalOpen}
        onClose={() => setFullIDModalOpen(false)}
        onShareID={() => {
          showToast('✓ Medical ID shared with emergency contacts');
          setFullIDModalOpen(false);
        }}
      />

      <EditMedicalInfoModal
        info={medicalInfo}
        isOpen={editMedicalInfoOpen}
        onClose={() => setEditMedicalInfoOpen(false)}
        onSaveInfo={handleSaveMedicalInfo}
      />

      <EmergencyPreferencesModal
        preferences={preferences}
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        onSavePreferences={(pref) => {
          setPreferences(pref);
          showToast('✓ Emergency Preferences updated');
        }}
      />

      <TestEmergencyModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        onTestComplete={() => {
          setHasTested(true);
          const newAct: EmergencyActivityItem = {
            id: `ACT-${Date.now().toString().slice(-4)}`,
            event: 'System Diagnostic Test',
            date: '24 Aug 2026',
            time: 'Just Now',
            status: 'Completed'
          };
          setHistory([newAct, ...history]);
          showToast('✓ Emergency sequence test completed');
        }}
      />

      {/* SHARE ID MODAL */}
      {shareIDModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Share Emergency Medical ID</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Share offline medical QR & allergy record with trusted contact.</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onNavigate('family');
                  setShareIDModalOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[#00a896] dark:text-teal-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer"
              >
                Share via Family Connect →
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Emergency Medical ID: ${medicalInfo.medicalId} - Blood Group: ${medicalInfo.bloodGroup}`);
                  showToast('✓ Copied demo medical ID info to clipboard');
                  setShareIDModalOpen(false);
                }}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-purple-700 dark:text-purple-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer"
              >
                Copy Demo Medical ID Details
              </button>
            </div>
            <button onClick={() => setShareIDModalOpen(false)} className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold cursor-pointer border border-slate-300 dark:border-slate-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
