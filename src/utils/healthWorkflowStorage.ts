import type { StructuredPrescription } from './prescriptionExtractor';
import type { ReminderItem, NotificationLog } from '../components/reminders/remindersData';
import { INITIAL_REMINDERS, INITIAL_NOTIFICATIONS } from '../components/reminders/remindersData';
import type { PharmacyOrder, LinkedPrescription } from '../components/pharmacy/pharmacyData';
import { INITIAL_ORDERS, INITIAL_PRESCRIPTIONS } from '../components/pharmacy/pharmacyData';
import type { MedicineItem, DoseRecord } from '../components/medicines/medicinesData';
import { INITIAL_MEDICINES, INITIAL_TODAY_DOSES } from '../components/medicines/medicinesData';
import type { MedicalRecordItem } from '../components/records/recordsData';
import { INITIAL_RECORDS } from '../components/records/recordsData';

// LOCAL STORAGE KEYS
export const STORAGE_KEYS = {
  PRESCRIPTIONS: 'user_prescriptions',
  REMINDERS: 'user_reminders',
  PHARMACY_ORDERS: 'user_pharmacy_orders',
  LINKED_PRESCRIPTIONS: 'user_linked_prescriptions',
  MEDICINES: 'user_medicines',
  TODAY_DOSES: 'user_today_doses',
  NOTIFICATIONS: 'user_notifications',
  MEDICAL_RECORDS: 'user_medical_records',
  LATEST_WORKFLOW: 'latest_prescription_workflow',
} as const;

// SAFE LOCAL STORAGE HELPERS
function getStoredJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading key "${key}" from localStorage:`, err);
    return fallback;
  }
}

function setStoredJSON<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error saving key "${key}" to localStorage:`, err);
    return false;
  }
}

// EMIT CROSS-MODULE REACTIVE EVENTS
export const dispatchWorkflowEvent = (eventType: 'health_workflow_updated' | 'notifications_updated') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventType));
  }
};

// ==========================================
// 1. PRESCRIPTION STORAGE
// ==========================================
export const getPrescriptions = (): StructuredPrescription[] => {
  return getStoredJSON<StructuredPrescription[]>(STORAGE_KEYS.PRESCRIPTIONS, []);
};

export const savePrescription = (prescription: StructuredPrescription): boolean => {
  const current = getPrescriptions();
  const existingIndex = current.findIndex((p) => p.id === prescription.id);
  let updated: StructuredPrescription[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = prescription;
  } else {
    updated = [prescription, ...current];
  }
  const ok = setStoredJSON(STORAGE_KEYS.PRESCRIPTIONS, updated);
  if (ok) dispatchWorkflowEvent('health_workflow_updated');
  return ok;
};

export const getPrescriptionById = (id: string): StructuredPrescription | undefined => {
  return getPrescriptions().find((p) => p.id === id);
};

// ==========================================
// 2. REMINDERS STORAGE & ACCEPT / DECLINE
// ==========================================
export interface ExtendedReminderItem extends ReminderItem {
  sourcePrescriptionId?: string;
  doctorName?: string;
  clinicName?: string;
  followUpStatus?: 'Pending' | 'Accepted' | 'Declined';
  followUpDate?: string;
}

export const getReminders = (): ExtendedReminderItem[] => {
  return getStoredJSON<ExtendedReminderItem[]>(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS as ExtendedReminderItem[]);
};

export const saveReminder = (reminder: ExtendedReminderItem): boolean => {
  const current = getReminders();
  const exists = current.some((r) => r.id === reminder.id);
  const updated = exists ? current.map((r) => (r.id === reminder.id ? reminder : r)) : [reminder, ...current];
  const ok = setStoredJSON(STORAGE_KEYS.REMINDERS, updated);
  if (ok) dispatchWorkflowEvent('health_workflow_updated');
  return ok;
};

export const updateReminderFollowUpStatus = (
  reminderId: string,
  newStatus: 'Accepted' | 'Declined'
): { success: boolean; reminder?: ExtendedReminderItem } => {
  const current = getReminders();
  let updatedItem: ExtendedReminderItem | undefined;

  const updated = current.map((r) => {
    if (r.id === reminderId) {
      updatedItem = {
        ...r,
        followUpStatus: newStatus,
        status: newStatus === 'Accepted' ? 'Confirmed' : 'Declined'
      };
      return updatedItem;
    }
    return r;
  });

  if (!updatedItem) {
    return { success: false };
  }

  const ok = setStoredJSON(STORAGE_KEYS.REMINDERS, updated);
  if (ok) {
    // Add Notification Log
    addNotification({
      id: `NOTIF-FLW-${Date.now().toString().slice(-5)}`,
      title: newStatus === 'Accepted' ? 'Follow-up Appointment Confirmed' : 'Follow-up Appointment Declined',
      description: `${updatedItem.title} - Status updated to ${newStatus}.`,
      category: 'Appointment',
      timeAgo: 'Just now',
      date: 'Today',
      isRead: false,
      relatedModule: 'appointments'
    });

    dispatchWorkflowEvent('health_workflow_updated');
    dispatchWorkflowEvent('notifications_updated');
  }

  return { success: ok, reminder: updatedItem };
};

// ==========================================
// 3. PHARMACY ORDERS & PRESCRIPTIONS
// ==========================================
export interface ExtendedPharmacyOrder extends PharmacyOrder {
  sourcePrescriptionId?: string;
  doctorName?: string;
  patientName?: string;
  clinicName?: string;
  pharmacistNotes?: string;
  declineReason?: string;
  pharmacistName?: string;
  verifiedAt?: string;
}

export const getPharmacyOrders = (): ExtendedPharmacyOrder[] => {
  return getStoredJSON<ExtendedPharmacyOrder[]>(STORAGE_KEYS.PHARMACY_ORDERS, INITIAL_ORDERS as ExtendedPharmacyOrder[]);
};

export const savePharmacyOrder = (order: ExtendedPharmacyOrder): boolean => {
  const current = getPharmacyOrders();
  // Prevent duplicate pharmacy orders for same prescription
  if (order.sourcePrescriptionId && current.some((o) => o.sourcePrescriptionId === order.sourcePrescriptionId)) {
    return true; // Already created, prevent duplicate
  }
  const exists = current.some((o) => o.id === order.id);
  const updated = exists ? current.map((o) => (o.id === order.id ? order : o)) : [order, ...current];
  const ok = setStoredJSON(STORAGE_KEYS.PHARMACY_ORDERS, updated);
  if (ok) dispatchWorkflowEvent('health_workflow_updated');
  return ok;
};

export const updatePharmacyOrderStatus = (
  orderId: string,
  newStatus: string,
  pharmacistNotes?: string,
  declineReason?: string,
  pharmacistName: string = 'Suresh Nair (Reg. Pharmacist)'
): { success: boolean; order?: ExtendedPharmacyOrder } => {
  const current = getPharmacyOrders();
  let updatedOrder: ExtendedPharmacyOrder | undefined;

  const updated = current.map((order) => {
    if (order.id === orderId) {
      const isDeclined = newStatus === 'Declined by Pharmacist' || newStatus === 'Cancelled';
      const progressPercent = isDeclined
        ? 0
        : newStatus === 'Processing'
        ? 45
        : newStatus === 'Ready for Pickup'
        ? 75
        : newStatus === 'Out for Delivery'
        ? 88
        : newStatus === 'Delivered'
        ? 100
        : 20;

      updatedOrder = {
        ...order,
        status: newStatus as any,
        pharmacistNotes: pharmacistNotes !== undefined ? pharmacistNotes : order.pharmacistNotes,
        declineReason: declineReason !== undefined ? declineReason : order.declineReason,
        pharmacistName,
        verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        progressPercent
      };
      return updatedOrder;
    }
    return order;
  });

  if (!updatedOrder) {
    return { success: false };
  }

  const ok = setStoredJSON(STORAGE_KEYS.PHARMACY_ORDERS, updated);
  if (ok) {
    const isDeclined = newStatus === 'Declined by Pharmacist' || newStatus === 'Cancelled';
    addNotification({
      id: `NOTIF-PHARM-STATUS-${Date.now().toString().slice(-5)}`,
      title: isDeclined ? 'Pharmacy Order Declined' : 'Pharmacy Order Verified & Processing',
      description: isDeclined
        ? `Your pharmacy order ${updatedOrder.id} was declined. Reason: ${declineReason || 'Medicine unavailable'}.`
        : `Your pharmacy order ${updatedOrder.id} has been verified by Pharmacist ${pharmacistName} and is now being processed.`,
      category: 'Pharmacy',
      timeAgo: 'Just now',
      date: 'Today',
      isRead: false,
      relatedModule: 'pharmacy'
    });

    // Update latest_prescription_workflow if matching
    const latestWf = getLatestWorkflowResult();
    if (latestWf && latestWf.pharmacyOrder?.id === orderId) {
      setLatestWorkflowResult({
        ...latestWf,
        pharmacyOrder: updatedOrder
      });
    }

    dispatchWorkflowEvent('health_workflow_updated');
    dispatchWorkflowEvent('notifications_updated');
  }

  return { success: ok, order: updatedOrder };
};

export const getLinkedPrescriptions = (): LinkedPrescription[] => {
  return getStoredJSON<LinkedPrescription[]>(STORAGE_KEYS.LINKED_PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
};

export const saveLinkedPrescription = (linked: LinkedPrescription): boolean => {
  const current = getLinkedPrescriptions();
  const exists = current.some((p) => p.id === linked.id);
  const updated = exists ? current.map((p) => (p.id === linked.id ? linked : p)) : [linked, ...current];
  return setStoredJSON(STORAGE_KEYS.LINKED_PRESCRIPTIONS, updated);
};

// ==========================================
// 4. MEDICATIONS & DAILY DOSES
// ==========================================
export interface ExtendedMedicineItem extends MedicineItem {
  sourcePrescriptionId?: string;
}

export const getMedications = (): ExtendedMedicineItem[] => {
  return getStoredJSON<ExtendedMedicineItem[]>(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES as ExtendedMedicineItem[]);
};

export const saveMedication = (med: ExtendedMedicineItem): boolean => {
  const current = getMedications();
  const exists = current.some((m) => m.id === med.id);
  const updated = exists ? current.map((m) => (m.id === med.id ? med : m)) : [med, ...current];
  const ok = setStoredJSON(STORAGE_KEYS.MEDICINES, updated);
  if (ok) dispatchWorkflowEvent('health_workflow_updated');
  return ok;
};

export const getTodayDoses = (): DoseRecord[] => {
  return getStoredJSON<DoseRecord[]>(STORAGE_KEYS.TODAY_DOSES, INITIAL_TODAY_DOSES);
};

export const saveTodayDoses = (doses: DoseRecord[]): boolean => {
  const ok = setStoredJSON(STORAGE_KEYS.TODAY_DOSES, doses);
  if (ok) dispatchWorkflowEvent('health_workflow_updated');
  return ok;
};

// ==========================================
// 5. NOTIFICATIONS & MEDICAL RECORDS
// ==========================================
export const getNotifications = (): NotificationLog[] => {
  return getStoredJSON<NotificationLog[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
};

export const addNotification = (notif: NotificationLog): boolean => {
  const current = getNotifications();
  const updated = [notif, ...current];
  const ok = setStoredJSON(STORAGE_KEYS.NOTIFICATIONS, updated);
  if (ok) dispatchWorkflowEvent('notifications_updated');
  return ok;
};

export const getMedicalRecords = (): MedicalRecordItem[] => {
  return getStoredJSON<MedicalRecordItem[]>(STORAGE_KEYS.MEDICAL_RECORDS, INITIAL_RECORDS);
};

export const saveMedicalRecord = (record: MedicalRecordItem): boolean => {
  const current = getMedicalRecords();
  const exists = current.some((r) => r.id === record.id);
  const updated = exists ? current.map((r) => (r.id === record.id ? record : r)) : [record, ...current];
  return setStoredJSON(STORAGE_KEYS.MEDICAL_RECORDS, updated);
};

// ==========================================
// 6. MASTER WORKFLOW: CONFIRM PRESCRIPTION
// ==========================================
export interface WorkflowConfirmationResult {
  prescription: StructuredPrescription;
  reminderCreated: boolean;
  reminderItem?: ExtendedReminderItem;
  pharmacyOrderCreated: boolean;
  pharmacyOrder?: ExtendedPharmacyOrder;
  medicationsCount: number;
}

/**
 * Executes the complete automated workflow when a prescription is confirmed:
 * 1. Persists Prescription to localStorage.
 * 2. If follow-up date exists, automatically creates a Doctor Follow-up Reminder.
 * 3. Transferred prescribed medicines to Pharmacy as an active order (with duplicate prevention).
 * 4. Automatically adds prescribed medicines into Active Medication Tracking and Today's Doses.
 * 5. Appends record to Medical Records & Linked Prescriptions.
 * 6. Dispatches reactive cross-module synchronization events.
 */
export const processPrescriptionConfirmation = (
  prescription: StructuredPrescription,
  selectedPharmacy?: { id: string; name: string; address?: string }
): WorkflowConfirmationResult => {
  // 1. Mark prescription verified & save
  const verifiedPrescription: StructuredPrescription = {
    ...prescription,
    status: 'Verified' as any
  };
  savePrescription(verifiedPrescription);

  // 2. Add to Medical Records repository
  const recordItem: MedicalRecordItem = {
    id: `REC-${prescription.id}`,
    title: `Prescription: ${prescription.doctorName}`,
    type: 'Prescription',
    hospital: prescription.clinicName,
    doctor: prescription.doctorName,
    date: formatDateDisplay(prescription.prescriptionDate),
    timestamp: Date.now(),
    status: 'Normal',
    fileSize: '1.6 MB',
    fileName: `${prescription.id}_Prescription.pdf`,
    isImportant: true,
    notes: `${prescription.medicines.map((m) => `${m.name} ${m.dosage}`).join(', ')}. ${prescription.notes || ''}`
  };
  saveMedicalRecord(recordItem);

  // 3. Follow-up Reminder Detection
  let reminderCreated = false;
  let reminderItem: ExtendedReminderItem | undefined;

  if (prescription.followUp && prescription.followUp.hasFollowUp && prescription.followUp.date) {
    const existingReminders = getReminders();
    const existingReminder = existingReminders.find(
      (r) => r.sourcePrescriptionId === prescription.id
    );

    if (!existingReminder) {
      const followUpDateDisplay = formatDateDisplay(prescription.followUp.date);
      reminderItem = {
        id: `REM-${prescription.id}`,
        title: `Doctor Follow-up: ${prescription.doctorName}`,
        category: 'Appointment',
        description: `Scheduled review with ${prescription.doctorName} at ${prescription.clinicName}. ${prescription.followUp.instructions || ''}`,
        date: followUpDateDisplay,
        time: '10:30 AM',
        repeat: 'Does not repeat',
        timing: '1 day before',
        status: 'Upcoming',
        priority: 'High Priority',
        relatedModule: 'appointments',
        sourcePrescriptionId: prescription.id,
        doctorName: prescription.doctorName,
        clinicName: prescription.clinicName,
        followUpStatus: 'Pending',
        followUpDate: prescription.followUp.date
      };

      saveReminder(reminderItem);
      reminderCreated = true;

      // Notification
      addNotification({
        id: `NOTIF-${Date.now().toString().slice(-5)}`,
        title: 'New Doctor Follow-up Detected',
        description: `Follow-up on ${followUpDateDisplay} with ${prescription.doctorName} was added to your reminders.`,
        category: 'Appointment',
        timeAgo: 'Just now',
        date: 'Today',
        isRead: false,
        relatedModule: 'appointments'
      });
    } else {
      reminderItem = existingReminder;
      reminderCreated = true;
    }
  }

  // 4. Pharmacy Order Creation (Duplicate Protected / Idempotent)
  let pharmacyOrderCreated = false;
  let pharmacyOrder: ExtendedPharmacyOrder | undefined;

  const existingOrders = getPharmacyOrders();
  const existingOrder = existingOrders.find((o) => o.sourcePrescriptionId === prescription.id);

  if (!existingOrder && prescription.medicines.length > 0) {
    const totalAmount = prescription.medicines.reduce((acc, m) => acc + (m.quantity || 10) * 12, 50);
    const chosenName = selectedPharmacy?.name || 'Apollo Central Pharmacy';
    const chosenId = selectedPharmacy?.id || 'PHARM-1';
    const chosenAddress = selectedPharmacy?.address || 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai';

    pharmacyOrder = {
      id: `RX-ORD-${prescription.id.replace('RX-DOC-', '')}`,
      date: formatDateDisplay(new Date().toISOString()),
      pharmacyName: chosenName,
      pharmacyId: chosenId,
      sourcePrescriptionId: prescription.id,
      doctorName: prescription.doctorName,
      patientName: prescription.patientName || 'Patient',
      clinicName: prescription.clinicName,
      items: prescription.medicines.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        quantity: m.quantity || 10,
        unitPrice: 12
      })),
      deliveryMethod: 'Home Delivery',
      deliveryAddress: chosenAddress,
      totalAmount,
      status: 'Pending Pharmacist Verification' as any,
      estimatedDelivery: 'Tomorrow, 10:30 AM – 12:00 PM',
      progressPercent: 20
    };

    savePharmacyOrder(pharmacyOrder);
    pharmacyOrderCreated = true;

    // Linked Prescriptions Table in Pharmacy
    saveLinkedPrescription({
      id: prescription.id,
      doctorName: prescription.doctorName,
      date: formatDateDisplay(prescription.prescriptionDate),
      medicinesCount: prescription.medicines.length,
      status: 'Active',
      associatedMedicines: prescription.medicines.map((m) => m.name)
    });

    // Pharmacy Notification
    addNotification({
      id: `NOTIF-PHARM-${Date.now().toString().slice(-5)}`,
      title: 'Prescription Verified & Sent to Pharmacy',
      description: `Order ${pharmacyOrder.id} has been created and sent to Apollo Central Pharmacy. Status: Pending Pharmacist Verification.`,
      category: 'Pharmacy',
      timeAgo: 'Just now',
      date: 'Today',
      isRead: false,
      relatedModule: 'pharmacy'
    });
  } else if (existingOrder) {
    pharmacyOrder = existingOrder;
    pharmacyOrderCreated = true;
  }

  // 5. Medication Tracking Auto-Enrollment (Duplicate Protected)
  const currentMedications = getMedications();
  const currentDoses = getTodayDoses();
  const newMedsToAdd: ExtendedMedicineItem[] = [];
  const newDosesToAdd: DoseRecord[] = [];

  prescription.medicines.forEach((med, idx) => {
    const medUniqueId = `MED-${prescription.id}-${idx + 1}`;
    const alreadyEnrolled = currentMedications.some(
      (m) => m.sourcePrescriptionId === prescription.id && m.name.toLowerCase() === med.name.toLowerCase()
    );

    if (!alreadyEnrolled) {
      const isTwiceDaily = med.frequency.toLowerCase().includes('twice');
      const isThriceDaily = med.frequency.toLowerCase().includes('three') || med.frequency.toLowerCase().includes('thrice');
      const times = isThriceDaily
        ? ['08:00 AM', '01:30 PM', '09:00 PM']
        : isTwiceDaily
        ? ['08:30 AM', '08:30 PM']
        : ['09:00 AM'];

      const medItem: ExtendedMedicineItem = {
        id: medUniqueId,
        name: med.name,
        dosage: med.dosage.replace(/[^0-9.]/g, '') || '500',
        unit: (med.dosage.toLowerCase().includes('mg') ? 'mg' : 'tablet') as any,
        frequency: (isThriceDaily ? 'Three times daily' : isTwiceDaily ? 'Twice daily' : 'Once daily') as any,
        route: 'Oral',
        times,
        startDate: formatDateDisplay(prescription.prescriptionDate),
        endDate: calculateEndDate(prescription.prescriptionDate, med.duration),
        prescribedBy: prescription.doctorName,
        hospital: prescription.clinicName,
        purpose: med.instructions || 'Prescribed therapy',
        instructions: `${med.instructions || 'Take as directed'} (${med.foodInstruction || 'After Food'})`,
        foodInstruction: med.foodInstruction || 'After Food',
        status: 'Active',
        stockRemaining: med.quantity || 10,
        totalStock: med.quantity || 10,
        reminderEnabled: true,
        sourcePrescriptionId: prescription.id,
        notes: `From verified prescription ${prescription.id}`
      };

      newMedsToAdd.push(medItem);

      // Today's Doses Schedule
      times.forEach((t, tIdx) => {
        newDosesToAdd.push({
          id: `DOSE-${medUniqueId}-${tIdx + 1}`,
          medicineId: medUniqueId,
          medicineName: `${med.name} (${med.dosage})`,
          dosage: med.dosage,
          scheduledTime: t,
          actualTime: null,
          date: formatDateDisplay(new Date().toISOString()),
          status: 'Upcoming'
        });
      });
    }
  });

  if (newMedsToAdd.length > 0) {
    const updatedMeds = [...newMedsToAdd, ...currentMedications];
    setStoredJSON(STORAGE_KEYS.MEDICINES, updatedMeds);

    const updatedDoses = [...newDosesToAdd, ...currentDoses];
    setStoredJSON(STORAGE_KEYS.TODAY_DOSES, updatedDoses);
  }

  // 6. Broadcast reactive event across app
  dispatchWorkflowEvent('health_workflow_updated');
  dispatchWorkflowEvent('notifications_updated');

  const result: WorkflowConfirmationResult = {
    prescription: verifiedPrescription,
    reminderCreated,
    reminderItem,
    pharmacyOrderCreated,
    pharmacyOrder,
    medicationsCount: newMedsToAdd.length
  };

  setStoredJSON(STORAGE_KEYS.LATEST_WORKFLOW, result);

  return result;
};

export const getLatestWorkflowResult = (): WorkflowConfirmationResult | null => {
  return getStoredJSON<WorkflowConfirmationResult | null>(STORAGE_KEYS.LATEST_WORKFLOW, null);
};

export const getLatestWorkflow = getLatestWorkflowResult;

export const setLatestWorkflowResult = (result: WorkflowConfirmationResult): boolean => {
  return setStoredJSON(STORAGE_KEYS.LATEST_WORKFLOW, result);
};

export const clearLatestWorkflowResult = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.LATEST_WORKFLOW);
    dispatchWorkflowEvent('health_workflow_updated');
  }
};

// HELPER DATE UTILITIES
function formatDateDisplay(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '27 Aug 2026';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '27 Aug 2026';
  }
}

function calculateEndDate(startDateStr: string, durationStr: string): string {
  try {
    const d = new Date(startDateStr);
    if (isNaN(d.getTime())) return '05 Sep 2026';
    const match = durationStr.match(/(\d+)/);
    const days = match ? parseInt(match[1], 10) : 7;
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '05 Sep 2026';
  }
}
