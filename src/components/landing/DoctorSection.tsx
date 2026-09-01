import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '../ui/SocialIcons';

interface DoctorSectionProps {
  onOpenDoctorPortal: () => void;
}

export const DoctorSection: React.FC<DoctorSectionProps> = ({ onOpenDoctorPortal }) => {
  const doctors = [
    {
      id: 'dr-1',
      name: 'Dr. James Anderson',
      specialty: 'Cardiologist',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'dr-2',
      name: 'Dr. Sarah Mitchell',
      specialty: 'Neurologist',
      image: 'https://images.unsplash.com/photo-1594824813566-78853b841793?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'dr-3',
      name: 'Dr. Michael Brown',
      specialty: 'Orthopedic Surgeon',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'dr-4',
      name: 'Dr. Emily Johnson',
      specialty: 'Pediatrician',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 'dr-5',
      name: 'Dr. David Wilson',
      specialty: 'Dental Specialist',
      image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=500&q=80',
    },
  ];

  return (
    <section id="doctors" className="py-20 bg-white dark:bg-[#0b1120] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00a896] dark:text-cyan-400">
              Expert Healthcare Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Meet Our Doctors
            </h2>
          </div>
          <button 
            onClick={onOpenDoctorPortal}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0f3980] dark:text-cyan-400 hover:text-[#00a896] transition-colors group"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* DOCTORS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {doctors.map((doctor, idx) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col text-center"
            >
              {/* DOCTOR IMAGE */}
              <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80";
                  }}
                />
                
                {/* APPOINTMENT HOVER OVERLAY */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <button 
                    onClick={onOpenDoctorPortal}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#00a896] hover:bg-[#008f80] rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Consult</span>
                  </button>
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0f3980] dark:group-hover:text-cyan-400 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-medium text-[#00a896] dark:text-cyan-400 mt-0.5">
                    {doctor.specialty}
                  </p>
                </div>

                {/* SOCIAL LINKS */}
                <div className="flex items-center justify-center space-x-3 pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-400">
                  <a href="#" className="hover:text-[#0f3980] dark:hover:text-white transition-colors" aria-label="Facebook"><FacebookIcon className="w-3.5 h-3.5" /></a>
                  <a href="#" className="hover:text-[#0f3980] dark:hover:text-white transition-colors" aria-label="Twitter"><TwitterIcon className="w-3.5 h-3.5" /></a>
                  <a href="#" className="hover:text-[#0f3980] dark:hover:text-white transition-colors" aria-label="LinkedIn"><LinkedinIcon className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
