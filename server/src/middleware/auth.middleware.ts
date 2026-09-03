import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config } from '../config/env';
import { prisma } from '../config/prisma';

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid. Please provide Bearer token.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token is required',
      });
      return;
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (err: unknown) {
      const error = err as jwt.VerifyErrors;
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Authentication token has expired. Please login again.',
        });
        return;
      }
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
      return;
    }

    // Verify user exists and is active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        abhaId: true,
        phoneNumber: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists or account is inactive.',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      abhaId: user.abhaId,
      phoneNumber: user.phoneNumber,
    };

    next();
  } catch (error) {
    next(error);
  }
};
