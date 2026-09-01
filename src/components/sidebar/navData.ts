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
  Settings,
  Microscope,
  Apple,
  Brain,
  Stethoscope,
  Lock,
  Brush
} from 'lucide-react';
import type { NavItemConfig } from './types';

export const SIDEBAR_NAV_ITEMS: NavItemConfig[] = [
  // PRIMARY NAVIGATION
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard', section: 'PRIMARY' },
  { id: 'profile', label: 'My Health Profile', icon: User, path: '/profile', section: 'PRIMARY' },
  { id: 'records', label: 'Medical Records', icon: FileText, path: '/records', badge: '4', section: 'PRIMARY' },
  { id: 'scan', label: 'Scan & Upload', icon: QrCode, path: '/scan', section: 'PRIMARY' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, path: '/appointments', badge: '2', section: 'PRIMARY' },
  { 
    id: 'medicines', 
    label: 'Medicines', 
    icon: Pill, 
    path: '/medicines', 
    badge: '1 Due', 
    section: 'PRIMARY',
    children: [
      { id: 'pharmacy', label: 'Pharmacy Tracking', icon: Truck, path: '/pharmacy' }
    ]
  },
  { id: 'consultation', label: 'Video Consultation', icon: Video, path: '/consultation', section: 'PRIMARY' },

  // HEALTH SERVICES
  { id: 'family', label: 'Family Connect', icon: Users, path: '/family', section: 'HEALTH SERVICES' },
  { id: 'checkup', label: 'Health Check-up', icon: Activity, path: '/checkup', section: 'HEALTH SERVICES' },
  { id: 'hospitals', label: 'Nearby Hospitals', icon: Building2, path: '/hospitals', section: 'HEALTH SERVICES' },
  { id: 'insurance', label: 'Insurance', icon: Shield, path: '/insurance', section: 'HEALTH SERVICES' },
  { 
    id: 'more-features', 
    label: 'More Features', 
    icon: Grid, 
    badge: 'New', 
    section: 'HEALTH SERVICES',
    children: [
      { id: 'analytics', label: 'Health Analytics', icon: BarChart3, path: '/analytics' },
      { id: 'reminders', label: 'Reminders & Notifications', icon: Bell, path: '/reminders', badge: '3' },
      { id: 'assistant', label: 'AI Health Assistant', icon: Sparkles, path: '/assistant', isSpecial: 'ai' },
      { id: 'lab-test', label: 'Lab Test & Diagnostics', icon: Microscope, path: '/lab-tests' },
      { id: 'diet-plan', label: 'Diet & Nutrient Plans', icon: Apple, path: '/diet-plans' },
      { id: 'report-insights', label: 'Report Insights & AI', icon: Brain, path: '/insights', isSpecial: 'ai' },
      { id: 'nurse-booking', label: 'In-Home Nurse Booking', icon: Stethoscope, path: '/nurse-booking' },
      { id: 'janitor-booking', label: 'Janitor Booking', icon: Brush, path: '/janitor-booking' },
      { id: 'security-privacy', label: 'Security & Privacy', icon: Lock, path: '/security' }
    ]
  },

  // SAFETY
  { id: 'emergency', label: 'SOS & Emergency', icon: AlertTriangle, path: '/emergency', isSpecial: 'sos', section: 'SAFETY' },

  // SYSTEM
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', section: 'SYSTEM' }
];
