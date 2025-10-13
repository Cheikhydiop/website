import { supabase } from './supabase'

export const trainingDataService = {
  // Ajouter de nouvelles données d'entraînement
  async addTrainingData(trainingData) {
    const { data, error } = await supabase
      .from('ai_training_data')
      .insert([{
        site_type: trainingData.siteType,
        electricity_bill: parseFloat(trainingData.electricityBill),
        installation_power: parseFloat(trainingData.installationPower),
        budget: parseFloat(trainingData.budget),
        chosen_scenario_category: trainingData.chosenScenario,
        actual_savings_percent: parseFloat(trainingData.actualSavings),
        customer_satisfaction: parseInt(trainingData.satisfaction),
        roi_months: parseInt(trainingData.roiMonths),
        implementation_success: trainingData.implementationSuccess || true
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // Récupérer toutes les données d'entraînement
  async getAllTrainingData() {
    const { data, error } = await supabase
      .from('ai_training_data')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Récupérer les statistiques pour l'analyse
  async getTrainingStats() {
    const { data, error } = await supabase
      .from('ai_training_data')
      .select('*')

    if (error) throw error

    // Analyser les patterns par type de site
    const sitePatterns = {}
    const scenarioPatterns = {}

    data.forEach(item => {
      // Patterns par type de site
      if (!sitePatterns[item.site_type]) {
        sitePatterns[item.site_type] = {
          count: 0,
          totalSavings: 0,
          scenarios: {}
        }
      }
      sitePatterns[item.site_type].count++
      sitePatterns[item.site_type].totalSavings += item.actual_savings_percent

      // Compter les scénarios par type de site
      if (item.chosen_scenario_category) {
        if (!sitePatterns[item.site_type].scenarios[item.chosen_scenario_category]) {
          sitePatterns[item.site_type].scenarios[item.chosen_scenario_category] = 0
        }
        sitePatterns[item.site_type].scenarios[item.chosen_scenario_category]++
      }

      // Patterns par scénario
      if (item.chosen_scenario_category) {
        if (!scenarioPatterns[item.chosen_scenario_category]) {
          scenarioPatterns[item.chosen_scenario_category] = {
            count: 0,
            totalSavings: 0,
            totalROI: 0
          }
        }
        scenarioPatterns[item.chosen_scenario_category].count++
        scenarioPatterns[item.chosen_scenario_category].totalSavings += item.actual_savings_percent
        scenarioPatterns[item.chosen_scenario_category].totalROI += item.roi_months
      }
    })

    // Calculer les moyennes
    Object.keys(sitePatterns).forEach(siteType => {
      sitePatterns[siteType].avgSavings = 
        sitePatterns[siteType].totalSavings / sitePatterns[siteType].count
      
      // Trouver le scénario le plus choisi
      const scenarios = sitePatterns[siteType].scenarios
      const mostChosen = Object.keys(scenarios).reduce((a, b) => 
        scenarios[a] > scenarios[b] ? a : b
      )
      sitePatterns[siteType].mostChosen = mostChosen
    })

    Object.keys(scenarioPatterns).forEach(scenario => {
      scenarioPatterns[scenario].avgSavings = 
        scenarioPatterns[scenario].totalSavings / scenarioPatterns[scenario].count
      scenarioPatterns[scenario].avgROI = 
        scenarioPatterns[scenario].totalROI / scenarioPatterns[scenario].count
    })

    return {
      sitePatterns,
      scenarioPatterns,
      totalSamples: data.length
    }
  }
}