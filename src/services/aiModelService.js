import { supabase } from './supabase'

export const aiModelService = {
  // Récupérer les métriques du modèle actif
  async getActiveModelMetrics() {
    const { data, error } = await supabase
      .from('ai_model_metrics')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  },

  // Récupérer l'historique d'entraînement
  async getTrainingHistory() {
    const { data, error } = await supabase
      .from('ai_model_metrics')
      .select('*')
      .order('last_trained_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Créer de nouvelles métriques après entraînement
  async createModelMetrics(metrics) {
    const { data, error } = await supabase
      .from('ai_model_metrics')
      .insert([{
        model_version: metrics.modelVersion,
        accuracy: metrics.accuracy,
        precision_score: metrics.precision,
        recall_score: metrics.recall,
        f1_score: metrics.f1,
        mean_absolute_error: metrics.mae,
        training_samples: metrics.trainingSamples,
        last_trained_at: new Date().toISOString(),
        is_active: true
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // Désactiver les anciens modèles
  async deactivateOldModels() {
    const { error } = await supabase
      .from('ai_model_metrics')
      .update({ is_active: false })
      .neq('is_active', false)

    if (error) throw error
  }
}