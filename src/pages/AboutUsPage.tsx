import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Lock, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Sparkles
} from 'lucide-react';

import { CountUp } from '../components/ui/CountUp';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onStartJourney: () => void;
  onExploreFeatures: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ 
  onNavigateHome: _onNavigateHome, 
  onStartJourney, 
  onExploreFeatures 
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const coreValues = [
    {
      icon: Lock,
      title: 'Patient Privacy First',
      desc: 'Your health data belongs strictly to you. Every record is stored with 256-bit AES encryption and ABDM-compliant consent gates.',
      badge: '256-Bit AES',
    },
    {
      icon: ShieldCheck,
      title: 'Instant Emergency SOS',
      desc: 'Offline-ready QR medical card equipping first responders with blood group, emergency contacts, and severe allergy warnings in seconds.',
      badge: 'Offline SOS',
    },
    {
      icon: Users,
      title: 'Seamless Caregiver Companion',
      desc: 'Keep aging parents, children, and family members connected with automated pill reminders and shared health summaries.',
      badge: 'Family Sync',
    },
    {
      icon: Activity,
      title: 'Universal ABDM Connectivity',
      desc: 'Directly linked to Ayushman Bharat Digital Mission (ABDM) enabling seamless record transfer across labs, hospitals, and clinics.',
      badge: 'ABHA Linked',
    },
  ];

  const milestones = [
    {
      target: 100,
      suffix: '%',
      label: 'Encrypted Health Records',
      subtext: '256-bit HIPAA compliance',
    },
    {
      target: 50000,
      prefix: '',
      suffix: '+',
      separator: ',',
      label: 'ABHA IDs Linked',
      subtext: 'Across Indian health network',
    },
    {
      target: 99.8,
      suffix: '%',
      label: 'OCR Accuracy Rate',
      subtext: 'Smart prescription digitizer',
    },
    {
      target: 24,
      suffix: '/7',
      label: 'Emergency SOS Readiness',
      subtext: 'Offline QR instant access',
    },
  ];

  const team = [
    {
      name: 'Dr. Rajesh Varma',
      role: 'Chief Medical Officer',
      specialty: 'Cardiology & Healthcare Tech',
      img: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Digital Health & Privacy',
      specialty: 'ABDM Protocols & Data Security',
      img: 'https://images.unsplash.com/photo-1594824813571-21252df9d944?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Dr. Ananya Sen',
      role: 'Emergency Medicine Advisor',
      specialty: 'Trauma Care & SOS Workflows',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 2. OUR MISSION & VISION */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* MISSION CARD */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00a896]/15 border border-[#00a896]/30 text-[#00a896] flex items-center justify-center">
                <Target className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Our Mission</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                To organize the world's medical records and empower every individual with 24/7 instant access to their diagnostic history, prescriptions, and emergency health information — anytime, anywhere.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#00a896]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Patient Ownership & Control</span>
              </div>
            </motion.div>

            {/* VISION CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 flex items-center justify-center">
                <Eye className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Building India's safest, most accessible, and ABDM-integrated digital health companion where patients, doctors, hospitals, and emergency first responders collaborate effortlessly.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Nationwide ABHA Ecosystem</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. CORE VALUES & PILLARS */}
      <section className="py-20 bg-slate-50 dark:bg-[#0b1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00a896]">
              Our Guiding Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Why Families Trust MediCare
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
              We combine enterprise-grade privacy, intuitive accessibility, and real-time medical connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/50 text-[#00a896] flex items-center justify-center">
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-[#00a896] border border-teal-200 dark:border-teal-800">
                        {val.badge}
                      </span>
                    </div>

                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {val.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {val.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. PLATFORM MILESTONES & STATS WITH REACT BITS COUNTUP ANIMATION */}
      <section className="py-20 bg-gradient-to-r from-[#00a896] via-teal-600 to-cyan-600 text-white shadow-xl relative overflow-hidden">
        {/* BACKGROUND ACCENTS */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-900/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-teal-100 bg-white/15 px-3.5 py-1 rounded-full border border-white/20">
              Live Impact & Telemetry
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Trusted Across Healthcare
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {milestones.map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl space-y-2 shadow-lg"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-mono flex items-center justify-center">
                  {st.prefix && <span>{st.prefix}</span>}
                  <CountUp
                    to={st.target}
                    from={0}
                    separator={st.separator || ''}
                    duration={2.2}
                    className="font-black"
                  />
                  {st.suffix && <span>{st.suffix}</span>}
                </div>
                <h4 className="text-sm font-extrabold text-white">{st.label}</h4>
                <p className="text-[11px] font-medium text-teal-100/90">{st.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP TEAM */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00a896]">
              Expert Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Guided by Healthcare Specialists
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
              Our medical advisors and technology pioneers ensure clinical excellence and privacy compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((mem, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-md group hover:shadow-xl transition-all"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={mem.img} 
                    alt={mem.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-lg font-extrabold">{mem.name}</h4>
                    <p className="text-xs text-teal-300 font-medium">{mem.role}</p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Specialization: <span className="font-bold text-slate-900 dark:text-white">{mem.specialty}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Organize Your Family's Health Records?
          </h2>
          <p className="text-base text-slate-300 font-medium max-w-xl mx-auto">
            Join thousands of patients enjoying 100% encrypted, ABDM-linked health records with instant emergency SOS card readiness.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={onStartJourney}
              className="px-8 py-3.5 text-base font-bold text-white bg-[#00a896] hover:bg-[#00897b] rounded-xl shadow-lg cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              onClick={onExploreFeatures}
              className="px-7 py-3.5 text-base font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
