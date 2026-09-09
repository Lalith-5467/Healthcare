import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export type AllowedRole = Role | 'INSURANCE' | 'SUPER_ADMIN' | string;

/**
 * Normalizes role aliases to the Prisma Role enum
 */
export function normalizeRole(role: string): Role {
  const upper = role.toUpperCase();
  if (upper === 'INSURANCE') return Role.INSURANCE_PROVIDER;
  return upper as Role;
}

/**
 * Reusable Role-Based Authorization Middleware
 *
 * Usage:
 *   router.get('/patient', authenticate, requireRole('PATIENT', 'ADMIN', 'SUPER_ADMIN'), getPatient);
 *   router.patch('/users/:id/role', authenticate, requireRole('SUPER_ADMIN'), updateRole);
 */
export const requireRole = (...allowedRoles: AllowedRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required before verifying permissions.',
      });
      return;
    }

    const userRole = normalizeRole(req.user.role);
    const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));

    // SUPER_ADMIN has access to all protected endpoints
    if (userRole === Role.SUPER_ADMIN) {
      next();
      return;
    }

    // Check if user's role is in allowed roles list
    const isAuthorized = normalizedAllowed.includes(userRole);

    if (!isAuthorized) {
      res.status(403).json({
        success: false,
        message: `Access denied: insufficient permissions. Required: [${allowedRoles.join(', ')}], Current: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};
