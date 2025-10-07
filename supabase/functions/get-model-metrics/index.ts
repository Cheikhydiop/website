// ============================================
// 3. supabase/functions/get-model-metrics/index.ts
// Récupérer les métriques du modèle actif
// ============================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 1. Récupérer le modèle actif
    const { data: activeModel, error: modelError } = await supabaseClient
      .from('ai_model_metrics')
      .select('*')
      .eq('is_active', true)
      .single()

    if (modelError) throw modelError

    // 2. Récupérer les dernières prédictions
    const { data: recentPredictions, error: predError } = await supabaseClient
      .from('ai_predictions')
      .select('*')
      .not('actual_savings', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50)

    if (predError) throw predError

    // 3. Calculer les statistiques en temps réel
    const stats = calculateRealtimeStats(recentPredictions || [])

    // 4. Récupérer l'historique des modèles
    const { data: modelHistory, error: histError } = await supabaseClient
      .from('ai_model_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (histError) throw histError

    return new Response(
      JSON.stringify({ 
        activeModel,
        realtimeStats: stats,
        modelHistory
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function calculateRealtimeStats(predictions: any[]) {
  if (predictions.length === 0) {
    return { message: 'Aucune prédiction disponible' }
  }

  let totalError = 0
  let correctPredictions = 0

  predictions.forEach(pred => {
    if (pred.predicted_savings && pred.actual_savings) {
      totalError += Math.abs(pred.predicted_savings - pred.actual_savings)
      
      // Considérer comme correct si erreur < 5%
      if (Math.abs(pred.predicted_savings - pred.actual_savings) < 5) {
        correctPredictions++
      }
    }
  })

  const avgError = totalError / predictions.length
  const accuracy = (correctPredictions / predictions.length) * 100

  return {
    totalPredictions: predictions.length,
    avgError: Math.round(avgError * 100) / 100,
    accuracy: Math.round(accuracy),
    lastUpdated: new Date().toISOString()
  }
}

