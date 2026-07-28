import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'

export default function WelcomeScreen({ navigate }) {
  const isOnboarded = useGameStore(s => s.isOnboarded)

  return (
    <div className="w-full h-full flex flex-col items-center justify-between px-6 py-14"
      style={{ background: 'linear-gradient(170deg, #1a3a2a 0%, #131f24 40%, #0f1a1e 100%)' }}>

      <div />

      {/* Mascot + title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          className="mx-auto mb-5"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-28 h-28 rounded-full mx-auto overflow-hidden"
            style={{ background: '#58cc02', border: '4px solid #46a302', borderBottom: '6px solid #3d8b02', boxShadow: '0 8px 0 #3d8b02' }}>
            <img src="/assets/characters/owl.png" alt="Owl" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2.8rem', color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
          Moral
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '1rem', color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>
          Stories That Grow With You
        </p>
      </motion.div>

      {/* Character preview */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="flex gap-4 mb-8"
      >
        {[
          { img: '/assets/characters/owl.png', color: '#58cc02', label: 'Owl' },
          { img: '/assets/characters/bear.png', color: '#ff9600', label: 'Bear' },
          { img: '/assets/characters/bunny.png', color: '#ff86d0', label: 'Bunny' },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden"
              style={{ background: c.color, border: '3px solid rgba(255,255,255,0.15)', borderBottom: '5px solid rgba(0,0,0,0.15)' }}>
              <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
            </div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
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
        className="w-full max-w-sm"
      >
        <button
          onClick={() => navigate(isOnboarded ? 'home' : 'characterSelect')}
          className="w-full rounded-2xl text-white font-bold uppercase tracking-wide"
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '1.15rem',
            padding: '1rem 2rem',
            background: '#58cc02',
            border: 'none',
            borderBottom: '5px solid #46a302',
            boxShadow: '0 6px 0 #3d8b02',
            cursor: 'pointer',
          }}
        >
          {isOnboarded ? 'Continue' : 'Get Started'}
        </button>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '12px' }}>
          For kids ages 4–10 · Safe & private
        </p>
      </motion.div>
    </div>
  )
}
