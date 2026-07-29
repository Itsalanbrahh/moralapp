// Pre-generated audio clips from ElevenLabs
// Organized by gender/character

const AUDIO_BASE = '/assets/audio'

const audioClips = {
  male: {
    owl: {
      greeting: `${AUDIO_BASE}/male/owl-greeting.mp3`,
      storyIntro: `${AUDIO_BASE}/male/owl-story-intro.mp3`,
    },
    bear: {
      greeting: `${AUDIO_BASE}/male/bear-greeting.mp3`,
      storyIntro: `${AUDIO_BASE}/male/bear-story-intro.mp3`,
    },
    bunny: {
      greeting: `${AUDIO_BASE}/male/bunny-greeting.mp3`,
      storyIntro: `${AUDIO_BASE}/male/bunny-story-intro.mp3`,
    },
    cat: {
      greeting: null,
      storyIntro: null,
    },
    celebrate: `${AUDIO_BASE}/male/celebrate.mp3`,
  },
  female: {
    owl: {
      greeting: `${AUDIO_BASE}/female/owl-greeting.mp3`,
      storyIntro: `${AUDIO_BASE}/female/owl-story-intro.mp3`,
    },
    bear: {
      greeting: `${AUDIO_BASE}/female/bear-greeting.mp3`,
      storyIntro: `${AUDIO_BASE}/female/bear-story-intro.mp3`,
    },
    bunny: {
      greeting: `${AUDIO_BASE}/female/bunny-greeting.mp3`,
      storyIntro: `${AUDIO_BASE}/female/bunny-story-intro.mp3`,
    },
    cat: {
      greeting: null,
      storyIntro: null,
    },
    celebrate: `${AUDIO_BASE}/female/celebrate.mp3`,
  },
}

export const getAudioClip = (characterId, clipType, gender = 'male') => {
  const genderClips = audioClips[gender] || audioClips.male
  if (clipType === 'celebrate') return genderClips.celebrate
  const charClips = genderClips[characterId]
  if (!charClips) return null
  return charClips[clipType] || null
}
