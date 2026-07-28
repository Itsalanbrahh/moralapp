import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import GlassCard from '../components/GlassCard'
import { BackArrowIcon, BackpackIcon, CloseIcon } from '../components/SVGIcons'

const defaultFurniture = [
  { id: 'cozy-bed', name: 'Cozy Bed', icon: 'bed', room: 'bedroom' },
  { id: 'fluffy-rug', name: 'Fluffy Rug', icon: 'rug', room: 'livingRoom' },
  { id: 'potted-plant', name: 'Potted Plant', icon: 'plant', room: 'livingRoom' },
]

const roomThemes = {
  livingRoom: { name: 'Living Room', accent: '#00e676', glow: 'rgba(0,230,118,0.08)' },
  bedroom: { name: 'Bedroom', accent: '#7c5aff', glow: 'rgba(124,90,255,0.08)' },
  garden: { name: 'Garden', accent: '#1cb0f6', glow: 'rgba(28,176,246,0.08)' },
}

// SVG furniture icons instead of emojis
function FurnitureIcon({ type, size = 24 }) {
  const icons = {
    bed: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M2 4v16M22 4v16M2 8h20M2 16h20M6 8v8M18 8v8" /></svg>,
    rug: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="2" y1="12" x2="22" y2="12" strokeDasharray="4 2" /></svg>,
    plant: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 22V8M12 8c-4 0-6-3-6-6 6 0 6 6 6 6zM12 8c4 0 6-3 6-6-6 0-6 6-6 6z" /><rect x="8" y="22" width="8" height="0" /></svg>,
    mushroom: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 14v8M8 22h8M4 14c0-5 3.5-10 8-10s8 5 8 10H4z" /></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
    fountain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 2v6M8 4c0 2 2 4 4 4s4-2 4-4M5 22h14M7 22c0-3 2-5 5-5s5 2 5 5" /></svg>,
    throne: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M5 22V10l7-8 7 8v12M9 14h6M3 22h18" /></svg>,
    lamp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M9 18h6M10 22h4M12 2v1M4 10a8 8 0 0 1 16 0M12 14v4" /></svg>,
    cupcake: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 2c-2 0-3 2-3 4s1 2 3 2 3 0 3-2-1-4-3-4zM7 10h10l-1 12H8L7 10z" /></svg>,
    pearl: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" fill="rgba(255,255,255,0.15)" /></svg>,
    acorn: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"><path d="M12 2c-3 0-5 2-5 5 0 4 5 10 5 10s5-6 5-10c0-3-2-5-5-5z" /></svg>,
  }
  return icons[type] || icons.plant
}

export default function HouseScreen({ navigate }) {
  const { selectedCharacter, houseLayout, furniture, gear, placeFurniture, removeFurniture } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const [activeRoom, setActiveRoom] = useState('livingRoom')
  const [showInventory, setShowInventory] = useState(false)

  const allFurniture = [...defaultFurniture, ...furniture]
  const placedInRoom = houseLayout[activeRoom] || []
  const placedItems = placedInRoom.map(id => allFurniture.find(f => f.id === id)).filter(Boolean)
  const unplacedItems = allFurniture.filter(f => f.room === activeRoom && !placedInRoom.includes(f.id))

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            whileTap={{ scale: 0.9 }}
          >
            <BackArrowIcon size={18} color="rgba(255,255,255,0.7)" />
          </motion.button>
          <h1 className="font-display text-xl font-bold text-white">{character.name}'s House</h1>
        </div>
        <motion.button
          onClick={() => setShowInventory(!showInventory)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(124,90,255,0.2), rgba(124,90,255,0.1))',
            border: '1px solid rgba(124,90,255,0.25)',
            boxShadow: '0 4px 16px rgba(124,90,255,0.15)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <BackpackIcon size={18} color="#c4b0ff" />
        </motion.button>
      </div>

      {/* Room tabs */}
      <div className="px-4 pb-3 flex gap-2 shrink-0">
        {Object.entries(roomThemes).map(([key, room]) => {
          const isActive = activeRoom === key
          return (
            <motion.button
              key={key}
              onClick={() => setActiveRoom(key)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all"
              style={{
                backdropFilter: 'blur(16px)',
                background: isActive ? `${room.accent}12` : 'transparent',
                border: isActive ? `1px solid ${room.accent}30` : '1px solid transparent',
                color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{room.name}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Room view */}
      <div className="flex-1 mx-4 rounded-2xl overflow-hidden relative"
        style={{
          background: `linear-gradient(180deg, ${roomThemes[activeRoom].glow}, rgba(255,255,255,0.02))`,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: `inset 0 2px 12px ${roomThemes[activeRoom].glow}`,
          backdropFilter: 'blur(8px)',
        }}>

        {/* Room decoration */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, ${roomThemes[activeRoom].accent}15, transparent 50%), radial-gradient(circle at 80% 20%, ${roomThemes[activeRoom].accent}10, transparent 50%)`,
          }}
        />

        {/* Character */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `${character.color}20`,
              border: `2px solid ${character.color}30`,
              boxShadow: `0 8px 24px ${character.color}15`,
            }}>
            <img src={character.image} alt={character.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        </motion.div>

        {/* Placed furniture grid */}
        <div className="p-4 grid grid-cols-4 gap-3 relative z-5">
          {placedItems.map((item) => (
            <motion.div key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
              <motion.button
                onClick={() => removeFurniture(activeRoom, item.id)}
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  backdropFilter: 'blur(16px)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                whileTap={{ scale: 0.85 }}
              >
                <FurnitureIcon type={item.icon || 'plant'} size={24} />
              </motion.button>
              <span className="text-xs mt-1 text-center leading-tight font-bold" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>{item.name}</span>
            </motion.div>
          ))}
        </div>

        {placedItems.length === 0 && (
          <div className="flex items-center justify-center h-full pb-24">
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </motion.div>
              <p className="text-sm font-bold mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Empty room!
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
                Open your backpack to add furniture
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gear collection strip */}
      {gear.length > 0 && (
        <div className="px-4 pt-3 shrink-0">
          <p className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Gear</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gear.map(item => (
              <div key={item.id} className="flex-shrink-0 rounded-xl px-3 py-2 flex items-center gap-2"
                style={{
                  backdropFilter: 'blur(16px)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                <span className="text-xs font-bold whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory drawer */}
      <AnimatePresence>
        {showInventory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowInventory(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 inset-x-0 z-50 rounded-t-3xl p-5"
              style={{
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                background: 'rgba(10,10,26,0.95)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                maxHeight: '50vh',
              }}
            >
              {/* Handle bar */}
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.15)' }} />

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-white">Backpack</h3>
                <motion.button
                  onClick={() => setShowInventory(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <CloseIcon size={14} color="rgba(255,255,255,0.5)" />
                </motion.button>
              </div>

              {unplacedItems.length > 0 ? (
                <div className="grid grid-cols-4 gap-3 overflow-y-auto">
                  {unplacedItems.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => placeFurniture(activeRoom, item.id)}
                      className="flex flex-col items-center p-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <FurnitureIcon type={item.icon || 'plant'} size={28} />
                      <span className="text-xs font-bold text-center leading-tight mt-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <BackpackIcon size={36} color="rgba(255,255,255,0.15)" />
                  </motion.div>
                  <p className="text-sm font-bold mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>No furniture for this room yet!</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>Complete missions to earn furniture</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
