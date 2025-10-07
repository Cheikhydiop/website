// pages/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../lib/analytics';
import { analyticsQueries, getVisitStats, getTrafficSources } from '../services/analyticsQueries';
import Header from '../components/Header';
import './AnalyticsDashboard.css';

interface AnalyticsData {
  conversionRate: {
    total_leads: number;
    converted_leads: number;
    conversion_rate: number;
  } | null;
  hotLeads: any[];
  funnel: any[];
  leadSources: any[];
  monthlyTrends: any[];
  visitStats: any;
  trafficSources: any[];
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    conversionRate: null,
    hotLeads: [],
    funnel: [],
    leadSources: [],
    monthlyTrends: [],
    visitStats: null,
    trafficSources: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/admin/analytics');
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const [
        rateData, 
        hotData, 
        funnelData, 
        sourcesData, 
        trendsData,
        visitStatsData,
        trafficSourcesData
      ] = await Promise.all([
        analyticsQueries.getConversionRate(timeRange),
        analyticsQueries.getHotLeads(10),
        analyticsQueries.getConversionFunnel(),
        analyticsQueries.getLeadSources(timeRange),
        analyticsQueries.getMonthlyTrends(),
        getVisitStats(timeRange),
        getTrafficSources(timeRange)
      ]);

      setAnalytics({
        conversionRate: rateData.data,
        hotLeads: hotData.data || [],
        funnel: funnelData.data || [],
        leadSources: sourcesData.data || [],
        monthlyTrends: trendsData.data || [],
        visitStats: visitStatsData.data,
        trafficSources: trafficSourcesData.data || []
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      new: 'Nouveau',
      contacted: 'Contacté',
      qualified: 'Qualifié',
      converted: 'Converti'
    };
    return labels[status] || status;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const formatMonth = (monthKey: string): string => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <Header />
        <div className="loading-state">
          <div className="loader"></div>
          <p>Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <Header />

      <section className="analytics-section">
        <div className="container">
          <div className="analytics-header">
            <div className="header-content">
              <h1>Tableau de bord <span className="gradient-text">Analytics</span></h1>
              <p>Analyse des performances et métriques clés</p>
            </div>
            
            <div className="header-actions">
              <a href="/admin/dashboard" className="btn-back">
                <i className="fas fa-arrow-left"></i>
                Retour au Dashboard
              </a>
              
              <div className="time-filter">
                <button 
                  className={timeRange === '7d' ? 'active' : ''}
                  onClick={() => setTimeRange('7d')}
                >
                  7J
                </button>
                <button 
                  className={timeRange === '30d' ? 'active' : ''}
                  onClick={() => setTimeRange('30d')}
                >
                  30J
                </button>
                <button 
                  className={timeRange === '90d' ? 'active' : ''}
                  onClick={() => setTimeRange('90d')}
                >
                  90J
                </button>
                <button 
                  className={timeRange === '1y' ? 'active' : ''}
                  onClick={() => setTimeRange('1y')}
                >
                  1AN
                </button>
              </div>
            </div>
          </div>

          {/* Métriques principales */}
          <div className="metrics-grid">
            {analytics.conversionRate && (
              <>
                <div className="metric-card primary">
                  <div className="metric-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="metric-content">
                    <span className="metric-value">
                      {analytics.conversionRate.conversion_rate}%
                    </span>
                    <span className="metric-label">Taux de Conversion</span>
                    <div className="metric-details">
                      <span>{analytics.conversionRate.converted_leads} convertis</span>
                      <span>sur {analytics.conversionRate.total_leads} leads</span>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div className="metric-content">
                    <span className="metric-value">{analytics.hotLeads.length}</span>
                    <span className="metric-label">Leads Prioritaires</span>
                    <div className="metric-details">
                      <span>Score moyen: {
                        analytics.hotLeads.length > 0 
                          ? (analytics.hotLeads.reduce((acc, lead) => acc + lead.score, 0) / analytics.hotLeads.length).toFixed(1)
                          : 0
                      }</span>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-funnel-dollar"></i>
                  </div>
                  <div className="metric-content">
                    <span className="metric-value">
                      {analytics.funnel.find(stage => stage.status === 'converted')?.percentage || 0}%
                    </span>
                    <span className="metric-label">Taux de Conversion Final</span>
                    <div className="metric-details">
                      <span>Du premier contact à la conversion</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Métriques des visites */}
            {analytics.visitStats && (
              <>
                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <div className="metric-content">
                    <span className="metric-value">{analytics.visitStats.total_visits}</span>
                    <span className="metric-label">Visites Total</span>
                    <div className="metric-details">
                      <span>{analytics.visitStats.unique_visitors} visiteurs uniques</span>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="metric-content">
                    <span className="metric-value">{analytics.visitStats.unique_visitors}</span>
                    <span className="metric-label">Visiteurs Uniques</span>
                    <div className="metric-details">
                      <span>{analytics.visitStats.avg_visits_per_visitor} visites moyenne</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section Analytics des Visites */}
          {analytics.visitStats && (
            <div className="analytics-card full-width">
              <div className="card-header">
                <h3>Analytics des Visites</h3>
                <span className="card-subtitle">Performance du site web</span>
              </div>
              
              <div className="visit-metrics">
                {/* Pages populaires */}
                {analytics.visitStats.popular_pages && analytics.visitStats.popular_pages.length > 0 && (
                  <div className="popular-pages-section">
                    <h4>Pages Populaires</h4>
                    <div className="pages-list">
                      {analytics.visitStats.popular_pages.map((page: any) => (
                        <div key={page.path} className="page-item">
                          <span className="page-path">{page.path}</span>
                          <span className="page-count">{page.count}</span>
                          <span className="page-percentage">{page.percentage.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources de traffic */}
                {analytics.trafficSources.length > 0 && (
                  <div className="traffic-sources-section">
                    <h4>Sources de Traffic</h4>
                    <div className="sources-list">
                      {analytics.trafficSources.map((source) => (
                        <div key={source.source} className="source-item">
                          <div className="source-info">
                            <span className="source-name">{source.source}</span>
                            <span className="source-count">{source.count} visites</span>
                          </div>
                          <div className="source-bar">
                            <div 
                              className="source-fill"
                              style={{ 
                                width: `${(source.count / Math.max(...analytics.trafficSources.map(s => s.count))) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="source-percentage">
                            {source.percentage?.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Funnel de conversion */}
          {analytics.funnel.length > 0 && (
            <div className="analytics-card">
              <div className="card-header">
                <h3>Funnel de Conversion</h3>
                <span className="card-subtitle">Progression des leads dans le pipeline</span>
              </div>
              <div className="funnel-chart">
                {analytics.funnel.map((stage) => (
                  <div key={stage.status} className="funnel-stage">
                    <div className="stage-header">
                      <span className="stage-label">{getStatusLabel(stage.status)}</span>
                      <span className="stage-count">{stage.count}</span>
                    </div>
                    <div className="stage-bar">
                      <div 
                        className="stage-fill"
                        style={{ width: `${stage.percentage}%` }}
                        data-percentage={stage.percentage}
                      ></div>
                    </div>
                    <span className="stage-percentage">{formatPercentage(stage.percentage)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="analytics-grid">
            {/* Leads prioritaires */}
            {analytics.hotLeads.length > 0 && (
              <div className="analytics-card">
                <div className="card-header">
                  <h3>Leads Prioritaires 🔥</h3>
                  <span className="card-subtitle">Top 10 par score d'engagement</span>
                </div>
                <div className="hot-leads-list">
                  {analytics.hotLeads.map((lead, index) => (
                    <div key={lead.lead_id} className="hot-lead-item">
                      <div className="lead-rank">
                        <span className={`rank-badge ${index < 3 ? 'top' : ''}`}>
                          #{index + 1}
                        </span>
                      </div>
                      <div className="lead-info">
                        <strong>{lead.company_name}</strong>
                        <span className="lead-contact">{lead.contact_name}</span>
                        <span className="lead-status">{getStatusLabel(lead.status)}</span>
                      </div>
                      <div className="lead-score">
                        <span className="score-value">{lead.score}</span>
                        <span className="score-label">Score</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources des leads */}
            {analytics.leadSources.length > 0 && (
              <div className="analytics-card">
                <div className="card-header">
                  <h3>Sources des Leads</h3>
                  <span className="card-subtitle">Origine des acquisitions</span>
                </div>
                <div className="sources-list">
                  {analytics.leadSources.map((source) => (
                    <div key={source.source} className="source-item">
                      <div className="source-info">
                        <span className="source-name">
                          {source.source === 'direct' ? 'Direct' : 
                           source.source === 'website' ? 'Site Web' :
                           source.source === 'referral' ? 'Recommandation' :
                           source.source === 'social' ? 'Réseaux sociaux' : source.source}
                        </span>
                        <span className="source-count">{source.count} leads</span>
                      </div>
                      <div className="source-bar">
                        <div 
                          className="source-fill"
                          style={{ 
                            width: `${(source.count / Math.max(...analytics.leadSources.map(s => s.count))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="source-percentage">
                        {((source.count / analytics.leadSources.reduce((acc, s) => acc + s.count, 0)) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tendances mensuelles */}
          {analytics.monthlyTrends.length > 0 && (
            <div className="analytics-card">
              <div className="card-header">
                <h3>Tendances Mensuelles</h3>
                <span className="card-subtitle">Évolution des leads par statut</span>
              </div>
              <div className="trends-chart">
                <div className="chart-container">
                  {analytics.monthlyTrends.map((month) => (
                    <div key={month.period} className="trend-bar">
                      <div className="bar-container">
                        <div 
                          className="bar new-bar"
                          style={{ height: `${(month.new_leads / Math.max(...analytics.monthlyTrends.map(m => m.new_leads))) * 100}%` }}
                          title={`${month.new_leads} nouveaux`}
                        ></div>
                        <div 
                          className="bar contacted-bar"
                          style={{ height: `${(month.contacted / Math.max(...analytics.monthlyTrends.map(m => m.contacted || 1))) * 100}%` }}
                          title={`${month.contacted} contactés`}
                        ></div>
                        <div 
                          className="bar qualified-bar"
                          style={{ height: `${(month.qualified / Math.max(...analytics.monthlyTrends.map(m => m.qualified || 1))) * 100}%` }}
                          title={`${month.qualified} qualifiés`}
                        ></div>
                        <div 
                          className="bar converted-bar"
                          style={{ height: `${(month.converted / Math.max(...analytics.monthlyTrends.map(m => m.converted || 1))) * 100}%` }}
                          title={`${month.converted} convertis`}
                        ></div>
                      </div>
                      <span className="month-label">
                        {formatMonth(month.period)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color new-color"></div>
                    <span>Nouveaux</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color contacted-color"></div>
                    <span>Contactés</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color qualified-color"></div>
                    <span>Qualifiés</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color converted-color"></div>
                    <span>Convertis</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;