/**
 * DHR Patient Pharmacy Order API Service
 * Centralized API integration for Pharmacy Orders, Live Status Transitions, and Realtime Tracking.
 * Single source of truth: Backend MySQL Database via apiClient.
 */

import { apiClient, getAuthToken, setAuthToken, clearAuthToken } from './apiClient';

export interface BackendOrderItem {
  id?: string;
  orderId?: string;
  medicineId?: string | null;
  medicineName: string;
  dosage: string;
  quantity: number;
  unitPrice: number | string;
  subtotal: number | string;
}

export interface BackendPharmacy {
  id: string;
  pharmacyId: string;
  name: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  isVerified?: boolean;
}

export interface BackendPharmacyOrder {
  id: string;
  patientId: string;
  prescriptionId?: string | null;
  pharmacyId?: string | null;
  status:
    | 'PENDING'
    | 'ACCEPTED'
    | 'PREPARING'
    | 'READY'
    | 'READY_FOR_PICKUP'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'DECLINED'
    | 'CANCELLED';
  totalAmount: number | string;
  deliveryAddress?: string | null;
  deliveryType?: string | null;
  orderedAt: string;
  updatedAt: string;
  items: BackendOrderItem[];
  pharmacy?: BackendPharmacy | null;
  patient?: {
    id: string;
    fullName: string;
    gender?: string | null;
    bloodGroup?: string | null;
  } | null;
  prescription?: {
    id: string;
    diagnosis?: string | null;
    issuedAt?: string;
  } | null;
  statusTimeline?: Record<string, string | null>;
  timeline?: Record<string, string | null>;
}

export const DHR_STATUS_DISPLAY: Record<string, string> = {
  PENDING: 'Waiting for Pharmacy',
  ACCEPTED: 'Order Accepted',
  PREPARING: 'Preparing Medicines',
  READY: 'Ready for Pickup / Transit',
  READY_FOR_PICKUP: 'Ready for Pickup',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  DECLINED: 'Order Declined',
  CANCELLED: 'Order Cancelled',
};

export const DHR_STATUS_PERCENT: Record<string, number> = {
  PENDING: 20,
  ACCEPTED: 40,
  PREPARING: 60,
  READY: 80,
  READY_FOR_PICKUP: 80,
  OUT_FOR_DELIVERY: 90,
  DELIVERED: 100,
  COMPLETED: 100,
  DECLINED: 100,
  CANCELLED: 100,
};

/**
 * Return current logged in auth token
 */
export function getStoredAuthToken(): string | null {
  return getAuthToken();
}

/**
 * Fetch patient pharmacy orders list from backend API
 */
export async function fetchPatientPharmacyOrders(_token?: string): Promise<BackendPharmacyOrder[]> {
  try {
    const res = await apiClient.get<BackendPharmacyOrder[]>('/pharmacy-orders');
    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (err: any) {
    console.error('Failed to fetch patient pharmacy orders:', err);
    throw err;
  }
}

/**
 * Fetch single pharmacy order details by ID
 */
export async function fetchPatientPharmacyOrderById(
  orderId: string,
  _token?: string
): Promise<BackendPharmacyOrder | null> {
  try {
    const res = await apiClient.get<BackendPharmacyOrder>(`/pharmacy-orders/${orderId}`);
    return res?.data || null;
  } catch (err: any) {
    console.error(`Failed to fetch pharmacy order ${orderId}:`, err);
    return null;
  }
}

/**
 * Pharmacist: Fetch pharmacy orders assigned to authenticated pharmacist's pharmacy
 */
export async function fetchPharmacistOrders(_token?: string): Promise<BackendPharmacyOrder[]> {
  try {
    const res = await apiClient.get<BackendPharmacyOrder[]>('/pharmacy-orders');
    if (res && res.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (err: any) {
    console.error('Failed to fetch pharmacist orders:', err);
    throw err;
  }
}

/**
 * Pharmacist accepts a pending order
 */
export async function acceptPharmacyOrder(
  orderId: string,
  _token?: string
): Promise<BackendPharmacyOrder> {
  const res = await apiClient.patch<BackendPharmacyOrder>(`/pharmacy-orders/${orderId}/accept`);
  if (!res || !res.data) {
    throw new Error(res?.message || 'Failed to accept pharmacy order');
  }
  return res.data;
}

/**
 * Pharmacist declines a pending order
 */
export async function declinePharmacyOrder(
  orderId: string,
  reason?: string,
  _token?: string
): Promise<BackendPharmacyOrder> {
  const res = await apiClient.patch<BackendPharmacyOrder>(`/pharmacy-orders/${orderId}/decline`, {
    reason,
  });
  if (!res || !res.data) {
    throw new Error(res?.message || 'Failed to decline pharmacy order');
  }
  return res.data;
}

/**
 * Pharmacist progresses an accepted order through the lifecycle
 */
export async function updatePharmacyOrderStatus(
  orderId: string,
  status: string,
  _token?: string
): Promise<BackendPharmacyOrder> {
  const res = await apiClient.patch<BackendPharmacyOrder>(`/pharmacy-orders/${orderId}/status`, {
    status,
  });
  if (!res || !res.data) {
    throw new Error(res?.message || 'Failed to update pharmacy order status');
  }
  return res.data;
}

export interface CreateOrderPayload {
  prescriptionData: {
    notes?: string;
    doctorName?: string;
    clinicName?: string;
    patientName?: string;
    medicines?: Array<{
      id?: string;
      name: string;
      dosage?: string;
      frequency?: string;
      duration?: string | number;
      instructions?: string;
      foodInstruction?: string;
      quantity?: number;
    }>;
  };
  pharmacyId: string;
  deliveryAddress?: string;
  deliveryType?: string;
}

/**
 * End-to-end: Create prescription, confirm it, and place pharmacy order in MySQL
 */
export async function createPatientPharmacyOrder(
  payload: CreateOrderPayload
): Promise<BackendPharmacyOrder> {
  const { prescriptionData, pharmacyId, deliveryAddress, deliveryType } = payload;

  // 1. Get authenticated patient profile
  const profileRes = await apiClient.get<any>('/profile/patient');
  const patientId = profileRes?.data?.id;

  if (!patientId) {
    throw new Error('Patient profile not found. Please ensure you are logged in as a patient.');
  }

  // 2. Create prescription record
  const rxPayload = {
    patientId,
    diagnosis: prescriptionData.notes || 'Clinical Prescription & Medicine Order',
    notes: `Doctor: ${prescriptionData.doctorName || 'Attending Physician'} (${prescriptionData.clinicName || 'Clinic'}). Patient: ${prescriptionData.patientName || 'Patient'}.`,
    items: (prescriptionData.medicines || []).map((m) => ({
      medicineName: m.name,
      dosage: m.dosage || 'Standard',
      unit: 'mg',
      frequency: m.frequency || 'Once daily',
      durationDays: typeof m.duration === 'number' ? m.duration : parseInt(m.duration as string, 10) || 7,
      instructions: m.instructions || 'Take as prescribed',
      foodInstruction: m.foodInstruction || 'After food',
    })),
  };

  const rxRes = await apiClient.post<any>('/prescriptions', rxPayload);
  const rxId = rxRes?.data?.id;

  if (!rxId) {
    throw new Error(rxRes?.message || 'Failed to create prescription for order');
  }

  // 3. Confirm prescription
  await apiClient.patch<any>(`/prescriptions/${rxId}/confirm`);

  // 4. Create pharmacy order
  const orderRes = await apiClient.post<BackendPharmacyOrder>('/pharmacy-orders', {
    prescriptionId: rxId,
    pharmacyId,
    deliveryAddress: deliveryAddress || 'Standard Delivery Address',
    deliveryType: deliveryType || 'Home Delivery',
  });

  if (!orderRes || !orderRes.data) {
    throw new Error(orderRes?.message || 'Failed to route order to pharmacy');
  }

  return orderRes.data;
}

export { setAuthToken, clearAuthToken };
