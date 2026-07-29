import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getAllMissions } from '../data/missions'
import { BackArrowIcon, LockIcon, CheckIcon, StarIcon, ChevronRightIcon, LeafIcon, SparkleIcon, ArmchairIcon, GearIcon, FurnitureIcon } from '../components/SVGIcons'
import { DreamyBackground } from '../components/AppArt'

const missionStyles = {
  'forest-treasure': { color: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #059669)', image: '/assets/stories/treehouse.png' },
  'castle-mystery': { color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', image: '/assets/stories/castle.png', locked: true },
  'ocean-adventure': { color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)', image: '/assets/stories/ocean-kingdom.png', locked: true },
}

export default function MissionScreen({ navigate }) {
  const { completedMissions, level, selectedCharacter, stars } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const missions = getAllMissions()

  return (
    <div className="w-full h-full" style={{ position: 'relative', background: '#EAF6F1' }}>
      <DreamyBackground variant="mint" />
      <div className="w-full h-full flex flex-col overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <motion.button onClick={() => navigate('home')}
          style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
          whileTap={{ scale: 0.9 }}>
          <BackArrowIcon size={16} color="#6B7280" />
        </motion.button>
        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#1F2937', margin: 0, flex: 1 }}>
          Missions
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <StarIcon size={16} color="#F59E0B" />
          <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: '#1F2937' }}>{stars}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem 1.5rem', WebkitOverflowScrolling: 'touch' }}>
        {/* Subheader */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <SparkleIcon size={14} color="#10B981" />
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#065F46' }}>
              Choose your adventure!
            </span>
            <SparkleIcon size={14} color="#10B981" />
          </div>
        </motion.div>

        {/* Mission list with dotted path */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Dotted path line */}
          <div style={{
            position: 'absolute', left: '20px', top: '24px', bottom: '24px',
            width: '2px', borderLeft: '2px dashed rgba(16,185,129,0.3)',
          }} />

          {missions.map((mission, i) => {
            const isComplete = completedMissions.includes(mission.id)
            const isLocked = mission.difficulty > level
            const style = missionStyles[mission.id] || missionStyles['forest-treasure']
            const stepCount = mission.steps.length
            const completedSteps = isComplete ? stepCount : Math.floor(stepCount * 0.6)

            return (
              <motion.button
                key={mission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 200 }}
                onClick={() => !isLocked && navigate('missionPlay', { missionId: mission.id })}
                disabled={isLocked}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
                style={{
                  width: '100%', borderRadius: '20px', overflow: 'hidden',
                  background: isLocked ? 'rgba(255,255,255,0.5)' : 'white',
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: isLocked ? 'none' : '0 4px 16px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'stretch', cursor: isLocked ? 'default' : 'pointer',
                  textAlign: 'left', padding: 0, opacity: isLocked ? 0.7 : 1,
                  position: 'relative',
                }}
              >
                {/* Number badge */}
                <div style={{
                  position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: style.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>{i + 1}</span>
                </div>

                {/* Image section */}
                <div style={{
                  width: '80px', flexShrink: 0, marginLeft: '28px',
                  background: style.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {isLocked ? (
                    <LockIcon size={24} color="rgba(255,255,255,0.5)" />
                  ) : (
                    <img src={style.image} alt={mission.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '0.75rem', minWidth: 0 }}>
                  <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.95rem', color: '#1F2937', margin: 0 }}>
                    {mission.title}
                  </p>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: '#6B7280', margin: '2px 0 6px', lineHeight: 1.3 }}>
                    {mission.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${(completedSteps / stepCount) * 100}%`, height: '100%', background: style.gradient, borderRadius: '10px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <LeafIcon size={12} color={style.color} />
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', fontWeight: 700, color: '#6B7280' }}>
                        {completedSteps} / {stepCount}
                      </span>
                    </div>
                  </div>
                </div>

                {!isLocked && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingRight: '0.75rem', flexShrink: 0 }}>
                    <ChevronRightIcon size={18} color="#D1D5DB" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Footer banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{
            marginTop: '1rem', borderRadius: '16px', padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>
            Complete missions to earn
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GearIcon size={14} color="#F59E0B" />
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FurnitureIcon size={14} color="#8B5CF6" />
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArmchairIcon size={14} color="#3B82F6" />
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
