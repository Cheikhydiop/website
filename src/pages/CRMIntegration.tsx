import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import './CRMIntegration.css';

interface CRMIntegration {
  id: string;
  name: string;
  webhook_url: string;
  is_active: boolean;
  sync_frequency: 'realtime' | 'hourly' | 'daily';
  last_sync: string | null;
  config: any;
  created_at: string;
  updated_at: string;
}

const CRMIntegration: React.FC = () => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    webhook_url: '',
    sync_frequency: 'realtime' as 'realtime' | 'hourly' | 'daily',
    is_active: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from('crm_integrations')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('crm_integrations')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setFormData({
        name: '',
        webhook_url: '',
        sync_frequency: 'realtime',
        is_active: false
      });
      setEditingId(null);
      loadIntegrations();
    } catch (error) {
      console.error('Error saving integration:', error);
    }
  };

  const handleEdit = (integration: CRMIntegration) => {
    setFormData({
      name: integration.name,
      webhook_url: integration.webhook_url,
      sync_frequency: integration.sync_frequency,
      is_active: integration.is_active
    });
    setEditingId(integration.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette intégration ?')) return;

    try {
      const { error } = await supabase
        .from('crm_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadIntegrations();
    } catch (error) {
      console.error('Error deleting integration:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('crm_integrations')
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      loadIntegrations();
    } catch (error) {
      console.error('Error toggling integration:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = {
      realtime: 'Temps réel',
      hourly: 'Toutes les heures',
      daily: 'Quotidien'
    };
    return labels[freq] || freq;
  };

  return (
    <div className="crm-integration">
      <Header />

      <section className="integration-section">
        <div className="container">
          <div className="integration-header">
            <div>
              <h1>Intégrations <span className="gradient-text">CRM</span></h1>
              <p>Connectez vos outils de gestion de la relation client</p>
            </div>

            <button
              className="btn-add"
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFormData({
                  name: '',
                  webhook_url: '',
                  sync_frequency: 'realtime',
                  is_active: false
                });
              }}
            >
              <i className="fas fa-plus"></i>
              Ajouter une intégration
            </button>
          </div>

          {showForm && (
            <div className="integration-form-card">
              <h2>{editingId ? 'Modifier' : 'Nouvelle'} intégration</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nom du CRM</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: HubSpot, Salesforce, Zoho"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>URL du Webhook</label>
                  <input
                    type="url"
                    value={formData.webhook_url}
                    onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                    placeholder="https://api.exemple.com/webhook"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fréquence de synchronisation</label>
                  <select
                    value={formData.sync_frequency}
                    onChange={(e) => setFormData({ ...formData, sync_frequency: e.target.value as any })}
                  >
                    <option value="realtime">Temps réel</option>
                    <option value="hourly">Toutes les heures</option>
                    <option value="daily">Quotidien</option>
                  </select>
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span>Activer cette intégration</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                    Annuler
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingId ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Chargement des intégrations...</p>
            </div>
          ) : integrations.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-plug"></i>
              <h3>Aucune intégration configurée</h3>
              <p>Commencez par ajouter votre première intégration CRM</p>
            </div>
          ) : (
            <div className="integrations-grid">
              {integrations.map((integration) => (
                <div key={integration.id} className={`integration-card ${integration.is_active ? 'active' : ''}`}>
                  <div className="integration-header-card">
                    <div className="integration-title">
                      <h3>{integration.name}</h3>
                      <span className={`status-badge ${integration.is_active ? 'active' : 'inactive'}`}>
                        {integration.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="integration-actions">
                      <button
                        onClick={() => toggleActive(integration.id, integration.is_active)}
                        className="btn-icon"
                        title={integration.is_active ? 'Désactiver' : 'Activer'}
                      >
                        <i className={`fas fa-${integration.is_active ? 'pause' : 'play'}`}></i>
                      </button>
                      <button
                        onClick={() => handleEdit(integration)}
                        className="btn-icon"
                        title="Modifier"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(integration.id)}
                        className="btn-icon danger"
                        title="Supprimer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="integration-details">
                    <div className="detail-item">
                      <i className="fas fa-link"></i>
                      <span className="webhook-url">{integration.webhook_url}</span>
                    </div>

                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>Sync: {getFrequencyLabel(integration.sync_frequency)}</span>
                    </div>

                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>Créé: {formatDate(integration.created_at)}</span>
                    </div>

                    {integration.last_sync && (
                      <div className="detail-item">
                        <i className="fas fa-sync"></i>
                        <span>Dernière sync: {formatDate(integration.last_sync)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CRMIntegration;
