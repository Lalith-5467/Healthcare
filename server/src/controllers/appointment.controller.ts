import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointment.service';

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
