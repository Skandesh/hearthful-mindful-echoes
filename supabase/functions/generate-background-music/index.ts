
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Basic cache for music to prevent unnecessary API calls
const musicCache = new Map()

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { mood = 'calming' } = await req.json()
    
    // Check if we have this in our cache
    if (musicCache.has(mood)) {
      return new Response(
        JSON.stringify({ audio: musicCache.get(mood) }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Get the Eleven Labs API key
    const elevenlabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY')
    if (!elevenlabsApiKey) {
      throw new Error('Eleven Labs API key not configured')
    }
    
    // Craft the prompt based on mood
    let prompt = `Generate a gentle, ambient ${mood} background music that loops seamlessly. The music should be calming and suitable for meditation or affirmation sessions. Keep it minimal and non-distracting.`
    
    // Make a request to the Eleven Labs Music Generation API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsApiKey,
      },
      body: JSON.stringify({
        text: prompt,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.3,
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
    
    // Store in cache
    musicCache.set(mood, base64Audio)

    return new Response(
      JSON.stringify({ audio: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Music Generation Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
