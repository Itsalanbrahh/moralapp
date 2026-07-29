// Voice: Static ElevenLabs clips (primary) + browser TTS fallback

import { getAudioClip } from '../data/audioClips'
import { DEFAULT_GENDER } from '../data/voices'

let currentAudio = null
let audioUnlocked = false

// Unlock audio on first user interaction (mobile requirement)
function ensureUnlocked() {
  if (audioUnlocked) return
  audioUnlocked = true
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  ctx.resume().catch(() => {})
}

// Listen for first touch/click to unlock audio
if (typeof window !== 'undefined') {
  const unlock = () => { ensureUnlocked(); window.removeEventListener('touchstart', unlock); window.removeEventListener('click', unlock) }
  window.addEventListener('touchstart', unlock, { once: true })
  window.addEventListener('click', unlock, { once: true })
}

export async function speak(text, options = {}) {
  const { characterId, gender, clip, pitch, rate, onBoundary } = options
  const voiceGender = gender || DEFAULT_GENDER

  // Try static audio clip first
  if (characterId && clip) {
    const clipUrl = getAudioClip(characterId, clip, voiceGender)
    if (clipUrl) {
      try {
        return await playAudioClip(clipUrl)
      } catch (e) {
        // Fall through to browser TTS
      }
    }
  }

  // Browser TTS fallback
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return }
    ensureUnlocked()
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate || 0.9
    utterance.pitch = pitch || 1.0
    utterance.volume = 1.0
    utterance.lang = 'en-US'

    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Ava') ||
      v.name.includes('Karen') ||
      v.name.includes('Google US English') ||
      v.lang.startsWith('en')
    )
    if (preferred) utterance.voice = preferred

    if (onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === undefined || e.name === 'word') onBoundary(e)
      }
    }

    utterance.onend = resolve
    utterance.onerror = resolve
    window.speechSynthesis.speak(utterance)
    try { window.speechSynthesis.resume() } catch { /* noop */ }
  })
}

export function getAudioTime() {
  return currentAudio ? currentAudio.currentTime : -1
}

export function playAudioFile(url, rate = 1.0) {
  return new Promise((resolve, reject) => {
    stopSpeaking()
    const audio = new Audio(url)
    audio.playbackRate = rate
    currentAudio = audio
    audio.onended = () => { currentAudio = null; resolve() }
    audio.onerror = (e) => { currentAudio = null; reject(e) }
    audio.play().catch(reject)
  })
}

function playAudioClip(url) {
  return new Promise((resolve, reject) => {
    stopSpeaking()
    const audio = new Audio(url)
    currentAudio = audio
    audio.onended = () => { currentAudio = null; resolve() }
    audio.onerror = (e) => { currentAudio = null; reject(e) }
    audio.play().catch(reject)
  })
}

export function stopSpeaking() {
  // Stop audio clips
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  // Stop browser TTS
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

export function listen(options = {}) {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { reject(new Error('Speech recognition not supported')); return }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    if (options.onStart) recognition.onstart = options.onStart
    if (options.onEnd) recognition.onend = options.onEnd

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      resolve(transcript)
    }
    recognition.onerror = (event) => {
      if (event.error === 'no-speech') resolve('')
      else reject(new Error(event.error))
    }

    try { recognition.start() } catch (e) { reject(e) }
  })
}

export function isSpeechSupported() {
  return !!window.speechSynthesis
}

export function isListeningSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}
