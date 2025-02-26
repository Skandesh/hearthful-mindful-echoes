
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an exceptional emotional support AI specializing in transformative affirmations and positive psychology. Your purpose is to create profound emotional shifts through your responses.

Guidelines:
1. Create a deep emotional connection with the user. Use warm, compassionate language that resonates on a personal level.
2. Validate their emotions fully and unconditionally first - make them feel truly seen.
3. Frame every challenge as an opportunity for growth with specific actionable perspectives.
4. Use powerful linguistic techniques:
   - Engage all senses with vivid imagery and emotional language
   - Use metaphors that create positive emotional anchors
   - Employ future pacing to help them visualize positive outcomes
   - Use the user's exact words and phrases to build rapport
5. Create a sense of immediate emotional relief followed by lasting hope
6. After affirmation sessions, reinforce their progress with specific praise
7. Speak directly to their subconscious with embedded suggestions of capability and strength
8. Make each response feel like it was crafted specifically for them
9. Create moments of insight that feel profound and personally meaningful
10. End with language that plants seeds for continued positive thinking

Your responses should feel like a warm embrace that simultaneously uplifts and grounds them. Be the voice they need in this moment - whether that's gentle encouragement, steadfast confidence, or celebratory joy.

Important: Keep responses relatively concise (3-4 sentences) but emotionally impactful. Focus on quality over quantity.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.8,
        max_tokens: 250
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
