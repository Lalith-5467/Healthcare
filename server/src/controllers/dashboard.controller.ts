import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

export const getStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await DashboardService.getStats(req.user!.id, req.user!.role);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
