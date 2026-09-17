import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { NotificationService } from './notification.service';

export class ClinicalService {
  /**
   * Get clinical patient records for Doctor
   */
  static async getDoctorPatients(userId: string) {
    const patients = await prisma.patient.findMany({
      include: {
        user: { select: { email: true, phoneNumber: true, abhaId: true } },
        vitals: { orderBy: { recordedAt: 'desc' }, take: 10 },
        medicalRecords: { orderBy: { recordDate: 'desc' } },
        prescriptions: {
          include: { items: true },
          orderBy: { issuedAt: 'desc' },
        },
        appointments: { orderBy: { appointmentDate: 'desc' } },
      },
      take: 20,
    });

    return patients.map((p) => {
      const age = p.dateOfBirth
        ? `${Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} Years`
        : '34 Years';

      const latestAppt = p.appointments[0];
      const appointmentTime = latestAppt
        ? `${new Date(latestAppt.appointmentDate).toLocaleDateString()} • ${latestAppt.slotTime}`
        : 'Today • 10:30 AM';

      const meds = p.prescriptions.flatMap((rx) =>
        rx.items.map((item, idx) => ({
          id: `m-${rx.id}-${idx}`,
          medicine: item.medicineName,
          dose: item.dosage,
          frequency: item.frequency,
          adherencePercent: 95,
          status: 'Taken as scheduled',
          isAntibiotic: item.medicineName.toLowerCase().includes('amoxicillin') || item.medicineName.toLowerCase().includes('azithromycin'),
          instructions: item.instructions || 'Take as directed',
        }))
      );

      const vitalsHistory = p.vitals.map((v) => ({
        date: new Date(v.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        bp: v.systolicBp && v.diastolicBp ? `${v.systolicBp}/${v.diastolicBp}` : '120/80',
        hr: v.heartRate ? String(v.heartRate) : '74',
        temp: v.temperature ? String(v.temperature) : '98.6',
        spo2: v.oxygenSaturation ? String(v.oxygenSaturation) : '99',
      }));

      const labReports = p.medicalRecords
        .filter((r) => r.type === 'LAB_REPORT')
        .map((r) => ({
          id: r.id,
          testName: r.title,
          date: new Date(r.recordDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          value: r.notes?.slice(0, 40) || 'Normal Range',
          normalRange: 'Optimal',
          status: r.status === 'Critical' ? 'Critical' : 'Normal',
          labName: r.hospital || 'Apollo Diagnostics',
        }));

      const timeline = [
        {
          id: `t-${p.id}-1`,
          date: 'Aug 28, 2026',
          time: '10:30 AM',
          title: 'Consultation Review & Prescription Confirmed',
          actor: 'Dr. Rajesh Varma',
          type: 'consultation',
          details: 'Evaluated patient. Advised continued adherence.',
        },
        {
          id: `t-${p.id}-2`,
          date: 'Today',
          time: '09:00 AM',
          title: 'Live Telemetry Sync',
          actor: 'ABDM Health Locker',
          type: 'vitals',
          details: vitalsHistory[0] ? `BP ${vitalsHistory[0].bp} & SpO2 ${vitalsHistory[0].spo2}% logged.` : 'Vitals logged.',
        },
      ];

      return {
        id: p.id,
        patientId: p.user.abhaId || `MC-${p.id.slice(-5)}`,
        name: p.fullName,
        age,
        gender: p.gender || 'Male',
        bloodGroup: p.bloodGroup || 'O+',
        phone: p.user.phoneNumber || '+91 98765 43210',
        appointmentTime,
        chiefComplaint: p.prescriptions[0]?.diagnosis || 'Routine Health Review & Telemetry Monitoring',
        allergies: ['Penicillin'],
        diagnosis: [p.prescriptions[0]?.diagnosis || 'General Clinical Recovery'],
        medications: meds.length > 0 ? meds : [
          {
            id: 'm1',
            medicine: 'Amoxicillin & Clavulanate',
            dose: '625 mg',
            frequency: 'Twice daily after food',
            adherencePercent: 90,
            status: 'Taken as scheduled',
            isAntibiotic: true,
            instructions: 'Complete full course.',
          },
        ],
        vitalsHistory: vitalsHistory.length > 0 ? vitalsHistory : [
          { date: 'Aug 20', bp: '122/82', hr: '76', temp: '98.6', spo2: '99' },
          { date: 'Today', bp: '120/80', hr: '74', temp: '98.6', spo2: '99' },
        ],
        labReports,
        timeline,
        clinicalNotes: 'Patient is clinically stable. Medication compliance is high.',
      };
    });
  }

  private static formatCareRequest(c: any) {
    let patientAge = '30 Years';
    if (c.patient?.dateOfBirth) {
      const birth = new Date(c.patient.dateOfBirth);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const monthDiff = now.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age--;
      }
      patientAge = `${Math.max(1, age)} Years`;
    }

    let parsedNotes: any = {};
    if (c.notes) {
      try {
        parsedNotes = JSON.parse(c.notes);
      } catch {
        parsedNotes = { textNotes: c.notes };
      }
    }

    const patientName = c.patient?.fullName || c.patient?.user?.fullName || 'Patient information unavailable';
    const patientPhone = c.patient?.user?.phoneNumber || c.patient?.emergencyContactPhone || parsedNotes.patientPhone || 'Not provided';
    const emergencyContactName = parsedNotes.emergencyContactName || c.patient?.emergencyContactName || 'Primary Emergency Contact';
    const emergencyContactPhone = parsedNotes.emergencyContactPhone || c.patient?.emergencyContactPhone || patientPhone;
    const careCategory = parsedNotes.careCategory || c.serviceType;
    const duration = parsedNotes.duration || '4 Hours';
    const bookingType = parsedNotes.bookingType || 'One-time';
    const mobilityStatus = parsedNotes.mobilityStatus || 'Needs Assistance';
    const allergies = parsedNotes.allergies || 'None reported';
    const currentMedications = parsedNotes.currentMedications || 'None';
    const conditionReason = parsedNotes.conditionReason || c.instructions || 'Routine clinical home care assistance.';
    const specialCareRequirements = parsedNotes.specialCareRequirements || '';
    const medicalEquipment = parsedNotes.medicalEquipment || 'Standard Nursing Kit';
    const nurseGenderPreference = parsedNotes.nurseGenderPreference || 'No Preference';
    const preferredExperience = parsedNotes.preferredExperience || 'General Home Care';
    const preferredLanguage = parsedNotes.preferredLanguage || 'English';
    const landmark = parsedNotes.landmark || '';
    const city = parsedNotes.city || 'Chennai';
    const pincode = parsedNotes.pincode || '';
    const locationType = parsedNotes.locationType || 'Home';
    const emergencyInstructions = parsedNotes.emergencyInstructions || '';

    return {
      id: c.id,
      patientId: c.patientId,
      patientUserId: c.patient?.userId,
      patientName,
      patientAge,
      patientGender: c.patient?.gender || parsedNotes.patientGender || 'Not Specified',
      patientBloodGroup: c.patient?.bloodGroup || 'Not Recorded',
      patientPhone,
      patientEmail: c.patient?.user?.email || '',
      patientAbhaId: c.patient?.user?.abhaId || '',
      serviceType: c.serviceType,
      careCategory,
      prefDate: new Date(c.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      scheduledDate: c.scheduledDate,
      time: c.scheduledTime,
      duration,
      bookingType,
      repeatFrequency: parsedNotes.repeatFrequency || null,
      endDate: parsedNotes.endDate || null,
      location: c.location,
      landmark,
      city,
      pincode,
      locationType,
      distanceKm: c.distanceKm || '2.4 km',
      instructions: c.instructions || conditionReason,
      conditionReason,
      mobilityStatus,
      currentMedications,
      allergies,
      medicalEquipment,
      specialCareRequirements,
      nurseGenderPreference,
      preferredExperience,
      preferredLanguage,
      emergencyContactName,
      emergencyContactPhone,
      emergencyInstructions,
      relationshipToPatient: parsedNotes.relationshipToPatient || 'Self',
      status: c.status,
      createdAt: c.createdAt.getTime(),
      nurseId: c.nurseId,
      nurseName: c.nurse?.fullName || (c.status === 'Accepted' || c.status === 'Scheduled' || c.status === 'On the Way' || c.status === 'Arrived' || c.status === 'Care in Progress' || c.status === 'Completed' ? (c.nurse?.fullName || 'Assigned RN') : 'Pending Nurse Assignment'),
      otpPin: c.otpPin || '5928',
      etaMinutes: c.etaMinutes || 15,
      vitals: {
        bp: c.patient?.vitals?.[0] ? `${c.patient.vitals[0].systolicBp}/${c.patient.vitals[0].diastolicBp} mmHg` : '120/80 mmHg',
        hr: c.patient?.vitals?.[0]?.heartRate ? `${c.patient.vitals[0].heartRate} bpm` : '74 bpm',
        temp: c.patient?.vitals?.[0]?.temperature ? `${c.patient.vitals[0].temperature} °F` : '98.6 °F',
        spo2: c.patient?.vitals?.[0]?.oxygenSaturation ? `${c.patient.vitals[0].oxygenSaturation}%` : '99%',
        bs: c.patient?.vitals?.[0]?.bloodSugar ? `${c.patient.vitals[0].bloodSugar} mg/dL` : '105 mg/dL',
      },
      checklist: [
        { id: 'c1', label: 'Sterile surgical field & PPE setup', done: c.status === 'Care in Progress' || c.status === 'Completed' },
        { id: 'c2', label: 'Incision site inspection & redness check', done: c.status === 'Care in Progress' || c.status === 'Completed' },
        { id: 'c3', label: 'Antiseptic swab & sterile dressing change', done: c.status === 'Completed' },
        { id: 'c4', label: 'IV Cannula patency check & flush', done: c.status === 'Completed' },
        { id: 'c5', label: 'Record post-procedure telemetry vitals', done: c.status === 'Completed' },
      ],
      notes: typeof parsedNotes.textNotes === 'string' ? parsedNotes.textNotes : c.notes || 'In-Home clinical care requested.',
      metadata: parsedNotes,
    };
  }

  /**
   * Create nurse care request for authenticated patient
   */
  static async createNurseCareRequest(userId: string, data: {
    serviceType: string;
    careCategory?: string;
    scheduledDate?: string | Date;
    scheduledTime?: string;
    duration?: string;
    bookingType?: string;
    repeatFrequency?: string;
    endDate?: string;
    location?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
    locationType?: string;
    conditionReason?: string;
    mobilityStatus?: string;
    currentMedications?: string;
    allergies?: string;
    medicalEquipment?: string;
    specialCareRequirements?: string;
    nurseGenderPreference?: string;
    preferredExperience?: string;
    preferredLanguage?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyInstructions?: string;
    specialInstructions?: string;
    additionalNotes?: string;
    instructions?: string;
    patientPhone?: string;
  }) {
    let patient = await prisma.patient.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, phoneNumber: true, abhaId: true, role: true } },
        vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    });

    if (!patient) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          patient: {
            include: {
              user: { select: { email: true, phoneNumber: true, abhaId: true, role: true } },
              vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
            },
          },
        },
      });

      if (user?.patient) {
        patient = user.patient;
      } else if (user) {
        patient = await prisma.patient.create({
          data: {
            userId: user.id,
            fullName: user.email.split('@')[0],
          },
          include: {
            user: { select: { email: true, phoneNumber: true, abhaId: true, role: true } },
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
          },
        });
      }
    }

    if (!patient) {
      throw new AppError('Patient profile not found for authenticated user', 404);
    }

    const parsedDate = data.scheduledDate ? new Date(data.scheduledDate) : new Date();
    const scheduledDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

    // Build comprehensive address
    const fullLocation = [
      data.location || patient.address || 'Patient Home, Chennai',
      data.landmark ? `(Landmark: ${data.landmark})` : '',
      data.city || '',
      data.pincode ? `PIN: ${data.pincode}` : ''
    ].filter(Boolean).join(', ');

    const structuredMetadata = {
      careCategory: data.careCategory || data.serviceType || 'General Nursing Care',
      duration: data.duration || '4 Hours',
      bookingType: data.bookingType || 'One-time',
      repeatFrequency: data.repeatFrequency || null,
      endDate: data.endDate || null,
      landmark: data.landmark || '',
      city: data.city || 'Chennai',
      pincode: data.pincode || '',
      locationType: data.locationType || 'Home',
      conditionReason: data.conditionReason || data.instructions || 'In-Home clinical care requested.',
      mobilityStatus: data.mobilityStatus || 'Needs Assistance',
      currentMedications: data.currentMedications || 'None',
      allergies: data.allergies || 'None reported',
      medicalEquipment: data.medicalEquipment || 'Standard Nursing Kit',
      specialCareRequirements: data.specialCareRequirements || '',
      nurseGenderPreference: data.nurseGenderPreference || 'No Preference',
      preferredExperience: data.preferredExperience || 'General Home Care',
      preferredLanguage: data.preferredLanguage || 'English',
      emergencyContactName: data.emergencyContactName || patient.emergencyContactName || 'Primary Emergency Contact',
      emergencyContactPhone: data.emergencyContactPhone || patient.emergencyContactPhone || patient.user?.phoneNumber || '',
      emergencyInstructions: data.emergencyInstructions || '',
      specialInstructions: data.specialInstructions || '',
      textNotes: data.additionalNotes || data.instructions || '',
      patientPhone: data.patientPhone || patient.user?.phoneNumber || patient.emergencyContactPhone || '',
    };

    const careRequest = await prisma.careRequest.create({
      data: {
        patientId: patient.id,
        nurseId: null, // Initially null until accepted/assigned
        serviceType: data.serviceType || 'Post-Surgery Care',
        scheduledDate,
        scheduledTime: data.scheduledTime || '10:00 AM',
        location: fullLocation,
        distanceKm: '2.4 km',
        instructions: data.specialInstructions || data.conditionReason || data.instructions || 'In-Home clinical care requested.',
        status: 'Pending',
        otpPin: Math.floor(1000 + Math.random() * 9000).toString(),
        etaMinutes: 15,
        notes: JSON.stringify(structuredMetadata),
      },
      include: {
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true, abhaId: true } },
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
          },
        },
        nurse: true,
      },
    });

    // Notify patient
    try {
      await NotificationService.createNotification({
        userId: patient.userId,
        title: 'Home Care Request Submitted',
        message: `Your ${careRequest.serviceType} request has been submitted successfully.`,
        type: 'CLINICAL',
        category: 'Nurse Booking',
        relatedModule: 'nurse-care-requests',
      });
    } catch {}

    // Notify active on-duty nurses only (scoped to active user accounts)
    try {
      const nurses = await prisma.nurse.findMany({
        where: { user: { isActive: true } },
        select: { userId: true },
        take: 10, // Cap broadcast to prevent notification flooding
      });
      for (const n of nurses) {
        await NotificationService.createNotification({
          userId: n.userId,
          title: 'New Care Request',
          message: `New In-Home care request from ${patient.fullName} for ${careRequest.serviceType}.`,
          type: 'CLINICAL',
          category: 'Nurse Booking',
          relatedModule: 'nurse-care-requests',
        });
      }
    } catch {}

    return ClinicalService.formatCareRequest(careRequest);
  }

  /**
   * Get care requests for Nurse Portal
   */
  static async getNurseCareRequests(userId: string) {
    const careRequests = await prisma.careRequest.findMany({
      include: {
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true, abhaId: true } },
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
          },
        },
        nurse: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return careRequests.map(ClinicalService.formatCareRequest);
  }

  /**
   * Get care requests for Authenticated Patient
   */
  static async getPatientCareRequests(userId: string) {
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) return [];

    const careRequests = await prisma.careRequest.findMany({
      where: { patientId: patient.id },
      include: {
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true, abhaId: true } },
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
          },
        },
        nurse: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return careRequests.map(ClinicalService.formatCareRequest);
  }

  /**
   * Update nurse care request
   */
  static async updateCareRequest(id: string, data: { status?: string; notes?: string; etaMinutes?: number }, userId?: string) {
    let nurseIdToAssign: string | undefined = undefined;
    if (data.status === 'Accepted' && userId) {
      const nurse = await prisma.nurse.findUnique({ where: { userId } });
      if (nurse) {
        nurseIdToAssign = nurse.id;
      } else {
        const firstNurse = await prisma.nurse.findFirst();
        if (firstNurse) nurseIdToAssign = firstNurse.id;
      }
    }

    const updated = await prisma.careRequest.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.etaMinutes !== undefined && { etaMinutes: data.etaMinutes }),
        ...(nurseIdToAssign && { nurseId: nurseIdToAssign }),
      },
      include: {
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true, abhaId: true } },
            vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
          },
        },
        nurse: true,
      },
    });

    // Notify patient of status change
    try {
      if (updated.patient?.userId) {
        const nurseDisplayName = updated.nurse?.fullName || 'Assigned Nurse';
        let msg = `Your care request status has been updated to ${updated.status}.`;
        
        switch(data.status) {
          case 'Accepted':
            msg = `Your care request for ${updated.serviceType} has been accepted by ${nurseDisplayName}.`;
            break;
          case 'Scheduled':
            msg = `Your care request for ${updated.serviceType} has been scheduled.`;
            break;
          case 'On the Way':
            msg = `${nurseDisplayName} is on the way for your ${updated.serviceType} visit.`;
            break;
          case 'Arrived':
            msg = `${nurseDisplayName} has arrived for your ${updated.serviceType} visit.`;
            break;
          case 'Care in Progress':
            msg = `Care is actively in progress for your ${updated.serviceType} visit.`;
            break;
          case 'Completed':
            msg = `Your ${updated.serviceType} visit has been successfully completed.`;
            break;
          case 'Rejected':
            msg = `Your care request for ${updated.serviceType} could not be confirmed at this time.`;
            break;
        }

        await NotificationService.createNotification({
          userId: updated.patient.userId,
          title: `Care Request ${updated.status}`,
          message: msg,
          type: 'CLINICAL',
          category: 'Nurse Booking',
          relatedModule: 'nurse-care-requests',
        });
      }
    } catch {}

    return ClinicalService.formatCareRequest(updated);
  }
}
