import { Request, Response } from 'express';
import { searchHealthShorts } from '../services/healthShorts.service';

/**
 * GET /api/health-shorts/search?q=fitness&category=Fitness&pageToken=...&limit=20
 * Dynamic Health Shorts Search Endpoint with Pagination
 */
export const searchHealthShortsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawQuery = typeof req.query.q === 'string' ? req.query.q : '';
    const rawCategory = typeof req.query.category === 'string' ? req.query.category : 'For You';
    const rawPageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken.trim() : undefined;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);

    // Sanitize query to prevent injection or abuse (max 100 characters)
    const sanitizedQuery = rawQuery.replace(/[<>{}\\]/g, '').slice(0, 100).trim();
    const sanitizedCategory = rawCategory.replace(/[<>{}\\]/g, '').slice(0, 50).trim();

    const result = await searchHealthShorts(sanitizedQuery, sanitizedCategory, rawPageToken, limit);

    res.status(200).json({
      success: true,
      query: sanitizedQuery,
      category: sanitizedCategory,
      count: result.videos.length,
      nextPageToken: result.nextPageToken,
      videos: result.videos
    });
  } catch (error) {
    console.error('[Health Shorts Search Controller Error]:', error);
    res.status(200).json({
      success: false,
      message: 'Health Shorts are temporarily unavailable. Please try again.',
      videos: []
    });
  }
};

/**
 * GET /api/health-shorts/feed?category=Wellness&pageToken=...&limit=20
 * Dynamic Category Feed Endpoint with Pagination
 */
export const getHealthShortsFeedController = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawCategory = typeof req.query.category === 'string' ? req.query.category : 'For You';
    const rawPageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken.trim() : undefined;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const sanitizedCategory = rawCategory.replace(/[<>{}\\]/g, '').slice(0, 50).trim();

    const result = await searchHealthShorts('', sanitizedCategory, rawPageToken, limit);

    res.status(200).json({
      success: true,
      category: sanitizedCategory,
      count: result.videos.length,
      nextPageToken: result.nextPageToken,
      videos: result.videos
    });
  } catch (error) {
    console.error('[Health Shorts Feed Controller Error]:', error);
    res.status(200).json({
      success: false,
      message: 'Health Shorts are temporarily unavailable. Please try again.',
      videos: []
    });
  }
};
