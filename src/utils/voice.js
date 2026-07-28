// Speech synthesis (TTS) and recognition (STT) for kid-friendly voice interaction

let currentUtterance = null

export function speak(text, options = {}) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return }
    ensureUnlocked()
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options.rate || 0.9
    utterance.pitch = options.pitch || 1.0
    utterance.volume = options.volume || 1.0
    utterance.lang = 'en-US'

    // Try to pick a friendly voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Ava') ||
      v.name.includes('Karen') ||
      v.name.includes('Google US English') ||
      v.lang.startsWith('en')
    )
    if (preferred) utterance.voice = preferred

    // Word-boundary events power the read-along ("karaoke") highlight for beginners.
    if (options.onBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === undefined || e.name === 'word') options.onBoundary(e)
      }
    }

    utterance.onend = resolve
    utterance.onerror = resolve
    currentUtterance = utterance
    window.speechSynthesis.speak(utterance)
    // iOS Safari sometimes leaves the queue paused; nudge it to actually play.
    try { window.speechSynthesis.resume() } catch { /* noop */ }
  })
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

export function listen(options = {}) {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported'))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    const timeout = setTimeout(() => {
      recognition.stop()
      resolve({ transcript: '', confidence: 0, timedOut: true })
    }, options.timeout || 15000)

    recognition.onresult = (event) => {
      clearTimeout(timeout)
      const result = event.results[0]
      resolve({
        transcript: result[0].transcript,
        confidence: result[0].confidence,
        timedOut: false,
      })
    }

    recognition.onerror = (event) => {
      clearTimeout(timeout)
      if (event.error === 'no-speech') {
        resolve({ transcript: '', confidence: 0, timedOut: true })
      } else {
        reject(new Error(`Speech recognition error: ${event.error}`))
      }
    }

    recognition.onend = () => {
      clearTimeout(timeout)
    }

    recognition.start()
  })
}

export function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function isTTSSupported() {
  return !!window.speechSynthesis
}

// Mobile browsers (esp. iOS Safari) block speech synthesis until it has been
// triggered inside a user gesture. We "unlock" the engine on the very first tap
// with a silent utterance; after that, narration triggered from timers/effects
// (e.g. auto-play in Listen mode) works too.
let speechUnlocked = false
export function ensureUnlocked() {
  if (speechUnlocked || typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.speak(u)
    window.speechSynthesis.resume()
    speechUnlocked = true
  } catch { /* noop */ }
}

// Preload voices (Chrome needs this) + attach the one-time gesture unlock.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
  const unlock = () => {
    ensureUnlocked()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('touchend', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('touchend', unlock)
  window.addEventListener('keydown', unlock)
}
