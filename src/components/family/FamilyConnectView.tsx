import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Users,
  UserPlus,
  Shield,
  MessageSquare,
  Calendar as CalendarIcon,
  Pill,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Trash2,
  PhoneCall,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import type {
  FamilyMember,
  PendingRequest,
  SharedAppointment,
  SharedReminder,
  FamilyActivityItem,
  EmergencyContact,
  SharingPermissionState
} from './familyData';
import {
  INITIAL_FAMILY_MEMBERS,
  INITIAL_PENDING_REQUESTS,
  INITIAL_SHARED_APPOINTMENTS,
  INITIAL_SHARED_REMINDERS,
  INITIAL_FAMILY_ACTIVITIES,
  INITIAL_EMERGENCY_CONTACTS,
  DEFAULT_SHARING_PERMISSIONS
} from './familyData';
import { AddFamilyMemberModal } from './AddFamilyMemberModal';
import { FamilyProfileDrawer } from './FamilyProfileDrawer';
import { ManagePermissionsModal } from './ManagePermissionsModal';
import { FamilyChatDrawer } from './FamilyChatDrawer';
import { ShareAppointmentModal } from './ShareAppointmentModal';
import { ShareReminderModal } from './ShareReminderModal';
import { AddEmergencyContactModal } from './AddEmergencyContactModal';
import { FamilyFilterDrawer } from './FamilyFilterDrawer';
import type { FamilyFilterState } from './FamilyFilterDrawer';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface FamilyConnectViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const FamilyConnectView: React.FC<FamilyConnectViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // MAIN STATE & LOCALSTORAGE
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(INITIAL_PENDING_REQUESTS);
  const [sharedAppointments, setSharedAppointments] = useState<SharedAppointment[]>(INITIAL_SHARED_APPOINTMENTS);
  const [sharedReminders, setSharedReminders] = useState<SharedReminder[]>(INITIAL_SHARED_REMINDERS);
  const [activities] = useState<FamilyActivityItem[]>(INITIAL_FAMILY_ACTIVITIES);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [permissions, setPermissions] = useState<SharingPermissionState[]>(DEFAULT_SHARING_PERMISSIONS);
  const [removedMembers, setRemovedMembers] = useState<FamilyMember[]>([]);

  // PROFILE SWITCHER
  const [activeProfileView, setActiveProfileView] = useState<string>('My Profile');

  // SEARCH & FILTERS
  const [_searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FamilyFilterState>({
    memberFilter: 'All',
    activityType: 'All',
    dateRange: 'This Month'
  });

  // MODAL & DRAWER TARGETS
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [profileDrawerTarget, setProfileDrawerTarget] = useState<FamilyMember | null>(null);
  const [chatDrawerTarget, setChatDrawerTarget] = useState<FamilyMember | null>(null);
  const [permissionsModalTarget, setPermissionsModalTarget] = useState<FamilyMember | null>(null);
  const [shareAptModalOpen, setShareAptModalOpen] = useState(false);
  const [shareRemModalOpen, setShareRemModalOpen] = useState(false);
  const [addEmergencyModalOpen, setAddEmergencyModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('user_family_members');
    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers));
      } catch (e) {
        console.error(e);
      }
    }
    const savedEmergency = localStorage.getItem('user_emergency_contacts');
    if (savedEmergency) {
      try {
        setEmergencyContacts(JSON.parse(savedEmergency));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveMembersState = (newMembers: FamilyMember[]) => {
    setMembers(newMembers);
    localStorage.setItem('user_family_members', JSON.stringify(newMembers));
  };

  const saveEmergencyState = (newEmergency: EmergencyContact[]) => {
    setEmergencyContacts(newEmergency);
    localStorage.setItem('user_emergency_contacts', JSON.stringify(newEmergency));
  };

  // HANDLERS
  const handleSendInvitation = (newReq: PendingRequest) => {
    setPendingRequests([newReq, ...pendingRequests]);
    showToast(`✓ Mock invitation sent to ${newReq.name}`);
  };

  const handleAcceptRequest = (reqId: string, reqName: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== reqId));
    const newMember: FamilyMember = {
      id: `MEM-${Date.now().toString().slice(-4)}`,
      name: reqName,
      relationship: 'Mother',
      status: 'Connected',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
      connectedSince: 'Today',
      sharedItemsCount: 2,
      lastActivity: 'Just now'
    };
    saveMembersState([...members, newMember]);
    showToast(`✓ ${reqName} connected to family care vault`);
  };

  const handleDeclineRequest = (reqId: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== reqId));
    showToast('Invitation declined');
  };

  const handleRemoveConnection = (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    if (target) {
      const updatedMembers = members.filter((m) => m.id !== memberId);
      saveMembersState(updatedMembers);
      setRemovedMembers([{ ...target, status: 'Removed' }, ...removedMembers]);
      showToast(`Removed connection with ${target.name}`);
    }
  };

  const handleReconnect = (memberId: string) => {
    const target = removedMembers.find((m) => m.id === memberId);
    if (target) {
      setRemovedMembers(removedMembers.filter((m) => m.id !== memberId));
      saveMembersState([...members, { ...target, status: 'Connected' }]);
      showToast(`✓ Reconnected with ${target.name}`);
    }
  };

  const handleSavePermissions = (updated: SharingPermissionState) => {
    const existingIndex = permissions.findIndex((p) => p.memberId === updated.memberId);
    if (existingIndex >= 0) {
      const copy = [...permissions];
      copy[existingIndex] = updated;
      setPermissions(copy);
    } else {
      setPermissions([...permissions, updated]);
    }
    showToast('✓ Sharing permissions updated');
  };

  const handleAddEmergencyContact = (newContact: EmergencyContact) => {
    const updated = [newContact, ...emergencyContacts];
    saveEmergencyState(updated);
    showToast('✓ Emergency contact saved');
  };

  const handleDeleteEmergencyContact = (id: string) => {
    const updated = emergencyContacts.filter((c) => c.id !== id);
    saveEmergencyState(updated);
    showToast('✓ Emergency contact removed');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16 font-sans">
      {/* TOAST FEEDBACK */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Family Connect & Care Circle"
        subtitle="Manage family care connections, shared records, and emergency permissions."
        badgeText="Family Vault"
        badgeIcon={<Users className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Filter className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              <span>Filters</span>
            </button>

            <button
              onClick={() => setAddMemberModalOpen(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Family Member</span>
            </button>
          </div>
        }
      />

      {/* 2. FAMILY OVERVIEW SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-teal-50/60 dark:bg-teal-900/10 border border-teal-200/60 dark:border-teal-800/50 p-5 rounded-3xl space-y-3 shadow-lg shadow-teal-200/20 dark:shadow-none hover:-translate-y-1 transition-transform group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -z-10 group-hover:bg-teal-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-teal-700 dark:text-teal-400">Family Members</span>
            <div className="p-2 bg-teal-100/50 dark:bg-teal-900/30 rounded-xl">
              <Users className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-teal-400">{members.length}</span>
            <span className="text-[10px] text-teal-600/80 dark:text-teal-400/80 font-bold font-sans">Connected</span>
          </div>
        </div>

        <div className="bg-red-50/40 dark:bg-red-900/10 border border-red-200/60 dark:border-red-800/50 p-5 rounded-3xl space-y-3 shadow-lg shadow-red-200/20 dark:shadow-none hover:-translate-y-1 transition-transform group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -z-10 group-hover:bg-red-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-red-700 dark:text-red-400">Pending Requests</span>
            <div className="p-2 bg-red-100/50 dark:bg-red-900/30 rounded-xl">
              <Clock className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">{pendingRequests.length}</span>
            <span className="text-[10px] text-red-600/80 dark:text-red-400/80 font-bold font-sans">Awaiting</span>
          </div>
        </div>

        <div className="bg-blue-100/70 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/50 p-5 rounded-3xl space-y-3 shadow-lg shadow-blue-200/20 dark:shadow-none hover:-translate-y-1 transition-transform group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10 group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">Shared Appointments</span>
            <div className="p-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-xl">
              <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{sharedAppointments.length}</span>
            <span className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-bold font-sans">Upcoming</span>
          </div>
        </div>

        <div className="bg-purple-100/70 dark:bg-purple-900/30 border border-purple-200/60 dark:border-purple-800/50 p-5 rounded-3xl space-y-3 shadow-lg shadow-purple-200/20 dark:shadow-none hover:-translate-y-1 transition-transform group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -z-10 group-hover:bg-purple-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400">Shared Reminders</span>
            <div className="p-2 bg-purple-100/50 dark:bg-purple-900/30 rounded-xl">
              <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-300">{sharedReminders.length}</span>
            <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-bold font-sans">Active</span>
          </div>
        </div>
      </div>

      {/* 3. MY FAMILY MEMBERS SECTION */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">My Family</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Manage your connected family members</p>
          </div>


        </div>

        {/* FAMILY MEMBER CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((mem) => {
            const getRoleColor = (role: string) => {
              if (role.toLowerCase().includes('father')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 ring-blue-500/30';
              if (role.toLowerCase().includes('mother')) return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 ring-pink-500/30';
              if (role.toLowerCase().includes('child') || role.toLowerCase().includes('son') || role.toLowerCase().includes('daughter')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 ring-amber-500/30';
              return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 ring-teal-500/30';
            };

            return (
            <div key={mem.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,168,150,0.15)] group hover:border-[#00a896]/30 transition-all duration-300 relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={mem.avatarUrl}
                    alt={mem.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-800 group-hover:border-teal-500/40 transition-colors shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{mem.name}</h4>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 mt-0.5 inline-block rounded-full ring-1 uppercase tracking-wider ${getRoleColor(mem.relationship)}`}>
                    {mem.relationship}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <div className="flex justify-between items-center"><span>Shared Items:</span><span className="font-mono bg-[#00a896]/10 text-[#00897b] dark:text-cyan-400 px-1.5 py-0.5 rounded font-bold">{mem.sharedItemsCount} items</span></div>
                <div className="flex justify-between items-center"><span>Last Activity:</span><span className="text-slate-800 dark:text-slate-300 font-semibold">{mem.lastActivity}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setProfileDrawerTarget(mem)}
                  className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setChatDrawerTarget(mem)}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#00a896] to-cyan-500 hover:from-[#00897b] hover:to-cyan-600 text-slate-900 dark:text-white text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* 4. PENDING CONNECTIONS & INVITATION STREAM */}
      {pendingRequests.length > 0 && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Pending Connections</h3>
            <span className="text-[10px] font-mono font-extrabold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {pendingRequests.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">{req.name} ({req.relationship})</h4>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{req.contact} • Sent {req.timeAgo}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(req.id, req.name)}
                    className="px-4 py-1.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold cursor-pointer shadow-sm"
                  >
                    Accept & Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SHARED APPOINTMENTS & SHARED REMINDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SHARED APPOINTMENTS (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-teal-100/50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#00a896]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Shared Appointments</h3>
            </div>
            <button
              onClick={() => setShareAptModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 hover:from-teal-100 hover:to-cyan-100 dark:hover:from-teal-900/40 dark:hover:to-cyan-900/40 text-[#00897b] dark:text-cyan-300 text-xs font-extrabold border border-teal-200/50 dark:border-teal-800/50 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Appointment</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {sharedAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-teal-100 dark:border-teal-800/50 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight">{apt.doctorName}</h4>
                    <p className="text-[11px] text-[#00a896] dark:text-teal-400 font-extrabold mt-0.5">{apt.speciality} • {apt.type}</p>
                  </div>
                  <span className="font-mono text-[#00897b] dark:text-cyan-300 font-bold bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-lg text-[10px] text-right shrink-0">{apt.date}<br/>{apt.time}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Shared with: <strong className="text-slate-900 dark:text-white line-clamp-1">{apt.sharedWith.join(', ')}</strong></span>
                  <button
                    onClick={() => onNavigate('appointments')}
                    className="text-[#00a896] dark:text-cyan-400 hover:text-teal-700 dark:hover:text-cyan-300 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHARED REMINDERS (RIGHT 6 COLS) */}
        <div className="lg:col-span-6 bg-purple-100/50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Shared Reminders</h3>
            </div>
            <button
              onClick={() => setShareRemModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 hover:from-purple-100 hover:to-fuchsia-100 dark:hover:from-purple-900/40 dark:hover:to-fuchsia-900/40 text-purple-700 dark:text-purple-300 text-xs font-extrabold border border-purple-200/50 dark:border-purple-800/50 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Reminder</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {sharedReminders.map((rem) => (
              <div key={rem.id} className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-purple-100 dark:border-purple-800/50 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight">{rem.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">{rem.dosage}</p>
                  </div>
                  <span className="font-mono text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-lg text-[10px] shrink-0">{rem.time}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Shared with: <strong className="text-slate-900 dark:text-white line-clamp-1">{rem.sharedWith.join(', ')}</strong></span>
                  <button
                    onClick={() => onNavigate('reminders')}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. EMERGENCY CONTACTS CARD */}
      <div className="bg-gradient-to-r from-rose-50/80 to-white dark:from-rose-950/20 dark:to-slate-900/80 border border-rose-200/80 dark:border-rose-900/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden group">
        <div className="absolute left-0 top-0 w-1 h-full bg-rose-400 dark:bg-rose-500 rounded-l-3xl opacity-80" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-100 dark:border-rose-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Emergency Contacts</h3>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 font-bold">Instantly accessible critical contacts</p>
            </div>
          </div>
          <button
            onClick={() => setAddEmergencyModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/50 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow group/card">
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{contact.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="uppercase tracking-wider text-[9px] font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded">{contact.relationship}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{contact.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteEmergencyContact(contact.id)}
                  className="p-3 rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${contact.phone}`}
                  className="p-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-slate-900 dark:text-white shadow-lg shadow-rose-500/30 cursor-pointer group-hover/card:animate-pulse-slow"
                  title="Call Immediately"
                >
                  <PhoneCall className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      <AddFamilyMemberModal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onSendInvite={handleSendInvitation}
      />

      <FamilyProfileDrawer
        member={profileDrawerTarget}
        isOpen={!!profileDrawerTarget}
        onClose={() => setProfileDrawerTarget(null)}
        onOpenPermissions={(mem) => setPermissionsModalTarget(mem)}
        onRemoveConnection={handleRemoveConnection}
      />

      <ManagePermissionsModal
        member={permissionsModalTarget}
        isOpen={!!permissionsModalTarget}
        onClose={() => setPermissionsModalTarget(null)}
        initialPermissions={permissions.find((p) => p.memberId === permissionsModalTarget?.id)}
        onSavePermissions={handleSavePermissions}
      />

      <FamilyChatDrawer
        member={chatDrawerTarget}
        isOpen={!!chatDrawerTarget}
        onClose={() => setChatDrawerTarget(null)}
      />

      <ShareAppointmentModal
        isOpen={shareAptModalOpen}
        onClose={() => setShareAptModalOpen(false)}
        members={members}
        onShare={(apt) => {
          setSharedAppointments([apt, ...sharedAppointments]);
          showToast('✓ Appointment shared with family');
        }}
      />

      <ShareReminderModal
        isOpen={shareRemModalOpen}
        onClose={() => setShareRemModalOpen(false)}
        members={members}
        onShare={(rem) => {
          setSharedReminders([rem, ...sharedReminders]);
          showToast('✓ Reminder shared with family');
        }}
      />

      <AddEmergencyContactModal
        isOpen={addEmergencyModalOpen}
        onClose={() => setAddEmergencyModalOpen(false)}
        onAdd={handleAddEmergencyContact}
      />

      <FamilyFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(updated) => setFilters(updated)}
      />
    </div>
  );
};
