import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getStory } from '../data/stories'
import { speak, stopSpeaking, listen, isSpeechSupported } from '../utils/voice'
import { CloseIcon, MicIcon, BackArrowIcon, BoltIcon, CheckIcon, StarIcon, HeartIcon, ShieldIcon, BookIcon, PlayIcon, PauseIcon, BoxIcon, RefreshIcon, MenuDotsIcon, SpeedIcon } from '../components/SVGIcons'

const characterCards = [
  { name: 'Kael', tag: 'courage', tagIcon: 'shield', color: '#10B981' },
  { name: 'Mira', tag: 'kindness', tagIcon: 'heart', color: '#EC4899' },
  { name: 'Pip', tag: 'wisdom', tagIcon: 'book', color: '#8B5CF6' },
]

function TagIcon({ type, size = 12 }) {
  switch(type) {
    case 'shield': return <ShieldIcon size={size} color="white" />
    case 'heart': return <HeartIcon size={size} color="white" />
    case 'book': return <BookIcon size={size} color="white" />
    default: return <StarIcon size={size} color="white" />
  }
}

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
  const [audioProgress, setAudioProgress] = useState(30)
  const typingRef = useRef(null)

  const scene = story?.scenes[sceneIndex]
  const progress = ((sceneIndex + 1) / story?.scenes.length) * 100

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

  if (!story) return <div style={{ padding: '2rem', textAlign: 'center', color: 'white', fontFamily: "'Baloo 2', cursive" }}>Story not found</div>

  // Victory screen
  if (isDone) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)' }}>
        {[...Array(12)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: 6 + Math.random() * 8, height: 6 + Math.random() * 8,
              background: ['#8B5CF6', '#FBBF24', '#3B82F6', '#EC4899', '#F59E0B', '#10B981'][i % 6],
              left: `${10 + Math.random() * 80}%`, top: `${20 + Math.random() * 40}%`,
            }}
            animate={{ y: [0, -20 - Math.random() * 30], opacity: [1, 0], rotate: [0, 360] }}
            transition={{ duration: 1.5 + Math.random(), delay: i * 0.08, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-center relative z-10">
          <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.6, repeat: 2 }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)', boxShadow: '0 8px 32px rgba(139,92,246,0.3)' }}>
              <StarIcon size={40} color="#FBBF24" />
            </div>
          </motion.div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.8rem', fontWeight: 700, color: 'white', margin: '0 0 4px' }}>STORY COMPLETE!</h2>
          <p style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: "'Nunito', sans-serif" }}>
            Great listening, {childName}!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
              style={{ borderRadius: '20px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px',
                backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <BoltIcon size={18} color="#A78BFA" />
              </div>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.25rem', fontWeight: 700, color: '#A78BFA' }}>+50</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: "'Nunito', sans-serif" }}>XP</span>
            </motion.div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('home')} style={{ maxWidth: '300px' }}>
            CONTINUE
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0F172A' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <motion.button onClick={() => navigate('story')}
          style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
          whileTap={{ scale: 0.9 }}>
          <BackArrowIcon size={16} color="rgba(255,255,255,0.7)" />
        </motion.button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            The Three Lights of Whisperwood
          </p>
        </div>
        <div style={{ padding: '3px 10px', borderRadius: '9999px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: '#A78BFA' }}>
            Chapter {sceneIndex + 1} of {story.scenes.length}
          </span>
        </div>
        <motion.button style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }} whileTap={{ scale: 0.9 }}>
          <HeartIcon size={14} color="#EC4899" filled={false} />
        </motion.button>
        <motion.button style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }} whileTap={{ scale: 0.9 }}>
          <MenuDotsIcon size={14} color="rgba(255,255,255,0.5)" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Character Cards */}
        <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
          {characterCards.map((char, i) => (
            <motion.div key={char.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              style={{
                flex: 1, borderRadius: '20px', overflow: 'hidden',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(16px)',
              }}>
              <div style={{
                height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${char.color}30, ${char.color}10)`,
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: `${char.color}30`, border: `2px solid ${char.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{char.name === 'Kael' ? '🦊' : char.name === 'Mira' ? '🐦' : '🦉'}</span>
                </div>
              </div>
              <div style={{ padding: '6px 8px', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.8rem', fontWeight: 700, color: 'white', margin: 0 }}>{char.name}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '9999px', background: `${char.color}25`, marginTop: '3px' }}>
                  <TagIcon type={char.tagIcon} size={9} />
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: char.color }}>{char.tag}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scene illustration */}
        <AnimatePresence mode="wait">
          <motion.div key={sceneIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem' }}>
            <div style={{
              width: '100%', height: '140px', borderRadius: '20px', overflow: 'hidden',
              background: scene?.background || 'linear-gradient(180deg, #1a2a1a, #0d2818)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <img src={scene?.image} alt="Scene" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Story text */}
        <div style={{ padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <motion.div style={{
              width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              border: `2px solid ${character.color}40`,
            }} animate={isPlaying ? { y: [0, -4, 0] } : {}} transition={{ duration: 0.4, repeat: Infinity }}>
              <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <div style={{
              flex: 1, backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem',
              padding: '0.75rem 1rem',
            }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                {displayedText}
                {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: 'rgba(139,92,246,0.5)' }}>|</motion.span>}
              </p>
            </div>
          </div>
        </div>

        {/* Reaction */}
        <AnimatePresence>
          {showReaction && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              style={{ margin: '0 1rem', padding: '0.75rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckIcon size={12} color="#10B981" />
              </div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{reactionText}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio Player */}
      <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <motion.button
          onClick={() => { setIsPlaying(!isPlaying); if (isPlaying) stopSpeaking() }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none',
          }}>
          {isPlaying ? <PauseIcon size={16} color="white" /> : <PlayIcon size={16} color="white" />}
        </motion.button>
        {/* Waveform */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2px', height: '24px' }}>
          {[...Array(30)].map((_, i) => {
            const h = 4 + Math.sin(i * 0.5) * 8 + Math.random() * 4
            return <div key={i} style={{ width: '3px', height: `${h}px`, borderRadius: '2px', background: i < 30 * audioProgress / 100 ? '#8B5CF6' : 'rgba(255,255,255,0.15)' }} />
          })}
        </div>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
          1:24 / 4:36
        </span>
        <div style={{ padding: '3px 8px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>1.0x</span>
        </div>
      </div>

      {/* Interaction Prompt */}
      {showQuestion && scene?.question && (
        <div style={{ padding: '0 1rem 0.5rem', flexShrink: 0 }}>
          <div style={{
            background: 'rgba(255,255,255,0.9)', borderRadius: '20px', padding: '0.75rem 1rem',
            display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            <StarIcon size={18} color="#F59E0B" />
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#1F2937', margin: 0, flex: 1 }}>
              {scene.question}
            </p>
          </div>
        </div>
      )}

      {/* Microphone Button */}
      {showQuestion && scene?.questionType === 'open' && (
        <div style={{ padding: '0 1rem 0.5rem', textAlign: 'center', flexShrink: 0 }}>
          <motion.button
            onClick={async () => {
              if (!isSpeechSupported()) { handleAnswer('(no voice)'); return }
              setIsListening(true)
              try { const r = await listen({ timeout: 15000 }); if (r.transcript) handleAnswer(r.transcript) } catch(e) { console.warn(e) }
              setIsListening(false)
            }}
            whileTap={{ scale: 0.95 }}
            animate={isListening ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.8, repeat: isListening ? Infinity : 0 }}
            style={{
              width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto',
              background: 'linear-gradient(135deg, #EC4899, #F472B6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: 'none',
              boxShadow: '0 4px 20px rgba(236,72,153,0.3)',
            }}>
            <MicIcon size={24} color="white" />
          </motion.button>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', margin: '6px 0 0' }}>
            Tap the mic and share your thoughts.
          </p>
        </div>
      )}

      {/* Footer Actions */}
      <div style={{ padding: '0.5rem 1rem 1rem', display: 'flex', gap: '10px', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <motion.button whileTap={{ scale: 0.97 }}
          style={{
            flex: 1, borderRadius: '16px', padding: '0.6rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          }}>
          <BoxIcon size={16} color="rgba(255,255,255,0.5)" />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Archive</p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>4 saved</p>
          </div>
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }}
          style={{
            flex: 1, borderRadius: '16px', padding: '0.6rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
          }}>
          <RefreshIcon size={16} color="rgba(255,255,255,0.5)" />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Retell the Story</p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Hear it again!</p>
          </div>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', marginLeft: 'auto' }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </motion.button>
      </div>

      {/* Choice buttons (for choice-type questions) */}
      {showQuestion && scene?.questionType === 'choice' && (
        <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          {scene.choices.map((choice, i) => (
            <motion.button key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => { setSelectedChoice(i); handleAnswer(choice) }}
              disabled={selectedChoice !== null}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '0.75rem 1rem', borderRadius: '16px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, color: '#A78BFA' }}>
                {['A', 'B', 'C'][i]}
              </span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                {choice}
              </span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Continue / Skip buttons */}
      {!showQuestion && (
        <div style={{ padding: '0 1rem 1rem', flexShrink: 0 }}>
          <button className="btn btn-primary" onClick={handleSkip} style={{ maxWidth: '100%' }}>
            {isTyping ? 'SKIP' : 'CONTINUE'}
          </button>
        </div>
      )}
    </div>
  )
}

function getReaction(answer, characterId) {
  const reactions = {
    owl: ["Wonderful thinking!", "You understand it well!", "What a wise answer!"],
    bear: ["AMAZING answer, buddy!", "You nailed it!", "That's fantastic!"],
    bunny: ["Ooh SO good!!", "You're SO clever!", "I LOVE that answer!"],
  }
  const options = reactions[characterId] || reactions.owl
  return options[Math.floor(Math.random() * options.length)]
}
