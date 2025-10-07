// utils/leadScoring.ts
import type { Lead } from '../lib/supabase';

export interface LeadScore {
  total: number;
  breakdown: {
    electricity: number;
    power: number;
    budget: number;
    needs: number;
    zones: number;
  };
  priority: 'HOT' | 'WARM' | 'COLD';
  label: string;
  color: string;
}

export const calculateLeadScore = (lead: Lead): LeadScore => {
  const breakdown = {
    electricity: 0,
    power: 0,
    budget: 0,
    needs: 0,
    zones: 0,
  };

  // 1. Score basé sur la facture électrique (max 30 points)
  if (lead.electricity_bill >= 500000) {
    breakdown.electricity = 30;
  } else if (lead.electricity_bill >= 300000) {
    breakdown.electricity = 25;
  } else if (lead.electricity_bill >= 200000) {
    breakdown.electricity = 20;
  } else if (lead.electricity_bill >= 100000) {
    breakdown.electricity = 15;
  } else if (lead.electricity_bill >= 50000) {
    breakdown.electricity = 10;
  } else {
    breakdown.electricity = 5;
  }

  // 2. Score basé sur la puissance installée (max 25 points)
  if (lead.installation_power && lead.installation_power >= 100) {
    breakdown.power = 25;
  } else if (lead.installation_power && lead.installation_power >= 75) {
    breakdown.power = 20;
  } else if (lead.installation_power && lead.installation_power >= 50) {
    breakdown.power = 15;
  } else if (lead.installation_power && lead.installation_power >= 25) {
    breakdown.power = 10;
  } else {
    breakdown.power = 5;
  }

  // 3. Score basé sur le budget (max 20 points)
  if (lead.budget) {
    if (lead.budget >= 15000000) {
      breakdown.budget = 20;
    } else if (lead.budget >= 10000000) {
      breakdown.budget = 17;
    } else if (lead.budget >= 5000000) {
      breakdown.budget = 14;
    } else if (lead.budget >= 3000000) {
      breakdown.budget = 10;
    } else {
      breakdown.budget = 5;
    }
  }

  // 4. Score basé sur le nombre de besoins spécifiques (max 15 points)
  const needsCount = lead.specific_needs?.length || 0;
  breakdown.needs = Math.min(needsCount * 4, 15);

  // 5. Score basé sur le nombre de zones à surveiller (max 10 points)
  const zonesCount = lead.zones_to_monitor?.length || 0;
  breakdown.zones = Math.min(zonesCount * 2.5, 10);

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  // Déterminer la priorité
  let priority: 'HOT' | 'WARM' | 'COLD';
  let label: string;
  let color: string;

  if (total >= 70) {
    priority = 'HOT';
    label = 'Priorité Haute';
    color = '#e74c3c';
  } else if (total >= 45) {
    priority = 'WARM';
    label = 'Priorité Moyenne';
    color = '#f39c12';
  } else {
    priority = 'COLD';
    label = 'Priorité Basse';
    color = '#3498db';
  }

  return {
    total: Math.round(total),
    breakdown,
    priority,
    label,
    color,
  };
};

export const getScoreColor = (score: number): string => {
  if (score >= 70) return '#e74c3c';
  if (score >= 45) return '#f39c12';
  return '#3498db';
};

export const getScoreGradient = (score: number): string => {
  if (score >= 70) return 'linear-gradient(135deg, #e74c3c, #c0392b)';
  if (score >= 45) return 'linear-gradient(135deg, #f39c12, #e67e22)';
  return 'linear-gradient(135deg, #3498db, #2980b9)';
};

// Fonction pour calculer le potentiel commercial estimé
export const estimateCommercialPotential = (lead: Lead): number => {
  // Estimation basée sur la facture électrique annuelle et un pourcentage moyen
  const annualBill = lead.electricity_bill * 12;
  
  // Estimation: installation représente environ 2-3 fois la facture annuelle
  const estimatedInstallation = annualBill * 2.5;
  
  // Si budget défini, prendre le minimum entre les deux
  if (lead.budget && lead.budget > 0) {
    return Math.min(estimatedInstallation, lead.budget);
  }
  
  return estimatedInstallation;
};

// Analyse des besoins pour recommandations
export const analyzeLeadNeeds = (lead: Lead): {
  primaryNeed: string;
  recommendedScenario: 'economic' | 'standard' | 'premium';
  urgency: 'high' | 'medium' | 'low';
} => {
  const needs = lead.specific_needs || [];
  
  // Déterminer le besoin principal
  let primaryNeed = 'Surveillance générale';
  if (needs.includes('Réduire les coûts')) {
    primaryNeed = 'Réduction des coûts énergétiques';
  } else if (needs.includes('Optimiser la maintenance')) {
    primaryNeed = 'Optimisation de la maintenance';
  } else if (needs.includes('Accompagner une extension')) {
    primaryNeed = 'Extension de capacité';
  } else if (needs.includes('Surveillance/suivi de la consommation')) {
    primaryNeed = 'Monitoring énergétique';
  }
  
  // Recommander un scénario basé sur le score et budget
  const score = calculateLeadScore(lead);
  let recommendedScenario: 'economic' | 'standard' | 'premium';
  
  if (score.total >= 70 || (lead.budget && lead.budget >= 10000000)) {
    recommendedScenario = 'premium';
  } else if (score.total >= 45 || (lead.budget && lead.budget >= 5000000)) {
    recommendedScenario = 'standard';
  } else {
    recommendedScenario = 'economic';
  }
  
  // Déterminer l'urgence
  let urgency: 'high' | 'medium' | 'low';
  if (needs.includes('Réduire les coûts') && lead.electricity_bill > 300000) {
    urgency = 'high';
  } else if (needs.includes('Accompagner une extension')) {
    urgency = 'high';
  } else if (needs.length >= 3) {
    urgency = 'medium';
  } else {
    urgency = 'low';
  }
  
  return { primaryNeed, recommendedScenario, urgency };
};

// Fonction pour obtenir des insights sur un lead
export const getLeadInsights = (lead: Lead): string[] => {
  const insights: string[] = [];
  const score = calculateLeadScore(lead);
  const potential = estimateCommercialPotential(lead);
  const analysis = analyzeLeadNeeds(lead);
  
  if (score.priority === 'HOT') {
    insights.push('🔥 Lead à forte valeur - Priorité de contact immédiate');
  }
  
  if (lead.electricity_bill > 400000) {
    insights.push('💰 Facture élevée - Fort potentiel d\'économies');
  }
  
  if (lead.installation_power && lead.installation_power > 75) {
    insights.push('⚡ Installation importante - Solution complète recommandée');
  }
  
  if (analysis.urgency === 'high') {
    insights.push('⏱️ Besoin urgent identifié - Contact rapide nécessaire');
  }
  
  if (potential > 10000000) {
    insights.push(`💎 Potentiel commercial estimé: ${(potential / 1000000).toFixed(1)}M FCFA`);
  }
  
  if (lead.specific_needs && lead.specific_needs.length >= 3) {
    insights.push('🎯 Besoins multiples - Opportunité cross-sell');
  }
  
  if (lead.zones_to_monitor && lead.zones_to_monitor.length >= 5) {
    insights.push('📊 Nombreuses zones - Installation complexe');
  }
  
  return insights;
};