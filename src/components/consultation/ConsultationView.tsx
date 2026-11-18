import React, { useState, useEffect } from 'react';
import type { ConsultationAppointment, ConsultationDoctor } from './consultationData';
import { MOCK_CONSULTATION_APPOINTMENT, AVAILABLE_CONSULTATION_DOCTORS } from './consultationData';
import { PreCallScreen } from './PreCallScreen';
import { WaitingRoom } from './WaitingRoom';
import { ActiveConsultationRoom } from './ActiveConsultationRoom';
import { ConsultationEndedScreen } from './ConsultationEndedScreen';
import { DeviceSettingsDrawer } from './DeviceSettingsDrawer';
import { TechnicalIssueModal } from './TechnicalIssueModal';
import { ConfirmLeaveModal } from './ConfirmLeaveModal';
import { teleConsultationService } from '../../services/teleConsultationService';
import { globalNotificationService } from '../../services/globalNotificationService';
import { videoConsultationApi } from '../../services/videoConsultationApi';

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

  const patientName = user?.name || 'Helen Persia';

  // APPOINTMENT DATA - Selectable Doctor State
  const [availableDoctors, setAvailableDoctors] = useState<ConsultationDoctor[]>(AVAILABLE_CONSULTATION_DOCTORS);
  const [selectedDoctor, setSelectedDoctor] = useState<ConsultationDoctor>(AVAILABLE_CONSULTATION_DOCTORS[0]);
  const [appointment, setAppointment] = useState<ConsultationAppointment>({
    ...MOCK_CONSULTATION_APPOINTMENT,
    doctor: AVAILABLE_CONSULTATION_DOCTORS[0]
  });
  const [currentConsultationId, setCurrentConsultationId] = useState<string | null>(null);

  // Load real registered doctors from database
  useEffect(() => {
    videoConsultationApi.getAvailableDoctors().then((docs) => {
      if (docs && docs.length > 0) {
        setAvailableDoctors(docs);
        setSelectedDoctor(docs[0]);
        setAppointment((prev) => ({
          ...prev,
          doctor: docs[0],
        }));
      }
    });
  }, []);

  const handleSelectDoctor = (doctor: ConsultationDoctor) => {
    setSelectedDoctor(doctor);
    setAppointment((prev) => ({
      ...prev,
      doctor
    }));
  };

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

  // Listen for doctor answer via real-time teleConsultationService
  useEffect(() => {
    const unsubscribe = teleConsultationService.subscribe((session) => {
      if (session && session.status === 'connected') {
        setStage('active');
      } else if (session && session.status === 'rejected') {
        setStage('preCall');
      } else if (session && session.status === 'ended') {
        setStage('ended');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleJoinWaitingRoom = async () => {
    // 1. Move to waiting room
    setStage('waiting');

    let consultationId: string | undefined;

    // 2. Persist consultation request in MySQL backend using authenticated user
    try {
      const res = await videoConsultationApi.createRequest(appointment.doctor.id, 'Video Consultation');
      consultationId = res?.id;
      setCurrentConsultationId(consultationId || null);
    } catch (err) {
      console.warn('Backend consultation request error:', err);
    }

    // 3. Transmit real-time teleconsultation request to selected doctor
    teleConsultationService.initiateCall({
      consultationId,
      patientId: user?.abhaId || 'ABHA-9941-02',
      patientName: patientName,
      patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      doctorId: appointment.doctor.id,
      doctorName: appointment.doctor.name,
      doctorSpeciality: appointment.doctor.speciality,
      doctorAvatar: appointment.doctor.avatarUrl,
    });

    // 3. Post notification to doctor role
    globalNotificationService.dispatchNotification({
      id: `call-${Date.now()}`,
      title: 'Incoming Video Consultation Call',
      message: `${patientName} is calling for an instant video consultation with ${appointment.doctor.name}.`,
      recipientRole: 'DOCTOR',
      type: 'VIDEO_CALL',
      priority: 'EMERGENCY',
      timestamp: new Date().toISOString(),
      read: false,
      relatedRoute: '/doctor/dashboard',
    });
  };

  const handleEndCallConfirmed = (durationSeconds: number, notesText: string) => {
    setEndedDurationSeconds(durationSeconds);
    setFinalNotesText(notesText);

    teleConsultationService.endCall();

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
        notes: notesText || `Video consultation with ${appointment.doctor.name} completed successfully.`,
        tags: ['Teleconsultation', appointment.doctor.speciality, 'Video Call']
      };
      localStorage.setItem('user_medical_records', JSON.stringify([newConsultationRecord, ...records]));
    } catch (e) {
      console.error(e);
    }

    setStage('ended');
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white select-none transition-colors duration-300 font-sans pb-16">
      {/* 1. PRE-CALL STAGE */}
      {stage === 'preCall' && (
        <div className="p-2 sm:p-4">
          <PreCallScreen
            appointment={appointment}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
            speakerEnabled={speakerEnabled}
            onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
            onToggleMic={() => setMicEnabled(!micEnabled)}
            onToggleSpeaker={() => setSpeakerEnabled(!speakerEnabled)}
            onOpenDeviceSettings={() => setDeviceSettingsOpen(true)}
            onJoinWaitingRoom={handleJoinWaitingRoom}
            onNavigateAppointments={() => onNavigate('appointments')}
            onSelectDoctor={handleSelectDoctor}
          />
        </div>
      )}

      {/* 2. WAITING ROOM STAGE */}
      {stage === 'waiting' && (
        <div className="p-2 sm:p-4">
          <WaitingRoom
            appointment={appointment}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
            onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
            onToggleMic={() => setMicEnabled(!micEnabled)}
            onLeaveWaitingRoom={() => {
              teleConsultationService.rejectCall();
              setLeaveModalType('waiting');
              setConfirmLeaveOpen(true);
            }}
            onDoctorJoined={() => {
              teleConsultationService.acceptCall();
              setStage('active');
            }}
          />
        </div>
      )}

      {/* 3. ACTIVE CONSULTATION ROOM STAGE (Patient view: Doctor in center, Patient in self video) */}
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
          currentRole="Patient"
          currentUserName={patientName}
          remoteUserName={appointment.doctor.name}
          remoteUserAvatar={appointment.doctor.avatarUrl}
          remoteUserRoleTitle={`${appointment.doctor.speciality} · ${appointment.doctor.hospital}`}
        />
      )}

      {/* 4. CONSULTATION ENDED STAGE */}
      {stage === 'ended' && (
        <div className="p-2 sm:p-4">
          <ConsultationEndedScreen
            appointment={appointment}
            durationSeconds={endedDurationSeconds}
            notesText={finalNotesText}
            onNavigateRecords={() => onNavigate('records')}
            onNavigateAppointments={() => onNavigate('appointments')}
            onNavigateDashboard={() => onNavigate('dashboard')}
            onStartNewConsultation={() => setStage('preCall')}
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
        title={leaveModalType === 'waiting' ? 'Leave Waiting Room?' : 'End Consultation?'}
        message={
          leaveModalType === 'waiting'
            ? 'Leaving the waiting room will cancel your current slot in line.'
            : 'Are you sure you want to exit? Your consultation summary and notes will be safely saved.'
        }
        confirmLabel={leaveModalType === 'waiting' ? 'Leave Queue' : 'End Call'}
        onClose={() => setConfirmLeaveOpen(false)}
        onConfirm={() => {
          if (leaveModalType === 'waiting') {
            if (currentConsultationId) {
              videoConsultationApi.cancelRequest(currentConsultationId).catch(console.error);
            }
            teleConsultationService.rejectCall();
            setStage('preCall');
          } else {
            if (currentConsultationId) {
              videoConsultationApi.endConsultation(currentConsultationId).catch(console.error);
            }
            handleEndCallConfirmed(endedDurationSeconds, finalNotesText);
          }
        }}
      />
    </div>
  );
};
