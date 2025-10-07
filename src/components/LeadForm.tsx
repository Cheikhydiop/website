import React, { useState } from 'react';
import { supabase, type Scenario } from '../lib/supabase';
import type { QuestionnaireData } from '../pages/SakkanalQualification';
import './LeadForm.css';

type LeadFormProps = {
  scenario: Scenario;
  formData: QuestionnaireData;
  onClose: () => void;
  onSuccess: (userData: any) => void; // ← MODIFIER ICI: ajouter le paramètre
};

const LeadForm: React.FC<LeadFormProps> = ({ scenario, formData, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
  });
  const [interactionType, setInteractionType] = useState<'contact_request' | 'quote_request' | 'pdf_download'>('contact_request');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadData = {
        company_name: contactInfo.companyName,
        contact_name: contactInfo.contactName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        site_type: formData.siteType,
        electricity_bill: formData.electricityBill,
        installation_power: formData.installationPower,
        zones_to_monitor: formData.zonesToMonitor,
        specific_needs: formData.specificNeeds,
        measurement_points: formData.measurementPoints,
        budget: formData.budget,
        questionnaire_data: formData,
        recommended_scenarios: [{ id: scenario.id, name: scenario.name, category: scenario.category }],
        status: 'new',
      };

      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .maybeSingle();

      if (leadError) throw leadError;

      if (lead) {
        const { error: interactionError } = await supabase
          .from('lead_interactions')
          .insert({
            lead_id: lead.id,
            interaction_type: interactionType,
            notes: `Demande pour ${scenario.name}`,
          });

        if (interactionError) throw interactionError;
      }

      // CORRECTION ICI: Passer les données utilisateur à onSuccess
      const userData = {
        fullName: contactInfo.contactName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        company: contactInfo.companyName
      };
      
      console.log('LeadForm - Envoi des données utilisateur:', userData);
      onSuccess(userData); // ← CORRECTION: passer userData

    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-form-modal">
      <div className="lead-form-content">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="form-header">
          <h2>Demande d'information</h2>
          <p>Remplissez le formulaire pour recevoir plus d'informations sur <strong>{scenario.name}</strong></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyName">Nom de l'entreprise *</label>
            <input
              type="text"
              id="companyName"
              value={contactInfo.companyName}
              onChange={(e) => setContactInfo({ ...contactInfo, companyName: e.target.value })}
              required
              placeholder="Ex: INESIC Consulting"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactName">Nom et prénom *</label>
            <input
              type="text"
              id="contactName"
              value={contactInfo.contactName}
              onChange={(e) => setContactInfo({ ...contactInfo, contactName: e.target.value })}
              required
              placeholder="Ex: Jean Dupont"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email professionnel *</label>
            <input
              type="email"
              id="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              required
              placeholder="Ex: jean.dupont@entreprise.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone *</label>
            <input
              type="tel"
              id="phone"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              required
              placeholder="Ex: +221 77 123 45 67"
            />
          </div>

          <div className="form-group">
            <label>Type de demande</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="interactionType"
                  value="contact_request"
                  checked={interactionType === 'contact_request'}
                  onChange={(e) => setInteractionType(e.target.value as any)}
                />
                <span>Être contacté par un conseiller</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="interactionType"
                  value="quote_request"
                  checked={interactionType === 'quote_request'}
                  onChange={(e) => setInteractionType(e.target.value as any)}
                />
                <span>Recevoir un devis détaillé</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="interactionType"
                  value="pdf_download"
                  checked={interactionType === 'pdf_download'}
                  onChange={(e) => setInteractionType(e.target.value as any)}
                />
                <span>Télécharger la documentation PDF</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Envoi en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Envoyer la demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;