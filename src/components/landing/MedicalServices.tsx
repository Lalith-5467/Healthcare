import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  Pill, 
  Share2, 
  AlertTriangle, 
  HeartPulse,
  Users,
  Bot,
  ArrowRight
} from 'lucide-react';

interface MedicalServicesProps {
  onSelectService?: (serviceId: string) => void;
}

export const MedicalServices: React.FC<MedicalServicesProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'records',
      title: 'Medical Locker',
      description: 'Store medical reports, lab tests, and prescriptions securely in one place.',
      icon: FileText,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-[#0f3980] dark:text-cyan-400',
    },
    {
      id: 'timeline',
      title: 'Health Timeline',
      description: 'View your complete health journey and diagnostic history chronologically.',
      icon: Clock,
      color: 'bg-teal-50 dark:bg-teal-950/40 text-[#00a896] dark:text-teal-400',
    },
    {
      id: 'medication',
      title: 'Medicine Reminder',
      description: 'Never forget important medicines and doses with automated schedule alerts.',
      icon: Pill,
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'doctor-sharing',
      title: 'Doctor Sharing',
      description: 'Share selected medical records securely with doctors using QR, Link or OTP.',
      icon: Share2,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'emergency-sos',
      title: 'Emergency SOS',
      description: 'Access critical offline medical information instantly during emergencies.',
      icon: AlertTriangle,
      color: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
    },
    {
      id: 'vitals',
      title: 'Vitals Tracking',
      description: 'Track and manage your important health measurements like BP, SpO2 & Heart Rate.',
      icon: HeartPulse,
      color: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'caregiver',
      title: 'Caregiver Support',
      description: 'Keep trusted family members and caregivers informed with alerts.',
      icon: Users,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'ai-assistance',
      title: 'AI Assistance',
      description: 'Prepare for future AI-powered health assistance and prescription scanning.',
      icon: Bot,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <section id="services" className="py-24 bg-white dark:bg-[#0b1120] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0f3980] dark:text-cyan-400">
              PHR & Caregiver Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Everything You Need For Better Health
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              An all-in-one digital health platform designed to store records, manage medications, and connect patients with doctors and caregivers.
            </p>
          </div>
          <button 
            onClick={() => onSelectService && onSelectService('records')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0f3980] dark:text-cyan-400 hover:text-[#00a896] transition-colors group cursor-pointer shrink-0"
          >
            <span>Explore All Capabilities</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* SERVICES CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                onClick={() => onSelectService && onSelectService(service.id)}
                className="group relative p-7 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* ICON */}
                  <div className={`w-13 h-13 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#0f3980] dark:group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* LEARN MORE ARROW LINK */}
                <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#0f3980] dark:text-cyan-400">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

