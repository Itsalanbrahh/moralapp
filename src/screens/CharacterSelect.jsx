import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { characters } from '../data/characters'
import { speak } from '../utils/voice'
import { StarIcon, ChevronRightIcon, SparkleIcon, CheckIcon, VoiceOnIcon, BookIcon, TrophyIcon } from '../components/SVGIcons'

const guideGradients = {
  owl: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
  bear: 'linear-gradient(135deg, #F59E0B, #F97316)',
  bunny: 'linear-gradient(135deg, #EC4899, #FBCFE8)',
}

const READING_LEVELS = [
  { id: 'listen', title: 'Listen', subtitle: 'Not reading yet — hear the story aloud', Icon: VoiceOnIcon, color: '#3B82F6' },
  { id: 'beginner', title: 'Read-Along', subtitle: 'Learning to read — words highlight as they’re read', Icon: BookIcon, color: '#10B981' },
  { id: 'advanced', title: 'Reading Pro', subtitle: 'Confident reader — read it and take a quiz', Icon: TrophyIcon, color: '#8B5CF6' },
]

function FloatingStar({ x, y, size, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y }}
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1, 0.8], rotate: [0, 180, 360] }}
      transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <SparkleIcon size={size} color="rgba(255,200,0,0.5)" />
    </motion.div>
  )
}

export default function CharacterSelect({ navigate }) {
  const [step, setStep] = useState('name')
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(null)
  const [readingChoice, setReadingChoice] = useState(null)
  const { setChildName, selectCharacter, completeOnboarding, setReadingLevel } = useGameStore()

  const handleNameSubmit = () => {
    if (name.trim().length > 0) {
      setChildName(name.trim())
      setStep('character')
    }
  }

  const handleSelectCharacter = (charId) => {
    setSelected(charId)
    const char = characters[charId]
    speak(char.greeting, { pitch: char.voicePitch, rate: char.voiceRate })
  }

  const handleCharacterNext = () => {
    if (selected) {
      selectCharacter(selected)
      setStep('reading')
    }
  }

  const handleFinish = () => {
    if (readingChoice) {
      setReadingLevel(readingChoice)
      completeOnboarding()
      navigate('home')
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center px-5 py-10 overflow-y-auto" style={{
      background: 'linear-gradient(180deg, #E8D5F5 0%, #F5D5C8 100%)',
      position: 'relative',
    }}>
      <FloatingStar x="10%" y="10%" size={10} delay={0} />
      <FloatingStar x="85%" y="15%" size={12} delay={0.5} />
      <FloatingStar x="5%" y="45%" size={8} delay={1} />
      <FloatingStar x="90%" y="40%" size={10} delay={1.5} />

      <AnimatePresence mode="wait">
        {step === 'name' ? (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-sm flex flex-col items-center justify-center flex-1"
          >
            {/* Owl mascot */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-5"
            >
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
                border: '3px solid rgba(139,92,246,0.3)',
                boxShadow: '0 8px 24px rgba(139,92,246,0.2)',
              }}>
                <img src="/assets/characters/owl.png" alt="Owl" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </motion.div>

            {/* Glass card question */}
            <div style={{
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '1.5rem', padding: '1.25rem', marginBottom: '1.5rem',
              textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%',
            }}>
              <p style={{
                fontFamily: "'Baloo 2', cursive", fontWeight: 700,
                fontSize: '1.25rem', color: '#1F2937',
              }}>
                Hi there! What's your name?
              </p>
            </div>

            {/* Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              placeholder="Type your name..."
              autoFocus
              maxLength={20}
              className="glass-input"
              style={{ textAlign: 'center', marginBottom: '1.5rem' }}
            />

            <button
              className="btn btn-primary"
              onClick={handleNameSubmit}
              disabled={name.trim().length === 0}
              style={{ opacity: name.trim().length === 0 ? 0.4 : 1 }}
            >
              Continue
            </button>
          </motion.div>
        ) : step === 'character' ? (
          <motion.div
            key="character"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-sm flex flex-col items-center flex-1"
          >
            {/* Logo */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4 mt-2">
              <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2rem', lineHeight: 1.1 }}>
                <span style={{ color: '#8B5CF6' }}>Build</span>
                <span style={{ color: '#3B82F6' }}>Moral</span>
              </h1>
            </motion.div>

            {/* Choose your guide */}
            <div className="text-center mb-4">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <StarIcon size={12} color="#FBBF24" />
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#4A5568' }}>
                  {name}, pick your guide!
                </span>
                <StarIcon size={12} color="#FBBF24" />
              </div>
            </div>

            {/* Character cards */}
            <div className="flex flex-col gap-3 w-full mb-5">
              {Object.values(characters).map((char, i) => (
                <motion.button
                  key={char.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                  onClick={() => handleSelectCharacter(char.id)}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    background: selected === char.id ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '30px',
                    border: selected === char.id ? `2px solid ${char.color}60` : '2px solid rgba(255,255,255,0.5)',
                    boxShadow: selected === char.id ? `0 4px 24px ${char.color}20` : '0 4px 24px rgba(0,0,0,0.08)',
                    overflow: 'hidden', padding: 0, cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '90px', height: '90px',
                    background: guideGradients[char.id] || guideGradients.owl,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, borderRadius: '30px 0 0 30px',
                  }}>
                    <motion.img
                      src={char.image} alt={char.name}
                      style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                    />
                  </div>
                  <div style={{ flex: 1, padding: '0.75rem 0.75rem 0.75rem 1rem' }}>
                    <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#1F2937', margin: 0, lineHeight: 1.2 }}>
                      {char.name}
                    </p>
                    <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                      {char.title}
                    </p>
                  </div>
                  <div style={{ paddingRight: '1rem', flexShrink: 0 }}>
                    <ChevronRightIcon size={20} color="#9CA3AF" />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Selected character greeting */}
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-4"
              >
                <div style={{
                  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                  background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: '1.25rem', padding: '0.75rem 1rem', textAlign: 'center',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", color: '#6B7280', fontStyle: 'italic', fontSize: '0.85rem' }}>
                    "{characters[selected].greeting}"
                  </p>
                </div>
              </motion.div>
            )}

            <button
              className="btn btn-primary"
              onClick={handleCharacterNext}
              disabled={!selected}
              style={{ opacity: selected ? 1 : 0.4 }}
            >
              {selected ? `Let's go with ${characters[selected].name}!` : 'Pick a guide first'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="reading"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-sm flex flex-col items-center flex-1"
          >
            {/* Guide mascot */}
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mb-3 mt-2">
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${characters[selected]?.color || '#8B5CF6'}40`, boxShadow: '0 8px 24px rgba(139,92,246,0.15)' }}>
                <img src={characters[selected]?.image || '/assets/characters/owl.png'} alt="Guide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </motion.div>

            <div className="text-center mb-4">
              <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem', color: '#1F2937', margin: 0 }}>
                How does {name} read?
              </h2>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: '#6B7280', margin: '4px 0 0' }}>
                We’ll shape each story to fit — you can change this later.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full mb-4">
              {READING_LEVELS.map((lvl, i) => {
                const active = readingChoice === lvl.id
                return (
                  <motion.button
                    key={lvl.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                    onClick={() => setReadingChoice(lvl.id)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                      background: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                      borderRadius: '22px', padding: '0.85rem 1rem',
                      border: active ? `2px solid ${lvl.color}` : '2px solid rgba(255,255,255,0.5)',
                      boxShadow: active ? `0 6px 22px ${lvl.color}30` : '0 4px 20px rgba(0,0,0,0.06)',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '15px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? lvl.color : `${lvl.color}18` }}>
                      <lvl.Icon size={22} color={active ? 'white' : lvl.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.05rem', color: '#1F2937', margin: 0, lineHeight: 1.2 }}>{lvl.title}</p>
                      <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.72rem', color: '#6B7280', margin: '1px 0 0', lineHeight: 1.25 }}>{lvl.subtitle}</p>
                    </div>
                    <div style={{ width: '22px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                      {active && <CheckIcon size={18} color={lvl.color} />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <button
              className="btn btn-primary"
              onClick={handleFinish}
              disabled={!readingChoice}
              style={{ opacity: readingChoice ? 1 : 0.4 }}
            >
              {readingChoice ? 'Start the Adventure!' : 'Pick a reading level'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
