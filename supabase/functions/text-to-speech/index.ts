
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      throw new Error('The text parameter is required for text-to-speech conversion')
    }

    if (typeof text !== 'string') {
      throw new Error('The text parameter must be a string')
    }

    if (text.length > 2500) {
      throw new Error('Text length exceeds the maximum limit of 2500 characters')
    }

    // Use Charlie's voice ID - professional male voice
    const VOICE_ID = "IKne3meq5aSn9XLyUdCD";
    const XI_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY');

    if (!XI_API_KEY) {
      throw new Error('ElevenLabs API key is not configured')
    }

    console.log(`Converting text to speech: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
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
            style: 0.0,
            use_speaker_boost: true
          },
        }),
      }
    )

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        console.error("ElevenLabs API Error Response:", errorData);
        
        // Map specific ElevenLabs error codes to user-friendly messages
        switch(errorData.status) {
          case 'error':
            errorMessage = errorData.detail?.message || 'ElevenLabs API error';
            break;
          case 401:
            errorMessage = 'Invalid ElevenLabs API key';
            break;
          case 422:
            errorMessage = 'Invalid request parameters. Please check the text content.';
            break;
          case 429:
            errorMessage = 'Character quota exceeded. Please try again later.';
            break;
          default:
            errorMessage = `ElevenLabs API error: ${errorData.detail?.message || 'Unknown error'}`;
        }
      } catch {
        errorMessage = `ElevenLabs API error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    if (response.headers.get('content-type') !== 'audio/mpeg') {
      throw new Error('Unexpected response format from ElevenLabs API')
    }

    console.log("Successfully received audio response");

    const audioArrayBuffer = await response.arrayBuffer()
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioArrayBuffer)))

    return new Response(
      JSON.stringify({ audio: audioBase64 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
