
import React, { useState, useEffect } from 'react';
import {
  Video, ShieldAlert, CheckCircle2, PlayCircle, Edit,
  Trash2, RotateCcw, AlertTriangle, Plus, Search,
  X, Filter, Check, Clock, History, Ban, ShieldCheck,
  RefreshCw, Loader2
} from 'lucide-react';
import api from '../../../services/api';

const FALLBACK_THUMBNAIL_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180" viewBox="0 0 120 180" fill="%231e293b"><rect width="120" height="180" fill="%230f172a"/><circle cx="60" cy="80" r="22" fill="%23e11d48" opacity="0.85"/><polygon points="54,71 54,89 71,80" fill="%23ffffff"/><text x="50%" y="125" fill="%2394a3b8" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">YouTube Short</text><text x="50%" y="142" fill="%2364748b" font-size="9" font-family="sans-serif" text-anchor="middle">Preview Unavailable</text></svg>';

interface SuperAdminHealthVideoViewProps {
  currentRole: 'Admin' | 'Super Admin';
}

interface HealthVideo {
  id: string;
  youtubeVideoId: string;
  title: string;
  channelName: string;
  durationSeconds: number;
  status: 'DISCOVERED' | 'PENDING_REVIEW' | 'APPROVED' | 'DISABLED' | 'DELETED';
  enabled: boolean;
  displayOrder: number;
  createdAt: string;
  topics?: any[];
}

interface VideoHistory {
  id: string;
  action: string;
  timestamp: string;
  adminUserId: string;
  previousValue: string | null;
  newValue: string | null;
  undoStatus: boolean;
}

export const SuperAdminHealthVideoView: React.FC<SuperAdminHealthVideoViewProps> = ({ currentRole }) => {
  const [videos, setVideos] = useState<HealthVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [previewVideo, setPreviewVideo] = useState<HealthVideo | null>(null);
  const [addModal, setAddModal] = useState({ isOpen: false, youtubeId: '' });
  const [historyModal, setHistoryModal] = useState<{ isOpen: boolean, videoId: string }>({ isOpen: false, videoId: '' });
  const [historyLogs, setHistoryLogs] = useState<VideoHistory[]>([]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    stats?: { discovered: number; inserted: number; updated: number; skipped: number };
  } | null>(null);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const res = await api.post('/admin/health/videos/sync') as any;
      if (res.data?.success || res.success) {
        const stats = res.data?.stats || res.stats;
        const message = res.data?.message || res.message || 'YouTube Shorts discovery synchronized successfully.';
        setSyncFeedback({
          type: 'success',
          message,
          stats
        });
        await fetchVideos();
      } else {
        setSyncFeedback({
          type: 'error',
          message: res.data?.message || res.message || 'Failed to synchronize YouTube Shorts.'
        });
      }
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Error communicating with synchronization service.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const renderDurationBadge = (seconds: number) => {
    if (!seconds || seconds <= 0) {
      return (
        <div>
          <span className="font-mono text-slate-400">--</span>
          <span className="block text-[10px] text-amber-500 font-bold">Unverified</span>
        </div>
      );
    }
    // YouTube Shorts: typically 5s to 3 minutes (180s)
    const isShort = seconds >= 5 && seconds <= 180;
    return (
      <div>
        <span className="font-mono">{seconds}s</span>
        {isShort ? (
          <span className="block text-[10px] text-emerald-500 font-bold">
            Valid Short {seconds <= 60 ? '(≤60s)' : '(≤3m)'}
          </span>
        ) : (
          <span className="block text-[10px] text-rose-500 font-bold">
            Exceeds 3m Limit
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/admin/health/videos') as any;
      if (res.data?.success || res.success) {
        setVideos(res.data?.data || res.data);
      } else {
        setError('Failed to fetch videos');
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('403 Forbidden - Super Admin access required.');
      } else {
        setError(err.message || 'Error fetching videos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Very basic add, normally we'd fetch duration from YouTube API here, but for demo we assume backend validation handles it
      const ytId = addModal.youtubeId;
      if (!ytId) return;
      await api.post('/admin/health/videos', {
        youtubeVideoId: ytId,
        title: 'Manual Added Video',
        durationSeconds: 10,
        status: 'APPROVED',
        enabled: true
      });
      setAddModal({ isOpen: false, youtubeId: '' });
      fetchVideos();
    } catch (err) {
      alert('Failed to add manual video');
    }
  };

  const handleApprove = async (id: string) => {

    try {
      await api.post(`/admin/health/videos/${id}/approve`);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert('Error approving video');
    }
  };

  const handleDisable = async (id: string) => {
    try {
      await api.post(`/admin/health/videos/${id}/disable`);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert('Error disabling video');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.post(`/admin/health/videos/${id}/restore`);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert('Error restoring video');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to soft delete this video?')) return;
    try {
      await api.delete(`/admin/health/videos/${id}`);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert('Error deleting video');
    }
  };

  const openHistory = async (videoId: string) => {
    setHistoryModal({ isOpen: true, videoId });
    try {
      const res = await api.get(`/admin/health/videos/history?videoId=${videoId}`) as any;
      setHistoryLogs(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch history');
    }
  };

  const handleUndo = async (historyId: string, videoId: string) => {
    if (!window.confirm('Undo this change?')) return;
    try {
      await api.post(`/admin/health/videos/${videoId}/undo`, { historyId });
      setHistoryModal({ isOpen: false, videoId: '' });
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert('Failed to undo');
    }
  };

  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.youtubeVideoId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: videos.length,
    pending: videos.filter(v => v.status === 'PENDING_REVIEW' || v.status === 'DISCOVERED').length,
    approved: videos.filter(v => v.status === 'APPROVED').length,
    disabled: videos.filter(v => v.status === 'DISABLED').length,
  };

  if (currentRole !== 'Super Admin') {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
        <div className="text-center space-y-4 max-w-sm">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">403 Forbidden</h2>
          <p className="text-sm text-slate-500">You must be a Super Admin to access Health Video Management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Video className="w-7 h-7 text-rose-500" />
            Health Shorts Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review, approve, and audit patient educational videos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 border border-slate-700 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            title="Synchronize and queue new health shorts from YouTube discovery engine"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing YouTube...' : 'Sync YouTube Shorts'}
          </button>
          <button onClick={() => setAddModal({ isOpen: true, youtubeId: '' })} className="px-4 py-2 bg-[#00a896] hover:bg-[#00897b] text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-colors cursor-pointer">
            <Plus className="w-4 h-4" /> Add Manual Video
          </button>
        </div>
      </div>

      {/* SYNC FEEDBACK BANNER */}
      {syncFeedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold ${
          syncFeedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {syncFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
            <span>{syncFeedback.message}</span>
            {syncFeedback.stats && (
              <span className="font-mono text-[11px] ml-2 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                Discovered: {syncFeedback.stats.discovered} | Queued: {syncFeedback.stats.inserted} | Updated: {syncFeedback.stats.updated} | Preserved: {syncFeedback.stats.skipped}
              </span>
            )}
          </div>
          <button onClick={() => setSyncFeedback(null)} className="p-1 hover:bg-black/10 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Videos" value={stats.total} icon={Video} color="blue" />
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="amber" alert={stats.pending > 0} />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircle2} color="emerald" />
        <StatCard title="Disabled" value={stats.disabled} icon={Ban} color="rose" />
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl flex-1 max-w-md border border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or YouTube ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-semibold w-full text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'PENDING_REVIEW', 'APPROVED', 'DISABLED', 'DELETED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${statusFilter === status
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center p-10 text-slate-500 animate-pulse">Loading videos...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-black text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Video</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Topics</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredVideos.map(video => (
                  <tr key={video.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-24 bg-black rounded-lg overflow-hidden shrink-0 group-hover:ring-2 ring-rose-500/50 transition-all cursor-pointer" onClick={() => setPreviewVideo(video)}>
                          <img 
                            src={`https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`} 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                            alt={video.title || "thumb"}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = FALLBACK_THUMBNAIL_SVG;
                            }}
                          />
                          <PlayCircle className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-2">{video.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{video.channelName || 'Unknown Channel'}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-1 bg-slate-100 dark:bg-slate-900 inline-block px-1 rounded">{video.youtubeVideoId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">
                      {renderDurationBadge(video.durationSeconds)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={video.status} enabled={video.enabled} />
                    </td>
                    <td className="px-4 py-3">
                      {video.topics?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {video.topics.map((t: any) => (
                            <span key={t.topicId} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded">
                              {t.topic?.displayName || 'Topic'}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No topics</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openHistory(video.id)} className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-900 rounded-lg cursor-pointer" title="View Audit History"><History className="w-4 h-4" /></button>

                        {(video.status === 'PENDING_REVIEW' || video.status === 'DISCOVERED') && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleApprove(video.id)} className="p-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg font-bold flex items-center gap-1 text-xs cursor-pointer hover:bg-emerald-100 transition-colors" title="Approve Video">
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button onClick={() => handleDisable(video.id)} className="p-1.5 text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-lg font-bold flex items-center gap-1 text-xs cursor-pointer hover:bg-rose-100 transition-colors" title="Reject / Disable Video">
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {video.status === 'APPROVED' && (
                          <button onClick={() => handleDisable(video.id)} className="p-1.5 text-amber-500 bg-amber-50 dark:bg-amber-500/10 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors" title="Disable Video"><Ban className="w-4 h-4" /></button>
                        )}

                        {video.status === 'DISABLED' && (
                          <button onClick={() => handleRestore(video.id)} className="p-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors" title="Restore Video"><RotateCcw className="w-4 h-4" /></button>
                        )}

                        {video.status !== 'DELETED' && (
                          <button onClick={() => handleDelete(video.id)} className="p-1.5 text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-lg cursor-pointer hover:bg-rose-100 transition-colors" title="Soft Delete Video"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredVideos.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500 font-bold">No videos found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewVideo && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-[400px] w-full border border-slate-700 shadow-2xl relative">
            <button onClick={() => setPreviewVideo(null)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black"><X className="w-5 h-5" /></button>
            <div className="w-full aspect-[9/16] bg-black relative">
              <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube.com/embed/${previewVideo.youtubeVideoId}?autoplay=1&mute=0&rel=0`}
                title="YouTube Preview"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-slate-900">
              <h3 className="text-white font-bold">{previewVideo.title}</h3>
              <p className="text-slate-400 text-xs mt-1">Duration: {previewVideo.durationSeconds}s | Status: {previewVideo.status}</p>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {historyModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2"><History className="w-5 h-5 text-blue-500" /> Audit History</h2>
              <button onClick={() => setHistoryModal({ isOpen: false, videoId: '' })} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {historyLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{log.action}</span>
                      <span className="text-xs text-slate-400 ml-2">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    {log.previousValue && !log.undoStatus && (
                      <button onClick={() => handleUndo(log.id, historyModal.videoId)} className="text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-1 bg-amber-50 dark:bg-amber-900/30 rounded flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/50">
                        <RotateCcw className="w-3 h-3" /> UNDO
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono break-all line-clamp-3">
                    Admin: {log.adminUserId} <br />
                    {log.undoStatus && <span className="text-rose-500 italic">This action was part of an undo.</span>}
                  </div>
                </div>
              ))}
              {historyLogs.length === 0 && <p className="text-center text-slate-500">No history found.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL VIDEO MODAL */}
      {addModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">Add Manual Video</h2>
              <button onClick={() => setAddModal({ isOpen: false, youtubeId: '' })} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">YouTube Video ID / URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dQw4w9WgXcQ or https://youtube.com/..."
                  value={addModal.youtubeId}
                  onChange={e => {
                    let val = e.target.value;
                    // Extract ID if it's a URL
                    const urlMatch = val.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
                    if (urlMatch) val = urlMatch[1];
                    setAddModal(prev => ({ ...prev, youtubeId: val }));
                  }}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Supports YouTube Shorts up to 3 minutes (180s). Video will be cataloged and audited.
              </p>
              <button type="submit" className="w-full py-2 bg-[#00a896] hover:bg-[#00897b] text-white font-bold rounded-xl transition-colors cursor-pointer">
                Save to Database
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// HELPER COMPONENTS

const StatCard = ({ title, value, icon: Icon, color, alert }: any) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    rose: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} relative overflow-hidden flex items-center gap-4`}>
      <div className={`p-3 rounded-xl bg-white dark:bg-black/20 shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
      {alert && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
      )}
    </div>
  );
};

const StatusBadge = ({ status, enabled }: { status: string, enabled: boolean }) => {
  if (status === 'PENDING_REVIEW' || status === 'DISCOVERED') return <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-black rounded-lg border border-amber-200 dark:border-amber-800 flex inline-flex items-center gap-1 animate-pulse"><Clock className="w-3 h-3" /> {status === 'DISCOVERED' ? 'DISCOVERED' : 'PENDING REVIEW'}</span>;
  if (status === 'APPROVED') return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-black rounded-lg border border-emerald-200 dark:border-emerald-800 flex inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> APPROVED {enabled ? '' : '(DISABLED)'}</span>;
  if (status === 'DISABLED') return <span className="px-2 py-1 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-black rounded-lg flex inline-flex items-center gap-1"><Ban className="w-3 h-3" /> DISABLED</span>;
  if (status === 'DELETED') return <span className="px-2 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 text-[10px] font-black rounded-lg flex inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> DELETED</span>;
  return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg">{status}</span>;
};
