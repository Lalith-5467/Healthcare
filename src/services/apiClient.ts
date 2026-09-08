/**
 * Centralized API Client for Digital Health Record (DHR)
 * Ensures all requests send the Authorization Bearer token from localStorage
 */

// Use relative path so Vite's dev-server proxy forwards /api/* → localhost:5000/api/*
// In production, set VITE_API_URL to the deployed backend base URL.
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('auth_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('jwt') ||
    null
  );
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token', token);
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  }
};

let isReauthenticating = false;

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  let token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (_netErr: any) {
    throw new Error('Unable to connect to the backend server. Please ensure the backend service is running on port 5000.');
  }

  let text = '';
  try {
    text = await response.text();
  } catch {
    text = '';
  }

  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (response.status === 401
        ? 'Invalid credentials. Please verify your email and password.'
        : response.status === 403
        ? 'Access denied. You do not have permission for this resource.'
        : response.status === 502 || response.status === 504
        ? 'Backend service is currently unreachable (Port 5000). Please start the backend server.'
        : `Request failed (Status ${response.status})`);
    throw new Error(errorMsg);
  }

  if (!data) {
    return { success: true, data: {} as T };
  }

  return data;
}

export const apiClient = {
  get: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'GET', headers }),

  post: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  patch: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  put: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),

  delete: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    }),
};
