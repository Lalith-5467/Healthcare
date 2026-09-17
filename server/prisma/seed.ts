import { PrismaClient, Role, RecordType, AppointmentType, AppointmentStatus, PrescriptionStatus, OrderStatus, ReminderType, ReminderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive full-dataset MySQL database seeding for DHR...');

  const patientPasswordHash = await bcrypt.hash('Patient@123', 10);
  const doctorPasswordHash = await bcrypt.hash('Doctor@123', 10);
  const pharmacistPasswordHash = await bcrypt.hash('Pharma@123', 10);
  const nursePasswordHash = await bcrypt.hash('Nurse@123', 10);
  const caregiverPasswordHash = await bcrypt.hash('Caregiver@123', 10);
  const insurancePasswordHash = await bcrypt.hash('Insurance@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  // ==========================================
  // 1. SEED PHARMACIES
  // ==========================================
  console.log('Seeding Pharmacies...');
  const pharmacyApollo = await prisma.pharmacy.upsert({
    where: { pharmacyId: 'PHARM-1' },
    update: {},
    create: {
      pharmacyId: 'PHARM-1',
      name: 'Apollo Central Pharmacy',
      licenseNumber: 'DL-TN-CH-88291',
      address: 'Flat 4B, Emerald Heights, Anna Salai, Guindy',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600032',
      phone: '+91 98400 12345',
      email: 'apollo.central@apollopharmacy.in',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    },
  });

  const pharmacyMedPlus = await prisma.pharmacy.upsert({
    where: { pharmacyId: 'PHARM-2' },
    update: {},
    create: {
      pharmacyId: 'PHARM-2',
      name: 'MedPlus Pharmacy',
      licenseNumber: 'DL-TN-CH-44102',
      address: 'Shop 12, 100 Feet Road, Velachery',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600042',
      phone: '+91 98401 54321',
      email: 'velachery@medplusindia.com',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    },
  });

  const pharmacyFortis = await prisma.pharmacy.upsert({
    where: { pharmacyId: 'PHARM-3' },
    update: {},
    create: {
      pharmacyId: 'PHARM-3',
      name: 'Fortis Care Pharmacy',
      licenseNumber: 'DL-TN-CH-99381',
      address: 'Arcot Road, Vadapalani',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600026',
      phone: '+91 98402 99887',
      email: 'care@fortispharmacy.in',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    },
  });

  const pharmacyKauvery = await prisma.pharmacy.upsert({
    where: { pharmacyId: 'PHARM-4' },
    update: {},
    create: {
      pharmacyId: 'PHARM-4',
      name: 'Kauvery 24x7 Emergency Dispensary',
      licenseNumber: 'DL-TN-CH-11029',
      address: 'TTK Road, Alwarpet',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600018',
      phone: '+91 98403 11223',
      email: 'dispensary@kauvery.in',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    },
  });

  // ==========================================
  // 2. SEED USERS & PROFILES ACROSS ALL ROLES
  // ==========================================
  console.log('Seeding Users & Role Profiles...');

  // PATIENTS
  const patientsData = [
    {
      email: 'lalith@health.com',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-5467-1024-9988',
      phoneNumber: '+91 98765 12345',
      fullName: 'Lalith Kumar',
      gender: 'Male',
      dob: '1998-07-15',
      bloodGroup: 'O+',
      address: 'Anna Salai, Chennai, Tamil Nadu',
      emergencyName: 'Kumar (Father)',
      emergencyPhone: '+91 98765 54321',
    },
    {
      email: 'patient@health.com',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-4582-9901-2345',
      phoneNumber: '+91 98765 43210',
      fullName: 'Akshara Raman',
      gender: 'Female',
      dob: '2000-05-14',
      bloodGroup: 'O+',
      address: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
      emergencyName: 'Ramanathan K (Father)',
      emergencyPhone: '+91 98765 00112',
    },
    {
      email: 'ragul@health.com',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-1024-8849-5512',
      phoneNumber: '+91 98402 77011',
      fullName: 'Ragul K',
      gender: 'Male',
      dob: '1995-03-10',
      bloodGroup: 'O+',
      address: 'Anna Nagar East, Chennai',
      emergencyName: 'Priya Ragul (Spouse)',
      emergencyPhone: '+91 98402 77012',
    },
    {
      email: 'ragul.kumar@abdm.in',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-8472-9104-5821',
      phoneNumber: '+91 98401 23456',
      fullName: 'Ragul Kumar',
      gender: 'Male',
      dob: '1992-08-20',
      bloodGroup: 'O+',
      address: 'Anna Nagar West, Chennai',
      emergencyName: 'Priya Ragul (Spouse)',
      emergencyPhone: '+91 98402 77012',
    },
    {
      email: 'abinesh.k@abdm.in',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-8842-5921-1029',
      phoneNumber: '+91 98409 01234',
      fullName: 'Abinesh Kumar',
      gender: 'Male',
      dob: '1990-03-12',
      bloodGroup: 'O+',
      address: 'Greams Road, Thousand Lights, Chennai',
      emergencyName: 'Kavitha Kumar (Mother)',
      emergencyPhone: '+91 98409 11223',
    },
    {
      email: 'meenakshi.s@abdm.in',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-7719-3382-4401',
      phoneNumber: '+91 98412 34567',
      fullName: 'Meenakshi Sundaram',
      gender: 'Female',
      dob: '1968-11-25',
      bloodGroup: 'B+',
      address: 'Besant Nagar, Chennai',
      emergencyName: 'Sundaram S (Spouse)',
      emergencyPhone: '+91 98412 99887',
    },
    {
      email: 'priya.n@abdm.in',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-3321-4491-0023',
      phoneNumber: '+91 98413 45678',
      fullName: 'Priya Narayanan',
      gender: 'Female',
      dob: '1997-04-18',
      bloodGroup: 'A+',
      address: 'T. Nagar, Chennai',
      emergencyName: 'Narayanan R (Father)',
      emergencyPhone: '+91 98413 00112',
    },
    {
      email: 'karthik.r@abdm.in',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-5542-8812-7731',
      phoneNumber: '+91 98414 56789',
      fullName: 'Karthik Raja',
      gender: 'Male',
      dob: '1980-09-05',
      bloodGroup: 'AB+',
      address: 'Adyar, Chennai',
      emergencyName: 'Shalini Raja (Spouse)',
      emergencyPhone: '+91 98414 77889',
    },
    {
      email: 'verified.patient.1788487240917@dhr-health.in',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-5544-2211-0917@abdm',
      phoneNumber: '+91 98402 33187',
      fullName: 'Verified Patient 0917',
      gender: 'Female',
      dob: '1996-01-15',
      bloodGroup: 'B+',
      address: 'Kodambakkam, Chennai',
      emergencyName: 'Suresh P',
      emergencyPhone: '+91 98402 33188',
    },
    {
      email: 'verified.patient.1788487383631@dhr-health.in',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      abhaId: '91-5544-2211-3631@abdm',
      phoneNumber: '+91 98402 87063',
      fullName: 'Verified Patient 3631',
      gender: 'Male',
      dob: '1994-07-22',
      bloodGroup: 'O+',
      address: 'Nungambakkam, Chennai',
      emergencyName: 'Deepa K',
      emergencyPhone: '+91 98402 87064',
    },
  ];

  const patientMap: Record<string, any> = {};

  for (const p of patientsData) {
    const u = await prisma.user.upsert({
      where: { email: p.email },
      update: {
        passwordHash: p.passwordHash,
      },
      create: {
        email: p.email,
        passwordHash: p.passwordHash,
        role: p.role,
        abhaId: p.abhaId,
        phoneNumber: p.phoneNumber,
        isActive: true,
        patient: {
          create: {
            fullName: p.fullName,
            gender: p.gender,
            dateOfBirth: new Date(p.dob),
            bloodGroup: p.bloodGroup,
            address: p.address,
            emergencyContactName: p.emergencyName,
            emergencyContactPhone: p.emergencyPhone,
          },
        },
      },
      include: { patient: true },
    });
    patientMap[p.email] = u.patient;
  }

  // DOCTORS
  const doctorsData = [
    {
      email: 'doctor@health.com',
      name: 'Dr. Rajesh Varma',
      speciality: 'Cardiologist & General Physician',
      qualification: 'MBBS, MD (Cardiology), FACC',
      license: 'TN-MED-48291',
      hospital: 'Apollo Multispeciality Hospitals, Chennai',
      exp: 14,
      fee: 750.0,
      about: 'Senior Consultant Cardiologist specializing in preventive cardiology and hypertension management.',
      photo: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
    },
    {
      email: 'dr.priya.sharma@apollocentral.in',
      name: 'Dr. Priya Sharma',
      speciality: 'Cardiology',
      qualification: 'MBBS, MD, DM (Cardiology)',
      license: 'TN-MED-62019',
      hospital: 'Fortis Healthcare, Adyar',
      exp: 16,
      fee: 800.0,
      about: 'Lead Interventional Cardiologist specializing in preventive cardiology, coronary angioplasty, and lifestyle heart wellness.',
      photo: 'https://images.unsplash.com/photo-1594824813566-88855ce78947?auto=format&fit=crop&w=600&q=80',
    },
    {
      email: 'dr.arun.kumar@kauvery.in',
      name: 'Dr. Arun Kumar',
      speciality: 'Dermatology',
      qualification: 'MBBS, MD (DVL)',
      license: 'TN-MED-77102',
      hospital: 'Kauvery Hospital, Alwarpet',
      exp: 10,
      fee: 650.0,
      about: 'Certified Dermatologist and Trichologist specializing in laser treatments, eczema, and aesthetic dermatology.',
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    },
    {
      email: 'dr.meena.swaminathan@apollo.in',
      name: 'Dr. Meena Swaminathan',
      speciality: 'Pediatrics',
      qualification: 'MBBS, DCH, DNB (Pediatrics)',
      license: 'TN-MED-55401',
      hospital: 'Apollo Childrens Hospital, Thousand Lights',
      exp: 12,
      fee: 600.0,
      about: 'Compassionate Pediatrician focusing on child nutrition, vaccination schedules, and acute childhood illnesses.',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    },
    {
      email: 'dr.vikram.sethi@mgm.in',
      name: 'Dr. Vikram Sethi',
      speciality: 'Orthopedics',
      qualification: 'MBBS, MS (Ortho), M.Ch',
      license: 'TN-MED-33910',
      hospital: 'MGM Healthcare, Nelson Manickam Road',
      exp: 18,
      fee: 900.0,
      about: 'Senior Orthopedic Surgeon expert in joint replacement, knee arthroscopy, and complex spine rehabilitations.',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    },
    {
      email: 'dr.anita.desai@apollocentral.in',
      name: 'Dr. Anita Desai',
      speciality: 'Endocrinology & Diabetology',
      qualification: 'MBBS, MD, DNB (Endocrinology)',
      license: 'NMC-66102-MH',
      hospital: 'Apollo Multispeciality Hospitals, Chennai',
      exp: 15,
      fee: 750.0,
      about: 'Specialist in metabolic syndromes, thyroid disorders, and advanced insulin therapy.',
      photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const doctorMap: Record<string, any> = {};

  for (const d of doctorsData) {
    const u = await prisma.user.upsert({
      where: { email: d.email },
      update: {
        passwordHash: doctorPasswordHash,
      },
      create: {
        email: d.email,
        passwordHash: doctorPasswordHash,
        role: Role.DOCTOR,
        phoneNumber: '+91 98402 34567',
        isActive: true,
        doctor: {
          create: {
            fullName: d.name,
            speciality: d.speciality,
            qualification: d.qualification,
            licenseNumber: d.license,
            hospital: d.hospital,
            experienceYears: d.exp,
            consultationFee: d.fee,
            about: d.about,
            photoUrl: d.photo,
          },
        },
      },
      include: { doctor: true },
    });
    doctorMap[d.email] = u.doctor;
  }

  // NURSES
  const nursesData = [
    {
      email: 'nurse@health.com',
      name: 'Nurse Sarah Jenkins, Senior RN',
      hospital: 'Apollo Home Care Division',
      department: 'Post-Op Nursing & Critical ICU',
      license: 'TN-NUR-88410',
      phone: '+91 98401 22334',
    },
    {
      email: 'sarah.nurse@hospital.in',
      name: 'Nurse Priya Nair, RN',
      hospital: 'Kauvery Home Health Care',
      department: 'Geriatric & Palliative Care',
      license: 'TN-NUR-99102',
      phone: '+91 98403 45678',
    },
  ];

  const nurseMap: Record<string, any> = {};

  for (const n of nursesData) {
    const u = await prisma.user.upsert({
      where: { email: n.email },
      update: {
        passwordHash: nursePasswordHash,
      },
      create: {
        email: n.email,
        passwordHash: nursePasswordHash,
        role: Role.NURSE,
        phoneNumber: n.phone,
        isActive: true,
        nurse: {
          create: {
            fullName: n.name,
            hospital: n.hospital,
            department: n.department,
            licenseNumber: n.license,
          },
        },
      },
      include: { nurse: true },
    });
    nurseMap[n.email] = u.nurse;
  }

  // PHARMACISTS
  const pharmacistsData = [
    {
      email: 'pharmacist@health.com',
      name: 'Suresh Nair, R.Ph',
      pharmacyName: 'Apollo Central Pharmacy',
      license: 'RPH-TN-2018-994',
      pharmacyId: pharmacyApollo.id,
      phone: '+91 98400 55667',
    },
    {
      email: 'pharmacist@apollocentral.in',
      name: 'Ramesh Gupta, Chief Pharmacist',
      pharmacyName: 'MedPlus Pharmacy',
      license: 'RPH-TN-2015-881',
      pharmacyId: pharmacyMedPlus.id,
      phone: '+91 98404 56789',
    },
  ];

  for (const ph of pharmacistsData) {
    await prisma.user.upsert({
      where: { email: ph.email },
      update: {
        passwordHash: pharmacistPasswordHash,
      },
      create: {
        email: ph.email,
        passwordHash: pharmacistPasswordHash,
        role: Role.PHARMACIST,
        phoneNumber: ph.phone,
        isActive: true,
        pharmacist: {
          create: {
            fullName: ph.name,
            pharmacyName: ph.pharmacyName,
            licenseNumber: ph.license,
            pharmacyId: ph.pharmacyId,
          },
        },
      },
    });
  }

  // CAREGIVERS
  const caregiversData = [
    {
      email: 'caregiver@health.com',
      name: 'Venkatesh Kumar',
      relationship: 'Guardian / Family Caregiver',
      phone: '+91 98402 33445',
    },
    {
      email: 'anita.caregiver@abdm.in',
      name: 'Anita Sharma',
      relationship: 'Elderly Homecare Proxy',
      phone: '+91 98405 67890',
    },
  ];

  for (const cg of caregiversData) {
    await prisma.user.upsert({
      where: { email: cg.email },
      update: {
        passwordHash: caregiverPasswordHash,
      },
      create: {
        email: cg.email,
        passwordHash: caregiverPasswordHash,
        role: Role.CAREGIVER,
        phoneNumber: cg.phone,
        isActive: true,
        caregiver: {
          create: {
            fullName: cg.name,
            relationship: cg.relationship,
            phone: cg.phone,
          },
        },
      },
    });
  }

  // INSURANCE PROVIDERS
  const insuranceData = [
    {
      email: 'insurance@health.com',
      providerName: 'Star Health & Allied Insurance Co.',
      license: 'IRDAI-REG-071',
      phone: '+91 1800 425 2255',
      supportEmail: 'claims@starhealth.in',
    },
    {
      email: 'rohan.tpa@starhealth.in',
      providerName: 'HDFC ERGO General Insurance',
      license: 'IRDAI-REG-146',
      phone: '+91 1800 266 6444',
      supportEmail: 'care@hdfcergo.com',
    },
  ];

  for (const ins of insuranceData) {
    await prisma.user.upsert({
      where: { email: ins.email },
      update: {
        passwordHash: insurancePasswordHash,
      },
      create: {
        email: ins.email,
        passwordHash: insurancePasswordHash,
        role: Role.INSURANCE_PROVIDER,
        phoneNumber: ins.phone,
        isActive: true,
        insuranceProvider: {
          create: {
            providerName: ins.providerName,
            licenseNumber: ins.license,
            supportPhone: ins.phone,
            supportEmail: ins.supportEmail,
          },
        },
      },
    });
  }

  // ADMINS
  const adminUsers = [
    { email: 'admin@health.com', role: Role.ADMIN, phone: '+91 98400 00001' },
    { email: 'admin.kavita@dhr-medicare.in', role: Role.ADMIN, phone: '+91 98407 89012' },
    { email: 'superadmin@dhr-medicare.in', role: Role.SUPER_ADMIN, phone: '+91 98408 90123' },
  ];

  for (const adm of adminUsers) {
    await prisma.user.upsert({
      where: { email: adm.email },
      update: {
        passwordHash: adminPasswordHash,
      },
      create: {
        email: adm.email,
        passwordHash: adminPasswordHash,
        role: adm.role,
        phoneNumber: adm.phone,
        isActive: true,
      },
    });
  }

  // ==========================================
  // 3. SEED MEDICINES CATALOG (25+ MEDICINES)
  // ==========================================
  console.log('Seeding Comprehensive Medicines Catalog...');
  const medicinesCatalog = [
    { name: 'Metformin 500mg SR', genericName: 'Metformin Hydrochloride', category: 'Antidiabetic', dosage: '500mg', unit: 'tablet', stockQuantity: 1200, unitPrice: 6.20 },
    { name: 'Atorvastatin 10mg', genericName: 'Atorvastatin Calcium', category: 'Cardiovascular / Statin', dosage: '10mg', unit: 'tablet', stockQuantity: 950, unitPrice: 18.00 },
    { name: 'Vitamin D3 1000 IU', genericName: 'Cholecalciferol', category: 'Supplements & Vitamins', dosage: '1000 IU', unit: 'capsule', stockQuantity: 800, unitPrice: 12.50 },
    { name: 'Omeprazole 20mg', genericName: 'Omeprazole Magnesium', category: 'Antacid / PPI', dosage: '20mg', unit: 'capsule', stockQuantity: 650, unitPrice: 8.50 },
    { name: 'Amoxicillin & Clavulanate 625mg', genericName: 'Amoxicillin + Clavulanic Acid', category: 'Antibiotic', dosage: '625mg', unit: 'tablet', stockQuantity: 750, unitPrice: 22.50 },
    { name: 'Paracetamol 650mg (Dolo)', genericName: 'Acetaminophen / Paracetamol', category: 'Analgesic / Antipyretic', dosage: '650mg', unit: 'tablet', stockQuantity: 2500, unitPrice: 3.50 },
    { name: 'Pantoprazole 40mg', genericName: 'Pantoprazole Sodium', category: 'Antacid / PPI', dosage: '40mg', unit: 'tablet', stockQuantity: 1100, unitPrice: 11.00 },
    { name: 'Telmisartan 40mg', genericName: 'Telmisartan', category: 'Antihypertensive', dosage: '40mg', unit: 'tablet', stockQuantity: 850, unitPrice: 14.80 },
    { name: 'Cetirizine 10mg', genericName: 'Cetirizine Hydrochloride', category: 'Antihistamine / Allergy', dosage: '10mg', unit: 'tablet', stockQuantity: 1400, unitPrice: 4.50 },
    { name: 'Azithromycin 500mg', genericName: 'Azithromycin Dihydrate', category: 'Antibiotic', dosage: '500mg', unit: 'tablet', stockQuantity: 600, unitPrice: 28.00 },
    { name: 'Levocetirizine 5mg', genericName: 'Levocetirizine Dihydrochloride', category: 'Antihistamine', dosage: '5mg', unit: 'tablet', stockQuantity: 900, unitPrice: 5.50 },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'NSAID / Pain Relief', dosage: '400mg', unit: 'tablet', stockQuantity: 1000, unitPrice: 4.80 },
    { name: 'Losartan Potassium 50mg', genericName: 'Losartan Potassium', category: 'Antihypertensive', dosage: '50mg', unit: 'tablet', stockQuantity: 550, unitPrice: 16.00 },
    { name: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', category: 'Calcium Channel Blocker', dosage: '5mg', unit: 'tablet', stockQuantity: 700, unitPrice: 7.20 },
    { name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin Hydrochloride', category: 'Antibiotic', dosage: '500mg', unit: 'tablet', stockQuantity: 450, unitPrice: 19.50 },
    { name: 'Doxycycline 100mg', genericName: 'Doxycycline Hyclate', category: 'Antibiotic', dosage: '100mg', unit: 'capsule', stockQuantity: 500, unitPrice: 15.00 },
    { name: 'Montelukast 10mg', genericName: 'Montelukast Sodium', category: 'Respiratory / Asthma', dosage: '10mg', unit: 'tablet', stockQuantity: 620, unitPrice: 21.00 },
    { name: 'Salbutamol Inhaler 100mcg', genericName: 'Albuterol / Salbutamol', category: 'Bronchodilator', dosage: '100mcg', unit: 'inhaler', stockQuantity: 280, unitPrice: 145.00 },
    { name: 'Clopidogrel 75mg', genericName: 'Clopidogrel Bisulfate', category: 'Antiplatelet', dosage: '75mg', unit: 'tablet', stockQuantity: 480, unitPrice: 32.00 },
    { name: 'Glimepiride 2mg', genericName: 'Glimepiride', category: 'Antidiabetic', dosage: '2mg', unit: 'tablet', stockQuantity: 650, unitPrice: 9.80 },
    { name: 'Rosuvastatin 10mg', genericName: 'Rosuvastatin Calcium', category: 'Lipid Lowering', dosage: '10mg', unit: 'tablet', stockQuantity: 520, unitPrice: 24.00 },
    { name: 'Calcium Carbonate + Vit D3', genericName: 'Calcium 500mg + D3 250IU', category: 'Bone Health Supplement', dosage: '500mg', unit: 'tablet', stockQuantity: 900, unitPrice: 8.00 },
    { name: 'Zincovit Multivitamin', genericName: 'Multivitamins & Minerals + Zinc', category: 'Dietary Supplement', dosage: 'Standard', unit: 'tablet', stockQuantity: 1500, unitPrice: 10.50 },
    { name: 'Electral ORS Sachet', genericName: 'Oral Rehydration Salts IP', category: 'Electrolytes', dosage: '21.8g', unit: 'sachet', stockQuantity: 2000, unitPrice: 21.50 },
  ];

  for (const med of medicinesCatalog) {
    const existing = await prisma.medicine.findFirst({ where: { name: med.name } });
    if (!existing) {
      await prisma.medicine.create({ data: med });
    }
  }

  const aksharaPatient = patientMap['patient@health.com'];
  const ragulPatient = patientMap['ragul.kumar@abdm.in'];
  const abineshPatient = patientMap['abinesh.k@abdm.in'];
  const drRajesh = doctorMap['doctor@health.com'];
  const drPriya = doctorMap['dr.priya.sharma@apollocentral.in'];
  const drArun = doctorMap['dr.arun.kumar@kauvery.in'];

  // ==========================================
  // 4. SEED MEDICAL RECORDS (10+ RECORDS)
  // ==========================================
  console.log('Seeding Medical Records...');
  if (aksharaPatient && drRajesh) {
    const records = [
      {
        patientId: aksharaPatient.id,
        doctorId: drRajesh.id,
        title: 'Complete Blood Count (CBC) & Lipid Profile',
        type: RecordType.LAB_REPORT,
        hospital: 'Apollo Diagnostics Centre',
        fileName: 'CBC_Lipid_Panel_Aug2026.pdf',
        fileSize: '1.8 MB',
        status: 'Normal',
        isImportant: true,
        notes: 'Hemoglobin: 14.2 g/dL, Platelets: 280,000 /mcL, Total Cholesterol: 172 mg/dL. All parameters within optimal physiological range.',
        recordDate: new Date('2026-08-20'),
      },
      {
        patientId: aksharaPatient.id,
        doctorId: drRajesh.id,
        title: 'Cardiology Follow-up & ECG Telemetry',
        type: RecordType.CONSULTATION,
        hospital: 'Apollo Multispeciality Hospitals',
        fileName: 'ECG_Consultation_Summary.pdf',
        fileSize: '2.4 MB',
        status: 'Normal',
        isImportant: false,
        notes: 'Normal sinus rhythm. Heart rate 74 bpm. Advised moderate aerobic exercise and continued medication adherence.',
        recordDate: new Date('2026-08-15'),
      },
      {
        patientId: aksharaPatient.id,
        doctorId: drRajesh.id,
        title: 'Chest X-Ray PA View (Digital Radiography)',
        type: RecordType.IMAGING,
        hospital: 'City Scan & Imaging Centre',
        fileName: 'Chest_XRay_Digital.pdf',
        fileSize: '4.2 MB',
        status: 'Normal',
        isImportant: false,
        notes: 'Bilateral lung fields clear. Cardiothoracic ratio normal. No active focal parenchymal lesions seen.',
        recordDate: new Date('2026-07-28'),
      },
      {
        patientId: aksharaPatient.id,
        doctorId: drRajesh.id,
        title: 'HbA1c & Fasting Glycemic Evaluation',
        type: RecordType.LAB_REPORT,
        hospital: 'Apollo Central Pathology Lab',
        fileName: 'HbA1c_Fasting_Sugar.pdf',
        fileSize: '1.2 MB',
        status: 'Normal',
        isImportant: true,
        notes: 'HbA1c: 5.4% (Non-Diabetic). Fasting Blood Glucose: 92 mg/dL. Post-prandial Glucose: 118 mg/dL.',
        recordDate: new Date('2026-08-01'),
      },
      {
        patientId: aksharaPatient.id,
        doctorId: drPriya?.id || drRajesh.id,
        title: '2D Echocardiogram & Color Doppler Study',
        type: RecordType.IMAGING,
        hospital: 'Fortis Healthcare Heart Institute',
        fileName: '2D_Echo_Color_Doppler.pdf',
        fileSize: '5.6 MB',
        status: 'Normal',
        isImportant: true,
        notes: 'LVEF: 62%. Normal left ventricular systolic and diastolic function. Valvular structures morphologically normal.',
        recordDate: new Date('2026-06-15'),
      },
    ];

    for (const rec of records) {
      const exists = await prisma.medicalRecord.findFirst({ where: { title: rec.title, patientId: rec.patientId } });
      if (!exists) {
        await prisma.medicalRecord.create({ data: rec });
      }
    }
  }

  // ==========================================
  // 5. SEED PRESCRIPTIONS & RX ITEMS
  // ==========================================
  console.log('Seeding Prescriptions & Items...');
  let primaryPrescriptionId: string | undefined;

  if (aksharaPatient && drRajesh) {
    const rx1 = await prisma.prescription.findFirst({ where: { patientId: aksharaPatient.id } });
    if (!rx1) {
      const created = await prisma.prescription.create({
        data: {
          patientId: aksharaPatient.id,
          doctorId: drRajesh.id,
          diagnosis: 'Mild Seasonal Upper Respiratory Infection & Gastric Protection',
          notes: 'Take medicines after meals. Drink plenty of warm fluids. Follow up in 7 days if symptoms persist.',
          status: PrescriptionStatus.CONFIRMED,
          issuedAt: new Date('2026-08-27'),
          validUntil: new Date('2026-09-27'),
          items: {
            create: [
              {
                medicineName: 'Amoxicillin & Clavulanate',
                dosage: '625 mg',
                unit: 'Tablet',
                frequency: 'Twice daily',
                durationDays: 5,
                instructions: 'Take 1 tablet morning and evening after food. Complete full 5-day course.',
                foodInstruction: 'After Food',
              },
              {
                medicineName: 'Paracetamol',
                dosage: '650 mg',
                unit: 'Tablet',
                frequency: 'As needed',
                durationDays: 3,
                instructions: 'Take 1 tablet every 6-8 hours only if fever or body pain occurs.',
                foodInstruction: 'After Food',
              },
              {
                medicineName: 'Pantoprazole',
                dosage: '40 mg',
                unit: 'Tablet',
                frequency: 'Once daily',
                durationDays: 7,
                instructions: 'Take 1 tablet in the morning 30 minutes before breakfast.',
                foodInstruction: 'Before Food',
              },
            ],
          },
        },
      });
      primaryPrescriptionId = created.id;
    } else {
      primaryPrescriptionId = rx1.id;
    }
  }

  // ==========================================
  // 6. SEED PHARMACY ORDERS & ITEMS
  // ==========================================
  console.log('Seeding Pharmacy Orders...');
  if (aksharaPatient && primaryPrescriptionId) {
    const existingOrder = await prisma.pharmacyOrder.findFirst({ where: { patientId: aksharaPatient.id } });
    if (!existingOrder) {
      await prisma.pharmacyOrder.create({
        data: {
          patientId: aksharaPatient.id,
          prescriptionId: primaryPrescriptionId,
          pharmacyId: pharmacyApollo.id,
          status: OrderStatus.PREPARING,
          totalAmount: 325.50,
          deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
          deliveryType: 'Home Delivery',
          items: {
            create: [
              { medicineName: 'Amoxicillin & Clavulanate (625mg)', dosage: '625 mg', quantity: 10, unitPrice: 22.50, subtotal: 225.00 },
              { medicineName: 'Paracetamol (650mg)', dosage: '650 mg', quantity: 10, unitPrice: 3.50, subtotal: 35.00 },
              { medicineName: 'Pantoprazole (40mg)', dosage: '40 mg', quantity: 7, unitPrice: 11.00, subtotal: 65.50 },
            ],
          },
        },
      });
    }
  }

  // ==========================================
  // 7. SEED APPOINTMENTS
  // ==========================================
  console.log('Seeding Appointments...');
  if (aksharaPatient && drRajesh) {
    const appointmentsList = [
      {
        patientId: aksharaPatient.id,
        doctorId: drRajesh.id,
        appointmentDate: new Date('2026-09-08T10:30:00.000Z'),
        slotTime: '10:30 AM',
        type: AppointmentType.VIDEO,
        status: AppointmentStatus.CONFIRMED,
        fee: 750.0,
        reason: 'Post-Recovery Clinical Review & Blood Pressure Telemetry Check',
        meetingLink: 'https://meet.google.com/dhr-rxv-cardio',
        notes: 'Review symptom resolution and evaluate telemetry readings.',
      },
      {
        patientId: aksharaPatient.id,
        doctorId: drPriya?.id || drRajesh.id,
        appointmentDate: new Date('2026-09-18T16:00:00.000Z'),
        slotTime: '04:00 PM',
        type: AppointmentType.IN_PERSON,
        status: AppointmentStatus.PENDING,
        fee: 800.0,
        reason: 'Quarterly Routine Cardiovascular Checkup & Physical Examination',
        notes: 'Hospital OPD Room 204, Block B.',
      },
      {
        patientId: aksharaPatient.id,
        doctorId: drArun?.id || drRajesh.id,
        appointmentDate: new Date('2026-09-24T11:00:00.000Z'),
        slotTime: '11:00 AM',
        type: AppointmentType.VIDEO,
        status: AppointmentStatus.CONFIRMED,
        fee: 650.0,
        reason: 'Dermatology & Skin Allergy Evaluation Follow-up',
        meetingLink: 'https://meet.google.com/dhr-derma-care',
        notes: 'Check seasonal allergy rash response to topical lotion.',
      },
    ];

    for (const apt of appointmentsList) {
      const exists = await prisma.appointment.findFirst({ where: { patientId: apt.patientId, doctorId: apt.doctorId, slotTime: apt.slotTime } });
      if (!exists) {
        await prisma.appointment.create({ data: apt });
      }
    }
  }

  // ==========================================
  // 8. SEED VITALS HISTORY
  // ==========================================
  console.log('Seeding Vitals...');
  if (aksharaPatient) {
    const vitalsList = [
      {
        patientId: aksharaPatient.id,
        systolicBp: 120,
        diastolicBp: 80,
        heartRate: 74,
        respiratoryRate: 16,
        oxygenSaturation: 99.0,
        temperature: 98.6,
        bloodSugar: 98.0,
        weightKg: 64.5,
        notes: 'Resting vitals stable. SpO2 optimal at room air.',
        recordedAt: new Date('2026-08-28T09:30:00.000Z'),
      },
      {
        patientId: aksharaPatient.id,
        systolicBp: 118,
        diastolicBp: 78,
        heartRate: 72,
        respiratoryRate: 15,
        oxygenSaturation: 99.0,
        temperature: 98.4,
        bloodSugar: 94.0,
        weightKg: 64.4,
        notes: 'Home tele-monitoring sync via Bluetooth BPM.',
        recordedAt: new Date('2026-09-01T08:00:00.000Z'),
      },
      {
        patientId: aksharaPatient.id,
        systolicBp: 122,
        diastolicBp: 82,
        heartRate: 76,
        respiratoryRate: 16,
        oxygenSaturation: 98.5,
        temperature: 98.7,
        bloodSugar: 102.0,
        weightKg: 64.6,
        notes: 'Routine evening clinical vitals logging.',
        recordedAt: new Date('2026-09-03T18:30:00.000Z'),
      },
    ];

    for (const v of vitalsList) {
      const exists = await prisma.vital.findFirst({ where: { patientId: v.patientId, recordedAt: v.recordedAt } });
      if (!exists) {
        await prisma.vital.create({ data: v });
      }
    }
  }

  // ==========================================
  // 9. SEED REMINDERS
  // ==========================================
  console.log('Seeding Reminders...');
  if (aksharaPatient) {
    const remindersList = [
      {
        patientId: aksharaPatient.id,
        title: 'Amoxicillin 625mg (Morning Dose)',
        type: ReminderType.MEDICATION,
        scheduledTime: '08:30 AM',
        frequency: 'Twice daily after breakfast',
        status: ReminderStatus.ACTIVE,
        isCompletedToday: true,
        notes: 'Take with full glass of water after food.',
      },
      {
        patientId: aksharaPatient.id,
        title: 'Doctor Review Follow-up: Dr. Rajesh Varma',
        type: ReminderType.APPOINTMENT,
        scheduledTime: '10:30 AM',
        frequency: 'Scheduled follow-up',
        status: ReminderStatus.ACTIVE,
        isCompletedToday: false,
        doctorName: 'Dr. Rajesh Varma',
        clinicName: 'Apollo Multispeciality Hospitals',
        followUpStatus: 'Accepted',
        followUpDate: new Date('2026-09-08'),
        priority: 'High Priority',
        notes: 'Follow-up tele-consultation for prescription review.',
      },
      {
        patientId: aksharaPatient.id,
        title: 'Daily Blood Pressure Log',
        type: ReminderType.CHECKUP,
        scheduledTime: '07:30 PM',
        frequency: 'Daily evening',
        status: ReminderStatus.ACTIVE,
        isCompletedToday: false,
        notes: 'Measure resting BP after sitting quietly for 5 minutes.',
      },
      {
        patientId: aksharaPatient.id,
        title: 'Pantoprazole 40mg (Pre-Breakfast)',
        type: ReminderType.MEDICATION,
        scheduledTime: '07:00 AM',
        frequency: 'Once daily before breakfast',
        status: ReminderStatus.ACTIVE,
        isCompletedToday: true,
        notes: 'Take 30 minutes before meal.',
      },
    ];

    for (const rem of remindersList) {
      const exists = await prisma.reminder.findFirst({ where: { patientId: rem.patientId, title: rem.title } });
      if (!exists) {
        await prisma.reminder.create({ data: rem });
      }
    }
  }

  // ==========================================
  // 10. SEED NOTIFICATIONS
  // ==========================================
  console.log('Seeding Notifications...');
  const patientUser = await prisma.user.findUnique({ where: { email: 'patient@health.com' } });
  if (patientUser) {
    const notifs = [
      {
        userId: patientUser.id,
        title: 'Pharmacy Order Preparing',
        message: 'Apollo Central Pharmacy is preparing your prescribed medications for dispatch.',
        type: 'PHARMACY',
        category: 'Pharmacy',
        relatedModule: 'pharmacy',
        isRead: false,
      },
      {
        userId: patientUser.id,
        title: 'Tele-Consultation Confirmed',
        message: 'Your video appointment with Dr. Rajesh Varma is confirmed for 08 Sep at 10:30 AM.',
        type: 'APPOINTMENT',
        category: 'Appointment',
        relatedModule: 'appointments',
        isRead: false,
      },
      {
        userId: patientUser.id,
        title: 'Lab Report Synced to ABHA',
        message: 'CBC & Lipid Profile results from Apollo Diagnostics are now verified in your health locker.',
        type: 'RECORDS',
        category: 'Medical Records',
        relatedModule: 'records',
        isRead: true,
      },
      {
        userId: patientUser.id,
        title: 'Medication Adherence Milestone: 100%',
        message: 'Congratulations! You achieved 100% medication adherence this week.',
        type: 'MEDICINE',
        category: 'Medicines',
        relatedModule: 'medicines',
        isRead: false,
      },
    ];

    for (const n of notifs) {
      const exists = await prisma.notification.findFirst({ where: { userId: n.userId, title: n.title } });
      if (!exists) {
        await prisma.notification.create({ data: n });
      }
    }
  }

  // ==========================================
  // 11. SEED CARE REQUESTS FOR NURSES
  // ==========================================
  console.log('Seeding Care Requests...');
  if (ragulPatient && nurseMap['nurse@health.com']) {
    const careRequests = [
      {
        patientId: ragulPatient.id,
        nurseId: nurseMap['nurse@health.com'].id,
        serviceType: 'Post-Op Wound Dressing & IV Cannula Care',
        scheduledDate: new Date(),
        scheduledTime: '10:00 AM',
        location: 'Anna Nagar West, Chennai (Flat 4B, Green Towers)',
        distanceKm: '2.4 km',
        instructions: 'Post-discharge suture dressing & antibiotic IV infusion as prescribed. Check incision drain.',
        status: 'Accepted',
        otpPin: '5928',
        etaMinutes: 12,
        notes: 'Patient is comfortable. Suture incision is healing well with minimal exudate.',
      },
      {
        patientId: aksharaPatient?.id || ragulPatient.id,
        nurseId: nurseMap['nurse@health.com'].id,
        serviceType: 'Elderly Geriatric Vitals Telemetry & BP Check',
        scheduledDate: new Date(Date.now() + 86400000),
        scheduledTime: '03:30 PM',
        location: 'Guindy, Chennai (Emerald Heights)',
        distanceKm: '3.1 km',
        instructions: 'Routine homecare blood pressure, blood glucose, and oxygen saturation logging.',
        status: 'Pending',
        otpPin: '7741',
        etaMinutes: 25,
        notes: 'Scheduled home visit.',
      },
    ];

    for (const cr of careRequests) {
      const exists = await prisma.careRequest.findFirst({ where: { patientId: cr.patientId, serviceType: cr.serviceType } });
      if (!exists) {
        await prisma.careRequest.create({ data: cr });
      }
    }
  }

  // ==========================================
  // 12. SEED AUDIT LOGS
  // ==========================================
  console.log('Seeding Audit Logs for Compliance...');
  if (patientUser) {
    const logs = [
      {
        userId: patientUser.id,
        action: 'USER_LOGIN_SUCCESS',
        entityType: 'AUTH',
        entityId: patientUser.id,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        details: 'Patient authenticated via ABHA credentials successfully.',
      },
      {
        userId: patientUser.id,
        action: 'PRESCRIPTION_CONFIRMED',
        entityType: 'PRESCRIPTION',
        entityId: primaryPrescriptionId || 'RX-1',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        details: 'Patient verified and digitally confirmed e-prescription for dispensary dispatch.',
      },
      {
        userId: patientUser.id,
        action: 'PHARMACY_ORDER_DISPATCHED',
        entityType: 'PHARMACY_ORDER',
        entityId: 'ORD-1',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
        details: 'Order routed to Apollo Central Pharmacy for home delivery.',
      },
    ];

    for (const l of logs) {
      await prisma.auditLog.create({ data: l });
    }
  }

  console.log('✅ Comprehensive MySQL database seeding complete! All tables rich with live DHR data.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
