import { prisma } from '../config/prisma';

export interface CreateAuditLogParams {
  userId?: string | null;
  action: 'USER_STATUS_CHANGED' | 'USER_ROLE_CHANGED' | 'PROFILE_UPDATED' | string;
  entityType: string;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | string | null;
}

export class AuditService {
  static async log(params: CreateAuditLogParams): Promise<void> {
    try {
      const detailsStr =
        typeof params.details === 'object' && params.details !== null
          ? JSON.stringify(params.details)
          : (params.details as string | null);

      await prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId || null,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          details: detailsStr || null,
        },
      });
    } catch (error) {
      console.error('[AuditLog Error]: Failed to create audit log entry:', error);
      // We don't want audit logging failure to crash the request
    }
  }
}
