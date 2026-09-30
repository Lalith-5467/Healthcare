import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { VideoStatus } from '@prisma/client';

const logHistory = async (videoId: string, adminUserId: string, action: string, previousValue: any, newValue: any) => {
  await prisma.healthVideoHistory.create({
    data: {
      videoId,
      adminUserId,
      action,
      previousValue: previousValue ? JSON.stringify(previousValue) : null,
      newValue: newValue ? JSON.stringify(newValue) : null,
    },
  });
};

export const getHealthVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const videos = await prisma.healthVideo.findMany({
      include: { topics: { include: { topic: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addHealthVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const { youtubeVideoId, title, description, channelName, durationSeconds, keywords, hashtags, displayOrder, topics } = req.body;
    
    const video = await prisma.healthVideo.create({
      data: {
        youtubeVideoId,
        title,
        description,
        channelName,
        durationSeconds,
        keywords: JSON.stringify(keywords || []),
        hashtags: JSON.stringify(hashtags || []),
        displayOrder: displayOrder || 0,
        status: VideoStatus.APPROVED,
        enabled: true,
        createdBy: adminId,
        approvedBy: adminId,
        approvedAt: new Date(),
        topics: {
          create: topics?.map((t: string) => ({ topicId: t })) || []
        }
      }
    });

    await logHistory(video.id, adminId, 'CREATE', null, video);
    res.status(201).json({ success: true, data: video });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHealthVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const { id } = req.params;
    const { title, description, keywords, hashtags, displayOrder, topics } = req.body;

    const existing = await prisma.healthVideo.findUnique({ where: { id }, include: { topics: true } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }

    const updated = await prisma.healthVideo.update({
      where: { id },
      data: {
        title,
        description,
        keywords: keywords ? JSON.stringify(keywords) : existing.keywords,
        hashtags: hashtags ? JSON.stringify(hashtags) : existing.hashtags,
        displayOrder: displayOrder ?? existing.displayOrder,
      }
    });

    if (topics) {
      await prisma.healthVideoTopic.deleteMany({ where: { videoId: id } });
      for (const t of topics) {
        await prisma.healthVideoTopic.create({ data: { videoId: id, topicId: t } });
      }
    }

    await logHistory(id, adminId, 'UPDATE', existing, updated);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHealthVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const { id } = req.params;
    
    const existing = await prisma.healthVideo.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }

    const deleted = await prisma.healthVideo.update({
      where: { id },
      data: { status: VideoStatus.DELETED, enabled: false }
    });

    await logHistory(id, adminId, 'DELETE', existing, deleted);
    res.json({ success: true, data: deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveHealthVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const { id } = req.params;

    const existing = await prisma.healthVideo.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }

    const updated = await prisma.healthVideo.update({
      where: { id },
      data: {
        status: VideoStatus.APPROVED,
        enabled: true,
        approvedBy: adminId,
        approvedAt: new Date()
      }
    });

    await logHistory(id, adminId, 'APPROVE', existing, updated);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const disableHealthVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const { id } = req.params;

    const existing = await prisma.healthVideo.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }

    const updated = await prisma.healthVideo.update({
      where: { id },
      data: { status: VideoStatus.DISABLED, enabled: false }
    });

    await logHistory(id, adminId, 'DISABLE', existing, updated);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreHealthVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const { id } = req.params;

    const existing = await prisma.healthVideo.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Video not found' });
      return;
    }

    const updated = await prisma.healthVideo.update({
      where: { id },
      data: { status: VideoStatus.APPROVED, enabled: true }
    });

    await logHistory(id, adminId, 'RESTORE', existing, updated);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const undoHealthVideoChange = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user.id;
    const { id } = req.params;
    const { historyId } = req.body;

    const historyRecord = await prisma.healthVideoHistory.findUnique({ where: { id: historyId } });
    if (!historyRecord || historyRecord.videoId !== id) {
      res.status(404).json({ success: false, message: 'History record not found' });
      return;
    }

    if (!historyRecord.previousValue) {
      res.status(400).json({ success: false, message: 'No previous state to restore' });
      return;
    }

    const previousState = JSON.parse(historyRecord.previousValue);
    const existing = await prisma.healthVideo.findUnique({ where: { id } });

    // Using transaction
    const [updated, newHistory] = await prisma.$transaction([
      prisma.healthVideo.update({
        where: { id },
        data: {
          title: previousState.title,
          description: previousState.description,
          keywords: previousState.keywords,
          hashtags: previousState.hashtags,
          status: previousState.status,
          enabled: previousState.enabled,
          displayOrder: previousState.displayOrder,
        }
      }),
      prisma.healthVideoHistory.create({
        data: {
          videoId: id,
          adminUserId: adminId,
          action: 'UNDO',
          previousValue: JSON.stringify(existing),
          newValue: JSON.stringify(previousState),
          undoStatus: true
        }
      })
    ]);

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHealthVideoHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.query;
    const history = await prisma.healthVideoHistory.findMany({
      where: videoId ? { videoId: String(videoId) } : undefined,
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getHealthTopics = async (req: Request, res: Response): Promise<void> => {
  try {
    const topics = await prisma.healthTopic.findMany({ orderBy: { displayName: 'asc' } });
    res.json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addHealthTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topicKey, displayName, description, searchKeywords, hashtags } = req.body;
    const topic = await prisma.healthTopic.create({
      data: {
        topicKey,
        displayName,
        description,
        searchKeywords: JSON.stringify(searchKeywords || []),
        hashtags: JSON.stringify(hashtags || []),
      }
    });
    res.status(201).json({ success: true, data: topic });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHealthTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { topicKey, displayName, description, searchKeywords, hashtags, enabled } = req.body;
    const topic = await prisma.healthTopic.update({
      where: { id },
      data: {
        topicKey,
        displayName,
        description,
        searchKeywords: searchKeywords ? JSON.stringify(searchKeywords) : undefined,
        hashtags: hashtags ? JSON.stringify(hashtags) : undefined,
        enabled
      }
    });
    res.json({ success: true, data: topic });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHealthTopic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const topic = await prisma.healthTopic.delete({ where: { id } });
    res.json({ success: true, data: topic });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
