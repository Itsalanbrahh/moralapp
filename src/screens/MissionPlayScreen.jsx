import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getMission } from '../data/missions'
import { speak } from '../utils/voice'
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

  if (!mission) return <div style={{ padding: '2rem', textAlign: 'center', color: '#1F2937', fontFamily: "'Baloo 2', cursive" }}>Mission not found</div>

  // Victory screen
  if (isDone) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%)' }}>
        {[...Array(12)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: 6 + Math.random() * 8, height: 6 + Math.random() * 8,
              background: ['#10B981', '#FBBF24', '#3B82F6', '#EC4899', '#8B5CF6', '#F59E0B'][i % 6],
              left: `${10 + Math.random() * 80}%`, top: `${20 + Math.random() * 40}%`,
            }}
            animate={{ y: [0, -20 - Math.random() * 30], opacity: [1, 0], rotate: [0, 360] }}
            transition={{ duration: 1.5 + Math.random(), delay: i * 0.08, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-center relative z-10">
          <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.6, repeat: 2 }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(145deg, #FBBF24, #F59E0B)', boxShadow: '0 8px 32px rgba(251,191,36,0.3)' }}>
              <TrophyIcon size={40} color="#7C4A1A" />
            </div>
          </motion.div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.8rem', fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>MISSION COMPLETE!</h2>
          <p style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#6B7280', fontFamily: "'Nunito', sans-serif" }}>
            {childName} conquered {mission.title}!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
              style={{ borderRadius: '20px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px',
                background: 'white', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <BoltIcon size={18} color="#F59E0B" />
              </div>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.25rem', fontWeight: 700, color: '#F59E0B' }}>+75</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', fontFamily: "'Nunito', sans-serif" }}>XP</span>
            </motion.div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
              style={{ borderRadius: '20px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px',
                background: 'white', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <StarIcon size={18} color="#F59E0B" />
              </div>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.25rem', fontWeight: 700, color: '#F59E0B' }}>+3</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', fontFamily: "'Nunito', sans-serif" }}>Stars</span>
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
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#F8F9FA' }}>
      {/* Top bar */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <motion.button onClick={() => navigate('mission')}
          style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
          whileTap={{ scale: 0.9 }}>
          <CloseIcon size={14} color="#6B7280" />
        </motion.button>
        <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: '#1F2937', margin: 0, flex: 1, truncate: true }}>
          {mission.title}
        </p>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${character.color}40` }}>
          <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Illustration */}
      <AnimatePresence mode="wait">
        <motion.div key={stepId} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 1rem', flexShrink: 0 }}>
          <div style={{
            width: '100%', height: '150px', borderRadius: '20px', overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a2a1a, #0d2818)',
            border: '1px solid rgba(0,0,0,0.04)',
          }}>
            <img src={step?.image} alt="Scene" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Text - speech bubble */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            border: `2px solid ${character.color}40`,
          }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            flex: 1, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: '1.25rem', padding: '0.75rem 1rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 600, color: '#1F2937', margin: 0 }}>
              {displayedText}
              {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} style={{ color: 'rgba(139,92,246,0.5)' }}>|</motion.span>}
            </p>
          </div>
        </div>
      </div>

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && rewardData && (
          <motion.div initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: -20 }}
            className="absolute inset-x-5 top-1/3 z-50"
            style={{
              borderRadius: '20px', padding: '1.5rem', textAlign: 'center',
              background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
              <StarIcon size={40} color="#FBBF24" />
            </motion.div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: '#9CA3AF', margin: '0.5rem 0' }}>Reward!</p>
            {rewardData.badge && <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#1F2937', margin: 0 }}>{rewardData.badge.name}</p>}
            {rewardData.gear && <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#1F2937', margin: 0 }}>{rewardData.gear.name}</p>}
            {rewardData.furniture && <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#1F2937', margin: 0 }}>{rewardData.furniture.name}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom actions */}
      <div style={{ padding: '0.75rem 1rem 1rem', flexShrink: 0, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        {step?.type === 'choice' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {step.choices.map((choice, i) => (
              <motion.button key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => handleChoice(choice)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '0.75rem 1rem', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  backdropFilter: 'blur(16px)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, color: '#8B5CF6' }}>
                  {['A', 'B', 'C'][i]}
                </span>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#1F2937' }}>
                  {choice.text}
                </span>
              </motion.button>
            ))}
          </div>
        ) : !isTyping ? (
          <button className="btn btn-primary" onClick={handleContinue} style={{ maxWidth: '100%' }}>
            {step?.type === 'victory' ? 'CLAIM REWARD!' : 'CONTINUE'}
          </button>
        ) : (
          <button className="btn btn-glass" onClick={() => { setDisplayedText(step.text); setIsTyping(false) }} style={{ maxWidth: '100%' }}>
            SKIP
          </button>
        )}
      </div>
    </div>
  )
}
