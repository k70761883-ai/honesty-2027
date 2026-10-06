import React, { useMemo, useState } from 'react';
import { Client, Lead, Project, ClientStatus, ContactChannel, ClientFeedback, SatisfactionLevel, LeadStatus, ViewType } from '../../../types';
import PageHeader from '../../../layouts/PageHeader';
import Modal from '../../../shared/ui/Modal';
import { ModernStatCard } from '../../../components/modernize/ModernStatCard';
import DonutChart from '../../../shared/ui/DonutChart';
import { AnalyticsChartCard } from '../../../shared/ui/AnalyticsChartCard';
import { MobileCollapsibleSection } from '../../../components/ui/MobileProgressiveDisclosure';
import ClientDistributionChart from './ClientDistributionChart';
import {
    UsersIcon, TargetIcon, TrendingUpIcon, DollarSignIcon,
    PlusIcon, Share2Icon, StarIcon, SmileIcon, ThumbsUpIcon,
    MehIcon, FrownIcon, EyeIcon, ChevronRightIcon,
    CheckCircleIcon, Trash2Icon, CalendarIcon, DownloadIcon,
    ArrowUpIcon, ArrowDownIcon,
} from '../../../constants';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

// Helper function to extract city name from address
const extractCityFromAddress = (address: string): string => {
    if (!address || !address.trim()) return 'Tidak Diketahui';

    const addr = address.trim();

    // Try to match patterns like "Kota Jakarta", "Kabupaten Bandung", etc.
    const cityPattern = addr.match(/(?:kota|kabupaten)\s+([a-zA-Z\s]+)/i);
    if (cityPattern && cityPattern[1]) {
        return cityPattern[1].trim();
    }

    // Split by comma and get the most meaningful part
    const parts = addr.split(',').map(p => p.trim()).filter(p => p.length > 0);

    if (parts.length === 0) return 'Tidak Diketahui';

    // Common location keywords to filter out
    const locationKeywords = [
        'jalan', 'jl', 'jln', 'no', 'nomor', 'rt', 'rw', 'kecamatan', 'kec',
        'kelurahan', 'kel', 'desa', 'provinsi', 'prov', 'daerah khusus', 'ibukota',
        'khusus', 'dki', 'dk'
    ];

    // Filter out keywords and short parts
    const meaningfulParts = parts.filter(p => {
        const lowerP = p.toLowerCase();
        // Skip if it's a keyword
        if (locationKeywords.some(kw => lowerP.includes(kw))) return false;
        // Skip if it's just a number
        if (/^\d+$/.test(p)) return false;
        // Skip if too short
        if (p.length < 3) return false;
        // Skip if it looks like a house number pattern
        if (/^\d+[a-zA-Z]?$/.test(p)) return false;
        return true;
    });

    // If we have meaningful parts, take the last one (usually city is at the end)
    if (meaningfulParts.length > 0) {
        const city = meaningfulParts[meaningfulParts.length - 1];
        // Capitalize first letter of each word
        return city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    // Fallback: return the last part
    const lastPart = parts[parts.length - 1];
    return lastPart.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const StarRatingDisplay: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'md' }) => {
    const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <StarIcon key={star} className={`${sz} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
            ))}
        </div>
    );
};

const TrendIndicator: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const colorClass = isPositive ? 'text-emerald-400' : 'text-red-400';
    const bgColor = isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';

    // Cap extreme values for better readability
    const displayValue = Math.abs(value) > 999 ? 999 : Math.abs(value);
    const displayText = displayValue >= 999 ? '999+' : displayValue.toFixed(1);

    return (
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${bgColor} ${colorClass} text-xs font-medium`}>
            <Icon className="w-3 h-3" />
            <span>{displayText}%{suffix}</span>
        </div>
    );
};

const emptyFeedbackForm = { clientName: '', rating: 5, feedback: '' };

interface ClientReportsProps {
    clients: Client[];
    leads: Lead[];
    projects: Project[];
    feedback: ClientFeedback[];
    setFeedback: React.Dispatch<React.SetStateAction<ClientFeedback[]>>;
    showNotification: (message: string) => void;
    handleNavigation?: (view: ViewType, action?: any) => void;
}

const SatisfactionBadge: React.FC<{ satisfaction: SatisfactionLevel }> = ({ satisfaction }) => {
    const config: Record<SatisfactionLevel, { cls: string; icon: React.ReactNode }> = {
        [SatisfactionLevel.VERY_SATISFIED]: { cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: <SmileIcon className="w-3 h-3" /> },
        [SatisfactionLevel.SATISFIED]: { cls: 'bg-sky-500/20 text-sky-400 border-sky-500/30', icon: <ThumbsUpIcon className="w-3 h-3" /> },
        [SatisfactionLevel.NEUTRAL]: { cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: <MehIcon className="w-3 h-3" /> },
        [SatisfactionLevel.UNSATISFIED]: { cls: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <FrownIcon className="w-3 h-3" /> },
    };
    const { cls, icon } = config[satisfaction] || { cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: null };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${cls}`}>
            {icon} {satisfaction}
        </span>
    );
};

const ClientReports: React.FC<ClientReportsProps> = ({ clients, leads, projects, feedback, setFeedback, showNotification, handleNavigation }) => {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [manualFeedbackForm, setManualFeedbackForm] = useState(emptyFeedbackForm);
    const [activeStatModal, setActiveStatModal] = useState<'total' | 'active' | 'very-satisfied' | 'satisfied' | 'neutral' | 'unsatisfied' | null>(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'date' | 'value' | 'status'>('date');
    const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');

    const applyDateFilter = <T extends { date?: string; since?: string }>(items: T[], dateKey: 'date' | 'since') => {
        if (!dateFrom && !dateTo) return items;
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        if (from) from.setHours(0, 0, 0, 0);
        if (to) to.setHours(23, 59, 59, 999);
        return items.filter(item => {
            const d = new Date((item as any)[dateKey]);
            return (!from || d >= from) && (!to || d <= to);
        });
    };

    // Reset page when date filter changes
    const handleDateChange = (from: string, to: string) => {
        setDateFrom(from);
        setDateTo(to);
        setCurrentPage(1);
    };

    const filteredLeads = useMemo(() => applyDateFilter(leads, 'date'), [leads, dateFrom, dateTo]);
    const filteredClients = useMemo(() => applyDateFilter(clients as any[], 'since') as Client[], [clients, dateFrom, dateTo]);
    const filteredProjects = useMemo(() => applyDateFilter(projects, 'date'), [projects, dateFrom, dateTo]);
    const filteredFeedback = useMemo(() => applyDateFilter(feedback, 'date'), [feedback, dateFrom, dateTo]);

    // Search and sort logic
    const searchedAndSortedClients = useMemo(() => {
        let result = [...filteredClients];

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(client => client.status === statusFilter);
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(client =>
                client.name.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query)
            );
        }

        // Apply sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'date':
                    return new Date(b.since).getTime() - new Date(a.since).getTime();
                case 'value':
                    const aValue = filteredProjects.filter(p => p.clientId === a.id).reduce((sum, p) => sum + p.totalCost, 0);
                    const bValue = filteredProjects.filter(p => p.clientId === b.id).reduce((sum, p) => sum + p.totalCost, 0);
                    return bValue - aValue;
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        return result;
    }, [filteredClients, searchQuery, sortBy, statusFilter, filteredProjects]);

    const totalPages = Math.ceil(searchedAndSortedClients.length / itemsPerPage);

    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return searchedAndSortedClients.slice(startIndex, startIndex + itemsPerPage);
    }, [searchedAndSortedClients, currentPage, itemsPerPage]);

    const kpiData = useMemo(() => {
        // Use filtered data consistently across all components
        const totalLeads = filteredLeads.length;
        const convertedLeads = filteredLeads.filter(l => l.status === LeadStatus.CONVERTED).length;
        const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

        // Calculate revenue only from projects that belong to filtered clients
        const filteredClientIds = new Set(filteredClients.map(c => c.id));
        const clientProjects = filteredProjects.filter(p => filteredClientIds.has(p.clientId));
        const totalRevenue = clientProjects.reduce((sum, p) => sum + p.totalCost, 0);

        // Calculate average revenue only for clients with projects
        const clientsWithProjects = new Set(clientProjects.map(p => p.clientId));
        const clientsWithRevenueCount = clientsWithProjects.size;
        const avgRevenuePerClient = clientsWithRevenueCount > 0 ? totalRevenue / clientsWithRevenueCount : 0;

        // Calculate trends (compare with previous period)
        const previousMonth = new Date();
        previousMonth.setMonth(previousMonth.getMonth() - 1);

        const previousClients = clients.filter(c => {
            const clientDate = new Date(c.since);
            return clientDate.getMonth() === previousMonth.getMonth() && clientDate.getFullYear() === previousMonth.getFullYear();
        }).length;

        // Calculate total trend with edge case handling
        let totalTrend = 0;
        if (previousClients > 0) {
            totalTrend = ((filteredClients.length - previousClients) / previousClients) * 100;
        } else if (filteredClients.length > 0) {
            // If previous was 0 but current has data, show as positive growth
            totalTrend = 100;
        }

        const previousProjects = projects.filter(p => {
            const projectDate = new Date(p.date);
            return projectDate.getMonth() === previousMonth.getMonth() && projectDate.getFullYear() === previousMonth.getFullYear();
        });

        const previousRevenue = previousProjects.reduce((sum, p) => sum + p.totalCost, 0);

        // Calculate revenue trend with edge case handling
        let revenueTrend = 0;
        if (previousRevenue > 0) {
            revenueTrend = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
        } else if (totalRevenue > 0) {
            // If previous was 0 but current has revenue, show as positive growth
            revenueTrend = 100;
        }

        // Charts use filteredLeads
        const sourceColors: { [key in ContactChannel]?: string } = {
            [ContactChannel.INSTAGRAM]: '#c13584',
            [ContactChannel.WHATSAPP]: '#25D366',
            [ContactChannel.WEBSITE]: '#3b82f6',
            [ContactChannel.REFERRAL]: '#f59e0b',
            [ContactChannel.PHONE]: '#8b5cf6',
            [ContactChannel.SUGGESTION_FORM]: '#14b8a6',
            [ContactChannel.OTHER]: '#64748b',
        };
        const leadSourceDistribution = filteredLeads.reduce((acc, lead) => {
            acc[lead.contactChannel] = (acc[lead.contactChannel] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const leadSourceDonutData = Object.entries(leadSourceDistribution)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .map(([label, value]) => ({ label, value, color: sourceColors[label as ContactChannel] || '#64748b' }));

        return {
            totalClients: filteredClients.length,
            activeClients: filteredClients.filter(c => c.status === ClientStatus.ACTIVE).length,
            conversionRate: conversionRate.toFixed(1) + '%',
            avgRevenuePerClient: formatCurrency(avgRevenuePerClient),
            leadSourceDonutData,
            totalTrend,
            revenueTrend,
        };
    }, [filteredClients, filteredLeads, filteredProjects, clients, projects]);

    const feedbackBySatisfaction = useMemo(() => {
        return feedback.reduce((acc, item) => {
            if (!acc[item.satisfaction]) acc[item.satisfaction] = [];
            acc[item.satisfaction].push(item);
            return acc;
        }, {} as Record<SatisfactionLevel, ClientFeedback[]>);
    }, [feedback]);

    const satisfactionCounts = useMemo(() => ({
        [SatisfactionLevel.VERY_SATISFIED]: (feedbackBySatisfaction[SatisfactionLevel.VERY_SATISFIED] || []).length,
        [SatisfactionLevel.SATISFIED]: (feedbackBySatisfaction[SatisfactionLevel.SATISFIED] || []).length,
        [SatisfactionLevel.NEUTRAL]: (feedbackBySatisfaction[SatisfactionLevel.NEUTRAL] || []).length,
        [SatisfactionLevel.UNSATISFIED]: (feedbackBySatisfaction[SatisfactionLevel.UNSATISFIED] || []).length,
    }), [feedbackBySatisfaction]);

    const totalFeedback = Object.values(satisfactionCounts).reduce((a, b) => a + b, 0);
    const avgRating = useMemo(() => {
        if (filteredFeedback.length === 0) return 0;
        return filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / filteredFeedback.length;
    }, [filteredFeedback]);

    const actionRecommendations = useMemo(() => {
        const recs = [];
        if (satisfactionCounts[SatisfactionLevel.UNSATISFIED] > 0) recs.push({ id: 'follow-up', icon: <FrownIcon className="w-5 h-5 text-red-400" />, bg: 'bg-red-500/10 border-red-500/20', title: 'Tindak Lanjuti Testimoni Negatif', text: `${satisfactionCounts[SatisfactionLevel.UNSATISFIED]} pengantin tidak puas. Segera hubungi mereka.` });
        if (satisfactionCounts[SatisfactionLevel.VERY_SATISFIED] > 2) recs.push({ id: 'testimonials', icon: <SmileIcon className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Manfaatkan Testimoni Positif', text: 'Banyak ulasan sangat puas. Minta izin untuk dipublikasikan di sosial media.' });
        if (satisfactionCounts[SatisfactionLevel.NEUTRAL] > 0) recs.push({ id: 'analyze', icon: <MehIcon className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/10 border-amber-500/20', title: 'Analisis Masukan Netral', text: 'Pelajari masukan netral untuk menemukan area yang bisa ditingkatkan.' });
        return recs;
    }, [satisfactionCounts]);

    const regionDonutData = useMemo(() => {
        const palette = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e', '#a855f7', '#14b8a6'];
        // Use clients instead of leads for region distribution, extract city name
        const distribution = filteredClients.reduce((acc, c) => {
            const city = extractCityFromAddress(c.address || '');
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(distribution).sort(([, a], [, b]) => Number(b) - Number(a)).map(([label, value], idx) => ({ label, value, color: palette[idx % palette.length] }));
    }, [filteredClients]);

    const regionDistributionData = useMemo(() => {
        const distribution = filteredClients.reduce((acc, c) => {
            const city = extractCityFromAddress(c.address || '');
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalCount = Object.values(distribution).reduce((sum, count) => sum + count, 0);

        return Object.entries(distribution)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .map(([name, count]) => ({
                name,
                count,
                percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
            }));
    }, [filteredClients]);

    const leadStatusCounts = useMemo(() => ({
        discussion: filteredLeads.filter(l => l.status === LeadStatus.DISCUSSION).length,
        followUp: filteredLeads.filter(l => l.status === LeadStatus.FOLLOW_UP).length,
        converted: filteredLeads.filter(l => l.status === LeadStatus.CONVERTED).length,
        rejected: filteredLeads.filter(l => l.status === LeadStatus.REJECTED).length,
    }), [filteredLeads]);

    const activeClientsList = useMemo(() => clients.filter(c => c.status === ClientStatus.ACTIVE), [clients]);

    // Client growth trend data (last 6 months)
    const clientGrowthData = useMemo(() => {
        const months = [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

        // Use all clients (not filtered) for growth trend to show historical data
        const allClientsForGrowth = clients;

        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1);
            const monthName = monthNames[date.getMonth()];
            const year = date.getFullYear();
            const monthIndex = date.getMonth();

            const clientsInMonth = allClientsForGrowth.filter(c => {
                const clientDate = new Date(c.since);
                return clientDate.getMonth() === monthIndex && clientDate.getFullYear() === year;
            }).length;

            months.push({ name: `${monthName} ${year}`, count: clientsInMonth });
        }

        return months;
    }, [clients]);

    // Client status distribution
    const clientStatusDistribution = useMemo(() => {
        const distribution = filteredClients.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {} as Record<ClientStatus, number>);

        const statusColors: Record<ClientStatus, string> = {
            [ClientStatus.ACTIVE]: '#10b981',
            [ClientStatus.INACTIVE]: '#64748b',
            [ClientStatus.LEAD]: '#3b82f6',
            [ClientStatus.LOST]: '#ef4444',
        };

        return Object.entries(distribution).map(([label, value]) => ({
            label,
            value,
            color: statusColors[label as ClientStatus] || '#9ca3af',
        }));
    }, [filteredClients]);

    // Top 10 clients by total value
    const topClientsByValue = useMemo(() => {
        const clientValues = filteredClients.map(client => ({
            ...client,
            totalValue: filteredProjects.filter(p => p.clientId === client.id).reduce((sum, p) => sum + p.totalCost, 0),
        }));

        return clientValues
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, 10);
    }, [filteredClients, filteredProjects]);

    // Export functionality
    const handleExportToCSV = () => {
        const headers = ['Nama', 'Email', 'Telepon', 'Status', 'Terdaftar', 'Total Nilai'];
        const rows = filteredClients.map(client => {
            const totalValue = filteredProjects.filter(p => p.clientId === client.id).reduce((sum, p) => sum + p.totalCost, 0);
            return [
                client.name,
                client.email,
                client.phone,
                client.status,
                new Date(client.since).toLocaleDateString('id-ID'),
                formatCurrency(totalValue),
            ];
        });

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `laporan-pengantin-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        showNotification('Laporan berhasil diexport ke CSV');
    };

    const feedbackFormUrl = useMemo(() => `${window.location.origin}${window.location.pathname}#/feedback`, []);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(feedbackFormUrl).then(() => { showNotification('Tautan berhasil disalin!'); setIsShareModalOpen(false); }, () => alert('Gagal menyalin tautan.'));
    };

    const handleManualFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setManualFeedbackForm(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
    };

    const getSatisfactionFromRating = (rating: number): SatisfactionLevel => {
        if (rating >= 5) return SatisfactionLevel.VERY_SATISFIED;
        if (rating >= 4) return SatisfactionLevel.SATISFIED;
        if (rating >= 3) return SatisfactionLevel.NEUTRAL;
        return SatisfactionLevel.UNSATISFIED;
    };

    const handleManualFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFeedback: ClientFeedback = {
            id: crypto.randomUUID(), date: new Date().toISOString(),
            clientName: manualFeedbackForm.clientName, rating: manualFeedbackForm.rating,
            satisfaction: getSatisfactionFromRating(manualFeedbackForm.rating),
            feedback: manualFeedbackForm.feedback,
        };
        setFeedback(prev => [newFeedback, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setIsFeedbackModalOpen(false);
        setManualFeedbackForm(emptyFeedbackForm);
        showNotification('Masukan berhasil ditambahkan.');
    };

    const modalTitles: Record<string, string> = {
        total: 'Daftar Semua Pengantin', active: 'Daftar Pengantin Aktif',
        'very-satisfied': 'Masukan: Sangat Puas', satisfied: 'Masukan: Puas',
        neutral: 'Masukan: Biasa Saja', unsatisfied: 'Masukan: Tidak Puas',
    };

    let modalContent: React.ReactNode = null;
    if (activeStatModal) {
        if (activeStatModal === 'total' || activeStatModal === 'active') {
            const list = activeStatModal === 'total' ? clients : activeClientsList;
            modalContent = (
                <div className="space-y-2">
                    {list.length > 0 ? list.map(client => (
                        <div key={client.id} className="p-3 bg-brand-bg rounded-xl flex justify-between items-center border border-brand-border/50 hover:border-brand-border transition-colors">
                            <div>
                                <p className="font-semibold text-brand-text-light">{client.name}</p>
                                <p className="text-xs text-brand-text-secondary mt-0.5">{client.email}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${client.status === ClientStatus.ACTIVE ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>{client.status}</span>
                        </div>
                    )) : <p className="text-center text-brand-text-secondary py-10">Tidak ada pengantin dalam periode ini.</p>}
                </div>
            );
        } else {
            const lvl = activeStatModal === 'very-satisfied' ? SatisfactionLevel.VERY_SATISFIED : activeStatModal === 'satisfied' ? SatisfactionLevel.SATISFIED : activeStatModal === 'neutral' ? SatisfactionLevel.NEUTRAL : SatisfactionLevel.UNSATISFIED;
            const list = feedbackBySatisfaction[lvl] || [];
            modalContent = (
                <div className="space-y-3">
                    {list.length > 0 ? list.map(fb => (
                        <div key={fb.id} className="p-3 bg-brand-bg rounded-xl border border-brand-border/50">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold text-brand-text-light">{fb.clientName}</p>
                                <StarRatingDisplay rating={fb.rating} size="sm" />
                            </div>
                            <p className="text-sm text-brand-text-primary italic">"{fb.feedback}"</p>
                            <p className="text-right text-xs text-brand-text-secondary mt-2">{new Date(fb.date).toLocaleDateString('id-ID')}</p>
                        </div>
                    )) : <p className="text-center text-brand-text-secondary py-10">Tidak ada masukan dalam kategori ini.</p>}
                </div>
            );
        }
    }

    const satisfactionConfig = [
        { key: 'very-satisfied' as const, level: SatisfactionLevel.VERY_SATISFIED, label: 'Sangat Puas', icon: <SmileIcon className="w-5 h-5" />, colorVariant: 'green' as const, barColor: 'bg-emerald-500', count: satisfactionCounts[SatisfactionLevel.VERY_SATISFIED] },
        { key: 'satisfied' as const, level: SatisfactionLevel.SATISFIED, label: 'Puas', icon: <ThumbsUpIcon className="w-5 h-5" />, colorVariant: 'blue' as const, barColor: 'bg-sky-500', count: satisfactionCounts[SatisfactionLevel.SATISFIED] },
        { key: 'neutral' as const, level: SatisfactionLevel.NEUTRAL, label: 'Biasa Saja', icon: <MehIcon className="w-5 h-5" />, colorVariant: 'orange' as const, barColor: 'bg-amber-500', count: satisfactionCounts[SatisfactionLevel.NEUTRAL] },
        { key: 'unsatisfied' as const, level: SatisfactionLevel.UNSATISFIED, label: 'Tidak Puas', icon: <FrownIcon className="w-5 h-5" />, colorVariant: 'red' as const, barColor: 'bg-red-500', count: satisfactionCounts[SatisfactionLevel.UNSATISFIED] },
    ];

    const leadStatusConfig = [
        { label: 'Sedang Diskusi', count: leadStatusCounts.discussion, color: '#3b82f6', bg: 'bg-blue-500/15', border: 'border-blue-500/25', text: 'text-blue-400', icon: <EyeIcon className="w-4 h-4" /> },
        { label: 'Follow Up', count: leadStatusCounts.followUp, color: '#8b5cf6', bg: 'bg-violet-500/15', border: 'border-violet-500/25', text: 'text-violet-400', icon: <ChevronRightIcon className="w-4 h-4" /> },
        { label: 'Dikonversi', count: leadStatusCounts.converted, color: '#10b981', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', text: 'text-emerald-400', icon: <CheckCircleIcon className="w-4 h-4" /> },
        { label: 'Ditolak', count: leadStatusCounts.rejected, color: '#ef4444', bg: 'bg-red-500/15', border: 'border-red-500/25', text: 'text-red-400', icon: <Trash2Icon className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* ── Page Header ── */}
            <PageHeader
                title="Laporan Pengantin"
                subtitle="Analisis terpusat untuk performa akuisisi, konversi, dan kepuasan pengantin Anda."
            />

            {/* ── Date Filter ── */}
            <MobileCollapsibleSection
                title="Filter Periode Laporan"
                subtitle={dateFrom || dateTo ? `${dateFrom || '...'} s/d ${dateTo || '...'}` : 'Semua periode waktu'}
                badge={dateFrom || dateTo ? 'Aktif' : 'Semua'}
            >
                <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-brand-text-secondary shrink-0">
                        <CalendarIcon className="w-4 h-4 text-brand-accent" />
                        Filter Periode
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input type="date" value={dateFrom} onChange={e => handleDateChange(e.target.value, dateTo)} className="input-field !rounded-xl !border !bg-brand-bg p-2.5 text-sm flex-1 sm:flex-none" />
                        <span className="text-brand-text-secondary text-sm font-medium">–</span>
                        <input type="date" value={dateTo} onChange={e => handleDateChange(dateFrom, e.target.value)} className="input-field !rounded-xl !border !bg-brand-bg p-2.5 text-sm flex-1 sm:flex-none" />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {(dateFrom || dateTo) && (
                            <button onClick={() => { handleDateChange('', ''); }} className="button-secondary text-xs px-3 py-1.5 shrink-0">
                                Reset Filter
                            </button>
                        )}
                        <button onClick={handleExportToCSV} className="button-primary text-xs px-3 py-1.5 shrink-0 inline-flex items-center gap-1.5">
                            <DownloadIcon className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>
                </div>
            </MobileCollapsibleSection>

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="widget-animate cursor-pointer flex flex-col" style={{ animationDelay: '50ms' }} onClick={() => setActiveStatModal('total')}>
                    <ModernStatCard icon={<UsersIcon className="w-5 h-5" />} title="Total Pengantin" value={kpiData.totalClients.toString()} iconColorVariant="primary" subtitle="Klik untuk lihat daftar" />
                    <div className="mt-2 flex items-center justify-center">
                        <TrendIndicator value={kpiData.totalTrend} suffix=" vs bln lalu" />
                    </div>
                </div>
                <div className="widget-animate cursor-pointer" style={{ animationDelay: '100ms' }} onClick={() => setActiveStatModal('active')}>
                    <ModernStatCard icon={<TrendingUpIcon className="w-5 h-5" />} title="Pengantin Aktif" value={kpiData.activeClients.toString()} iconColorVariant="success" subtitle="Klik untuk lihat daftar" />
                </div>
                <div className="widget-animate" style={{ animationDelay: '150ms' }}>
                    <ModernStatCard icon={<TargetIcon className="w-5 h-5" />} title="Tingkat Konversi" value={kpiData.conversionRate} iconColorVariant="warning" subtitle="Calon → Pengantin" />
                </div>
                <div className="widget-animate flex flex-col" style={{ animationDelay: '200ms' }}>
                    <ModernStatCard icon={<DollarSignIcon className="w-5 h-5" />} title="Rata-rata Nilai / Pengantin" value={kpiData.avgRevenuePerClient} iconColorVariant="primary" subtitle="Rata-rata" />
                    <div className="mt-2 flex items-center justify-center">
                        <TrendIndicator value={kpiData.revenueTrend} suffix=" vs bln lalu" />
                    </div>
                </div>
            </div>

            {/* ── Client Growth Trend Chart ── */}
            <MobileCollapsibleSection
                title="Tren Pertumbuhan Pengantin"
                subtitle="6 bulan terakhir"
                badge="Grafik"
                defaultOpen={true}
            >
                <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 widget-animate" style={{ animationDelay: '230ms' }}>
                    <AnalyticsChartCard
                        title="Pertumbuhan Pengantin per Bulan"
                        description="Jumlah pengantin baru tiap bulan"
                        className="bg-transparent border-0 p-0"
                        headerClassName="mb-4"
                        bodyClassName="flex flex-col gap-4"
                    >
                        <div className="h-64 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-brand-text-secondary pr-2">
                                {clientGrowthData.map((_, i) => (
                                    <span key={i}>{i}</span>
                                ))}
                            </div>

                            {/* Chart area */}
                            <div className="ml-8 h-full flex items-end gap-4 pb-6 border-l border-b border-brand-border/30">
                                {clientGrowthData.map((data, index) => {
                                    const maxValue = Math.max(...clientGrowthData.map(d => d.count), 1);
                                    const height = maxValue > 0 ? (data.count / maxValue) * 100 : 0;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div className="w-full bg-brand-bg rounded-t-lg relative" style={{ height: '100%' }}>
                                                <div
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-brand-accent to-brand-accent/80 rounded-t-lg transition-all duration-500 group-hover:from-brand-accent/90 group-hover:to-brand-accent/70"
                                                    style={{ height: `${height}%` }}
                                                />
                                                {/* Tooltip */}
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-text-light text-brand-bg text-[10px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {data.count} pengantin
                                                </div>
                                            </div>
                                            <span className="text-xs text-brand-text-secondary font-medium">{data.count}</span>
                                            <span className="text-[10px] text-brand-text-secondary text-center leading-tight truncate w-full">{data.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </AnalyticsChartCard>
                </div>
            </MobileCollapsibleSection>

            {/* ── Charts Row ── */}
            <MobileCollapsibleSection
                title="Grafik Distribusi Wilayah & Sumber Leads"
                subtitle={`${filteredClients.length} pengantin, ${filteredLeads.length} calon pengantin dianalisis`}
                badge="2 Grafik"
                defaultOpen={true}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 widget-animate" style={{ animationDelay: '250ms' }}>
                    <ClientDistributionChart data={regionDistributionData} />

                    <AnalyticsChartCard
                        title="Sumber Calon Pengantin"
                        description="Channel yang membawa leads terbanyak"
                        className="bg-brand-surface rounded-2xl border border-brand-border p-5"
                        headerClassName="mb-4"
                        bodyClassName="flex flex-col gap-4"
                    >
                        <DonutChart data={kpiData.leadSourceDonutData} />
                        <div className="pt-2 border-t border-brand-border">
                            <div className="flex items-center justify-between text-xs text-brand-text-secondary">
                                <span>Total Calon Pengantin</span>
                                <span className="font-semibold text-brand-text-light">{filteredLeads.length}</span>
                            </div>
                        </div>
                    </AnalyticsChartCard>
                </div>
            </MobileCollapsibleSection>

            {/* ── Lead Status & Client Status Section (Combined) ── */}
            <MobileCollapsibleSection
                title="Status: Calon Pengantin & Pengantin"
                subtitle={`${filteredLeads.length} calon, ${filteredClients.length} pengantin`}
                badge="Status"
                defaultOpen={false}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 widget-animate" style={{ animationDelay: '280ms' }}>
                    {/* Lead Status */}
                    <div className="bg-brand-surface rounded-2xl border border-brand-border p-5">
                        <h4 className="text-sm font-bold text-brand-text-light mb-4">Status Calon Pengantin</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {leadStatusConfig.map(s => (
                                <div key={s.label} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${s.bg} ${s.border}`}>
                                    <span className={`text-xl font-bold ${s.text} mb-1`}>{s.count}</span>
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${s.text}`}>
                                        {s.icon} {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Client Status */}
                    <div className="bg-brand-surface rounded-2xl border border-brand-border p-5">
                        <h4 className="text-sm font-bold text-brand-text-light mb-4">Distribusi Status Pengantin</h4>
                        <AnalyticsChartCard
                            title=""
                            description=""
                            className="bg-transparent border-0 p-0"
                            headerClassName="mb-0"
                            bodyClassName="flex flex-col gap-4"
                        >
                            <DonutChart data={clientStatusDistribution} />
                        </AnalyticsChartCard>
                    </div>
                </div>
            </MobileCollapsibleSection>

            {/* ── Top 10 Clients by Value ── */}
            <MobileCollapsibleSection
                title="Top 10 Pengantin dengan Nilai Tertinggi"
                subtitle="Pengantin dengan total nilai acara terbesar"
                badge="Ranking"
                defaultOpen={false}
            >
                <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 widget-animate" style={{ animationDelay: '330ms' }}>
                    <div className="space-y-2">
                        {topClientsByValue.map((client, index) => (
                            <div key={client.id} className="flex items-center justify-between p-3 bg-brand-bg rounded-xl border border-brand-border/40 hover:border-brand-border transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-brand-accent text-white' : 'bg-brand-input text-brand-text-secondary'}`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-brand-text-light">{client.name}</p>
                                        <p className="text-xs text-brand-text-secondary">{client.email}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-brand-accent">{formatCurrency(client.totalValue)}</span>
                            </div>
                        ))}
                        {topClientsByValue.length === 0 && (
                            <p className="text-center text-brand-text-secondary py-8">Tidak ada data pengantin dengan nilai acara.</p>
                        )}
                    </div>
                </div>
            </MobileCollapsibleSection>

            {/* ── Recent Clients List ── */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 widget-animate" style={{ animationDelay: '350ms' }}>
                <div className="flex flex-col gap-4 mb-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h4 className="text-base font-bold text-gradient">Daftar Semua Pengantin</h4>
                            <p className="text-xs text-brand-text-secondary mt-0.5">{searchedAndSortedClients.length} pengantin ditampilkan</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-accent/15 text-brand-accent border border-brand-accent/25">
                                {searchedAndSortedClients.length} total
                            </span>
                            {handleNavigation && (
                                <button
                                    onClick={() => handleNavigation(ViewType.CLIENTS)}
                                    className="button-secondary text-xs px-3 py-1.5"
                                >
                                    Lihat Detail
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Controls: Search, Sort, View Toggle */}
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full min-w-[180px] input-field !rounded-xl !border !bg-brand-bg p-2.5 pl-10 text-sm"
                            />
                            <svg className="w-4 h-4 text-brand-text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                            className="input-field !rounded-xl !border !bg-brand-bg p-2.5 text-sm"
                        >
                            <option value="date">Urut: Terbaru</option>
                            <option value="name">Urut: Nama A-Z</option>
                            <option value="value">Urut: Nilai Tertinggi</option>
                            <option value="status">Urut: Status</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value as ClientStatus | 'all'); setCurrentPage(1); }}
                            aria-label="Filter berdasarkan status"
                            className="input-field !rounded-xl !border !bg-brand-bg p-2.5 text-sm"
                        >
                            <option value="all">Semua Status</option>
                            {Object.values(ClientStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        {/* View Toggle */}
                        <div className="flex items-center border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
                            <button
                                onClick={() => setViewMode('card')}
                                className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === 'card' ? 'bg-brand-accent text-white' : 'text-brand-text-secondary hover:bg-brand-input'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === 'table' ? 'bg-brand-accent text-white' : 'text-brand-text-secondary hover:bg-brand-input'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card Grid View */}
                {viewMode === 'card' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {paginatedClients.map(client => {
                            const totalValue = filteredProjects.filter(p => p.clientId === client.id).reduce((sum, p) => sum + p.totalCost, 0);
                            const statusColors: Record<ClientStatus, string> = {
                                [ClientStatus.ACTIVE]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                                [ClientStatus.INACTIVE]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                                [ClientStatus.LEAD]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                                [ClientStatus.LOST]: 'bg-red-500/20 text-red-400 border-red-500/30',
                            };

                            return (
                                <div key={client.id} className="bg-brand-bg rounded-xl border border-brand-border/40 p-4 hover:border-brand-border transition-all hover:shadow-lg group">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-sm text-brand-text-light truncate group-hover:text-brand-accent transition-colors">
                                                {client.name}
                                            </h5>
                                            <p className="text-xs text-brand-text-secondary truncate mt-0.5">{client.email}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${statusColors[client.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                            {client.status}
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-text-secondary">Terdaftar</span>
                                            <span className="text-brand-text-primary font-medium">{new Date(client.since).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-text-secondary">Total Nilai</span>
                                            <span className="font-bold text-brand-accent">{formatCurrency(totalValue)}</span>
                                        </div>
                                    </div>

                                    {/* Hover Action */}
                                    <div className="mt-3 pt-3 border-t border-brand-border/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-full text-xs font-medium text-brand-accent hover:text-brand-accent/80 transition-colors">
                                            Lihat Detail →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                    <div className="overflow-x-auto rounded-xl border border-brand-border/50 max-h-[600px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-brand-surface z-10">
                                <tr className="bg-brand-bg/80">
                                    <th className="p-3 text-center font-semibold text-brand-text-secondary w-12 text-xs">#</th>
                                    <th className="p-3 text-left font-semibold text-brand-text-secondary text-xs">Nama Pengantin</th>
                                    <th className="p-3 text-left font-semibold text-brand-text-secondary text-xs">Email</th>
                                    <th className="p-3 text-left font-semibold text-brand-text-secondary text-xs">Terdaftar</th>
                                    <th className="p-3 text-left font-semibold text-brand-text-secondary text-xs">Status</th>
                                    <th className="p-3 text-right font-semibold text-brand-text-secondary text-xs">Total Nilai</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border/30">
                                {paginatedClients.map((client, index) => {
                                    const totalValue = filteredProjects.filter(p => p.clientId === client.id).reduce((sum, p) => sum + p.totalCost, 0);
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                    const statusColors: Record<ClientStatus, string> = {
                                        [ClientStatus.ACTIVE]: 'bg-emerald-500/20 text-emerald-400',
                                        [ClientStatus.INACTIVE]: 'bg-gray-500/20 text-gray-400',
                                        [ClientStatus.LEAD]: 'bg-blue-500/20 text-blue-400',
                                        [ClientStatus.LOST]: 'bg-red-500/20 text-red-400',
                                    };

                                    return (
                                        <tr key={client.id} className="hover:bg-brand-bg/40 transition-colors">
                                            <td className="p-3 text-center text-brand-text-secondary text-xs font-medium">{globalIndex}</td>
                                            <td className="p-3">
                                                <p className="font-semibold text-brand-text-light">{client.name}</p>
                                            </td>
                                            <td className="p-3 text-brand-text-secondary text-xs">{client.email}</td>
                                            <td className="p-3 text-brand-text-secondary text-sm">{new Date(client.since).toLocaleDateString('id-ID')}</td>
                                            <td className="p-3">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[client.status] || 'bg-gray-500/20 text-gray-400'}`}>{client.status}</span>
                                            </td>
                                            <td className="p-3 text-right font-bold text-brand-text-primary">{formatCurrency(totalValue)}</td>
                                        </tr>
                                    );
                                })}
                                {paginatedClients.length === 0 && (
                                    <tr><td colSpan={6} className="p-8 text-center text-brand-text-secondary text-sm">Tidak ada pengantin yang cocok dengan filter.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border">
                        <div className="text-xs text-brand-text-secondary">
                            Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, searchedAndSortedClients.length)} dari {searchedAndSortedClients.length} pengantin
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-brand-border bg-brand-bg text-brand-text-secondary hover:bg-brand-input disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Sebelumnya
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                                                currentPage === pageNum
                                                    ? 'bg-brand-accent text-white'
                                                    : 'bg-brand-bg text-brand-text-secondary hover:bg-brand-input border border-brand-border'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-brand-border bg-brand-bg text-brand-text-secondary hover:bg-brand-input disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Satisfaction Section ── */}
            <MobileCollapsibleSection
                title="Analisis Kepuasan & Testimoni"
                subtitle={`Rating rata-rata ${avgRating.toFixed(1)}/5 dari ${totalFeedback} ulasan`}
                badge={`★ ${avgRating.toFixed(1)}`}
                defaultOpen={true}
            >
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 widget-animate" style={{ animationDelay: '380ms' }}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                        <h4 className="text-base font-bold text-gradient">Analisis Kepuasan Pengantin</h4>
                        <p className="text-xs text-brand-text-secondary mt-0.5">{totalFeedback} total testimoni dikumpulkan</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => setIsShareModalOpen(true)} className="button-secondary inline-flex items-center gap-1.5 text-sm">
                            <Share2Icon className="w-4 h-4" /> Bagikan Form
                        </button>
                        <button onClick={() => setIsFeedbackModalOpen(true)} className="button-primary inline-flex items-center gap-1.5 text-sm">
                            <PlusIcon className="w-4 h-4" /> Tambah Masukan
                        </button>
                    </div>
                </div>

                {/* Rating Summary + Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                    {/* Big rating display */}
                    <div className="flex flex-col items-center justify-center bg-brand-bg rounded-2xl border border-brand-border/40 p-5">
                        <p className="text-5xl font-black text-brand-text-light mb-1">{avgRating.toFixed(1)}</p>
                        <StarRatingDisplay rating={Math.round(avgRating)} />
                        <p className="text-xs text-brand-text-secondary mt-2">{totalFeedback > 0 ? `Dari ${totalFeedback} testimoni` : 'Belum ada testimoni'}</p>
                    </div>

                    {/* Progress bars */}
                    <div className="lg:col-span-2 flex flex-col justify-center gap-3">
                        {satisfactionConfig.map(s => {
                            const pct = totalFeedback > 0 ? (s.count / totalFeedback) * 100 : 0;
                            return (
                                <button key={s.key} onClick={() => setActiveStatModal(s.key)} className="group text-left focus:outline-none">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 w-32 shrink-0">
                                            <span className="text-brand-text-secondary">{s.icon}</span>
                                            <span className="text-xs font-medium text-brand-text-secondary truncate">{s.label}</span>
                                        </div>
                                        <div className="flex-1 h-2.5 bg-brand-bg rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${s.barColor} group-hover:opacity-80`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-brand-text-light w-8 text-right shrink-0">{s.count}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Stat cards row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {satisfactionConfig.map(s => {
                        const variantMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
                            'green': 'success',
                            'blue': 'primary',
                            'orange': 'warning',
                            'red': 'error'
                        };
                        return (
                            <div key={s.key} className="cursor-pointer" onClick={() => setActiveStatModal(s.key)}>
                                <ModernStatCard icon={s.icon} title={s.label} value={s.count.toString()} iconColorVariant={variantMap[s.colorVariant] || 'primary'} subtitle="Klik untuk detail" />
                            </div>
                        );
                    })}
                </div>

                {/* Bottom: recommendations + feed */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 pt-5 border-t border-brand-border">
                    {/* Recommendations */}
                    <div className="lg:col-span-2">
                        <h5 className="text-sm font-bold text-brand-text-light mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 rounded-full bg-brand-accent inline-block" />
                            Rekomendasi Aksi
                        </h5>
                        <div className="space-y-2">
                            {actionRecommendations.length > 0 ? actionRecommendations.map(rec => (
                                <div key={rec.id} className={`p-3 rounded-xl border ${rec.bg} flex items-start gap-3`}>
                                    <div className="shrink-0 mt-0.5">{rec.icon}</div>
                                    <div>
                                        <p className="text-xs font-semibold text-brand-text-light">{rec.title}</p>
                                        <p className="text-[11px] text-brand-text-secondary mt-0.5 leading-relaxed">{rec.text}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <CheckCircleIcon className="w-8 h-8 text-emerald-400 mb-2" />
                                    <p className="text-sm font-medium text-brand-text-light">Semua baik-baik saja!</p>
                                    <p className="text-xs text-brand-text-secondary mt-1">Tidak ada rekomendasi khusus saat ini.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback feed */}
                    <div className="lg:col-span-3">
                        <h5 className="text-sm font-bold text-brand-text-light mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 rounded-full bg-brand-accent inline-block" />
                            Masukan Terbaru
                        </h5>
                        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                            {filteredFeedback.slice(0, 10).map(item => (
                                <div key={item.id} className="bg-brand-bg rounded-xl border border-brand-border/40 p-3 hover:border-brand-border transition-colors">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-brand-text-light truncate">{item.clientName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <SatisfactionBadge satisfaction={item.satisfaction} />
                                                <StarRatingDisplay rating={item.rating} size="sm" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-brand-text-secondary shrink-0 mt-0.5">
                                            {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <p className="text-xs text-brand-text-secondary leading-relaxed border-t border-brand-border/40 pt-2 mt-1 italic">
                                        "{item.feedback}"
                                    </p>
                                </div>
                            ))}
                            {filteredFeedback.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <StarIcon className="w-8 h-8 text-brand-text-secondary mb-2" />
                                    <p className="text-sm font-medium text-brand-text-light">Belum ada masukan</p>
                                    <p className="text-xs text-brand-text-secondary mt-1">Bagikan form ke pengantin untuk mulai mengumpulkan testimoni.</p>
                                </div>
                            )}
                            {filteredFeedback.length > 10 && (
                                <p className="text-center text-xs text-brand-text-secondary mt-2">Menampilkan 10 dari {filteredFeedback.length} testimoni terbaru</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </MobileCollapsibleSection>

            {/* ── Modals ── */}

            {/* Add Feedback Modal */}
            <Modal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} title="Tambah Masukan Pengantin">
                <form onSubmit={handleManualFeedbackSubmit} className="space-y-4">
                    <div className="input-group">
                        <input type="text" id="clientName" name="clientName" value={manualFeedbackForm.clientName} onChange={handleManualFeedbackChange} className="input-field" placeholder=" " required />
                        <label htmlFor="clientName" className="input-label">Nama Pengantin</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-2">Rating</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button" onClick={() => setManualFeedbackForm(p => ({ ...p, rating: star }))}
                                    className={`p-2 rounded-xl transition-all ${manualFeedbackForm.rating >= star ? 'bg-yellow-400/20 scale-110' : 'bg-brand-input hover:bg-brand-input/80'}`}>
                                    <StarIcon className={`w-6 h-6 transition-colors ${manualFeedbackForm.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} />
                                </button>
                            ))}
                            <span className="text-xs text-brand-text-secondary ml-1">({manualFeedbackForm.rating}/5)</span>
                        </div>
                    </div>
                    <div className="input-group">
                        <textarea id="feedback" name="feedback" value={manualFeedbackForm.feedback} onChange={handleManualFeedbackChange} className="input-field" placeholder=" " required rows={4} />
                        <label htmlFor="feedback" className="input-label">Saran / Masukan</label>
                    </div>
                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-brand-border">
                        <button type="button" onClick={() => setIsFeedbackModalOpen(false)} className="button-secondary">Batal</button>
                        <button type="submit" className="button-primary">Simpan Masukan</button>
                    </div>
                </form>
            </Modal>

            {/* Share Modal */}
            <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Bagikan Formulir Masukan" size="lg">
                <div className="space-y-4">
                    <div className="p-4 bg-brand-accent/10 border border-brand-accent/25 rounded-xl">
                        <div className="flex items-start gap-3">
                            <Share2Icon className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                            <p className="text-sm text-brand-text-secondary leading-relaxed">
                                Bagikan tautan ini kepada pengantin setelah acara selesai. Mereka dapat memberikan peringkat dan masukan yang langsung tampil di dasbor.
                            </p>
                        </div>
                    </div>
                    <div className="input-group">
                        <input type="text" readOnly value={feedbackFormUrl} className="input-field !bg-brand-input cursor-text select-all" />
                        <label className="input-label">Tautan Formulir</label>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setIsShareModalOpen(false)} className="button-secondary">Tutup</button>
                        <button onClick={copyToClipboard} className="button-primary inline-flex items-center gap-2">
                            <Share2Icon className="w-4 h-4" /> Salin Tautan
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Stat detail modal */}
            <Modal isOpen={!!activeStatModal} onClose={() => setActiveStatModal(null)} title={activeStatModal ? (modalTitles[activeStatModal] ?? '') : ''} size="2xl">
                <div className="max-h-[65vh] overflow-y-auto pr-1 custom-scrollbar">
                    {modalContent}
                </div>
            </Modal>
        </div>
    );
};

export default ClientReports;
