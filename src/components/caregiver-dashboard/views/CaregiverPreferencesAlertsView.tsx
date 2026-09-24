import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Settings,
  MessageSquare,
  Activity,
  AlertOctagon,
  Phone,
  ShieldAlert,
  Smartphone,
  Save,
  Moon,
  ToggleLeft,
  ToggleRight,
  Globe
} from 'lucide-react';

import { useLanguage } from '../../../context/LanguageContext';

export const CaregiverPreferencesAlertsView: React.FC = () => {
  const { language: currentLang, setLanguage: setGlobalLanguage, t } = useLanguage();
  // State for changes to trigger sticky bar
  const [hasChanges, setHasChanges] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const markChanged = () => setHasChanges(true);

  // Notification Preferences
  const [notifTaskAssigned, setNotifTaskAssigned] = useState(true);
  const [notifTaskReminder, setNotifTaskReminder] = useState(true);
  const [notifUpcomingAppt, setNotifUpcomingAppt] = useState(true);
  const [notifTaskOverdue, setNotifTaskOverdue] = useState(true);
  const [notifCareNote, setNotifCareNote] = useState(true);
  const [notifNewMessage, setNotifNewMessage] = useState(true);

  // Health & Med Alerts
  const [alertMedReminder, setAlertMedReminder] = useState(true);
  const [alertMissedMed, setAlertMissedMed] = useState(true);
  const [alertVital, setAlertVital] = useState(true);
  const [alertHealthObs, setAlertHealthObs] = useState(true);
  const [alertLowStock, setAlertLowStock] = useState(true);
  const [alertApptReminder, setAlertApptReminder] = useState(true);

  // Emergency Alert Channels
  const [smsBroadcast, setSmsBroadcast] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [voiceCall, setVoiceCall] = useState(true);

  // Preferred Notification Channels
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelPush, setChannelPush] = useState(true);
  const [channelEmail, setChannelEmail] = useState(false);
  const [channelSms, setChannelSms] = useState(true);
  const [channelWhatsapp, setChannelWhatsapp] = useState(true);

  // Task Preferences
  const [defaultTaskView, setDefaultTaskView] = useState('Timeline');
  const [defaultTaskFilter, setDefaultTaskFilter] = useState('All Tasks');
  const [taskReminder, setTaskReminder] = useState('15 minutes');

  // Quiet Hours
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);

  // App Preferences
  const [language, setLanguage] = useState('English');
  const [timeFormat, setTimeFormat] = useState('12 Hour');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Privacy Preferences
  const [privacyPatientName, setPrivacyPatientName] = useState(true);
  const [privacyNotifPreview, setPrivacyNotifPreview] = useState(true);
  const [privacyHideSensitive, setPrivacyHideSensitive] = useState(true);
  const [privacyRequireLock, setPrivacyRequireLock] = useState(false);

  const handleSave = () => {
    setHasChanges(false);
    setToastMsg('Preferences saved successfully');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const Toggle = ({ checked, onChange, label, description }: any) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-teal-300 dark:hover:border-teal-700/50">
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white">{label}</h4>
        {description && <p className="text-[11px] text-slate-500 mt-0.5 leading-tight pr-4">{description}</p>}
      </div>
      <button 
        onClick={() => { onChange(!checked); markChanged(); }}
        className={`p-1 rounded-full transition-colors flex items-center shrink-0 ${checked ? 'text-teal-500' : 'text-slate-300 dark:text-slate-600'}`}
      >
        {checked ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 relative select-none">
      
      {/* TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>{t('caregiver.preferences.title', 'Preferences & Alert Settings')}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('caregiver.preferences.subtitle', 'Customize notifications, SMS alerts, and geofence boundary thresholds.')}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg flex items-center gap-2 self-start md:self-auto ${
            hasChanges 
              ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20' 
              : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 shadow-none cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{t('caregiver.preferences.save_btn', 'Save Preferences')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* COLUMN 1 */}
        <div className="space-y-8">
          
          {/* NOTIFICATION PREFERENCES */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Bell className="w-4 h-4" /> {t('caregiver.preferences.notif_prefs', 'Notification Preferences')}
            </h3>
            <div className="space-y-2">
              <Toggle checked={notifTaskAssigned} onChange={setNotifTaskAssigned} label={t('caregiver.preferences.task_assigned', 'Care Task Assigned')} description={t('caregiver.preferences.task_assigned_desc', 'Notify when a new care task is assigned to you.')} />
              <Toggle checked={notifTaskReminder} onChange={setNotifTaskReminder} label={t('caregiver.preferences.task_reminder', 'Task Reminder')} description={t('caregiver.preferences.task_reminder_desc', 'Receive reminders for upcoming scheduled tasks.')} />
              <Toggle checked={notifUpcomingAppt} onChange={setNotifUpcomingAppt} label={t('caregiver.preferences.upcoming_appt', 'Upcoming Appointment')} description={t('caregiver.preferences.upcoming_appt_desc', 'Reminders for upcoming doctor appointments.')} />
              <Toggle checked={notifTaskOverdue} onChange={setNotifTaskOverdue} label={t('caregiver.preferences.task_overdue', 'Task Overdue')} description={t('caregiver.preferences.task_overdue_desc', 'Alert when a critical task misses its deadline.')} />
              <Toggle checked={notifCareNote} onChange={setNotifCareNote} label={t('caregiver.preferences.care_note', 'Care Note Update')} description={t('caregiver.preferences.care_note_desc', 'Notify when another caregiver adds a note.')} />
              <Toggle checked={notifNewMessage} onChange={setNotifNewMessage} label={t('caregiver.preferences.new_msg', 'New Message')} description={t('caregiver.preferences.new_msg_desc', 'Alert for new messages from care circle members.')} />
            </div>
          </section>

          {/* HEALTH & MEDICATION ALERTS */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4" /> {t('caregiver.preferences.health_alerts', 'Health & Medication Alerts')}
            </h3>
            <div className="space-y-2">
              <Toggle checked={alertMedReminder} onChange={setAlertMedReminder} label={t('caregiver.preferences.med_reminder', 'Medication Reminder')} />
              <Toggle checked={alertMissedMed} onChange={setAlertMissedMed} label={t('caregiver.preferences.missed_med', 'Missed Medication Alert')} />
              <Toggle checked={alertVital} onChange={setAlertVital} label={t('caregiver.preferences.vital_abnormal', 'Vital Abnormality Alert')} />
              <Toggle checked={alertHealthObs} onChange={setAlertHealthObs} label={t('caregiver.preferences.health_obs', 'Health Observation Update')} />
              <Toggle checked={alertLowStock} onChange={setAlertLowStock} label={t('caregiver.preferences.low_stock', 'Low Medication Stock Alert')} />
              <Toggle checked={alertApptReminder} onChange={setAlertApptReminder} label={t('caregiver.preferences.appt_reminder', 'Appointment Reminder')} />
            </div>
          </section>

          {/* PRIVACY & NOTIFICATION PREVIEW */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> {t('caregiver.preferences.privacy_prefs', 'Privacy Preferences')}
            </h3>
            <div className="space-y-2">
              <Toggle checked={privacyPatientName} onChange={setPrivacyPatientName} label={t('caregiver.preferences.show_name', 'Show Patient Name in Notifications')} />
              <Toggle checked={privacyNotifPreview} onChange={setPrivacyNotifPreview} label={t('caregiver.preferences.show_preview', 'Show Notification Preview')} />
              <Toggle checked={privacyHideSensitive} onChange={setPrivacyHideSensitive} label={t('caregiver.preferences.hide_sensitive', 'Hide Sensitive Information on Lock Screen')} />
              <Toggle checked={privacyRequireLock} onChange={setPrivacyRequireLock} label={t('caregiver.preferences.require_lock', 'Require App Lock for Sensitive Information')} />
            </div>
          </section>

        </div>

        {/* COLUMN 2 */}
        <div className="space-y-8">
          
          {/* EMERGENCY ALERT CHANNELS */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" /> {t('caregiver.preferences.emergency_channels', 'Emergency Alert Dispatch Channels')}
            </h3>
            
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 flex items-center justify-between">
              <div>
                <p className="font-black text-rose-700 dark:text-rose-400 flex items-center gap-2"><Smartphone className="w-4 h-4" /> {t('caregiver.preferences.sms_broadcast', 'Instant SMS Broadcast')}</p>
                <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">{t('caregiver.preferences.sms_desc', 'Receive SMS for critical patient alerts.')}</p>
              </div>
              <button onClick={() => { setSmsBroadcast(!smsBroadcast); markChanged(); }} className={`p-1 flex items-center shrink-0 ${smsBroadcast ? 'text-rose-500' : 'text-rose-300 dark:text-rose-800'}`}>
                {smsBroadcast ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 flex items-center justify-between">
              <div>
                <p className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {t('caregiver.preferences.whatsapp_alerts', 'WhatsApp Emergency Alerts')}</p>
                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">{t('caregiver.preferences.whatsapp_desc', 'Receive emergency notifications through WhatsApp.')}</p>
              </div>
              <button onClick={() => { setWhatsappAlerts(!whatsappAlerts); markChanged(); }} className={`p-1 flex items-center shrink-0 ${whatsappAlerts ? 'text-emerald-500' : 'text-emerald-300 dark:text-emerald-800'}`}>
                {whatsappAlerts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 flex items-center justify-between">
              <div>
                <p className="font-black text-amber-700 dark:text-amber-400 flex items-center gap-2"><Phone className="w-4 h-4" /> {t('caregiver.preferences.voice_call', 'Automated Emergency Voice Call')}</p>
                <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">{t('caregiver.preferences.voice_desc', 'Receive an automated call for critical emergency events.')}</p>
              </div>
              <button onClick={() => { setVoiceCall(!voiceCall); markChanged(); }} className={`p-1 flex items-center shrink-0 ${voiceCall ? 'text-amber-500' : 'text-amber-300 dark:text-amber-800'}`}>
                {voiceCall ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <p className="text-[10px] font-bold text-slate-500 mt-2 px-2 text-center">
              {t('caregiver.preferences.emergency_note', 'Note: Emergency alerts may be delivered even during quiet hours.')}
            </p>
          </section>

          {/* NOTIFICATION CHANNELS */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> {t('caregiver.preferences.preferred_channels', 'Preferred Notification Channels')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { state: channelInApp, set: setChannelInApp, label: t('caregiver.preferences.in_app', 'In-App Notifications') },
                { state: channelPush, set: setChannelPush, label: t('caregiver.preferences.push', 'Push Notifications') },
                { state: channelEmail, set: setChannelEmail, label: t('caregiver.preferences.email', 'Email') },
                { state: channelSms, set: setChannelSms, label: t('caregiver.preferences.sms', 'SMS') },
                { state: channelWhatsapp, set: setChannelWhatsapp, label: t('caregiver.preferences.whatsapp', 'WhatsApp') }
              ].map((channel, i) => (
                <label key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                  channel.state 
                    ? 'bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-400' 
                    : 'bg-white border-slate-200 text-slate-600 dark:bg-[#0b1120] dark:border-slate-800 dark:text-slate-400 hover:border-teal-300'
                }`}>
                  <input type="checkbox" checked={channel.state} onChange={(e) => { channel.set(e.target.checked); markChanged(); }} className="hidden" />
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${channel.state ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {channel.state && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  {channel.label}
                </label>
              ))}
            </div>
          </section>

          {/* QUIET HOURS */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Moon className="w-4 h-4" /> {t('caregiver.preferences.quiet_hours', 'Quiet Hours')}
            </h3>
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t('caregiver.preferences.enable_quiet', 'Enable Quiet Hours')}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{t('caregiver.preferences.quiet_desc', 'Reduce non-critical notifications during your quiet hours.')}</p>
                </div>
                <button onClick={() => { setQuietHoursEnabled(!quietHoursEnabled); markChanged(); }} className={`p-1 flex items-center shrink-0 ${quietHoursEnabled ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-600'}`}>
                  {quietHoursEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              {quietHoursEnabled && (
                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('caregiver.preferences.from', 'From')}</label>
                    <input type="time" defaultValue="22:00" onChange={markChanged} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">{t('caregiver.preferences.to', 'To')}</label>
                    <input type="time" defaultValue="06:00" onChange={markChanged} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white" />
                  </div>
                </div>
              )}
              <p className="text-[10px] font-bold text-indigo-500/80 dark:text-indigo-400/80 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-lg inline-block w-full text-center">
                {t('caregiver.preferences.quiet_note', 'Emergency alerts will continue during quiet hours.')}
              </p>
            </div>
          </section>

          {/* TASK & APP PREFERENCES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* TASK PREFERENCES */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {t('caregiver.preferences.task_prefs', 'Task Preferences')}
              </h3>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.preferences.default_view', 'Default Task View')}</label>
                  <select value={defaultTaskView} onChange={(e) => { setDefaultTaskView(e.target.value); markChanged(); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:outline-none">
                    <option value="Timeline">{t('caregiver.preferences.view_timeline', 'Timeline')}</option>
                    <option value="List">{t('caregiver.preferences.view_list', 'List')}</option>
                    <option value="Calendar">{t('caregiver.preferences.view_calendar', 'Calendar')}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.preferences.default_filter', 'Default Task Filter')}</label>
                  <select value={defaultTaskFilter} onChange={(e) => { setDefaultTaskFilter(e.target.value); markChanged(); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:outline-none">
                    <option value="All Tasks">{t('caregiver.preferences.all_tasks', 'All Tasks')}</option>
                    <option value="Pending">{t('caregiver.preferences.pending_tasks', 'Pending')}</option>
                    <option value="High Priority">{t('caregiver.preferences.high_priority_tasks', 'High Priority')}</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.preferences.task_rem_label', 'Task Reminder')}</label>
                  <select value={taskReminder} onChange={(e) => { setTaskReminder(e.target.value); markChanged(); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:outline-none">
                    <option value="5 minutes">5 {t('caregiver.preferences.minutes', 'minutes')}</option>
                    <option value="15 minutes">15 {t('caregiver.preferences.minutes', 'minutes')}</option>
                    <option value="30 minutes">30 {t('caregiver.preferences.minutes', 'minutes')}</option>
                    <option value="1 hour">1 {t('caregiver.preferences.hour', 'hour')}</option>
                  </select>
                </div>
              </div>
            </section>

            {/* APP PREFERENCES */}
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Globe className="w-4 h-4" /> {t('caregiver.preferences.app_prefs', 'App Preferences')}
              </h3>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.preferences.lang_label', 'Language')}</label>
                  <select 
                    value={currentLang === 'ta' ? 'Tamil' : 'English'} 
                    onChange={(e) => { 
                      const val = e.target.value; 
                      setLanguage(val); 
                      setGlobalLanguage(val); 
                      markChanged(); 
                    }} 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.preferences.time_format', 'Time Format')}</label>
                  <select value={timeFormat} onChange={(e) => { setTimeFormat(e.target.value); markChanged(); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:outline-none">
                    <option>12 Hour</option>
                    <option>24 Hour</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.preferences.date_format', 'Date Format')}</label>
                  <select value={dateFormat} onChange={(e) => { setDateFormat(e.target.value); markChanged(); }} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:outline-none">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">{t('caregiver.preferences.time_zone', 'Time Zone')}</label>
                  <select defaultValue="Asia/Kolkata" onChange={markChanged} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:outline-none">
                    <option>Asia/Kolkata</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

        </div>

      </div>

      {/* UNSAVED CHANGES STICKY BAR */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-[#0b1120] shadow-2xl border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 flex items-center justify-between gap-8 min-w-[320px] sm:min-w-[480px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{t('caregiver.preferences.unsaved_changes', 'Unsaved Changes')}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{t('caregiver.preferences.unsaved_desc', 'You have modified your preferences.')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setHasChanges(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                {t('caregiver.preferences.discard_changes', 'Discard Changes')}
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> {t('caregiver.preferences.save_btn', 'Save Preferences')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
