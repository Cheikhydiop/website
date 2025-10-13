import { supabase } from './supabase'

export const predictionService = {
  // Enregistrer une nouvelle prédiction
  async createPrediction(predictionData) {
    const { data, error } = await supabase
      .from('ai_predictions')
      .insert([{
        lead_id: predictionData.leadId,
        input_data: predictionData.inputData,
        predicted_scenario_id: predictionData.predictedScenarioId,
        predicted_savings: predictionData.predictedSavings,
        predicted_roi_months: predictionData.predictedRoiMonths,
        confidence_score: predictionData.confidenceScore
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // Mettre à jour une prédiction avec les résultats réels
  async updatePredictionWithResults(predictionId, actualData) {
    const { data, error } = await supabase
      .from('ai_predictions')
      .update({
        actual_scenario_id: actualData.actualScenarioId,
        actual_savings: actualData.actualSavings,
        feedback_score: actualData.feedbackScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', predictionId)
      .select()

    if (error) throw error
    return data[0]
  },

  // Récupérer les prédictions pour calculer la précision
  async getPredictionsForAccuracy() {
    const { data, error } = await supabase
      .from('ai_predictions')
      .select('*')
      .not('actual_savings', 'is', null)

    if (error) throw error
    return data
  }
}