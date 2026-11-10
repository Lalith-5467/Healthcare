import { apiClient } from './apiClient';

export interface DynamicHealthShort {
  id: string;
  videoId?: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelTitle?: string;
  description: string;
  publishedAt: string;
  duration: string;
  url: string;
  youtubeUrl?: string;
  embedUrl?: string;
  category: string;
  relevanceScore: number;
}

export interface HealthShortsResponse {
  success: boolean;
  query?: string;
  category?: string;
  count: number;
  nextPageToken?: string;
  videos: DynamicHealthShort[];
  message?: string;
}

export const healthShortsApi = {
  /**
   * Search health shorts dynamically by query, category filter and pageToken pagination
   */
  searchShorts: async (
    query: string = '',
    category: string = 'For You',
    pageToken?: string,
    limit: number = 20
  ): Promise<{ videos: DynamicHealthShort[]; nextPageToken?: string }> => {
    try {
      const q = encodeURIComponent(query.trim());
      const cat = encodeURIComponent(category.trim());
      const pt = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
      const res = await apiClient.get<HealthShortsResponse>(
        `/health-shorts/search?q=${q}&category=${cat}&limit=${limit}${pt}`
      );
      if (res && res.videos && Array.isArray(res.videos)) {
        return {
          videos: res.videos,
          nextPageToken: res.nextPageToken
        };
      }
      return { videos: [], nextPageToken: undefined };
    } catch (err) {
      console.error('[HealthShortsApi search error]:', err);
      return { videos: [], nextPageToken: undefined };
    }
  },


  /**
   * Get dynamic feed for a category tab
   */
  getCategoryFeed: async (category: string = 'For You', limit: number = 4): Promise<DynamicHealthShort[]> => {
    try {
      const cat = encodeURIComponent(category.trim());
      const res = await apiClient.get<HealthShortsResponse>(
        `/health-shorts/feed?category=${cat}&limit=${limit}`
      );
      if (res && res.videos && Array.isArray(res.videos)) {
        return res.videos;
      }
      return [];
    } catch (err) {
      console.error('[HealthShortsApi feed error]:', err);
      return [];
    }
  },

  /**
   * Fetch live YouTube-style autocomplete suggestions
   */
  getSuggestions: async (query: string): Promise<string[]> => {
    if (!query || !query.trim()) return [];
    try {
      const q = encodeURIComponent(query.trim());
      const res = await apiClient.get<{ success: boolean; suggestions: string[] }>(
        `/health-shorts/suggest?q=${q}`
      );
      if (res && Array.isArray(res.suggestions)) {
        return res.suggestions;
      }
      return [];
    } catch (err) {
      return [];
    }
  }
};

