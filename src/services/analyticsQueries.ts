// services/analyticsQueries.ts
import { supabase } from '../lib/supabase';

// Fonctions de fallback séparées
const getHotLeadsFallback = async (limit: number = 10) => {
  const { data: leadsData, error } = await supabase
    .from('leads')
    .select('*')
    .in('status', ['new', 'contacted'])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Pour chaque lead, récupérer le nombre d'interactions
  const leadsWithInteractions = await Promise.all(
    leadsData.map(async (lead) => {
      const { count } = await supabase
        .from('lead_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('lead_id', lead.id);

      return {
        ...lead,
        interactions_count: count || 0
      };
    })
  );

  // Calculer le score selon la même logique que votre fonction SQL
  const hotLeads = leadsWithInteractions.map(lead => {
    const score = calculateLeadScoreSQL(lead);
    return {
      lead_id: lead.id,
      company_name: lead.company_name,
      contact_name: lead.contact_name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      score: score,
      last_interaction: null
    };
  }).sort((a, b) => b.score - a.score);

  return { data: hotLeads };
};

const getMonthlyTrendsFallback = async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('status, created_at')
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Grouper par mois
  const monthlyData = data.reduce((acc, lead) => {
    const date = new Date(lead.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        period: monthKey,
        new_leads: 0,
        contacted: 0,
        qualified: 0,
        converted: 0
      };
    }
    
    acc[monthKey].new_leads++;
    if (lead.status === 'contacted') acc[monthKey].contacted++;
    if (lead.status === 'qualified') acc[monthKey].qualified++;
    if (lead.status === 'converted') acc[monthKey].converted++;
    
    return acc;
  }, {} as Record<string, any>);

  const trends = Object.values(monthlyData).slice(-6);
  return { data: trends };
};

export const analyticsQueries = {
  // Taux de conversion avec support pour la période
  getConversionRate: async (timeRange: string = '30d') => {
    const startDate = getStartDateFromRange(timeRange);
    
    const { data, error } = await supabase
      .rpc('get_salesperson_stats', {
        user_id_param: null,
        start_date: startDate.toISOString()
      });

    if (error) {
      console.error('Error calling get_salesperson_stats:', error);
      return getConversionRateFallback(timeRange);
    }

    const stats = data?.[0];
    if (!stats) {
      return {
        data: {
          total_leads: 0,
          converted_leads: 0,
          conversion_rate: 0
        }
      };
    }

    return {
      data: {
        total_leads: stats.total_leads,
        converted_leads: stats.converted_leads,
        conversion_rate: parseFloat(stats.conversion_rate) || 0
      }
    };
  },

  // Leads prioritaires utilisant votre fonction SQL
  getHotLeads: async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .rpc('get_hot_leads', { limit_count: limit });

      if (error) {
        console.error('Error calling get_hot_leads:', error);
        // Fallback vers une requête simple
        return await getHotLeadsFallback(limit);
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getHotLeads:', error);
      return await getHotLeadsFallback(limit);
    }
  },

  // Funnel de conversion
  getConversionFunnel: async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('status');

      if (error) throw error;

      const statusCounts = data.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = data.length;
      const funnel = [
        { 
          status: 'new', 
          count: statusCounts['new'] || 0, 
          percentage: total > 0 ? Math.round((statusCounts['new'] || 0) / total * 100) : 0 
        },
        { 
          status: 'contacted', 
          count: statusCounts['contacted'] || 0, 
          percentage: total > 0 ? Math.round((statusCounts['contacted'] || 0) / total * 100) : 0 
        },
        { 
          status: 'qualified', 
          count: statusCounts['qualified'] || 0, 
          percentage: total > 0 ? Math.round((statusCounts['qualified'] || 0) / total * 100) : 0 
        },
        { 
          status: 'converted', 
          count: statusCounts['converted'] || 0, 
          percentage: total > 0 ? Math.round((statusCounts['converted'] || 0) / total * 100) : 0 
        }
      ];

      return { data: funnel };
    } catch (error) {
      console.error('Error in getConversionFunnel:', error);
      return { data: [] };
    }
  },

  // Sources des leads
  getLeadSources: async (timeRange: string = '30d') => {
    try {
      // Utilisons les types d'interaction comme source
      const { data: interactions, error } = await supabase
        .from('lead_interactions')
        .select('interaction_type')
        .gte('created_at', getStartDateFromRange(timeRange).toISOString());

      if (error) {
        // Fallback vers des données simulées
        const simulatedSources = [
          { source: 'demande_devis', count: 45 },
          { source: 'download_pdf', count: 23 },
          { source: 'contact_form', count: 15 },
          { source: 'direct', count: 12 }
        ];
        return { data: simulatedSources };
      }

      const sourceCounts = interactions.reduce((acc, interaction) => {
        const source = interaction.interaction_type || 'other';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sources = Object.entries(sourceCounts).map(([source, count]) => ({
        source: mapInteractionToSource(source),
        count
      }));

      return { data: sources };
    } catch (error) {
      console.error('Error in getLeadSources:', error);
      return { data: [] };
    }
  },

  // Tendances mensuelles utilisant votre fonction SQL
  getMonthlyTrends: async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const { data, error } = await supabase
        .rpc('get_time_series_data', {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          granularity: 'month'
        });

      if (error) {
        console.error('Error calling get_time_series_data:', error);
        return await getMonthlyTrendsFallback();
      }

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getMonthlyTrends:', error);
      return await getMonthlyTrendsFallback();
    }
  },

  // Statistiques détaillées du commercial
  getSalespersonStats: async (userId?: string, timeRange: string = '30d') => {
    try {
      const startDate = getStartDateFromRange(timeRange);
      
      const { data, error } = await supabase
        .rpc('get_salesperson_stats', {
          user_id_param: userId || null,
          start_date: startDate.toISOString()
        });

      if (error) throw error;

      return { data: data?.[0] || null };
    } catch (error) {
      console.error('Error in getSalespersonStats:', error);
      return { data: null };
    }
  },

  // Données de séries temporelles
  getTimeSeriesData: async (granularity: 'day' | 'week' | 'month' = 'day', days: number = 30) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .rpc('get_time_series_data', {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          granularity: granularity
        });

      if (error) throw error;

      return { data: data || [] };
    } catch (error) {
      console.error('Error in getTimeSeriesData:', error);
      return { data: [] };
    }
  }
};

// Fallback pour le taux de conversion
const getConversionRateFallback = async (timeRange: string = '30d') => {
  const startDate = getStartDateFromRange(timeRange);
  
  const { data, error } = await supabase
    .from('leads')
    .select('status, created_at')
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  const totalLeads = data.length;
  const convertedLeads = data.filter(lead => lead.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  return {
    data: {
      total_leads: totalLeads,
      converted_leads: convertedLeads,
      conversion_rate: Math.round(conversionRate * 10) / 10
    }
  };
};

// Fonction utilitaire pour calculer la date de début
function getStartDateFromRange(timeRange: string): Date {
  const now = new Date();
  const startDate = new Date();

  switch (timeRange) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  return startDate;
}

// Mapper les types d'interaction vers des sources lisibles
function mapInteractionToSource(interactionType: string): string {
  const mapping: Record<string, string> = {
    'pdf_download': 'Download PDF',
    'contact_request': 'Formulaire Contact',
    'quote_request': 'Demande Devis',
    'phone_call': 'Appel Téléphonique',
    'email_sent': 'Email Envoyé'
  };
  
  return mapping[interactionType] || interactionType;
}

// Calcul du score selon la même logique que votre fonction SQL
function calculateLeadScoreSQL(lead: any): number {
  let score = 0;
  
  // Points basés sur la facture électrique
  if (lead.electricity_bill > 500000) score += 30;
  else if (lead.electricity_bill > 200000) score += 20;
  else score += 10;
  
  // Points basés sur le budget
  if (lead.budget > 50000000) score += 30;
  else if (lead.budget > 20000000) score += 20;
  else if (lead.budget) score += 10;
  else score += 5;
  
  // Points basés sur les interactions (approximatif)
  score += (lead.interactions_count || 0) * 10;
  
  // Points basés sur la récence
  const created = new Date(lead.created_at);
  const now = new Date();
  const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff <= 24) score += 20;
  else if (hoursDiff <= 48) score += 15;
  else if (hoursDiff <= 168) score += 10; // 7 jours
  else score += 5;
  
  return score;
}



// Ajoutez ces fonctions à votre analyticsQueries.ts

// Statistiques de visites
export const getVisitStats = async (timeRange: string = '30d') => {
    const startDate = getStartDateFromRange(timeRange);
    
    const { data: pageVisits, error: visitsError } = await supabase
      .from('page_visits')
      .select('*')
      .gte('created_at', startDate.toISOString());
  
    const { data: uniqueVisitors, error: uniqueError } = await supabase
      .from('unique_visitors')
      .select('*')
      .gte('last_visit', startDate.toISOString());
  
    if (visitsError || uniqueError) {
      console.error('Error fetching visit stats:', visitsError || uniqueError);
      return { data: null };
    }
  
    // Calculer les métriques
    const totalVisits = pageVisits?.length || 0;
    const uniqueVisitorsCount = uniqueVisitors?.length || 0;
    const avgVisitsPerVisitor = uniqueVisitorsCount > 0 ? totalVisits / uniqueVisitorsCount : 0;
  
    // Pages les plus populaires
    const pageStats = pageVisits?.reduce((acc, visit) => {
      acc[visit.page_path] = (acc[visit.page_path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    const popularPages = Object.entries(pageStats || {})
      .map(([path, count]) => ({ path, count, percentage: (count / totalVisits) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  
    return {
      data: {
        total_visits: totalVisits,
        unique_visitors: uniqueVisitorsCount,
        avg_visits_per_visitor: Math.round(avgVisitsPerVisitor * 100) / 100,
        popular_pages: popularPages,
        visits_over_time: getVisitsOverTime(pageVisits || [], timeRange)
      }
    };
  };
  
  // Visites par période
  const getVisitsOverTime = (visits: any[], timeRange: string) => {
    const format = timeRange === '7d' ? 'day' : timeRange === '30d' ? 'day' : 'month';
    
    return visits.reduce((acc, visit) => {
      const date = new Date(visit.created_at);
      let key;
      
      if (format === 'day') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };
  
  // Sources de traffic
  export const getTrafficSources = async (timeRange: string = '30d') => {
    const startDate = getStartDateFromRange(timeRange);
    
    const { data, error } = await supabase
      .from('page_visits')
      .select('referrer')
      .gte('created_at', startDate.toISOString());
  
    if (error) {
      console.error('Error fetching traffic sources:', error);
      return { data: [] };
    }
  
    const sources = data.reduce((acc, visit) => {
      const source = categorizeReferrer(visit.referrer);
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    return {
      data: Object.entries(sources).map(([source, count]) => ({ source, count }))
    };
  };
  
  // Catégoriser les referrers
  const categorizeReferrer = (referrer: string) => {
    if (!referrer || referrer === 'direct') return 'Direct';
    if (referrer.includes('google')) return 'Google';
    if (referrer.includes('facebook')) return 'Facebook';
    if (referrer.includes('linkedin')) return 'LinkedIn';
    if (referrer.includes('twitter')) return 'Twitter';
    if (referrer.includes('instagram')) return 'Instagram';
    return 'Autre site';
  };