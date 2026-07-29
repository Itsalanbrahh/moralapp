import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { StarIcon, ShieldIcon, ArmchairIcon, BellIcon, PlayIcon, PlusIcon, CloseIcon } from '../components/SVGIcons'
import { DreamyBackground, FeatureIcon, BadgeArt } from '../components/AppArt'
import { getBadgeMeta } from '../data/badges'
import AnimatedCompanion from '../components/AnimatedCompanion'

const formatEarned = (ts) => {
  if (!ts) return 'Earned recently'
  try { return `Earned ${new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}` }
  catch { return 'Earned recently' }
}

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000]

export default function HomeScreen({ navigate }) {
  const { childName, selectedCharacter, level, xp, stars, badges, gear, companionName, companionColor, companionHat } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const guideColor = companionColor || character.color
  const [selectedBadge, setSelectedBadge] = useState(null)
  const recentBadges = [...badges].slice(-8).reverse()
  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1]
  const intoLevel = Math.max(0, xp - currentLevelXP)
  const levelSpan = Math.max(1, nextLevelXP - currentLevelXP)
  const progress = Math.min(intoLevel / levelSpan, 1)

  const displayName = childName || 'Star Explorer'

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ position: 'relative', background: '#F3EEFB' }}>
      <DreamyBackground variant="lavender" />
      <div className="w-full h-full flex flex-col overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.button onClick={() => navigate('customize')} whileTap={{ scale: 0.92 }}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 0 }} aria-label="Customize companion">
            <AnimatedCompanion character={character} size={44} animation="idle" fps={4} />
          </motion.button>
          <div>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#1F2937', lineHeight: 1.2, margin: 0 }}>
              Hello, {displayName}!
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#8B5CF6', margin: 0 }}>
              Level {level}{companionName ? ` · with ${companionName}` : ''}
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
            {intoLevel} / {levelSpan} XP
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
            { id: 'story', label: 'Storytelling', type: 'story', bg: 'linear-gradient(160deg,#EDE7FE,#E4D8FB)', border: 'rgba(167,139,250,0.4)', text: '#6D28D9', shadow: 'rgba(139,92,246,0.22)' },
            { id: 'mission', label: 'Missions', type: 'mission', bg: 'linear-gradient(160deg,#DDF6EA,#CFF0E0)', border: 'rgba(52,211,153,0.4)', text: '#059669', shadow: 'rgba(16,185,129,0.2)' },
            { id: 'house', label: 'House', type: 'house', bg: 'linear-gradient(160deg,#E1EEFE,#D3E4FC)', border: 'rgba(96,165,250,0.4)', text: '#2563EB', shadow: 'rgba(59,130,246,0.2)' },
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
                background: action.bg,
                border: `1px solid ${action.border}`,
                boxShadow: `0 8px 20px ${action.shadow}, inset 0 2px 0 rgba(255,255,255,0.85)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '4px', cursor: 'pointer', padding: '0.75rem',
              }}
            >
              <FeatureIcon type={action.type} size={50} />
              <span style={{
                fontFamily: "'Baloo 2', cursive", fontSize: '0.8rem', fontWeight: 700,
                color: action.text,
              }}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Progress Stats */}
        <p style={{ padding: '0 1rem', fontFamily: "'Baloo 2', cursive", fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', margin: '0 0 0.5rem' }}>Your Progress</p>
        <div style={{ padding: '0 1rem', display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          {[
            { icon: <StarIcon size={14} color="#F59E0B" />, value: xp, top: 'XP', label: 'Total XP', color: '#F59E0B', bg: 'rgba(254,243,199,0.85)' },
            { icon: <ShieldIcon size={14} color="#8B5CF6" />, value: badges.length, top: 'Badges', label: 'Earned', color: '#8B5CF6', bg: 'rgba(237,233,254,0.85)' },
            { icon: <StarIcon size={14} color="#3B82F6" />, value: stars, top: 'Stars', label: 'Stars', color: '#3B82F6', bg: 'rgba(219,234,254,0.85)' },
            { icon: <ArmchairIcon size={14} color="#EC4899" />, value: gear.length, top: 'Gear', label: 'Collected', color: '#EC4899', bg: 'rgba(252,231,243,0.85)' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              style={{
                flex: 1, borderRadius: '18px', padding: '0.65rem 0.35rem',
                background: stat.bg, border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                textAlign: 'center', backdropFilter: 'blur(6px)',
              }}
            >
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.58rem', fontWeight: 700, color: stat.color, margin: '0 0 2px' }}>{stat.top}</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>{stat.icon}</div>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.05rem', fontWeight: 800, color: stat.color, margin: 0, lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.52rem', color: '#9CA3AF', fontWeight: 600, margin: 0 }}>
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
              background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 6px 20px rgba(124,58,237,0.1)', backdropFilter: 'blur(10px)',
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
              <img src="/assets/stories/whisperwood-intro.png" alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
            </div>

            <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.62rem', color: '#A78BFA', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Continue Story</p>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', margin: 0 }}>Recent Badges</p>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.72rem', fontWeight: 700, color: '#8B5CF6' }}>View All</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
            {recentBadges.length === 0 && (
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: '#9CA3AF', margin: 0, flex: 1 }}>
                Complete stories & missions to earn badges!
              </p>
            )}
            {recentBadges.map((badge, i) => {
              const meta = getBadgeMeta(badge)
              return (
                <motion.button
                  key={badge.id}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.35 + i * 0.05, type: 'spring' }}
                  onClick={() => setSelectedBadge(badge)}
                  whileTap={{ scale: 0.88 }}
                  aria-label={meta.name}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, lineHeight: 0 }}
                >
                  <BadgeArt type={meta.art} size={48} />
                </motion.button>
              )
            })}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.55, type: 'spring' }}
              style={{
                width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0, alignSelf: 'center',
                background: 'rgba(255,255,255,0.5)', border: '2px dashed rgba(139,92,246,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <PlusIcon size={16} color="#A78BFA" />
            </motion.div>
          </div>
        </div>

        {/* Bottom spacing for nav */}
        <div style={{ height: '1rem' }} />
      </div>
      </div>

      {/* Badge detail popup */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            style={{ position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(45,27,105,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 16 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative', width: '100%', maxWidth: '340px', textAlign: 'center',
                background: 'rgba(255,255,255,0.98)', borderRadius: '26px', padding: '1.75rem 1.5rem 1.5rem',
                boxShadow: '0 24px 60px rgba(76,29,149,0.28)', border: '1px solid rgba(255,255,255,0.8)',
              }}
            >
              <motion.button onClick={() => setSelectedBadge(null)} whileTap={{ scale: 0.9 }}
                style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <CloseIcon size={13} color="#6B7280" />
              </motion.button>
              {(() => {
                const meta = getBadgeMeta(selectedBadge)
                return (
                  <>
                    <motion.div animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 0.7, repeat: 1 }} style={{ display: 'inline-block', marginBottom: '0.6rem' }}>
                      <BadgeArt type={meta.art} size={92} />
                    </motion.div>
                    <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.3rem', color: '#4C1D95', margin: '0 0 0.4rem' }}>{meta.name}</h3>
                    <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#4A5568', lineHeight: 1.5, margin: '0 0 0.9rem' }}>{meta.desc}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '9999px', background: 'rgba(139,92,246,0.1)' }}>
                      <StarIcon size={12} color="#8B5CF6" />
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.72rem', fontWeight: 700, color: '#7C3AED' }}>{formatEarned(selectedBadge.earnedAt)}</span>
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
