import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'
import { getCharacter } from '../data/characters'
import {
  UserIcon, SettingsIcon, LogoutIcon, StarIcon,
  VoiceOnIcon, VoiceOffIcon, RefreshIcon, ShieldIcon,
  BoltIcon, BookIcon, CompassIcon, TrophyIcon
} from '../components/SVGIcons'

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000]

export default function ProfileScreen({ navigate }) {
  const {
    childName, selectedCharacter, level, xp, stars, badges,
    voiceEnabled, setVoiceEnabled, speechRate, setSpeechRate, resetProgress,
    totalStoriesRead, totalMissionsCompleted, gear,
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
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#1F2937', margin: 0 }}>
          Profile
        </h1>
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '9999px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
            cursor: 'pointer',
          }}>
          <LogoutIcon size={14} color="#EF4444" />
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#EF4444' }}>Log Out</span>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem 1.5rem', WebkitOverflowScrolling: 'touch' }}>
        {/* Profile card */}
        <div style={{
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '1.5rem', padding: '1.25rem', textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '0.75rem',
        }}>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ marginBottom: '0.75rem' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto',
              border: `3px solid ${character.color}40`,
              boxShadow: `0 8px 24px ${character.color}20`,
            }}>
              <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>

          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.3rem', color: '#1F2937', margin: 0 }}>
            {childName || 'Explorer'}
          </h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: '#6B7280', margin: '2px 0 0.75rem' }}>
            Traveling with {character.name}
          </p>

          {/* Level & XP bar */}
          <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '12px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.85rem', fontWeight: 700, color: '#8B5CF6' }}>Level {level}</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: '#9CA3AF' }}>
                {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
              </span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(0,0,0,0.06)' }}>
              <motion.div style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)' }}
                initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { icon: <BoltIcon size={14} color="#F59E0B" />, value: xp, label: 'XP' },
              { icon: <StarIcon size={14} color="#F59E0B" />, value: stars, label: 'Stars' },
              { icon: <TrophyIcon size={14} color="#8B5CF6" />, value: badges.length, label: 'Badges' },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: '12px', padding: '0.5rem',
                background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>{stat.icon}</div>
                <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, color: '#1F2937', margin: 0, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', color: '#9CA3AF', margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Settings section */}
        <div style={{
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '1.5rem', padding: '1rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '0.75rem',
        }}>
          <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.9rem', fontWeight: 700, color: '#4A5568', margin: '0 0 0.75rem' }}>
            Settings
          </h3>

          {/* Voice toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {voiceEnabled ? <VoiceOnIcon size={18} color="#6B7280" /> : <VoiceOffIcon size={18} color="#9CA3AF" />}
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#4A5568' }}>Voice Narration</span>
            </div>
            <motion.button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`toggle-switch ${voiceEnabled ? 'on' : 'off'}`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div className="toggle-knob"
                animate={{ left: voiceEnabled ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Sound effects toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#4A5568' }}>Sound Effects</span>
            </div>
            <motion.button
              onClick={() => {}}
              className="toggle-switch on"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div className="toggle-knob"
                animate={{ left: '22px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Story speed slider */}
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#4A5568' }}>Story Speed</span>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#8B5CF6' }}>{speechRate}x</span>
            </div>
            <input type="range" min="0.5" max="1.5" step="0.1" value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#8B5CF6', height: '4px' }}
            />
          </div>
        </div>

        {/* Reset progress */}
        {!isGuest && (
          <div style={{
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: '1.5rem', padding: '1rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
              <ShieldIcon size={14} color="#6B7280" />
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.85rem', fontWeight: 700, color: '#4A5568' }}>Parent Controls</span>
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 0.75rem' }}>
              Signed in as {parentEmail}
            </p>
            <motion.button
              onClick={() => setShowResetConfirm(true)}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0.65rem 0.8rem', borderRadius: '12px',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
                cursor: 'pointer', width: '100%',
              }}>
              <RefreshIcon size={16} color="#EF4444" />
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#EF4444' }}>Reset Progress</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowResetConfirm(false)} />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 201, width: '85%', maxWidth: '360px',
                background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '1.5rem', padding: '1.5rem', textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 0.75rem',
                background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RefreshIcon size={24} color="#EF4444" />
              </div>
              <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.2rem', fontWeight: 700, color: '#1F2937', margin: '0 0 0.5rem' }}>
                Reset Progress?
              </h3>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: '#6B7280', margin: '0 0 1.25rem' }}>
                This will erase all XP, badges, stories, and missions. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-glass" onClick={() => setShowResetConfirm(false)} style={{ flex: 1 }}>Cancel</button>
                <button className="btn btn-danger" onClick={handleReset} style={{ flex: 1 }}>Reset</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
