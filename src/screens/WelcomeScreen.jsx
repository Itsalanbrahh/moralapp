import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { SparkleIcon } from '../components/SVGIcons'

function CastleSilhouette() {
  return (
    <svg viewBox="0 0 400 200" fill="none" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 'auto', opacity: 0.06 }}>
      <path d="M0 200V140h30v-20h20v20h40V100h20v40h30v-30h20v30h40V80h20v60h30v-20h20v20h40V110h20v30h30v-40h20v40h30V200H0z" fill="currentColor" />
    </svg>
  )
}

function FloatingStar({ x, y, size, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y }}
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1, 0.8], rotate: [0, 180, 360] }}
      transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <SparkleIcon size={size} color="rgba(255,200,0,0.5)" />
    </motion.div>
  )
}

export default function WelcomeScreen({ navigate }) {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)

  const handleGetStarted = () => {
    navigate(isLoggedIn ? 'home' : 'login')
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E8D5F5 0%, #F5D5C8 50%, #FCE7F3 100%)' }}>

      {/* Floating stars */}
      <FloatingStar x="10%" y="15%" size={12} delay={0} />
      <FloatingStar x="85%" y="20%" size={8} delay={0.5} />
      <FloatingStar x="15%" y="70%" size={10} delay={1} />
      <FloatingStar x="80%" y="65%" size={14} delay={1.5} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', zIndex: 1, marginBottom: '1rem' }}
      >
        <h1 style={{
          fontFamily: "'Baloo 2', cursive", fontSize: '3rem', fontWeight: 800,
          color: '#8B5CF6', margin: 0, letterSpacing: '-0.02em',
          textShadow: '0 2px 0 white, 0 4px 12px rgba(139,92,246,0.3)',
        }}>
          Moral
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '1rem', color: '#4A5568',
          margin: '0.25rem 0 0', fontWeight: 600,
        }}>
          Stories that help kids grow.
        </p>
      </motion.div>

      {/* Companion preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ display: 'flex', gap: '12px', marginBottom: '2rem', zIndex: 1 }}
      >
        {['owl', 'bear', 'bunny', 'cat'].map((id, i) => (
          <motion.div
            key={id}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 56, height: 56, borderRadius: 16, overflow: 'hidden',
              background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255,255,255,0.8)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              imageRendering: 'pixelated',
            }}
          >
            <img
              src={`/assets/characters/${id}.png`}
              alt={id}
              style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Get Started button */}
      <motion.button
        onClick={handleGetStarted}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileTap={{ scale: 0.96 }}
        style={{
          padding: '14px 48px', borderRadius: 20,
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 0 #7C3AED, 0 8px 24px rgba(139,92,246,0.3)',
          zIndex: 1,
        }}
      >
        <span style={{
          fontFamily: "'Baloo 2', cursive", fontSize: '1.1rem', fontWeight: 700,
          color: 'white', letterSpacing: '0.02em',
        }}>
          Get Started
        </span>
      </motion.button>

      {/* Footer */}
      <p style={{
        position: 'absolute', bottom: '2rem',
        fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem',
        color: '#9CA3AF', zIndex: 1,
      }}>
        For kids ages 4-10. Safe and private.
      </p>

      <CastleSilhouette />
    </div>
  )
}
