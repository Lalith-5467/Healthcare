import React, { useState, useEffect } from 'react';
import type { ConsultationAppointment } from '../../consultation/consultationData';
import { PreCallScreen } from '../../consultation/PreCallScreen';
import { WaitingRoom } from '../../consultation/WaitingRoom';
import { ActiveConsultationRoom } from '../../consultation/ActiveConsultationRoom';
import { ConsultationEndedScreen } from '../../consultation/ConsultationEndedScreen';
import { DeviceSettingsDrawer } from '../../consultation/DeviceSettingsDrawer';
import { TechnicalIssueModal } from '../../consultation/TechnicalIssueModal';
import { ConfirmLeaveModal } from '../../consultation/ConfirmLeaveModal';
import { teleConsultationService } from '../../../services/teleConsultationService';
import { videoConsultationApi } from '../../../services/videoConsultationApi';

interface DoctorVideoConsultationViewProps {
  user?: { name: string; email: string };
  patientId?: string | null;
  onNavigate: (page: string) => void;
}

export const DoctorVideoConsultationView: React.FC<DoctorVideoConsultationViewProps> = ({
  user,
  patientId: _patientId,
  onNavigate,
}) => {
  // WORKFLOW STAGES: 'preCall' | 'waiting' | 'active' | 'ended'
  const [stage, setStage] = useState<'preCall' | 'waiting' | 'active' | 'ended'>('active');

  const [activeCall, setActiveCall] = useState(teleConsultationService.getActiveSession());

  // Synchronize latest active consultation session from backend or service
  useEffect(() => {
    let isMounted = true;

    const syncActiveConsultation = async () => {
      try {
        const latest = teleConsultationService.getActiveSession();
        if (latest?.consultationId) {
          setActiveCall(latest);
          return;
        }

        // Fallback: check if doctor has an active / accepted consultation in database
        const res = await videoConsultationApi.getDoctorRequests();
        if (!isMounted) return;

        const activeItem = res?.find(
          (r: any) => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS' || r.status === 'WAITING_FOR_DOCTOR'
        );

        if (activeItem) {
          const session = {
            sessionId: activeItem.id,
            consultationId: activeItem.id,
            roomId: activeItem.roomId || undefined,
            appointmentId: `APT-${activeItem.id.slice(-5).toUpperCase()}`,
            patientId: activeItem.patientId,
            patientName: activeItem.patient?.fullName || 'Helen Persia',
            patientAvatar: activeItem.patient?.avatar || undefined,
            doctorId: activeItem.doctorId,
            doctorName: user?.name || 'Dr. Jim',
            status: 'connected' as const,
            startedAt: Date.now(),
          };
          teleConsultationService.initiateCall(session);
          setActiveCall(session);
        }
      } catch (err) {
        console.warn('Error fetching active consultation for doctor:', err);
      }
    };

    syncActiveConsultation();

    // When doctor views this room, ensure session is set to connected
    teleConsultationService.acceptCall();

    const unsubscribe = teleConsultationService.subscribe((session) => {
      if (session) {
        setActiveCall(session);
        if (session.status === 'ended') {
          setStage('ended');
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user?.name]);

  // DOCTOR APPOINTMENT DATA WITH CONNECTED CLINICAL PATIENT HELEN PERSIA
  const [appointment] = useState<ConsultationAppointment>({
    id: activeCall?.appointmentId || 'APT-2026-00482',
    doctor: {
      id: 'DOC-101',
      name: user?.name ? (user.name.startsWith('Dr') ? user.name : `Dr. ${user.name}`) : 'Dr. Jim',
      speciality: 'Senior Consultant Physician & Cardiologist',
      rating: 4.9,
      experienceYears: 14,
      languages: ['English', 'Tamil', 'Hindi'],
      hospital: 'Medicare Multi-Specialty Hospital',
      avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
      bio: 'Leading tele-health physician specializing in preventive cardiology and digital consultation.'
    },
    date: 'Today · Live Session',
    time: 'In Progress',
    type: 'Video Consultation',
    status: 'In Progress',
    reason: 'Routine tele-consultation, vitals review & digital prescription'
  });

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
  const [_leaveModalType, setLeaveModalType] = useState<'waiting' | 'active'>('waiting');

  const patientName = activeCall?.patientName || 'Helen Persia';
  const patientAvatar = activeCall?.patientAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';

  const handleEndCallConfirmed = (durationSeconds: number, notesText: string) => {
    setEndedDurationSeconds(durationSeconds);
    setFinalNotesText(notesText);

    if (activeCall?.consultationId) {
      videoConsultationApi.endConsultation(activeCall.consultationId).catch(console.error);
    }
    teleConsultationService.endCall();

    try {
      const existing = localStorage.getItem('user_medical_records');
      const records = existing ? JSON.parse(existing) : [];
      const newConsultationRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        title: `Doctor Tele-Consultation Summary - ${patientName}`,
        type: 'Consultation',
        category: 'Consultation',
        doctor: appointment.doctor.name,
        hospital: appointment.doctor.hospital,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        notes: notesText || `Doctor video consultation with ${patientName} successfully completed.`,
        tags: ['Teleconsultation', 'Doctor Suite', 'Video Call']
      };
      localStorage.setItem('user_medical_records', JSON.stringify([newConsultationRecord, ...records]));
    } catch (e) {
      console.error(e);
    }

    setStage('ended');
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 dark:bg-[#070c18] text-slate-900 dark:text-white select-none transition-colors duration-300 font-sans pb-16">
      {/* 1. PRE-CALL STAGE */}
      {stage === 'preCall' && (
        <div className="p-3 sm:p-6 max-w-6xl mx-auto">
          <PreCallScreen
            appointment={appointment}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
            speakerEnabled={speakerEnabled}
            onToggleCamera={() => setCameraEnabled(!cameraEnabled)}
            onToggleMic={() => setMicEnabled(!micEnabled)}
            onToggleSpeaker={() => setSpeakerEnabled(!speakerEnabled)}
            onOpenDeviceSettings={() => setDeviceSettingsOpen(true)}
            onJoinWaitingRoom={() => setStage('active')}
            onNavigateAppointments={() => onNavigate('appointments')}
          />
        </div>
      )}

      {/* 2. WAITING ROOM STAGE */}
      {stage === 'waiting' && (
        <div className="p-3 sm:p-6 max-w-2xl mx-auto">
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
            onDoctorJoined={() => setStage('active')}
          />
        </div>
      )}

      {/* 3. ACTIVE CONSULTATION ROOM STAGE (Doctor view: shows Helen Persia in main stage and Dr. Jim in self video) */}
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
          onNavigateRecords={() => onNavigate('prescriptions')}
          currentRole="Doctor"
          currentUserName={appointment.doctor.name}
          remoteUserName={patientName}
          remoteUserAvatar={patientAvatar}
          remoteUserRoleTitle="Patient · Helen Persia (ABHA Verified)"
        />
      )}

      {/* 4. CONSULTATION ENDED STAGE */}
      {stage === 'ended' && (
        <div className="p-3 sm:p-6 max-w-2xl mx-auto">
          <ConsultationEndedScreen
            appointment={appointment}
            durationSeconds={endedDurationSeconds}
            notesText={finalNotesText}
            onNavigateRecords={() => onNavigate('prescriptions')}
            onNavigateAppointments={() => onNavigate('appointments')}
            onNavigateDashboard={() => onNavigate('overview')}
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
        title="End Video Consultation Session?"
        message="Are you sure you want to exit? Your clinical consultation notes and conversation log will be safely recorded."
        confirmLabel="Exit & Save Session"
        onClose={() => setConfirmLeaveOpen(false)}
        onConfirm={() => handleEndCallConfirmed(endedDurationSeconds, finalNotesText)}
      />
    </div>
  );
};
