import React from 'react';
import { AuthPage } from './AuthPage';

interface RegisterPageProps {
  onNavigateHome: () => void;
  onNavigate: (page: string) => void;
  onSuccessLogin?: (userData: { 
    name: string; 
    email: string; 
    abhaId?: string;
    bloodGroup?: string;
    age?: number;
    phone?: string;
    emergencyContact?: string;
  }) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateHome, onNavigate, onSuccessLogin }) => {
  return (
    <AuthPage 
      initialMode="register" 
      onNavigateHome={onNavigateHome} 
      onNavigate={onNavigate}
      onSuccessLogin={onSuccessLogin}
    />
  );
};

export default RegisterPage;
