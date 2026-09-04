import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export const getTodaySchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real app we'd get doctorId from req.user
    // For this prototype we'll just grab the first doctor
    const doctor = await prisma.doctor.findFirst();
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        // In a real app, filter by appointmentDate for today
      },
      include: {
        patient: true
      },
      orderBy: {
        slotTime: 'asc'
      }
    });

    const formattedSlots = appointments.map((apt, index) => {
      // Calculate age
      const dob = apt.patient.dateOfBirth;
      const age = dob ? new Date().getFullYear() - dob.getFullYear() : 0;
      
      let parsedNotes: any = {};
      try {
        if (apt.notes) {
          parsedNotes = JSON.parse(apt.notes);
        }
      } catch (e) {}

      return {
        id: apt.id,
        recordId: apt.id,
        patientId: `PT-${Math.floor(10000 + Math.random() * 90000)}`, // Dummy PT-id for UI
        patientName: apt.patient.fullName,
        age,
        gender: apt.patient.gender,
        time: apt.slotTime,
        date: 'Today',
        type: apt.type === 'VIDEO' ? 'Tele-Consultation' : 'OPD In-Clinic',
        status: parsedNotes.uiStatus || 'Scheduled',
        reason: apt.reason || 'Routine Checkup',
        isTele: apt.type === 'VIDEO',
        department: doctor.speciality,
        delayDuration: parsedNotes.delay,
        completedAt: parsedNotes.uiStatus === 'Completed' ? apt.slotTime : undefined,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedSlots
    });
  } catch (error) {
    next(error);
  }
};
