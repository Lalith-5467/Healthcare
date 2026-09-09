import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import adminRoutes from './admin.routes';
import medicalRecordRoutes from './medicalRecord.routes';
import prescriptionRoutes from './prescription.routes';
import pharmacyRoutes from './pharmacy.routes';
import pharmacyOrderRoutes from './pharmacyOrder.routes';
import appointmentRoutes from './appointment.routes';
import vitalRoutes from './vital.routes';
import reminderRoutes from './reminder.routes';
import medicineRoutes from './medicine.routes';
import notificationRoutes from './notification.routes';
import dashboardRoutes from './dashboard.routes';
import clinicalRoutes from './clinical.routes';
import healthShareRoutes from './healthShare.routes';
import insuranceRoutes from './insurance.routes';
import caregiverRoutes from './caregiver.routes';
import consultationRoutes from './consultation.routes';
import doctorDashboardRoutes from './doctorDashboard.routes';

const router = Router();

// Base API Index
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    name: 'MediCare Digital Health Record (DHR) API Gateway',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Health Check APIs
router.use('/health', healthRoutes);

// Authentication APIs
router.use('/auth', authRoutes);

// Profile Management APIs
router.use('/profile', profileRoutes);

// Admin User Management APIs
router.use('/admin', adminRoutes);

// Medical Records APIs
router.use('/medical-records', medicalRecordRoutes);

// Prescription Management APIs
router.use('/prescriptions', prescriptionRoutes);

// Registered Pharmacy Network APIs
router.use('/pharmacies', pharmacyRoutes);

// Pharmacy Order Routing APIs
router.use('/pharmacy-orders', pharmacyOrderRoutes);

// Appointments APIs
router.use('/appointments', appointmentRoutes);

// Vitals & Telemetry APIs
router.use('/vitals', vitalRoutes);

// Reminders & Follow-up Tracking APIs
router.use('/reminders', reminderRoutes);

// Medicines Inventory & Active Doses APIs
router.use('/medicines', medicineRoutes);

// Notifications APIs
router.use('/notifications', notificationRoutes);

// Dashboard Aggregates & Stats APIs
router.use('/dashboard', dashboardRoutes);

// Clinical Workflows APIs (Doctor & Nurse)
router.use('/clinical', clinicalRoutes);

// Secure QR & Health Share APIs
router.use('/health-share', healthShareRoutes);

// Insurance Policies, Claims & Settlements APIs
router.use('/insurance', insuranceRoutes);

// Caregiver Wards, Tasks & Telemetry APIs
router.use('/caregiver', caregiverRoutes);

// Consultation APIs
router.use('/consultations', consultationRoutes);

// Doctor Dashboard APIs
router.use('/doctor/dashboard', doctorDashboardRoutes);

export default router;
