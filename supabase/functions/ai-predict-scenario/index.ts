// supabase/functions/calculate-scenario/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalculationInput {
  siteType: string
  electricityBill: number
  installationPower: number
  measurementPoints: number
  budget: number
  zonesToMonitor: string[]
  specificNeeds: string[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { input } = await req.json() as { input: CalculationInput }

    // 1. Récupérer tous les scénarios
    const { data: scenarios, error: scenariosError } = await supabaseClient
      .from('scenarios')
      .select('*')

    if (scenariosError) throw scenariosError

    // 2. Calculer les meilleures solutions (avec IA en backend)
    const results = await calculateOptimalSolutions(input, scenarios, supabaseClient)

    return new Response(
      JSON.stringify(results),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erreur calcul:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur lors du calcul des solutions' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function calculateOptimalSolutions(input: CalculationInput, scenarios: any[], supabaseClient: any) {
  // Récupérer données historiques pour améliorer les calculs
  const { data: historicalData } = await supabaseClient
    .from('ai_training_data')
    .select('*')
    .eq('site_type', input.siteType)
    .gte('electricity_bill', input.electricityBill * 0.7)
    .lte('electricity_bill', input.electricityBill * 1.3)
    .eq('implementation_success', true)
    .limit(50)

  // Calculer le score pour chaque scénario
  const scoredScenarios = scenarios.map(scenario => {
    const calculation = performAdvancedCalculation(input, scenario, historicalData || [])
    return {
      scenario,
      score: calculation.score,
      calculatedSavings: calculation.calculatedSavings,
      calculatedROI: calculation.calculatedROI,
      matchReasons: calculation.matchReasons,
      monthlySavings: calculation.monthlySavings,
      annualSavings: calculation.annualSavings
    }
  })

  // Trier et prendre les 3 meilleurs
  const topScenarios = scoredScenarios
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  // Générer des conseils personnalisés
  const personalizedAdvice = generatePersonalizedAdvice(input, topScenarios)

  // Sauvegarder discrètement les calculs pour améliorer le modèle
  await supabaseClient
    .from('ai_predictions')
    .insert({
      input_data: input,
      predicted_scenario_id: topScenarios[0].scenario.id,
      predicted_savings: topScenarios[0].calculatedSavings,
      predicted_roi_months: topScenarios[0].calculatedROI,
      confidence_score: topScenarios[0].score / 100
    })
    .then(() => console.log('Calcul sauvegardé'))
    .catch(err => console.error('Erreur sauvegarde calcul:', err))

  return {
    scenarios: topScenarios,
    advice: personalizedAdvice
  }
}

function performAdvancedCalculation(input: CalculationInput, scenario: any, historicalData: any[]) {
  let score = 0
  const matchReasons: string[] = []

  // 1. Analyse de compatibilité (30 points)
  if (scenario.site_types.includes(input.siteType)) {
    score += 30
    matchReasons.push('Parfaitement adapté à votre type de site')
  }

  // 2. Analyse budget (25 points)
  if (input.budget > 0) {
    if (input.budget >= scenario.min_budget && 
        (!scenario.max_budget || input.budget <= scenario.max_budget)) {
      score += 25
      matchReasons.push('Correspond parfaitement à votre budget')
    } else if (input.budget >= scenario.min_budget * 0.7) {
      score += 15
      matchReasons.push('Budget légèrement inférieur mais réalisable')
    }
  } else {
    score += 10 // Budget non précisé
  }

  // 3. Analyse basée sur données historiques (25 points)
  const similarCases = historicalData.filter(
    d => d.chosen_scenario_category === scenario.category
  )

  if (similarCases.length > 0) {
    const avgSavings = similarCases.reduce((sum, c) => sum + c.actual_savings_percent, 0) / similarCases.length
    const successRate = similarCases.filter(c => c.implementation_success).length / similarCases.length
    
    score += successRate * 15
    score += Math.min((avgSavings / 40) * 10, 10)
    
    matchReasons.push(`Solution éprouvée avec ${Math.round(successRate * 100)}% de succès`)
    matchReasons.push(`Économies moyennes constatées: ${avgSavings.toFixed(1)}%`)
  }

  // 4. Analyse consommation (15 points)
  if (input.electricityBill > 500000 && scenario.category === 'premium') {
    score += 15
    matchReasons.push('Optimisé pour les hautes consommations')
  } else if (input.electricityBill > 200000 && scenario.category === 'standard') {
    score += 15
    matchReasons.push('Idéal pour votre niveau de consommation')
  } else if (scenario.category === 'economique') {
    score += 12
    matchReasons.push('Solution économique efficace')
  }

  // 5. Analyse besoins spécifiques (10 points)
  const needsMapping = {
    'IA prédictive': { premium: 5, standard: 2, economique: 0 },
    'Pilotage à distance': { premium: 3, standard: 3, economique: 1 },
    'Maintenance prédictive': { premium: 4, standard: 1, economique: 0 },
    'Rapports automatiques': { premium: 2, standard: 2, economique: 1 }
  }

  input.specificNeeds.forEach(need => {
    if (needsMapping[need]) {
      const points = needsMapping[need][scenario.category] || 0
      if (points > 0) {
        score += points
        matchReasons.push(`Inclut: ${need}`)
      }
    }
  })

  // 6. Calcul des économies ajustées
  let calculatedSavings = scenario.estimated_savings

  // Ajustement avec historique
  if (similarCases.length >= 3) {
    const historicalAdjustment = similarCases.reduce(
      (sum, c) => sum + c.actual_savings_percent, 0
    ) / similarCases.length
    
    calculatedSavings = (calculatedSavings * 0.6) + (historicalAdjustment * 0.4)
  }

  // Facteurs d'ajustement
  if (input.installationPower > 100) calculatedSavings += 1.5
  if (input.measurementPoints > 15) calculatedSavings += 1
  if (input.specificNeeds.includes('IA prédictive')) calculatedSavings += 2

  calculatedSavings = Math.min(Math.max(calculatedSavings, 10), 45)

  // 7. Calcul ROI
  const monthlySavings = (input.electricityBill * calculatedSavings) / 100
  const annualSavings = monthlySavings * 12
  const estimatedCost = (scenario.min_budget + (scenario.max_budget || scenario.min_budget * 1.5)) / 2
  const calculatedROI = Math.ceil(estimatedCost / monthlySavings)

  return {
    score: Math.round(score),
    calculatedSavings: Math.round(calculatedSavings * 10) / 10,
    calculatedROI,
    matchReasons,
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings)
  }
}

function generatePersonalizedAdvice(input: CalculationInput, topScenarios: any[]) {
  const advice = []

  // Conseil ROI
  const bestROI = topScenarios[0].calculatedROI
  if (bestROI <= 12) {
    advice.push({
      type: 'financial',
      title: 'Retour sur investissement rapide',
      description: `Votre investissement sera rentabilisé en ${bestROI} mois seulement`,
      impact: 'Rentabilité garantée'
    })
  }

  // Conseil installation
  if (input.installationPower > 150) {
    advice.push({
      type: 'technical',
      title: 'Installation importante détectée',
      description: 'Nos solutions sont optimisées pour les grandes puissances installées',
      impact: 'Performance maximisée'
    })
  }

  // Conseil mesures
  if (input.measurementPoints < 5 && input.electricityBill > 300000) {
    advice.push({
      type: 'optimization',
      title: 'Optimisation des points de mesure recommandée',
      description: 'Augmentez votre couverture de mesure pour de meilleurs résultats',
      impact: '+5 à 10% d\'économies supplémentaires'
    })
  }

  return advice
}