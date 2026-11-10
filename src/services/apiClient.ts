/**
 * Centralized API Client for Digital Health Record (DHR)
 * Ensures all requests send the Authorization Bearer token from localStorage
 */

// Use direct backend URL on port 5000 in dev, or VITE_API_URL if configured
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  videos?: any;
  nextPageToken?: string;
  [key: string]: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

import { safeLocalStorageSet, safeLocalStorageRemove } from '../utils/safeStorage';

export const parseJwtRole = (token: string): string | null => {
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      return payload.role ? String(payload.role).toUpperCase() : null;
    }
  } catch {}
  return null;
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname.toLowerCase();
  const isDoctorPortal = path.startsWith('/doctor');
  const isNursePortal = path.startsWith('/nurse');
  const isPharmaPortal = path.startsWith('/pharmacist');
  const isCaregiverPortal = path.startsWith('/caregiver');
  const isInsurancePortal = path.startsWith('/insurance');
  const isAdminPortal = path.startsWith('/admin');
  const isUserPortal = path.startsWith('/user') || (!isDoctorPortal && !isNursePortal && !isPharmaPortal && !isCaregiverPortal && !isInsurancePortal && !isAdminPortal);

  // Check role-specific token first
  if (isUserPortal) {
    const pt = localStorage.getItem('patient_token');
    if (pt) return pt;
  } else if (isDoctorPortal) {
    const dt = localStorage.getItem('doctor_token');
    if (dt) return dt;
  } else if (isPharmaPortal) {
    const pht = localStorage.getItem('pharmacist_token');
    if (pht) return pht;
  } else if (isNursePortal) {
    const nt = localStorage.getItem('nurse_token');
    if (nt) return nt;
  } else if (isCaregiverPortal) {
    const ct = localStorage.getItem('caregiver_token');
    if (ct) return ct;
  } else if (isInsurancePortal) {
    const it = localStorage.getItem('insurance_token');
    if (it) return it;
  } else if (isAdminPortal) {
    const at = localStorage.getItem('super_admin_token') || localStorage.getItem('admin_token');
    if (at) return at;
  }

  const primary = (
    localStorage.getItem('auth_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('jwt') ||
    null
  );

  if (primary) {
    const role = parseJwtRole(primary);
    // Enforce strict portal token match - do not leak tokens across different role portals
    if (isUserPortal && role && role !== 'PATIENT') {
      return localStorage.getItem('patient_token') || primary;
    }
    if (isDoctorPortal && role && role !== 'DOCTOR') {
      return localStorage.getItem('doctor_token') || null;
    }
    if (isPharmaPortal && role && role !== 'PHARMACIST') {
      return localStorage.getItem('pharmacist_token') || null;
    }
    if (isNursePortal && role && role !== 'NURSE') {
      return localStorage.getItem('nurse_token') || null;
    }
    if (isCaregiverPortal && role && role !== 'CAREGIVER') {
      return localStorage.getItem('caregiver_token') || null;
    }
    if (isInsurancePortal && role && role !== 'INSURANCE_PROVIDER' && role !== 'INSURANCE') {
      return localStorage.getItem('insurance_token') || null;
    }
    if (isAdminPortal && role && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return localStorage.getItem('super_admin_token') || localStorage.getItem('admin_token') || null;
    }
    return primary;
  }

  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    safeLocalStorageSet('auth_token', token);
    safeLocalStorageSet('token', token);
    const role = parseJwtRole(token);
    if (role) {
      if (role === 'INSURANCE_PROVIDER' || role === 'INSURANCE') {
        safeLocalStorageSet('insurance_token', token);
      } else if (role === 'SUPER_ADMIN') {
        safeLocalStorageSet('super_admin_token', token);
        safeLocalStorageSet('admin_token', token);
      } else {
        safeLocalStorageSet(`${role.toLowerCase()}_token`, token);
      }
    }
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    safeLocalStorageRemove('auth_token');
    safeLocalStorageRemove('token');
    safeLocalStorageRemove('jwt');
    safeLocalStorageRemove('user');
    safeLocalStorageRemove('patient_token');
    safeLocalStorageRemove('doctor_token');
    safeLocalStorageRemove('pharmacist_token');
    safeLocalStorageRemove('nurse_token');
    safeLocalStorageRemove('caregiver_token');
    safeLocalStorageRemove('insurance_token');
    safeLocalStorageRemove('admin_token');
    safeLocalStorageRemove('super_admin_token');
  }
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit & { _isRetry?: boolean } = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const path = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  const isDoctorPortal = path.startsWith('/doctor');
  const isNursePortal = path.startsWith('/nurse');
  const isPharmaPortal = path.startsWith('/pharmacist');
  const isCaregiverPortal = path.startsWith('/caregiver');
  const isInsurancePortal = path.startsWith('/insurance');
  const isAdminPortal = path.startsWith('/admin');

  let portalRole = 'PATIENT';
  if (isDoctorPortal) portalRole = 'DOCTOR';
  else if (isNursePortal) portalRole = 'NURSE';
  else if (isPharmaPortal) portalRole = 'PHARMACIST';
  else if (isCaregiverPortal) portalRole = 'CAREGIVER';
  else if (isInsurancePortal) portalRole = 'INSURANCE_PROVIDER';
  else if (isAdminPortal) portalRole = 'ADMIN';

  headers['x-portal-role'] = headers['x-portal-role'] || portalRole;
  if (isDoctorPortal) {
    let docEmail = '';
    try {
      const storedDoctorUser = localStorage.getItem('doctor_user') || localStorage.getItem('app_user') || localStorage.getItem('user');
      if (storedDoctorUser) {
        const parsed = JSON.parse(storedDoctorUser);
        if (parsed.email) docEmail = parsed.email;
      }
    } catch {}
    if (docEmail) {
      headers['x-doctor-email'] = headers['x-doctor-email'] || docEmail;
    }
  }

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

  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:session_expired'));
    }
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
      response.status === 401
        ? (data?.message || 'Invalid credentials. Please verify your email and password.')
        : response.status === 403
        ? (data?.message || 'Access denied. You do not have permission for this resource.')
        : response.status === 502 || response.status === 504
        ? (data?.message || 'Backend service is currently unreachable (Port 5000). Please start the backend server.')
        : (data?.message || `Request failed (Status ${response.status})`);
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
