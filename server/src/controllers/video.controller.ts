import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { VideoStatus } from '@prisma/client';

interface DiscoveryCache {
  timestamp: number;
}
const discoveryCache: Record<string, DiscoveryCache> = {};
const DISCOVERY_COOLDOWN = 1000 * 60 * 60 * 4; // 4 hours cooldown per topic

const parseISO8601Duration = (duration: string) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
};

export const getHealthVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    const userId = (req as any).user?.id;
    let patient = userId ? await prisma.patient.findUnique({
      where: { userId }
    }) : null;

    if (!patient) {
      patient = await prisma.patient.findFirst();
    }

    // 1. Fetch explicitly assigned HealthTopics for this patient if available
    let patientTopics = patient ? await prisma.patientHealthTopic.findMany({
      where: { patientId: patient.id },
      include: { healthTopic: true }
    }) : [];

    const topicIds = patientTopics.map(pt => pt.healthTopicId);

    // 2. Query APPROVED videos matching those topics (or all approved videos if none)
    let dbVideos = [];
    if (topicIds.length > 0) {
      dbVideos = await prisma.healthVideo.findMany({
        where: {
          status: VideoStatus.APPROVED,
          enabled: true,
          topics: {
            some: { topicId: { in: topicIds } }
          }
        },
        orderBy: [
          { displayOrder: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 20
      });
    }

    // Fallback: If no topic-specific videos matched, return all approved videos
    if (dbVideos.length === 0) {
      dbVideos = await prisma.healthVideo.findMany({
        where: {
          status: VideoStatus.APPROVED,
          enabled: true,
        },
        orderBy: [
          { displayOrder: 'desc' },
          { createdAt: 'desc' }
        ],
        take: 20
      });
    }

    // 3. Format Response
    const formattedVideos = dbVideos.map(v => ({
      id: v.youtubeVideoId,
      title: v.title,
      channelTitle: v.channelName,
      duration: v.durationSeconds || 10,
      personalized: topicIds.length > 0
    }));

    // Deduplicate (just in case)
    const uniqueMap = new Map();
    formattedVideos.forEach(v => uniqueMap.set(v.id, v));
    const finalVideos = Array.from(uniqueMap.values());

    res.json({ videos: finalVideos });

    // 4. Discovery Layer (Background - only if API key is present)
    if (!apiKey) return;
    const topicsToDiscover = [];
    for (const pt of patientTopics) {
      const topic = pt.healthTopic;
      const count = await prisma.healthVideoTopic.count({
        where: {
          topicId: topic.id,
          video: {
            status: VideoStatus.APPROVED,
            enabled: true,
            durationSeconds: { gte: 5, lte: 10 }
          }
        }
      });
      if (count < 5) {
        topicsToDiscover.push(topic);
      }
    }

    for (const topic of topicsToDiscover) {
      if (discoveryCache[topic.topicKey] && Date.now() - discoveryCache[topic.topicKey].timestamp < DISCOVERY_COOLDOWN) {
        continue;
      }
      
      discoveryCache[topic.topicKey] = { timestamp: Date.now() };

      try {
        let keywords = [];
        try {
          keywords = JSON.parse(topic.searchKeywords);
        } catch(e) {}
        
        const queryTerm = keywords.length > 0 ? keywords[0] : topic.displayName;

        const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
        searchUrl.searchParams.append('part', 'snippet');
        searchUrl.searchParams.append('q', `${queryTerm} tamil`);
        searchUrl.searchParams.append('type', 'video');
        searchUrl.searchParams.append('videoDuration', 'short');
        searchUrl.searchParams.append('relevanceLanguage', 'ta');
        searchUrl.searchParams.append('maxResults', '5');
        searchUrl.searchParams.append('key', apiKey);

        const searchRes = await fetch(searchUrl.toString());
        const searchData = await searchRes.json() as any;
        
        if (!searchData.items || searchData.items.length === 0) continue;

        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
        
        const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
        detailsUrl.searchParams.append('part', 'snippet,contentDetails');
        detailsUrl.searchParams.append('id', videoIds);
        detailsUrl.searchParams.append('key', apiKey);

        const detailsRes = await fetch(detailsUrl.toString());
        const detailsData = await detailsRes.json() as any;

        if (!detailsData.items) continue;

        for (const item of detailsData.items) {
          const duration = parseISO8601Duration(item.contentDetails.duration);
          if (duration >= 5 && duration <= 10) {
            const existing = await prisma.healthVideo.findUnique({
              where: { youtubeVideoId: item.id }
            });

            if (!existing) {
              const newVideo = await prisma.healthVideo.create({
                data: {
                  youtubeVideoId: item.id,
                  title: item.snippet.title,
                  channelName: item.snippet.channelTitle,
                  durationSeconds: duration,
                  status: VideoStatus.PENDING_REVIEW,
                  enabled: false,
                  createdBy: 'SYSTEM'
                }
              });
              await prisma.healthVideoTopic.create({
                data: { videoId: newVideo.id, topicId: topic.id }
              });
            } else {
              const link = await prisma.healthVideoTopic.findUnique({
                where: { videoId_topicId: { videoId: existing.id, topicId: topic.id } }
              });
              if (!link) {
                await prisma.healthVideoTopic.create({
                  data: { videoId: existing.id, topicId: topic.id }
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("YouTube API discovery error for category:", topic.topicKey, err);
      }
    }

  } catch (error) {
    console.error('Error fetching health videos:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch health videos' });
    }
  }
};
