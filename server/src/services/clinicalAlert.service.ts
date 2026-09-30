import { Vital } from '@prisma/client';
import { prisma } from '../config/prisma';
import { NotificationService } from './notification.service';
import { CLINICAL_RULES } from '../config/clinicalAlertRules';

export class ClinicalAlertService {
  /**
   * Evaluates a newly recorded vital against clinical thresholds.
   */
  static async evaluateVital(vital: Vital) {
    let isAbnormal = false;
    let message = 'An abnormal vital reading was detected. Please review the reading with your healthcare provider.';
    
    // Evaluate against activated rules
    for (const rule of CLINICAL_RULES) {
      if (!rule.enabled) continue;

      if (rule.vitalType === 'oxygenSaturation' && vital.oxygenSaturation !== null) {
        if (rule.operator === '<' && vital.oxygenSaturation < rule.threshold!) {
          isAbnormal = true;
        }
      }

      if (rule.vitalType === 'bloodPressure' && (vital.systolicBp !== null || vital.diastolicBp !== null)) {
        if (rule.operator === '>=') {
          const sysAbnormal = vital.systolicBp !== null && rule.threshold !== undefined && vital.systolicBp >= rule.threshold;
          const diaAbnormal = vital.diastolicBp !== null && rule.secondaryThreshold !== undefined && vital.diastolicBp >= rule.secondaryThreshold;
          
          if (sysAbnormal || diaAbnormal) {
            isAbnormal = true;
          }
        }
      }
    }

    if (!isAbnormal) return;

    // 2. Fetch Patient Profile
    const patient = await prisma.patient.findUnique({
      where: { id: vital.patientId },
      include: { caregivers: true }
    });

    if (!patient) return;

    // 3. Deduplication Check (Cooldown: 4 hours for the same patient and rule type)
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const existing = await prisma.notification.findFirst({
      where: {
        userId: patient.userId,
        category: 'ClinicalAlert',
        createdAt: { gte: fourHoursAgo }
      }
    });

    if (existing) {
      console.log(`[ClinicalAlertService] Duplicate alert prevented for patient ${patient.userId}`);
      return;
    }

    // 4. Dispatch Alert Event to Authorized Recipients
    // a. Notify Patient
    await this.notifyUser(patient.userId, 'Abnormal Vital Detected', message, 'ClinicalAlert');

    // b. Notify Authorized Doctors
    const activeRequests = await prisma.patientAccessRequest.findMany({
      where: {
        patientId: vital.patientId,
        status: 'APPROVED',
        expiresAt: { gt: new Date() }
      },
      include: { doctor: true }
    });

    for (const req of activeRequests) {
      if (req.doctor?.userId) {
        await this.notifyUser(req.doctor.userId, 'Patient Alert', 'An abnormal vital reading was detected for your patient.', 'ClinicalAlert');
      }
    }

    // c. Notify Linked Caregivers
    for (const caregiver of patient.caregivers) {
      if (caregiver.userId) {
         await this.notifyUser(caregiver.userId, 'Dependent Alert', 'An abnormal vital reading was detected for your dependent.', 'ClinicalAlert');
      }
    }
  }

  private static async notifyUser(userId: string, title: string, message: string, category: string) {
    try {
      await NotificationService.createNotification({
        userId,
        title,
        message,
        type: 'SYSTEM',
        category,
        relatedModule: 'Vitals'
      });
    } catch (error) {
      console.error(`Failed to dispatch clinical alert to user ${userId}`);
      // Do not throw, preserve vital record saving
    }
  }
}
