import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import AnimatedCompanion from '../components/AnimatedCompanion'
import { ACCENT_COLORS, HATS, SUGGESTED_NAMES, companionColor } from '../data/companion'
import { DreamyBackground } from '../components/AppArt'
import { BackArrowIcon, StarIcon, CheckIcon, LockIcon, HeartIcon, ShieldIcon } from '../components/SVGIcons'

export default function CustomizeScreen({ navigate }) {
  const state = useGameStore()
  const { selectedCharacter, level, companionName, companionHat, setCompanionName, setCompanionColor, setCompanionHat, stars } = state
  const character = getCharacter(selectedCharacter)
  const accent = companionColor(state)

  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(companionName || character.name)
  const [toast, setToast] = useState(false)
  const displayName = (companionName || '').trim() || character.name

  const saveName = () => {
    const n = nameDraft.trim() || character.name
    setCompanionName(n)
    setNameDraft(n)
    setEditingName(false)
  }

  const save = () => {
    setToast(true)
    setTimeout(() => setToast(false), 1600)
  }

  const chips = [
    { icon: <StarIcon size={13} color="#F59E0B" />, label: 'Level', value: level },
    { icon: <HeartIcon size={13} color="#EC4899" />, label: 'Kindness', value: 'High' },
    { icon: <ShieldIcon size={13} color="#10B981" />, label: 'Courage', value: 'High' },
  ]

  return (
    <div className="w-full h-full" style={{ position: 'relative', background: '#F3EEFB' }}>
      <DreamyBackground variant="lavender" />
      <div className="w-full h-full flex flex-col overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: '0.6rem 1rem 0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <motion.button onClick={() => navigate('profile')} whileTap={{ scale: 0.9 }}
            style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <BackArrowIcon size={16} color="#7C3AED" />
          </motion.button>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.15rem', color: '#5B21B6', margin: 0, lineHeight: 1.1 }}>Customize {displayName}</h1>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: '#A78BFA', margin: 0, fontWeight: 700 }}>Make your guide uniquely yours</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'white', borderRadius: '9999px', padding: '5px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <StarIcon size={14} color="#FBBF24" />
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '0.85rem', color: '#1F2937' }}>{stars}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem 1.5rem', WebkitOverflowScrolling: 'touch' }}>
          {/* Preview */}
          <div style={{ position: 'relative', borderRadius: '24px', padding: '1.25rem 1rem 1rem', marginBottom: '1rem', overflow: 'hidden', background: `radial-gradient(circle at 50% 35%, ${accent}22, rgba(255,255,255,0.4))`, border: '1px solid rgba(255,255,255,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <AnimatedCompanion character={character} size={150} animation="idle" fps={5} />
              </motion.div>
            </div>
            {/* pedestal */}
            <div style={{ width: '120px', height: '16px', borderRadius: '50%', margin: '0 auto 0.75rem', background: `${accent}30`, filter: 'blur(2px)' }} />
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
              {chips.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.85)', borderRadius: '12px', padding: '6px 10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                  {c.icon}
                  <div>
                    <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: '#9CA3AF', margin: 0 }}>{c.label}</p>
                    <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.78rem', fontWeight: 700, color: '#1F2937', margin: 0, lineHeight: 1 }}>{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Name */}
          <SectionLabel>Name</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            {editingName ? (
              <>
                <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveName()} maxLength={16} autoFocus className="glass-input" style={{ flex: 1 }} placeholder={`e.g. ${SUGGESTED_NAMES[selectedCharacter]?.[0] || 'Buddy'}`} />
                <motion.button whileTap={{ scale: 0.92 }} onClick={saveName} style={{ padding: '10px 16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', color: 'white', fontFamily: "'Baloo 2', cursive", fontWeight: 700, cursor: 'pointer' }}>Save</motion.button>
              </>
            ) : (
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => { setNameDraft(displayName); setEditingName(true) }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.05rem', color: '#1F2937' }}>{displayName}</span>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: '#8B5CF6' }}>Rename</span>
              </motion.button>
            )}
          </div>

          {/* Accent color */}
          <SectionLabel>Aura Color</SectionLabel>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.1rem' }}>
            {ACCENT_COLORS.map((c) => {
              const isActive = (c.color || null) === (state.companionColor || null)
              const swatch = c.color || character.color
              return (
                <motion.button key={c.id} whileTap={{ scale: 0.9 }} onClick={() => setCompanionColor(c.color || '')}
                  style={{ width: '46px', height: '46px', borderRadius: '50%', cursor: 'pointer', position: 'relative', background: swatch, border: isActive ? '3px solid #7C3AED' : '3px solid rgba(255,255,255,0.9)', boxShadow: '0 3px 8px rgba(0,0,0,0.12)' }}>
                  {isActive && <span style={{ position: 'absolute', bottom: -2, right: -2, background: '#7C3AED', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon size={10} color="white" /></span>}
                  {c.id === 'default' && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito', sans-serif", fontSize: '0.5rem', fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>ORIG</span>}
                </motion.button>
              )
            })}
          </div>

          {/* Outfits */}
          <SectionLabel>Outfits</SectionLabel>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {HATS.map((h) => {
              const locked = level < h.minLevel
              const isActive = companionHat === h.id
              return (
                <motion.button key={h.id} whileTap={{ scale: locked ? 1 : 0.92 }}
                  onClick={() => { if (!locked) setCompanionHat(h.id) }}
                  style={{ flexShrink: 0, width: '78px', borderRadius: '16px', padding: '8px 4px 6px', cursor: locked ? 'default' : 'pointer', position: 'relative',
                    background: isActive ? 'linear-gradient(160deg,#EDE7FE,#DDD6FE)' : 'rgba(255,255,255,0.85)',
                    border: isActive ? '2px solid #8B5CF6' : '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: locked ? 'grayscale(0.8) opacity(0.5)' : 'none' }}>
                    <AnimatedCompanion character={character} size={46} animation="idle" fps={3} />
                  </div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: locked ? '#9CA3AF' : '#4B5563', textAlign: 'center', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.name}</p>
                  {locked && <span style={{ position: 'absolute', top: 6, right: 8, display: 'flex', alignItems: 'center', gap: 2 }}><LockIcon size={11} color="#9CA3AF" /></span>}
                  {locked && <span style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Nunito', sans-serif", fontSize: '0.5rem', fontWeight: 700, color: '#9CA3AF' }}>Lv {h.minLevel}</span>}
                  {isActive && <span style={{ position: 'absolute', top: 6, left: 8 }}><CheckIcon size={11} color="#7C3AED" /></span>}
                </motion.button>
              )
            })}
          </div>

          <p style={{ textAlign: 'center', fontFamily: "'Nunito', sans-serif", fontSize: '0.68rem', fontWeight: 600, color: '#A78BFA', margin: '0.9rem 0 0.25rem' }}>
            Level up by reading stories & finishing missions to unlock more hats!
          </p>
        </div>

        {/* Save */}
        <div style={{ padding: '0.4rem 1rem 1rem', flexShrink: 0 }}>
          <button className="btn btn-primary" onClick={save} style={{ maxWidth: '100%' }}>
            <CheckIcon size={16} color="white" /> Save Look
          </button>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: 'rgba(31,41,55,0.92)', color: 'white', borderRadius: '9999px', padding: '8px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {displayName}’s look saved!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.82rem', fontWeight: 700, color: '#6B7280', margin: '0 0 0.5rem', paddingLeft: '2px' }}>{children}</p>
}
