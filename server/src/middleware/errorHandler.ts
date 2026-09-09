import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma Known Errors
  if (err.name === 'PrismaClientKnownRequestError' || err.code === 'P2002') {
    statusCode = 409;
    const target = err.meta?.target;
    if (Array.isArray(target) && target.includes('email')) {
      message = 'An account with this email address already exists.';
    } else if (Array.isArray(target) && target.includes('abhaId')) {
      message = 'This ABHA ID is already linked to another account. Please use a different ABHA ID or leave it empty.';
    } else if (typeof target === 'string' && target.includes('abhaId')) {
      message = 'This ABHA ID is already linked to another account. Please use a different ABHA ID or leave it empty.';
    } else if (typeof target === 'string' && target.includes('email')) {
      message = 'An account with this email address already exists.';
    } else {
      message = 'A record with these unique details already exists. Please review your input.';
    }
  }

  console.error(`[Error] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {}),
  });
};
