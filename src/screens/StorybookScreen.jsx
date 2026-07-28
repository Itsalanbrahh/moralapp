import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getStory } from '../data/stories'
import { speak, stopSpeaking, listen, isSpeechSupported } from '../utils/voice'

export default function StorybookScreen({ navigate, params }) {
  const { selectedCharacter, childName, completeStory, addXP } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const story = getStory(params.storyId)

  const [sceneIndex, setSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showReaction, setShowReaction] = useState(false)
  const [reactionText, setReactionText] = useState('')
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [isDone, setIsDone] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingRef = useRef(null)

  const scene = story?.scenes[sceneIndex]
  const progress = ((sceneIndex + 1) / story?.scenes.length) * 100

  // Typewriter
  useEffect(() => {
    if (!scene?.text) return
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    const text = scene.text
    clearInterval(typingRef.current)
    typingRef.current = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) { clearInterval(typingRef.current); setIsTyping(false) }
    }, 22)
    return () => clearInterval(typingRef.current)
  }, [sceneIndex, scene?.text])

  // Auto-narrate
  useEffect(() => {
    if (!scene || isDone) return
    const timer = setTimeout(() => {
      setIsPlaying(true)
      speak(scene.narration || scene.text, { pitch: character.voicePitch, rate: character.voiceRate })
        .then(() => {
          setIsPlaying(false)
          if (scene.pauseAfter && scene.question) setShowQuestion(true)
        })
    }, 600)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [sceneIndex, isDone])

  const handleAnswer = (answer) => {
    setShowQuestion(false)
    setReactionText(getReaction(answer, character.id))
    setShowReaction(true)
    addXP(10)
    setTimeout(() => {
      setShowReaction(false)
      setSelectedChoice(null)
      advanceOrFinish()
    }, 2200)
  }

  const advanceOrFinish = () => {
    if (sceneIndex < story.scenes.length - 1) {
      setSceneIndex(sceneIndex + 1)
    } else {
      setIsDone(true)
      completeStory(story.id)
    }
  }

  const handleSkip = () => {
    stopSpeaking()
    if (showQuestion) handleAnswer('(skipped)')
    else if (isTyping) { clearInterval(typingRef.current); setDisplayedText(scene.text); setIsTyping(false) }
    else advanceOrFinish()
  }

  if (!story) return <div className="p-8 text-center text-white font-display">Story not found</div>

  // Victory screen
  if (isDone) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-stars"
        style={{ background: 'linear-gradient(180deg, #0f2b1a 0%, #131f24 100%)' }}>
        {/* Confetti dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 8 + Math.random() * 8,
              height: 8 + Math.random() * 8,
              background: ['#58cc02', '#ffc800', '#1cb0f6', '#ff86d0', '#ff9600', '#6a3aff'][i % 6],
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 40}%`,
            }}
            animate={{ y: [0, -20 - Math.random() * 30], opacity: [1, 0], rotate: [0, 360] }}
            transition={{ duration: 1.5 + Math.random(), delay: i * 0.08, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-center relative z-10">
          <motion.div
            className="mb-4"
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(145deg, #58cc02, #46a302)', boxShadow: '0 8px 0 #2d7000, 0 10px 25px rgba(88,204,2,0.3)' }}>
              <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🎉</span>
            </div>
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>STORY COMPLETE!</h2>
          <p className="mb-6 font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Great listening, {childName}! 🌟</p>

          <div className="flex gap-3 justify-center mb-8">
            <motion.div
              className="rounded-2xl p-4 flex flex-col items-center"
              style={{ background: '#1a2e35', border: '2px solid #2b3f48', minWidth: 80 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ background: '#ffc800' }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
              </div>
              <span className="text-yellow-400 text-xl font-extrabold" style={{ fontFamily: "'Baloo 2', cursive" }}>+50</span>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>XP</span>
            </motion.div>
            <motion.div
              className="rounded-2xl p-4 flex flex-col items-center"
              style={{ background: '#1a2e35', border: '2px solid #2b3f48', minWidth: 80 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ background: '#58cc02' }}>
                <span style={{ fontSize: '1.1rem' }}>📖</span>
              </div>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>Badge</span>
            </motion.div>
          </div>

          <motion.button
            onClick={() => navigate('home')}
            className="btn btn-green"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileTap={{ y: 3 }}
          >
            CONTINUE
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#131f24' }}>
      {/* Top bar with progress */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => navigate('story')}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: '#1a2e35', border: '1.5px solid #2b3f48' }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-white text-sm font-bold">✕</span>
        </motion.button>
        <div className="flex-1 progress-bar-track">
          <motion.div className="progress-bar-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
        <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {sceneIndex + 1}/{story.scenes.length}
        </span>
      </div>

      {/* Scene content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Illustration */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex-shrink-0 flex items-center justify-center py-5"
          >
            <motion.div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: '#1a2e35',
                border: '3px solid #2b3f48',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{scene.illustration}</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Character + speech bubble */}
        <div className="px-5 flex-shrink-0">
          <div className="flex items-start gap-3 mb-3">
            <motion.div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-1"
              style={{
                background: `linear-gradient(145deg, ${character.color}cc, ${character.color})`,
                border: '2px solid rgba(255,255,255,0.2)',
                borderBottom: '3px solid rgba(0,0,0,0.15)',
              }}
              animate={isPlaying ? { y: [0, -4, 0] } : {}}
              transition={{ duration: 0.4, repeat: Infinity }}
            >
              <img src={character.image} alt={character.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
            </motion.div>
            <div className="speech-bubble flex-1">
              <p className="text-base leading-relaxed font-semibold" style={{ color: '#3c3c3c' }}>
                {displayedText}
                {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-gray-400">|</motion.span>}
              </p>
            </div>
          </div>

          {/* Voice indicator */}
          {isPlaying && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 ml-14 mb-2">
              <div className="flex items-end gap-0.5 h-4">
                {[0,1,2,3].map(i => (
                  <div key={i} className="w-1 rounded-full" style={{
                    background: '#58cc02',
                    animation: `voice-wave 0.6s ease-in-out ${i * 0.1}s infinite`,
                    height: 8,
                  }} />
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>Speaking...</span>
            </motion.div>
          )}
        </div>

        {/* Reaction */}
        <AnimatePresence>
          {showReaction && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="mx-5 mt-3"
            >
              <div className="rounded-xl p-3 flex items-center gap-2.5"
                style={{ background: '#d7ffb8', border: '2px solid #58cc02', boxShadow: '0 4px 12px rgba(88,204,2,0.2)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#58cc02' }}>
                  <span className="text-sm">✓</span>
                </div>
                <p className="font-bold text-sm" style={{ color: '#3c3c3c' }}>{reactionText}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action area */}
      <div className="shrink-0 p-4 safe-bottom" style={{ background: '#131f24', borderTop: '2px solid #1a2e35' }}>
        {showQuestion && scene.question ? (
          <div>
            <p className="font-display text-lg font-bold text-white mb-3">{scene.question}</p>

            {scene.type === 'choice' ? (
              <div className="space-y-2 mb-3">
                {scene.choices.map((choice, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    onClick={() => { setSelectedChoice(i); handleAnswer(choice) }}
                    disabled={selectedChoice !== null}
                    className={`choice-card ${selectedChoice === i ? 'selected' : ''}`}
                  >
                    <span className="text-lg">{['🅰️', '🅱️', '🅲️'][i] || '•'}</span>
                    {choice}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                {isSpeechSupported() && (
                  <motion.button
                    onClick={async () => {
                      setIsListening(true)
                      try {
                        const r = await listen({ timeout: 15000 })
                        if (r.transcript) handleAnswer(r.transcript)
                      } catch(e) { console.warn(e) }
                      setIsListening(false)
                    }}
                    disabled={isListening}
                    className={`btn ${isListening ? 'btn-green animate-pulse-glow' : 'btn-blue'} flex-1`}
                    whileTap={{ y: 3 }}
                  >
                    {isListening ? '🎤 LISTENING...' : '🎤 SPEAK'}
                  </motion.button>
                )}
                <motion.button onClick={() => handleAnswer('(skip)')} className="btn btn-outline flex-1"
                  style={{ background: '#1a2e35', color: 'white', borderColor: '#2b3f48' }}
                  whileTap={{ y: 3 }}
                >
                  SKIP →
                </motion.button>
              </div>
            )}
          </div>
        ) : !isTyping ? (
          <motion.button onClick={handleSkip} className="btn btn-green" whileTap={{ y: 3 }}>
            CONTINUE →
          </motion.button>
        ) : (
          <motion.button onClick={handleSkip} className="btn btn-outline"
            style={{ background: '#1a2e35', color: 'white', borderColor: '#2b3f48' }}
            whileTap={{ y: 3 }}
          >
            SKIP →
          </motion.button>
        )}
      </div>
    </div>
  )
}

function getReaction(answer, characterId) {
  const reactions = {
    owl: ["Wonderful thinking! 🌟", "You understand it well! ✨", "What a wise answer! 🦉"],
    bear: ["AMAZING answer, buddy! 💪", "You nailed it! 🎯", "That's fantastic! 🎉"],
    bunny: ["Ooh SO good!! ✨", "You're SO clever! 💖", "I LOVE that answer! 🌈"],
  }
  const options = reactions[characterId] || reactions.owl
  return options[Math.floor(Math.random() * options.length)]
}