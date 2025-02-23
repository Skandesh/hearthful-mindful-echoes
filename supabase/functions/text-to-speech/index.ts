
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    })
  }

  try {
    const { text } = await req.json()

    // Input validation
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input: text must be a non-empty string' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const XI_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY')
    if (!XI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing API key' 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Using Charlie's voice
    const VOICE_ID = "IKne3meq5aSn9XLyUdCD"
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`

    console.log('Making request to ElevenLabs API...')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': XI_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    })

    // Handle API errors
    if (!response.ok) {
      let errorMessage = 'Text-to-speech conversion failed'
      
      try {
        const errorData = await response.json()
        console.error('ElevenLabs API error:', errorData)
        
        if (errorData.detail) {
          errorMessage = errorData.detail.message || errorData.detail
        }
      } catch {
        errorMessage = `Server returned ${response.status}: ${response.statusText}`
      }

      return new Response(
        JSON.stringify({ error: errorMessage }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify we received audio data
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('audio/')) {
      console.error('Unexpected content type:', contentType)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response format from TTS service' 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Convert audio to base64
    const arrayBuffer = await response.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    console.log('Successfully generated audio')

    return new Response(
      JSON.stringify({ audio: base64Audio }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred while processing your request',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
