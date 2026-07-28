import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { useAuthStore } from '../stores/authStore'

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
    <div className="w-full h-full flex flex-col items-center justify-between px-6 py-14"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0a1a2e 60%, #0a0a1a 100%)',
      }}>

      {/* Decorative orbs */}
      <div style={{
        position: 'absolute', top: '15%', right: '10%', width: '180px', height: '180px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,90,255,0.12), transparent)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '25%', left: '5%', width: '140px', height: '140px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,0.08), transparent)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div />

      {/* Mascot + title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10"
      >
        <motion.div
          className="mx-auto mb-5"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-28 h-28 rounded-full mx-auto overflow-hidden"
            style={{
              border: '3px solid rgba(124,90,255,0.3)',
              boxShadow: '0 8px 32px rgba(124,90,255,0.2), 0 0 60px rgba(124,90,255,0.1)',
            }}>
            <img src="/assets/characters/owl.png" alt="Owl" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <h1 style={{
          fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2.8rem',
          color: '#ffffff', lineHeight: 1.1, margin: 0,
        }}>
          Moral
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '1rem',
          color: 'rgba(255,255,255,0.35)', margin: '4px 0 0',
        }}>
          Stories That Grow With You
        </p>
      </motion.div>

      {/* Character preview */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="flex gap-4 mb-8 relative z-10"
      >
        {[
          { img: '/assets/characters/owl.png', color: '#7c5aff', label: 'Owl' },
          { img: '/assets/characters/bear.png', color: '#ff8a50', label: 'Bear' },
          { img: '/assets/characters/bunny.png', color: '#ff6b9d', label: 'Bunny' },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden"
              style={{
                border: `2px solid ${c.color}40`,
                boxShadow: `0 4px 16px ${c.color}20`,
              }}>
              <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
            </div>
            <span style={{
              fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem',
              fontWeight: 700, color: 'rgba(255,255,255,0.4)',
            }}>
              {c.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <button
          onClick={handleContinue}
          className="w-full rounded-full text-white font-bold uppercase tracking-wide"
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.15rem',
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #7c5aff, #6a4eff)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 24px rgba(124,90,255,0.35), 0 0 40px rgba(124,90,255,0.1)',
            cursor: 'pointer',
          }}
        >
          {isLoggedIn && isOnboarded ? 'Continue' : 'Get Started'}
        </button>
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '12px',
        }}>
          For kids ages 4-10. Safe and private.
        </p>
      </motion.div>
    </div>
  )
}
