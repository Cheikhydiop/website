// pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { supabase, type Lead, type LeadInteraction } from '../lib/supabase';
import { useAnalytics } from '../lib/analytics';
import { exportToCSV, formatLeadsForExport } from '../utils/exportUtils';
import Header from '../components/Header';
import './AdminDashboard.css';

type LeadWithInteractions = Lead & {
  interactions: LeadInteraction[];
};

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<LeadWithInteractions[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'converted'>('all');
  const [selectedLead, setSelectedLead] = useState<LeadWithInteractions | null>(null);
  
  const { trackPageView, trackLeadAction } = useAnalytics();

  useEffect(() => {
    trackPageView('/admin/dashboard');
    loadLeads();
  }, []);

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data: leadsData, error: leadsError } = await query;

      if (leadsError) throw leadsError;

      const leadsWithInteractions = await Promise.all(
        (leadsData || []).map(async (lead) => {
          const { data: interactions } = await supabase
            .from('lead_interactions')
            .select('*')
            .eq('lead_id', lead.id)
            .order('created_at', { ascending: false });

          return {
            ...lead,
            interactions: interactions || [],
          };
        })
      );

      setLeads(leadsWithInteractions);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;

      loadLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleLeadClick = (lead: LeadWithInteractions) => {
    setSelectedLead(lead);
    trackLeadAction('view_lead_details', lead.id, {
      lead_status: lead.status,
      company_name: lead.company_name
    });
  };

  const handleEmailClick = (lead: LeadWithInteractions) => {
    trackLeadAction('click_email', lead.id);
  };

  const handlePhoneClick = (lead: LeadWithInteractions) => {
    trackLeadAction('click_phone', lead.id);
  };

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      new: 'status-new',
      contacted: 'status-contacted',
      qualified: 'status-qualified',
      converted: 'status-converted'
    };
    return classes[status] || '';
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    qualified: leads.filter((l) => l.status === 'qualified').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  };

  return (
    <div className="admin-dashboard">
      <Header />

      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-header">
            <div>
              <h1>Tableau de bord <span className="gradient-text">Administrateur</span></h1>
              <p>Gestion des leads et qualification commerciale</p>
            </div>

            <div className="header-actions">
              <button
                className="btn-export"
                onClick={() => exportToCSV(formatLeadsForExport(leads), 'leads_inesic')}
              >
                <i className="fas fa-download"></i>
                Exporter CSV
              </button>
              <a href="/admin/analytics" className="btn-analytics">
                <i className="fas fa-chart-line"></i>
                Analytics
              </a>
              <a href="/admin/catalog" className="btn-catalog">
                <i className="fas fa-box"></i>
                Catalogue
              </a>
            </div>
          </div>

          {/* Section Stats principales */}
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setFilter('all')}>
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Leads</span>
              </div>
            </div>

            <div className="stat-card" onClick={() => setFilter('new')}>
              <div className="stat-icon new">
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.new}</span>
                <span className="stat-label">Nouveaux</span>
              </div>
            </div>

            <div className="stat-card" onClick={() => setFilter('contacted')}>
              <div className="stat-icon contacted">
                <i className="fas fa-phone"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.contacted}</span>
                <span className="stat-label">Contactés</span>
              </div>
            </div>

            <div className="stat-card" onClick={() => setFilter('qualified')}>
              <div className="stat-icon qualified">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.qualified}</span>
                <span className="stat-label">Qualifiés</span>
              </div>
            </div>

            <div className="stat-card" onClick={() => setFilter('converted')}>
              <div className="stat-icon converted">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.converted}</span>
                <span className="stat-label">Convertis</span>
              </div>
            </div>
          </div>

          {/* Section Liste des leads */}
          <div className="leads-section">
            <div className="section-header">
              <h2>Liste des leads</h2>
              <div className="filter-tabs">
                <button
                  className={filter === 'all' ? 'active' : ''}
                  onClick={() => setFilter('all')}
                >
                  Tous
                </button>
                <button
                  className={filter === 'new' ? 'active' : ''}
                  onClick={() => setFilter('new')}
                >
                  Nouveaux
                </button>
                <button
                  className={filter === 'contacted' ? 'active' : ''}
                  onClick={() => setFilter('contacted')}
                >
                  Contactés
                </button>
                <button
                  className={filter === 'qualified' ? 'active' : ''}
                  onClick={() => setFilter('qualified')}
                >
                  Qualifiés
                </button>
                <button
                  className={filter === 'converted' ? 'active' : ''}
                  onClick={() => setFilter('converted')}
                >
                  Convertis
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Chargement des leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>Aucun lead trouvé</p>
              </div>
            ) : (
              <div className="leads-table">
                <table>
                  <thead>
                    <tr>
                      <th>Entreprise</th>
                      <th>Contact</th>
                      <th>Site</th>
                      <th>Facture</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} onClick={() => handleLeadClick(lead)}>
                        <td>
                          <strong>{lead.company_name}</strong>
                        </td>
                        <td>
                          <div className="contact-info">
                            <div>{lead.contact_name}</div>
                            <div className="contact-details">
                              <a 
                                href={`mailto:${lead.email}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEmailClick(lead);
                                }}
                              >
                                {lead.email}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td>{lead.site_type}</td>
                        <td>{lead.electricity_bill.toLocaleString()} FCFA</td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(lead.status)}`}>
                            {getStatusLabel(lead.status)}
                          </span>
                        </td>
                        <td>{formatDate(lead.created_at)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLeadClick(lead);
                              }}
                              title="Voir détails"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal détails lead */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content lead-details" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedLead(null)}>
              <i className="fas fa-times"></i>
            </button>

            <div className="lead-details-header">
              <h2>{selectedLead.company_name}</h2>
              <span className={`status-badge ${getStatusBadgeClass(selectedLead.status)}`}>
                {getStatusLabel(selectedLead.status)}
              </span>
            </div>

            <div className="lead-details-grid">
              <div className="detail-section">
                <h3>Informations de contact</h3>
                <div className="detail-item">
                  <span className="detail-label">Nom</span>
                  <span className="detail-value">{selectedLead.contact_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">
                    <a 
                      href={`mailto:${selectedLead.email}`}
                      onClick={() => handleEmailClick(selectedLead)}
                    >
                      {selectedLead.email}
                    </a>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Téléphone</span>
                  <span className="detail-value">
                    <a 
                      href={`tel:${selectedLead.phone}`}
                      onClick={() => handlePhoneClick(selectedLead)}
                    >
                      {selectedLead.phone}
                    </a>
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Informations techniques</h3>
                <div className="detail-item">
                  <span className="detail-label">Type de site</span>
                  <span className="detail-value">{selectedLead.site_type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Facture mensuelle</span>
                  <span className="detail-value">{selectedLead.electricity_bill.toLocaleString()} FCFA</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Puissance installée</span>
                  <span className="detail-value">{selectedLead.installation_power} kW</span>
                </div>
                {selectedLead.budget && (
                  <div className="detail-item">
                    <span className="detail-label">Budget</span>
                    <span className="detail-value">{selectedLead.budget.toLocaleString()} FCFA</span>
                  </div>
                )}
              </div>

              <div className="detail-section full-width">
                <h3>Besoins identifiés</h3>
                <div className="tags-list">
                  {selectedLead.specific_needs.map((need) => (
                    <span key={need} className="tag">{need}</span>
                  ))}
                </div>
                <h3 style={{ marginTop: '20px' }}>Zones à surveiller</h3>
                <div className="tags-list">
                  {selectedLead.zones_to_monitor.map((zone) => (
                    <span key={zone} className="tag">{zone}</span>
                  ))}
                </div>
              </div>

              {selectedLead.interactions.length > 0 && (
                <div className="detail-section full-width">
                  <h3>Historique des interactions</h3>
                  <div className="interactions-list">
                    {selectedLead.interactions.map((interaction) => (
                      <div key={interaction.id} className="interaction-item">
                        <div className="interaction-icon">
                          <i className={`fas ${
                            interaction.interaction_type === 'pdf_download' ? 'fa-file-pdf' :
                            interaction.interaction_type === 'contact_request' ? 'fa-phone' :
                            'fa-file-invoice'
                          }`}></i>
                        </div>
                        <div className="interaction-content">
                          <span className="interaction-type">
                            {interaction.interaction_type === 'pdf_download' && 'Téléchargement PDF'}
                            {interaction.interaction_type === 'contact_request' && 'Demande de contact'}
                            {interaction.interaction_type === 'quote_request' && 'Demande de devis'}
                          </span>
                          <span className="interaction-date">{formatDate(interaction.created_at)}</span>
                          {interaction.notes && <p className="interaction-notes">{interaction.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="status-update-section">
              <h3>Mettre à jour le statut</h3>
              <div className="status-buttons">
                <button
                  className={`status-btn ${selectedLead.status === 'new' ? 'active' : ''}`}
                  onClick={() => updateLeadStatus(selectedLead.id, 'new')}
                >
                  Nouveau
                </button>
                <button
                  className={`status-btn ${selectedLead.status === 'contacted' ? 'active' : ''}`}
                  onClick={() => updateLeadStatus(selectedLead.id, 'contacted')}
                >
                  Contacté
                </button>
                <button
                  className={`status-btn ${selectedLead.status === 'qualified' ? 'active' : ''}`}
                  onClick={() => updateLeadStatus(selectedLead.id, 'qualified')}
                >
                  Qualifié
                </button>
                <button
                  className={`status-btn ${selectedLead.status === 'converted' ? 'active' : ''}`}
                  onClick={() => updateLeadStatus(selectedLead.id, 'converted')}
                >
                  Converti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;