import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { generateStoryPart } from '../utils/storyGen'
import { speak, stopSpeaking, listen, isSpeechSupported } from '../utils/voice'
import { BackArrowIcon, CloseIcon, MicIcon, CheckIcon, SparkleIcon } from '../components/SVGIcons'

const themes = [
  { id: 'bravery', label: 'Being Brave', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'kindness', label: 'Kindness', color: '#EC4899', bg: '#FCE7F3' },
  { id: 'sharing', label: 'Sharing', color: '#10B981', bg: '#D1FAE5' },
  { id: 'honesty', label: 'Honesty', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'trying', label: 'Never Give Up', color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'friendship', label: 'Friendship', color: '#8B5CF6', bg: '#EDE9FE' },
]

const themePrompts = {
  bravery: 'a little animal who was afraid but learned to be brave',
  kindness: 'a character who helped someone and made a new friend',
  sharing: 'two friends who learned that sharing makes everything better',
  honesty: 'a little one who told the truth even when it was hard',
  trying: 'a small character who kept trying and finally succeeded',
  friendship: 'two very different animals who became best friends',
}

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
      prompt: `Tell a short story (4-5 sentences) about ${themePrompts[theme.id]}. End with a question for ${childName} about the story.`,
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
      <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#F8F9FA' }}>
        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <motion.button onClick={() => navigate('story')}
            style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
            whileTap={{ scale: 0.9 }}>
            <BackArrowIcon size={16} color="#6B7280" />
          </motion.button>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#1F2937', margin: 0, flex: 1 }}>Create a Story</h1>
          <SparkleIcon size={18} color="#8B5CF6" />
        </div>

        {/* Character guide */}
        <div style={{ padding: '0 1rem', marginBottom: '1rem', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.5)', borderRadius: '1.25rem',
            padding: '0.75rem 1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${character.color}40` }}>
              <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#4A5568' }}>
              {character.id === 'bunny' ? `OH OH OH ${childName}! Pick a theme and I'll make up a story JUST for you!!` :
               character.id === 'bear' ? `Hey ${childName}! Pick what kind of adventure you want -- I'll tell you the story!` :
               `Choose a theme, ${childName}, and I shall weave a tale just for you.`}
            </p>
          </div>
        </div>

        {/* Theme grid */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem 1.5rem', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {themes.map((theme, i) => (
              <motion.button key={theme.id}
                initial={{ scale: 0, rotate: -5 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.05 + i * 0.06, type: 'spring', stiffness: 300 }}
                onClick={() => handleGenerate(theme)}
                whileTap={{ scale: 0.97 }}
                style={{
                  borderRadius: '20px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  background: 'white', border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)', cursor: 'pointer',
                }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <SparkleIcon size={22} color={theme.color} />
                </div>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.85rem', color: '#1F2937' }}>{theme.label}</span>
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
      <div className="w-full h-full flex flex-col items-center justify-center px-6" style={{ background: '#F8F9FA' }}>
        <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
            border: `2px solid ${character.color}40`, boxShadow: `0 8px 32px ${character.color}15`,
            marginBottom: '1.5rem',
          }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </motion.div>
        <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.2rem', fontWeight: 700, color: '#1F2937', marginBottom: '4px' }}>Creating your story...</p>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: '#9CA3AF' }}>{character.name} is thinking of something special</p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
          {[0,1,2].map(i => (
            <motion.div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6' }}
              animate={{ y: [0, -12, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
          ))}
        </div>
      </div>
    )
  }

  // Done
  if (phase === 'done') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6" style={{ background: '#F8F9FA' }}>
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute"
            style={{ left: `${15 + Math.random() * 70}%`, top: `${20 + Math.random() * 40}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}>
            <SparkleIcon size={10 + Math.random() * 6} color="#FBBF24" />
          </motion.div>
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-center relative z-10">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: 2 }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1rem',
              background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)',
              boxShadow: '0 8px 32px rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SparkleIcon size={32} color="#FBBF24" />
            </div>
          </motion.div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>GREAT STORY!</h2>
          <p style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#6B7280', fontFamily: "'Nunito', sans-serif" }}>+20 XP earned!</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px' }}>
            <button className="btn btn-primary" onClick={() => { setPhase('pick'); setStoryText('') }}>ANOTHER STORY</button>
            <button className="btn btn-glass" onClick={() => navigate('home')}>BACK HOME</button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Reading / Question / Listening / Reacting
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#F8F9FA' }}>
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <motion.button onClick={() => setPhase('pick')}
          style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
          whileTap={{ scale: 0.9 }}>
          <CloseIcon size={14} color="#6B7280" />
        </motion.button>
        <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: '#1F2937', margin: 0, flex: 1 }}>
          {selectedTheme?.label}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '1rem' }}>
          <motion.div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2px solid ${character.color}40` }}
            animate={phase === 'reading' ? { y: [0, -4, 0] } : {}} transition={{ duration: 0.5, repeat: Infinity }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          <div style={{
            flex: 1, backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.5)', borderRadius: '1.25rem',
            padding: '0.75rem 1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 600, color: '#1F2937', margin: 0 }}>
              {displayedText || storyText}
              {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: 'rgba(139,92,246,0.5)' }}>|</motion.span>}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {phase === 'reacting' && reaction && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={{ marginLeft: '46px' }}>
              <div style={{
                borderRadius: '1rem', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
              }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckIcon size={12} color="#10B981" />
                </div>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#4A5568', margin: 0 }}>{reaction}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: '0.75rem 1rem 1rem', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        {phase === 'question' && question && (
          <div>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.95rem', fontWeight: 700, color: '#1F2937', marginBottom: '10px' }}>{question}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {isSpeechSupported() && (
                <button className="btn btn-primary" onClick={handleVoiceAnswer} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <MicIcon size={16} color="white" /> SPEAK
                </button>
              )}
              <button className="btn btn-glass" onClick={() => handleAnswer('(Great story!)')} style={{ flex: 1 }}>SKIP</button>
            </div>
          </div>
        )}
        {phase === 'listening' && (
          <div style={{ textAlign: 'center' }}>
            <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
              style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 8px',
                background: 'rgba(139,92,246,0.1)', border: '2px solid rgba(139,92,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
              <MicIcon size={22} color="#8B5CF6" />
            </motion.div>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#1F2937' }}>Listening...</p>
          </div>
        )}
        {phase === 'reading' && !isTyping && (
          <button className="btn btn-glass" onClick={() => stopSpeaking()} style={{ maxWidth: '100%' }}>SKIP AHEAD</button>
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
