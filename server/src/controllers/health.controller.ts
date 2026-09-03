import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'DHR Backend is running',
  });
};

export const getDatabaseHealth = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Perform a lightweight ping query through Prisma to verify MySQL connection
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: 'Database connected successfully',
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Database Health Check Error]:', err.message);

    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
    });
  }
};
