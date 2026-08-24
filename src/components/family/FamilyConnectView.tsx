import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activities, setActivities] = useState<FamilyActivityItem[]>(INITIAL_FAMILY_ACTIVITIES);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [permissions, setPermissions] = useState<SharingPermissionState[]>(DEFAULT_SHARING_PERMISSIONS);
  const [removedMembers, setRemovedMembers] = useState<FamilyMember[]>([]);

  // PROFILE SWITCHER ('My Profile' | 'Father' | 'Mother' | 'Sister' | 'Brother')
  const [activeProfileView, setActiveProfileView] = useState<string>('My Profile');

  // CALENDAR DATE SELECTION
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('24 Aug 2026');

  // SEARCH & FILTERS
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleRemoveEmergencyContact = (id: string) => {
    const updated = emergencyContacts.filter((e) => e.id !== id);
    saveEmergencyState(updated);
    showToast('Emergency contact removed');
  };

  // FILTERED ACTIVITIES
  const filteredActivities = activities.filter((act) => {
    if (filters.memberFilter !== 'All' && !act.memberName.includes(filters.memberFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!act.title.toLowerCase().includes(q) && !act.subtitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* TOAST NOTIFICATION */}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Family Connect</h1>
            <span className="px-3 py-1 text-xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full font-mono">
              {members.length} Members Connected
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay connected with your family and coordinate healthcare together.
          </p>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={() => setPermissionsModalTarget(members[0] || null)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Manage Permissions</span>
          </button>

          <button
            onClick={() => setAddMemberModalOpen(true)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-md hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Family Member</span>
          </button>
        </div>
      </div>

      {/* 2. FAMILY OVERVIEW SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Family Members</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono">{members.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Connected</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{pendingRequests.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Awaiting</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Shared Appointments</span>
            <CalendarIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">{sharedAppointments.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Upcoming</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Shared Reminders</span>
            <Pill className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">{sharedReminders.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold">Active</span>
          </div>
        </div>
      </div>

      {/* 3. MY FAMILY MEMBERS SECTION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white">My Family</h3>
            <p className="text-xs text-slate-400">Manage your connected family members</p>
          </div>

          {/* FAMILY PROFILE SWITCHER DROPDOWN */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Viewing:</span>
            <select
              value={activeProfileView}
              onChange={(e) => {
                setActiveProfileView(e.target.value);
                showToast(`Viewing ${e.target.value} health profile parameters`);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
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
            <div key={mem.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md group hover:border-teal-500/40 transition-all">
              <div className="flex items-center gap-3">
                <img
                  src={mem.avatarUrl}
                  alt={mem.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/40 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="font-extrabold text-white text-sm">{mem.name}</h4>
                  <span className="text-[10px] font-bold text-teal-400 font-mono">{mem.relationship}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between"><span>Shared Items:</span><strong className="text-cyan-300">{mem.sharedItemsCount} items</strong></div>
                <div className="flex justify-between"><span>Last Activity:</span><span className="text-slate-300">{mem.lastActivity}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setProfileDrawerTarget(mem)}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setChatDrawerTarget(mem)}
                  className="py-2 px-2.5 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
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
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white">Pending Connections</h3>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {pendingRequests.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-extrabold text-white">{req.name} ({req.relationship})</h4>
                  <span className="text-[10px] text-slate-400">{req.contact} • Sent {req.timeAgo}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeclineRequest(req.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(req.id, req.name)}
                    className="px-4 py-1.5 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white font-extrabold cursor-pointer shadow-sm"
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
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-extrabold text-white">Shared Appointments</h3>
            </div>
            <button
              onClick={() => setShareAptModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Appointment</span>
            </button>
          </div>

          <div className="space-y-3">
            {sharedAppointments.map((apt) => (
              <div key={apt.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-white">{apt.doctorName}</h4>
                    <p className="text-[11px] text-teal-400 font-bold">{apt.speciality} • {apt.type}</p>
                  </div>
                  <span className="font-mono text-cyan-300 font-bold">{apt.date} at {apt.time}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Shared with: <strong className="text-white">{apt.sharedWith.join(', ')}</strong></span>
                  <button
                    onClick={() => onNavigate('appointments')}
                    className="text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
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
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-extrabold text-white">Shared Reminders</h3>
            </div>
            <button
              onClick={() => setShareRemModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Reminder</span>
            </button>
          </div>

          <div className="space-y-3">
            {sharedReminders.map((rem) => (
              <div key={rem.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-white">{rem.title}</h4>
                    <p className="text-[11px] text-slate-400">{rem.dosage}</p>
                  </div>
                  <span className="font-mono text-purple-300 font-bold">{rem.time}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Shared with: <strong className="text-white">{rem.sharedWith.join(', ')}</strong></span>
                  <button
                    onClick={() => onNavigate('reminders')}
                    className="text-purple-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
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

      {/* 5.5 FAMILY HEALTH ACTIVITY TIMELINE & FAMILY CALENDAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ACTIVITY TIMELINE (LEFT 7 COLS) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Family Health Activity</h3>
              <p className="text-xs text-slate-400">Recent shared healthcare events stream</p>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activity..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
              >
                <Filter className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredActivities.map((act) => (
              <div key={act.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-white">{act.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{act.date} • {act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{act.subtitle}</p>
                  <span className="text-[10px] text-teal-400 font-bold font-mono">Shared with: {act.memberName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAMILY CALENDAR (RIGHT 5 COLS) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Family Calendar</h3>
              <p className="text-xs text-slate-400">Activity indicators for August 2026</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/30">
              {selectedCalendarDate}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <span key={idx} className="font-bold text-slate-500 py-1 text-[10px] uppercase font-mono">{day}</span>
            ))}

            {Array.from({ length: 31 }, (_, i) => i + 1).map((dateNum) => {
              const formatted = `${dateNum} Aug 2026`;
              const isSelected = selectedCalendarDate.includes(`${dateNum} Aug`);
              const hasActivity = [22, 23, 24, 25].includes(dateNum);

              return (
                <button
                  key={dateNum}
                  onClick={() => setSelectedCalendarDate(formatted)}
                  className={`p-2 rounded-xl text-center font-mono font-bold transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#00a896] text-white shadow-md'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <span>{dateNum}</span>
                  {hasActivity && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute bottom-1 left-1/2 -translate-x-1/2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. WHAT YOU SHARE PRIVACY MATRIX & EMERGENCY CONTACTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SHARING & PRIVACY MATRIX (LEFT 7 COLS) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white">What You Share</h3>
              <p className="text-xs text-slate-400">You control which healthcare activities are shared with each member</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>

          <div className="space-y-3 text-xs">
            {permissions.map((p) => (
              <div key={p.memberId} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-white">{p.memberName}</h4>
                  <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Access Level: {p.accessLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="flex justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span>Appointments:</span>
                    <strong className={p.appointments ? 'text-emerald-400' : 'text-slate-500'}>{p.appointments ? 'ON' : 'OFF'}</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span>Reminders:</span>
                    <strong className={p.reminders ? 'text-emerald-400' : 'text-slate-500'}>{p.reminders ? 'ON' : 'OFF'}</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span>Pharmacy:</span>
                    <strong className={p.pharmacy ? 'text-emerald-400' : 'text-slate-500'}>{p.pharmacy ? 'ON' : 'OFF'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EMERGENCY CONTACTS (RIGHT 5 COLS) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-extrabold text-white">Emergency Contacts</h3>
            </div>
            <button
              onClick={() => setAddEmergencyModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Contact</span>
            </button>
          </div>

          <div className="space-y-3">
            {emergencyContacts.map((emg) => (
              <div key={emg.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-rose-400 uppercase font-mono">{emg.priority}</span>
                  <h4 className="font-extrabold text-white text-sm">{emg.name} ({emg.relationship})</h4>
                  <span className="font-mono text-slate-400">{emg.phone}</span>
                </div>

                <button
                  onClick={() => handleRemoveEmergencyContact(emg.id)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. RECENTLY REMOVED CONNECTIONS (COLLAPSIBLE) */}
      {removedMembers.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-extrabold text-white border-b border-slate-800 pb-3">Recently Removed Connections</h3>
          <div className="space-y-2">
            {removedMembers.map((rem) => (
              <div key={rem.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">{rem.name} ({rem.relationship})</span>
                <button
                  onClick={() => handleReconnect(rem.id)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reconnect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <AddFamilyMemberModal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onSendInvitation={handleSendInvitation}
      />

      <FamilyProfileDrawer
        member={profileDrawerTarget}
        isOpen={!!profileDrawerTarget}
        onClose={() => setProfileDrawerTarget(null)}
        onOpenChat={(m) => setChatDrawerTarget(m)}
        onOpenPermissions={(m) => setPermissionsModalTarget(m)}
        onRemoveConnection={handleRemoveConnection}
      />

      <ManagePermissionsModal
        member={permissionsModalTarget}
        isOpen={!!permissionsModalTarget}
        onClose={() => setPermissionsModalTarget(null)}
        onSavePermissions={handleSavePermissions}
      />

      <FamilyChatDrawer
        member={chatDrawerTarget}
        isOpen={!!chatDrawerTarget}
        onClose={() => setChatDrawerTarget(null)}
      />

      <ShareAppointmentModal
        members={members}
        isOpen={shareAptModalOpen}
        onClose={() => setShareAptModalOpen(false)}
        onConfirmShare={(newApt) => {
          setSharedAppointments([newApt, ...sharedAppointments]);
          setActivities([
            {
              id: `ACT-${Date.now()}`,
              type: 'Appointment',
              title: 'Appointment Shared',
              subtitle: `${newApt.doctorName} - ${newApt.type}`,
              date: 'Just now',
              time: newApt.time,
              memberName: newApt.sharedWith.join(', ')
            },
            ...activities
          ]);
          showToast('✓ Shared appointment with selected family members');
        }}
      />

      <ShareReminderModal
        members={members}
        isOpen={shareRemModalOpen}
        onClose={() => setShareRemModalOpen(false)}
        onConfirmShare={(newRem) => {
          setSharedReminders([newRem, ...sharedReminders]);
          setActivities([
            {
              id: `ACT-${Date.now()}`,
              type: 'Reminder',
              title: 'Medication Reminder Shared',
              subtitle: `${newRem.title} tracking`,
              date: 'Just now',
              time: newRem.time,
              memberName: newRem.sharedWith.join(', ')
            },
            ...activities
          ]);
          showToast('✓ Shared medication reminder with selected family members');
        }}
      />

      <AddEmergencyContactModal
        isOpen={addEmergencyModalOpen}
        onClose={() => setAddEmergencyModalOpen(false)}
        onSaveContact={handleAddEmergencyContact}
      />

      <FamilyFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters({ memberFilter: 'All', activityType: 'All', dateRange: 'This Month' })}
      />
    </div>
  );
};
