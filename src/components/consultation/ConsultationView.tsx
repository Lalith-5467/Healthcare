import React, { useState, useEffect } from 'react';
import type { ConsultationAppointment } from './consultationData';
import { MOCK_CONSULTATION_APPOINTMENT } from './consultationData';
import { PreCallScreen } from './PreCallScreen';
import { WaitingRoom } from './WaitingRoom';
import { ActiveConsultationRoom } from './ActiveConsultationRoom';
import { ConsultationEndedScreen } from './ConsultationEndedScreen';
import { DeviceSettingsDrawer } from './DeviceSettingsDrawer';
import { TechnicalIssueModal } from './TechnicalIssueModal';
import { ConfirmLeaveModal } from './ConfirmLeaveModal';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface ConsultationViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const ConsultationView: React.FC<ConsultationViewProps> = ({
  user,
  onNavigate,
}) => {
  // WORKFLOW STAGES: 'preCall' | 'waiting' | 'active' | 'ended'
  const [stage, setStage] = useState<'preCall' | 'waiting' | 'active' | 'ended'>('preCall');

  // APPOINTMENT DATA
  const [appointment] = useState<ConsultationAppointment>(MOCK_CONSULTATION_APPOINTMENT);

  // DEVICE STATES
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);

  // ENDED CALL METRICS
  const [endedDurationSeconds, setEndedDurationSeconds] = useState(0);
  const [finalNotesText, setFinalNotesText] = useState('');

  // MODAL STATES
  const [deviceSettingsOpen, setDeviceSettingsOpen] = useState(false);
  const [technicalIssueOpen, setTechnicalIssueOpen] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [leaveModalType, setLeaveModalType] = useState<'waiting' | 'active'>('waiting');

  const handleEndCallConfirmed = (durationSeconds: number, notesText: string) => {
    setEndedDurationSeconds(durationSeconds);
    setFinalNotesText(notesText);

    // Save mock consultation record to localStorage
    try {
      const existing = localStorage.getItem('user_medical_records');
      const records = existing ? JSON.parse(existing) : [];
      const newConsultationRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        title: `${appointment.doctor.name} - Consultation Summary`,
        type: 'Consultation',
        category: 'Consultation',
        doctor: appointment.doctor.name,
        hospital: appointment.doctor.hospital,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        notes: notesText || 'Video consultation completed successfully.',
        tags: ['Teleconsultation', 'General Physician', 'Video Call']
      };
      localStorage.setItem('user_medical_records', JSON.stringify([newConsultationRecord, ...records]));
    } catch (e) {
      console.error(e);
    }

    setStage('ended');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white select-none">
      {/* 1. PRE-CALL STAGE */}
      {stage === 'preCall' && (
        <div className="p-4 sm:p-8">
          <PreCallScreen
            appointment={appointment}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
            speakerEnabled={speakerEnabled}
            onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
            onToggleMic={() => setMicEnabled(!micEnabled)}
            onToggleSpeaker={() => setSpeakerEnabled(!speakerEnabled)}
            onOpenDeviceSettings={() => setDeviceSettingsOpen(true)}
            onJoinWaitingRoom={() => setStage('waiting')}
            onNavigateAppointments={() => onNavigate('appointments')}
          />
        </div>
      )}

      {/* 2. WAITING ROOM STAGE */}
      {stage === 'waiting' && (
        <div className="p-4 sm:p-8">
          <WaitingRoom
            appointment={appointment}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
            onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
            onToggleMic={() => setMicEnabled(!micEnabled)}
            onLeaveWaitingRoom={() => {
              setLeaveModalType('waiting');
              setConfirmLeaveOpen(true);
            }}
            onDoctorJoined={() => setStage('active')}
          />
        </div>
      )}

      {/* 3. ACTIVE CONSULTATION ROOM STAGE */}
      {stage === 'active' && (
        <ActiveConsultationRoom
          appointment={appointment}
          cameraEnabled={cameraEnabled}
          micEnabled={micEnabled}
          speakerEnabled={speakerEnabled}
          onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
          onToggleMic={() => setMicEnabled(!micEnabled)}
          onToggleSpeaker={() => setSpeakerEnabled(!speakerEnabled)}
          onOpenReportIssue={() => setTechnicalIssueOpen(true)}
          onOpenDeviceSettings={() => setDeviceSettingsOpen(true)}
          onEndCall={(dur, notes) => {
            setEndedDurationSeconds(dur);
            setFinalNotesText(notes);
            setLeaveModalType('active');
            setConfirmLeaveOpen(true);
          }}
          onNavigateRecords={() => onNavigate('records')}
        />
      )}

      {/* 4. CONSULTATION ENDED STAGE */}
      {stage === 'ended' && (
        <div className="p-4 sm:p-8">
          <ConsultationEndedScreen
            appointment={appointment}
            durationSeconds={endedDurationSeconds}
            notesText={finalNotesText}
            onNavigateRecords={() => onNavigate('records')}
            onNavigateAppointments={() => onNavigate('appointments')}
            onNavigateDashboard={() => onNavigate('dashboard')}
          />
        </div>
      )}

      {/* MODALS */}
      <DeviceSettingsDrawer
        isOpen={deviceSettingsOpen}
        onClose={() => setDeviceSettingsOpen(false)}
      />

      <TechnicalIssueModal
        isOpen={technicalIssueOpen}
        onClose={() => setTechnicalIssueOpen(false)}
        onSubmitted={() => {}}
      />

      <ConfirmLeaveModal
        isOpen={confirmLeaveOpen}
        title={leaveModalType === 'waiting' ? 'Leave Waiting Room?' : 'End Video Consultation?'}
        message={
          leaveModalType === 'waiting'
            ? 'Are you sure you want to exit the waiting room? You can rejoin anytime.'
            : 'Are you sure you want to end this active consultation call?'
        }
        confirmLabel={leaveModalType === 'waiting' ? 'Leave Waiting Room' : 'End Consultation'}
        onClose={() => setConfirmLeaveOpen(false)}
        onConfirm={() => {
          if (leaveModalType === 'waiting') {
            onNavigate('appointments');
          } else {
            handleEndCallConfirmed(endedDurationSeconds, finalNotesText);
          }
        }}
      />
    </div>
  );
};
