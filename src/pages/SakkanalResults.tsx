import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LeadForm from '../components/LeadForm';
import { supabase, type Scenario } from '../lib/supabase';
import type { QuestionnaireData } from './SakkanalQualification';
import { PdfSakkanalGenerator } from '../services/pdf-generators/PdfSakkanalGenerator';
import './SakkanalResults.css';

type AIPrediction = {
  scenarioId: string;
  scenarioName: string;
  scenarioCategory: string;
  predictedSavings: number;
  confidenceScore: number;
  predictedROIMonths: number;
  reasoning: string[];
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
};

type AIRecommendation = {
  type: string;
  title: string;
  description: string;
  priority: number;
  expectedImpact: string;
};

type RecommendedScenario = {
  scenario: Scenario;
  score: number;
  matchReason: string;
  aiPrediction?: AIPrediction;
};

const SakkanalResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<RecommendedScenario[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const formData = (location.state as { formData: QuestionnaireData })?.formData;

  useEffect(() => {
    if (!formData) {
      navigate('/sakkanal/qualification');
      return;
    }

    loadAIPredictions();
  }, [formData]);

  // Appeler l'IA en arrière-plan (le client ne le sait pas)
  const loadAIPredictions = async () => {
    try {
      setLoading(true);

      // Appel silencieux à l'IA
      const { data, error } = await supabase.functions.invoke('ai-predict-scenario', {
        body: {
          input: {
            siteType: formData!.siteType,
            electricityBill: formData!.electricityBill,
            installationPower: formData!.installationPower,
            measurementPoints: formData!.measurementPoints,
            budget: formData!.budget,
            zonesToMonitor: formData!.zonesToMonitor,
            specificNeeds: formData!.specificNeeds
          }
        }
      });

      if (error) {
        console.error('Erreur prédiction:', error);
        loadAndMatchScenarios();
        return;
      }

      // Récupérer les scénarios complets
      const { data: allScenarios, error: scenariosError } = await supabase
        .from('scenarios')
        .select('*');

      if (scenariosError) throw scenariosError;

      // Mapper les prédictions avec les scénarios
      const enrichedScenarios: RecommendedScenario[] = data.predictions.map((pred: AIPrediction) => {
        const scenario = allScenarios?.find(s => s.id === pred.scenarioId);
        return {
          scenario: scenario!,
          score: pred.confidenceScore * 100,
          matchReason: pred.reasoning.join(', '),
          aiPrediction: pred
        };
      });

      setScenarios(enrichedScenarios);
      setAiRecommendations(data.recommendations || []);

    } catch (error) {
      console.error('Erreur chargement:', error);
      loadAndMatchScenarios();
    } finally {
      setLoading(false);
    }
  };

  // Fallback classique
  const loadAndMatchScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('category', { ascending: true });
  
      if (error) throw error;
  
      const matched = matchScenarios(data || []);
      setScenarios(matched);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const matchScenarios = (allScenarios: Scenario[]): RecommendedScenario[] => {
    if (!formData) return [];

    return allScenarios
      .map((scenario) => {
        let score = 0;
        const reasons: string[] = [];

        if (scenario.site_types.includes(formData.siteType)) {
          score += 30;
          reasons.push('Compatible avec votre type de site');
        }

        if (formData.budget > 0) {
          if (
            formData.budget >= scenario.min_budget &&
            (!scenario.max_budget || formData.budget <= scenario.max_budget)
          ) {
            score += 25;
            reasons.push('Correspond à votre budget');
          }
        } else {
          score += 10;
        }

        const estimatedMonthlyCost = formData.electricityBill;
        if (estimatedMonthlyCost > 500000 && scenario.category === 'premium') {
          score += 20;
          reasons.push('Recommandé pour votre niveau de consommation');
        } else if (estimatedMonthlyCost > 200000 && scenario.category === 'standard') {
          score += 20;
          reasons.push('Optimal pour votre consommation');
        } else if (scenario.category === 'economique') {
          score += 15;
          reasons.push('Solution économique adaptée');
        }

        if (formData.specificNeeds.includes('IA prédictive') && scenario.category === 'premium') {
          score += 15;
          reasons.push('Inclut intelligence artificielle');
        }

        if (formData.specificNeeds.includes('Pilotage à distance')) {
          score += 10;
          reasons.push('Contrôle à distance disponible');
        }

        return {
          scenario,
          score,
          matchReason: reasons.join(', '),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const calculateMonthlySavings = (electricityBill: number, savingsPercent: number): number => {
    return (electricityBill * savingsPercent) / 100;
  };

  const calculateAnnualSavings = (monthlySavings: number): number => {
    return monthlySavings * 12;
  };

  const generatePDFReport = (scenario: Scenario, userData: any) => {
    if (!userData || !userData.fullName || !userData.email) {
      alert('Erreur: Informations utilisateur incomplètes.');
      return;
    }

    try {
      const pdfGenerator = new PdfSakkanalGenerator();
      const doc = pdfGenerator.generateSakkanalPDF(
        scenario,
        userData,
        formData!
      );
      doc.save(`Rapport_Sakkanal_${scenario.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Erreur PDF:', error);
      alert('Erreur lors de la génération du rapport.');
    }
  };

  const handleContactRequest = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setShowLeadForm(true);
  };

  const handleDownloadRequest = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setShowLeadForm(true);
  };

  const handleLeadFormSuccess = (userData: any) => {
    setShowLeadForm(false);

    if (selectedScenario) {
      if (!userData || !userData.fullName) {
        alert('Erreur: Informations manquantes.');
        return;
      }

      setTimeout(() => {
        generatePDFReport(selectedScenario, userData);
        alert('✅ Votre rapport a été téléchargé ! Un conseiller vous contactera sous 24-48h.');
      }, 500);
    } else {
      alert('✅ Votre demande a été envoyée ! Nous vous contacterons très prochainement.');
    }
  };

  const getCategoryBadgeClass = (category: string): string => {
    switch (category) {
      case 'economique':
        return 'badge-economique';
      case 'standard':
        return 'badge-standard';
      case 'premium':
        return 'badge-premium';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="results-page">
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Analyse de vos besoins en cours...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="results-page">
      <Header />

      <section className="results-section">
        <div className="container">
          <div className="results-header" data-aos="fade-up">
            <h1>Vos solutions <span className="gradient-text">personnalisées</span></h1>
            <p>Nous avons analysé vos besoins et voici nos recommandations</p>
          </div>

          <div className="results-summary" data-aos="fade-up" data-aos-delay="100">
            <div className="summary-card">
              <i className="fas fa-building"></i>
              <div>
                <span className="summary-label">Type de site</span>
                <span className="summary-value">{formData.siteType}</span>
              </div>
            </div>
            <div className="summary-card">
              <i className="fas fa-bolt"></i>
              <div>
                <span className="summary-label">Facture mensuelle</span>
                <span className="summary-value">{formData.electricityBill.toLocaleString()} FCFA</span>
              </div>
            </div>
            <div className="summary-card">
              <i className="fas fa-plug"></i>
              <div>
                <span className="summary-label">Puissance installée</span>
                <span className="summary-value">{formData.installationPower} kW</span>
              </div>
            </div>
          </div>

          {/* Recommandations (sans mentionner l'IA) */}
          {aiRecommendations.length > 0 && (
            <div className="ai-recommendations" data-aos="fade-up" data-aos-delay="150">
              <h2>💡 Recommandations pour optimiser vos économies</h2>
              <div className="recommendations-grid">
                {aiRecommendations.map((rec, idx) => (
                  <div key={idx} className={`recommendation-card priority-${rec.priority}`}>
                    <div className="recommendation-header">
                      <i className={`fas ${
                        rec.type === 'optimization' ? 'fa-lightbulb' :
                        rec.type === 'scenario' ? 'fa-star' : 'fa-tools'
                      }`}></i>
                      <h3>{rec.title}</h3>
                    </div>
                    <p>{rec.description}</p>
                    <div className="recommendation-impact">
                      <span className="impact-label">Impact attendu:</span>
                      <span className="impact-value">{rec.expectedImpact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="scenarios-grid">
            {scenarios.map((item, index) => {
              // Utiliser les prédictions de l'IA (sans le dire au client)
              const savingsPercent = item.aiPrediction?.predictedSavings || item.scenario.estimated_savings;
              const monthlySavings = item.aiPrediction?.estimatedMonthlySavings || 
                calculateMonthlySavings(formData.electricityBill, savingsPercent);
              const annualSavings = item.aiPrediction?.estimatedAnnualSavings || 
                calculateAnnualSavings(monthlySavings);
              // const roiMonths = item.aiPrediction?.predictedROIMonths;

              return (
                <div
                  key={item.scenario.id}
                  className={`scenario-card ${index === 0 ? 'recommended' : ''}`}
                  data-aos="fade-up"
                  data-aos-delay={200 + index * 100}
                >
                  {index === 0 && (
                    <div className="recommended-badge">
                      <i className="fas fa-star"></i> Recommandé pour vous
                    </div>
                  )}

                  <div className="scenario-header">
                    <div>
                      <h3>{item.scenario.name}</h3>
                      <span className={`category-badge ${getCategoryBadgeClass(item.scenario.category)}`}>
                        {item.scenario.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="scenario-description">{item.scenario.description}</p>

                  <div className="scenario-match">
                    <i className="fas fa-check-circle"></i>
                    <span>{item.matchReason}</span>
                  </div>
                  <div className="scenario-metrics">
                    <div className="metric metric-full">
                      <div className="metric-icon">
                        <i className="fas fa-percentage"></i>
                      </div>
                      <div>
                        <span className="metric-value">{savingsPercent}%</span>
                        <span className="metric-label">Économies estimées</span>
                      </div>
                    </div>

                    <div className="metric metric-full">
                      <div className="metric-icon">
                        <i className="fas fa-coins"></i>
                      </div>
                      <div>
                        <span className="metric-value">{Math.round(monthlySavings).toLocaleString()} FCFA</span>
                        <span className="metric-label">Économies mensuelles</span>
                      </div>
                    </div>

                    <div className="metric metric-full highlight">
                      <div className="metric-icon">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <div>
                        <span className="metric-value">{Math.round(annualSavings).toLocaleString()} FCFA</span>
                        <span className="metric-label">Économies annuelles</span>
                      </div>
                    </div>
                  </div>

                  <div className="scenario-actions">
                    <button
                      className="action-btn primary"
                      onClick={() => handleContactRequest(item.scenario)}
                    >
                      <i className="fas fa-user-tie"></i> Contacter un conseiller
                    </button>
                    <button 
                      className="action-btn secondary"
                      onClick={() => handleDownloadRequest(item.scenario)}
                    >
                      <i className="fas fa-file-pdf"></i> Télécharger le rapport
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="results-cta" data-aos="fade-up">
            <h2>Besoin d'aide pour choisir ?</h2>
            <p>Nos experts sont là pour vous accompagner dans votre projet</p>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => navigate('/sakkanal/comparison', { state: { formData } })}>
                <i className="fas fa-balance-scale"></i> Comparer les solutions
              </button>
              <button className="cta-btn secondary" onClick={() => navigate('/sakkanal/qualification')}>
                <i className="fas fa-redo"></i> Refaire le questionnaire
              </button>
            </div>
          </div>
        </div>
      </section>

      {showLeadForm && selectedScenario && formData && (
        <LeadForm
          scenario={selectedScenario}
          formData={formData}
          onClose={() => setShowLeadForm(false)}
          onSuccess={handleLeadFormSuccess}
        />
      )}
    </div>
  );
};

export default SakkanalResults;