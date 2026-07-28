import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import {
  WALLS, FLOORS, CATEGORIES,
  getHouseItem, getPetDef, getWall, getFloor,
  itemsByCategory, allPets,
} from '../data/houseItems'
import { BackArrowIcon, StarIcon, HeartIcon, BoltIcon, LeafIcon, CloseIcon, CheckIcon, LockIcon } from '../components/SVGIcons'

// Floor band (as % of the room box). Items live on the floor and scale with depth.
const FLOOR_TOP = 47
const FLOOR_BOTTOM = 91
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const depthScale = (y) => 0.66 + ((y - FLOOR_TOP) / (FLOOR_BOTTOM - FLOOR_TOP)) * 0.6

function UndoIcon({ size = 16, color = '#6B7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
    </svg>
  )
}
function RedoIcon({ size = 16, color = '#6B7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" /><path d="M21 13a9 9 0 1 1-3-7.7L21 8" />
    </svg>
  )
}

export default function HouseScreen({ navigate }) {
  const {
    selectedCharacter, childName, xp, stars,
    furniture, gear, pets,
    placedItems, wallStyle, floorStyle,
    placeHouseItem, moveHouseItem, removeHouseItem, setPlacedItems,
    setWallStyle, setFloorStyle,
  } = useGameStore()

  const character = getCharacter(selectedCharacter)

  const [category, setCategory] = useState('furniture')
  const [selectedUid, setSelectedUid] = useState(null)
  const [livePos, setLivePos] = useState(null) // { uid, x, y } while dragging
  const [toast, setToast] = useState(null)
  const [peek, setPeek] = useState(false)

  // Undo / redo history (session-scoped)
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])

  const roomRef = useRef(null)
  const drag = useRef(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(showToast._t)
    showToast._t = setTimeout(() => setToast(null), 1600)
  }, [])

  const record = useCallback((snapshot) => {
    setPast((p) => [...p, snapshot])
    setFuture([])
  }, [])

  // ---- ownership ----
  const ownedItemIds = new Set([...furniture.map((f) => f.id), ...gear.map((g) => g.id)])
  const ownedPetIds = new Set(pets.map((p) => p.id))
  const isItemOwned = (item) => item.default || ownedItemIds.has(item.id)
  const placedPetCount = placedItems.filter((p) => p.kind === 'pet').length

  // ---- placing / moving / removing ----
  const placeNew = (itemId, kind) => {
    record(placedItems)
    const uid = placeHouseItem({ itemId, kind, x: 50, y: 68 })
    setSelectedUid(uid)
    showToast('Placed! Drag to arrange ✨')
  }

  const remove = (uid) => {
    record(placedItems)
    removeHouseItem(uid)
    setSelectedUid(null)
  }

  const coordsFromEvent = (clientX, clientY) => {
    const rect = roomRef.current.getBoundingClientRect()
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 6, 94),
      y: clamp(((clientY - rect.top) / rect.height) * 100, FLOOR_TOP, FLOOR_BOTTOM),
    }
  }

  const onItemPointerDown = (e, uid) => {
    e.stopPropagation()
    try { roomRef.current.setPointerCapture(e.pointerId) } catch { /* noop */ }
    drag.current = { uid, startX: e.clientX, startY: e.clientY, moved: false, snapshot: placedItems, pointerId: e.pointerId }
  }

  const onRoomPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY)
    if (dist > 5) d.moved = true
    if (d.moved) setLivePos({ uid: d.uid, ...coordsFromEvent(e.clientX, e.clientY) })
  }

  const endDrag = (e) => {
    const d = drag.current
    if (!d) return
    try { roomRef.current.releasePointerCapture(d.pointerId) } catch { /* noop */ }
    if (d.moved) {
      const { x, y } = coordsFromEvent(e.clientX, e.clientY)
      record(d.snapshot)
      moveHouseItem(d.uid, x, y)
    } else {
      setSelectedUid((cur) => (cur === d.uid ? null : d.uid))
    }
    drag.current = null
    setLivePos(null)
  }

  const undo = () => {
    if (!past.length) return
    const prev = past[past.length - 1]
    setFuture((f) => [placedItems, ...f])
    setPast((p) => p.slice(0, -1))
    setPlacedItems(prev)
    setSelectedUid(null)
  }
  const redo = () => {
    if (!future.length) return
    const next = future[0]
    setPast((p) => [...p, placedItems])
    setFuture((f) => f.slice(1))
    setPlacedItems(next)
    setSelectedUid(null)
  }

  const saveHome = () => {
    setSelectedUid(null)
    showToast('Home saved! 🏡')
  }

  const wall = getWall(wallStyle)
  const floor = getFloor(floorStyle)
  const orderedPlaced = [...placedItems].sort((a, b) => a.y - b.y)

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F5F3FF' }}>
      {/* Header */}
      <div style={{ padding: '0.6rem 1rem 0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <motion.button onClick={() => navigate('home')} whileTap={{ scale: 0.9 }}
          style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <BackArrowIcon size={16} color="#7C3AED" />
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.15rem', color: '#5B21B6', margin: 0, lineHeight: 1.1 }}>
            {childName ? `${childName}'s House` : `${character.name}'s House`}
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: '#A78BFA', margin: 0, fontWeight: 700 }}>Decorate your cozy space</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'white', borderRadius: '9999px', padding: '5px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <StarIcon size={14} color="#FBBF24" />
          <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '0.85rem', color: '#1F2937' }}>{stars}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '8px', flexShrink: 0 }}>
        {[
          { icon: <HeartIcon size={15} color="#EC4899" />, bg: '#FCE7F3', label: 'Cozy', value: placedItems.length },
          { icon: <BoltIcon size={15} color="#F59E0B" />, bg: '#FEF3C7', label: 'XP', value: xp },
          { icon: <LeafIcon size={15} color="#10B981" />, bg: '#D1FAE5', label: 'Happy Pets', value: `${placedPetCount}/${pets.length}` },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '7px', background: 'white', borderRadius: '14px', padding: '7px 9px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: '#9CA3AF', margin: 0, whiteSpace: 'nowrap' }}>{s.label}</p>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '0.9rem', fontWeight: 800, color: '#1F2937', margin: 0, lineHeight: 1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Interactive isometric room ===== */}
      <div
        ref={roomRef}
        onPointerMove={onRoomPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerDown={() => setSelectedUid(null)}
        style={{
          position: 'relative', margin: '0 12px', borderRadius: '22px', overflow: 'hidden',
          flex: 1, minHeight: 0, touchAction: 'none',
          boxShadow: '0 10px 30px rgba(91,33,182,0.15)', border: '1px solid rgba(0,0,0,0.05)',
          background: wall.wall,
        }}
      >
        {/* Back wall decorations */}
        {wall.dark && [...Array(14)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: 'white', opacity: 0.7,
            top: `${5 + Math.random() * 35}%`, left: `${5 + Math.random() * 90}%` }} />
        ))}
        {/* Round window */}
        <div style={{ position: 'absolute', top: '7%', left: '50%', transform: 'translateX(-50%)', width: '62px', height: '62px', borderRadius: '50%',
          background: wall.dark ? 'radial-gradient(circle at 40% 35%,#4C1D95,#1E1B4B)' : 'radial-gradient(circle at 40% 35%,#FDE68A,#FBCFE8)',
          border: '5px solid rgba(255,255,255,0.85)', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'linear-gradient(90deg,transparent 47%,rgba(255,255,255,0.7) 47% 53%,transparent 53%),linear-gradient(0deg,transparent 47%,rgba(255,255,255,0.7) 47% 53%,transparent 53%)' }} />
        </div>
        {/* String lights */}
        <svg viewBox="0 0 300 40" preserveAspectRatio="none" style={{ position: 'absolute', top: '3%', left: 0, width: '100%', height: '38px', opacity: 0.9 }}>
          <path d="M0 6 Q75 34 150 12 T300 8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          {[...Array(9)].map((_, i) => (
            <circle key={i} cx={15 + i * 34} cy={16 + (i % 2) * 8} r="3.2" fill={['#FBBF24', '#F472B6', '#A78BFA', '#34D399'][i % 4]} />
          ))}
        </svg>

        {/* Floor plane (isometric) — top edge sits high so, once foreshortened, the wood
            reaches up to the skirting line and fills the whole floor zone */}
        <div style={{
          position: 'absolute', left: '-32%', right: '-32%', top: '24%', bottom: 0,
          background: floor.floor, backgroundColor: floor.base,
          transform: 'perspective(680px) rotateX(46deg)', transformOrigin: '50% 100%',
          boxShadow: 'inset 0 10px 50px rgba(0,0,0,0.16)', pointerEvents: 'none',
        }} />
        {/* Soft blend where wall meets floor */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: `${FLOOR_TOP - 3}%`, height: '5%', background: 'linear-gradient(180deg,rgba(0,0,0,0.06),transparent)', pointerEvents: 'none' }} />

        {/* Character avatar standing in the room */}
        <motion.div
          animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: '50%', top: '86%', transform: `translate(-50%,-100%) scale(${depthScale(86)})`, zIndex: Math.round(86 * 4), pointerEvents: 'none', textAlign: 'center' }}>
          <div style={{ width: '58px', height: '58px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${character.color}`, boxShadow: `0 6px 18px ${character.color}40`, background: 'white' }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ width: '46px', height: '10px', borderRadius: '50%', background: 'rgba(0,0,0,0.18)', filter: 'blur(4px)', margin: '2px auto 0' }} />
        </motion.div>

        {/* Placed items & pets */}
        {orderedPlaced.map((p) => {
          const def = p.kind === 'pet' ? getPetDef(p.itemId) : getHouseItem(p.itemId)
          if (!def) return null
          const live = livePos && livePos.uid === p.uid ? livePos : p
          const ds = depthScale(live.y)
          const size = 42 * (def.scale || 1) * ds
          const isSel = selectedUid === p.uid
          return (
            <div key={p.uid}
              onPointerDown={(e) => onItemPointerDown(e, p.uid)}
              style={{
                position: 'absolute', left: `${live.x}%`, top: `${live.y}%`,
                transform: 'translate(-50%,-100%)', zIndex: Math.round(live.y * 4) + (isSel ? 500 : 0),
                cursor: 'grab', touchAction: 'none', textAlign: 'center', userSelect: 'none',
              }}>
              {/* remove button when selected */}
              {isSel && !peek && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }}
                  onPointerDown={(e) => { e.stopPropagation(); remove(p.uid) }}
                  style={{ position: 'absolute', top: -14, right: -14, width: 24, height: 24, borderRadius: '50%', background: '#EF4444', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10 }}>
                  <CloseIcon size={11} color="white" />
                </motion.button>
              )}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }}
                style={{
                  fontSize: `${size}px`, lineHeight: 1,
                  filter: `drop-shadow(0 4px 4px rgba(0,0,0,0.25))${isSel ? ' drop-shadow(0 0 6px rgba(139,92,246,0.9))' : ''}`,
                }}>
                {def.emoji}
              </motion.div>
              {/* ground shadow */}
              <div style={{ width: `${size * 0.7}px`, height: `${size * 0.16}px`, borderRadius: '50%', background: 'rgba(0,0,0,0.16)', filter: 'blur(3px)', margin: '-2px auto 0' }} />
            </div>
          )
        })}

        {/* Empty room hint */}
        {placedItems.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', padding: '0 2rem' }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity }}
              style={{ textAlign: 'center', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)', borderRadius: '16px', padding: '0.9rem 1.1rem', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '1.8rem' }}>🪄</div>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '0.9rem', color: '#5B21B6', margin: '4px 0 0' }}>Your room is empty!</p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: '#8B5CF6', margin: '2px 0 0' }}>Tap items below to decorate</p>
            </motion.div>
          </div>
        )}

        {/* Undo / Redo (top-left over room) */}
        {!peek && (
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 900 }}>
            <RoundBtn onClick={undo} disabled={!past.length}><UndoIcon color={past.length ? '#7C3AED' : '#D1D5DB'} /></RoundBtn>
            <RoundBtn onClick={redo} disabled={!future.length}><RedoIcon color={future.length ? '#7C3AED' : '#D1D5DB'} /></RoundBtn>
          </div>
        )}

        {/* View / Edit toggle (top-right over room) */}
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 900 }}>
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => { setPeek(!peek); setSelectedUid(null) }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'white', borderRadius: '9999px', padding: '7px 11px', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
            <span style={{ fontSize: '0.8rem' }}>{peek ? '✏️' : '👁️'}</span>
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.7rem', color: '#7C3AED' }}>{peek ? 'Edit' : 'View'}</span>
          </motion.button>
        </div>

        {/* Save Home button */}
        {!peek && (
          <motion.button whileTap={{ scale: 0.96 }} onClick={saveHome}
            style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 900,
              display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 20px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', boxShadow: '0 6px 18px rgba(124,58,237,0.4)' }}>
            <CheckIcon size={15} color="white" />
            <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '0.85rem', color: 'white' }}>Save Home</span>
          </motion.button>
        )}

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
                background: 'rgba(31,41,55,0.92)', color: 'white', borderRadius: '9999px', padding: '7px 15px',
                fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Category tabs + item tray ===== */}
      {!peek && (
        <div style={{ flexShrink: 0, padding: '0.5rem 0 0.4rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '0 12px 6px', WebkitOverflowScrolling: 'touch' }}>
            {CATEGORIES.map((c) => {
              const active = category === c.id
              return (
                <motion.button key={c.id} onClick={() => setCategory(c.id)} whileTap={{ scale: 0.95 }}
                  style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 13px', borderRadius: '9999px', cursor: 'pointer',
                    background: active ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'white',
                    border: active ? 'none' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: active ? '0 4px 12px rgba(124,58,237,0.3)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <span style={{ fontSize: '0.85rem' }}>{c.emoji}</span>
                  <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.75rem', color: active ? 'white' : '#6B7280' }}>{c.label}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Tray */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 12px 6px', WebkitOverflowScrolling: 'touch', minHeight: '78px' }}>
            <Tray
              category={category}
              isItemOwned={isItemOwned}
              ownedPetIds={ownedPetIds}
              wallStyle={wallStyle} floorStyle={floorStyle}
              onPlace={placeNew}
              onSetWall={(id) => { setWallStyle(id); showToast('Wall updated 🎨') }}
              onSetFloor={(id) => { setFloorStyle(id); showToast('Floor updated 🧱') }}
              onLocked={(hint) => showToast(hint || 'Win this in an Adventure!')}
            />
          </div>

          {/* Hint line */}
          <p style={{ textAlign: 'center', fontFamily: "'Nunito', sans-serif", fontSize: '0.68rem', fontWeight: 700, color: '#A78BFA', margin: '0 0 2px' }}>
            {category === 'pets' ? '🐾 Tap a friend to bring them home' :
             category === 'walls' || category === 'floors' ? '🎨 Tap to redecorate your room' :
             '✨ Tap an item to place it, then drag to arrange'}
          </p>
        </div>
      )}
    </div>
  )
}

function RoundBtn({ children, onClick, disabled }) {
  return (
    <motion.button whileTap={disabled ? {} : { scale: 0.9 }} onClick={onClick} disabled={disabled}
      style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'white', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)', opacity: disabled ? 0.6 : 1 }}>
      {children}
    </motion.button>
  )
}

function TrayTile({ owned, emoji, label, active, dim, onClick, treasure }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.9 }}
      style={{ flexShrink: 0, width: '66px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
        padding: '7px 4px', borderRadius: '14px', cursor: 'pointer', position: 'relative',
        background: active ? 'linear-gradient(135deg,#EDE9FE,#DDD6FE)' : 'white',
        border: active ? '2px solid #8B5CF6' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      {treasure && owned && (
        <span style={{ position: 'absolute', top: 2, right: 4, fontSize: '0.6rem' }}>⭐</span>
      )}
      <div style={{ fontSize: '1.7rem', lineHeight: 1, filter: dim ? 'grayscale(1) opacity(0.45)' : 'none' }}>{emoji}</div>
      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: dim ? '#9CA3AF' : '#4B5563', textAlign: 'center', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
        {label}
      </span>
      {dim && (
        <span style={{ position: 'absolute', top: 4, left: 5 }}><LockIcon size={11} color="#9CA3AF" /></span>
      )}
      {active && (
        <span style={{ position: 'absolute', bottom: 3, right: 5 }}><CheckIcon size={11} color="#7C3AED" /></span>
      )}
    </motion.button>
  )
}

function Tray({ category, isItemOwned, ownedPetIds, wallStyle, floorStyle, onPlace, onSetWall, onSetFloor, onLocked }) {
  if (category === 'walls') {
    return Object.values(WALLS).map((w) => (
      <button key={w.id} onClick={() => onSetWall(w.id)}
        style={{ flexShrink: 0, width: '66px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 4px', borderRadius: '14px', cursor: 'pointer', background: 'white', border: wallStyle === w.id ? '2px solid #8B5CF6' : '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: w.swatch, border: '1px solid rgba(0,0,0,0.08)' }} />
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: '#4B5563' }}>{w.name}</span>
        {wallStyle === w.id && <span style={{ position: 'absolute', top: 4, right: 5 }}><CheckIcon size={11} color="#7C3AED" /></span>}
      </button>
    ))
  }
  if (category === 'floors') {
    return Object.values(FLOORS).map((f) => (
      <button key={f.id} onClick={() => onSetFloor(f.id)}
        style={{ flexShrink: 0, width: '66px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 4px', borderRadius: '14px', cursor: 'pointer', background: 'white', border: floorStyle === f.id ? '2px solid #8B5CF6' : '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: f.floor, backgroundColor: f.base, border: '1px solid rgba(0,0,0,0.08)' }} />
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: '#4B5563' }}>{f.name}</span>
        {floorStyle === f.id && <span style={{ position: 'absolute', top: 4, right: 5 }}><CheckIcon size={11} color="#7C3AED" /></span>}
      </button>
    ))
  }
  if (category === 'pets') {
    const pets = allPets()
    return pets.map((pet) => {
      const owned = ownedPetIds.has(pet.id)
      return (
        <TrayTile key={pet.id} owned={owned} dim={!owned} emoji={owned ? pet.emoji : '❓'} label={owned ? pet.name : 'Locked'}
          onClick={() => owned ? onPlace(pet.id, 'pet') : onLocked(pet.hint)} />
      )
    })
  }
  // furniture / decor
  const items = itemsByCategory(category)
  // owned first, then locked
  const sorted = [...items].sort((a, b) => (isItemOwned(b) ? 1 : 0) - (isItemOwned(a) ? 1 : 0))
  return sorted.map((item) => {
    const owned = isItemOwned(item)
    return (
      <TrayTile key={item.id} owned={owned} dim={!owned} treasure={item.treasure}
        emoji={item.emoji} label={owned ? item.name : 'Locked'}
        onClick={() => owned ? onPlace(item.id, 'item') : onLocked('Win this in an Adventure! 🗺️')} />
    )
  })
}
