// Shared decorative art to give the app the soft, dreamy, illustrated look:
// a pastel gradient background with sparkles + glowing blobs, illustrated feature
// icons, and illustrated badge medallions.

const SPARKLES = [
  { x: 8, y: 10, s: 9 }, { x: 86, y: 7, s: 12 }, { x: 22, y: 26, s: 7 },
  { x: 92, y: 30, s: 8 }, { x: 5, y: 48, s: 8 }, { x: 78, y: 52, s: 10 },
  { x: 40, y: 6, s: 6 }, { x: 60, y: 16, s: 7 }, { x: 15, y: 70, s: 7 },
  { x: 90, y: 74, s: 9 }, { x: 50, y: 84, s: 6 }, { x: 30, y: 92, s: 8 },
]

function Sparkle({ x, y, s, color, i }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24"
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, animation: `twinkle ${2.4 + (i % 4) * 0.7}s ease-in-out ${(i % 5) * 0.5}s infinite` }}>
      <path d="M12 0l2.4 7.2L22 9.6l-6.4 4.6L18 22l-6-4.2L6 22l2.4-7.8L2 9.6l7.6-2.4z" fill={color || 'rgba(251,191,36,0.9)'} />
    </svg>
  )
}

const PALETTES = {
  lavender: { grad: 'linear-gradient(180deg,#ECE6FB 0%,#F3E9FA 42%,#FCEAF2 100%)', blobs: ['rgba(167,139,250,0.30)', 'rgba(244,114,182,0.22)', 'rgba(96,165,250,0.20)'] },
  mint: { grad: 'linear-gradient(180deg,#E4F7EE 0%,#EAF6F1 45%,#F3F1FB 100%)', blobs: ['rgba(52,211,153,0.28)', 'rgba(96,165,250,0.18)', 'rgba(167,139,250,0.20)'] },
  night: { grad: 'linear-gradient(180deg,#2A2350 0%,#3B2E6B 50%,#4A2E6B 100%)', blobs: ['rgba(167,139,250,0.35)', 'rgba(236,72,153,0.22)', 'rgba(59,130,246,0.22)'], dark: true },
}

// Full-bleed decorative background. Place as the first child of a position:relative
// screen container; render the real content in a sibling with a higher z-index.
export function DreamyBackground({ variant = 'lavender', hills = true }) {
  const p = PALETTES[variant] || PALETTES.lavender
  const hillTint = variant === 'mint' ? '#9BE3C0' : variant === 'night' ? '#4C3A82' : '#D9C7F5'
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: p.grad, zIndex: 0 }}>
      {/* moon / sun glow */}
      <div style={{ position: 'absolute', top: '-8%', left: '50%', transform: 'translateX(-50%)', width: '62%', height: '30%', borderRadius: '50%', background: p.dark ? 'radial-gradient(circle, rgba(255,255,255,0.28), transparent 68%)' : 'radial-gradient(circle, rgba(255,255,255,0.6), transparent 68%)', filter: 'blur(10px)' }} />
      {/* colored aura blobs */}
      <div style={{ position: 'absolute', top: '-12%', left: '-15%', width: '55%', height: '35%', borderRadius: '50%', background: p.blobs[0], filter: 'blur(48px)' }} />
      <div style={{ position: 'absolute', top: '18%', right: '-18%', width: '55%', height: '32%', borderRadius: '50%', background: p.blobs[1], filter: 'blur(52px)' }} />
      <div style={{ position: 'absolute', bottom: '-6%', left: '10%', width: '60%', height: '30%', borderRadius: '50%', background: p.blobs[2], filter: 'blur(56px)' }} />
      {SPARKLES.map((sp, i) => (
        <Sparkle key={i} {...sp} i={i} color={p.dark ? 'rgba(255,255,255,0.85)' : undefined} />
      ))}
      {/* soft rolling hills at the bottom for storybook depth */}
      {hills && (
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '120px' }}>
          <path d="M0 70 Q 80 30 160 62 T 320 55 T 480 68 V120 H0 Z" fill={hillTint} opacity="0.35" />
          <path d="M0 90 Q 100 55 210 82 T 400 80 V120 H0 Z" fill={hillTint} opacity="0.5" />
        </svg>
      )}
    </div>
  )
}

// ---- Illustrated feature icons (Home tiles) ----
export function FeatureIcon({ type, size = 52 }) {
  const common = { width: size, height: size, viewBox: '0 0 64 64' }
  if (type === 'story') {
    return (
      <svg {...common}>
        <ellipse cx="32" cy="52" rx="22" ry="4" fill="rgba(0,0,0,0.08)" />
        <path d="M32 20c-7-5-15-4-20-2v30c5-2 13-3 20 2z" fill="#F5EEDD" />
        <path d="M32 20c7-5 15-4 20-2v30c-5-2-13-3-20 2z" fill="#FBF6EA" />
        <path d="M12 18c5-2 13-3 20 2v30c-7-5-15-4-20-2z" fill="#8B5CF6" />
        <path d="M52 18c-5-2-13-3-20 2v30c7-5 15-4 20-2z" fill="#7C3AED" />
        <path d="M32 22v30" stroke="#6D28D9" strokeWidth="1.5" />
        <path d="M17 24c3-1 7-1 10 1M17 30c3-1 7-1 10 1M37 25c3-2 7-2 10-1M37 31c3-2 7-2 10-1" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M32 4l2.6 6.2L41 12l-6.4 4L36 22l-4-3.4L28 22l1.4-6L23 12l6.4-1.8z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5" />
      </svg>
    )
  }
  if (type === 'mission') {
    return (
      <svg {...common}>
        <ellipse cx="32" cy="54" rx="22" ry="4" fill="rgba(0,0,0,0.08)" />
        <path d="M10 16l14-4 16 4 14-4v36l-14 4-16-4-14 4z" fill="#EAD9A6" />
        <path d="M24 12v36M40 16v36" stroke="#C9B478" strokeWidth="1.4" />
        <path d="M16 34c4-6 10-6 14-2s10 2 16-4" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <circle cx="16" cy="34" r="2.6" fill="#10B981" />
        <path d="M45 22l3-6 3 6z" fill="#EF4444" />
        <path d="M48 16v10" stroke="#7A4E26" strokeWidth="1.5" />
        <path d="M44 44l4 4M48 44l-4 4" stroke="#EF4444" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    )
  }
  // house
  return (
    <svg {...common}>
      <ellipse cx="32" cy="54" rx="20" ry="4" fill="rgba(0,0,0,0.08)" />
      <path d="M32 10L10 28h6v22h32V28h6z" fill="#8B6FC9" />
      <path d="M16 28h32v22H16z" fill="#F1DBB6" />
      <path d="M32 10L10 28h44z" fill="#9A82DE" />
      <rect x="27" y="36" width="10" height="14" rx="2" fill="#B5793D" />
      <circle cx="35" cy="43" r="1" fill="#F5E6D0" />
      <rect x="19" y="33" width="7" height="7" rx="1.5" fill="#BFE3FF" stroke="#fff" strokeWidth="1.2" />
      <rect x="38" y="33" width="7" height="7" rx="1.5" fill="#BFE3FF" stroke="#fff" strokeWidth="1.2" />
      <circle cx="32" cy="21" r="3" fill="#FDE68A" stroke="#fff" strokeWidth="1.2" />
    </svg>
  )
}

// ---- Illustrated badge medallions ----
const BADGE_COLORS = {
  heart: ['#F472B6', '#EC4899'], compass: ['#A78BFA', '#7C3AED'], tree: ['#34D399', '#10B981'],
  lantern: ['#FBBF24', '#F59E0B'], star: ['#60A5FA', '#3B82F6'], shield: ['#818CF8', '#6366F1'],
}
export function BadgeArt({ type = 'star', size = 44 }) {
  const [c1, c2] = BADGE_COLORS[type] || BADGE_COLORS.star
  const emblem = () => {
    switch (type) {
      case 'heart': return <path d="M32 42c-8-5-12-10-12-15a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 5-4 10-12 15z" fill="#fff" />
      case 'compass': return <g><circle cx="32" cy="30" r="11" fill="none" stroke="#fff" strokeWidth="2.5" /><path d="M37 25l-3 8-8 3 3-8z" fill="#fff" /></g>
      case 'tree': return <g><path d="M32 16l9 12H23zM32 24l7 10H25z" fill="#fff" /><rect x="30" y="34" width="4" height="8" rx="1" fill="#fff" /></g>
      case 'lantern': return <g><rect x="26" y="20" width="12" height="18" rx="3" fill="#fff" /><rect x="29" y="24" width="6" height="10" rx="2" fill={c2} /><path d="M28 18h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></g>
      default: return <path d="M32 16l4.5 9.2 10.2 1.5-7.4 7.2 1.8 10.1L32 39.4l-9.1 4.6 1.8-10.1-7.4-7.2 10.2-1.5z" fill="#fff" />
    }
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.18))' }}>
      <circle cx="32" cy="30" r="26" fill={c1} />
      <circle cx="32" cy="30" r="26" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.85" />
      <circle cx="32" cy="30" r="20" fill={c2} />
      <ellipse cx="25" cy="19" rx="12" ry="6.5" fill="rgba(255,255,255,0.3)" />
      {emblem()}
      <path d="M20 50l4 12 8-6 8 6 4-12z" fill={c2} opacity="0.9" />
    </svg>
  )
}
