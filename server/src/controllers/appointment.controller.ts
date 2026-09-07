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

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { doctorId, patientId, patientName, date, time, type, reason } = req.body;

    // Use a fallback patient and doctor if not provided or if it's a mock ID
    const fallbackPatient = await prisma.patient.findFirst();
    const fallbackDoctor = await prisma.doctor.findFirst();

    if (!fallbackPatient || !fallbackDoctor) {
      return res.status(500).json({ success: false, message: 'Database must have at least 1 patient and 1 doctor' });
    }

    let actualPatientId = fallbackPatient.id;
    if (patientId) {
      const p = await prisma.patient.findUnique({ where: { id: patientId } });
      if (p) actualPatientId = p.id;
    } else if (patientName) {
      const p = await prisma.patient.findFirst({ where: { fullName: patientName } });
      if (p) actualPatientId = p.id;
    }

    let actualDoctorId = fallbackDoctor.id;
    if (doctorId) {
      const d = await prisma.doctor.findUnique({ where: { id: doctorId } });
      if (d) actualDoctorId = d.id;
    }

    // Parse date (e.g. "07 Sep 2026")
    let appointmentDate = new Date();
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        appointmentDate = parsedDate;
      }
    }

    // Prisma Enum for type is 'VIDEO' or 'IN_PERSON'
    const appointmentType = type === 'Video' ? 'VIDEO' : 'IN_PERSON';

    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: actualPatientId,
        doctorId: actualDoctorId,
        appointmentDate: appointmentDate,
        slotTime: time || '10:00 AM',
        type: appointmentType,
        status: 'CONFIRMED', // Set as confirmed right away for simplicity
        reason: reason || 'Routine Checkup'
      },
      include: {
        doctor: true,
        patient: true
      }
    });

    res.status(201).json({
      success: true,
      data: newAppointment
    });
  } catch (error) {
    next(error);
  }
};
