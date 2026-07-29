// Voice ID mapping for ElevenLabs (used for reference, clips are pre-generated)
export const DEFAULT_GENDER = 'male'

export const voiceIds = {
  male: {
    owl: 'yZ3w1DL4ZAxIdOscv2t8',
    bear: 'uq0HIbNZKn11Hs5ifEdd',
    bunny: '87n4zM8Wuy87vFILuKvE',
    cat: null,
  },
  female: {
    owl: 'Ky9j3wxFbp3dSAdrkOEv',
    bear: 'emSmWzY0c0xtx5IFMCVv',
    bunny: 'piI8Kku0DcvcL6TTSeQt',
    cat: null,
  },
}

export const getVoiceId = (characterId, gender = 'male') => {
  const genderVoices = voiceIds[gender] || voiceIds.male
  return genderVoices[characterId] || genderVoices.owl
}
