import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { VideoStatus } from '@prisma/client';
import { searchHealthShorts } from '../services/healthShorts.service';

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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
    
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
    const id = req.params.id as string;

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
    const id = req.params.id as string;

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
    const id = req.params.id as string;

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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
    const topic = await prisma.healthTopic.delete({ where: { id } });
    res.json({ success: true, data: topic });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function parseDurationToSeconds(durationStr?: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(':').map(p => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const parsed = parseInt(durationStr, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * POST /api/admin/health/videos/sync
 * Super Admin endpoint to synchronize discovered YouTube Shorts into HealthVideo review queue
 */
export const syncHealthVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = (req as any).user?.id || 'SUPER_ADMIN';
    const { category, query, limit = 20 } = req.body || {};

    // Standard health categories used across MediCare Patient Portal
    const categoriesToSync = category 
      ? [category] 
      : ['For You', 'Wellness', 'Fitness', 'Diet', 'Nattu Maruthuvam', 'Preventive Health'];

    let totalDiscovered = 0;
    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const seenYtIds = new Set<string>();

    for (const cat of categoriesToSync) {
      try {
        const result = await searchHealthShorts(query || '', cat, undefined, limit);
        const candidates = result.videos || [];

        for (const cand of candidates) {
          if (!cand.videoId || seenYtIds.has(cand.videoId)) continue;
          seenYtIds.add(cand.videoId);
          totalDiscovered++;

          // Check if video already exists in database
          const existing = await prisma.healthVideo.findUnique({
            where: { youtubeVideoId: cand.videoId }
          });

          if (existing) {
            // Preservation requirement: DO NOT overwrite or revert existing moderation decisions!
            // If it is DISABLED, DELETED, or APPROVED, keep existing status and enabled flag!
            let hasMetadataUpdate = false;
            const updateData: any = {};
            if (!existing.channelName && (cand.channelName || cand.channelTitle)) {
              updateData.channelName = cand.channelName || cand.channelTitle;
              hasMetadataUpdate = true;
            }
            if (!existing.description && cand.description) {
              updateData.description = cand.description;
              hasMetadataUpdate = true;
            }
            if (existing.durationSeconds === 0 && cand.duration) {
              const dur = parseDurationToSeconds(cand.duration);
              if (dur > 0) {
                updateData.durationSeconds = dur;
                hasMetadataUpdate = true;
              }
            }

            if (hasMetadataUpdate) {
              await prisma.healthVideo.update({
                where: { id: existing.id },
                data: updateData
              });
              updatedCount++;
            } else {
              skippedCount++;
            }
          } else {
            // New discovery: MUST enter PENDING_REVIEW review state, not auto-approved
            const dur = parseDurationToSeconds(cand.duration);
            const created = await prisma.healthVideo.create({
              data: {
                youtubeVideoId: cand.videoId,
                title: cand.title,
                description: cand.description || null,
                channelName: cand.channelName || cand.channelTitle || null,
                durationSeconds: dur,
                keywords: JSON.stringify([]),
                hashtags: JSON.stringify([]),
                status: VideoStatus.PENDING_REVIEW,
                enabled: false,
                displayOrder: 0,
                createdBy: adminId || 'SYSTEM_DISCOVERY',
              }
            });

            // If a topic exists matching category, associate it
            try {
              const matchedTopic = await prisma.healthTopic.findFirst({
                where: {
                  OR: [
                    { topicKey: { equals: cat.toLowerCase().replace(/\s+/g, '_') } },
                    { displayName: { equals: cat } }
                  ]
                }
              });
              if (matchedTopic) {
                await prisma.healthVideoTopic.create({
                  data: {
                    videoId: created.id,
                    topicId: matchedTopic.id
                  }
                });
              }
            } catch {}

            await logHistory(created.id, adminId, 'DISCOVER', null, {
              source: 'YouTube Discovery',
              category: cat,
              status: VideoStatus.PENDING_REVIEW
            });

            insertedCount++;
          }
        }
      } catch (catErr) {
        console.warn(`[Sync Health Videos] Error searching category "${cat}":`, catErr);
      }
    }

    res.status(200).json({
      success: true,
      message: `YouTube Shorts discovery synchronization completed successfully.`,
      stats: {
        discovered: totalDiscovered,
        inserted: insertedCount,
        updated: updatedCount,
        skipped: skippedCount
      }
    });
  } catch (error: any) {
    console.error('[Sync Health Videos Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to synchronize YouTube Shorts'
    });
  }
};

