import React from 'react';
import { AuthPage } from './AuthPage';

interface RegisterPageProps {
  initialRole?: 'patient' | 'doctor' | 'caregiver' | 'pharmacist' | 'nurse' | 'insurance';
  onNavigateHome: () => void;
  onNavigate: (page: string) => void;
  onSuccessLogin?: (userData: { 
    name: string; 
    email: string; 
    role?: string;
    abhaId?: string;
    bloodGroup?: string;
    age?: number;
    phone?: string;
    emergencyContact?: string;
    specialization?: string;
    hospitalAffiliation?: string;
  }) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ initialRole = 'patient', onNavigateHome, onNavigate, onSuccessLogin }) => {
  return (
    <AuthPage 
      initialMode="register" 
      initialRole={initialRole}
      onNavigateHome={onNavigateHome} 
      onNavigate={onNavigate}
      onSuccessLogin={onSuccessLogin}
    />
  );
};

export default RegisterPage;
