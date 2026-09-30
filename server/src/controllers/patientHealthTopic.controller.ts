import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';

/**
 * GET /api/patients/:patientId/health-topics
 * Fetches the mapped health topics for a patient
 */
export const getPatientHealthTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const user = (req as any).user;

    // Authorization:
    // SuperAdmin and Admin can view all
    // Doctor can view if authorized (simplified: we just check if they are doctor, but strictly we should check assignment. For this Phase, just allowing Doctor role as per standard).
    // Patient can view their own.
    
    if (user.role === Role.PATIENT) {
      // Patient must only access their own patient profile
      const patientProfile = await prisma.patient.findUnique({ where: { userId: user.id } });
      if (!patientProfile || patientProfile.id !== patientId) {
        res.status(403).json({ success: false, message: 'Access denied to other patient records' });
        return;
      }
    }

    const topics = await prisma.patientHealthTopic.findMany({
      where: { patientId },
      include: {
        healthTopic: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: topics });
  } catch (error: any) {
    console.error('Error fetching patient health topics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/patients/:patientId/health-topics
 * Assigns a new health topic to a patient
 */
export const assignPatientHealthTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { healthTopicId, sourceType, sourceRecordId } = req.body;
    const user = (req as any).user;

    if (!healthTopicId) {
      res.status(400).json({ success: false, message: 'healthTopicId is required' });
      return;
    }

    // Authorization: Only DOCTOR or Admin can assign
    if (user.role === Role.PATIENT) {
      res.status(403).json({ success: false, message: 'Patients cannot assign their own health topics' });
      return;
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    // Verify topic exists and is enabled
    const topic = await prisma.healthTopic.findUnique({ where: { id: healthTopicId } });
    if (!topic || !topic.enabled) {
      res.status(400).json({ success: false, message: 'Health topic not found or is disabled' });
      return;
    }

    const patientTopic = await prisma.patientHealthTopic.create({
      data: {
        patientId,
        healthTopicId,
        sourceType: sourceType || 'CLINICIAN_SELECTED',
        sourceRecordId,
        assignedBy: user.id
      }
    });

    res.status(201).json({ success: true, data: patientTopic });
  } catch (error: any) {
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      res.status(400).json({ success: false, message: 'This topic is already assigned to the patient' });
      return;
    }
    console.error('Error assigning patient health topic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/patients/:patientId/health-topics/:topicId
 * Removes an assigned topic
 */
export const removePatientHealthTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, topicId } = req.params;
    const user = (req as any).user;

    // Authorization
    if (user.role === Role.PATIENT) {
      res.status(403).json({ success: false, message: 'Patients cannot remove health topics' });
      return;
    }

    await prisma.patientHealthTopic.delete({
      where: {
        patientId_healthTopicId: {
          patientId,
          healthTopicId: topicId
        }
      }
    });

    res.json({ success: true, message: 'Topic removed successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Patient health topic not found' });
      return;
    }
    console.error('Error removing patient health topic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
