
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL' } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    // Get the Eleven Labs API key
    const elevenlabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY')
    if (!elevenlabsApiKey) {
      throw new Error('Eleven Labs API key not configured')
    }

    // Make a request to the Eleven Labs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Eleven Labs API error:', errorText)
      throw new Error(`Eleven Labs API error: ${response.status}`)
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ audio: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('TTS Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
