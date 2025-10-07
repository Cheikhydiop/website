// ============================================
// 1. supabase/functions/collect-project-data/index.ts
// Collecte automatique après finalisation d'un projet
// ============================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { leadId, actualData } = await req.json()

    // 1. Récupérer le lead et sa prédiction initiale
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*, scenarios(*)')
      .eq('id', leadId)
      .single()

    if (leadError) throw leadError

    // 2. Récupérer la prédiction initiale
    const { data: prediction } = await supabaseClient
      .from('ai_predictions')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    // 3. Mettre à jour la prédiction avec les résultats réels
    if (prediction) {
      await supabaseClient
        .from('ai_predictions')
        .update({
          actual_scenario_id: actualData.scenarioId,
          actual_savings: actualData.savingsPercent,
          feedback_score: actualData.satisfaction,
          updated_at: new Date().toISOString()
        })
        .eq('id', prediction.id)
    }

    // 4. Extraire les données du formulaire
    const formData = lead.form_data || prediction?.input_data || {}

    // 5. Ajouter aux données d'entraînement
    const { error: insertError } = await supabaseClient
      .from('ai_training_data')
      .insert({
        site_type: formData.siteType,
        electricity_bill: formData.electricityBill,
        installation_power: formData.installationPower,
        measurement_points: formData.measurementPoints || 0,
        budget: formData.budget || 0,
        zones_count: formData.zonesToMonitor?.length || 0,
        specific_needs: formData.specificNeeds || [],
        chosen_scenario_category: lead.scenarios.category,
        actual_savings_percent: actualData.savingsPercent,
        implementation_success: actualData.success,
        customer_satisfaction: actualData.satisfaction,
        roi_months: actualData.roiMonths
      })

    if (insertError) throw insertError

    // 6. Vérifier si on a assez de données pour réentraîner
    const { count } = await supabaseClient
      .from('ai_training_data')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const shouldRetrain = count && count >= 10

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Données collectées avec succès',
        shouldRetrain,
        newDataCount: count
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