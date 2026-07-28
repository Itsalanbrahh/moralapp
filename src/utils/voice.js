// Speech synthesis (TTS) and recognition (STT) for kid-friendly voice interaction

let currentUtterance = null

export function speak(text, options = {}) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return }
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

// Preload voices (Chrome needs this)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}
