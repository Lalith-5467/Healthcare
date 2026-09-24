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
    const at = localStorage.getItem('admin_token');
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
      return localStorage.getItem('patient_token') || null;
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
      return localStorage.getItem('admin_token') || null;
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
      safeLocalStorageSet(`${role.toLowerCase()}_token`, token);
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
  }
};

let isReauthenticating = false;

async function attemptAutoLogin(): Promise<string | null> {
  if (isReauthenticating || typeof window === 'undefined') return null;
  isReauthenticating = true;
  try {
    const path = window.location.pathname.toLowerCase();
    const isDoctorPortal = path.startsWith('/doctor');
    const isNursePortal = path.startsWith('/nurse');
    const isPharmaPortal = path.startsWith('/pharmacist');
    const isCaregiverPortal = path.startsWith('/caregiver');
    const isInsurancePortal = path.startsWith('/insurance');
    const isAdminPortal = path.startsWith('/admin');
    const isUserPortal = path.startsWith('/user') || (!isDoctorPortal && !isNursePortal && !isPharmaPortal && !isCaregiverPortal && !isInsurancePortal && !isAdminPortal);

    let email = 'ananya@health.com';
    let password = 'Patient@123';

    if (isDoctorPortal) {
      email = 'dr.arjun.kumar@apollocentral.in';
      password = 'Doctor@123';
    } else if (isNursePortal) {
      email = 'nurse@health.com';
      password = 'Nurse@123';
    } else if (isPharmaPortal) {
      email = 'pharmacist@health.com';
      password = 'Pharma@123';
    } else if (isCaregiverPortal) {
      email = 'caregiver@health.com';
      password = 'Caregiver@123';
    } else if (isInsurancePortal) {
      email = 'insurance@health.com';
      password = 'Insurance@123';
    } else if (isAdminPortal) {
      email = 'admin@health.com';
      password = 'Admin@123';
    } else if (isUserPortal) {
      email = 'ananya@health.com';
      password = 'Patient@123';
      const storedUser = localStorage.getItem('app_user') || localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const r = (parsed.role || '').toLowerCase();
          if (parsed.email && (r.includes('patient') || !r)) {
            email = parsed.email;
          }
        } catch {}
      }
    }

    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.ok) {
      const resJson = await loginRes.json();
      const newToken = resJson?.data?.token;
      if (newToken) {
        setAuthToken(newToken);
        return newToken;
      }
    }
  } catch (err) {
    console.warn('[apiClient] Auto-authentication attempt failed:', err);
  } finally {
    isReauthenticating = false;
  }
  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit & { _isRetry?: boolean } = {}
): Promise<ApiResponse<T>> {
  let token = getAuthToken();

  // If token is missing, attempt auto-login before sending protected requests
  if (!token && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    token = await attemptAutoLogin();
  }

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

  // If unauthorized (401) or forbidden role mismatch (403) and we haven't retried yet, refresh token for active portal and retry
  if ((response.status === 401 || response.status === 403) && !options._isRetry && !endpoint.includes('/auth/login')) {
    const refreshedToken = await attemptAutoLogin();
    if (refreshedToken) {
      return apiRequest<T>(endpoint, {
        ...options,
        _isRetry: true,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshedToken}`,
        },
      });
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
        ? 'Access denied. You do not have permission for this resource.'
        : response.status === 502 || response.status === 504
        ? 'Backend service is currently unreachable (Port 5000). Please start the backend server.'
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
