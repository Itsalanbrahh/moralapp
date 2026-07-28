import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { characters } from '../data/characters'
import { speak } from '../utils/voice'

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
    <div className="w-full h-full flex flex-col" style={{ background: '#131f24' }}>
      {/* Progress bar */}
      <div className="px-5 pt-4">
        <div className="h-4 rounded-full overflow-hidden" style={{ background: '#2b3f48' }}>
          <motion.div className="h-full rounded-full" style={{ background: '#58cc02' }}
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
                style={{ background: '#58cc02', border: '3px solid #46a302' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src="/assets/characters/owl.png" alt="Owl" className="w-full h-full object-cover" />
              </motion.div>

              <div className="relative bg-white rounded-2xl p-5 mb-8 w-full"
                style={{ borderBottom: '4px solid #e5e5e5' }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '12px solid white' }} />
                <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.25rem', textAlign: 'center', color: '#3c3c3c' }}>
                  Hi there! What's your name?
                </p>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                placeholder="Type your name..."
                style={{
                  width: '100%', background: 'white', borderRadius: '1rem', padding: '1rem 1.25rem',
                  fontSize: '1.1rem', textAlign: 'center', fontWeight: 700, color: '#3c3c3c',
                  border: '2px solid #e5e5e5', borderBottom: '4px solid #e5e5e5', outline: 'none',
                }}
                autoFocus
                maxLength={20}
              />

              <button
                onClick={handleNameSubmit}
                disabled={name.trim().length === 0}
                className="w-full rounded-2xl text-white font-bold uppercase mt-6 disabled:opacity-40"
                style={{
                  fontFamily: "'Baloo 2', cursive", fontSize: '1.1rem', padding: '1rem',
                  background: '#58cc02', border: 'none', borderBottom: '5px solid #46a302',
                  boxShadow: '0 6px 0 #3d8b02', cursor: 'pointer',
                }}
              >
                Continue
              </button>
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
                style={{ background: '#58cc02', border: '2px solid #46a302' }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img src="/assets/characters/owl.png" alt="Owl" className="w-full h-full object-cover" />
              </motion.div>

              <div className="relative bg-white rounded-2xl p-4 mb-6 w-full"
                style={{ borderBottom: '4px solid #e5e5e5' }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '12px solid white' }} />
                <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', textAlign: 'center', color: '#3c3c3c' }}>
                  {name}, pick your buddy!
                </p>
              </div>

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
                      background: selected === char.id ? '#e8ffe0' : 'white',
                      border: `2px solid ${selected === char.id ? '#58cc02' : '#e5e5e5'}`,
                      borderBottom: `4px solid ${selected === char.id ? '#46a302' : '#e5e5e5'}`,
                      boxShadow: selected === char.id ? '0 0 12px rgba(88,204,2,0.3)' : 'none',
                    }}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden mb-1.5"
                      style={{ background: char.color, border: '2px solid rgba(255,255,255,0.2)' }}>
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                    </div>
                    <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.85rem', color: '#3c3c3c' }}>{char.name}</span>
                    <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: '#afafaf' }}>{char.title}</span>
                  </motion.button>
                ))}
              </div>

              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-white rounded-2xl p-4 mb-6 w-full"
                  style={{ borderBottom: '4px solid #e5e5e5' }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '12px solid white' }} />
                  <p style={{ fontFamily: "'Nunito', sans-serif", color: '#3c3c3c', textAlign: 'center', fontStyle: 'italic' }}>
                    "{characters[selected].greeting}"
                  </p>
                </motion.div>
              )}

              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="w-full rounded-2xl text-white font-bold uppercase disabled:opacity-40"
                style={{
                  fontFamily: "'Baloo 2', cursive", fontSize: '1.05rem', padding: '1rem',
                  background: '#58cc02', border: 'none', borderBottom: '5px solid #46a302',
                  boxShadow: '0 6px 0 #3d8b02', cursor: 'pointer',
                }}
              >
                {selected ? `Let's go with ${characters[selected].name}!` : 'Pick a buddy first'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
