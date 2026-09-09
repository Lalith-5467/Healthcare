import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { prisma } from '../config/prisma';

export const getAppointmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await AppointmentService.getAppointments(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTodaySchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let doctor = null;
    if (req.user?.id) {
      doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    }
    if (!doctor) {
      doctor = await prisma.doctor.findFirst();
    }

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: true
      },
      orderBy: {
        slotTime: 'asc'
      }
    });

    const formattedSlots = appointments.map((apt) => {
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
        patientId: apt.patientId,
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

export const getAppointmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AppointmentService.getAppointmentById(id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await AppointmentService.createAppointment(req.user!.id, req.user!.role, req.body);
    res.status(201).json({ success: true, message: 'Appointment booked successfully', data });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return createAppointmentController(req, res, next);
  }
  try {
    const { doctorId, patientId, patientName, date, time, type, reason } = req.body;

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

    let appointmentDate = new Date();
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        appointmentDate = parsedDate;
      }
    }

    const appointmentType = type === 'Video' ? 'VIDEO' : 'IN_PERSON';

    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: actualPatientId,
        doctorId: actualDoctorId,
        appointmentDate: appointmentDate,
        slotTime: time || '10:00 AM',
        type: appointmentType,
        status: 'CONFIRMED',
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

export const updateAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AppointmentService.updateAppointment(id, req.body);
    res.status(200).json({ success: true, message: 'Appointment updated successfully', data });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AppointmentService.cancelAppointment(id, req.body?.reason);
    res.status(200).json({ success: true, message: 'Appointment cancelled', data });
  } catch (error) {
    next(error);
  }
};
