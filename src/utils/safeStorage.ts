/**
 * Safe LocalStorage Utilities with Quota Exceeded Auto-Purge & Fallbacks
 */

const PROTECTED_KEYS = new Set([
  'token',
  'auth_token',
  'jwt',
  'app_user',
  'app_is_logged_in',
  'admin_token',
  'pharmacist_token'
]);

// Keys that are large/volatile caches and safe to purge when quota is exceeded
const PURGEABLE_KEYS_PRIORITY = [
  'latest_prescription_workflow',
  'prescription_scan_history',
  'scanned_image',
  'ocr_cache',
  'user_medical_records',
  'user_prescriptions',
  'user_notifications',
  'user_reminders',
  'medicare_nurse_bookings_v2',
  'doctor_mock_data',
  'nurse_mock_data',
  'insurance_mock_data',
  'caregiver_mock_data',
  'emergency_info_data',
  'user_settings_profile',
  'user_profile_data'
];

/**
 * Clean up local storage by removing non-essential heavy cache entries
 */
export function pruneLocalStorageQuota(requiredKey?: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  // Pass 1: Remove known high-weight caches
  for (const k of PURGEABLE_KEYS_PRIORITY) {
    if (k !== requiredKey) {
      try {
        localStorage.removeItem(k);
      } catch {
        // Ignore
      }
    }
  }

  // Pass 2: Remove any key larger than 10KB that is not in PROTECTED_KEYS
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && !PROTECTED_KEYS.has(k) && k !== requiredKey) {
        const val = localStorage.getItem(k);
        if (val && val.length > 5000) {
          keysToRemove.push(k);
        }
      }
    }
    for (const k of keysToRemove) {
      localStorage.removeItem(k);
    }
  } catch {
    // Ignore
  }

  // Pass 3: If still needed, remove all non-protected keys
  try {
    const remainingNonProtected: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && !PROTECTED_KEYS.has(k) && k !== requiredKey) {
        remainingNonProtected.push(k);
      }
    }
    for (const k of remainingNonProtected) {
      localStorage.removeItem(k);
    }
  } catch {
    // Ignore
  }
}

/**
 * Safely sets an item in localStorage with automated quota error handling
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.warn(`[safeStorage] localStorage quota reached on '${key}'. Purging transient data and retrying...`, err);
    try {
      pruneLocalStorageQuota(key);
      localStorage.setItem(key, value);
      return true;
    } catch (retryErr) {
      console.error(`[safeStorage] Critical: Unable to write key '${key}' after storage prune:`, retryErr);
      // Fallback: If value itself is very large (e.g. nested objects), try saving a minimal representation
      try {
        if (key === 'app_user') {
          const parsed = JSON.parse(value);
          const minimal = {
            id: parsed.id,
            name: parsed.name,
            email: parsed.email,
            role: parsed.role,
            abhaId: parsed.abhaId,
            bloodGroup: parsed.bloodGroup,
            age: parsed.age,
            phone: parsed.phone
          };
          localStorage.setItem(key, JSON.stringify(minimal));
          return true;
        }
      } catch {}
      return false;
    }
  }
}

/**
 * Safely gets an item from localStorage
 */
export function safeLocalStorageGet(key: string, fallback: string | null = null): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safely removes an item from localStorage
 */
export function safeLocalStorageRemove(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}
