import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Project, PaymentStatus, TeamMember, Client, Profile,
  Package, Transaction, TeamProjectPayment, Card, AssignedTeamMember,
  FinancialPocket,
} from '../../../types';
import {
  ClipboardListIcon, CheckCircleIcon, FileTextIcon, SendIcon,
  PencilIcon, Trash2Icon, UserIcon, PlusIcon, Share2Icon, ArrowDownIcon,
  X as XIcon, Save as SaveIcon,
} from 'lucide-react';
import {
  listChecklistByProject, deleteChecklistItem,
  initializeDefaultChecklist, setChecklistItemCompleted, updateChecklistItemFields,
  renameChecklistCategory, deleteChecklistItemsByProjectAndCategory,
  upsertChecklistItems,
} from '../../../services/weddingDayChecklist';
import { updateProject as updateProjectInDb } from '../../../services/projects';
import supabase from '../../../lib/supabaseClient';
import { formatCurrency, getStatusClass, getProgressForStatus } from '../utils/projectHelpers';
import { EditFormData } from '../hooks/useProjectEditMode';

export interface ProjectDetailModalProps {
  selectedProject: Project | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  teamMembers: TeamMember[];
  clients: Client[];
  profile: Profile;
  showNotification: (message: string) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onClose: () => void;
  /** @deprecated tombol edit sekarang inline — prop ini dipertahankan agar kode lain tidak error */
  handleOpenForm: (mode: 'edit', project: Project) => void;
  handleProjectDelete: (projectId: string) => void;
  handleOpenBriefingModal: () => void;
  packages: Package[];
  transactions: Transaction[];
  teamProjectPayments: TeamProjectPayment[];
  cards: Card[];
  onOpenSharePreview: (data: { title: string; message: string; phone?: string | null }) => void;
  onNavigateToClient?: (clientId: string) => void;
  // ── Edit mode props (injected from ProjectsPage via useProjectEditMode) ──
  isEditing: boolean;
  isSaving: boolean;
  editFormData: EditFormData | null;
  editTeamByCategory: Record<string, Record<string, TeamMember[]>>;
  onEnterEditMode: (project: Project) => void;
  onCancelEditMode: () => void;
  onEditFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onEditTeamChange: (member: TeamMember) => void;
  onEditTeamFeeChange: (memberId: string, fee: number) => void;
  onEditTeamSubJobChange: (memberId: string, subJob: string) => void;
  onEditReplaceTeamMember: (oldMemberId: string, newMember: TeamMember) => void;
  onSaveEdit: () => void;
}

// ─── Reusable atoms ──────────────────────────────────────────────────────────

const InfoField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  <div className={`flex flex-col gap-1 p-2.5 sm:p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/90 ${className}`}>
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6A85]">{label}</span>
    <span className="text-xs sm:text-sm font-bold text-[#2A3547] break-words leading-snug">{children || <span className="text-slate-400">—</span>}</span>
  </div>
);

const SectionHeading: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-2.5 sm:mb-3.5 mt-4 sm:mt-6 first:mt-0">
    <h3 className="text-xs sm:text-sm font-extrabold text-[#2A3547] uppercase tracking-wider flex items-center gap-2">
      <span className="w-1.5 h-4 rounded-full bg-[#5D87FF] inline-block" />
      {title}
    </h3>
    {action}
  </div>
);

const SectionCard: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
    {title && <h4 className="text-xs sm:text-sm font-bold text-[#2A3547] pb-2.5 mb-3.5 border-b border-slate-200">{title}</h4>}
    {children}
  </div>
);

// Shared input / label classes for edit mode
// bg-brand-input = var(--color-input-bg) = #ffffff, konsisten dengan design system
const inputCls =
  'w-full px-3 py-2.5 rounded-xl border border-brand-border bg-brand-input text-brand-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all';
const labelCls = 'block text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary mb-1.5';

// ─── Main component ──────────────────────────────────────────────────────────

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  selectedProject, setSelectedProject, teamMembers, clients, profile,
  showNotification, setProjects, onClose,
  handleProjectDelete, handleOpenBriefingModal, packages, transactions,
  teamProjectPayments, cards,
  onOpenSharePreview, onNavigateToClient,
  // edit mode
  isEditing, isSaving, editFormData, editTeamByCategory,
  onEnterEditMode, onCancelEditMode,
  onEditFormChange, onEditTeamChange, onEditTeamFeeChange,
  onEditTeamSubJobChange, onEditReplaceTeamMember, onSaveEdit,
}) => {
  // ── state ───────────────────────────────────────────────────────────────
  const [isEditingFinalLink, setIsEditingFinalLink] = useState(false);
  const [tempFinalLink, setTempFinalLink] = useState('');
  const [editingChecklistNotesId, setEditingChecklistNotesId] = useState<string | null>(null);
  const [checklistNotesDraft, setChecklistNotesDraft] = useState('');
  const [editingChecklistItemId, setEditingChecklistItemId] = useState<string | null>(null);
  const [checklistItemNameDraft, setChecklistItemNameDraft] = useState('');
  const [picDraft, setPicDraft] = useState('');
  const [editingCategoryName, setEditingCategoryName] = useState<string | null>(null);
  const [categoryNameDraft, setCategoryNameDraft] = useState('');
  const [isInitializingChecklist, setIsInitializingChecklist] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileSectionTab, setMobileSectionTab] = useState<'all' | 'info' | 'team' | 'checklist' | 'files'>('all');

  // ── paidMemberIds — for edit form fee lock ────────────────────────────────
  const paidMemberIdsForProject = useMemo(() => {
    const projectId = selectedProject?.id;
    if (!projectId) return new Set<string>();
    return new Set(
      teamProjectPayments.filter(p => p.projectId === projectId && p.status === 'Paid').map(p => p.teamMemberId),
    );
  }, [teamProjectPayments, selectedProject?.id]);

  // ── team by category — for VIEW mode ─────────────────────────────────────
  const teamByCategory = useMemo(() => {
    if (!selectedProject?.team) return { Tim: {}, Vendor: {} };
    return selectedProject.team.reduce(
      (acc, member) => {
        const orig = teamMembers.find(m => m.id === member.memberId);
        const cat = orig?.category || 'Tim';
        if (!acc[cat]) acc[cat] = {};
        if (!acc[cat][member.role]) acc[cat][member.role] = [];
        acc[cat][member.role].push(member);
        return acc;
      },
      { Tim: {}, Vendor: {} } as Record<string, Record<string, AssignedTeamMember[]>>,
    );
  }, [selectedProject?.team, teamMembers]);

  // ── reset checklist state on project change ───────────────────────────────
  useEffect(() => {
    setEditingChecklistItemId(null);
    setChecklistItemNameDraft('');
    setPicDraft('');
    setEditingChecklistNotesId(null);
    setChecklistNotesDraft('');
    setEditingCategoryName(null);
    setCategoryNameDraft('');
    setActiveCategory(null);
  }, [selectedProject?.id]);

  // ── real-time checklist sync ──────────────────────────────────────────────
  useEffect(() => {
    const projectId = selectedProject?.id;
    if (!projectId) return;

    (async () => {
      try {
        const items = await listChecklistByProject(projectId);
        setSelectedProject(prev => {
          if (!prev || prev.id !== projectId) return prev;
          return { ...prev, weddingDayChecklist: items };
        });
        setProjects(all => all.map(p => (p.id === projectId ? { ...p, weddingDayChecklist: items } : p)));
      } catch (e) {
        console.error('Failed to load checklist:', e);
      }
    })();

    const channel = supabase
      .channel(`admin:wedding_day_checklists:project_id=eq.${projectId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wedding_day_checklists', filter: `project_id=eq.${projectId}` },
        payload => {
          let updatedChecklist: any[] | null = null;
          setSelectedProject(prev => {
            if (!prev || prev.id !== projectId) return prev;
            const cur = prev.weddingDayChecklist || [];
            let next = [...cur];
            if (payload.eventType === 'INSERT') {
              const n = payload.new as any;
              const item = { id: n.id, projectId: n.project_id, category: n.category, itemName: n.item_name, isCompleted: n.is_completed, assignedTo: n.assigned_to, notes: n.notes, createdAt: n.created_at, updatedAt: n.updated_at };
              if (!next.some(i => i.id === item.id)) next.push(item);
            } else if (payload.eventType === 'UPDATE') {
              const n = payload.new as any;
              const item = { id: n.id, projectId: n.project_id, category: n.category, itemName: n.item_name, isCompleted: n.is_completed, assignedTo: n.assigned_to, notes: n.notes, createdAt: n.created_at, updatedAt: n.updated_at };
              next = next.map(i => (i.id === item.id ? item : i));
            } else if (payload.eventType === 'DELETE') {
              next = next.filter(i => i.id !== (payload.old as any).id);
            }
            if (JSON.stringify(next) === JSON.stringify(cur)) return prev;
            updatedChecklist = next;
            return { ...prev, weddingDayChecklist: next };
          });
          if (updatedChecklist) {
            setProjects(all => all.map(p => (p.id === projectId ? { ...p, weddingDayChecklist: updatedChecklist! } : p)));
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedProject?.id, setProjects]);

  // ── handlers (view mode) ─────────────────────────────────────────────────

  const formatDateFull = (d: string) =>
    d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedProject) return;
    const nextProgress = getProgressForStatus(newStatus, profile.projectStatusConfig);
    const statusConfig = profile.projectStatusConfig.find(s => s.name === newStatus);
    try {
      const updated = {
        ...selectedProject,
        status: newStatus,
        progress: nextProgress,
        activeSubStatuses: [],
        customSubStatuses: statusConfig?.subStatuses || []
      } as Project;
      await updateProjectInDb(selectedProject.id, {
        status: newStatus as any,
        progress: nextProgress as any,
        activeSubStatuses: [] as any,
        customSubStatuses: (statusConfig?.subStatuses || []) as any
      } as any);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      setSelectedProject(updated);
      showNotification(`Status diubah ke "${newStatus}"`);
    } catch {
      showNotification('Gagal memperbarui status. Coba lagi.');
    }
  };

  const handleSubStatusToggle = async (subName: string, checked: boolean) => {
    if (!selectedProject) return;
    const nextActive = checked
      ? [...(selectedProject.activeSubStatuses || []), subName]
      : (selectedProject.activeSubStatuses || []).filter(s => s !== subName);
    try {
      const updated = { ...selectedProject, activeSubStatuses: nextActive };
      await updateProjectInDb(selectedProject.id, { activeSubStatuses: nextActive as any } as any);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      setSelectedProject(updated);
    } catch {
      showNotification('Gagal memperbarui tahapan.');
    }
  };

  const handleSaveFinalLink = async () => {
    if (!selectedProject) return;
    try {
      const updated = { ...selectedProject, finalDriveLink: tempFinalLink };
      await updateProjectInDb(selectedProject.id, { finalDriveLink: tempFinalLink } as any);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      setSelectedProject(updated);
      setIsEditingFinalLink(false);
      showNotification('Link File Jadi berhasil diperbarui.');
    } catch {
      showNotification('Gagal memperbarui link.');
    }
  };

  const handleSendFinalLink = () => {
    if (!selectedProject?.finalDriveLink) { showNotification('Link File Jadi belum tersedia.'); return; }
    const client = clients.find(c => c.id === selectedProject.clientId);
    const phone = client?.whatsapp || client?.phone;
    if (!phone) { showNotification('Nomor WhatsApp pengantin tidak ditemukan.'); return; }
    const template =
      profile.chatTemplates?.find(t => t.title.toLowerCase().includes('link'))?.template ||
      `Halo Kak {clientName},\n\nTerima kasih telah mempercayakan acara {projectName} kepada kami.\nBerikut link file hasil dokumentasi:\n{finalDriveLink}\n\nSemoga suka!`;
    const message = template
      .replace(/{clientName}/g, selectedProject.clientName)
      .replace(/{projectName}/g, selectedProject.projectName)
      .replace(/{finalDriveLink}/g, selectedProject.finalDriveLink);
    onOpenSharePreview({ title: `Bagikan Link File Jadi — ${selectedProject.projectName}`, message, phone });
  };

  const handleToggleChecklistItem = async (itemId: string, current: boolean) => {
    if (!selectedProject) return;
    try {
      const row = await setChecklistItemCompleted(itemId, !current);
      const items = selectedProject.weddingDayChecklist?.map(i => (i.id === itemId ? { ...i, isCompleted: row.isCompleted, updatedAt: row.updatedAt } : i)) || [];
      const updated = { ...selectedProject, weddingDayChecklist: items };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
    } catch {
      showNotification('Gagal memperbarui checklist.');
    }
  };

  const handleSaveChecklistNotes = async () => {
    if (!selectedProject || !editingChecklistNotesId) return;
    try {
      const row = await updateChecklistItemFields(editingChecklistNotesId, { notes: checklistNotesDraft });
      const items = selectedProject.weddingDayChecklist?.map(i => (i.id === editingChecklistNotesId ? { ...i, notes: row.notes, updatedAt: row.updatedAt } : i)) || [];
      const updated = { ...selectedProject, weddingDayChecklist: items };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      setEditingChecklistNotesId(null);
      setChecklistNotesDraft('');
    } catch {
      showNotification('Gagal menyimpan catatan.');
    }
  };

  const handleSaveItemEdits = async () => {
    if (!selectedProject || !editingChecklistItemId) return;
    try {
      const row = await updateChecklistItemFields(editingChecklistItemId, { itemName: checklistItemNameDraft, assignedTo: picDraft });
      const items = selectedProject.weddingDayChecklist?.map(i => (i.id === editingChecklistItemId ? { ...i, itemName: row.itemName, assignedTo: row.assignedTo, updatedAt: row.updatedAt } : i)) || [];
      const updated = { ...selectedProject, weddingDayChecklist: items };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      setEditingChecklistItemId(null);
      setChecklistItemNameDraft('');
      setPicDraft('');
    } catch {
      showNotification('Gagal menyimpan item.');
    }
  };

  const handleAddChecklistItem = async (category: string, itemName: string) => {
    if (!selectedProject) return;
    try {
      const [row] = await upsertChecklistItems([{ projectId: selectedProject.id, category, itemName, isCompleted: false }]);
      const items = [...(selectedProject.weddingDayChecklist || []), row];
      const updated = { ...selectedProject, weddingDayChecklist: items };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
    } catch {
      showNotification('Gagal menambah item.');
    }
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    if (!selectedProject) return;
    try {
      await deleteChecklistItem(itemId);
      const items = selectedProject.weddingDayChecklist?.filter(i => i.id !== itemId) || [];
      const updated = { ...selectedProject, weddingDayChecklist: items };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
    } catch {
      showNotification('Gagal menghapus item.');
    }
  };

  const handleSaveCategoryName = async () => {
    if (!selectedProject || !editingCategoryName) return;
    const newName = categoryNameDraft.trim();
    if (!newName) { showNotification('Nama kategori tidak boleh kosong.'); return; }
    if (newName === editingCategoryName) { setEditingCategoryName(null); setCategoryNameDraft(''); return; }
    try {
      await renameChecklistCategory(selectedProject.id, editingCategoryName, newName);
      const refreshed = await listChecklistByProject(selectedProject.id);
      const updated = { ...selectedProject, weddingDayChecklist: refreshed };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      setEditingCategoryName(null);
      setCategoryNameDraft('');
      showNotification('Kategori berhasil diubah.');
    } catch {
      showNotification('Gagal mengubah nama kategori.');
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!selectedProject) return;
    const catItems = selectedProject.weddingDayChecklist?.filter(i => i.category === category) || [];
    if (!catItems.length) return;
    if (!window.confirm(`Hapus kategori "${category}" beserta ${catItems.length} item di dalamnya?`)) return;
    try {
      await deleteChecklistItemsByProjectAndCategory(selectedProject.id, category);
      const refreshed = await listChecklistByProject(selectedProject.id);
      const updated = { ...selectedProject, weddingDayChecklist: refreshed };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      showNotification('Kategori berhasil dihapus.');
    } catch {
      showNotification('Gagal menghapus kategori.');
    }
  };

  const handleInitializeChecklist = async () => {
    if (!selectedProject || isInitializingChecklist) return;
    setIsInitializingChecklist(true);
    try {
      const custom = profile.checklistTemplates?.length ? profile.checklistTemplates : undefined;
      const result = await initializeDefaultChecklist(selectedProject.id, custom);
      const updated = { ...selectedProject, weddingDayChecklist: result };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updated : p)));
      showNotification('Checklist Hari H berhasil dibuat.');
    } catch {
      showNotification('Gagal membuat checklist default.');
    } finally {
      setIsInitializingChecklist(false);
    }
  };

  const handleShareChecklist = () => {
    if (!selectedProject) return;
    const byCat = (selectedProject.weddingDayChecklist || []).reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    let message = `*REKAP CHECKLIST HARI H — ${selectedProject.projectName}*\n\n`;
    Object.entries(byCat).forEach(([cat, items]) => {
      message += `*${cat}:*\n`;
      items.forEach(i => { message += `${i.isCompleted ? '✅' : '⬜'} ${i.itemName}\n`; });
      message += '\n';
    });
    onOpenSharePreview({ title: `Bagikan Rekap Checklist — ${selectedProject.projectName}`, message, phone: null });
  };

  const handleShareChecklistPortal = () => {
    if (!selectedProject) return;
    const link = `${window.location.origin}/#/checklist-portal/${selectedProject.id}`;
    onOpenSharePreview({ title: `Portal Checklist — ${selectedProject.projectName}`, message: `Portal Checklist Hari H — ${selectedProject.projectName}\n\n${link}`, phone: null });
  };

  // ── guard ─────────────────────────────────────────────────────────────────
  if (!selectedProject) return null;
  const selectedClient = clients.find(clientItem => clientItem.id === selectedProject.clientId);

  // ── derived data ──────────────────────────────────────────────────────────
  const allSubStatuses =
    selectedProject.customSubStatuses ||
    profile.projectStatusConfig.find(s => s.name === selectedProject.status)?.subStatuses ||
    [];

  const pkg = packages.find(p => p.id === selectedProject.packageId) ?? null;
  const totalPaid = selectedProject.amountPaid || 0;
  const paidPct = selectedProject.totalCost > 0 ? Math.min(100, Math.round((totalPaid / selectedProject.totalCost) * 100)) : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full -mt-1">

      {/* ══════════════════════════════════════════════════════════════════
          HERO HEADER
      ══════════════════════════════════════════════════════════════════ */}
      <div 
        className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 shadow-md bg-cover bg-center border border-slate-200/40"
        style={{ backgroundImage: `url(${profile.publicPageConfig?.backgroundImages?.eventDetail || '/assets/images/backgrounds/detail-acara-pernikahan.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/65 to-slate-900/85 pointer-events-none" />

        <div className="relative p-3.5 sm:p-5">
          {/* Top Row: Avatar + Title + Quick Actions */}
          <div className="flex flex-col items-center gap-4 sm:w-full sm:flex-row sm:items-center sm:gap-5">
            <div className="w-24 h-24 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-inner">
              {selectedClient?.avatarUrl ? (
                <img src={selectedClient.avatarUrl} alt={`${selectedClient.name} avatar`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-white select-none">
                  {(selectedProject.clientName || 'P').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <div className="w-full">
                <h2 className="text-base sm:text-2xl font-black text-white leading-snug break-words">
                  {selectedProject.projectName}
                </h2>
                {selectedProject.clientName && !selectedProject.projectName.toLocaleLowerCase().startsWith(selectedProject.clientName.toLocaleLowerCase()) && (
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-semibold truncate">
                    Klien: {selectedProject.clientName}
                  </p>
                )}
              </div>

              {!isEditing ? (
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEnterEditMode(selectedProject)}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white text-[#2A3547] hover:bg-slate-100 text-[11px] sm:text-xs font-bold shadow-sm transition-all active:scale-95"
                    title="Edit Acara"
                  >
                    <PencilIcon className="w-3.5 h-3.5 text-[#5D87FF] flex-shrink-0" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleOpenBriefingModal}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl bg-emerald-600 border border-emerald-700 text-white text-[11px] sm:text-xs font-bold transition-all active:scale-95 flex-shrink-0"
                    title="Briefing Tim"
                  >
                    <Share2Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="hidden sm:inline">Briefing</span>
                  </button>
                </div>
              ) : (
                <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-amber-300/40 bg-amber-400/20 px-2.5 py-1.5 text-[11px] font-bold text-amber-200 sm:text-xs">
                  <PencilIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  Mode Edit
                </span>
              )}

              <div className="flex w-full flex-col items-center gap-2 sm:items-start">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/15 backdrop-blur-xs border border-white/25 text-[10px] font-bold text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    {selectedProject.status}
                  </span>
                  {selectedProject.paymentStatus && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/15 backdrop-blur-xs border border-white/25 text-[10px] font-bold text-white">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${selectedProject.paymentStatus === PaymentStatus.LUNAS ? 'bg-emerald-400' : selectedProject.paymentStatus === PaymentStatus.DP_TERBAYAR ? 'bg-blue-400' : 'bg-red-400'}`} />
                      {selectedProject.paymentStatus}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/15 backdrop-blur-xs border border-white/25 text-[10px] font-semibold text-white">
                  {new Date(selectedProject.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          EDIT MODE
      ══════════════════════════════════════════════════════════════════ */}
      {isEditing && editFormData && (
        <EditModeContent
          editFormData={editFormData}
          profile={profile}
          teamMembers={teamMembers}
          teamByCategory={editTeamByCategory}
          paidMemberIds={paidMemberIdsForProject}
          isSaving={isSaving}
          onFormChange={onEditFormChange}
          onTeamChange={onEditTeamChange}
          onTeamFeeChange={onEditTeamFeeChange}
          onTeamSubJobChange={onEditTeamSubJobChange}
          onReplaceTeamMember={onEditReplaceTeamMember}
          onSave={onSaveEdit}
          onCancel={onCancelEditMode}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW MODE (UNIFIED SECTIONS WITH MOBILE TAB FILTER)
      ══════════════════════════════════════════════════════════════════ */}
      {!isEditing && (
        <div className="space-y-4 sm:space-y-6 pb-6 animate-fade-in">
          {/* Quick Section Navigation Bar */}
          <div className="sticky top-0 z-20 -mx-1 px-1 py-1.5 bg-white/95 backdrop-blur-md border-b border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              {([
                { id: 'all', label: 'Semua' },
                { id: 'info', label: 'Info & Status' },
                { id: 'team', label: `Tim & Paket (${selectedProject.team?.length || 0})` },
                { id: 'checklist', label: `Checklist (${(selectedProject.weddingDayChecklist || []).filter(i => i.isCompleted).length}/${(selectedProject.weddingDayChecklist || []).length})` },
                { id: 'files', label: 'File & Link' },
              ] as const).map(tab => {
                const active = mobileSectionTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMobileSectionTab(tab.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#5D87FF] text-white border-[#5D87FF] shadow-xs'
                        : 'bg-[#F8FAFC] text-[#5A6A85] border-slate-200 hover:text-[#2A3547] hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ──────────── SEKSI 1: INFORMASI & STATUS ACARA ──────────── */}
          {(mobileSectionTab === 'all' || mobileSectionTab === 'info') && (
            <>
              <section>
                <SectionHeading title="Informasi Utama" />
                <SectionCard>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                    <InfoField label="Pengantin">{selectedProject.clientName}</InfoField>
                    <InfoField label="Lokasi / Kota">{selectedProject.location || '—'}</InfoField>
                    <InfoField label="Tanggal Acara" className="col-span-2 sm:col-span-1">
                      {formatDateFull(selectedProject.date)}
                    </InfoField>
                    <InfoField label="Alamat Lengkap / Gedung" className="col-span-2 sm:col-span-1">
                      {selectedProject.address || '—'}
                    </InfoField>
                    {selectedProject.startTime && <InfoField label="Jam Mulai">{selectedProject.startTime}</InfoField>}
                    {selectedProject.endTime && <InfoField label="Jam Selesai">{selectedProject.endTime}</InfoField>}
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#2A3547]">Biaya & Pembayaran</h4>
                      <span className="text-[10px] font-bold text-[#5A6A85]">Progres {paidPct}%</span>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-slate-200">
                      {[
                        { label: 'Total Biaya', value: formatCurrency(selectedProject.totalCost), color: 'text-[#2A3547]' },
                        { label: 'Terbayar', value: formatCurrency(totalPaid), color: 'text-emerald-600' },
                        { label: 'Sisa Tagihan', value: formatCurrency(Math.max(0, selectedProject.totalCost - totalPaid)), color: selectedProject.totalCost - totalPaid > 0 ? 'text-amber-600' : 'text-emerald-600' },
                      ].map(item => (
                        <div key={item.label} className="flex min-w-0 flex-col items-center justify-center px-1.5 sm:px-3">
                          <span className="text-center text-[9px] font-bold uppercase leading-tight tracking-wider text-[#5A6A85]">{item.label}</span>
                          <span className={`mt-0.5 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[11px] font-black leading-tight tabular-nums sm:text-sm ${item.color}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${paidPct >= 100 ? 'bg-emerald-500' : 'bg-[#5D87FF]'}`}
                        style={{ width: `${paidPct}%` }}
                      />
                    </div>
                  </div>
                </SectionCard>
              </section>

              <section>
                <SectionHeading title="Status & Progres Pengerjaan" />
                <SectionCard>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                    <p className="text-[11px] sm:text-xs font-bold text-[#5A6A85] uppercase tracking-wider shrink-0">
                      Status Acara:
                    </p>
                    <div className="relative flex-grow">
                      <select
                        value={selectedProject.status}
                        onChange={e => handleStatusUpdate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#2A3547] rounded-xl border border-slate-200 bg-[#F8FAFC] cursor-pointer focus:outline-none focus:bg-white focus:border-[#5D87FF] focus:ring-2 focus:ring-[#5D87FF]/20 transition-all"
                      >
                        {profile.projectStatusConfig.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="flex justify-between text-xs font-bold text-[#2A3547] mb-1.5">
                      <span>Progres Pengerjaan</span>
                      <span className="text-[#5D87FF]">{selectedProject.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5D87FF] transition-all duration-700 rounded-full"
                        style={{ width: `${selectedProject.progress}%` }}
                      />
                    </div>
                  </div>

                  {allSubStatuses.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-slate-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6A85] mb-2.5">
                        Tahapan Detail ({selectedProject.activeSubStatuses?.length || 0}/{allSubStatuses.length})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {allSubStatuses.map(sub => {
                          const isActive = selectedProject.activeSubStatuses?.includes(sub.name);
                          return (
                            <label
                              key={sub.name}
                              className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all ${
                                isActive
                                  ? 'bg-[#ECF2FF] border-[#5D87FF]/40 text-[#2A3547]'
                                  : 'bg-[#F8FAFC] border-slate-200 text-[#5A6A85] hover:border-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-[#5D87FF] border-slate-300 focus:ring-[#5D87FF]/30 flex-shrink-0"
                                checked={!!isActive}
                                onChange={e => handleSubStatusToggle(sub.name, e.target.checked)}
                              />
                              <div className="min-w-0 flex-1">
                                <span className={`text-xs sm:text-sm font-bold block leading-snug ${isActive ? 'text-[#2A3547]' : 'text-[#5A6A85]'}`}>
                                  {sub.name}
                                </span>
                                {sub.note && (
                                  <span className="text-[10px] text-[#5A6A85] block mt-0.5">{sub.note}</span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </SectionCard>
              </section>

              {selectedProject.notes && (
                <section>
                  <SectionHeading title="Catatan Khusus" />
                  <SectionCard>
                    <p className="text-xs sm:text-sm text-[#2A3547] leading-relaxed whitespace-pre-line">
                      {selectedProject.notes}
                    </p>
                  </SectionCard>
                </section>
              )}
            </>
          )}

          {/* ──────────── SEKSI TIM & BIAYA PAKET ──────────── */}
          {(mobileSectionTab === 'all' || mobileSectionTab === 'team') && (
            <>
              <section>
                <SectionHeading title="Detail Biaya & Paket" />
                <SectionCard>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                    <InfoField label="Paket Layanan">{selectedProject.packageName || '—'}</InfoField>
                    <InfoField label="Add-ons Tambahan">
                      {selectedProject.addOns?.map(a => a.name).filter(Boolean).join(', ') || '—'}
                    </InfoField>
                  </div>
                </SectionCard>
              </section>

              <section>
                <SectionHeading title="Tugas Tim dan Vendor" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {(['Tim', 'Vendor'] as const).map(category => {
                    const roleGroups = Object.entries(teamByCategory[category] || {});
                    const assignmentCount = roleGroups.reduce((count, [, members]) => count + members.length, 0);

                    return (
                      <div key={category} className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between gap-3 pb-2.5 mb-3 border-b border-slate-200">
                          <h4 className="text-xs sm:text-sm font-bold text-[#2A3547]">
                            {category === 'Tim' ? 'Tim Internal' : 'Vendor / Mitra'}
                          </h4>
                          <span className="text-[10px] font-bold text-[#5D87FF] bg-[#ECF2FF] border border-[#5D87FF]/20 px-2.5 py-0.5 rounded-full">
                            {assignmentCount} orang
                          </span>
                        </div>
                        {assignmentCount === 0 ? (
                          <p className="text-xs text-[#5A6A85] italic py-3 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-slate-200">
                            Belum ada penugasan {category === 'Tim' ? 'tim' : 'vendor'}.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {roleGroups.map(([role, members]) => (
                              <div key={role}>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6A85] mb-1.5">{role}</p>
                                <div className="space-y-2">
                                  {members.map(assignment => {
                                    const teamMember = teamMembers.find(member => member.id === assignment.memberId);
                                    const payment = teamProjectPayments.find(item =>
                                      item.projectId === selectedProject.id && item.teamMemberId === assignment.memberId,
                                    );
                                    const isPaid = payment?.status === 'Paid';
                                    return (
                                      <div
                                        key={assignment.id || assignment.memberId}
                                        className="flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl bg-[#F8FAFC] border border-slate-200"
                                      >
                                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 bg-[#ECF2FF] border border-[#5D87FF]/20 flex items-center justify-center text-sm font-bold text-[#5D87FF]">
                                            {teamMember?.avatarUrl ? (
                                              <img src={teamMember.avatarUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              assignment.name?.charAt(0).toUpperCase() || '?'
                                            )}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="team-assignment-name truncate text-[13px] font-bold text-[#2A3547] sm:text-[15px]">{assignment.name}</p>
                                            {assignment.subJob && (
                                              <p className="text-[11px] text-[#5A6A85] truncate">{assignment.subJob}</p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <p className="text-xs font-extrabold text-[#2A3547] tabular-nums">
                                            {formatCurrency(assignment.fee)}
                                          </p>
                                          <span
                                            className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 border ${
                                              isPaid
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}
                                          >
                                            {isPaid ? 'Lunas' : 'Belum dibayar'}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ──────────── SEKSI 2: CHECKLIST HARI H ────────────────── */}
          {(mobileSectionTab === 'all' || mobileSectionTab === 'checklist') && (
            <div className="space-y-3.5 pt-3 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#2A3547]">Checklist Hari H</h3>
                  <p className="text-[11px] text-[#5A6A85]">Kelola persiapan lapangan secara real-time</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handleShareChecklistPortal}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[11px] sm:text-xs font-bold text-[#2A3547] hover:border-[#5D87FF] transition-all active:scale-95"
                  >
                    <SendIcon className="w-3.5 h-3.5 text-[#5D87FF]" /> Portal
                  </button>
                  <button
                    onClick={handleShareChecklist}
                    className="flex-1 sm:flex-none btn-box-wa justify-center px-3 py-1.5 text-[11px] sm:text-xs"
                  >
                    <SendIcon className="w-3.5 h-3.5 text-white" /> <span>WhatsApp</span>
                  </button>
                  {!selectedProject.weddingDayChecklist?.length && (
                    <button
                      onClick={handleInitializeChecklist}
                      disabled={isInitializingChecklist}
                      className="w-full sm:w-auto button-primary !py-1.5 !px-3 text-[11px] sm:text-xs disabled:opacity-50"
                    >
                      {isInitializingChecklist ? 'Membuat…' : 'Buat Checklist'}
                    </button>
                  )}
                </div>
              </div>

              {selectedProject.weddingDayChecklist?.length ? (() => {
                const total = selectedProject.weddingDayChecklist.length;
                const done  = selectedProject.weddingDayChecklist.filter(i => i.isCompleted).length;
                const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div className="grid grid-cols-4 gap-2">
                    {([
                      { label: 'Total',   val: total,        color: 'text-[#2A3547]',  bg: 'bg-white border-slate-200' },
                      { label: 'Selesai', val: done,         color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
                      { label: 'Sisa',    val: total - done, color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
                      { label: 'Progres', val: `${pct}%`,    color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200' },
                    ] as const).map(s => (
                      <div key={s.label} className={`${s.bg} border rounded-xl p-2 sm:p-3 flex flex-col items-center shadow-2xs`}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#5A6A85]">{s.label}</p>
                        <p className={`text-base sm:text-xl font-black ${s.color} mt-0.5 tabular-nums`}>{s.val}</p>
                      </div>
                    ))}
                  </div>
                );
              })() : null}

              {(() => {
                const existingCategories = Array.from(new Set(
                  (selectedProject.weddingDayChecklist || []).slice().sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()).map(i => i.category),
                ));
                if (!existingCategories.length) {
                  return (
                    <div className="flex flex-col items-center justify-center py-8 px-4 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center">
                      <h4 className="text-sm font-bold text-[#2A3547]">Belum Ada Checklist</h4>
                      <p className="text-xs text-[#5A6A85] mt-1 mb-4">Inisialisasi checklist default untuk membantu persiapan lapangan.</p>
                      <button onClick={handleInitializeChecklist} className="button-primary !py-2 !px-5 text-xs">Inisialisasi Sekarang</button>
                    </div>
                  );
                }
                const currentCat = activeCategory || existingCategories[0];
                return (
                  <>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                      {existingCategories.map(cat => {
                        const catItems = (selectedProject.weddingDayChecklist || []).filter(i => i.category === cat);
                        const catDone  = catItems.filter(i => i.isCompleted).length;
                        const isAct    = cat === currentCat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all ${
                              isAct
                                ? 'bg-[#5D87FF] border-[#5D87FF] text-white shadow-xs'
                                : 'bg-white border-slate-200 text-[#2A3547] hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                isAct
                                  ? 'bg-white/25 text-white'
                                  : catDone === catItems.length && catItems.length > 0
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {catDone}/{catItems.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {(() => {
                      const catItems = (selectedProject.weddingDayChecklist || []).filter(i => i.category === currentCat);
                      const catDone  = catItems.filter(i => i.isCompleted).length;
                      return (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                          <div className="px-3.5 py-2.5 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between gap-2 group">
                            {editingCategoryName === currentCat ? (
                              <div className="flex items-center gap-2 flex-grow">
                                <input
                                  value={categoryNameDraft}
                                  onChange={e => setCategoryNameDraft(e.target.value)}
                                  className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-[#2A3547] focus:outline-none focus:border-[#5D87FF]"
                                  onKeyDown={e => { if (e.key === 'Enter') handleSaveCategoryName(); if (e.key === 'Escape') { setEditingCategoryName(null); setCategoryNameDraft(''); } }}
                                  autoFocus
                                />
                                <button onClick={handleSaveCategoryName} className="p-2 bg-[#5D87FF] text-white rounded-lg"><CheckCircleIcon className="w-4 h-4" /></button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-2 h-2 rounded-full bg-[#5D87FF] flex-shrink-0" />
                                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#2A3547] truncate">{currentCat}</p>
                                  <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingCategoryName(currentCat); setCategoryNameDraft(currentCat); }} className="p-1 text-[#5A6A85] hover:text-[#5D87FF] transition-colors" title="Ubah Kategori"><PencilIcon className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleDeleteCategory(currentCat)} className="p-1 text-[#5A6A85] hover:text-red-500 transition-colors" title="Hapus Kategori"><Trash2Icon className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] font-black text-[#5A6A85]">{catDone}/{catItems.length}</span>
                                  <div className="w-14 sm:w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#5D87FF] rounded-full transition-all duration-500" style={{ width: `${catItems.length > 0 ? (catDone / catItems.length) * 100 : 0}%` }} />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="p-2.5 sm:p-3 divide-y divide-slate-100">
                            {catItems.map(item => (
                              <div key={item.id} className="flex items-start gap-2.5 sm:gap-3 py-2.5 px-2 rounded-xl hover:bg-[#F8FAFC] transition-all group/item">
                                <button
                                  onClick={() => handleToggleChecklistItem(item.id, item.isCompleted)}
                                  className={`checklist-item-toggle flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all active:scale-90 ${
                                    item.isCompleted ? 'bg-[#5D87FF] border-[#5D87FF] shadow-xs' : 'border-slate-300 bg-white hover:border-[#5D87FF]'
                                  }`}
                                >
                                  {item.isCompleted && <CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
                                </button>
                                <div className="flex-grow min-w-0">
                                  {editingChecklistItemId === item.id ? (
                                    <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
                                      <input
                                        value={checklistItemNameDraft}
                                        onChange={e => setChecklistItemNameDraft(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2A3547] focus:outline-none focus:border-[#5D87FF]"
                                        placeholder="Nama tugas"
                                        autoFocus
                                      />
                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="relative flex-grow">
                                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#5A6A85]" />
                                          <input
                                            value={picDraft}
                                            onChange={e => setPicDraft(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm text-[#2A3547] focus:outline-none focus:border-[#5D87FF]"
                                            placeholder="PIC / Penanggung Jawab"
                                            onKeyDown={e => { if (e.key === 'Enter') handleSaveItemEdits(); if (e.key === 'Escape') { setEditingChecklistItemId(null); setChecklistItemNameDraft(''); setPicDraft(''); } }}
                                          />
                                        </div>
                                        <div className="flex gap-2">
                                          <button onClick={() => { setEditingChecklistItemId(null); setChecklistItemNameDraft(''); setPicDraft(''); }} className="flex-1 sm:flex-none px-3 py-1.5 bg-white text-[#5A6A85] text-xs font-bold rounded-xl border border-slate-200">Batal</button>
                                          <button onClick={handleSaveItemEdits} className="flex-1 sm:flex-none button-primary !py-1.5 !px-3 text-xs">Simpan</button>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0 flex-1">
                                        <p className={`text-xs sm:text-sm font-semibold transition-colors break-words ${item.isCompleted ? 'text-[#5A6A85] line-through' : 'text-[#2A3547]'}`}>
                                          {item.itemName}
                                        </p>
                                        {item.assignedTo && (
                                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-slate-200 text-[10px] font-semibold text-[#5A6A85]">
                                            <UserIcon className="w-2.5 h-2.5 text-[#5D87FF]" />{item.assignedTo}
                                          </span>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                          <button onClick={() => { setEditingChecklistNotesId(item.id); setChecklistNotesDraft(item.notes || ''); }} className={`text-[10px] font-bold uppercase tracking-wider hover:text-[#5D87FF] transition-colors ${item.notes ? 'text-[#5D87FF]' : 'text-[#5A6A85]'}`}>
                                            {item.notes ? '• Lihat Catatan' : '+ Catatan'}
                                          </button>
                                          {item.isCompleted && item.updatedAt && (
                                            <span className="text-[9px] text-[#5A6A85]">✓ {new Date(item.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity flex-shrink-0">
                                        <button onClick={() => { setEditingChecklistItemId(item.id); setChecklistItemNameDraft(item.itemName); setPicDraft(item.assignedTo || ''); }} className="p-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-[#5A6A85] hover:text-[#5D87FF] transition-colors"><PencilIcon className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeleteChecklistItem(item.id)} className="p-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-[#5A6A85] hover:text-red-500 transition-colors"><Trash2Icon className="w-3 h-3" /></button>
                                      </div>
                                    </div>
                                  )}
                                  {editingChecklistNotesId === item.id && (
                                    <div className="mt-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 animate-fade-in">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6A85] mb-1.5">Catatan Item</p>
                                      <textarea value={checklistNotesDraft} onChange={e => setChecklistNotesDraft(e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2A3547] focus:outline-none focus:border-[#5D87FF] resize-none" placeholder="Tambahkan instruksi atau update lapangan…" />
                                      <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => { setEditingChecklistNotesId(null); setChecklistNotesDraft(''); }} className="px-3 py-1.5 bg-white text-[#5A6A85] text-xs font-bold rounded-xl border border-slate-200">Batal</button>
                                        <button onClick={handleSaveChecklistNotes} className="button-primary !py-1.5 !px-3 text-xs">Simpan Catatan</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            <div className="pt-3">
                              <div className="relative">
                                <PlusIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6A85] pointer-events-none" />
                                <input
                                  type="text"
                                  placeholder={`Tambah item ke ${currentCat}…`}
                                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-[#2A3547] placeholder:text-[#5A6A85] focus:outline-none focus:bg-white focus:border-[#5D87FF] transition-all"
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                      handleAddChecklistItem(currentCat, e.currentTarget.value);
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                );
              })()}
            </div>
          )}

          {/* ──────────── SEKSI 3: FILE & TAUTAN PENTING ───────────── */}
          {(mobileSectionTab === 'all' || mobileSectionTab === 'files') && (
            <div className="space-y-3.5 pt-3 border-t border-slate-200">
              <SectionHeading title="File & Tautan Penting" />
              <SectionCard>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#2A3547]">Brief / Moodboard</p>
                      <p className="text-xs text-[#5A6A85] mt-0.5">Link internal untuk tim</p>
                    </div>
                    {selectedProject.driveLink ? (
                      <a href={selectedProject.driveLink} target="_blank" rel="noopener noreferrer" className="button-secondary !py-1.5 !px-3 text-xs inline-flex items-center gap-1.5 shrink-0 border border-slate-200 bg-white text-[#2A3547]">
                        <FileTextIcon className="w-3.5 h-3.5 text-[#5D87FF]" /> Buka
                      </a>
                    ) : <span className="text-xs text-[#5A6A85] italic shrink-0">Belum ada</span>}
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#2A3547]">File dari Pengantin</p>
                      <p className="text-xs text-[#5A6A85] mt-0.5">Foto / dokumen diterima dari pengantin</p>
                    </div>
                    {selectedProject.clientDriveLink ? (
                      <a href={selectedProject.clientDriveLink} target="_blank" rel="noopener noreferrer" className="button-secondary !py-1.5 !px-3 text-xs inline-flex items-center gap-1.5 shrink-0 border border-slate-200 bg-white text-[#2A3547]">
                        <FileTextIcon className="w-3.5 h-3.5 text-[#5D87FF]" /> Buka
                      </a>
                    ) : <span className="text-xs text-[#5A6A85] italic shrink-0">Belum ada</span>}
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#2A3547]">File Jadi (Hasil Akhir)</p>
                        <p className="text-xs text-[#5A6A85] mt-0.5">Link hasil dokumentasi untuk dikirim ke pengantin</p>
                      </div>
                      {!isEditingFinalLink && (
                        <div className="flex items-center gap-1.5">
                          {selectedProject.finalDriveLink && (
                            <button onClick={handleSendFinalLink} className="btn-box-wa !py-1.5 !px-2.5 text-xs">
                              <SendIcon className="w-3.5 h-3.5 text-white" /> <span>Kirim WA</span>
                            </button>
                          )}
                          <button onClick={() => { setTempFinalLink(selectedProject.finalDriveLink || ''); setIsEditingFinalLink(true); }} className="btn-box-edit !py-1.5 !px-2.5 text-xs">
                            <PencilIcon className="w-3.5 h-3.5" /> <span>Edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {isEditingFinalLink ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <input
                          type="url"
                          value={tempFinalLink}
                          onChange={e => setTempFinalLink(e.target.value)}
                          placeholder="https://drive.google.com/…"
                          className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-[#2A3547] focus:outline-none focus:border-[#5D87FF] transition-all"
                        />
                        <div className="flex items-center gap-2">
                          <button onClick={handleSaveFinalLink} className="flex-1 sm:flex-none button-primary !py-2 !px-3.5 text-xs">Simpan</button>
                          <button onClick={() => setIsEditingFinalLink(false)} className="flex-1 sm:flex-none px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-[#5A6A85] hover:text-[#2A3547]">Batal</button>
                        </div>
                      </div>
                    ) : selectedProject.finalDriveLink ? (
                      <a href={selectedProject.finalDriveLink} target="_blank" rel="noopener noreferrer" className="block text-xs sm:text-sm text-[#5D87FF] hover:underline font-bold break-all bg-white p-2.5 rounded-lg border border-slate-200">
                        {selectedProject.finalDriveLink}
                      </a>
                    ) : (
                      <p className="text-xs text-[#5A6A85] italic">Belum tersedia — klik Edit untuk menambahkan.</p>
                    )}
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ProjectDetailModal;

// ══════════════════════════════════════════════════════════════════════════════
// EDIT MODE CONTENT — sub-component agar ProjectDetailModal tetap terbaca
// ══════════════════════════════════════════════════════════════════════════════

interface EditModeContentProps {
  editFormData: EditFormData;
  profile: Profile;
  teamMembers: TeamMember[];
  teamByCategory: Record<string, Record<string, TeamMember[]>>;
  paidMemberIds: Set<string>;
  isSaving: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onTeamChange: (member: TeamMember) => void;
  onTeamFeeChange: (memberId: string, fee: number) => void;
  onTeamSubJobChange: (memberId: string, subJob: string) => void;
  onReplaceTeamMember: (oldMemberId: string, newMember: TeamMember) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditModeContent: React.FC<EditModeContentProps> = ({
  editFormData, profile, teamMembers, teamByCategory, paidMemberIds,
  isSaving, onFormChange, onTeamChange, onTeamFeeChange,
  onTeamSubJobChange, onReplaceTeamMember, onSave, onCancel,
}) => {
  return (
    <div className="animate-fade-in">
      {/* Padding bawah agar konten tidak tertutup sticky action bar (~64px) */}
      <div className="pb-20 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* 1 — Informasi Dasar */}
            <SectionCard title="Informasi Dasar Acara">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-projectName" className={labelCls}>Nama Acara Pernikahan <span className="text-red-400">*</span></label>
                  <input id="edit-projectName" type="text" name="projectName" value={editFormData.projectName} onChange={onFormChange} className={inputCls} placeholder="Contoh: Wedding Xander & Alya" required />
                </div>
                <div>
                  <label htmlFor="edit-projectType" className={labelCls}>Jenis Acara Pernikahan <span className="text-red-400">*</span></label>
                  <select id="edit-projectType" name="projectType" value={editFormData.projectType} onChange={onFormChange} className={inputCls} required>
                    <option value="" disabled>Pilih Jenis...</option>
                    {profile.projectTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-location" className={labelCls}>Lokasi / Kota</label>
                  <input id="edit-location" type="text" name="location" value={editFormData.location} onChange={onFormChange} className={inputCls} placeholder="Contoh: Jakarta" />
                </div>
                <div>
                  <label htmlFor="edit-address" className={labelCls}>Alamat Lengkap / Gedung</label>
                  <textarea id="edit-address" name="address" value={editFormData.address} onChange={onFormChange} className={inputCls} placeholder="Contoh: Gedung Mulia, Jl. Gatot Subroto No. 1" rows={3} />
                </div>
              </div>
            </SectionCard>

            {/* 2 — Jadwal & Detail */}
            <SectionCard title="Jadwal & Detail">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-date" className={labelCls}>Tanggal Acara <span className="text-red-400">*</span></label>
                    <input id="edit-date" type="date" name="date" value={editFormData.date} onChange={onFormChange} className={inputCls} required />
                  </div>
                  <div>
                    <label htmlFor="edit-deadlineDate" className={labelCls}>Deadline</label>
                    <input id="edit-deadlineDate" type="date" name="deadlineDate" value={editFormData.deadlineDate} onChange={onFormChange} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-startTime" className={labelCls}>Waktu Mulai</label>
                    <input id="edit-startTime" type="time" name="startTime" value={editFormData.startTime} onChange={onFormChange} className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="edit-endTime" className={labelCls}>Waktu Selesai</label>
                    <input id="edit-endTime" type="time" name="endTime" value={editFormData.endTime} onChange={onFormChange} className={inputCls} />
                  </div>
                </div>
                {editFormData.status === 'Dikirim' && (
                  <div>
                    <label htmlFor="edit-shippingDetails" className={labelCls}>Detail Pengiriman</label>
                    <input id="edit-shippingDetails" type="text" name="shippingDetails" value={editFormData.shippingDetails} onChange={onFormChange} className={inputCls} placeholder="Informasi pengiriman hasil ke pengantin" />
                  </div>
                )}
              </div>
            </SectionCard>

            {/* 3 — Tautan & Catatan */}
            <SectionCard title="Tautan & Catatan">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-driveLink" className={labelCls}>Link Brief / Moodboard (Internal)</label>
                  <input id="edit-driveLink" type="url" name="driveLink" value={editFormData.driveLink} onChange={onFormChange} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label htmlFor="edit-clientDriveLink" className={labelCls}>Link File dari Pengantin</label>
                  <input id="edit-clientDriveLink" type="url" name="clientDriveLink" value={editFormData.clientDriveLink} onChange={onFormChange} className={inputCls} placeholder="https://drive.google.com/..." />
                </div>
                <div>
                  <label htmlFor="edit-finalDriveLink" className={labelCls}>Link File Jadi (untuk Pengantin)</label>
                  <input id="edit-finalDriveLink" type="url" name="finalDriveLink" value={editFormData.finalDriveLink} onChange={onFormChange} className={inputCls} placeholder="https://drive.google.com/..." />
                </div>
                <div>
                  <label htmlFor="edit-notes" className={labelCls}>Catatan Acara</label>
                  <textarea id="edit-notes" name="notes" value={editFormData.notes} onChange={onFormChange} className={inputCls} placeholder="Catatan penting terkait acara ini..." rows={4} />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div className="space-y-4">
            {(['Tim', 'Vendor'] as const).map(category => (
              <SectionCard key={category} title={category === 'Tim' ? 'Tim Internal' : 'Vendor / Mitra'}>
                <div className="space-y-4">
                  {Object.entries(teamByCategory[category] || {}).length === 0 && (
                    <p className="text-xs text-[#5A6A85] italic text-center py-3 bg-[#F8FAFC] rounded-xl border border-dashed border-slate-200">
                      Belum ada {category === 'Tim' ? 'anggota tim' : 'vendor'} terdaftar.
                    </p>
                  )}
                  {Object.entries(teamByCategory[category] || {}).map(([role, members]) => (
                    <div key={role} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-[#5A6A85] uppercase tracking-wider">{role}</p>
                        <div className="h-px flex-grow bg-slate-200" />
                      </div>
                      {(members as TeamMember[]).map(member => {
                        const assignedMember = editFormData.team.find(t => t.memberId === member.id);
                        const isSelected = !!assignedMember;
                        const isPaid = paidMemberIds.has(member.id);
                        return (
                          <div key={member.id} className={`p-3 rounded-xl transition-all ${isSelected ? 'bg-[#ECF2FF] border-2 border-[#5D87FF]' : 'bg-[#F8FAFC] border border-slate-200 hover:border-[#5D87FF]/40'}`}>
                            <label className="flex items-center gap-2.5 sm:gap-3 cursor-pointer">
                              <input type="checkbox" checked={isSelected} onChange={() => onTeamChange(member)} className="h-4 w-4 text-[#5D87FF] rounded border-slate-300 focus:ring-[#5D87FF]/40 flex-shrink-0" />
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-[#5D87FF]">
                                {member.avatarUrl ? <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" /> : member.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-xs sm:text-sm font-bold text-[#2A3547] truncate">{member.name}</p>
                                {isSelected && <p className="text-[10px] text-[#5A6A85] mt-0.5">Fee standar: {formatCurrency(member.standardFee)}</p>}
                              </div>
                            </label>
                            {isSelected && (
                              <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                                <div>
                                  <label className={labelCls}>Biaya per Acara</label>
                                  <input type="number" value={assignedMember!.fee} onChange={e => onTeamFeeChange(member.id, Number(e.target.value))} disabled={isPaid} className={`${inputCls} text-right font-mono ${isPaid ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="0" />
                                  {isPaid && <p className="text-[10px] text-amber-600 mt-1">Sudah dibayar — tidak dapat diubah</p>}
                                </div>
                                <div>
                                  <label className={labelCls}>Keterangan Tugas</label>
                                  <input type="text" value={assignedMember!.subJob || ''} onChange={e => onTeamSubJobChange(member.id, e.target.value)} className={inputCls} placeholder="Contoh: Leader, Drone Operator..." />
                                </div>
                                <div>
                                  <label className={labelCls}>Ganti Personil / Freelance</label>
                                  <select value="" onChange={e => { const m = teamMembers.find(tm => tm.id === e.target.value); if (m) onReplaceTeamMember(member.id, m); }} className={`${inputCls} cursor-pointer`}>
                                    <option value="">— Tetap {member.name} (atau pilih pengganti) —</option>
                                    {teamMembers.filter(tm => tm.id !== member.id).map(tm => (
                                      <option key={tm.id} value={tm.id}>Ganti ke: {tm.name} ({tm.role || 'Tim'})</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Action Bar ─────────────────────────────────────────── */}
      {/* z-50: di atas konten modal (overflow-y scroll), di bawah overlay (z-60) */}
      <div className="sticky bottom-0 left-0 right-0 z-50 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <p className="flex-1 text-xs text-[#5A6A85] hidden sm:block truncate">
          <span className="font-bold text-amber-600">Mode Edit Aktif</span> — Perubahan belum disimpan
        </p>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#5A6A85] text-xs sm:text-sm font-bold hover:text-[#2A3547] transition-all active:scale-95 disabled:opacity-50"
        >
          <XIcon className="w-4 h-4" />
          Batal
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#5D87FF] text-white text-xs sm:text-sm font-bold hover:bg-[#4570EA] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-[#5D87FF]/25"
        >
          {isSaving ? (
            <>
              <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              <SaveIcon className="w-4 h-4 flex-shrink-0" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  );
};
