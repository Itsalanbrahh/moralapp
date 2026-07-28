import { motion } from 'framer-motion'
import { HomeIcon, BookIcon, CompassIcon, HeartStarIcon, UserIcon } from './SVGIcons'

const tabs = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'story', label: 'Stories', Icon: BookIcon },
  { id: 'mission', label: 'Missions', Icon: CompassIcon },
  { id: 'house', label: 'House', Icon: HeartStarIcon },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
]

const activeColors = {
  home: '#8B5CF6',
  story: '#8B5CF6',
  mission: '#10B981',
  house: '#3B82F6',
  profile: '#8B5CF6',
}

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(255,255,255,0.85)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      paddingTop: '0.35rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '0 0.5rem',
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const accentColor = activeColors[tab.id] || '#8B5CF6'
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                padding: '0.35rem 0.75rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                position: 'relative',
                minWidth: '48px',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: 'absolute',
                      inset: '-6px -10px',
                      borderRadius: '12px',
                      background: `${accentColor}12`,
                      border: `1px solid ${accentColor}20`,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.Icon
                  size={22}
                  color={isActive ? accentColor : '#9CA3AF'}
                />
              </div>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '0.6rem',
                fontWeight: isActive ? 700 : 600,
                color: isActive ? accentColor : '#9CA3AF',
                letterSpacing: '0.02em',
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
