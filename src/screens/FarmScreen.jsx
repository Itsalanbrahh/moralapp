import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { companionColor, companionDisplayName } from '../data/companion'
import { BackArrowIcon, StarIcon } from '../components/SVGIcons'
import AnimatedCompanion from '../components/AnimatedCompanion'

// ═══════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════

const PLOT_STATES = {
  EMPTY: 'empty',
  SEEDED: 'seeded',
  SPROUTING: 'sprouting',
  GROWING: 'growing',
  READY: 'ready',
}

const CROPS = [
  { id: 'tomato', name: 'Tomato' },
  { id: 'carrot', name: 'Carrot' },
  { id: 'flower', name: 'Flower' },
  { id: 'pumpkin', name: 'Pumpkin' },
]

const GRID_ROWS = 3
const GRID_COLS = 3
const TOTAL_PLOTS = GRID_ROWS * GRID_COLS
const GROW_INTERVAL = 30000 // 30 seconds per growth stage

// Grid position within the scene (% of scene dimensions)
const GRID_RECT = { top: 56, left: 18, width: 64, height: 34 }

// ═══════════════════════════════════════════════════════════════════════
// Pixel Art — Palette & Sprite Data
// ═══════════════════════════════════════════════════════════════════════

const PX = 3 // pixel scale factor

const PAL = {
  g: '#4ade80', G: '#22c55e', e: '#16a34a',
  r: '#ef4444', R: '#dc2626',
  o: '#fb923c', O: '#f97316',
  p: '#f472b6', P: '#ec4899',
  y: '#fbbf24', Y: '#d97706',
  v: '#c084fc', V: '#a855f7',
  b: '#92735a', B: '#6b5340',
  d: '#c4a060', D: '#a08040',
  w: '#ffffff',
  t: '#d4a574', T: '#8b6914',
  x: '#9ca3af', X: '#6b7280',
}

// Each sprite: array of row-strings, one char per pixel, '.' = transparent
const SPR = {
  // ── Crop: Tomato ──────────────────────────────
  tomato_seeded: [
    '........',
    '........',
    '........',
    '........',
    '........',
    '..b..b..',
    '...b....',
    'DDDDDDDD',
  ],
  tomato_sprout: [
    '........',
    '........',
    '........',
    '........',
    '...g....',
    '..gGg...',
    '...G....',
    '...G....',
    'DDDDDDDD',
  ],
  tomato_grow: [
    '........',
    '........',
    '..ggg...',
    '.gGgGg..',
    '..gGg...',
    '...G....',
    '...G....',
    'DDDDDDDD',
  ],
  tomato_ready: [
    '..gGg...',
    '.grrRg..',
    'grrRRrg.',
    '.grrrg..',
    '..gGg...',
    '...G....',
    '...G....',
    'DDDDDDDD',
  ],

  // ── Crop: Carrot ──────────────────────────────
  carrot_seeded: [
    '........',
    '........',
    '........',
    '........',
    '........',
    '..b..b..',
    '...b....',
    'DDDDDDDD',
  ],
  carrot_sprout: [
    '........',
    '........',
    '........',
    '........',
    '...g....',
    '...g....',
    '...G....',
    '...G....',
    'DDDDDDDD',
  ],
  carrot_grow: [
    '........',
    '........',
    '..g.g...',
    '.ggggg..',
    '...g....',
    '...o....',
    '...O....',
    'DDDDDDDD',
  ],
  carrot_ready: [
    '..ggg...',
    '.gGgGg..',
    '..gGg...',
    '...g....',
    '..oOo...',
    '..OYO...',
    '..oOo...',
    'DDDDDDDD',
  ],

  // ── Crop: Flower ──────────────────────────────
  flower_seeded: [
    '........',
    '........',
    '........',
    '........',
    '........',
    '..b..b..',
    '...b....',
    'DDDDDDDD',
  ],
  flower_sprout: [
    '........',
    '........',
    '........',
    '........',
    '...g....',
    '...g....',
    '...G....',
    '...G....',
    'DDDDDDDD',
  ],
  flower_grow: [
    '........',
    '........',
    '........',
    '...p....',
    '..ppp...',
    '...g....',
    '...G....',
    '...G....',
    'DDDDDDDD',
  ],
  flower_ready: [
    '..pPp...',
    '.Pyyp...',
    '.pyYPp..',
    '.Pyyp...',
    '..pPp...',
    '...g....',
    '...G....',
    'DDDDDDDD',
  ],

  // ── Crop: Pumpkin ─────────────────────────────
  pumpkin_seeded: [
    '........',
    '........',
    '........',
    '........',
    '........',
    '..b..b..',
    '...b....',
    'DDDDDDDD',
  ],
  pumpkin_sprout: [
    '........',
    '........',
    '........',
    '........',
    '..g.....',
    '.GgG....',
    '..G.....',
    '..G.....',
    'DDDDDDDD',
  ],
  pumpkin_grow: [
    '........',
    '........',
    '.gg.gg..',
    '.gGgGg..',
    '..gGg...',
    '...G....',
    '...G....',
    'DDDDDDDD',
  ],
  pumpkin_ready: [
    '........',
    '........',
    '.gg.gg..',
    '.gOOOg..',
    '.gOYOg..',
    '.gOOOg..',
    '...G....',
    'DDDDDDDD',
  ],

  // ── Decorations ───────────────────────────────
  rock: [
    '..XX..',
    '.XxxX.',
    '.XwxX.',
    '.XxxX.',
    '..XX..',
  ],
  mushroom: [
    '..rr..',
    '.rwrr.',
    '.rrwr.',
    '..tt..',
    '..tt..',
  ],
  wildflower_p: [
    '......',
    '..p...',
    '.pyp..',
    '..p...',
    '..g...',
    '..G...',
  ],
  wildflower_y: [
    '......',
    '..y...',
    '.yYy..',
    '..y...',
    '..g...',
    '..G...',
  ],
  wildflower_v: [
    '......',
    '..v...',
    '.vYv..',
    '..v...',
    '..g...',
    '..G...',
  ],
  stump: [
    '.TTTT.',
    'TtTTtT',
    'TtTTtT',
    '.TTTT.',
  ],
  seed_icon: [
    '.....',
    '..b..',
    '.bBb.',
    '..b..',
    '.....',
  ],
  basket_icon: [
    '.ttt.',
    'tTTTt',
    'tTTTt',
    '.ttt.',
  ],
  sparkle_icon: [
    '..y..',
    '.yyy.',
    'yyyyy',
    '.yyy.',
    '..y..',
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// Sprite → box-shadow helper
// ═══════════════════════════════════════════════════════════════════════

function spriteToShadow(rows, palette, px) {
  const shadows = []
  for (let y = 0; y < rows.length; y++) {
    const line = rows[y]
    for (let x = 0; x < line.length; x++) {
      const c = line[x]
      if (c !== '.' && palette[c]) {
        shadows.push(`${x * px}px ${y * px}px 0 ${palette[c]}`)
      }
    }
  }
  return shadows.join(',')
}

// Pre-compute all sprite shadows at module level
const SHADOWS = {}
Object.entries(SPR).forEach(([key, rows]) => {
  SHADOWS[key] = spriteToShadow(rows, PAL, PX)
})

// ═══════════════════════════════════════════════════════════════════════
// Pixel Art Component
// ═══════════════════════════════════════════════════════════════════════

function PixelSprite({ shadowKey, style = {} }) {
  const rows = SPR[shadowKey]
  if (!rows) return null
  const cols = Math.max(...rows.map(r => r.length))
  const totalW = cols * PX
  const totalH = rows.length * PX

  return (
    <div style={{
      position: 'absolute',
      left: `calc(50% - ${totalW / 2}px)`,
      top: `calc(50% - ${totalH / 2}px)`,
      width: PX,
      height: PX,
      background: 'transparent',
      boxShadow: SHADOWS[shadowKey],
      pointerEvents: 'none',
      imageRendering: 'pixelated',
      ...style,
    }} />
  )
}

// Small inline pixel icon (for stat bar)
function PixelIcon({ shadowKey, size = 16 }) {
  const rows = SPR[shadowKey]
  if (!rows) return null
  const cols = Math.max(...rows.map(r => r.length))
  const totalW = cols * PX
  const totalH = rows.length * PX
  const scale = size / Math.max(totalW, totalH)

  return (
    <div style={{
      width: totalW * scale,
      height: totalH * scale,
      position: 'relative',
      overflow: 'visible',
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute',
        left: 0, top: 0,
        width: PX, height: PX,
        background: 'transparent',
        boxShadow: SHADOWS[shadowKey],
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        imageRendering: 'pixelated',
      }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Scene Decoration Components
// ═══════════════════════════════════════════════════════════════════════

function Cloud({ left, top, delay, size = 60 }) {
  return (
    <motion.div
      animate={{ x: [0, 18, 0] }}
      transition={{ duration: 22 + delay * 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left, top,
        width: size, height: size * 0.45,
        zIndex: 10, pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 60 27" width={size} height={size * 0.45} style={{ imageRendering: 'pixelated' }}>
        <rect x="10" y="10" width="40" height="14" rx="7" fill="rgba(255,255,255,0.9)" />
        <rect x="18" y="4" width="18" height="14" rx="9" fill="rgba(255,255,255,0.92)" />
        <rect x="8" y="12" width="14" height="10" rx="5" fill="rgba(255,255,255,0.88)" />
        <rect x="36" y="8" width="14" height="12" rx="6" fill="rgba(255,255,255,0.88)" />
      </svg>
    </motion.div>
  )
}

function Tree({ left, top, size = 1, fruitColor = '#ef4444', zIndex = 3 }) {
  return (
    <motion.div
      animate={{ rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left, top,
        pointerEvents: 'none', zIndex,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Trunk */}
      <div style={{
        position: 'absolute',
        left: '50%', bottom: 0,
        transform: 'translateX(-50%)',
        width: 8 * size, height: 22 * size,
        background: 'linear-gradient(90deg, #6b5340 0%, #8b6914 40%, #a07828 60%, #8b6914 100%)',
        borderRadius: '2px 2px 0 0',
      }} />
      {/* Canopy layers */}
      <div style={{
        position: 'absolute',
        left: '50%', bottom: 18 * size,
        transform: 'translateX(-50%)',
        width: 40 * size, height: 36 * size,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 35% 35%, #7ec850 0%, #5aa830 50%, #3d8a20 100%)',
        boxShadow: `inset ${-4 * size}px ${-4 * size}px 0 rgba(255,255,255,0.12), inset ${3 * size}px ${3 * size}px 0 rgba(0,0,0,0.15)`,
      }}>
        {/* Highlight blob */}
        <div style={{
          position: 'absolute', top: '15%', left: '20%',
          width: '35%', height: '30%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
        }} />
        {/* Fruits */}
        <div style={{
          position: 'absolute', top: '30%', right: '15%',
          width: 7 * size, height: 7 * size,
          borderRadius: '50%', background: fruitColor,
          boxShadow: `inset -${2 * size}px -${2 * size}px 0 rgba(0,0,0,0.2)`,
        }} />
        <div style={{
          position: 'absolute', top: '55%', left: '18%',
          width: 6 * size, height: 6 * size,
          borderRadius: '50%', background: fruitColor,
          boxShadow: `inset -${2 * size}px -${2 * size}px 0 rgba(0,0,0,0.2)`,
          opacity: 0.85,
        }} />
      </div>
    </motion.div>
  )
}

function House({ left, top }) {
  return (
    <div style={{
      position: 'absolute', left, top,
      pointerEvents: 'none', zIndex: 5,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
    }}>
      {/* Roof */}
      <div style={{
        width: 76, height: 0, marginBottom: -2,
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderBottom: '28px solid #c0392b',
        position: 'relative',
      }}>
        {/* Roof highlight */}
        <div style={{
          position: 'absolute', top: 6, left: -6,
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '16px solid rgba(255,255,255,0.12)',
        }} />
      </div>
      {/* Chimney */}
      <div style={{
        position: 'absolute', right: 10, top: -20,
        width: 12, height: 26,
        background: 'linear-gradient(90deg, #8b6914, #a07828, #8b6914)',
        borderRadius: '2px 2px 0 0',
      }}>
        {/* Chimney top */}
        <div style={{
          position: 'absolute', top: -4, left: -2,
          width: 16, height: 5,
          background: '#6b5340',
          borderRadius: '2px',
        }} />
        {/* Smoke */}
        <motion.div
          animate={{ y: [-2, -18], opacity: [0.5, 0], scale: [0.8, 1.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: -8, left: 2,
            width: 8, height: 8,
            borderRadius: '50%',
            background: 'rgba(200,200,200,0.4)',
          }}
        />
        <motion.div
          animate={{ y: [-2, -22], opacity: [0.4, 0], scale: [0.6, 1.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: 1.2 }}
          style={{
            position: 'absolute', top: -6, left: 5,
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'rgba(200,200,200,0.3)',
          }}
        />
      </div>
      {/* Walls */}
      <div style={{
        width: 76, height: 40,
        background: 'linear-gradient(180deg, #f5deb3 0%, #e8d0a0 100%)',
        border: '2px solid #d4a574',
        borderRadius: '0 0 4px 4px',
        position: 'relative',
      }}>
        {/* Door */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: 16, height: 24,
          background: 'linear-gradient(90deg, #7a5c10, #8b6914, #7a5c10)',
          borderRadius: '8px 8px 0 0',
        }}>
          <div style={{
            position: 'absolute', top: 12, right: 4,
            width: 3, height: 3, borderRadius: '50%',
            background: '#fbbf24',
          }} />
        </div>
        {/* Left window */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          width: 14, height: 12,
          background: '#87ceeb',
          border: '2px solid #d4a574',
          borderRadius: 2,
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            height: 1, background: '#d4a574',
          }} />
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1, background: '#d4a574',
          }} />
        </div>
        {/* Right window */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 14, height: 12,
          background: '#87ceeb',
          border: '2px solid #d4a574',
          borderRadius: 2,
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            height: 1, background: '#d4a574',
          }} />
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0,
            width: 1, background: '#d4a574',
          }} />
        </div>
      </div>
      {/* Flower boxes */}
      <div style={{
        position: 'absolute', bottom: 40, left: 6,
        display: 'flex', gap: 3, zIndex: 1,
      }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: ['#ff6b9d', '#fbbf24', '#8b5cf6'][i],
              boxShadow: `0 1px 0 rgba(0,0,0,0.15)`,
            }}
          />
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 40, right: 6,
        display: 'flex', gap: 3, zIndex: 1,
      }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 + 0.8 }}
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: ['#8b5cf6', '#fbbf24', '#ff6b9d'][i],
              boxShadow: `0 1px 0 rgba(0,0,0,0.15)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function FenceSegment({ left, top, width }) {
  return (
    <div style={{
      position: 'absolute', left, top, width,
      height: 24, pointerEvents: 'none', zIndex: 4,
      display: 'flex', alignItems: 'flex-end',
    }}>
      {/* Rail */}
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        height: 4,
        background: 'linear-gradient(180deg, #d4a574, #b09040)',
        borderRadius: 1,
      }} />
      <div style={{
        position: 'absolute', bottom: 16, left: 0, right: 0,
        height: 4,
        background: 'linear-gradient(180deg, #d4a574, #b09040)',
        borderRadius: 1,
      }} />
      {/* Posts */}
      {[0, 15, 30, 45, 60, 75, 90].map(pct => (
        <div key={pct} style={{
          position: 'absolute', left: `${pct}%`, bottom: 0,
          width: 5, height: 24,
          background: 'linear-gradient(90deg, #a07828, #c4a060, #a07828)',
          borderRadius: '2px 2px 0 0',
          transform: 'translateX(-50%)',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: -1,
            width: 7, height: 3,
            background: '#b09040',
            borderRadius: '3px 3px 0 0',
          }} />
        </div>
      ))}
    </div>
  )
}

function Butterfly({ left, top, color, delay }) {
  return (
    <motion.div
      animate={{
        x: [0, 25, -15, 35, -10, 0],
        y: [0, -20, 12, -25, 8, 0],
        rotate: [0, 12, -8, 15, -5, 0],
      }}
      transition={{ duration: 10 + delay * 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', left, top,
        width: 10, height: 10,
        zIndex: 15, pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 12 12" width="10" height="10" style={{ imageRendering: 'pixelated' }}>
        <motion.g
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 0.25, repeat: Infinity }}
          style={{ transformOrigin: '6px 6px' }}
        >
          <ellipse cx="3" cy="5" rx="3" ry="4" fill={color} opacity="0.8" />
          <ellipse cx="9" cy="5" rx="3" ry="4" fill={color} opacity="0.8" />
          <line x1="6" y1="3" x2="6" y2="9" stroke="#654321" strokeWidth="0.7" />
        </motion.g>
      </svg>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Effect Components (particles, drops, sparkles)
// ═══════════════════════════════════════════════════════════════════════

function DirtParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          initial={{ y: 0, x: 0, opacity: 1 }}
          animate={{
            y: -(15 + Math.random() * 20),
            x: (Math.random() - 0.5) * 30,
            opacity: 0,
          }}
          transition={{ duration: 0.6 + Math.random() * 0.3, delay: i * 0.05 }}
          style={{
            position: 'absolute',
            left: `${35 + Math.random() * 30}%`,
            top: '50%',
            width: 4, height: 4,
            borderRadius: '50%',
            background: ['#c4a060', '#a08040', '#8b6914'][i % 3],
          }}
        />
      ))}
    </div>
  )
}

function WaterDrops() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <motion.div
          key={i}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 20, opacity: [0, 1, 1, 0] }}
          transition={{ delay: i * 0.06, duration: 0.5 }}
          style={{
            position: 'absolute',
            left: `${25 + i * 8}%`,
            top: '20%',
            width: 3, height: 5,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            background: '#60a5fa',
          }}
        />
      ))}
    </div>
  )
}

function HarvestSparkles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        const angle = (i / 8) * Math.PI * 2
        const dist = 20 + Math.random() * 10
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 10,
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 0.7, delay: i * 0.03 }}
            style={{
              position: 'absolute',
              left: 'calc(50% - 3px)',
              top: 'calc(50% - 3px)',
              width: 6, height: 6,
              background: '#fbbf24',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        )
      })}
    </div>
  )
}

function SeedDrops() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ y: -10, opacity: 1 }}
          animate={{ y: 10, opacity: [1, 1, 0] }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          style={{
            position: 'absolute',
            left: `${35 + i * 15}%`,
            top: '30%',
            width: 4, height: 4,
            borderRadius: '50%',
            background: '#92735a',
          }}
        />
      ))}
    </div>
  )
}

function HarvestFruitPopup({ cropId }) {
  const color = cropId === 'tomato' ? '#ef4444' : cropId === 'carrot' ? '#fb923c' : cropId === 'flower' ? '#f472b6' : '#f59e0b'
  return (
    <motion.div
      initial={{ y: 0, scale: 0 }}
      animate={{ y: -40, scale: [0, 1.2, 1], opacity: [1, 1, 0] }}
      transition={{ duration: 0.9 }}
      style={{
        position: 'absolute',
        left: 'calc(50% - 10px)', top: '20%',
        width: 20, height: 20,
        borderRadius: '50%',
        background: color,
        boxShadow: `inset -3px -3px 0 rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.25)`,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Crop Visual Renderer
// ═══════════════════════════════════════════════════════════════════════

function CropVisual({ state, cropId }) {
  if (state === PLOT_STATES.EMPTY) return null

  const stageKey = state === PLOT_STATES.SEEDED ? 'seeded'
    : state === PLOT_STATES.SPROUTING ? 'sprout'
    : state === PLOT_STATES.GROWING ? 'grow'
    : 'ready'

  const shadowKey = `${cropId}_${stageKey}`

  if (!SHADOWS[shadowKey]) return null

  const rows = SPR[shadowKey]
  const cols = Math.max(...rows.map(r => r.length))
  const totalW = cols * PX
  const totalH = rows.length * PX

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'absolute',
        left: `calc(50% - ${totalW / 2}px)`,
        top: `calc(50% - ${totalH / 2}px)`,
        width: PX, height: PX,
        background: 'transparent',
        boxShadow: SHADOWS[shadowKey],
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex: 2,
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// Main FarmScreen Component
// ═══════════════════════════════════════════════════════════════════════

export default function FarmScreen({ navigate }) {
  const state = useGameStore()
  const { selectedCharacter, stars, addXP, addStars } = state
  const character = getCharacter(selectedCharacter || 'owl')
  const accent = companionColor(state) || '#5AA9E6'
  const displayName = companionDisplayName(state)

  // ── Farm plot state ────────────────────────────
  const [plots, setPlots] = useState(() =>
    Array.from({ length: TOTAL_PLOTS }, (_, i) => ({
      id: i,
      state: PLOT_STATES.EMPTY,
      crop: null,
      lastGrow: null,
    }))
  )

  // ── Companion state ────────────────────────────
  const [companionPos, setCompanionPos] = useState({ x: 30, y: 35 })
  const [companionDir, setCompanionDir] = useState(0)
  const [companionAction, setCompanionAction] = useState('idle') // idle | walking | tilling | watering | harvesting
  const [activeEffect, setActiveEffect] = useState(null) // { type, plotIndex }
  const [showFruitPopup, setShowFruitPopup] = useState(null) // cropId
  const busyRef = useRef(false)
  const wanderRef = useRef(null)
  const mountedRef = useRef(true)

  // ── Stats ──────────────────────────────────────
  const [harvested, setHarvested] = useState(0)
  const [showToast, setShowToast] = useState(null)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // ── Plot position helper ───────────────────────
  const getPlotCenter = useCallback((plotIndex) => {
    const row = Math.floor(plotIndex / GRID_COLS)
    const col = plotIndex % GRID_COLS
    const cellW = GRID_RECT.width / GRID_COLS
    const cellH = GRID_RECT.height / GRID_ROWS
    return {
      x: GRID_RECT.left + col * cellW + cellW / 2,
      y: GRID_RECT.top + row * cellH + cellH / 2,
    }
  }, [])

  // ── Toast helper ───────────────────────────────
  const showToastMsg = useCallback((msg) => {
    if (!mountedRef.current) return
    setShowToast(msg)
    setTimeout(() => { if (mountedRef.current) setShowToast(null) }, 1800)
  }, [])

  // ── Companion direction helper ─────────────────
  const calcDirection = useCallback((from, to) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 2 : 3
    return dy > 0 ? 0 : 1
  }, [])

  // ── Idle wander ────────────────────────────────
  useEffect(() => {
    const wander = () => {
      if (busyRef.current || !mountedRef.current) return
      const targetX = 15 + Math.random() * 70
      const targetY = 22 + Math.random() * 28
      const dir = calcDirection(companionPos, { x: targetX, y: targetY })
      setCompanionDir(dir)
      setCompanionAction('walking')
      setCompanionPos({ x: targetX, y: targetY })
      setTimeout(() => {
        if (mountedRef.current && !busyRef.current) setCompanionAction('idle')
      }, 1800)
    }

    wanderRef.current = setInterval(wander, 4000 + Math.random() * 3000)
    return () => clearInterval(wanderRef.current)
  }, [companionPos, calcDirection])

  // ── Auto-growth timer ──────────────────────────
  useEffect(() => {
    const growInterval = setInterval(() => {
      if (!mountedRef.current) return
      setPlots(prev => prev.map(plot => {
        if (plot.state === PLOT_STATES.SEEDED) return { ...plot, state: PLOT_STATES.SPROUTING }
        if (plot.state === PLOT_STATES.SPROUTING) return { ...plot, state: PLOT_STATES.GROWING }
        if (plot.state === PLOT_STATES.GROWING) return { ...plot, state: PLOT_STATES.READY }
        return plot
      }))
    }, GROW_INTERVAL)
    return () => clearInterval(growInterval)
  }, [])

  // ── Plot tap handler ───────────────────────────
  const handlePlotTap = useCallback((plotIndex) => {
    if (busyRef.current) return

    const plot = plots[plotIndex]
    let actionType = null

    if (plot.state === PLOT_STATES.EMPTY) actionType = 'tilling'
    else if (plot.state === PLOT_STATES.READY) actionType = 'harvesting'
    else if (plot.state !== PLOT_STATES.EMPTY) actionType = 'watering'

    if (!actionType) return

    busyRef.current = true

    // 1) Walk companion to plot
    const target = getPlotCenter(plotIndex)
    const dir = calcDirection(companionPos, { x: target.x, y: target.y - 6 })
    setCompanionDir(dir)
    setCompanionAction('walking')
    setCompanionPos({ x: target.x, y: target.y - 6 })

    // 2) After walking, perform action
    setTimeout(() => {
      if (!mountedRef.current) { busyRef.current = false; return }
      setCompanionAction(actionType)
      setActiveEffect({ type: actionType, plotIndex })

      // 3) After action animation, apply game logic
      setTimeout(() => {
        if (!mountedRef.current) { busyRef.current = false; return }

        setPlots(prev => {
          const newPlots = [...prev]
          const p = newPlots[plotIndex]

          if (actionType === 'tilling') {
            const crop = CROPS[Math.floor(Math.random() * CROPS.length)]
            newPlots[plotIndex] = { ...p, state: PLOT_STATES.SEEDED, crop }
            showToastMsg('Planted ' + crop.name + '!')
          } else if (actionType === 'watering') {
            if (p.state === PLOT_STATES.SEEDED) {
              newPlots[plotIndex] = { ...p, state: PLOT_STATES.SPROUTING }
              showToastMsg('Watered! Growing...')
            } else if (p.state === PLOT_STATES.SPROUTING) {
              newPlots[plotIndex] = { ...p, state: PLOT_STATES.GROWING }
              showToastMsg('Watered! Getting bigger...')
            } else if (p.state === PLOT_STATES.GROWING) {
              newPlots[plotIndex] = { ...p, state: PLOT_STATES.READY }
              showToastMsg('Watered! Ready to harvest!')
            }
          } else if (actionType === 'harvesting') {
            const cropName = p.crop?.name || 'crop'
            newPlots[plotIndex] = { ...p, state: PLOT_STATES.EMPTY, crop: null }
            setHarvested(h => h + 1)
            addXP(10)
            addStars(1)
            showToastMsg('Harvested ' + cropName + '! +10 XP')
            setShowFruitPopup(p.crop?.id)
            setTimeout(() => { if (mountedRef.current) setShowFruitPopup(null) }, 1000)
          }

          return newPlots
        })

        setActiveEffect(null)
        setCompanionAction('idle')
        busyRef.current = false
      }, 800)
    }, 1400)
  }, [plots, companionPos, getPlotCenter, calcDirection, addXP, addStars, showToastMsg])

  // ── Computed stats ─────────────────────────────
  const plantedCount = plots.filter(p => p.state !== PLOT_STATES.EMPTY).length
  const readyCount = plots.filter(p => p.state === PLOT_STATES.READY).length

  // ── Render ─────────────────────────────────────
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', background: '#3a6b40',
    }}>

      {/* ═══════ Header (glass morphism) ═══════ */}
      <div style={{
        padding: '0.6rem 1rem 0.4rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        zIndex: 100,
      }}>
        <motion.button onClick={() => navigate('home')} whileTap={{ scale: 0.9 }}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.06)',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
          <BackArrowIcon size={16} color="#2E7D32" />
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.15rem',
            color: '#1B5E20', margin: 0, lineHeight: 1.1,
          }}>
            {displayName}'s Farm
          </h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem',
            color: '#4CAF50', margin: 0, fontWeight: 700,
          }}>Tend your garden</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(255,255,255,0.85)', borderRadius: 9999,
          padding: '5px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <StarIcon size={14} color="#FBBF24" />
          <span style={{
            fontFamily: "'Baloo 2', cursive", fontWeight: 800,
            fontSize: '0.85rem', color: '#1F2937',
          }}>{stars}</span>
        </div>
      </div>

      {/* ═══════ Stats bar ═══════ */}
      <div style={{
        padding: '0.5rem 0.75rem', display: 'flex', gap: 6,
        flexShrink: 0, zIndex: 100,
      }}>
        {[
          { icon: 'seed_icon', label: 'Planted', value: plantedCount, color: '#2E7D32' },
          { icon: 'basket_icon', label: 'Harvested', value: harvested, color: '#C62828' },
          { icon: 'sparkle_icon', label: 'Ready', value: readyCount, color: '#F57F17' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 14, padding: '7px 9px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <PixelIcon shadowKey={s.icon} size={16} />
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: '0.55rem',
                fontWeight: 700, color: '#9CA3AF', margin: 0, whiteSpace: 'nowrap',
              }}>{s.label}</p>
              <p style={{
                fontFamily: "'Baloo 2', cursive", fontSize: '0.9rem',
                fontWeight: 800, color: s.color, margin: 0, lineHeight: 1,
              }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════ Farm Scene ═══════ */}
      <div style={{
        flex: 1, position: 'relative', margin: '0 10px 10px', borderRadius: 22,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        border: '2px solid rgba(0,0,0,0.08)',
        minHeight: 0,
      }}>

        {/* ── Sky gradient ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '25%',
          background: 'linear-gradient(180deg, #87ceeb 0%, #a0d8ef 50%, #b8e8f9 80%, rgba(184,232,249,0) 100%)',
          zIndex: 0,
        }} />

        {/* ── Water border ── */}
        <div style={{
          position: 'absolute', inset: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}>
          {/* Water pattern */}
          <motion.div
            animate={{ backgroundPositionX: ['0px', '48px'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 0,
              background: `
                repeating-linear-gradient(
                  90deg,
                  #5bb8e0 0px, #5bb8e0 24px,
                  #4aa0d0 24px, #4aa0d0 48px
                )
              `,
              backgroundSize: '48px 12px',
              opacity: 0.35,
            }}
          />
        </div>

        {/* ── Grass island ── */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '14%', left: '3%', right: '3%', bottom: '3%',
            backgroundImage: 'url(/assets/farm/grass.png)',
            backgroundSize: '48px 48px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
            borderRadius: '28% 32% 24% 28% / 18% 22% 14% 18%',
            zIndex: 1,
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.08), 0 0 0 4px rgba(90,168,48,0.3)',
          }}
        >
          {/* Grass texture overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(126,200,80,0.3) 0%, transparent 40%),
              radial-gradient(circle at 70% 60%, rgba(90,168,48,0.2) 0%, transparent 35%),
              radial-gradient(circle at 50% 80%, rgba(126,200,80,0.25) 0%, transparent 30%)
            `,
            borderRadius: 'inherit',
            pointerEvents: 'none',
          }} />

          {/* ── Paths ── */}
          {/* Horizontal path from house to garden */}
          <div style={{
            position: 'absolute', top: '44%', left: '22%', right: '25%',
            height: 20,
            backgroundImage: 'url(/assets/farm/paths.png)',
            backgroundSize: '48px 48px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
            borderRadius: 4, zIndex: 2,
            opacity: 0.85,
          }} />
          {/* Vertical path down to garden */}
          <div style={{
            position: 'absolute', top: '44%', left: '44%',
            width: 20, height: '16%',
            backgroundImage: 'url(/assets/farm/paths.png)',
            backgroundSize: '48px 48px',
            backgroundRepeat: 'repeat',
            imageRendering: 'pixelated',
            borderRadius: 4, zIndex: 2,
            opacity: 0.85,
          }} />

          {/* ── House ── */}
          <House left="12%" top="18%" />

          {/* ── Trees ── */}
          <Tree left="2%" top="25%" size={1.1} fruitColor="#ef4444" />
          <Tree left="78%" top="20%" size={0.9} fruitColor="#fbbf24" />
          <Tree left="88%" top="40%" size={1.0} fruitColor="#ef4444" />
          <Tree left="5%" top="60%" size={0.8} fruitColor="#fb923c" />
          <Tree left="82%" top="65%" size={0.7} fruitColor="#fbbf24" />

          {/* ── Fences ── */}
          <FenceSegment left="14%" top="50%" width="72%" />
          <FenceSegment left="14%" top="90%" width="72%" />
          {/* Left fence */}
          <div style={{
            position: 'absolute', left: '14%', top: '50%', bottom: '10%',
            width: 5, pointerEvents: 'none', zIndex: 4,
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 4,
              background: 'linear-gradient(90deg, #a07828, #c4a060, #a07828)',
              borderRadius: '2px',
            }} />
          </div>
          {/* Right fence */}
          <div style={{
            position: 'absolute', right: '14%', top: '50%', bottom: '10%',
            width: 5, pointerEvents: 'none', zIndex: 4,
          }}>
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0,
              width: 4,
              background: 'linear-gradient(90deg, #a07828, #c4a060, #a07828)',
              borderRadius: '2px',
            }} />
          </div>

          {/* ── Farm plots (3x3 grid) ── */}
          <div style={{
            position: 'absolute',
            top: `${GRID_RECT.top}%`, left: `${GRID_RECT.left}%`,
            width: `${GRID_RECT.width}%`, height: `${GRID_RECT.height}%`,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 5,
            zIndex: 6,
          }}>
            {plots.map((plot, i) => {
              const isReady = plot.state === PLOT_STATES.READY
              const isEmpty = plot.state === PLOT_STATES.EMPTY
              const isPlanted = !isEmpty

              return (
                <motion.button
                  key={plot.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlotTap(i)}
                  style={{
                    position: 'relative',
                    border: 'none', cursor: 'pointer',
                    borderRadius: 5,
                    overflow: 'hidden',
                    padding: 0,
                    imageRendering: 'pixelated',
                    background: isEmpty
                      ? 'linear-gradient(135deg, #7ec850 0%, #6ab840 50%, #5aa830 100%)'
                      : 'linear-gradient(135deg, #c4a060 0%, #b09050 50%, #a08040 100%)',
                    boxShadow: isReady
                      ? '0 0 12px rgba(251,191,36,0.5), inset 0 0 6px rgba(251,191,36,0.2)'
                      : isEmpty
                        ? 'inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.1)'
                        : 'inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Tilled dirt texture */}
                  {!isEmpty && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: 'url(/assets/farm/tilled_dirt.png)',
                      backgroundSize: '48px 48px',
                      backgroundRepeat: 'repeat',
                      imageRendering: 'pixelated',
                      opacity: 0.3,
                    }} />
                  )}

                  {/* Soil lines for tilled plots */}
                  {!isEmpty && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      {[0.25, 0.5, 0.75].map(pct => (
                        <div key={pct} style={{
                          position: 'absolute',
                          left: '10%', right: '10%',
                          top: `${pct * 100}%`,
                          height: 1,
                          background: 'rgba(0,0,0,0.12)',
                        }} />
                      ))}
                    </div>
                  )}

                  {/* Empty plot — grass highlight */}
                  {isEmpty && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)',
                      pointerEvents: 'none',
                    }} />
                  )}

                  {/* Crop visual */}
                  <CropVisual state={plot.state} cropId={plot.crop?.id || 'tomato'} />

                  {/* Ready glow */}
                  {isReady && (
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
                        pointerEvents: 'none', zIndex: 3,
                      }}
                    />
                  )}

                  {/* Growth progress bar */}
                  {isPlanted && !isReady && (
                    <div style={{
                      position: 'absolute', bottom: 3, left: '15%', right: '15%',
                      height: 3, background: 'rgba(0,0,0,0.25)', borderRadius: 2,
                      zIndex: 5,
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: plot.state === PLOT_STATES.SEEDED ? '33%' : plot.state === PLOT_STATES.SPROUTING ? '66%' : '100%' }}
                        transition={{ duration: 0.5 }}
                        style={{
                          height: '100%', borderRadius: 2,
                          background: 'linear-gradient(90deg, #81C784, #4CAF50)',
                        }}
                      />
                    </div>
                  )}

                  {/* Action effects */}
                  {activeEffect?.plotIndex === i && activeEffect.type === 'tilling' && <DirtParticles />}
                  {activeEffect?.plotIndex === i && activeEffect.type === 'watering' && <WaterDrops />}
                  {activeEffect?.plotIndex === i && activeEffect.type === 'harvesting' && <HarvestSparkles />}
                  {activeEffect?.plotIndex === i && activeEffect.type === 'tilling' && <SeedDrops />}

                  {/* Harvest fruit popup */}
                  {showFruitPopup && activeEffect?.plotIndex === i && (
                    <HarvestFruitPopup cropId={showFruitPopup} />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* ── Decorations ── */}
          {/* Rocks */}
          <PixelSprite shadowKey="rock" style={{ left: '8%', top: '52%', zIndex: 3 }} />
          <PixelSprite shadowKey="rock" style={{ left: '75%', top: '85%', zIndex: 3 }} />

          {/* Mushrooms */}
          <PixelSprite shadowKey="mushroom" style={{ left: '6%', top: '72%', zIndex: 3 }} />
          <PixelSprite shadowKey="mushroom" style={{ left: '90%', top: '55%', zIndex: 3 }} />

          {/* Wild flowers */}
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: '22%', top: '52%', zIndex: 3, pointerEvents: 'none' }}
          >
            <PixelSprite shadowKey="wildflower_p" style={{ position: 'relative', left: 0, top: 0 }} />
          </motion.div>
          <motion.div
            animate={{ rotate: [-2, 4, -2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ position: 'absolute', left: '85%', top: '80%', zIndex: 3, pointerEvents: 'none' }}
          >
            <PixelSprite shadowKey="wildflower_y" style={{ position: 'relative', left: 0, top: 0 }} />
          </motion.div>
          <motion.div
            animate={{ rotate: [-4, 2, -4] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', left: '30%', top: '88%', zIndex: 3, pointerEvents: 'none' }}
          >
            <PixelSprite shadowKey="wildflower_v" style={{ position: 'relative', left: 0, top: 0 }} />
          </motion.div>
          <motion.div
            animate={{ rotate: [-2, 3, -2] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{ position: 'absolute', left: '68%', top: '52%', zIndex: 3, pointerEvents: 'none' }}
          >
            <PixelSprite shadowKey="wildflower_p" style={{ position: 'relative', left: 0, top: 0 }} />
          </motion.div>

          {/* Stump */}
          <PixelSprite shadowKey="stump" style={{ left: '90%', top: '75%', zIndex: 3 }} />

          {/* ── Butterflies ── */}
          <Butterfly left="25%" top="30%" color="#FFB6C1" delay={0} />
          <Butterfly left="60%" top="25%" color="#87CEEB" delay={1} />
          <Butterfly left="45%" top="68%" color="#DDA0DD" delay={2} />
          <Butterfly left="75%" top="45%" color="#FFD700" delay={3} />

          {/* ── Companion ── */}
          <motion.div
            animate={{ left: `${companionPos.x}%`, top: `${companionPos.y}%` }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -100%)',
              zIndex: 20, pointerEvents: 'none',
            }}
          >
            {/* Shadow */}
            <motion.div
              animate={{ scale: companionAction === 'walking' ? [1, 0.85, 1] : 1 }}
              transition={{ duration: 0.3, repeat: companionAction === 'walking' ? Infinity : 0 }}
              style={{
                position: 'absolute', bottom: -6, left: '50%',
                transform: 'translateX(-50%)',
                width: 32, height: 10, borderRadius: '50%',
                background: 'rgba(0,0,0,0.15)',
                filter: 'blur(3px)',
              }}
            />
            {/* Companion body */}
            <motion.div
              animate={
                companionAction === 'walking'
                  ? { y: [0, -4, 0] }
                  : companionAction === 'tilling'
                    ? { y: [0, -2, 0, -6, 0], rotate: [0, -5, 0, 5, 0] }
                    : companionAction === 'watering'
                      ? { y: [0, -3, 0], rotate: [0, 8, 0] }
                      : companionAction === 'harvesting'
                        ? { y: [0, -8, 0], scale: [1, 1.05, 1] }
                        : { y: [0, -2, 0] }
              }
              transition={{
                duration: companionAction === 'idle' ? 2 : 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
                border: `3px solid ${accent}`,
                boxShadow: `0 4px 12px ${accent}40`,
                background: 'white',
              }}>
                <AnimatedCompanion
                  character={character}
                  size={48}
                  animation={companionAction === 'walking' ? 'walk' : 'idle'}
                  direction={companionDir}
                  fps={6}
                />
              </div>
            </motion.div>

            {/* Action indicator */}
            {companionAction === 'watering' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute', top: -16, left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                }}
              >
                <svg viewBox="0 0 12 16" width="12" height="16">
                  <path d="M6 0 L10 8 Q10 14 6 14 Q2 14 2 8 Z" fill="#60a5fa" opacity="0.8" />
                </svg>
              </motion.div>
            )}
            {companionAction === 'tilling' && (
              <motion.div
                animate={{ rotate: [0, -30, 30, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                style={{
                  position: 'absolute', top: 5, right: -12,
                  width: 3, height: 18,
                  background: '#8b6914',
                  borderRadius: '1px 1px 0 0',
                  transformOrigin: 'bottom center',
                }}
              />
            )}
          </motion.div>

          {/* ── Companion accent glow ── */}
          <motion.div
            animate={{
              left: `${companionPos.x}%`,
              top: `${companionPos.y}%`,
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ left: { duration: 1.4 }, top: { duration: 1.4 }, opacity: { duration: 2, repeat: Infinity } }}
            style={{
              position: 'absolute',
              width: 60, height: 60,
              borderRadius: '50%',
              background: accent,
              filter: 'blur(20px)',
              transform: 'translate(-50%, -50%)',
              zIndex: 19, pointerEvents: 'none',
            }}
          />

          {/* ── Clouds ── */}
          <Cloud left="5%" top="0%" delay={0} size={50} />
          <Cloud left="40%" top="2%" delay={2} size={65} />
          <Cloud left="72%" top="1%" delay={4} size={45} />

          {/* ── Toast notification ── */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute', top: '6%', left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 50,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: '#1B5E20',
                  borderRadius: 9999,
                  padding: '7px 18px',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                {showToast}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ═══════ Bottom instruction bar ═══════ */}
      <div style={{
        padding: '0.55rem 1rem',
        flexShrink: 0,
        background: 'rgba(255,253,245,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        zIndex: 100,
      }}>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#2E7D32',
          margin: 0,
          textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <svg viewBox="0 0 12 12" width="10" height="10">
              <rect x="2" y="2" width="8" height="8" rx="1" fill="#a08040" />
              <circle cx="5" cy="5" r="1" fill="#92735a" />
              <circle cx="8" cy="7" r="1" fill="#92735a" />
            </svg>
            Tap empty to plant
          </span>
          <span style={{ color: '#9CA3AF' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <svg viewBox="0 0 12 12" width="10" height="10">
              <path d="M6 1 L8 6 Q8 10 6 10 Q4 10 4 6 Z" fill="#60a5fa" />
            </svg>
            Tap planted to water
          </span>
          <span style={{ color: '#9CA3AF' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <svg viewBox="0 0 12 12" width="10" height="10">
              <circle cx="6" cy="5" r="4" fill="#fbbf24" />
              <path d="M6 1 L7 4 L10 4 L7.5 6 L8.5 9 L6 7 L3.5 9 L4.5 6 L2 4 L5 4 Z" fill="#f59e0b" />
            </svg>
            Tap glowing to harvest
          </span>
        </p>
      </div>
    </div>
  )
}
