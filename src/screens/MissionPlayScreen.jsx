import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getMission } from '../data/missions'
import { speak } from '../utils/voice'
import { GlassButton } from '../components/GlassCard'
import { CloseIcon, BoltIcon, StarIcon, TrophyIcon, CheckIcon } from '../components/SVGIcons'

export default function MissionPlayScreen({ navigate, params }) {
  const { selectedCharacter, childName, completeMission, addXP, addStars, addGear, addFurniture, addBadge } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const mission = getMission(params.missionId)

  const [stepId, setStepId] = useState('start')
  const [showReward, setShowReward] = useState(false)
  const [rewardData, setRewardData] = useState(null)
  const [isDone, setIsDone] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const step = mission?.steps.find(s => s.id === stepId)

  useEffect(() => {
    if (!step?.text) return
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    const text = step.text
    const timer = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) { clearInterval(timer); setIsTyping(false) }
    }, 22)
    return () => clearInterval(timer)
  }, [stepId, step?.text])

  useEffect(() => {
    if (!step || isDone) return
    const timer = setTimeout(() => speak(step.text, { pitch: character.voicePitch, rate: character.voiceRate }), 400)
    return () => clearTimeout(timer)
  }, [stepId, isDone])

  const handleChoice = (choice) => {
    if (choice.reward) applyReward(choice.reward)
    setStepId(choice.next)
  }

  const handleContinue = () => {
    if (step.reward) applyReward(step.reward)
    if (step.type === 'victory') { completeMission(mission.id); setIsDone(true) }
    else if (step.next) setStepId(step.next)
  }

  const applyReward = (reward) => {
    if (reward.xp) addXP(reward.xp)
    if (reward.stars) addStars(reward.stars)
    if (reward.badge) addBadge(reward.badge)
    if (reward.gear) addGear(reward.gear)
    if (reward.furniture) addFurniture(reward.furniture)
    setRewardData(reward)
    setShowReward(true)
    setTimeout(() => setShowReward(false), 2200)
  }

  if (!mission) return <div className="p-8 text-center text-white font-display">Mission not found</div>

  // Victory screen
  if (isDone) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-stars"
        style={{ background: 'linear-gradient(180deg, #0a1a0f 0%, #0a0a1a 100%)' }}>
        {/* Confetti */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 6 + Math.random() * 8, height: 6 + Math.random() * 8,
              background: ['#7c5aff', '#ffc800', '#1cb0f6', '#ff6b9d', '#ff9600', '#00e676'][i % 6],
              left: `${10 + Math.random() * 80}%`, top: `${20 + Math.random() * 40}%`,
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
              style={{
                background: 'linear-gradient(145deg, #ffc800, #ffb800)',
                boxShadow: '0 8px 32px rgba(255,200,0,0.25), 0 0 50px rgba(255,200,0,0.1)',
              }}>
              <TrophyIcon size={40} color="#5a3e00" />
            </div>
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-white mb-1">MISSION COMPLETE!</h2>
          <p className="mb-6 font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{childName} conquered {mission.title}!</p>

          <div className="flex gap-3 justify-center mb-8">
            <motion.div className="rounded-2xl p-4 flex flex-col items-center"
              style={{
                backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)', minWidth: 80,
              }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ background: 'rgba(255,200,0,0.15)' }}>
                <BoltIcon size={18} color="#ffc800" />
              </div>
              <span className="text-xl font-extrabold" style={{ fontFamily: "'Baloo 2', cursive", color: '#ffc800' }}>+75</span>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>XP</span>
            </motion.div>
            <motion.div className="rounded-2xl p-4 flex flex-col items-center"
              style={{
                backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)', minWidth: 80,
              }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ background: 'rgba(255,200,0,0.15)' }}>
                <StarIcon size={18} color="#ffc800" />
              </div>
              <span className="text-xl font-extrabold" style={{ fontFamily: "'Baloo 2', cursive", color: '#ffc800' }}>+3</span>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>Stars</span>
            </motion.div>
          </div>

          <GlassButton variant="primary" onClick={() => navigate('home')}>
            CONTINUE
          </GlassButton>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* Top bar */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => navigate('mission')}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <CloseIcon size={14} color="rgba(255,255,255,0.5)" />
        </motion.button>
        <h2 className="font-display text-sm font-bold text-white flex-1 truncate">{mission.title}</h2>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
          style={{ background: `${character.color}15`, border: `1px solid ${character.color}25` }}>
          <img src={character.image} alt={character.name} className="w-7 h-7 rounded-full object-cover" />
        </div>
      </div>

      {/* Illustration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepId}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-shrink-0 flex items-center justify-center py-4"
        >
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(16px)',
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{step?.illustration}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Text - speech bubble */}
      <div className="flex-1 px-5 overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
            style={{
              background: `${character.color}15`,
              border: `2px solid ${character.color}25`,
              backdropFilter: 'blur(16px)',
            }}>
            <img src={character.image} alt={character.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <div className="speech-bubble flex-1">
            <p className="text-base leading-relaxed font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {displayedText}
              {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: 'rgba(124,90,255,0.5)' }}>|</motion.span>}
            </p>
          </div>
        </div>
      </div>

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && rewardData && (
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -20 }}
            className="absolute inset-x-5 top-1/3 z-50 rounded-2xl p-6 text-center"
            style={{
              backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              background: 'rgba(10,10,26,0.95)',
              border: '1px solid rgba(124,90,255,0.3)',
              boxShadow: '0 20px 60px rgba(124,90,255,0.2)',
            }}
          >
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
              <StarIcon size={40} color="#ffc800" />
            </motion.div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: '0.5rem 0' }}>Reward!</p>
            {rewardData.badge && <p className="text-white font-bold font-display text-lg">{rewardData.badge.name}</p>}
            {rewardData.gear && <p className="text-white font-bold font-display text-lg">{rewardData.gear.name}</p>}
            {rewardData.furniture && <p className="text-white font-bold font-display text-lg">{rewardData.furniture.name}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom actions */}
      <div className="shrink-0 p-4 safe-bottom" style={{ background: '#0a0a1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {step?.type === 'choice' ? (
          <div className="space-y-2">
            {step.choices.map((choice, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => handleChoice(choice)}
                className="choice-card"
              >
                <span className="text-lg shrink-0">{['A', 'B', 'C'][i] || '*'}</span>
                {choice.text}
              </motion.button>
            ))}
          </div>
        ) : !isTyping ? (
          <GlassButton variant="primary" onClick={handleContinue}>
            {step?.type === 'victory' ? 'CLAIM REWARD!' : 'CONTINUE'}
          </GlassButton>
        ) : (
          <GlassButton variant="glass" onClick={() => { setDisplayedText(step.text); setIsTyping(false) }}>
            SKIP
          </GlassButton>
        )}
      </div>
    </div>
  )
}
