// Story generation via our edge function (API key stays server-side)

const API_BASE = '/api'

export async function generateStoryPart({ character, childName, prompt, history = [] }) {
  try {
    const response = await fetch(`${API_BASE}/generate-story`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, childName, mode: 'story', prompt, history }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.text
  } catch (err) {
    console.error('Story generation failed:', err)
    return null
  }
}

export async function generateReaction({ character, childName, childAnswer, context }) {
  return generateStoryPart({
    character,
    childName,
    prompt: `The child just answered: "${childAnswer}". Context: ${context}. Give a short, warm, encouraging reaction (1-2 sentences). Then briefly continue the story or ask a follow-up question.`,
  })
}

export async function generateNewStory({ character, childName, theme }) {
  return generateStoryPart({
    character,
    childName,
    prompt: `Tell a short original story (4-5 paragraphs) about ${theme}. Include clear characters, a problem they face, and a moral lesson at the end. Break it into scenes with natural pause points where you ask the child a question.`,
  })
}
