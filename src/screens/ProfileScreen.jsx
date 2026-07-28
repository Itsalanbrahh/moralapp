import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'
import { getCharacter } from '../data/characters'
import GlassCard, { GlassButton } from '../components/GlassCard'
import {
  UserIcon, SettingsIcon, LogoutIcon, StarIcon,
  VoiceOnIcon, VoiceOffIcon, RefreshIcon, ShieldIcon,
  BoltIcon, BookIcon, CompassIcon, TrophyIcon
} from '../components/SVGIcons'

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000]

export default function ProfileScreen({ navigate }) {
  const {
    childName, selectedCharacter, level, xp, stars, badges,
    voiceEnabled, setVoiceEnabled, resetProgress,
    totalStoriesRead, totalMissionsCompleted,
  } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const { logout, isGuest, parentEmail } = useAuthStore()

  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1]
  const progress = Math.min((xp - currentLevelXP) / (nextLevelXP - currentLevelXP), 1)

  const handleLogout = () => {
    logout()
    navigate('login')
  }

  const handleReset = () => {
    resetProgress()
    setShowResetConfirm(false)
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: '#0a0a1a' }}>

      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <h1 style={{
          fontFamily: "'Baloo 2', cursive", fontWeight: 700,
          fontSize: '1.3rem', color: 'white',
        }}>
          Profile
        </h1>
        <motion.button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.4rem 0.8rem', borderRadius: '9999px',
            background: 'rgba(255,75,75,0.1)', border: '1px solid rgba(255,75,75,0.2)',
            cursor: 'pointer',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <LogoutIcon size={16} color="#ff6b6b" />
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#ff6b6b' }}>
            Log Out
          </span>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Profile card */}
        <GlassCard style={{ padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: '0.75rem' }}
          >
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto',
              border: `3px solid ${character.color}40`,
              boxShadow: `0 8px 24px ${character.color}20`,
            }}>
              <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>

          <h2 style={{
            fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.4rem',
            color: 'white', margin: 0,
          }}>
            {childName || 'Explorer'}
          </h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)', margin: '0.15rem 0 0.75rem',
          }}>
            Traveling with {character.name}
          </p>

          {/* Level & XP bar */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
            padding: '0.6rem 0.8rem', marginBottom: '0.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.85rem', fontWeight: 700, color: '#7c5aff' }}>
                Level {level}
              </span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
              </span>
            </div>
            <div style={{
              height: '8px', borderRadius: '4px', overflow: 'hidden',
              background: 'rgba(255,255,255,0.08)',
            }}>
              <motion.div
                style={{
                  height: '100%', borderRadius: '4px',
                  background: 'linear-gradient(90deg, #7c5aff, #a78bfa)',
                  boxShadow: '0 0 8px rgba(124,90,255,0.3)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            {[
              { icon: <BoltIcon size={16} color="#ffc800" />, value: xp, label: 'XP' },
              { icon: <StarIcon size={16} color="#ffc800" />, value: stars, label: 'Stars' },
              { icon: <TrophyIcon size={16} color="#7c5aff" />, value: badges.length, label: 'Badges' },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: '12px', padding: '0.5rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.2rem' }}>
                  {stat.icon}
                </div>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.1rem', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Activity stats */}
        <GlassCard variant="dark" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{
            fontFamily: "'Baloo 2', cursive", fontSize: '0.9rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem',
          }}>
            Activity
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem', borderRadius: '12px', background: 'rgba(0,230,118,0.08)',
            }}>
              <BookIcon size={18} color="#00e676" />
              <div>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, color: '#00e676', margin: 0, lineHeight: 1 }}>
                  {totalStoriesRead}
                </p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                  Stories Read
                </p>
              </div>
            </div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem', borderRadius: '12px', background: 'rgba(124,90,255,0.08)',
            }}>
              <CompassIcon size={18} color="#7c5aff" />
              <div>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, color: '#7c5aff', margin: 0, lineHeight: 1 }}>
                  {totalMissionsCompleted}
                </p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                  Missions Done
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Settings */}
        <GlassCard variant="dark" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <h3 style={{
            fontFamily: "'Baloo 2', cursive", fontSize: '0.9rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem',
          }}>
            Settings
          </h3>

          {/* Voice toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {voiceEnabled
                ? <VoiceOnIcon size={18} color="rgba(255,255,255,0.6)" />
                : <VoiceOffIcon size={18} color="rgba(255,255,255,0.4)" />
              }
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                Voice Narration
              </span>
            </div>
            <motion.button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              style={{
                width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                background: voiceEnabled ? '#7c5aff' : 'rgba(255,255,255,0.15)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                style={{
                  width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                  position: 'absolute', top: '2px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
                animate={{ left: voiceEnabled ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </GlassCard>

        {/* Parent controls */}
        {!isGuest && (
          <GlassCard variant="dark" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldIcon size={16} color="rgba(255,255,255,0.5)" />
              <h3 style={{
                fontFamily: "'Baloo 2', cursive", fontSize: '0.9rem', fontWeight: 700,
                color: 'rgba(255,255,255,0.6)', margin: 0,
              }}>
                Parent Controls
              </h3>
            </div>

            <p style={{
              fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.4)', margin: '0 0 0.75rem',
            }}>
              Signed in as {parentEmail}
            </p>

            <motion.button
              onClick={() => setShowResetConfirm(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.65rem 0.8rem', borderRadius: '12px',
                background: 'rgba(255,150,0,0.08)', border: '1px solid rgba(255,150,0,0.15)',
                cursor: 'pointer', width: '100%',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshIcon size={16} color="#ff9600" />
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#ff9600' }}>
                Reset All Progress
              </span>
            </motion.button>
          </GlassCard>
        )}
      </div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
              }}
              onClick={() => setShowResetConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 201, width: '85%', maxWidth: '360px',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                background: 'rgba(20,20,40,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.5rem', padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 0.75rem',
                background: 'rgba(255,75,75,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RefreshIcon size={24} color="#ff6b6b" />
              </div>
              <h3 style={{
                fontFamily: "'Baloo 2', cursive", fontSize: '1.2rem',
                fontWeight: 700, color: 'white', margin: '0 0 0.5rem',
              }}>
                Reset Progress?
              </h3>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.5)', margin: '0 0 1.25rem',
              }}>
                This will erase all XP, badges, stories, and missions. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <GlassButton variant="glass" onClick={() => setShowResetConfirm(false)} style={{ flex: 1 }}>
                  Cancel
                </GlassButton>
                <GlassButton variant="danger" onClick={handleReset} style={{ flex: 1 }}>
                  Reset
                </GlassButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
