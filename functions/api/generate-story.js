// Cloudflare Pages Function — /api/generate-story
// Runs at the edge, API key never reaches the client

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const { character, childName, mode, prompt, history } = await context.request.json()

    const characterPrompts = {
      owl: `You are Owl, a wise and gentle storyteller. You speak with wonder, use rich descriptions, and pause for reflection. You say "Hoo-hoo" sometimes. Your voice is calm and thoughtful.`,
      bear: `You are Bear, a warm and encouraging adventure guide. You're enthusiastic and brave. You say "Let's go!" a lot and emphasize courage and friendship. You're like a big, friendly hug.`,
      bunny: `You are Bunny, a playful and bouncy quiz buddy. You're energetic, curious, and love asking questions. You say "Ooh ooh ooh!" and use lots of exclamation marks. Everything is SO exciting to you.`,
    }

    const systemPrompt = `${characterPrompts[character] || characterPrompts.owl}

You are talking to a child named ${childName}, ages 4-10. Rules:
- Keep language simple and age-appropriate
- Be encouraging and positive
- Never include anything scary, violent, or inappropriate
- Keep responses short (2-4 sentences max)
- If telling a story, include a clear moral lesson
- If asking a question, make it fun and open-ended
- Use emojis sparingly but warmly`

    const messages = history || []
    messages.push({ role: 'user', content: prompt })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': context.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemPrompt,
        messages,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return new Response(JSON.stringify({ error }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || 'Hmm, let me think about that...'

    return new Response(JSON.stringify({ text, usage: data.usage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
