import React from 'react';
import { AuthPage } from './AuthPage';

interface LoginPageProps {
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

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateHome, onNavigate, onSuccessLogin }) => {
  return (
    <AuthPage 
      initialMode="login" 
      onNavigateHome={onNavigateHome} 
      onNavigate={onNavigate}
      onSuccessLogin={onSuccessLogin}
    />
  );
};

export default LoginPage;
