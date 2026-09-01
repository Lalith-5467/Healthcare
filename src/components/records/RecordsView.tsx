import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FileQuestion, Upload } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';
import { INITIAL_RECORDS } from './recordsData';
import { RecordsHeader } from './RecordsHeader';
import { RecordSummaryCards } from './RecordSummaryCards';
import { RecordCategoryTabs } from './RecordCategoryTabs';
import { RecordsSearchSortBar } from './RecordsSearchSortBar';
import type { RecordFilterState as FilterState } from './recordsData';
import { RecordFilterDrawer } from './RecordFilterDrawer';
import { RecentlyViewedStrip } from './RecentlyViewedStrip';
import { RecordCard } from './RecordCard';
import { RecordTimelineView } from './RecordTimelineView';
import { BulkActionBar } from './BulkActionBar';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { UploadRecordModal } from './UploadRecordModal';
import { ShareRecordModal } from './ShareRecordModal';
import { DeleteRecordModal } from './DeleteRecordModal';
import { RecordsSkeleton } from './RecordsSkeleton';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface RecordsViewProps {
  user?: UserProfile;
  onNavigateScan: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({
  user,
  onNavigateScan
}) => {
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // RECORDS STATE (Persisted in localStorage)
  const [records, setRecords] = useState<MedicalRecordItem[]>(INITIAL_RECORDS);

  // CATEGORY, SEARCH & VIEW STATES
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  // RECENTLY VIEWED & BULK SELECTION
  const [recentlyViewed, setRecentlyViewed] = useState<MedicalRecordItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // MODAL & DRAWER STATES
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<MedicalRecordItem | null>(null);
  const [shareRecord, setShareRecord] = useState<MedicalRecordItem | null>(null);
  const [deleteRecordTarget, setDeleteRecordTarget] = useState<MedicalRecordItem | null>(null);

  // FILTER STATE
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    dateRange: 'All',
    status: 'All',
    doctor: 'All',
    hospital: 'All'
  });

  // Load records from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_medical_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Persist records to localStorage when changed
  const saveRecordsToStorage = (newRecords: MedicalRecordItem[]) => {
    setRecords(newRecords);
    localStorage.setItem('user_medical_records', JSON.stringify(newRecords));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // HANDLERS
  const handleToggleImportant = (id: string) => {
    const updated = records.map((r) => {
      if (r.id === id) {
        const nextState = !r.isImportant;
        showToast(nextState ? '★ Added to Important Records' : 'Removed from Important Records');
        return { ...r, isImportant: nextState };
      }
      return r;
    });
    saveRecordsToStorage(updated);
  };

  const handleViewRecord = (rec: MedicalRecordItem) => {
    setPreviewRecord(rec);
    // Add to recently viewed
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== rec.id);
      return [rec, ...filtered].slice(0, 3);
    });
  };

  const handleDownload = (rec: MedicalRecordItem) => {
    showToast(`✓ Document download started: ${rec.fileName}`);
  };

  const handleShare = (rec: MedicalRecordItem) => {
    setShareRecord(rec);
  };

  const handleDeleteConfirm = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecordsToStorage(updated);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast('✓ Medical record deleted');
  };

  const handleRename = (rec: MedicalRecordItem) => {
    const newName = prompt('Enter new document title:', rec.title);
    if (newName && newName.trim()) {
      const updated = records.map((r) => (r.id === rec.id ? { ...r, title: newName.trim() } : r));
      saveRecordsToStorage(updated);
      showToast('✓ Medical record title updated');
    }
  };

  const handleAddRecord = (newRec: MedicalRecordItem) => {
    const updated = [newRec, ...records];
    saveRecordsToStorage(updated);
    showToast('✓ Record uploaded successfully');
  };

  // BULK ACTIONS
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(filteredAndSortedRecords.map((r) => r.id));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDownload = () => {
    showToast(`✓ Downloading ${selectedIds.length} records...`);
    handleClearSelection();
  };

  const handleBulkShare = () => {
    showToast(`✓ Shared ${selectedIds.length} records via ABDM consent`);
    handleClearSelection();
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
      const updated = records.filter((r) => !selectedIds.includes(r.id));
      saveRecordsToStorage(updated);
      showToast(`✓ Deleted ${selectedIds.length} records`);
      handleClearSelection();
    }
  };

  // ACTIVE FILTER COUNT
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type !== 'All') count++;
    if (filters.dateRange !== 'All') count++;
    if (filters.status !== 'All') count++;
    if (filters.doctor !== 'All') count++;
    if (filters.hospital !== 'All') count++;
    return count;
  }, [filters]);

  // FILTERED & SORTED RECORDS LOGIC
  const filteredAndSortedRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Category Tab filter
        if (selectedCategory !== 'All' && rec.type !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = rec.title.toLowerCase().includes(q);
          const matchDoctor = rec.doctor.toLowerCase().includes(q);
          const matchHospital = rec.hospital.toLowerCase().includes(q);
          const matchType = rec.type.toLowerCase().includes(q);
          const matchDate = rec.date.toLowerCase().includes(q);
          if (!matchTitle && !matchDoctor && !matchHospital && !matchType && !matchDate) {
            return false;
          }
        }

        // Filter Drawer Filters
        if (filters.type && filters.type !== 'All' && rec.type !== filters.type) return false;
        if (filters.status && filters.status !== 'All' && rec.status !== filters.status) return false;
        if (filters.doctor && filters.doctor !== 'All' && rec.doctor !== filters.doctor) return false;
        if (filters.hospital && filters.hospital !== 'All' && !rec.hospital.includes(filters.hospital)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.timestamp - a.timestamp;
        if (sortBy === 'oldest') return a.timestamp - b.timestamp;
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        if (sortBy === 'za') return b.title.localeCompare(a.title);
        if (sortBy === 'updated') return b.timestamp - a.timestamp;
        return 0;
      });
  }, [records, selectedCategory, searchQuery, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 w-full">
      {/* TOAST FEEDBACK NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#00a896] text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <RecordsSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* 1. PAGE HEADER */}
          <RecordsHeader
            onOpenUpload={() => setUploadModalOpen(true)}
            onNavigateScan={onNavigateScan}
          />

          {/* 2. SUMMARY CARDS */}
          <RecordSummaryCards
            records={records}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* 3. RECENTLY VIEWED STRIP */}
          <RecentlyViewedStrip
            recentRecords={recentlyViewed}
            onViewRecord={handleViewRecord}
          />

          {/* 4. SEARCH, FILTERS & SORT BAR */}
          <RecordsSearchSortBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenFilter={() => setFilterDrawerOpen(true)}
            activeFilterCount={activeFilterCount}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* 5. CATEGORY TABS */}
          <RecordCategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* 6. RECORDS LIST OR TIMELINE VIEW */}
          {filteredAndSortedRecords.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0f172a] border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
                <FileQuestion className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No Medical Records Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {searchQuery || activeFilterCount > 0
                    ? 'Try clearing your search query or adjusting active filters.'
                    : 'Upload or scan your first health document to get started.'}
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                {(searchQuery || activeFilterCount > 0) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ type: 'All', dateRange: 'All', status: 'All', doctor: 'All', hospital: 'All' });
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs cursor-pointer"
                  >
                    Clear Search & Filters
                  </button>
                )}
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Record</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'timeline' ? (
            <RecordTimelineView
              records={filteredAndSortedRecords}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleImportant={handleToggleImportant}
              onView={handleViewRecord}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={setDeleteRecordTarget}
              onRename={handleRename}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSortedRecords.map((rec) => (
                <RecordCard
                  key={rec.id}
                  record={rec}
                  isSelected={selectedIds.includes(rec.id)}
                  onToggleSelect={handleToggleSelect}
                  onToggleImportant={handleToggleImportant}
                  onView={handleViewRecord}
                  onDownload={handleDownload}
                  onShare={handleShare}
                  onDelete={setDeleteRecordTarget}
                  onRename={handleRename}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* BULK ACTION BAR */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        totalCount={filteredAndSortedRecords.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onBulkDownload={handleBulkDownload}
        onBulkShare={handleBulkShare}
        onBulkDelete={handleBulkDelete}
      />

      {/* FILTER DRAWER */}
      <RecordFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters({ type: 'All', dateRange: 'All', status: 'All', doctor: 'All', hospital: 'All' })}
      />

      {/* UPLOAD MODAL */}
      <UploadRecordModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onAddRecord={handleAddRecord}
        onNavigateScan={onNavigateScan}
      />

      {/* DOCUMENT PREVIEW MODAL */}
      <DocumentPreviewModal
        isOpen={!!previewRecord}
        onClose={() => setPreviewRecord(null)}
        record={previewRecord}
        userName={user?.name || 'Samson L.'}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      {/* SHARE MODAL */}
      <ShareRecordModal
        isOpen={!!shareRecord}
        onClose={() => setShareRecord(null)}
        record={shareRecord}
        onToast={showToast}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteRecordModal
        isOpen={!!deleteRecordTarget}
        onClose={() => setDeleteRecordTarget(null)}
        record={deleteRecordTarget}
        onConfirmDelete={handleDeleteConfirm}
      />
    </div>
  );
};
