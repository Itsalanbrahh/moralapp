import { motion } from 'framer-motion'
import { HomeIcon, BookIcon, CompassIcon, HeartStarIcon, SproutIcon, UserIcon } from './SVGIcons'

const tabs = [
  { id: 'home', label: 'Home', Icon: HomeIcon, color: '#8B5CF6' },
  { id: 'story', label: 'Stories', Icon: BookIcon, color: '#EC4899' },
  { id: 'mission', label: 'Missions', Icon: CompassIcon, color: '#10B981' },
  { id: 'house', label: 'House', Icon: HeartStarIcon, color: '#3B82F6' },
  { id: 'profile', label: 'Profile', Icon: UserIcon, color: '#F59E0B' },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 100,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      padding: '0 12px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
    }}>
      <div style={{
        pointerEvents: 'auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2px',
        width: '100%', maxWidth: '460px', padding: '8px 10px',
        borderRadius: '26px',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 10px 30px rgba(76,29,149,0.16), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.88 }}
              style={{
                flex: 1, position: 'relative', border: 'none', background: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                padding: '5px 0 3px',
              }}
            >
              <div style={{ position: 'relative', width: '46px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: '14px',
                      background: `linear-gradient(160deg, ${tab.color}, ${tab.color}cc)`,
                      boxShadow: `0 5px 14px ${tab.color}55`,
                    }}
                    transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                  />
                )}
                <motion.div animate={{ y: isActive ? -1 : 0, scale: isActive ? 1.05 : 1 }} style={{ position: 'relative', zIndex: 1, display: 'flex' }}>
                  <tab.Icon size={21} color={isActive ? 'white' : '#9AA0B4'} />
                </motion.div>
              </div>
              <span style={{
                fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? tab.color : '#9AA0B4', letterSpacing: '0.01em',
              }}>
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
