export interface Pharmacy {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  hours: string; // e.g. "Open until 10:00 PM"
  deliveryTime: string; // e.g. "30–45 min"
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  address: string;
  phone: string;
  isPreferred?: boolean;
}

export interface StockItem {
  id: string;
  medicineName: string;
  dosage: string;
  currentQuantity: number;
  totalQuantity: number;
  unit: string; // e.g. "tablets", "capsules"
  stockLevel: 'Good Stock' | 'Medium Stock' | 'Low Stock' | 'Out of Stock';
  supplyDays: number;
  lastRefilled: string; // e.g. "15 Aug 2026"
  nextExpectedRefill: string; // e.g. "27 Aug 2026"
}

export interface OrderItem {
  name: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
}

export type PharmacyOrderStatus =
  | 'Pending Pharmacist Verification'
  | 'Processing'
  | 'Order Received'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Declined by Pharmacist'
  | 'Cancelled';

export interface PharmacyOrder {
  id: string; // e.g. "RX-2026-00482"
  date: string;
  pharmacyName: string;
  pharmacyId: string;
  items: OrderItem[];
  deliveryMethod: 'Home Delivery' | 'Pickup';
  deliveryAddress: string;
  totalAmount: number;
  status: PharmacyOrderStatus;
  estimatedDelivery: string; // e.g. "Today, 10:45 AM – 11:15 AM"
  progressPercent: number; // 0 to 100
}

export interface LinkedPrescription {
  id: string;
  doctorName: string;
  date: string;
  medicinesCount: number;
  status: 'Active' | 'Completed';
  associatedMedicines: string[];
}

export const INITIAL_PHARMACIES: Pharmacy[] = [
  {
    id: 'PHARM-1',
    name: 'HealthPlus Pharmacy',
    rating: 4.8,
    reviewCount: 342,
    distanceKm: 2.4,
    hours: 'Open until 10:00 PM',
    deliveryTime: '30–45 min',
    deliveryAvailable: true,
    pickupAvailable: true,
    address: 'Plot 42, Anna Salai, Guindy, Chennai, TN',
    phone: '+91 98401 23456',
    isPreferred: true
  },
  {
    id: 'PHARM-2',
    name: 'MediCare Express Pharmacy',
    rating: 4.7,
    reviewCount: 219,
    distanceKm: 3.1,
    hours: 'Open 24 Hours',
    deliveryTime: '25–35 min',
    deliveryAvailable: true,
    pickupAvailable: true,
    address: 'No. 18, Race Course Road, Guindy, Chennai, TN',
    phone: '+91 98402 34567'
  },
  {
    id: 'PHARM-3',
    name: 'Apollo Pharmacy',
    rating: 4.9,
    reviewCount: 512,
    distanceKm: 4.2,
    hours: 'Open until 11:00 PM',
    deliveryTime: '40–50 min',
    deliveryAvailable: true,
    pickupAvailable: true,
    address: '12 Sardar Patel Road, Adyar, Chennai, TN',
    phone: '+91 98403 45678'
  },
  {
    id: 'PHARM-4',
    name: 'City Health Pharmacy',
    rating: 4.5,
    reviewCount: 128,
    distanceKm: 1.8,
    hours: 'Open until 09:30 PM',
    deliveryTime: '20–30 min',
    deliveryAvailable: false,
    pickupAvailable: true,
    address: '5 West Cott Road, Royapettah, Chennai, TN',
    phone: '+91 98404 56789'
  }
];

export const INITIAL_MEDICINE_STOCK: StockItem[] = [
  {
    id: 'MED-101',
    medicineName: 'Metformin',
    dosage: '500 mg',
    currentQuantity: 8,
    totalQuantity: 40,
    unit: 'tablets',
    stockLevel: 'Low Stock',
    supplyDays: 4,
    lastRefilled: '15 Aug 2026',
    nextExpectedRefill: '27 Aug 2026'
  },
  {
    id: 'MED-102',
    medicineName: 'Atorvastatin',
    dosage: '10 mg',
    currentQuantity: 12,
    totalQuantity: 30,
    unit: 'tablets',
    stockLevel: 'Low Stock',
    supplyDays: 6,
    lastRefilled: '10 Jul 2026',
    nextExpectedRefill: '29 Aug 2026'
  },
  {
    id: 'MED-103',
    medicineName: 'Vitamin D3',
    dosage: '1000 IU',
    currentQuantity: 18,
    totalQuantity: 30,
    unit: 'capsules',
    stockLevel: 'Medium Stock',
    supplyDays: 14,
    lastRefilled: '01 Jun 2026',
    nextExpectedRefill: '05 Sep 2026'
  },
  {
    id: 'MED-104',
    medicineName: 'Omeprazole',
    dosage: '20 mg',
    currentQuantity: 22,
    totalQuantity: 30,
    unit: 'capsules',
    stockLevel: 'Good Stock',
    supplyDays: 20,
    lastRefilled: '15 Aug 2026',
    nextExpectedRefill: '12 Sep 2026'
  },
  {
    id: 'MED-105',
    medicineName: 'Amlodipine (BP Medicine)',
    dosage: '5 mg',
    currentQuantity: 26,
    totalQuantity: 30,
    unit: 'tablets',
    stockLevel: 'Good Stock',
    supplyDays: 24,
    lastRefilled: '01 Aug 2026',
    nextExpectedRefill: '16 Sep 2026'
  },
  {
    id: 'MED-106',
    medicineName: 'Paracetamol',
    dosage: '500 mg',
    currentQuantity: 15,
    totalQuantity: 20,
    unit: 'tablets',
    stockLevel: 'Good Stock',
    supplyDays: 15,
    lastRefilled: '12 Aug 2026',
    nextExpectedRefill: '20 Sep 2026'
  }
];

export const INITIAL_ORDERS: PharmacyOrder[] = [
  {
    id: 'RX-2026-00482',
    date: '23 Aug 2026',
    pharmacyName: 'HealthPlus Pharmacy',
    pharmacyId: 'PHARM-1',
    items: [
      { name: 'Metformin', dosage: '500 mg', quantity: 30, unitPrice: 8 },
      { name: 'Atorvastatin', dosage: '10 mg', quantity: 30, unitPrice: 7 }
    ],
    deliveryMethod: 'Home Delivery',
    deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
    totalAmount: 450,
    status: 'Out for Delivery',
    estimatedDelivery: 'Today, 10:45 AM – 11:15 AM',
    progressPercent: 70
  },
  {
    id: 'RX-2026-00321',
    date: '18 Aug 2026',
    pharmacyName: 'MediCare Express Pharmacy',
    pharmacyId: 'PHARM-2',
    items: [
      { name: 'Omeprazole', dosage: '20 mg', quantity: 30, unitPrice: 6 },
      { name: 'Paracetamol', dosage: '500 mg', quantity: 20, unitPrice: 4 }
    ],
    deliveryMethod: 'Home Delivery',
    deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
    totalAmount: 380,
    status: 'Delivered',
    estimatedDelivery: '18 Aug, 02:30 PM',
    progressPercent: 100
  },
  {
    id: 'RX-2026-00210',
    date: '01 Aug 2026',
    pharmacyName: 'Apollo Pharmacy',
    pharmacyId: 'PHARM-3',
    items: [
      { name: 'Amlodipine', dosage: '5 mg', quantity: 30, unitPrice: 9 }
    ],
    deliveryMethod: 'Pickup',
    deliveryAddress: 'Apollo Pharmacy Branch, Adyar',
    totalAmount: 270,
    status: 'Delivered',
    estimatedDelivery: '01 Aug, 04:00 PM',
    progressPercent: 100
  }
];

export const INITIAL_PRESCRIPTIONS: LinkedPrescription[] = [
  {
    id: 'RX-1024',
    doctorName: 'Dr. Rajesh Kumar',
    date: '20 Aug 2026',
    medicinesCount: 3,
    status: 'Active',
    associatedMedicines: ['Metformin', 'Atorvastatin', 'Vitamin D3']
  },
  {
    id: 'RX-1018',
    doctorName: 'Dr. Priya Sharma',
    date: '01 Aug 2026',
    medicinesCount: 2,
    status: 'Active',
    associatedMedicines: ['Amlodipine', 'Omeprazole']
  }
];
