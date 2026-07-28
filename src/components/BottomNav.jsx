import { motion } from 'framer-motion'
import { HomeIcon, BookIcon, CompassIcon, HeartStarIcon, UserIcon } from './SVGIcons'

const tabs = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'story', label: 'Stories', Icon: BookIcon },
  { id: 'mission', label: 'Missions', Icon: CompassIcon },
  { id: 'house', label: 'House', Icon: HeartStarIcon },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
]

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
      background: 'rgba(10,10,26,0.85)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
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
                      background: 'rgba(124,90,255,0.15)',
                      border: '1px solid rgba(124,90,255,0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.Icon
                  size={22}
                  color={isActive ? '#7c5aff' : 'rgba(255,255,255,0.35)'}
                />
              </div>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '0.6rem',
                fontWeight: isActive ? 700 : 600,
                color: isActive ? '#7c5aff' : 'rgba(255,255,255,0.35)',
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
