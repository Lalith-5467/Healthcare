import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Settings2, ShieldCheck, CreditCard, Users, 
  Bell, Unplug, Shield, FileText, CheckCircle2, Search,
  Upload, Save, RotateCcw, AlertTriangle, ArrowRight,
  MonitorSmartphone, Smartphone, Mail, Globe, Lock
} from 'lucide-react';

type SettingsSection = 
  | 'profile' | 'claim-config' | 'pre-auth' | 'network' 
  | 'settlement' | 'users' | 'notifications' | 'integrations' 
  | 'security' | 'audit';

export const InsuranceSettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      handleSettingChange();
    }
  };

  const handleSettingChange = () => {
    setHasUnsavedChanges(true);
    setSavedSuccess(false);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setHasUnsavedChanges(false);
  };

  // Reusable Toggle Component
  const Toggle = ({ checked = true }: { checked?: boolean }) => (
    <div 
      onClick={handleSettingChange}
      className={`w-10 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4.5' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="space-y-6 pb-28 font-sans select-none max-w-7xl mx-auto">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[2rem] bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">TPA Desk Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Configure TPA operations, claim workflows, network access, settlements, notifications, and security.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All settings are up to date
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Changes
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* 2. DUAL PANE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 sticky top-24 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search settings..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-900 dark:text-white transition-all shadow-sm"
            />
          </div>

          <nav className="space-y-1">
            <div className="pt-2 pb-1 px-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Organization</span>
            </div>
            <NavItem id="profile" icon={Building2} label="TPA Profile" current={activeSection} onClick={setActiveSection} />
            
            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Operations</span>
            </div>
            <NavItem id="claim-config" icon={Settings2} label="Claim Configuration" current={activeSection} onClick={setActiveSection} />
            <NavItem id="pre-auth" icon={ShieldCheck} label="Pre-Authorization" current={activeSection} onClick={setActiveSection} />
            <NavItem id="network" icon={Building2} label="Network Hospitals" current={activeSection} onClick={setActiveSection} />
            <NavItem id="settlement" icon={CreditCard} label="Settlement & Payouts" current={activeSection} onClick={setActiveSection} />

            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Access</span>
            </div>
            <NavItem id="users" icon={Users} label="Users & Roles" current={activeSection} onClick={setActiveSection} />

            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Communication</span>
            </div>
            <NavItem id="notifications" icon={Bell} label="Notifications" current={activeSection} onClick={setActiveSection} />

            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Integrations</span>
            </div>
            <NavItem id="integrations" icon={Unplug} label="API & Services" current={activeSection} onClick={setActiveSection} />

            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Security</span>
            </div>
            <NavItem id="security" icon={Shield} label="Security Settings" current={activeSection} onClick={setActiveSection} />
            <NavItem id="audit" icon={FileText} label="Audit Logs" current={activeSection} onClick={setActiveSection} />
          </nav>
        </div>

        {/* RIGHT MAIN CONTENT PANEL */}
        <div className="lg:col-span-9 bg-white dark:bg-[#0b1120] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm min-h-[600px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeSection === 'profile' && (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">TPA Organization</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Update your official Third Party Administrator details.</p>
                  </div>

                  <div className="flex items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-2 overflow-hidden relative">
                      {logoPreview ? (
                        <img src={logoPreview} alt="TPA Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">Upload TPA Logo</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleLogoChange} 
                        className="hidden" 
                        accept="image/png, image/jpeg" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" /> Change Logo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="TPA Organization Name" value="Star Health & Apollo Cashless Hub" onChange={handleSettingChange} />
                    <InputGroup label="TPA ID" value="TPA-019" onChange={handleSettingChange} />
                    <InputGroup label="Registration Number" value="IRDAI-HLT-9921" onChange={handleSettingChange} />
                    <InputGroup label="Contact Person" value="Dr. Ramesh Kumar" onChange={handleSettingChange} />
                    <InputGroup label="Official Email" value="admin@starhealth-tpa.com" onChange={handleSettingChange} type="email" />
                    <InputGroup label="Support Phone" value="+91 1800-425-2255" onChange={handleSettingChange} />
                    <div className="md:col-span-2">
                      <InputGroup label="Office Address" value="No. 1, Star Health Towers, Anna Salai, Chennai - 600002" onChange={handleSettingChange} />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'claim-config' && (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Settings2 className="w-5 h-5 text-blue-500" /> Claim Processing Configuration
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Configure rules and workflows for claim adjudication.</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-4">Claim Workflow Engine</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800/50">Submitted</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">Document Verification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">Medical Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">Approval</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">Settlement</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SettingRow label="Automatic Claim Assignment" desc="Auto-route incoming claims based on SLA and availability." Toggle={<Toggle checked />} />
                    <SettingRow label="Claim Review Required" desc="Enforce manual desk review for all standard claims." Toggle={<Toggle checked />} />
                    <SettingRow label="Medical Review Required" desc="Flag complex inpatient claims to Medical Adjudicators." Toggle={<Toggle checked />} />
                    <SettingRow label="Auto Escalation" desc="Escalate claims nearing SLA breaches to senior officers." Toggle={<Toggle checked />} />
                    
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Claim SLA Target</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Maximum permitted time for adjudication.</p>
                      </div>
                      <select onChange={handleSettingChange} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
                        <option>24 Hours</option>
                        <option>48 Hours</option>
                        <option>72 Hours</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Max Claim Amount for Auto Approval</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Threshold for AI-based fast-track approvals.</p>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                        <input type="text" defaultValue="50000" onChange={handleSettingChange} className="w-32 pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'pre-auth' && (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-500" /> Cashless Pre-Authorization
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Manage rules for hospital cashless requests.</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-4">Approval Workflow</p>
                    <div className="flex flex-col gap-2">
                      <WorkflowStep label="Hospital Request" />
                      <WorkflowStep label="Eligibility Check" />
                      <WorkflowStep label="Document Verification" />
                      <WorkflowStep label="Medical Review" />
                      <WorkflowStep label="Approve / Reject" active />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SettingRow label="Enable Cashless Pre-Authorization" desc="Allow network hospitals to submit cashless requests." Toggle={<Toggle checked />} />
                    <SettingRow label="Auto Eligibility Check" desc="Run ABDM background checks on incoming requests." Toggle={<Toggle checked />} />
                    <SettingRow label="Hospital Verification Required" desc="Validate hospital network status before processing." Toggle={<Toggle checked />} />
                    <SettingRow label="Medical Reviewer Approval" desc="Require a certified physician to approve complex procedures." Toggle={<Toggle checked />} />
                    <SettingRow label="Emergency Case Priority" desc="Route emergency tags to the top of the queue immediately." Toggle={<Toggle checked />} />
                    
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Pre-Auth SLA</p>
                      </div>
                      <select onChange={handleSettingChange} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
                        <option>2 Hours</option>
                        <option selected>4 Hours</option>
                        <option>8 Hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'network' && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-500" /> Network Hospital Configuration
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Manage how hospitals interact with your TPA network.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer">Manage Hospitals</button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 cursor-pointer">Add Hospital</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SettingRow label="Hospital Onboarding Approval" desc="Require manual verification before a hospital joins network." Toggle={<Toggle checked />} />
                    <SettingRow label="Cashless Availability Default" desc="Set newly onboarded hospitals to cashless enabled by default." Toggle={<Toggle checked={false} />} />
                    <SettingRow label="Hospital Document Verification" desc="Enforce digital signature checks on submitted medical records." Toggle={<Toggle checked />} />
                    <SettingRow label="Contract Expiry Alerts" desc="Notify TPA admins 30 days before a hospital contract expires." Toggle={<Toggle checked />} />
                  </div>
                </div>
              )}

              {activeSection === 'settlement' && (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500" /> Settlement Configuration
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Manage payouts and financial rules.</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-4">Settlement Workflow</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">Approved Claim</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">Financial Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">Settlement Approval</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">Payment Processing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">Payment Completed</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <SettingRow label="Settlement Approval Required" desc="Require final sign-off from TPA Admin." Toggle={<Toggle checked />} />
                    <SettingRow label="Finance Review Required" desc="Mandatory ledger check by Finance Officer." Toggle={<Toggle checked />} />
                    <SettingRow label="Auto Settlement" desc="Automatically disburse funds for approved claims under threshold." Toggle={<Toggle checked={false} />} />
                    
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Settlement SLA</p>
                      </div>
                      <select onChange={handleSettingChange} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
                        <option>1 Business Day</option>
                        <option selected>3 Business Days</option>
                        <option>7 Business Days</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Default Payment Method</p>
                      </div>
                      <select onChange={handleSettingChange} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
                        <option>Bank Transfer</option>
                        <option selected>NEFT</option>
                        <option>RTGS</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'users' && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Users & Roles
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Manage TPA staff and their access permissions.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer">Manage Roles</button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 cursor-pointer">Add User</button>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-5 py-4">Role</th>
                          <th className="px-5 py-4">Permissions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                        <RoleRow name="TPA Admin" perms={['View', 'Create', 'Edit', 'Approve', 'Export']} />
                        <RoleRow name="Claims Officer" perms={['View', 'Create', 'Edit']} />
                        <RoleRow name="Medical Reviewer" perms={['View', 'Approve']} />
                        <RoleRow name="Finance Officer" perms={['View', 'Approve', 'Export']} />
                        <RoleRow name="Insurance Agent" perms={['View', 'Create']} />
                        <RoleRow name="Support Staff" perms={['View']} />
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-500" /> Notifications & Alerts
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Configure automatic system alerts for staff and partners.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-5 py-4">Event Trigger</th>
                          <th className="px-5 py-4 text-center">In-App</th>
                          <th className="px-5 py-4 text-center">Email</th>
                          <th className="px-5 py-4 text-center">SMS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-medium">
                        <NotificationRow name="Claim Submitted" />
                        <NotificationRow name="Claim Approved" />
                        <NotificationRow name="Claim Rejected" />
                        <NotificationRow name="Cashless Pre-Auth Approved" />
                        <NotificationRow name="Cashless Pre-Auth Rejected" />
                        <NotificationRow name="Settlement Completed" />
                        <NotificationRow name="Payment Failed" />
                        <NotificationRow name="Hospital Network Status Changed" />
                        <NotificationRow name="SLA Breach Alert" />
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSection === 'integrations' && (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" /> API & Services
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Manage third-party integrations and API gateways.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IntegrationCard name="Insurance API" icon={ShieldCheck} status="Connected" time="2 minutes ago" />
                    <IntegrationCard name="Hospital Network API" icon={Building2} status="Connected" time="5 minutes ago" />
                    <IntegrationCard name="Payment Gateway" icon={CreditCard} status="Connected" time="1 hour ago" />
                    <IntegrationCard name="Notification Service" icon={Mail} status="Connected" time="12 minutes ago" />
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-500" /> Security Settings
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Manage authentication, access policies, and monitoring.</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Security Status: Protected
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Authentication</h3>
                      <div className="space-y-2">
                        <SettingRow label="Two-Factor Authentication (2FA)" desc="Require OTP code for all admin logins." Toggle={<Toggle checked />} />
                        <SettingRow label="Strong Password Policy" desc="Enforce minimum 12 chars, symbols, and rotation." Toggle={<Toggle checked />} />
                        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Session Timeout</p>
                          </div>
                          <select onChange={handleSettingChange} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer">
                            <option>15 Minutes</option>
                            <option selected>30 Minutes</option>
                            <option>1 Hour</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Security Monitoring</h3>
                      <div className="space-y-2">
                        <SettingRow label="Login Activity Tracking" desc="Monitor location and device for all logins." Toggle={<Toggle checked />} />
                        <SettingRow label="Failed Login Alerts" desc="Notify admins after 5 consecutive failed attempts." Toggle={<Toggle checked />} />
                        <SettingRow label="Suspicious Activity Alerts" desc="AI detection for anomalous data exports." Toggle={<Toggle checked />} />
                        <SettingRow label="Audit Logging" desc="Immutable record of all system configuration changes." Toggle={<Toggle checked />} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'audit' && (
                <div className="p-8 space-y-8">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" /> Audit Logs
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Immutable system activity records.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-5 py-4">Date & Time</th>
                          <th className="px-5 py-4">User</th>
                          <th className="px-5 py-4">Action</th>
                          <th className="px-5 py-4">Module</th>
                          <th className="px-5 py-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-medium">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="px-5 py-4 text-slate-500">02 Sep 2026, 12:42</td>
                          <td className="px-5 py-4 text-slate-900 dark:text-white font-bold">Admin</td>
                          <td className="px-5 py-4 text-slate-700 dark:text-slate-300">Updated Claim SLA</td>
                          <td className="px-5 py-4"><span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-black uppercase">Claims</span></td>
                          <td className="px-5 py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">Success</td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="px-5 py-4 text-slate-500">02 Sep 2026, 11:30</td>
                          <td className="px-5 py-4 text-slate-900 dark:text-white font-bold">Finance</td>
                          <td className="px-5 py-4 text-slate-700 dark:text-slate-300">Changed Settlement Rule</td>
                          <td className="px-5 py-4"><span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-black uppercase">Settlement</span></td>
                          <td className="px-5 py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">Success</td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="px-5 py-4 text-slate-500">01 Sep 2026, 16:25</td>
                          <td className="px-5 py-4 text-slate-900 dark:text-white font-bold">TPA Admin</td>
                          <td className="px-5 py-4 text-slate-700 dark:text-slate-300">Added Hospital</td>
                          <td className="px-5 py-4"><span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-black uppercase">Network</span></td>
                          <td className="px-5 py-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">Success</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer">
                    View Full Audit Log →
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-[#070c18] border border-slate-700 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-bold text-white">You have unsaved changes</p>
                <p className="text-[10px] text-slate-400 font-medium">Please save or discard to continue.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
              <button onClick={handleReset} className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer">Discard Changes</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95">Save Changes</button>
            </div>
          </motion.div>
        )}

        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white"
          >
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-black">Settings saved successfully</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Sub-components for clean structure

const NavItem = ({ id, icon: Icon, label, current, onClick }: any) => {
  const isActive = current === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
        isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-cyan-400 font-bold shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white font-medium'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-cyan-400' : ''}`} />
      {label}
    </button>
  );
};

const InputGroup = ({ label, value, onChange, type = 'text' }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
    <input 
      type={type} 
      defaultValue={value} 
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#070c18] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
    />
  </div>
);

const SettingRow = ({ label, desc, Toggle }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
    <div>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
    </div>
    {Toggle}
  </div>
);

const WorkflowStep = ({ label, active }: any) => (
  <div className="flex flex-col items-center justify-center">
    <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-cyan-400 border-blue-200 dark:border-blue-800/50' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
      {label}
    </div>
    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 my-1"></div>
  </div>
);

const RoleRow = ({ name, perms }: any) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{name}</td>
    <td className="px-5 py-4 flex flex-wrap gap-1.5">
      {perms.map((p: string, i: number) => (
        <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500 rounded">
          {p}
        </span>
      ))}
    </td>
  </tr>
);

const NotificationRow = ({ name }: any) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{name}</td>
    <td className="px-5 py-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-blue-600" /></td>
    <td className="px-5 py-3 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-blue-600" /></td>
    <td className="px-5 py-3 text-center"><input type="checkbox" className="w-4 h-4 cursor-pointer accent-blue-600" /></td>
  </tr>
);

const IntegrationCard = ({ name, icon: Icon, status, time }: any) => (
  <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-4 hover:border-blue-500/30 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#070c18] border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{status}</span>
        </div>
      </div>
    </div>
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <span className="text-[10px] text-slate-500 font-medium">Last synced: {time}</span>
      <div className="flex gap-2">
        <button className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">Test</button>
        <button className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer">Configure</button>
      </div>
    </div>
  </div>
);
