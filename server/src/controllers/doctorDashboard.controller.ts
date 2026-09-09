import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AppointmentStatus, ConsultationStatus } from '@prisma/client';

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Determine the doctor
    // Fallback temporary pattern as per plan: get the first doctor
    const doctor = await prisma.doctor.findFirst({
      include: {
        user: true
      }
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Calculate today's boundaries (start of day to end of day)
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // 1. Fetch Today's Appointments
    const todayAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        appointmentDate: {
          gte: startOfToday,
          lte: endOfToday
        }
      },
      include: {
        patient: true,
        consultation: true
      },
      orderBy: {
        slotTime: 'asc'
      }
    });

    // 2. Fetch Active Consultations
    const activeConsultations = await prisma.consultation.findMany({
      where: {
        doctorId: doctor.id,
        status: ConsultationStatus.IN_PROGRESS,
        // Active consultations might have started today, or we just rely on status.
      },
      include: {
        patient: true,
        appointment: true
      }
    });

    // 3. Calculate Statistics
    let confirmedAppointmentsCount = 0;
    let pendingAppointmentsCount = 0;
    let completedAppointmentsCount = 0;
    let totalPatientsSet = new Set<string>();

    todayAppointments.forEach(apt => {
      if (apt.status === AppointmentStatus.CONFIRMED) confirmedAppointmentsCount++;
      if (apt.status === AppointmentStatus.PENDING) pendingAppointmentsCount++;
      if (apt.status === AppointmentStatus.COMPLETED) completedAppointmentsCount++;
      totalPatientsSet.add(apt.patientId);
    });

    const statistics = {
      todayAppointments: todayAppointments.length,
      confirmedAppointments: confirmedAppointmentsCount,
      pendingAppointments: pendingAppointmentsCount,
      completedAppointments: completedAppointmentsCount,
      activeConsultations: activeConsultations.length,
      totalPatients: totalPatientsSet.size
    };

    // 4. Format Today's Schedule and Active Queue
    const activeQueueIds = new Set<string>();
    
    // Add IN_PROGRESS consultations to active queue
    const formattedQueue = activeConsultations.map(consult => {
      activeQueueIds.add(consult.appointmentId);
      
      const dob = consult.patient.dateOfBirth;
      const age = dob ? new Date().getFullYear() - dob.getFullYear() : 0;
      
      return {
        id: consult.appointmentId,
        patientId: consult.patientId,
        patientName: consult.patient.fullName,
        age,
        gender: consult.patient.gender || 'Unknown',
        time: consult.appointment.slotTime,
        date: 'Today',
        type: consult.appointment.type === 'VIDEO' ? 'Tele-Consultation' : 'OPD In-Clinic',
        status: 'In Consultation',
        reason: consult.appointment.reason || 'Consultation',
        isTele: consult.appointment.type === 'VIDEO',
        vitals: 'Waiting for vitals',
        statusColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      };
    });

    // Add CONFIRMED appointments to active queue
    const formattedSchedule = todayAppointments.map((apt) => {
      const dob = apt.patient.dateOfBirth;
      const age = dob ? new Date().getFullYear() - dob.getFullYear() : 0;
      
      const isQueueItem = apt.status === AppointmentStatus.CONFIRMED && !activeQueueIds.has(apt.id);
      
      const statusLabel = apt.status === AppointmentStatus.PENDING ? 'Waiting in Clinic' :
                          apt.status === AppointmentStatus.CONFIRMED ? 'Confirmed' :
                          apt.status === AppointmentStatus.COMPLETED ? 'Completed' :
                          apt.status === AppointmentStatus.CANCELLED ? 'Cancelled' : apt.status;
      
      const statusColor = apt.status === AppointmentStatus.CONFIRMED ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' : 
                          apt.status === AppointmentStatus.PENDING ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                          apt.status === AppointmentStatus.COMPLETED ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                          'bg-slate-500/15 text-slate-600 border-slate-500/30';

      const formattedApt = {
        id: apt.id,
        patientId: apt.patientId,
        patientName: apt.patient.fullName,
        age,
        gender: apt.patient.gender || 'Unknown',
        time: apt.slotTime,
        date: 'Today',
        type: apt.type === 'VIDEO' ? 'Tele-Consultation' : 'OPD In-Clinic',
        status: statusLabel,
        reason: apt.reason || 'Checkup',
        isTele: apt.type === 'VIDEO',
        vitals: 'Pending', 
        statusColor: statusColor
      };

      if (isQueueItem) {
        formattedQueue.push(formattedApt);
      }

      return formattedApt;
    });

    res.status(200).json({
      success: true,
      data: {
        doctor: {
          id: doctor.id,
          name: doctor.fullName,
          email: doctor.user.email
        },
        statistics,
        todaySchedule: formattedSchedule,
        activeQueue: formattedQueue
      }
    });
  } catch (error) {
    console.error('Doctor Dashboard API Error:', error);
    next(error);
  }
};
