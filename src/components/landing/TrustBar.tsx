import React from 'react';
import { 
  FileCheck2, 
  QrCode, 
  Pill, 
  AlertCircle 
} from 'lucide-react';

export const TrustBar: React.FC = () => {
  const benefits = [
    {
      title: 'Secure Medical Records',
      desc: 'Store & organize diagnostic reports, prescriptions, and lab tests.',
      icon: FileCheck2,
      color: 'text-[#0f3980] dark:text-cyan-400 bg-blue-100/70 dark:bg-blue-900/40',
    },
    {
      title: 'QR / Link / OTP Sharing',
      desc: 'Grant doctor access with time-bound PIN or OTP verification.',
      icon: QrCode,
      color: 'text-[#00a896] dark:text-teal-400 bg-teal-100/70 dark:bg-teal-900/40',
    },
    {
      title: 'Medicine Reminders',
      desc: 'Automated daily dosage alerts with taken/missed tracking.',
      icon: Pill,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-100/70 dark:bg-purple-900/40',
    },
    {
      title: 'Emergency SOS',
      desc: 'Instant offline access to blood group, allergies, and emergency contacts.',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400 bg-red-100/70 dark:bg-red-900/40',
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-[#0b1120] border-y border-slate-200/80 dark:border-slate-800 py-10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0f3980] dark:group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
