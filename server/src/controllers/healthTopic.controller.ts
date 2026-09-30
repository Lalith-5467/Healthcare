import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getAllHealthTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const topics = await prisma.healthTopic.findMany({
      where: { enabled: true },
      orderBy: { displayName: 'asc' }
    });
    res.json({ success: true, data: topics });
  } catch (error: any) {
    console.error('Error fetching health topics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
