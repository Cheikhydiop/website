import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { exportToCSV, formatLeadsWithAnalyticsForExport, formatSegmentForExport } from '../utils/exportUtils';
import Header from '../components/Header';
import './LeadSegmentation.css';

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: any;
  lead_count: number;
  created_at: string;
  updated_at: string;
}

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  site_type: string;
  electricity_bill: number;
  budget: number;
  status: string;
  created_at: string;
}

const LeadSegmentation: React.FC = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [segmentLeads, setSegmentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lead_segments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const segmentsWithCounts = await Promise.all(
        (data || []).map(async (segment) => {
          const count = await calculateSegmentLeadCount(segment);
          return { ...segment, lead_count: count };
        })
      );

      setSegments(segmentsWithCounts);
    } catch (error) {
      console.error('Error loading segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSegmentLeadCount = async (segment: Segment): Promise<number> => {
    try {
      let query = supabase.from('leads').select('*', { count: 'exact', head: true });

      const criteria = segment.criteria;

      if (criteria.min_score) {
        query = query.gte('score', criteria.min_score);
      }

      if (criteria.status && Array.isArray(criteria.status)) {
        query = query.in('status', criteria.status);
      }

      if (criteria.min_budget) {
        query = query.gte('budget', criteria.min_budget);
      }

      if (criteria.site_types && Array.isArray(criteria.site_types)) {
        query = query.in('site_type', criteria.site_types);
      }

      if (criteria.inactive_days) {
        const inactiveDate = new Date();
        inactiveDate.setDate(inactiveDate.getDate() - criteria.inactive_days);
        query = query.lte('updated_at', inactiveDate.toISOString());
      }

      const { count } = await query;
      return count || 0;
    } catch (error) {
      console.error('Error calculating segment count:', error);
      return 0;
    }
  };

  const loadSegmentLeads = async (segment: Segment) => {
    try {
      setLoadingLeads(true);
      let query = supabase.from('leads').select('*');

      const criteria = segment.criteria;

      if (criteria.status && Array.isArray(criteria.status)) {
        query = query.in('status', criteria.status);
      }

      if (criteria.min_budget) {
        query = query.gte('budget', criteria.min_budget);
      }

      if (criteria.site_types && Array.isArray(criteria.site_types)) {
        query = query.in('site_type', criteria.site_types);
      }

      if (criteria.inactive_days) {
        const inactiveDate = new Date();
        inactiveDate.setDate(inactiveDate.getDate() - criteria.inactive_days);
        query = query.lte('updated_at', inactiveDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setSegmentLeads(data || []);
    } catch (error) {
      console.error('Error loading segment leads:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleSegmentClick = (segment: Segment) => {
    setSelectedSegment(segment);
    loadSegmentLeads(segment);
  };

  const exportSegmentData = () => {
    if (!selectedSegment || segmentLeads.length === 0) return;

    const summary = [formatSegmentForExport(selectedSegment, segmentLeads)];
    exportToCSV(summary, `segment_${selectedSegment.name}_summary`);

    const leadsData = formatLeadsWithAnalyticsForExport(segmentLeads, false);
    exportToCSV(leadsData, `segment_${selectedSegment.name}_leads`);
  };

  const getConversionRate = (leads: Lead[]) => {
    if (leads.length === 0) return 0;
    const converted = leads.filter(l => l.status === 'converted').length;
    return ((converted / leads.length) * 100).toFixed(1);
  };

  const getTotalBudget = (leads: Lead[]) => {
    return leads.reduce((sum, l) => sum + (l.budget || 0), 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCriteriaDisplay = (criteria: any) => {
    const parts = [];
    if (criteria.min_budget) parts.push(`Budget ≥ ${(criteria.min_budget / 1000000).toFixed(0)}M FCFA`);
    if (criteria.status) parts.push(`Statuts: ${criteria.status.join(', ')}`);
    if (criteria.site_types) parts.push(`Sites: ${criteria.site_types.join(', ')}`);
    if (criteria.inactive_days) parts.push(`Inactif ${criteria.inactive_days}+ jours`);
    if (criteria.min_score) parts.push(`Score ≥ ${criteria.min_score}`);
    return parts.join(' | ');
  };

  return (
    <div className="lead-segmentation">
      <Header />

      <section className="segmentation-section">
        <div className="container">
          <div className="segmentation-header">
            <div>
              <h1>Segmentation des <span className="gradient-text">Prospects</span></h1>
              <p>Analysez et gérez vos segments de leads</p>
            </div>

            <a href="/admin/dashboard" className="btn-back">
              <i className="fas fa-arrow-left"></i>
              Retour au Dashboard
            </a>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Chargement des segments...</p>
            </div>
          ) : (
            <>
              <div className="segments-grid">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className={`segment-card ${selectedSegment?.id === segment.id ? 'selected' : ''}`}
                    onClick={() => handleSegmentClick(segment)}
                  >
                    <div className="segment-header">
                      <h3>{segment.name}</h3>
                      <span className="lead-count">{segment.lead_count}</span>
                    </div>

                    <p className="segment-description">{segment.description}</p>

                    <div className="segment-criteria">
                      <i className="fas fa-filter"></i>
                      <span>{getCriteriaDisplay(segment.criteria)}</span>
                    </div>

                    <div className="segment-footer">
                      <span className="segment-date">
                        <i className="fas fa-calendar"></i>
                        {formatDate(segment.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedSegment && (
                <div className="segment-details">
                  <div className="details-header">
                    <h2>{selectedSegment.name}</h2>
                    {segmentLeads.length > 0 && (
                      <button className="btn-export" onClick={exportSegmentData}>
                        <i className="fas fa-download"></i>
                        Exporter
                      </button>
                    )}
                  </div>

                  <div className="segment-metrics">
                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="metric-content">
                        <span className="metric-value">{segmentLeads.length}</span>
                        <span className="metric-label">Leads</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="fas fa-percentage"></i>
                      </div>
                      <div className="metric-content">
                        <span className="metric-value">{getConversionRate(segmentLeads)}%</span>
                        <span className="metric-label">Taux de conversion</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="fas fa-coins"></i>
                      </div>
                      <div className="metric-content">
                        <span className="metric-value">
                          {(getTotalBudget(segmentLeads) / 1000000).toFixed(1)}M
                        </span>
                        <span className="metric-label">Budget total FCFA</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="metric-content">
                        <span className="metric-value">
                          {segmentLeads.filter(l => l.status === 'converted').length}
                        </span>
                        <span className="metric-label">Convertis</span>
                      </div>
                    </div>
                  </div>

                  {loadingLeads ? (
                    <div className="loading-state">
                      <div className="loader"></div>
                      <p>Chargement des leads...</p>
                    </div>
                  ) : segmentLeads.length === 0 ? (
                    <div className="empty-state">
                      <i className="fas fa-inbox"></i>
                      <p>Aucun lead dans ce segment</p>
                    </div>
                  ) : (
                    <div className="leads-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Entreprise</th>
                            <th>Contact</th>
                            <th>Type de site</th>
                            <th>Budget</th>
                            <th>Facture</th>
                            <th>Statut</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {segmentLeads.map((lead) => (
                            <tr key={lead.id}>
                              <td><strong>{lead.company_name}</strong></td>
                              <td>
                                <div>{lead.contact_name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>{lead.email}</div>
                              </td>
                              <td>{lead.site_type}</td>
                              <td>{lead.budget ? `${(lead.budget / 1000000).toFixed(1)}M` : '-'}</td>
                              <td>{lead.electricity_bill.toLocaleString()} FCFA</td>
                              <td>
                                <span className={`status-badge status-${lead.status}`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td>{formatDate(lead.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default LeadSegmentation;
