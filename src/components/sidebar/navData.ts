import { 
  Home, 
  User, 
  FileText, 
  QrCode, 
  Calendar, 
  Pill, 
  Truck, 
  Video, 
  Users, 
  Bell, 
  Activity, 
  Building2, 
  Shield, 
  Grid,
  AlertTriangle, 
  Sparkles, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import type { NavItemConfig } from './types';

export const SIDEBAR_NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'profile', label: 'My Health Profile', icon: User, path: '/profile' },
  { id: 'records', label: 'Medical Records', icon: FileText, path: '/records', badge: '4' },
  { id: 'scan', label: 'Scan & Upload', icon: QrCode, path: '/scan' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/appointments', badge: '2' },
  { id: 'medicines', label: 'Medicines', icon: Pill, path: '/medicines', badge: '1 Due' },
  { id: 'pharmacy', label: 'Pharmacy Tracking', icon: Truck, path: '/pharmacy' },
  { id: 'consultation', label: 'Video Consultation', icon: Video, path: '/consultation' },
  { id: 'family', label: 'Family Connect', icon: Users, path: '/family' },
  { id: 'reminders', label: 'Reminders', icon: Bell, path: '/reminders' },
  { id: 'checkup', label: 'Health Check-up', icon: Activity, path: '/checkup' },
  { id: 'hospitals', label: 'Nearby Hospitals', icon: Building2, path: '/hospitals' },
  { id: 'insurance', label: 'Insurance', icon: Shield, path: '/insurance' },
  { id: 'more-features', label: 'More Features', icon: Grid, path: '/more-features', badge: 'New' },
  { id: 'emergency', label: 'SOS & Emergency', icon: AlertTriangle, path: '/emergency', isSpecial: 'sos' },
  { id: 'analytics', label: 'Health Analytics', icon: BarChart3, path: '/analytics' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications', badge: '3' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
];
