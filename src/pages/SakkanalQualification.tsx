import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './SakkanalQualification.css';

export type QuestionnaireData = {
  siteType: string;
  electricityBill: number;
  installationPower: number;
  zonesToMonitor: string[];
  specificNeeds: string[];
  measurementPoints: number;
  budget: number;
};

const SakkanalQualification: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    siteType: '',
    electricityBill: 0,
    installationPower: 0,
    zonesToMonitor: [],
    specificNeeds: [],
    measurementPoints: 0,
    budget: 0,
  });

  const siteTypes = [
    { value: 'bureau', label: 'Bureau', icon: 'fa-building' },
    { value: 'immeuble', label: 'Immeuble', icon: 'fa-city' },
    { value: 'usine', label: 'Usine', icon: 'fa-industry' },
    { value: 'commerce', label: 'Commerce', icon: 'fa-store' },
    { value: 'data_center', label: 'Data Center', icon: 'fa-server' },
    { value: 'autre', label: 'Autre', icon: 'fa-question' },
  ];

  const zones = [
    'Production',
    'Bureaux',
    'Entrepôt',
    'Climatisation',
    'Éclairage',
    'Équipements critiques',
  ];

  const needs = [
    'Suivi consommation temps réel',
    'Réduction des coûts',
    'Maintenance préventive',
    'Extension future',
    'Pilotage à distance',
    'Alertes intelligentes',
  ];

  const handleSiteTypeSelect = (value: string) => {
    setFormData({ ...formData, siteType: value });
  };

  const handleZoneToggle = (zone: string) => {
    const newZones = formData.zonesToMonitor.includes(zone)
      ? formData.zonesToMonitor.filter(z => z !== zone)
      : [...formData.zonesToMonitor, zone];
    setFormData({ ...formData, zonesToMonitor: newZones });
  };

  const handleNeedToggle = (need: string) => {
    const newNeeds = formData.specificNeeds.includes(need)
      ? formData.specificNeeds.filter(n => n !== need)
      : [...formData.specificNeeds, need];
    setFormData({ ...formData, specificNeeds: newNeeds });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      navigate('/sakkanal/results', { state: { formData } });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.siteType !== '';
      case 2:
        return formData.electricityBill > 0 && formData.installationPower > 0;
      case 3:
        return formData.zonesToMonitor.length > 0;
      case 4:
        return formData.specificNeeds.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="qualification-page">
      <Header />

      <section className="qualification-section">
        <div className="container">
          <div className="qualification-header" data-aos="fade-up">
            <h1>Trouvez votre solution en <span className="gradient-text">1 minute</span></h1>
            <p>Répondez à quelques questions pour obtenir une recommandation personnalisée</p>
          </div>

          <div className="progress-bar" data-aos="fade-up" data-aos-delay="100">
            <div className="progress-steps">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`progress-step ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                  <div className="step-circle">{step > s ? '✓' : s}</div>
                  <div className="step-label">
                    {s === 1 && 'Type de site'}
                    {s === 2 && 'Consommation'}
                    {s === 3 && 'Zones'}
                    {s === 4 && 'Besoins'}
                  </div>
                </div>
              ))}
            </div>
            <div className="progress-line">
              <div className="progress-fill" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            </div>
          </div>

          <div className="questionnaire-card" data-aos="fade-up" data-aos-delay="200">
            {step === 1 && (
              <div className="question-content">
                <h2>Quel type de site souhaitez-vous équiper ?</h2>
                <div className="site-types-grid">
                  {siteTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`site-type-card ${formData.siteType === type.value ? 'selected' : ''}`}
                      onClick={() => handleSiteTypeSelect(type.value)}
                    >
                      <i className={`fas ${type.icon}`}></i>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="question-content">
                <h2>Informations sur votre consommation</h2>
                <div className="form-inputs">
                  <div className="input-group">
                    <label>Montant mensuel de votre facture d'électricité (FCFA)</label>
                    <input
                      type="number"
                      value={formData.electricityBill || ''}
                      onChange={(e) => setFormData({ ...formData, electricityBill: Number(e.target.value) })}
                      placeholder="Ex: 500000"
                    />
                  </div>
                  <div className="input-group">
                    <label>Puissance de votre installation (kW)</label>
                    <input
                      type="number"
                      value={formData.installationPower || ''}
                      onChange={(e) => setFormData({ ...formData, installationPower: Number(e.target.value) })}
                      placeholder="Ex: 50"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="question-content">
                <h2>Quelles zones souhaitez-vous surveiller ?</h2>
                <p className="question-subtitle">Sélectionnez une ou plusieurs zones</p>
                <div className="options-grid">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      className={`option-card ${formData.zonesToMonitor.includes(zone) ? 'selected' : ''}`}
                      onClick={() => handleZoneToggle(zone)}
                    >
                      <i className={`fas ${formData.zonesToMonitor.includes(zone) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                      <span>{zone}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="question-content">
                <h2>Quels sont vos besoins spécifiques ?</h2>
                <p className="question-subtitle">Sélectionnez toutes les options qui vous intéressent</p>
                <div className="options-grid">
                  {needs.map((need) => (
                    <button
                      key={need}
                      className={`option-card ${formData.specificNeeds.includes(need) ? 'selected' : ''}`}
                      onClick={() => handleNeedToggle(need)}
                    >
                      <i className={`fas ${formData.specificNeeds.includes(need) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                      <span>{need}</span>
                    </button>
                  ))}
                </div>

                <div className="optional-inputs">
                  <div className="input-group">
                    <label>Nombre de points de mesure souhaités (optionnel)</label>
                    <input
                      type="number"
                      value={formData.measurementPoints || ''}
                      onChange={(e) => setFormData({ ...formData, measurementPoints: Number(e.target.value) })}
                      placeholder="Ex: 10"
                    />
                  </div>
                  <div className="input-group">
                    <label>Budget disponible en FCFA (optionnel)</label>
                    <input
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                      placeholder="Ex: 5000000"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              {step > 1 && (
                <button className="nav-btn secondary" onClick={handlePrevious}>
                  <i className="fas fa-arrow-left"></i> Précédent
                </button>
              )}
              <button
                className="nav-btn primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {step === 4 ? 'Voir les résultats' : 'Suivant'} <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SakkanalQualification;
