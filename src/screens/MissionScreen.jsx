import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getAllMissions } from '../data/missions'

const worldColors = {
  forest: { bg: 'linear-gradient(135deg, #2d7a3a, #1d6a2a)', dark: '#155a1f', emoji: '🌲' },
  ocean: { bg: 'linear-gradient(135deg, #1a7ab5, #0d6a9d)', dark: '#0a5a85', emoji: '🌊' },
  castle: { bg: 'linear-gradient(135deg, #b5781a, #9d680d)', dark: '#85580a', emoji: '🏰' },
}

export default function MissionScreen({ navigate }) {
  const { completedMissions, level, selectedCharacter } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const missions = getAllMissions()

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-stars" style={{ background: '#131f24' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => navigate('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#1a2e35', border: '1.5px solid #2b3f48' }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-white text-lg">←</span>
        </motion.button>
        <h1 className="font-display text-xl font-bold text-white">Missions</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Character guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="speech-bubble flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${character.color}20` }}>
              <img src={character.image} alt={character.name} className="w-8 h-8 rounded-full object-cover" style={{ border: '2px solid rgba(255,255,255,0.2)' }} />
            </div>
            <p className="font-bold text-sm" style={{ color: '#3c3c3c' }}>
              Pick a world to explore! Complete missions to earn treasures! ⚔️
            </p>
          </div>
        </motion.div>

        {/* World cards */}
        <div className="space-y-3">
          {missions.map((mission, i) => {
            const isComplete = completedMissions.includes(mission.id)
            const isLocked = mission.difficulty > level
            const c = worldColors[mission.world] || worldColors.forest

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
                  background: isLocked ? '#1a2e35' : c.bg,
                  borderBottomColor: isLocked ? '#131f24' : c.dark,
                  opacity: isLocked ? 0.5 : 1,
                  boxShadow: isLocked ? 'none' : '0 6px 16px rgba(0,0,0,0.2)',
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.15)' }}>
                  <span className="text-2xl" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>
                    {isLocked ? '🔒' : mission.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-white leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                      {mission.title}
                    </h3>
                    {isComplete && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#58cc02' }}>
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/75 text-sm font-semibold">{mission.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(3)].map((_, j) => (
                        <span key={j} className="text-xs" style={{ opacity: j < mission.difficulty ? 1 : 0.25 }}>⭐</span>
                      ))}
                    </div>
                    {isLocked && <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Unlock at Lv{mission.difficulty}</span>}
                  </div>
                </div>
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
          style={{ background: '#1a2e35', border: '2px dashed #2b3f48' }}
        >
          <motion.span
            className="text-4xl block mb-2"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >🗺️</motion.span>
          <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>More worlds coming soon!</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Space · Jungle · Ice Kingdom</p>
        </motion.div>
      </div>
    </div>
  )
}