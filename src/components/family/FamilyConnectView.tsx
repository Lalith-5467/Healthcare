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
  const [sharedAppointments] = useState<SharedAppointment[]>(INITIAL_SHARED_APPOINTMENTS);
  const [sharedReminders] = useState<SharedReminder[]>(INITIAL_SHARED_REMINDERS);
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
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Family Members</span>
            <Users className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-teal-400">{members.length}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">Connected</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{pendingRequests.length}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">Awaiting</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Shared Appointments</span>
            <CalendarIcon className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-cyan-400">{sharedAppointments.length}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">Upcoming</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Shared Reminders</span>
            <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-300">{sharedReminders.length}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">Active</span>
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

          {/* FAMILY PROFILE SWITCHER DROPDOWN */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Viewing:</span>
            <select
              value={activeProfileView}
              onChange={(e) => {
                setActiveProfileView(e.target.value);
                showToast(`Viewing ${e.target.value} health profile parameters`);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-extrabold text-xs focus:outline-none focus:border-[#00a896] cursor-pointer"
            >
              <option value="My Profile">My Profile</option>
              {members.map((m) => (
                <option key={m.id} value={m.name}>{m.name} ({m.relationship})</option>
              ))}
            </select>
          </div>
        </div>

        {/* FAMILY MEMBER CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((mem) => (
            <div key={mem.id} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-md group hover:border-[#00a896]/40 transition-all">
              <div className="flex items-center gap-3">
                <img
                  src={mem.avatarUrl}
                  alt={mem.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/40 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{mem.name}</h4>
                  <span className="text-[10px] font-extrabold text-[#00a896] dark:text-teal-400 font-mono">{mem.relationship}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-3">
                <div className="flex justify-between"><span>Shared Items:</span><strong className="text-[#00a896] dark:text-cyan-300 font-mono">{mem.sharedItemsCount} items</strong></div>
                <div className="flex justify-between"><span>Last Activity:</span><span className="text-slate-800 dark:text-slate-300 font-semibold">{mem.lastActivity}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setProfileDrawerTarget(mem)}
                  className="py-2 px-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setChatDrawerTarget(mem)}
                  className="py-2 px-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          ))}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SHARED APPOINTMENTS (LEFT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Shared Appointments</h3>
            </div>
            <button
              onClick={() => setShareAptModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 text-xs font-extrabold border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Appointment</span>
            </button>
          </div>

          <div className="space-y-3">
            {sharedAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{apt.doctorName}</h4>
                    <p className="text-[11px] text-[#00a896] dark:text-teal-400 font-extrabold">{apt.speciality} • {apt.type}</p>
                  </div>
                  <span className="font-mono text-[#00a896] dark:text-cyan-300 font-extrabold">{apt.date} at {apt.time}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Shared with: <strong className="text-slate-900 dark:text-white">{apt.sharedWith.join(', ')}</strong></span>
                  <button
                    onClick={() => onNavigate('appointments')}
                    className="text-[#00a896] dark:text-cyan-400 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Appointment</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHARED REMINDERS (RIGHT 6 COLS) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Shared Reminders</h3>
            </div>
            <button
              onClick={() => setShareRemModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 text-xs font-extrabold border border-slate-300 dark:border-slate-700 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Reminder</span>
            </button>
          </div>

          <div className="space-y-3">
            {sharedReminders.map((rem) => (
              <div key={rem.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{rem.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{rem.dosage}</p>
                  </div>
                  <span className="font-mono text-purple-700 dark:text-purple-300 font-extrabold">{rem.time}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Shared with: <strong className="text-slate-900 dark:text-white">{rem.sharedWith.join(', ')}</strong></span>
                  <button
                    onClick={() => onNavigate('reminders')}
                    className="text-purple-700 dark:text-purple-400 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Reminder</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. EMERGENCY CONTACTS CARD */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Emergency Contacts</h3>
          </div>
          <button
            onClick={() => setAddEmergencyModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Emergency Contact</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{contact.name}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{contact.relationship} • <span className="font-mono font-bold text-[#00a896]">{contact.phone}</span></p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="p-2 rounded-xl bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
                title="Call Immediately"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
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
