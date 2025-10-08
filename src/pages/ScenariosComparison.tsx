import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase, type Scenario, type Product } from '../lib/supabase';
import type { QuestionnaireData } from './SakkanalQualification';
import './ScenariosComparison.css';

type ComparisonMetrics = {
  initialInvestment: number;
  monthlySavings: number;
  annualSavings: number;
  roiMonths: number;
  totalSavings5Years: number;
  energyEfficiency: number;
};

type EnrichedScenario = {
  scenario: Scenario;
  products: Product[];
  metrics: ComparisonMetrics;
  score: number;
};

const ScenariosComparison: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<EnrichedScenario[]>([]);
  const [selectedView, setSelectedView] = useState<'table' | 'cards'>('cards');

  const formData = (location.state as { formData: QuestionnaireData })?.formData;

  useEffect(() => {
    if (!formData) {
      navigate('/sakkanal/qualification');
      return;
    }

    loadScenariosWithProducts();
  }, [formData]);

  const loadScenariosWithProducts = async () => {
    try {
      setLoading(true);

      const { data: scenariosData, error: scenariosError } = await supabase
        .from('scenarios')
        .select('*')
        .order('category', { ascending: true });

      if (scenariosError) throw scenariosError;

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      const enriched = scenariosData!.map(scenario => {
        const metrics = calculateMetrics(scenario, formData!);
        const score = calculateCompatibilityScore(scenario, formData!);

        return {
          scenario,
          products: productsData || [],
          metrics,
          score
        };
      }).sort((a, b) => b.score - a.score);

      setScenarios(enriched);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (scenario: Scenario, data: QuestionnaireData): ComparisonMetrics => {
    const budget = scenario.min_budget + (scenario.max_budget ? (scenario.max_budget - scenario.min_budget) / 2 : scenario.min_budget * 0.5);
    const monthlySavings = (data.electricityBill * scenario.estimated_savings) / 100;
    const annualSavings = monthlySavings * 12;
    const roiMonths = Math.round(budget / monthlySavings);
    const totalSavings5Years = (annualSavings * 5) - budget;

    let energyEfficiency = 70;
    if (scenario.category === 'premium') energyEfficiency = 95;
    else if (scenario.category === 'standard') energyEfficiency = 85;

    return {
      initialInvestment: budget,
      monthlySavings,
      annualSavings,
      roiMonths,
      totalSavings5Years,
      energyEfficiency
    };
  };

  const calculateCompatibilityScore = (scenario: Scenario, data: QuestionnaireData): number => {
    let score = 0;

    if (scenario.site_types.includes(data.siteType)) score += 30;

    if (data.budget > 0) {
      if (data.budget >= scenario.min_budget && (!scenario.max_budget || data.budget <= scenario.max_budget)) {
        score += 25;
      }
    } else {
      score += 10;
    }

    const monthlyCost = data.electricityBill;
    if (monthlyCost > 500000 && scenario.category === 'premium') score += 25;
    else if (monthlyCost > 200000 && scenario.category === 'standard') score += 20;
    else if (scenario.category === 'economique') score += 15;

    if (data.measurementPoints > 15 && scenario.category === 'premium') score += 10;
    else if (data.measurementPoints > 5 && scenario.category === 'standard') score += 10;

    if (data.specificNeeds.includes('Maintenance préventive') && scenario.category === 'premium') score += 10;

    return score;
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'economique': return 'fa-seedling';
      case 'standard': return 'fa-chart-line';
      case 'premium': return 'fa-crown';
      default: return 'fa-box';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'economique': return '#10b981';
      case 'standard': return '#3b82f6';
      case 'premium': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="comparison-page">
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Analyse comparative en cours...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="comparison-page">
      <Header />

      <section className="comparison-section">
        <div className="container">
          <div className="comparison-header" data-aos="fade-up">
            <div className="header-content">
              <h1>Comparaison des <span className="gradient-text">Solutions</span></h1>
              <p>Analyse détaillée des options techniques adaptées à votre profil</p>
            </div>

            <div className="view-toggle">
              <button
                className={`toggle-btn ${selectedView === 'cards' ? 'active' : ''}`}
                onClick={() => setSelectedView('cards')}
              >
                <i className="fas fa-th-large"></i> Cartes
              </button>
              <button
                className={`toggle-btn ${selectedView === 'table' ? 'active' : ''}`}
                onClick={() => setSelectedView('table')}
              >
                <i className="fas fa-table"></i> Tableau
              </button>
            </div>
          </div>

          <div className="profile-summary" data-aos="fade-up" data-aos-delay="100">
            <h3><i className="fas fa-user-circle"></i> Votre Profil</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <span className="label">Type d'entreprise:</span>
                <span className="value">{formData.siteType}</span>
              </div>
              <div className="profile-item">
                <span className="label">Besoin principal:</span>
                <span className="value">Réduction des coûts énergétiques</span>
              </div>
              <div className="profile-item">
                <span className="label">Consommation:</span>
                <span className="value">{(formData.electricityBill / 30000).toFixed(1)} kWh/jour estimé</span>
              </div>
              <div className="profile-item">
                <span className="label">Contraintes:</span>
                <span className="value">{formData.budget > 0 ? `Budget: ${formData.budget.toLocaleString()} FCFA` : 'À définir'}</span>
              </div>
            </div>
          </div>

          {selectedView === 'cards' ? (
            <div className="scenarios-comparison-grid">
              {scenarios.map((item, index) => (
                <div
                  key={item.scenario.id}
                  className={`comparison-card ${index === 0 ? 'best-match' : ''}`}
                  data-aos="fade-up"
                  data-aos-delay={150 + index * 100}
                >
                  {index === 0 && (
                    <div className="best-match-badge">
                      <i className="fas fa-trophy"></i> Meilleur choix
                    </div>
                  )}

                  <div className="card-header" style={{ borderColor: getCategoryColor(item.scenario.category) }}>
                    <div className="header-top">
                      <i className={`fas ${getCategoryIcon(item.scenario.category)}`}
                         style={{ color: getCategoryColor(item.scenario.category) }}></i>
                      <span className="category-badge" style={{ backgroundColor: getCategoryColor(item.scenario.category) }}>
                        {item.scenario.category}
                      </span>
                    </div>
                    <h3>{item.scenario.name}</h3>
                    <div className="compatibility-score">
                      <span className="score-label">Compatibilité:</span>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: getCategoryColor(item.scenario.category)
                          }}
                        ></div>
                      </div>
                      <span className="score-value">{item.score}%</span>
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="description">{item.scenario.description}</p>

                    <div className="metrics-grid">
                      <div className="metric-box">
                        <i className="fas fa-wallet"></i>
                        <span className="metric-label">Investissement initial</span>
                        <span className="metric-value">{item.metrics.initialInvestment.toLocaleString()} FCFA</span>
                      </div>

                      <div className="metric-box highlight">
                        <i className="fas fa-piggy-bank"></i>
                        <span className="metric-label">Économies mensuelles</span>
                        <span className="metric-value">{item.metrics.monthlySavings.toLocaleString()} FCFA</span>
                      </div>

                      <div className="metric-box">
                        <i className="fas fa-chart-bar"></i>
                        <span className="metric-label">Économies annuelles</span>
                        <span className="metric-value">{item.metrics.annualSavings.toLocaleString()} FCFA</span>
                      </div>

                      <div className="metric-box">
                        <i className="fas fa-clock"></i>
                        <span className="metric-label">ROI</span>
                        <span className="metric-value">{item.metrics.roiMonths} mois</span>
                      </div>

                      <div className="metric-box">
                        <i className="fas fa-calendar-check"></i>
                        <span className="metric-label">Gain sur 5 ans</span>
                        <span className="metric-value">{item.metrics.totalSavings5Years.toLocaleString()} FCFA</span>
                      </div>

                      <div className="metric-box">
                        <i className="fas fa-leaf"></i>
                        <span className="metric-label">Efficacité énergétique</span>
                        <span className="metric-value">{item.metrics.energyEfficiency}%</span>
                      </div>
                    </div>

                    <div className="features-list">
                      <h4>Points clés:</h4>
                      <ul>
                        <li><i className="fas fa-check"></i> Durée de vie: {item.scenario.equipment_lifespan} ans</li>
                        <li><i className="fas fa-check"></i> Économies estimées: {item.scenario.estimated_savings}%</li>
                        <li><i className="fas fa-check"></i> Sites compatibles: {item.scenario.site_types.join(', ')}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="action-btn primary"
                      onClick={() => navigate('/sakkanal/results', { state: { formData } })}
                    >
                      <i className="fas fa-eye"></i> Voir détails
                    </button>
                    <button className="action-btn secondary">
                      <i className="fas fa-file-pdf"></i> Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="comparison-table-container" data-aos="fade-up" data-aos-delay="150">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Critère</th>
                    {scenarios.map(item => (
                      <th key={item.scenario.id}>
                        <div className="table-header">
                          <i className={`fas ${getCategoryIcon(item.scenario.category)}`}></i>
                          <span>{item.scenario.name}</span>
                          <span className="category-pill" style={{ backgroundColor: getCategoryColor(item.scenario.category) }}>
                            {item.scenario.category}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">Compatibilité</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>
                        <div className="score-cell">
                          <div className="mini-score-bar">
                            <div className="mini-score-fill" style={{ width: `${item.score}%` }}></div>
                          </div>
                          <span>{item.score}%</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Investissement initial</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>{item.metrics.initialInvestment.toLocaleString()} FCFA</td>
                    ))}
                  </tr>
                  <tr className="highlight-row">
                    <td className="row-label">Économies mensuelles</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id} className="highlight">
                        {item.metrics.monthlySavings.toLocaleString()} FCFA
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Économies annuelles</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>{item.metrics.annualSavings.toLocaleString()} FCFA</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">ROI (mois)</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>{item.metrics.roiMonths} mois</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Gain sur 5 ans</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>{item.metrics.totalSavings5Years.toLocaleString()} FCFA</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Efficacité énergétique</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>{item.metrics.energyEfficiency}%</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Durée de vie équipement</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>{item.scenario.equipment_lifespan} ans</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Actions</td>
                    {scenarios.map(item => (
                      <td key={item.scenario.id}>
                        <div className="table-actions">
                          <button
                            className="mini-btn primary"
                            onClick={() => navigate('/sakkanal/results', { state: { formData } })}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="mini-btn secondary">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="comparison-cta" data-aos="fade-up">
            <h2>Besoin d'aide pour choisir ?</h2>
            <p>Nos experts peuvent vous guider vers la solution la plus adaptée à vos besoins</p>
            <div className="cta-buttons">
              <button
                className="cta-btn primary"
                onClick={() => navigate('/sakkanal/results', { state: { formData } })}
              >
                <i className="fas fa-user-tie"></i> Consulter un expert
              </button>
              <button
                className="cta-btn secondary"
                onClick={() => navigate('/sakkanal/qualification')}
              >
                <i className="fas fa-redo"></i> Refaire l'analyse
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScenariosComparison;
