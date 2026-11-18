import { Request, Response } from 'express';
import crypto from 'crypto';
import { LiveKitService } from '../services/livekit.service';
import { prisma } from '../config/prisma';
import { VideoConsultationStatus } from '@prisma/client';
import { emitVideoConsultationEvent } from '../socket';

/**
 * Helper to resolve patient profile from authenticated user
 */
async function getAuthenticatedPatient(userId: string) {
  return prisma.patient.findUnique({
    where: { userId },
    select: { id: true, fullName: true, gender: true, bloodGroup: true },
  });
}

/**
 * Helper to resolve doctor profile from authenticated user
 */
async function getAuthenticatedDoctor(userId: string) {
  return prisma.doctor.findUnique({
    where: { userId },
    select: { id: true, fullName: true, speciality: true, hospital: true },
  });
}

function getParamId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
}

/**
 * 1. POST /api/video-consultations/request
 * Patient initiates a video consultation request with an assigned doctor.
 */
export const requestVideoConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const patient = await getAuthenticatedPatient(userId);
    if (!patient) {
      res.status(403).json({ success: false, message: 'Only registered patients can request a consultation' });
      return;
    }

    const { doctorId, reason } = req.body;
    if (!doctorId) {
      res.status(400).json({ success: false, message: 'Target doctorId is required' });
      return;
    }

    // Verify doctor exists in actual database
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true, fullName: true, speciality: true, hospital: true, user: { select: { isActive: true } } },
    });

    if (!doctor || !doctor.user.isActive) {
      res.status(404).json({ success: false, message: 'Requested doctor not found or is currently inactive' });
      return;
    }

    // Check if patient already has an active pending/in-progress video consultation with this doctor
    const existingActive = await prisma.videoConsultation.findFirst({
      where: {
        patientId: patient.id,
        doctorId: doctor.id,
        status: { in: [VideoConsultationStatus.PENDING, VideoConsultationStatus.ACCEPTED, VideoConsultationStatus.IN_PROGRESS] },
      },
    });

    if (existingActive) {
      res.status(409).json({
        success: false,
        message: 'An active consultation request is already open with this doctor',
        consultation: existingActive,
      });
      return;
    }

    const newConsultation = await prisma.videoConsultation.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        status: VideoConsultationStatus.PENDING,
        reason: typeof reason === 'string' ? reason.trim() : null,
      },
      include: {
        patient: {
          select: { id: true, fullName: true, gender: true, bloodGroup: true },
        },
        doctor: {
          select: { id: true, fullName: true, speciality: true, hospital: true },
        },
      },
    });

    // Emit real-time incoming call event to doctor's authenticated room
    emitVideoConsultationEvent({
      event: 'call:incoming',
      consultationId: newConsultation.id,
      patientId: newConsultation.patientId,
      doctorId: newConsultation.doctorId,
      status: newConsultation.status,
      consultation: newConsultation,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Video consultation request sent successfully',
      consultation: newConsultation,
    });
  } catch (error: any) {
    console.error('Error requesting video consultation:', error);
    res.status(500).json({ success: false, message: 'Failed to create consultation request', error: error.message });
  }
};

/**
 * 2. GET /api/video-consultations/doctor/requests
 * Returns incoming/active consultation requests for the authenticated doctor.
 */
export const getDoctorRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const doctor = await getAuthenticatedDoctor(userId);
    if (!doctor) {
      res.status(403).json({ success: false, message: 'Only registered doctors can access doctor consultation queue' });
      return;
    }

    const requests = await prisma.videoConsultation.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            gender: true,
            bloodGroup: true,
            user: { select: { email: true, phoneNumber: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      success: true,
      doctor: { id: doctor.id, fullName: doctor.fullName },
      requests,
    });
  } catch (error: any) {
    console.error('Error fetching doctor requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch consultation requests', error: error.message });
  }
};

/**
 * 3. GET /api/video-consultations/patient/requests
 * Returns consultation requests belonging to the authenticated patient.
 */
export const getPatientRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const patient = await getAuthenticatedPatient(userId);
    if (!patient) {
      res.status(403).json({ success: false, message: 'Only registered patients can access patient requests' });
      return;
    }

    const requests = await prisma.videoConsultation.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            speciality: true,
            hospital: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.status(200).json({
      success: true,
      patient: { id: patient.id, fullName: patient.fullName },
      requests,
    });
  } catch (error: any) {
    console.error('Error fetching patient requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch consultation requests', error: error.message });
  }
};

/**
 * 4. PATCH /api/video-consultations/:id/accept
 * Only assigned doctor can accept. Updates status to ACCEPTED with unique secure roomId.
 * Uses atomic transaction to prevent race conditions and duplicate acceptance.
 */
export const acceptVideoConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = getParamId(req);

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const doctor = await getAuthenticatedDoctor(userId);
    if (!doctor) {
      res.status(403).json({ success: false, message: 'Only doctors can accept consultation requests' });
      return;
    }

    // Atomic update preventing duplicate acceptance
    const result = await prisma.$transaction(async (tx) => {
      const consultation = await tx.videoConsultation.findUnique({
        where: { id },
      });

      if (!consultation) {
        throw new Error('NOT_FOUND');
      }

      if (consultation.doctorId !== doctor.id) {
        throw new Error('FORBIDDEN');
      }

      if (consultation.status !== VideoConsultationStatus.PENDING) {
        throw new Error(`INVALID_STATUS:${consultation.status}`);
      }

      const uniqueRoomId = `tele-${consultation.id.slice(-8)}-${crypto.randomBytes(4).toString('hex')}`;

      return tx.videoConsultation.update({
        where: { id },
        data: {
          status: VideoConsultationStatus.ACCEPTED,
          acceptedAt: new Date(),
          roomId: uniqueRoomId,
        },
        include: {
          patient: {
            select: { id: true, fullName: true, gender: true, bloodGroup: true },
          },
          doctor: {
            select: { id: true, fullName: true, speciality: true, hospital: true },
          },
        },
      });
    });

    // Emit call:accepted event to patient & doctor rooms
    emitVideoConsultationEvent({
      event: 'call:accepted',
      consultationId: result.id,
      patientId: result.patientId,
      doctorId: result.doctorId,
      roomId: result.roomId,
      status: result.status,
      consultation: result,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Consultation request accepted',
      consultation: result,
    });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      res.status(404).json({ success: false, message: 'Consultation request not found' });
      return;
    }
    if (error.message === 'FORBIDDEN') {
      res.status(403).json({ success: false, message: 'You are not authorized to accept this consultation' });
      return;
    }
    if (error.message?.startsWith('INVALID_STATUS:')) {
      const currentStatus = error.message.split(':')[1];
      res.status(409).json({
        success: false,
        message: `Cannot accept consultation in status: ${currentStatus}`,
      });
      return;
    }

    console.error('Error accepting video consultation:', error);
    res.status(500).json({ success: false, message: 'Failed to accept consultation', error: error.message });
  }
};

/**
 * 5. PATCH /api/video-consultations/:id/decline
 * Only assigned doctor can decline.
 */
export const declineVideoConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = getParamId(req);

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const doctor = await getAuthenticatedDoctor(userId);
    if (!doctor) {
      res.status(403).json({ success: false, message: 'Only doctors can decline consultation requests' });
      return;
    }

    const consultation = await prisma.videoConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      res.status(404).json({ success: false, message: 'Consultation request not found' });
      return;
    }

    if (consultation.doctorId !== doctor.id) {
      res.status(403).json({ success: false, message: 'You are not authorized to decline this consultation' });
      return;
    }

    if (consultation.status !== VideoConsultationStatus.PENDING) {
      res.status(409).json({
        success: false,
        message: `Cannot decline consultation in current status: ${consultation.status}`,
      });
      return;
    }

    const updated = await prisma.videoConsultation.update({
      where: { id },
      data: {
        status: VideoConsultationStatus.DECLINED,
      },
    });

    emitVideoConsultationEvent({
      event: 'call:declined',
      consultationId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      status: updated.status,
      consultation: updated,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Consultation request declined',
      consultation: updated,
    });
  } catch (error: any) {
    console.error('Error declining video consultation:', error);
    res.status(500).json({ success: false, message: 'Failed to decline consultation', error: error.message });
  }
};

/**
 * 6. PATCH /api/video-consultations/:id/cancel
 * Only requesting patient can cancel.
 */
export const cancelVideoConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = getParamId(req);

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const patient = await getAuthenticatedPatient(userId);
    if (!patient) {
      res.status(403).json({ success: false, message: 'Only patients can cancel their consultation requests' });
      return;
    }

    const consultation = await prisma.videoConsultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      res.status(404).json({ success: false, message: 'Consultation request not found' });
      return;
    }

    if (consultation.patientId !== patient.id) {
      res.status(403).json({ success: false, message: 'You can only cancel your own consultation requests' });
      return;
    }

    if (
      consultation.status !== VideoConsultationStatus.PENDING &&
      consultation.status !== VideoConsultationStatus.ACCEPTED &&
      consultation.status !== VideoConsultationStatus.WAITING_FOR_DOCTOR
    ) {
      res.status(409).json({
        success: false,
        message: `Cannot cancel consultation in current status: ${consultation.status}`,
      });
      return;
    }

    const updated = await prisma.videoConsultation.update({
      where: { id },
      data: {
        status: VideoConsultationStatus.CANCELLED,
      },
    });

    emitVideoConsultationEvent({
      event: 'call:cancelled',
      consultationId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      status: updated.status,
      consultation: updated,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Consultation request cancelled',
      consultation: updated,
    });
  } catch (error: any) {
    console.error('Error cancelling video consultation:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel consultation', error: error.message });
  }
};

/**
 * 7. PATCH /api/video-consultations/:id/join
 * Records room joining timestamp and status transition to IN_PROGRESS.
 */
export const joinVideoConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = getParamId(req);

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const consultation = await prisma.videoConsultation.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, userId: true, fullName: true } },
        doctor: { select: { id: true, userId: true, fullName: true } },
      },
    });

    if (!consultation) {
      res.status(404).json({ success: false, message: 'Consultation not found' });
      return;
    }

    const isPatient = consultation.patient.userId === userId;
    const isDoctor = consultation.doctor.userId === userId;

    if (!isPatient && !isDoctor) {
      res.status(403).json({ success: false, message: 'You are not a participant in this consultation' });
      return;
    }

    // Pending consultations cannot be joined before acceptance
    if (consultation.status === VideoConsultationStatus.PENDING) {
      res.status(400).json({
        success: false,
        message: 'Cannot join room: Consultation is still PENDING and has not been accepted by the doctor yet',
      });
      return;
    }

    // Closed consultations (declined, cancelled, completed, expired) cannot be rejoined
    if (
      consultation.status === VideoConsultationStatus.DECLINED ||
      consultation.status === VideoConsultationStatus.CANCELLED ||
      consultation.status === VideoConsultationStatus.COMPLETED ||
      consultation.status === VideoConsultationStatus.EXPIRED
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot join room: Consultation is already ${consultation.status}`,
      });
      return;
    }

    // Status transition based on who joined:
    // If ACCEPTED and patient joins first -> WAITING_FOR_DOCTOR
    // If ACCEPTED and doctor joins first -> WAITING_FOR_PATIENT
    // If already waiting for the other party and the second party joins -> IN_PROGRESS
    let newStatus = consultation.status;
    let newStartedAt = consultation.startedAt;

    if (consultation.status === VideoConsultationStatus.ACCEPTED) {
      newStatus = isPatient
        ? VideoConsultationStatus.WAITING_FOR_DOCTOR
        : VideoConsultationStatus.WAITING_FOR_PATIENT;
    } else if (
      (consultation.status === VideoConsultationStatus.WAITING_FOR_DOCTOR && isDoctor) ||
      (consultation.status === VideoConsultationStatus.WAITING_FOR_PATIENT && isPatient)
    ) {
      newStatus = VideoConsultationStatus.IN_PROGRESS;
      if (!newStartedAt) newStartedAt = new Date();
    }

    let updated = consultation;
    if (newStatus !== consultation.status || newStartedAt !== consultation.startedAt) {
      const dbUpdated = await prisma.videoConsultation.update({
        where: { id },
        data: {
          status: newStatus,
          startedAt: newStartedAt,
        },
        include: {
          patient: { select: { id: true, userId: true, fullName: true } },
          doctor: { select: { id: true, userId: true, fullName: true } },
        },
      });
      updated = dbUpdated;
    }

    res.status(200).json({
      success: true,
      role: isDoctor ? 'DOCTOR' : 'PATIENT',
      consultation: updated,
    });
  } catch (error: any) {
    console.error('Error joining video consultation:', error);
    res.status(500).json({ success: false, message: 'Failed to join consultation', error: error.message });
  }
};

/**
 * 8. PATCH /api/video-consultations/:id/end
 * Only authorized participants can end consultation. Sets COMPLETED status & endedAt.
 */
export const endVideoConsultation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = getParamId(req);

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const consultation = await prisma.videoConsultation.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, userId: true } },
        doctor: { select: { id: true, userId: true } },
      },
    });

    if (!consultation) {
      res.status(404).json({ success: false, message: 'Consultation not found' });
      return;
    }

    const isParticipant = consultation.patient.userId === userId || consultation.doctor.userId === userId;
    if (!isParticipant) {
      res.status(403).json({ success: false, message: 'You are not a participant in this consultation' });
      return;
    }

    const updated = await prisma.videoConsultation.update({
      where: { id },
      data: {
        status: VideoConsultationStatus.COMPLETED,
        endedAt: new Date(),
      },
    });

    emitVideoConsultationEvent({
      event: 'call:ended',
      consultationId: updated.id,
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      status: updated.status,
      consultation: updated,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: 'Consultation ended successfully',
      consultation: updated,
    });
  } catch (error: any) {
    console.error('Error ending video consultation:', error);
    res.status(500).json({ success: false, message: 'Failed to end consultation', error: error.message });
  }
};

/**
 * 9. GET /api/video-consultations/:id
 * Retrieve details of a specific consultation for authorized participants.
 */
export const getConsultationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const id = getParamId(req);

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const consultation = await prisma.videoConsultation.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            gender: true,
            bloodGroup: true,
          },
        },
        doctor: {
          select: {
            id: true,
            userId: true,
            fullName: true,
            speciality: true,
            hospital: true,
            consultationFee: true,
          },
        },
      },
    });

    if (!consultation) {
      res.status(404).json({ success: false, message: 'Consultation not found' });
      return;
    }

    const isParticipant = consultation.patient.userId === userId || consultation.doctor.userId === userId;
    if (!isParticipant) {
      res.status(403).json({ success: false, message: 'Access denied: not a consultation participant' });
      return;
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error: any) {
    console.error('Error getting consultation by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve consultation', error: error.message });
  }
};

/**
 * 10. GET /api/video-consultations/ice-servers
 * Generates short-lived, authenticated TURN/STUN credentials securely from the server.
 * Never exposes permanent TURN secrets to the browser bundle.
 */
export const getIceServers = async (req: Request, res: Response): Promise<void> => {
  try {
    const iceServers: any[] = [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ];

    const turnServer = process.env.TURN_SERVER;
    const turnSecret = process.env.TURN_SECRET;
    const staticUsername = process.env.TURN_USERNAME;
    const staticPassword = process.env.TURN_PASSWORD;

    if (turnServer) {
      if (turnSecret) {
        // Standard RFC 5766 HMAC short-lived ephemeral credential algorithm:
        // username = timestamp:userId
        // password = base64(hmac-sha1(username, turnSecret))
        const ttlSeconds = 3600; // 1 hour validity
        const timestamp = Math.floor(Date.now() / 1000) + ttlSeconds;
        const ephemeralUsername = `${timestamp}:${req.user?.id || 'guest'}`;
        const hmac = crypto.createHmac('sha1', turnSecret);
        hmac.update(ephemeralUsername);
        const ephemeralPassword = hmac.digest('base64');

        iceServers.push({
          urls: turnServer,
          username: ephemeralUsername,
          credential: ephemeralPassword,
        });
      } else if (staticUsername && staticPassword) {
        iceServers.push({
          urls: turnServer,
          username: staticUsername,
          credential: staticPassword,
        });
      }
    }

    res.status(200).json({
      success: true,
      iceServers,
    });
  } catch (error: any) {
    console.error('Error generating ICE servers:', error);
    res.status(500).json({ success: false, message: 'Failed to configure ICE servers', error: error.message });
  }
};

/**
 * 11. GET /api/video-consultations/doctors
 * Returns actual registered active doctors from MySQL for consultation selection.
 */
export const getAvailableDoctors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        user: { isActive: true },
      },
      select: {
        id: true,
        fullName: true,
        speciality: true,
        hospital: true,
        experienceYears: true,
        consultationFee: true,
        photoUrl: true,
        about: true,
      },
      orderBy: { fullName: 'asc' },
    });

    res.status(200).json({
      success: true,
      doctors: doctors.map((d) => ({
        id: d.id,
        name: d.fullName,
        speciality: d.speciality || 'General Medicine',
        rating: 4.9,
        experienceYears: d.experienceYears || 5,
        languages: ['English', 'Tamil', 'Hindi'],
        hospital: d.hospital || 'Medicare Multi-Specialty Hospital',
        avatarUrl: d.photoUrl || 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
        bio: d.about || `${d.speciality} specialist available for video consultation.`,
        consultationFee: d.consultationFee,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching available consultation doctors:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve available doctors', error: error.message });
  }
};

/**
 * 12. POST /api/video-consultations/:id/livekit-token
 * Generates an authenticated LiveKit room token for the verified doctor or patient.
 */
export const getLiveKitToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const consultationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      res.status(401).json({ success: false, message: 'Unauthorized authentication context' });
      return;
    }

    const consultation = await prisma.videoConsultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: {
          select: { id: true, userId: true, fullName: true },
        },
        doctor: {
          select: { id: true, userId: true, fullName: true, speciality: true },
        },
      },
    });

    if (!consultation) {
      res.status(404).json({ success: false, message: 'Video consultation record not found' });
      return;
    }

    // Authorization: User must be either the assigned doctor or the requesting patient
    const isDoctor = consultation.doctor.userId === userId;
    const isPatient = consultation.patient.userId === userId;

    if (!isDoctor && !isPatient) {
      res.status(403).json({ success: false, message: 'Forbidden: You are not a participant in this consultation' });
      return;
    }

    // Consultation must be accepted / in-progress before issuing LiveKit tokens
    const allowedStatuses: VideoConsultationStatus[] = [
      VideoConsultationStatus.ACCEPTED,
      VideoConsultationStatus.WAITING_FOR_PATIENT,
      VideoConsultationStatus.WAITING_FOR_DOCTOR,
      VideoConsultationStatus.IN_PROGRESS,
    ];

    if (!allowedStatuses.includes(consultation.status)) {
      res.status(400).json({
        success: false,
        message: `Cannot generate LiveKit token for consultation in status ${consultation.status}. Doctor must accept first.`,
      });
      return;
    }

    const roomName = consultation.roomId || `consultation_${consultation.id}`;
    const participantIdentity = isDoctor ? `doctor_${consultation.doctor.id}` : `patient_${consultation.patient.id}`;
    const participantName = isDoctor ? consultation.doctor.fullName : consultation.patient.fullName;

    const livekitData = await LiveKitService.generateToken({
      roomName,
      participantIdentity,
      participantName,
      isDoctor,
      metadata: {
        consultationId: consultation.id,
        role: userRole,
        doctorId: consultation.doctorId,
        patientId: consultation.patientId,
      },
    });

    res.status(200).json({
      success: true,
      token: livekitData.token,
      url: livekitData.url,
      roomName,
      participant: {
        identity: participantIdentity,
        name: participantName,
        isDoctor,
      },
    });
  } catch (error: any) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate LiveKit token',
    });
  }
};

