import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { generateStoryPart } from '../utils/storyGen'
import { speak, stopSpeaking, listen, isSpeechSupported } from '../utils/voice'
import { GlassButton } from '../components/GlassCard'
import { BackArrowIcon, CloseIcon, MicIcon, CheckIcon, SparkleIcon } from '../components/SVGIcons'

const themes = [
  { id: 'bravery', label: 'Being Brave', color: '#ff9600', prompt: 'a little animal who was afraid but learned to be brave' },
  { id: 'kindness', label: 'Kindness', color: '#ff6b9d', prompt: 'a character who helped someone and made a new friend' },
  { id: 'sharing', label: 'Sharing', color: '#00e676', prompt: 'two friends who learned that sharing makes everything better' },
  { id: 'honesty', label: 'Honesty', color: '#ffc800', prompt: 'a little one who told the truth even when it was hard' },
  { id: 'trying', label: 'Never Give Up', color: '#1cb0f6', prompt: 'a small character who kept trying and finally succeeded' },
  { id: 'friendship', label: 'Friendship', color: '#7c5aff', prompt: 'two very different animals who became best friends' },
]

export default function AIStoryScreen({ navigate }) {
  const { selectedCharacter, childName, addXP, addBadge } = useGameStore()
  const character = getCharacter(selectedCharacter)

  const [phase, setPhase] = useState('pick')
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [storyText, setStoryText] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [question, setQuestion] = useState('')
  const [reaction, setReaction] = useState('')
  const [isListening, setIsListening] = useState(false)
  const typingRef = useRef(null)

  const handleGenerate = async (theme) => {
    setSelectedTheme(theme)
    setPhase('generating')

    const story = await generateStoryPart({
      character: selectedCharacter,
      childName,
      prompt: `Tell a short story (4-5 sentences) about ${theme.prompt}. End with a question for ${childName} about the story.`,
    })

    if (story) {
      const parts = story.split('?')
      const storyPart = parts.length > 1 ? parts.slice(0, -1).join('?') + '?' : story
      const questionPart = parts.length > 1 ? parts[parts.length - 1].trim() : ''

      setStoryText(story)
      setPhase('reading')
      typewrite(storyPart)

      speak(story, { pitch: character.voicePitch, rate: character.voiceRate }).then(() => {
        if (questionPart.length > 5) {
          setQuestion(questionPart)
          setPhase('question')
        } else {
          setQuestion(`What did you think about that story, ${childName}?`)
          setPhase('question')
        }
      })
    } else {
      setPhase('pick')
    }
  }

  const typewrite = (text) => {
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    clearInterval(typingRef.current)
    typingRef.current = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) { clearInterval(typingRef.current); setIsTyping(false) }
    }, 22)
  }

  const handleVoiceAnswer = async () => {
    if (!isSpeechSupported()) return
    setPhase('listening')
    setIsListening(true)
    try {
      const result = await listen({ timeout: 15000 })
      if (result.transcript) {
        handleAnswer(result.transcript)
      } else {
        handleAnswer('(no answer)')
      }
    } catch (e) {
      handleAnswer('(no answer)')
    }
    setIsListening(false)
  }

  const handleAnswer = async (answer) => {
    setPhase('reacting')

    const reactText = await generateStoryPart({
      character: selectedCharacter,
      childName,
      prompt: `The child answered: "${answer}" about the story. Give a short, warm, encouraging reaction in 1-2 sentences.`,
    })

    setReaction(reactText || getQuickReaction(selectedCharacter))
    speak(reactText || getQuickReaction(selectedCharacter), { pitch: character.voicePitch, rate: character.voiceRate })

    addXP(20)
    addBadge({ id: `ai-story-${Date.now()}`, name: 'AI Story', icon: 'star' })

    setTimeout(() => setPhase('done'), 3000)
  }

  useEffect(() => { return () => clearInterval(typingRef.current) }, [])

  // Pick theme screen
  if (phase === 'pick') {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden bg-stars" style={{ background: '#0a0a1a' }}>
        <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
          <motion.button
            onClick={() => navigate('story')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            whileTap={{ scale: 0.9 }}
          >
            <BackArrowIcon size={18} color="rgba(255,255,255,0.7)" />
          </motion.button>
          <h1 className="font-display text-xl font-bold text-white">Create a Story</h1>
          <SparkleIcon size={18} color="#c4b0ff" />
        </div>

        {/* Character guide */}
        <div className="px-4 mb-4 shrink-0">
          <div className="speech-bubble flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${character.color}15` }}>
              <img src={character.image} alt={character.name} className="w-8 h-8 rounded-full object-cover" style={{ border: `2px solid ${character.color}40` }} />
            </div>
            <p className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {character.id === 'bunny' ? `OH OH OH ${childName}! Pick a theme and I'll make up a story JUST for you!!` :
               character.id === 'bear' ? `Hey ${childName}! Pick what kind of adventure you want -- I'll tell you the story!` :
               `Choose a theme, ${childName}, and I shall weave a tale just for you.`}
            </p>
          </div>
        </div>

        {/* Theme grid */}
        <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme, i) => (
              <motion.button
                key={theme.id}
                initial={{ scale: 0, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.05 + i * 0.06, type: 'spring', stiffness: 300 }}
                onClick={() => handleGenerate(theme)}
                className="rounded-2xl p-4 flex flex-col items-center gap-2.5"
                style={{
                  backdropFilter: 'blur(16px)',
                  background: `${theme.color}08`,
                  border: `1px solid ${theme.color}20`,
                  boxShadow: `0 8px 24px ${theme.color}08`,
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: `${theme.color}12`, border: `1px solid ${theme.color}20` }}>
                  <SparkleIcon size={24} color={theme.color} />
                </div>
                <span className="font-display font-bold text-sm text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{theme.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Generating
  if (phase === 'generating') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-stars" style={{ background: '#0a0a1a' }}>
        <motion.div
          className="mb-6"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: `${character.color}20`,
              border: `2px solid ${character.color}30`,
              boxShadow: `0 8px 32px ${character.color}15`,
              backdropFilter: 'blur(16px)',
            }}>
            <img src={character.image} alt={character.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </motion.div>
        <p className="font-display text-xl font-bold text-white mb-2">Creating your story...</p>
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>{character.name} is thinking of something special</p>
        <div className="mt-5 flex gap-2">
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ background: '#7c5aff' }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Done
  if (phase === 'done') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-stars"
        style={{ background: 'linear-gradient(180deg, #0a1a0f 0%, #0a0a1a 100%)' }}>
        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${15 + Math.random() * 70}%`, top: `${20 + Math.random() * 40}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          >
            <SparkleIcon size={10 + Math.random() * 6} color="#ffc800" />
          </motion.div>
        ))}

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-center relative z-10">
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(145deg, #7c5aff, #6a4eff)',
              boxShadow: '0 8px 32px rgba(124,90,255,0.3), 0 0 50px rgba(124,90,255,0.15)',
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: 2 }}
          >
            <SparkleIcon size={36} color="#ffc800" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">GREAT STORY!</h2>
          <p className="mb-6 font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>+20 XP earned!</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <GlassButton variant="primary" onClick={() => { setPhase('pick'); setStoryText('') }}>
              ANOTHER STORY
            </GlassButton>
            <GlassButton variant="glass" onClick={() => navigate('home')}>
              BACK HOME
            </GlassButton>
          </div>
        </motion.div>
      </div>
    )
  }

  // Reading / Question / Listening / Reacting
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* Top */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => setPhase('pick')}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <CloseIcon size={14} color="rgba(255,255,255,0.5)" />
        </motion.button>
        <h2 className="font-display text-sm font-bold text-white flex-1 truncate">
          {selectedTheme?.label}
        </h2>
      </div>

      {/* Story + character */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
            style={{
              background: `${character.color}15`,
              border: `2px solid ${character.color}25`,
              backdropFilter: 'blur(16px)',
            }}
            animate={phase === 'reading' ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <img src={character.image} alt={character.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
          </motion.div>
          <div className="speech-bubble flex-1">
            <p className="text-base leading-relaxed font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {displayedText || storyText}
              {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: 'rgba(124,90,255,0.5)' }}>|</motion.span>}
            </p>
          </div>
        </div>

        {/* Reaction */}
        <AnimatePresence>
          {phase === 'reacting' && reaction && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="ml-14">
              <div className="rounded-xl p-3 flex items-center gap-2.5"
                style={{
                  backdropFilter: 'blur(16px)',
                  background: 'rgba(0,230,118,0.1)',
                  border: '1px solid rgba(0,230,118,0.2)',
                  boxShadow: '0 4px 16px rgba(0,230,118,0.1)',
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0,230,118,0.15)' }}>
                  <CheckIcon size={14} color="#00e676" />
                </div>
                <p className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{reaction}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 p-4 safe-bottom" style={{ background: '#0a0a1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {phase === 'question' && question && (
          <div>
            <p className="font-display text-base font-bold text-white mb-3">{question}</p>
            <div className="flex gap-2">
              {isSpeechSupported() && (
                <GlassButton variant="primary" onClick={handleVoiceAnswer} style={{ flex: 1 }}>
                  <MicIcon size={18} color="white" />
                  SPEAK
                </GlassButton>
              )}
              <GlassButton variant="glass" onClick={() => handleAnswer('(Great story!)')} style={{ flex: 1 }}>
                SKIP
              </GlassButton>
            </div>
          </div>
        )}
        {phase === 'listening' && (
          <div className="text-center">
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{
                background: 'rgba(124,90,255,0.15)',
                border: '2px solid rgba(124,90,255,0.3)',
                boxShadow: '0 0 24px rgba(124,90,255,0.2)',
              }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <MicIcon size={24} color="#c4b0ff" />
            </motion.div>
            <p className="text-white font-bold font-display">Listening...</p>
          </div>
        )}
        {phase === 'reading' && !isTyping && (
          <GlassButton variant="glass" onClick={() => stopSpeaking()}>
            SKIP AHEAD
          </GlassButton>
        )}
      </div>
    </div>
  )
}

function getQuickReaction(characterId) {
  const reactions = {
    owl: "What a wonderful thought, young one!",
    bear: "That's AMAZING, buddy! I love it!",
    bunny: "Ooh that's SO good!! You're so smart!",
  }
  return reactions[characterId] || reactions.owl
}
