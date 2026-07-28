import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'

const defaultFurniture = [
  { id: 'cozy-bed', name: 'Cozy Bed', icon: '🛏️', room: 'bedroom' },
  { id: 'fluffy-rug', name: 'Fluffy Rug', icon: '🟫', room: 'livingRoom' },
  { id: 'potted-plant', name: 'Potted Plant', icon: '🪴', room: 'livingRoom' },
]

const roomThemes = {
  livingRoom: { name: 'Living Room', icon: '🛋️', bg: 'linear-gradient(180deg, #2d4a3a, #1d3a2a)', accent: '#4a7a5a' },
  bedroom: { name: 'Bedroom', icon: '🛏️', bg: 'linear-gradient(180deg, #3a2d4a, #2a1d3a)', accent: '#6a4a8a' },
  garden: { name: 'Garden', icon: '🌻', bg: 'linear-gradient(180deg, #2d4a2d, #1d3a1d)', accent: '#4a8a4a' },
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
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#131f24' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigate('home')}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: '#1a2e35', border: '1.5px solid #2b3f48' }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white text-lg">←</span>
          </motion.button>
          <h1 className="font-display text-xl font-bold text-white">{character.name}'s House</h1>
        </div>
        <motion.button
          onClick={() => setShowInventory(!showInventory)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(145deg, #ff9600, #e08600)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderBottom: '4px solid #cc7700',
            boxShadow: '0 4px 0 #a06800, 0 6px 12px rgba(255,150,0,0.25)',
          }}
          whileTap={{ y: 2 }}
        >
          <span className="text-lg" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>🎒</span>
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
                background: isActive ? '#2b3f48' : 'transparent',
                border: isActive ? '2px solid #3d5560' : '2px solid transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.4)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm">{room.icon}</span>
              <span>{room.name}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Room view */}
      <div className="flex-1 mx-4 rounded-2xl overflow-hidden relative"
        style={{ background: roomThemes[activeRoom].bg, border: '2px solid #2b3f48', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>

        {/* Room decoration - subtle pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08), transparent 50%)',
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
              background: `linear-gradient(145deg, ${character.color}cc, ${character.color})`,
              border: '3px solid rgba(255,255,255,0.3)',
              borderBottom: '5px solid rgba(0,0,0,0.2)',
              boxShadow: '0 8px 0 rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.2)',
            }}>
            <img src={character.image} alt={character.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }} />
          </div>
        </motion.div>

        {/* Placed furniture grid */}
        <div className="p-4 grid grid-cols-4 gap-3 relative z-5">
          {placedItems.map((item) => (
            <motion.div key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
              <motion.button
                onClick={() => removeFurniture(activeRoom, item.id)}
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform"
                style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.18)' }}
                whileTap={{ scale: 0.85 }}
              >
                <span style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>{item.icon}</span>
              </motion.button>
              <span className="text-xs mt-1 text-center leading-tight font-bold" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>{item.name}</span>
            </motion.div>
          ))}
        </div>

        {placedItems.length === 0 && (
          <div className="flex items-center justify-center h-full pb-24">
            <div className="text-center">
              <motion.span
                className="text-4xl block mb-2"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >🏠</motion.span>
              <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Empty room!
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Open your backpack 🎒 to add furniture
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gear collection strip */}
      {gear.length > 0 && (
        <div className="px-4 pt-3 shrink-0">
          <p className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>⚔️ Gear</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gear.map(item => (
              <div key={item.id} className="flex-shrink-0 rounded-xl px-3 py-2 flex items-center gap-2"
                style={{ background: '#1a2e35', border: '1.5px solid #2b3f48' }}>
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs font-bold whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.name}</span>
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
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setShowInventory(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 inset-x-0 z-50 rounded-t-3xl p-5"
              style={{ background: '#1a2e35', borderTop: '3px solid #2b3f48', maxHeight: '50vh' }}
            >
              {/* Handle bar */}
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: '#2b3f48' }} />

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-white">🎒 Backpack</h3>
                <motion.button
                  onClick={() => setShowInventory(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#2b3f48' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-white text-sm font-bold">✕</span>
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
                      className="flex flex-col items-center p-3 rounded-xl transition-colors"
                      style={{ background: '#131f24', border: '2px solid #2b3f48' }}
                    >
                      <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))', marginBottom: 4 }}>{item.icon}</span>
                      <span className="text-xs font-bold text-center leading-tight" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem' }}>{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <motion.span className="text-4xl block mb-2" animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>🎒</motion.span>
                  <p className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>No furniture for this room yet!</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>Complete missions to earn furniture ✨</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}