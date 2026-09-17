import { apiClient } from './apiClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  get: async (url: string) => {
    const endpoint = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    return apiClient.get(endpoint);
  },
  post: async (url: string, body?: any) => {
    const endpoint = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    return apiClient.post(endpoint, body);
  },
  put: async (url: string, body?: any) => {
    const endpoint = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    return apiClient.put(endpoint, body);
  },
  delete: async (url: string) => {
    const endpoint = url.startsWith('http') ? url : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    return apiClient.delete(endpoint);
  },
};

export default api;
