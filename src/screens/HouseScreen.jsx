import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { BackArrowIcon, BackpackIcon, CloseIcon, HomeIcon } from '../components/SVGIcons'

const defaultFurniture = [
  { id: 'cozy-bed', name: 'Cozy Bed', icon: 'bed', room: 'bedroom' },
  { id: 'fluffy-rug', name: 'Fluffy Rug', icon: 'rug', room: 'livingRoom' },
  { id: 'potted-plant', name: 'Potted Plant', icon: 'plant', room: 'livingRoom' },
]

const roomThemes = {
  livingRoom: { name: 'Living Room', accent: '#10B981', bg: '#D1FAE5' },
  bedroom: { name: 'Bedroom', accent: '#8B5CF6', bg: '#EDE9FE' },
  garden: { name: 'Garden', accent: '#3B82F6', bg: '#DBEAFE' },
}

function FurnitureIcon({ type, size = 24, color = '#6B7280' }) {
  const icons = {
    bed: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M2 4v16M22 4v16M2 8h20M2 16h20M6 8v8M18 8v8" /></svg>,
    rug: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="2" y1="12" x2="22" y2="12" strokeDasharray="4 2" /></svg>,
    plant: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 22V8M12 8c-4 0-6-3-6-6 6 0 6 6 6 6zM12 8c4 0 6-3 6-6-6 0-6 6-6 6z" /></svg>,
    mushroom: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 14v8M8 22h8M4 14c0-5 3.5-10 8-10s8 5 8 10H4z" /></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
    fountain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 2v6M8 4c0 2 2 4 4 4s4-2 4-4M5 22h14M7 22c0-3 2-5 5-5s5 2 5 5" /></svg>,
    throne: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M5 22V10l7-8 7 8v12M9 14h6M3 22h18" /></svg>,
    lamp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 18h6M10 22h4M12 2v1M4 10a8 8 0 0 1 16 0M12 14v4" /></svg>,
    cupcake: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 2c-2 0-3 2-3 4s1 2 3 2 3 0 3-2-1-4-3-4zM7 10h10l-1 12H8L7 10z" /></svg>,
    pearl: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" fill={`${color}30`} /></svg>,
    acorn: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 2c-3 0-5 2-5 5 0 4 5 10 5 10s5-6 5-10c0-3-2-5-5-5z" /></svg>,
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
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.button onClick={() => navigate('home')}
            style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}
            whileTap={{ scale: 0.9 }}>
            <BackArrowIcon size={16} color="#6B7280" />
          </motion.button>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#1F2937', margin: 0 }}>
            {character.name}'s House
          </h1>
        </div>
        <motion.button onClick={() => setShowInventory(!showInventory)}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))',
            border: '1px solid rgba(139,92,246,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
          <BackpackIcon size={16} color="#8B5CF6" />
        </motion.button>
      </div>

      {/* Room tabs */}
      <div style={{ padding: '0 1rem 0.75rem', display: 'flex', gap: '8px', flexShrink: 0 }}>
        {Object.entries(roomThemes).map(([key, room]) => {
          const isActive = activeRoom === key
          return (
            <motion.button key={key} onClick={() => setActiveRoom(key)}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '6px 14px', borderRadius: '12px',
                background: isActive ? room.bg : 'transparent',
                border: isActive ? `1px solid ${room.accent}30` : '1px solid transparent',
                fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700,
                color: isActive ? room.accent : '#9CA3AF', cursor: 'pointer',
              }}>
              {room.name}
            </motion.button>
          )
        })}
      </div>

      {/* Room view */}
      <div className="flex-1 mx-4 rounded-2xl overflow-hidden relative" style={{
        background: `linear-gradient(180deg, ${roomThemes[activeRoom].bg}, white)`,
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      }}>
        {/* Character */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden',
            border: `2px solid ${character.color}40`, boxShadow: `0 8px 24px ${character.color}15`,
          }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </motion.div>

        {/* Placed furniture */}
        <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', position: 'relative', zIndex: 5 }}>
          {placedItems.map((item) => (
            <motion.div key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.button onClick={() => removeFurniture(activeRoom, item.id)}
                whileTap={{ scale: 0.85 }}
                style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                <FurnitureIcon type={item.icon || 'plant'} size={22} color="#6B7280" />
              </motion.button>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: '#9CA3AF', marginTop: '3px', textAlign: 'center' }}>{item.name}</span>
            </motion.div>
          ))}
        </div>

        {placedItems.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', paddingBottom: '80px' }}>
            <div style={{ textAlign: 'center' }}>
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <HomeIcon size={36} color="#D1D5DB" />
              </motion.div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#9CA3AF', marginTop: '8px' }}>Empty room!</p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: '#D1D5DB', marginTop: '4px' }}>Open your backpack to add furniture</p>
            </div>
          </div>
        )}
      </div>

      {/* Gear collection */}
      {gear.length > 0 && (
        <div style={{ padding: '0.75rem 1rem', flexShrink: 0 }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Gear</p>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {gear.map(item => (
              <div key={item.id} style={{
                flexShrink: 0, borderRadius: '12px', padding: '6px 10px',
                background: 'white', border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', whiteSpace: 'nowrap' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory drawer */}
      <AnimatePresence>
        {showInventory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setShowInventory(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 inset-x-0 z-50"
              style={{
                borderRadius: '24px 24px 0 0', padding: '1.25rem',
                background: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(0,0,0,0.06)',
                maxHeight: '50vh', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
              }}>
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', margin: '0 auto 1rem', background: 'rgba(0,0,0,0.1)' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#1F2937', margin: 0 }}>Backpack</h3>
                <motion.button onClick={() => setShowInventory(false)}
                  whileTap={{ scale: 0.9 }}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>
                  <CloseIcon size={12} color="#6B7280" />
                </motion.button>
              </div>

              {unplacedItems.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', overflowY: 'auto' }}>
                  {unplacedItems.map((item, i) => (
                    <motion.button key={item.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => placeFurniture(activeRoom, item.id)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px',
                        borderRadius: '14px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                      }}>
                      <FurnitureIcon type={item.icon || 'plant'} size={24} color="#6B7280" />
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.6rem', fontWeight: 700, color: '#6B7280', marginTop: '4px', textAlign: 'center' }}>{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <BackpackIcon size={32} color="#D1D5DB" />
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#9CA3AF', marginTop: '8px' }}>No furniture for this room yet!</p>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: '#D1D5DB', marginTop: '4px' }}>Complete missions to earn furniture</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
