import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import adminRoutes from './admin.routes';
import medicalRecordRoutes from './medicalRecord.routes';
import prescriptionRoutes from './prescription.routes';
import pharmacyRoutes from './pharmacy.routes';
import pharmacyOrderRoutes from './pharmacyOrder.routes';

const router = Router();

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

export default router;
