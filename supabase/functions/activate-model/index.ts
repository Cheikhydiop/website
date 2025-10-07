// ============================================
// 2. supabase/functions/activate-model/index.ts
// Activer un nouveau modèle après validation
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

    const { modelVersion } = await req.json()

    // 1. Désactiver tous les autres modèles
    await supabaseClient
      .from('ai_model_metrics')
      .update({ is_active: false })
      .eq('is_active', true)

    // 2. Activer le nouveau modèle
    const { error } = await supabaseClient
      .from('ai_model_metrics')
      .update({ is_active: true })
      .eq('model_version', modelVersion)

    if (error) throw error

    // 3. Logger l'activation
    console.log(`Modèle ${modelVersion} activé`)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Modèle ${modelVersion} activé avec succès`
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

