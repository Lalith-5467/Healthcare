/**
 * Caregiver Data Localization Helpers
 * Dynamically translates data fields (dosages, instructions, tasks, categories, locations)
 * when language is set to Tamil ('ta').
 */

export const getLocalizedDosage = (dosage: string, t: (key: string, fallback?: string) => string): string => {
  if (!dosage) return '';
  const lower = dosage.toLowerCase();
  if (lower.includes('1 tablet daily')) return t('caregiver.data.dosage_1_daily', '1 Tablet Daily');
  if (lower.includes('1 tablet twice daily')) return t('caregiver.data.dosage_1_twice', '1 Tablet Twice Daily');
  if (lower.includes('1 tablet (evening dose)')) return t('caregiver.data.dosage_1_evening', '1 Tablet (Evening dose)');
  if (lower.includes('1 tablet at bedtime')) return t('caregiver.data.dosage_1_bedtime', '1 Tablet at Bedtime');
  if (lower.includes('1 tablet empty stomach')) return t('caregiver.data.dosage_1_empty_stomach', '1 Tablet Empty Stomach');
  if (lower.includes('1 tablet post lunch')) return t('caregiver.data.dosage_1_post_lunch', '1 Tablet Post Lunch');
  if (lower.includes('1 capsule evening')) return t('caregiver.data.dosage_1_capsule_evening', '1 Capsule Evening');
  if (lower.includes('2 puffs sos')) return t('caregiver.data.dosage_2_puffs_sos', '2 Puffs SOS');
  return dosage;
};

export const getLocalizedInstructions = (instructions: string, t: (key: string, fallback?: string) => string): string => {
  if (!instructions) return '';
  const lower = instructions.toLowerCase();
  if (lower.includes('warm water before breakfast')) return t('caregiver.data.inst_warm_water', 'Take with warm water before breakfast');
  if (lower.includes('immediately after food')) return t('caregiver.data.inst_after_food', 'Take immediately after food to avoid gastric irritation');
  if (lower.includes('post dinner')) return t('caregiver.data.inst_post_dinner', 'Take post dinner');
  if (lower.includes('30 mins before sleeping')) return t('caregiver.data.inst_before_sleeping', 'Take 30 mins before sleeping');
  if (lower.includes('post meals with water')) return t('caregiver.data.inst_post_meals', 'Take post meals with water');
  if (lower.includes('45 mins before breakfast')) return t('caregiver.data.inst_empty_stomach', 'Take 45 mins before breakfast with plain water');
  if (lower.includes('milk or meal')) return t('caregiver.data.inst_with_milk', 'Take with milk or meal');
  if (lower.includes('tea/snack')) return t('caregiver.data.inst_joint_support', 'Take after tea/snack for joint support');
  if (lower.includes('chew before bedtime')) return t('caregiver.data.inst_chew_bedtime', 'Chew before bedtime');
  if (lower.includes('wheezing')) return t('caregiver.data.inst_use_spacer', 'Use spacer if experiencing wheezing');
  return instructions;
};

export const getLocalizedTaskTitle = (title: string, t: (key: string, fallback?: string) => string): string => {
  if (!title) return '';
  const lower = title.toLowerCase();
  if (lower.includes('morning bp & metformin')) return t('caregiver.data.task_t1', 'Assist Ragul with Morning BP & Metformin');
  if (lower.includes('calcium post-lunch')) return t('caregiver.data.task_t2', 'Ensure Meena takes Calcium post-lunch');
  if (lower.includes('nurse for ragul ecg')) return t('caregiver.data.task_t3', 'Book Home Nurse for Ragul ECG check');
  if (lower.includes('knee mobility exercises')) return t('caregiver.data.task_t4', 'Assist Meena with 15-min Knee Mobility Exercises');
  if (lower.includes('evening blood sugar')) return t('caregiver.data.task_t5', 'Record Evening Blood Sugar & Night Medication');
  if (lower.includes('morning blood pressure check')) return t('caregiver.data.task_t6', 'Morning Blood Pressure Check');
  if (lower.includes('glucose test')) return t('caregiver.data.task_t7', 'Glucose Test');
  if (lower.includes('20 min walking')) return t('caregiver.data.task_t8', 'Assist with 20 min Walking');
  if (lower.includes('evening medication administration')) return t('caregiver.data.task_t9', 'Evening Medication Administration');
  if (lower.includes('pulse & spo2')) return t('caregiver.data.task_t10', 'Check Pulse & SpO2');
  if (lower.includes('bedtime routine')) return t('caregiver.data.task_t11', 'Assist with Bedtime Routine');
  return title;
};

export const getLocalizedTaskCategory = (category: string, t: (key: string, fallback?: string) => string): string => {
  if (!category) return '';
  const lower = category.toLowerCase();
  if (lower.includes('medication')) return t('caregiver.data.cat_med_reminder', 'Medication Reminder');
  if (lower.includes('vital')) return t('caregiver.data.cat_vital_check', 'Vital Check');
  if (lower.includes('biometric')) return t('caregiver.data.cat_biometrics', 'Biometrics');
  if (lower.includes('doctor') || lower.includes('appointment')) return t('caregiver.data.cat_doctor', 'Appointment');
  if (lower.includes('mobility')) return t('caregiver.data.cat_mobility', 'Mobility');
  if (lower.includes('physical therapy')) return t('caregiver.data.cat_physical_therapy', 'Physical Therapy');
  if (lower.includes('hygiene') || lower.includes('personal care')) return t('caregiver.data.cat_hygiene', 'Personal Care');
  if (lower.includes('nutrition')) return t('caregiver.data.cat_nutrition', 'Nutrition');
  if (lower.includes('hydration')) return t('caregiver.data.cat_hydration', 'Hydration');
  if (lower.includes('wellness')) return t('caregiver.data.cat_wellness', 'Wellness');
  return category;
};

export const getLocalizedLocation = (loc: string, t: (key: string, fallback?: string) => string): string => {
  if (!loc) return '';
  const lower = loc.toLowerCase();
  if (lower.includes('home - master bedroom')) return t('caregiver.data.loc_home_bedroom', 'Home - Master Bedroom (WiFi: HomeMesh_5G)');
  if (lower.includes('home - balcony garden')) return t('caregiver.data.loc_home_balcony', 'Home - Balcony Garden');
  if (lower.includes('greenwood school')) return t('caregiver.data.loc_school_campus', 'Greenwood School - Campus (Safe Zone)');
  return loc;
};

export const getLocalizedTimeAgo = (time: string, t: (key: string, fallback?: string) => string): string => {
  if (!time) return '';
  const lower = time.toLowerCase();
  if (lower.includes('just now')) return t('caregiver.data.time_just_now', 'Just now');
  if (lower.includes('5 mins ago')) return t('caregiver.data.time_5m_ago', '5 mins ago');
  if (lower.includes('10 mins ago')) return t('caregiver.data.time_10m_ago', '10 mins ago');
  return time;
};

export const getLocalizedCondition = (cond: string, t: (key: string, fallback?: string) => string): string => {
  if (!cond) return '';
  const lower = cond.toLowerCase();
  if (lower.includes('hypertension & type 2 diabetes')) return t('caregiver.data.condition_ragul', 'Hypertension & Type 2 Diabetes');
  if (lower.includes('osteoarthritis & hypothyroidism')) return t('caregiver.data.condition_meena', 'Osteoarthritis & Hypothyroidism');
  if (lower.includes('asthma')) return t('caregiver.data.condition_aarav', 'Mild Pediatric Asthma');
  return cond;
};

export const getLocalizedName = (name: string, t: (key: string, fallback?: string) => string): string => {
  if (!name) return '';
  const lower = name.toLowerCase();
  if (lower.includes('arun raj')) return t('caregiver.name.arun_raj', 'Arun Raj');
  if (lower.includes('ragul kumar') || lower.includes('ragul')) return t('caregiver.name.ragul_kumar', 'Ragul Kumar');
  if (lower.includes('meena kumar') || lower.includes('meena')) return t('caregiver.name.meena_kumar', 'Meena Kumar');
  if (lower.includes('aarav kumar') || lower.includes('aarav')) return t('caregiver.name.aarav_kumar', 'Aarav Kumar');
  if (lower.includes('anita sharma') || lower.includes('anita')) return t('caregiver.name.anita_sharma', 'Anita Sharma');
  if (lower.includes('lakshmi raj') || lower.includes('lakshmi')) return t('caregiver.name.lakshmi_raj', 'Lakshmi Raj');
  if (lower.includes('anjali')) return t('caregiver.name.anjali', 'Anjali');
  if (lower.includes('dr. rajesh varma') || lower.includes('rajesh varma')) return t('caregiver.name.dr_rajesh_varma', 'Dr. Rajesh Varma');
  if (lower.includes('dr. priya sundaram') || lower.includes('priya sundaram')) return t('caregiver.name.dr_priya_sundaram', 'Dr. Priya Sundaram');
  if (lower.includes('dr. ananya sen') || lower.includes('ananya sen')) return t('caregiver.name.dr_ananya_sen', 'Dr. Ananya Sen');
  if (lower.includes('dr. vikram seth') || lower.includes('vikram seth')) return t('caregiver.name.dr_vikram_seth', 'Dr. Vikram Seth');
  if (lower.includes('star health')) return t('caregiver.name.star_health', 'Star Health');
  if (lower.includes('rajesh sharma')) return t('caregiver.name.rajesh_sharma', 'Rajesh Sharma');
  return name;
};

export const getLocalizedRelationship = (rel: string, t: (key: string, fallback?: string) => string): string => {
  if (!rel) return '';
  const lower = rel.toLowerCase();
  if (lower.includes('father')) return t('caregiver.common.father', 'Father');
  if (lower.includes('mother')) return t('caregiver.common.mother', 'Mother');
  if (lower.includes('spouse') || lower.includes('wife')) return t('caregiver.common.wife', 'Wife');
  if (lower.includes('husband')) return t('caregiver.common.husband', 'Husband');
  if (lower.includes('daughter')) return t('caregiver.common.daughter', 'Daughter');
  if (lower.includes('son') || lower.includes('child')) return t('caregiver.common.child', 'Child');
  return rel;
};

export const getLocalizedRecordTitle = (title: string, t: (key: string, fallback?: string) => string): string => {
  if (!title) return '';
  const lower = title.toLowerCase();
  if (lower.includes('cardiology follow-up')) return t('caregiver.records.title_cardiology', 'Cardiology Follow-up');
  if (lower.includes('hypertension')) return t('caregiver.records.title_hypertension', 'Hypertension Meds');
  if (lower.includes('lipid profile')) return t('caregiver.records.title_lipid', 'Lipid Profile');
  if (lower.includes('post-surgery summary')) return t('caregiver.records.title_post_surgery', 'Post-Surgery Summary');
  if (lower.includes('influenza vaccine')) return t('caregiver.records.title_influenza', 'Influenza Vaccine');
  return title;
};

export const getLocalizedRecordType = (type: string, t: (key: string, fallback?: string) => string): string => {
  if (!type) return '';
  const lower = type.toLowerCase();
  if (lower.includes('consultation')) return t('caregiver.records.type_consultation', 'Consultation');
  if (lower.includes('prescription')) return t('caregiver.records.type_prescription', 'Prescription');
  if (lower.includes('lab report')) return t('caregiver.records.type_lab', 'Lab Report');
  if (lower.includes('discharge summary')) return t('caregiver.records.type_discharge', 'Discharge Summary');
  if (lower.includes('vaccination')) return t('caregiver.records.type_vaccination', 'Vaccination');
  return type;
};

