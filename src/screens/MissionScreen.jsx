import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getAllMissions } from '../data/missions'
import GlassCard from '../components/GlassCard'
import { BackArrowIcon, LockIcon, CheckIcon, StarIcon, ChevronRightIcon } from '../components/SVGIcons'

const worldColors = {
  forest: { bg: 'rgba(0,230,118,0.08)', border: 'rgba(0,230,118,0.15)', accent: '#00e676', glow: 'rgba(0,230,118,0.1)' },
  ocean: { bg: 'rgba(28,176,246,0.08)', border: 'rgba(28,176,246,0.15)', accent: '#1cb0f6', glow: 'rgba(28,176,246,0.1)' },
  castle: { bg: 'rgba(255,150,0,0.08)', border: 'rgba(255,150,0,0.15)', accent: '#ff9600', glow: 'rgba(255,150,0,0.1)' },
}

const worldIcons = {
  forest: '/assets/stories/forest-path.png',
  ocean: '/assets/stories/ocean-kingdom.png',
  castle: '/assets/stories/castle.png',
}

export default function MissionScreen({ navigate }) {
  const { completedMissions, level, selectedCharacter } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const missions = getAllMissions()

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-stars" style={{ background: '#0a0a1a' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => navigate('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <BackArrowIcon size={18} color="rgba(255,255,255,0.7)" />
        </motion.button>
        <h1 className="font-display text-xl font-bold text-white">Missions</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Character guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="speech-bubble flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${character.color}15` }}>
              <img src={character.image} alt={character.name} className="w-8 h-8 rounded-full object-cover" style={{ border: `2px solid ${character.color}40` }} />
            </div>
            <p className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Pick a world to explore! Complete missions to earn treasures!
            </p>
          </div>
        </motion.div>

        {/* World cards */}
        <div className="space-y-3">
          {missions.map((mission, i) => {
            const isComplete = completedMissions.includes(mission.id)
            const isLocked = mission.difficulty > level
            const c = worldColors[mission.world] || worldColors.forest
            const worldImg = worldIcons[mission.world]

            return (
              <motion.button
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 200 }}
                onClick={() => !isLocked && navigate('missionPlay', { missionId: mission.id })}
                disabled={isLocked}
                className="world-card w-full text-left"
                style={{
                  background: isLocked ? 'rgba(255,255,255,0.03)' : c.bg,
                  borderColor: isLocked ? 'rgba(255,255,255,0.05)' : c.border,
                  opacity: isLocked ? 0.5 : 1,
                  boxShadow: isLocked ? 'none' : `0 8px 24px ${c.glow}`,
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                  style={{
                    background: isLocked ? 'rgba(255,255,255,0.04)' : `${c.accent}15`,
                    border: `2px solid ${isLocked ? 'rgba(255,255,255,0.06)' : `${c.accent}25`}`,
                  }}>
                  {isLocked ? (
                    <LockIcon size={20} color="rgba(255,255,255,0.3)" />
                  ) : (
                    <img src={worldImg} alt={mission.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-white leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                      {mission.title}
                    </h3>
                    {isComplete && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,230,118,0.15)' }}>
                        <CheckIcon size={11} color="#00e676" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{mission.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(3)].map((_, j) => (
                        <StarIcon key={j} size={12} color={j < mission.difficulty ? c.accent : 'rgba(255,255,255,0.15)'} />
                      ))}
                    </div>
                    {isLocked && <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>Unlock at Lv{mission.difficulty}</span>}
                  </div>
                </div>
                {!isLocked && <ChevronRightIcon size={20} color="rgba(255,255,255,0.2)" />}
              </motion.button>
            )
          })}
        </div>

        {/* Coming soon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center py-5 rounded-2xl"
          style={{
            backdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(255,255,255,0.08)',
          }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ marginBottom: '0.5rem' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </motion.div>
          <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>More worlds coming soon!</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>Space. Jungle. Ice Kingdom</p>
        </motion.div>
      </div>
    </div>
  )
}
