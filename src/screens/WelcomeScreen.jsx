import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'
import { StarIcon, ChevronRightIcon, SparkleIcon } from '../components/SVGIcons'

const guides = [
  { id: 'owl', name: 'Owl', subtitle: 'wise storyteller', image: '/assets/characters/owl.png', gradient: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', textColor: '#1E3A5F' },
  { id: 'bear', name: 'Bear', subtitle: 'warm adventure guide', image: '/assets/characters/bear.png', gradient: 'linear-gradient(135deg, #F59E0B, #F97316)', textColor: '#7C4A1A' },
  { id: 'bunny', name: 'Bunny', subtitle: 'playful quiz buddy', image: '/assets/characters/bunny.png', gradient: 'linear-gradient(135deg, #EC4899, #FBCFE8)', textColor: '#831843' },
]

function CastleSilhouette() {
  return (
    <svg viewBox="0 0 400 200" fill="none" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 'auto', opacity: 0.06 }}>
      <path d="M0 200V140h30v-20h20v20h40V100h20v40h30v-30h20v30h40V80h20v60h30v-20h20v20h40V110h20v30h30v-40h20v40h30V200H0z" fill="currentColor" />
      <rect x="50" y="90" width="15" height="25" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="90" y="85" width="12" height="20" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="150" y="70" width="15" height="30" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="220" y="75" width="12" height="25" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="300" y="100" width="15" height="20" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="350" y="95" width="12" height="25" rx="2" fill="rgba(255,255,255,0.3)" />
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
  const isOnboarded = useGameStore(s => s.isOnboarded)
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)

  const handleContinue = () => {
    if (!isLoggedIn) {
      navigate('login')
    } else if (isOnboarded) {
      navigate('home')
    } else {
      navigate('characterSelect')
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center px-5 py-10 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #E8D5F5 0%, #F5D5C8 100%)',
        position: 'relative',
      }}>

      <CastleSilhouette />

      <FloatingStar x="8%" y="12%" size={10} delay={0} />
      <FloatingStar x="85%" y="8%" size={12} delay={0.5} />
      <FloatingStar x="15%" y="35%" size={8} delay={1} />
      <FloatingStar x="90%" y="30%" size={10} delay={1.5} />
      <FloatingStar x="5%" y="55%" size={9} delay={0.8} />
      <FloatingStar x="92%" y="50%" size={11} delay={1.2} />

      {/* Logo */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10 mt-4 mb-2"
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <h1 style={{
            fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '3.4rem',
            lineHeight: 0.92, margin: 0, letterSpacing: '-0.5px',
            textShadow: '0 3px 0 rgba(255,255,255,0.65), 0 8px 18px rgba(124,58,237,0.22)',
          }}>
            <span style={{ display: 'block', color: '#7C3AED' }}>Build</span>
            <span style={{ display: 'block', color: '#3B82F6' }}>Moral</span>
          </h1>
          <motion.div
            style={{ position: 'absolute', top: '-10px', right: '-14px' }}
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <StarIcon size={28} color="#FBBF24" />
          </motion.div>
        </div>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', fontWeight: 600,
          color: '#5B4B7A', margin: '10px 0 0',
        }}>
          Stories that help kids grow.
        </p>
      </motion.div>

      {/* Choose your guide section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-center mb-4 mt-4"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <StarIcon size={12} color="#FBBF24" />
          <span style={{
            fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem',
            color: '#4A5568',
          }}>
            Choose your guide
          </span>
          <StarIcon size={12} color="#FBBF24" />
        </div>
      </motion.div>

      {/* Character cards */}
      <div className="flex flex-col gap-3 w-full max-w-sm relative z-10 mb-6">
        {guides.map((guide, i) => (
          <motion.button
            key={guide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200 }}
            onClick={() => handleContinue()}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {/* Gradient section with character */}
            <div style={{
              width: '90px',
              height: '90px',
              background: guide.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRadius: '30px 0 0 30px',
            }}>
              <motion.img
                src={guide.image}
                alt={guide.name}
                style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              />
            </div>

            {/* Text section */}
            <div style={{ flex: 1, padding: '0.75rem 0.75rem 0.75rem 1rem' }}>
              <p style={{
                fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem',
                color: guide.textColor, margin: 0, lineHeight: 1.2,
              }}>
                {guide.name}
              </p>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem',
                color: '#6B7280', margin: 0,
              }}>
                {guide.subtitle}
              </p>
            </div>

            {/* Arrow */}
            <div style={{ paddingRight: '1rem', flexShrink: 0 }}>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem',
          color: '#9CA3AF', textAlign: 'center', position: 'relative', zIndex: 10,
        }}
      >
        For kids ages 4-10. Safe and private.
      </motion.p>
    </div>
  )
}
