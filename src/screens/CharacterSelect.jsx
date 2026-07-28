import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { characters } from '../data/characters'
import { speak } from '../utils/voice'
import GlassCard, { GlassButton, GlassInput } from '../components/GlassCard'

export default function CharacterSelect({ navigate }) {
  const [step, setStep] = useState('name')
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(null)
  const { setChildName, selectCharacter, completeOnboarding } = useGameStore()

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

  const handleConfirm = () => {
    if (selected) {
      selectCharacter(selected)
      completeOnboarding()
      navigate('home')
    }
  }

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#0a0a1a' }}>
      {/* Progress bar */}
      <div className="px-5 pt-4">
        <div style={{
          height: '10px', borderRadius: '5px', overflow: 'hidden',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <motion.div style={{
            height: '100%', borderRadius: '5px',
            background: 'linear-gradient(90deg, #7c5aff, #a78bfa)',
            boxShadow: '0 0 8px rgba(124,90,255,0.3)',
          }}
            animate={{ width: step === 'name' ? '50%' : '100%' }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'name' ? (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <motion.div
                className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4"
                style={{
                  border: '3px solid rgba(124,90,255,0.3)',
                  boxShadow: '0 8px 24px rgba(124,90,255,0.2)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src="/assets/characters/owl.png" alt="Owl" className="w-full h-full object-cover" />
              </motion.div>

              <GlassCard style={{ padding: '1.25rem', marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{
                  fontFamily: "'Baloo 2', cursive", fontWeight: 700,
                  fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)',
                }}>
                  Hi there! What's your name?
                </p>
              </GlassCard>

              <GlassInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Type your name..."
                autoFocus
                maxLength={20}
                style={{ textAlign: 'center', marginBottom: '1.5rem' }}
              />

              <GlassButton
                variant="primary"
                onClick={handleNameSubmit}
                disabled={name.trim().length === 0}
              >
                Continue
              </GlassButton>
            </motion.div>
          ) : (
            <motion.div
              key="character"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <motion.div
                className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-3"
                style={{
                  border: '2px solid rgba(124,90,255,0.3)',
                  boxShadow: '0 6px 16px rgba(124,90,255,0.15)',
                }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src="/assets/characters/owl.png" alt="Owl" className="w-full h-full object-cover" />
              </motion.div>

              <GlassCard style={{ padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <p style={{
                  fontFamily: "'Baloo 2', cursive", fontWeight: 700,
                  fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)',
                }}>
                  {name}, pick your buddy!
                </p>
              </GlassCard>

              {/* Character cards */}
              <div className="flex gap-3 mb-6 w-full justify-center">
                {Object.values(characters).map((char, i) => (
                  <motion.button
                    key={char.id}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                    onClick={() => handleSelectCharacter(char.id)}
                    className="flex flex-col items-center p-3 rounded-2xl transition-all"
                    style={{
                      width: '5.5rem',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      background: selected === char.id ? `${char.color}18` : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${selected === char.id ? `${char.color}60` : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: selected === char.id ? `0 4px 20px ${char.color}20` : 'none',
                    }}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden mb-1.5"
                      style={{
                        border: `2px solid ${char.color}40`,
                        boxShadow: `0 4px 12px ${char.color}15`,
                      }}>
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                    </div>
                    <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>{char.name}</span>
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{char.title}</span>
                  </motion.button>
                ))}
              </div>

              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard style={{ padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                      "{characters[selected].greeting}"
                    </p>
                  </GlassCard>
                </motion.div>
              )}

              <GlassButton
                variant="primary"
                onClick={handleConfirm}
                disabled={!selected}
              >
                {selected ? `Let's go with ${characters[selected].name}!` : 'Pick a buddy first'}
              </GlassButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
