import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import type {
  ChatMessage,
  ChatConversation,
  SavedHealthNote,
  HealthTopicItem,
  AIAssistantSettingsState,
  HealthTipItem
} from './aiAssistantData';
import {
  HEALTH_TOPICS_DATABASE,
  DEFAULT_AI_SETTINGS,
  generateDemoAIResponse
} from './aiAssistantData';
import { AIAssistantProfileSidebar } from './AIAssistantProfileSidebar';
import { AIChatArea } from './AIChatArea';
import { HealthSnapshotInsightsPanel } from './HealthSnapshotInsightsPanel';
import { DoctorVisitPrepModal } from './DoctorVisitPrepModal';
import { MedicalTermExplainerModal } from './MedicalTermExplainerModal';
import { HealthTopicDrawer } from './HealthTopicDrawer';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';
import { SavedHealthNotesModal } from './SavedHealthNotesModal';
import { AIChatSettingsDrawer } from './AIChatSettingsDrawer';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface AIAssistantViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CHAT STATE
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatConversation[]>([]);
  const [savedNotes, setSavedNotes] = useState<SavedHealthNote[]>([]);
  const [settings, setSettings] = useState<AIAssistantSettingsState>(DEFAULT_AI_SETTINGS);

  // MODALS & DRAWERS
  const [doctorPrepOpen, setDoctorPrepOpen] = useState(false);
  const [termExplainerOpen, setTermExplainerOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<HealthTopicItem | null>(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [savedNotesModalOpen, setSavedNotesModalOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedHist = localStorage.getItem('user_ai_chat_history');
    if (savedHist) { try { setChatHistory(JSON.parse(savedHist)); } catch (e) { console.error(e); } }
    const savedN = localStorage.getItem('user_ai_saved_notes');
    if (savedN) { try { setSavedNotes(JSON.parse(savedN)); } catch (e) { console.error(e); } }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = (userText: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}-USER`,
      sender: 'user',
      content: userText,
      timestamp: timeStr
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const generated = generateDemoAIResponse(userText, settings.responseStyle);
      const aiMsg: ChatMessage = {
        id: `MSG-${Date.now()}-AI`,
        sender: 'ai',
        content: generated.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: generated.questions,
        isEmergencyAlert: generated.isEmergency
      };

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);

      // Save to chat history
      const convId = `CONV-${Date.now().toString().slice(-4)}`;
      const newConv: ChatConversation = {
        id: convId,
        title: userText.slice(0, 30) + '...',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        messages: finalMessages
      };
      const updatedHist = [newConv, ...chatHistory.slice(0, 10)];
      setChatHistory(updatedHist);
      localStorage.setItem('user_ai_chat_history', JSON.stringify(updatedHist));
    }, 1000);
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      setMessages([]);
      showToast('✓ Started new conversation');
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('✓ Copied to clipboard');
  };

  const handleSaveToNotes = (msg: ChatMessage) => {
    const newNote: SavedHealthNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      title: msg.content.slice(0, 35) + '...',
      content: msg.content,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem('user_ai_saved_notes', JSON.stringify(updated));

    // Update message state
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, savedToNotes: true } : m)));
    showToast('✓ Saved to Health Notes');
  };

  const handleSaveDoctorQuestions = (title: string, questions: string[]) => {
    const newNote: SavedHealthNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      title,
      content: questions.map((q, i) => `${i + 1}. ${q}`).join('\n'),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem('user_ai_saved_notes', JSON.stringify(updated));
    showToast('✓ Saved doctor question checklist');
  };

  const handleSaveTip = (tip: HealthTipItem) => {
    const newNote: SavedHealthNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      title: `Tip: ${tip.category}`,
      content: tip.tip,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem('user_ai_saved_notes', JSON.stringify(updated));
    showToast('✓ Saved health tip to notes');
  };

  const handleFeedback = (msgId: string, isHelpful: boolean) => {
    setMessages(messages.map((m) => (m.id === msgId ? { ...m, isHelpful } : m)));
    showToast('✓ Thanks for your feedback');
  };

  const handleRegenerate = () => {
    if (messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
      if (lastUserMsg) {
        handleSendMessage(lastUserMsg.content);
      }
    }
  };

  const handleExportChat = (format: 'txt' | 'json' | 'pdf') => {
    const content = format === 'json'
      ? JSON.stringify(messages, null, 2)
      : messages.map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MediCare_AI_Chat_Export.${format}`;
    link.click();
    showToast(`✓ Exported chat conversation (${format.toUpperCase()})`);
  };

  const handleClearAIData = () => {
    setMessages([]);
    setChatHistory([]);
    setSavedNotes([]);
    localStorage.removeItem('user_ai_chat_history');
    localStorage.removeItem('user_ai_saved_notes');
    showToast('✓ Cleared AI Assistant data cache');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-24 text-xs font-sans">
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

      {/* 1. PAGE HEADER & DISCLAIMER */}
      <div className="space-y-3 pb-2">
        <PageHeader
          title="AI Health Assistant"
          subtitle="Your smart healthcare companion for everyday health guidance and appointment prep."
          badgeText="Demo Assistant Mode"
          badgeIcon={<ShieldCheck className="w-3.5 h-3.5" />}
        />

        {/* DISCLAIMER BANNER */}
        <div className="p-3 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-2 font-mono shadow-sm">
          <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span>This AI assistant provides general health information and is not a substitute for a qualified healthcare professional.</span>
        </div>
      </div>

      {/* 2. 3-COLUMN DESKTOP / RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT COLUMN: AI ASSISTANT SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          <AIAssistantProfileSidebar
            onNewChat={handleNewChat}
            onOpenSavedNotes={() => setSavedNotesModalOpen(true)}
            topics={HEALTH_TOPICS_DATABASE}
            onSelectTopic={(t) => setSelectedTopic(t)}
          />
        </div>

        {/* CENTER COLUMN: MAIN CHAT CONVERSATION AREA */}
        <div className="lg:col-span-2">
          <AIChatArea
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onOpenHistory={() => setHistoryDrawerOpen(true)}
            onOpenSettings={() => setSettingsDrawerOpen(true)}
            onOpenDoctorPrep={() => setDoctorPrepOpen(true)}
            onOpenTermExplainer={() => setTermExplainerOpen(true)}
            onCopyMessage={handleCopyText}
            onSaveToNotes={handleSaveToNotes}
            onFeedback={handleFeedback}
            onRegenerate={handleRegenerate}
            onNavigateSOS={() => onNavigate('emergency')}
            onNavigateHospitals={() => onNavigate('hospitals')}
          />
        </div>

        {/* RIGHT COLUMN: HEALTH SNAPSHOT & INSIGHTS PANEL */}
        <div className="lg:col-span-1">
          <HealthSnapshotInsightsPanel
            onNavigate={onNavigate}
            onSaveTip={handleSaveTip}
          />
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      <DoctorVisitPrepModal
        isOpen={doctorPrepOpen}
        onClose={() => setDoctorPrepOpen(false)}
        onSaveQuestionsNote={handleSaveDoctorQuestions}
        onCopyText={handleCopyText}
      />

      <MedicalTermExplainerModal
        isOpen={termExplainerOpen}
        onClose={() => setTermExplainerOpen(false)}
        onSelectTermQuery={handleSendMessage}
      />

      <HealthTopicDrawer
        topic={selectedTopic}
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        onAskTopic={handleSendMessage}
      />

      <ChatHistoryDrawer
        history={chatHistory}
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        onSelectConversation={(conv) => setMessages(conv.messages)}
        onDeleteConversation={(id) => {
          const updated = chatHistory.filter((c) => c.id !== id);
          setChatHistory(updated);
          localStorage.setItem('user_ai_chat_history', JSON.stringify(updated));
          showToast('✓ Conversation deleted');
        }}
      />

      <SavedHealthNotesModal
        notes={savedNotes}
        isOpen={savedNotesModalOpen}
        onClose={() => setSavedNotesModalOpen(false)}
        onDeleteNote={(id) => {
          const updated = savedNotes.filter((n) => n.id !== id);
          setSavedNotes(updated);
          localStorage.setItem('user_ai_saved_notes', JSON.stringify(updated));
          showToast('✓ Saved note deleted');
        }}
        onCopyNote={handleCopyText}
      />

      <AIChatSettingsDrawer
        settings={settings}
        isOpen={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        onUpdateSettings={(newS) => {
          setSettings(newS);
          showToast('✓ AI Assistant settings saved');
        }}
        onExportChat={handleExportChat}
        onClearAIData={handleClearAIData}
      />
    </div>
  );
};
