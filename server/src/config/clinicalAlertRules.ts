export interface ClinicalRule {
  id: string;
  vitalType: string;
  operator: '<' | '<=' | '>' | '>=' | '==';
  threshold?: number;
  secondaryThreshold?: number; // For ranges or OR conditions (like BP where either systolic or diastolic can trigger)
  unit: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  enabled: boolean;
  source: string;
  sourceVersion: string;
  population: string;
  messageKey: string;
  description: string;
}

export const CLINICAL_RULES: ClinicalRule[] = [
  {
    id: 'rule_spo2_hypoxemia',
    vitalType: 'oxygenSaturation',
    operator: '<',
    threshold: 90,
    unit: '%',
    severity: 'CRITICAL',
    enabled: true,
    source: 'FDA / WHO',
    sourceVersion: 'Current',
    population: 'Adults (General)',
    messageKey: 'abnormal_vital_detected',
    description: 'SpO2 < 90% is commonly considered hypoxemia requiring clinical review. Not a diagnosis.'
  },
  {
    id: 'rule_bp_hypertensive_crisis',
    vitalType: 'bloodPressure', // Special compound vital
    operator: '>=',
    threshold: 180, // systolic
    secondaryThreshold: 120, // diastolic
    unit: 'mmHg',
    severity: 'CRITICAL',
    enabled: true,
    source: '2017 AHA/ACC Guidelines',
    sourceVersion: '2017',
    population: 'Adults (General)',
    messageKey: 'abnormal_vital_detected',
    description: 'Systolic >= 180 OR Diastolic >= 120 indicates potential hypertensive crisis requiring immediate review.'
  },
  {
    id: 'rule_hr_tachycardia',
    vitalType: 'heartRate',
    operator: '>',
    threshold: 100,
    unit: 'bpm',
    severity: 'WARNING',
    enabled: false, // NOT ACTIVATED pending context (resting vs active)
    source: 'AHA',
    sourceVersion: 'Current',
    population: 'Adults (Resting)',
    messageKey: 'abnormal_vital_detected',
    description: 'HR > 100 bpm at rest may indicate tachycardia, but context is required.'
  },
  {
    id: 'rule_temp_fever',
    vitalType: 'temperature',
    operator: '>=',
    threshold: 100.4,
    unit: '°F',
    severity: 'WARNING',
    enabled: false, // NOT ACTIVATED pending population/age specific rules
    source: 'CDC',
    sourceVersion: 'Current',
    population: 'Adults (General)',
    messageKey: 'abnormal_vital_detected',
    description: 'Temperature >= 100.4 °F is considered a fever.'
  },
  {
    id: 'rule_respiratory_rate',
    vitalType: 'respiratoryRate',
    operator: '<', // Example, not active
    threshold: 12,
    unit: 'breaths/min',
    severity: 'WARNING',
    enabled: false, // NOT ACTIVATED - Insufficient context
    source: 'General Clinical Standard',
    sourceVersion: 'Current',
    population: 'Adults (General)',
    messageKey: 'abnormal_vital_detected',
    description: 'RR requires clinical context.'
  },
  {
    id: 'rule_blood_sugar',
    vitalType: 'bloodSugar',
    operator: '>', 
    threshold: 200,
    unit: 'mg/dL',
    severity: 'WARNING',
    enabled: false, // NOT ACTIVATED - Requires fasting/random context
    source: 'ADA',
    sourceVersion: 'Current',
    population: 'Adults (General)',
    messageKey: 'abnormal_vital_detected',
    description: 'Blood glucose interpretation requires fasting/postprandial context.'
  }
];
