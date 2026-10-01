import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabaseClient';

interface DashboardStats {
  projects: number;
  activeProjects: number;
  clients: number;
  activeClients: number;
  leads: number;
  discussionLeads: number;
  followUpLeads: number;
  teamMembers: number;
  transactions: number;
  revenue: number;
  expense: number;
}

export const useDashboardStats = () => useQuery({
  queryKey: ['dashboardStats'],
  queryFn: async (): Promise<DashboardStats> => {
    // Try to use materialized view first (much faster)
    try {
      const { data, error } = await supabase
        .from('mv_dashboard_stats')
        .select('*')
        .single();
      
      if (!error && data) {
        return {
          projects: data.total_projects || 0,
          activeProjects: data.active_projects || 0,
          clients: data.total_clients || 0,
          activeClients: data.active_clients || 0,
          leads: data.total_leads || 0,
          discussionLeads: data.discussion_leads || 0,
          followUpLeads: data.follow_up_leads || 0,
          teamMembers: data.total_team_members || 0,
          transactions: data.total_transactions || 0,
          revenue: data.total_revenue || 0,
          expense: data.total_expense || 0,
        };
      }
    } catch (e) {
      console.log('Materialized view not available, falling back to direct queries');
    }

    // Fallback to direct queries if materialized view doesn't exist
    const [
      { data: pData, error: pErr },
      { data: cData, error: cErr },
      { data: lData, error: lErr },
      { count: tmCount, error: tmErr },
      { data: tData, count: tCount, error: tErr }
    ] = await Promise.all([
      supabase.from('projects').select('status'),
      supabase.from('clients').select('status'),
      supabase.from('leads').select('status'),
      supabase.from('team_members').select('*', { count: 'exact', head: true }),
      supabase.from('transactions').select('type, amount', { count: 'exact' })
    ]);

    if (pErr || cErr || lErr || tmErr || tErr) throw (pErr || cErr || lErr || tmErr || tErr);

    const activeProjects = (pData || []).filter(p => p.status !== 'Selesai' && p.status !== 'Dibatalkan').length;
    const activeClients = (cData || []).filter(c => c.status === 'Aktif').length;
    const discussionLeads = (lData || []).filter(l => l.status === 'Discussion' || l.status === 'Sedang Diskusi').length;
    const followUpLeads = (lData || []).filter(l => l.status === 'Follow Up' || l.status === 'Menunggu Follow Up').length;

    let rev = 0;
    let exp = 0;
    (tData || []).forEach(row => {
      if (row.type === 'Pemasukan') rev += Number(row.amount || 0);
      else if (row.type === 'Pengeluaran') exp += Number(row.amount || 0);
    });

    return {
      projects: pData?.length || 0,
      activeProjects,
      clients: cData?.length || 0,
      activeClients,
      leads: lData?.length || 0,
      discussionLeads,
      followUpLeads,
      teamMembers: tmCount || 0,
      transactions: tCount || 0,
      revenue: rev,
      expense: exp,
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes for stats
  refetchInterval: false, // Disabled - will be invalidated by real-time updates
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

// Function to refresh materialized view
export const refreshDashboardStats = async () => {
  try {
    await supabase.rpc('refresh_dashboard_stats');
  } catch (error) {
    console.error('Failed to refresh dashboard stats:', error);
  }
};
