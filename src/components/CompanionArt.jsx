// Renders a companion's avatar (painted PNG) inside an accent-colored ring, with
// an optional cosmetic hat drawn on top. Scales to any `size`.
import { getCharacter } from '../data/characters'

// Hats are drawn in a 0..100 box and overlaid on the upper portion of the avatar.
function HatArt({ hat, size }) {
  if (!hat || hat === 'none') return null
  const common = { width: size, height: size, viewBox: '0 0 100 100', style: { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' } }
  switch (hat) {
    case 'party':
      return (
        <svg {...common}>
          <path d="M50 2 L64 34 L36 34 Z" fill="#F472B6" />
          <path d="M50 2 L58 20 L42 20 Z" fill="#FBCFE8" opacity="0.7" />
          <path d="M43 27 h14 M40 20 h6 M54 20 h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="50" cy="2" r="4.5" fill="#FBBF24" />
        </svg>
      )
    case 'flower':
      return (
        <svg {...common}>
          <path d="M22 26 q28 -12 56 0" fill="none" stroke="#34A96E" strokeWidth="5" strokeLinecap="round" />
          {[26, 40, 54, 68].map((x, i) => (
            <g key={i} transform={`translate(${x} ${21 + (i % 2) * 3})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-4" rx="2.6" ry="4" fill={['#F9A8D4', '#FDE68A', '#C4B5FD', '#FCA5A5'][i]} transform={`rotate(${a})`} />
              ))}
              <circle cx="0" cy="0" r="2.2" fill="#FBBF24" />
            </g>
          ))}
        </svg>
      )
    case 'wizard':
      return (
        <svg {...common}>
          <path d="M50 -2 C 54 12 60 24 70 34 L30 34 C40 24 46 12 50 -2 Z" fill="#7C3AED" />
          <path d="M50 -2 C52 8 54 16 58 24 L44 24 C47 14 48 6 50 -2Z" fill="#9A82DE" opacity="0.6" />
          <path d="M26 33 h48 a3 3 0 0 1 0 6 H26 a3 3 0 0 1 0 -6z" fill="#6D28D9" />
          <path d="M46 12 l1.6 3.4 3.6 .4 -2.7 2.5 .7 3.6 -3.2 -1.8 -3.2 1.8 .7 -3.6 -2.7 -2.5 3.6 -.4z" fill="#FBBF24" />
        </svg>
      )
    case 'crown':
      return (
        <svg {...common}>
          <path d="M28 34 L28 16 L40 26 L50 10 L60 26 L72 16 L72 34 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="27" y="33" width="46" height="6" rx="2" fill="#F59E0B" />
          <circle cx="40" cy="24" r="2.4" fill="#EF6F6F" />
          <circle cx="50" cy="18" r="2.6" fill="#EC4899" />
          <circle cx="60" cy="24" r="2.4" fill="#6FA8EF" />
        </svg>
      )
    default:
      return null
  }
}

export function CompanionAvatar({ character, size = 72, color, hat = 'none', ring = true, float = false }) {
  const c = typeof character === 'string' ? getCharacter(character) : character
  const accent = color || c.color
  return (
    <div style={{ position: 'relative', width: size, height: size, ...(float ? { animation: 'float 3s ease-in-out infinite' } : {}) }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
        border: ring ? `3px solid ${accent}` : 'none',
        boxShadow: ring ? `0 6px 18px ${accent}45` : 'none', background: 'white',
      }}>
        <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      {/* hat sits above the head */}
      <div style={{ position: 'absolute', top: `${-size * 0.16}px`, left: 0, width: size, height: size }}>
        <HatArt hat={hat} size={size} />
      </div>
    </div>
  )
}
