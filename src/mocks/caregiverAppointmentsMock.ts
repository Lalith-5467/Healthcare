export interface DemoAppointment {
  id: string;
  dependentId: string;
  dependentName: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: 'In-Person' | 'Video Consultation' | 'Follow-up' | 'General Consultation';
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled';
  reason: string;
  notes?: string;
  rawTimestamp: number;
}

export const DEMO_APPOINTMENTS_BY_WARD: Record<string, DemoAppointment[]> = {
  // Ward 1 / Arun Raj (Ragul Kumar)
  'ward-1': [
    {
      id: 'demo-apt-1-1',
      dependentId: 'ward-1',
      dependentName: 'Arun Raj',
      doctorName: 'Dr. Rajesh Varma',
      doctorSpecialization: 'Cardiologist',
      hospitalName: 'Apollo Central Health City, Chennai',
      appointmentDate: 'Tomorrow',
      appointmentTime: '10:30 AM',
      appointmentType: 'Follow-up',
      status: 'Upcoming',
      reason: 'Routine BP control & 6-month post-medication review',
      notes: 'Please bring recent Lipid Panel lab results and morning vital readings log.',
      rawTimestamp: Date.now() + 86400000
    },
    {
      id: 'demo-apt-1-2',
      dependentId: 'ward-1',
      dependentName: 'Arun Raj',
      doctorName: 'Dr. Priya Sundaram',
      doctorSpecialization: 'Endocrinologist',
      hospitalName: 'Medicare Telehealth Center',
      appointmentDate: '24 Sep 2026',
      appointmentTime: '04:00 PM',
      appointmentType: 'Video Consultation',
      status: 'Upcoming',
      reason: 'Type 2 Diabetes HbA1c review & dosage adjustment',
      notes: 'Fasting glucose log sent via ABDM health locker.',
      rawTimestamp: Date.now() + (6 * 86400000)
    },
    {
      id: 'demo-apt-1-3',
      dependentId: 'ward-1',
      dependentName: 'Arun Raj',
      doctorName: 'Dr. Vikram Seth',
      doctorSpecialization: 'General Physician',
      hospitalName: 'City Preventive Healthcare Center',
      appointmentDate: '10 Aug 2026',
      appointmentTime: '11:00 AM',
      appointmentType: 'In-Person',
      status: 'Completed',
      reason: 'Annual influenza booster vaccination & baseline checkup',
      notes: 'Vaccine administered successfully in left deltoid.',
      rawTimestamp: Date.now() - (39 * 86400000)
    }
  ],

  // Ward 2 / Priya Raj (Meena Kumar)
  'ward-2': [
    {
      id: 'demo-apt-2-1',
      dependentId: 'ward-2',
      dependentName: 'Priya Raj',
      doctorName: 'Dr. Ananya Sen',
      doctorSpecialization: 'Orthopedic & Rheumatology',
      hospitalName: 'Manipal Super Specialty Hospital, Bengaluru',
      appointmentDate: '22 Sep 2026',
      appointmentTime: '11:30 AM',
      appointmentType: 'In-Person',
      status: 'Upcoming',
      reason: 'Bilateral Knee Osteoarthritis Stage II review & physio assessment',
      notes: 'Patient advised to wear supportive knee brace for gait analysis.',
      rawTimestamp: Date.now() + (4 * 86400000)
    },
    {
      id: 'demo-apt-2-2',
      dependentId: 'ward-2',
      dependentName: 'Priya Raj',
      doctorName: 'Dr. Rajesh Varma',
      doctorSpecialization: 'Endocrinologist',
      hospitalName: 'Apollo Diagnostics Wing',
      appointmentDate: '02 Aug 2026',
      appointmentTime: '09:00 AM',
      appointmentType: 'Follow-up',
      status: 'Completed',
      reason: 'Thyroid profile & Serum Calcium lab review',
      notes: 'Thyronorm 50mcg dosage maintained.',
      rawTimestamp: Date.now() - (47 * 86400000)
    }
  ],

  // Ward 3 / Karthik Raj (Aarav Kumar)
  'ward-3': [
    {
      id: 'demo-apt-3-1',
      dependentId: 'ward-3',
      dependentName: 'Karthik Raj',
      doctorName: 'Dr. Vikram Seth',
      doctorSpecialization: 'Pediatric Pulmonology',
      hospitalName: 'Rainbow Childrens Hospital',
      appointmentDate: '28 Sep 2026',
      appointmentTime: '02:00 PM',
      appointmentType: 'General Consultation',
      status: 'Upcoming',
      reason: 'Seasonal asthma peak-flow review & inhaler technique practice',
      notes: 'Bring peak flow meter log book.',
      rawTimestamp: Date.now() + (10 * 86400000)
    }
  ],

  // Ward 4 / Meena Raj
  'ward-4': [
    {
      id: 'demo-apt-4-1',
      dependentId: 'ward-4',
      dependentName: 'Meena Raj',
      doctorName: 'Dr. Priya Sundaram',
      doctorSpecialization: 'Geriatric Specialist',
      hospitalName: 'Apollo Senior Care Center',
      appointmentDate: '20 Sep 2026',
      appointmentTime: '10:00 AM',
      appointmentType: 'In-Person',
      status: 'Upcoming',
      reason: 'Geriatric cognitive assessment & MMSE evaluation',
      notes: 'Caregiver companion required during consultation.',
      rawTimestamp: Date.now() + (2 * 86400000)
    }
  ]
};
