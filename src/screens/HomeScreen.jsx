import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { StarIcon, ShieldIcon, ArmchairIcon, BoltIcon, BellIcon, BookIcon, MapIcon, HomeIcon, HeartIcon, CompassIcon, PlayIcon, ChevronRightIcon, PlusIcon } from '../components/SVGIcons'

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000]

export default function HomeScreen({ navigate }) {
  const { childName, selectedCharacter, level, xp, stars, badges, gear } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1]
  const progress = Math.min((xp - currentLevelXP) / (nextLevelXP - currentLevelXP), 1)

  const displayName = childName || 'Star Explorer'

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden',
            border: `2px solid ${character.color}40`,
            boxShadow: `0 4px 12px ${character.color}20`,
          }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#1F2937', lineHeight: 1.2, margin: 0 }}>
              Hello, {displayName}!
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#8B5CF6', margin: 0 }}>
              Level {level}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BellIcon size={18} color="#6B7280" />
            </div>
            <div style={{
              position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px',
              borderRadius: '50%', background: '#EF4444', border: '2px solid #F8F9FA',
            }} />
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div style={{ padding: '0 1rem 0.75rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 600 }}>Progress</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: '#8B5CF6', fontWeight: 700 }}>
            {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
          </span>
        </div>
        <div style={{ height: '8px', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
          <motion.div
            style={{
              height: '100%', borderRadius: '10px',
              background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Quick Actions */}
        <div style={{ padding: '0 1rem', display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          {[
            { id: 'story', label: 'Storytelling', gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', icon: <BookIcon size={28} color="white" /> },
            { id: 'mission', label: 'Missions', gradient: 'linear-gradient(135deg, #10B981, #059669)', icon: <MapIcon size={28} color="white" /> },
            { id: 'house', label: 'House', gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)', icon: <HomeIcon size={28} color="white" /> },
          ].map((action, i) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => navigate(action.id)}
              whileTap={{ scale: 0.95 }}
              style={{
                flex: 1, aspectRatio: '1', borderRadius: '24px',
                background: action.gradient,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '6px', cursor: 'pointer', padding: '0.75rem',
              }}
            >
              {action.icon}
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
              }}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Progress Stats */}
        <div style={{ padding: '0 1rem', display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          {[
            { icon: <StarIcon size={14} color="#F59E0B" />, value: xp, label: 'Total XP', color: '#F59E0B' },
            { icon: <ShieldIcon size={14} color="#8B5CF6" />, value: badges.length, label: 'Earned', color: '#8B5CF6' },
            { icon: <StarIcon size={14} color="#3B82F6" />, value: stars, label: 'Stars', color: '#3B82F6' },
            { icon: <ArmchairIcon size={14} color="#10B981" />, value: gear.length, label: 'Collected', color: '#10B981' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              style={{
                flex: 1, borderRadius: '16px', padding: '0.6rem 0.4rem',
                background: 'white', border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
                {stat.icon}
              </div>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, color: '#1F2937', margin: 0, lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', color: '#9CA3AF', fontWeight: 600, margin: 0 }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Continue Story Card */}
        <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('storyPlay', { storyId: 'three-lights' })}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', borderRadius: '20px', overflow: 'hidden',
              background: 'white', border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              display: 'flex', alignItems: 'stretch', cursor: 'pointer',
              textAlign: 'left', padding: 0,
            }}
          >
            {/* Dark forest image */}
            <div style={{
              width: '100px', flexShrink: 0,
              background: 'linear-gradient(135deg, #1a2a1a, #0d2818)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <img src="/assets/stories/whisperwood-intro.png" alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
            </div>

            <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: '#1F2937', margin: 0, lineHeight: 1.2 }}>
                The Three Lights of Whisperwood
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <div style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '55%', height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)', borderRadius: '10px' }} />
                </div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  5 / 9 chapters
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '0.75rem', flexShrink: 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PlayIcon size={14} color="white" />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Recent Badges */}
        <div style={{ padding: '0 1rem', marginBottom: '0.75rem' }}>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700,
            color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: '0.5rem', paddingLeft: '2px',
          }}>
            Recent Badges
          </p>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { icon: <HeartIcon size={18} color="#EC4899" />, bg: '#FCE7F3' },
              { icon: <CompassIcon size={18} color="#8B5CF6" />, bg: '#EDE9FE' },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round"><path d="M12 22V8" /><path d="M5 12l7-8 7 8" /><path d="M8 16l4-5 4 5" /></svg>, bg: '#D1FAE5' },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"><path d="M12 2v2" /><rect x="7" y="8" width="10" height="10" rx="2" /><circle cx="12" cy="13" r="2" fill="#F59E0B30" /></svg>, bg: '#FEF3C7' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05, type: 'spring' }}
                style={{
                  width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                  background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {badge.icon}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.55, type: 'spring' }}
              style={{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(0,0,0,0.04)', border: '2px dashed rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <PlusIcon size={16} color="#9CA3AF" />
            </motion.div>
          </div>
        </div>

        {/* Bottom spacing for nav */}
        <div style={{ height: '1rem' }} />
      </div>
    </div>
  )
}
