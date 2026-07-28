import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getMission } from '../data/missions'
import { speak } from '../utils/voice'

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
        style={{ background: 'linear-gradient(180deg, #0f2b1a 0%, #131f24 100%)' }}>
        {/* Confetti */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 6 + Math.random() * 8, height: 6 + Math.random() * 8,
              background: ['#58cc02', '#ffc800', '#1cb0f6', '#ff86d0', '#ff9600', '#6a3aff'][i % 6],
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
              style={{ background: 'linear-gradient(145deg, #ffc800, #ffb800)', boxShadow: '0 8px 0 #a07500, 0 10px 25px rgba(255,200,0,0.3)' }}>
              <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🏆</span>
            </div>
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>MISSION COMPLETE!</h2>
          <p className="mb-6 font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>{childName} conquered {mission.title}! 🌟</p>

          <div className="flex gap-3 justify-center mb-8">
            <motion.div className="rounded-2xl p-4 flex flex-col items-center"
              style={{ background: '#1a2e35', border: '2px solid #2b3f48', minWidth: 80 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ background: '#ffc800' }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
              </div>
              <span className="text-yellow-400 text-xl font-extrabold" style={{ fontFamily: "'Baloo 2', cursive" }}>+75</span>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>XP</span>
            </motion.div>
            <motion.div className="rounded-2xl p-4 flex flex-col items-center"
              style={{ background: '#1a2e35', border: '2px solid #2b3f48', minWidth: 80 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1" style={{ background: '#ffc800' }}>
                <span style={{ fontSize: '1.1rem' }}>⭐</span>
              </div>
              <span className="text-yellow-400 text-xl font-extrabold" style={{ fontFamily: "'Baloo 2', cursive" }}>+3</span>
              <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>Stars</span>
            </motion.div>
          </div>

          <motion.button onClick={() => navigate('home')} className="btn btn-green"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
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
      {/* Top bar */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => navigate('mission')}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: '#1a2e35', border: '1.5px solid #2b3f48' }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-white text-sm font-bold">✕</span>
        </motion.button>
        <h2 className="font-display text-sm font-bold text-white flex-1 truncate">{mission.icon} {mission.title}</h2>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${character.color}30` }}>
          <img src={character.image} alt={character.name} className="w-7 h-7 rounded-full object-cover" style={{ border: '2px solid rgba(255,255,255,0.2)' }} />
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
            style={{ background: '#1a2e35', border: '3px solid #2b3f48', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{step?.illustration}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Text — speech bubble */}
      <div className="flex-1 px-5 overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
            style={{
              background: `linear-gradient(145deg, ${character.color}cc, ${character.color})`,
              border: '2px solid rgba(255,255,255,0.2)',
              borderBottom: '3px solid rgba(0,0,0,0.15)',
            }}>
            <img src={character.image} alt={character.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
          </div>
          <div className="speech-bubble flex-1">
            <p className="text-base leading-relaxed font-semibold" style={{ color: '#3c3c3c' }}>
              {displayedText}
              {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-gray-400">|</motion.span>}
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
            style={{ background: '#1a2e35', border: '3px solid #58cc02', boxShadow: '0 8px 30px rgba(88,204,2,0.2)' }}
          >
            <motion.div className="text-4xl mb-2" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
              ✨ Reward! ✨
            </motion.div>
            {rewardData.badge && <p className="text-white font-bold font-display text-lg">🏆 {rewardData.badge.name}</p>}
            {rewardData.gear && <p className="text-white font-bold font-display text-lg">⚔️ {rewardData.gear.name}</p>}
            {rewardData.furniture && <p className="text-white font-bold font-display text-lg">🪑 {rewardData.furniture.name}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom actions */}
      <div className="shrink-0 p-4 safe-bottom" style={{ background: '#131f24', borderTop: '2px solid #1a2e35' }}>
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
                <span className="text-lg shrink-0">{['🗡️', '🛡️', '🔮'][i] || '•'}</span>
                {choice.text}
              </motion.button>
            ))}
          </div>
        ) : !isTyping ? (
          <motion.button onClick={handleContinue} className="btn btn-green" whileTap={{ y: 3 }}>
            {step?.type === 'victory' ? '🎉 CLAIM REWARD!' : 'CONTINUE →'}
          </motion.button>
        ) : (
          <motion.button onClick={() => { setDisplayedText(step.text); setIsTyping(false) }}
            className="btn btn-outline" style={{ background: '#1a2e35', color: 'white', borderColor: '#2b3f48' }}
            whileTap={{ y: 3 }}
          >
            SKIP →
          </motion.button>
        )}
      </div>
    </div>
  )
}