import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useGameStore } from '../stores/gameStore'
import { MailIcon, LockIcon, UserIcon, GuestIcon, StarIcon, SparkleIcon } from '../components/SVGIcons'
import AnimatedCompanion from '../components/AnimatedCompanion'

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

export default function LoginScreen({ navigate }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [childName, setChildName] = useState('')
  const [error, setError] = useState('')

  const { login, signup, continueAsGuest } = useAuthStore()
  const { isOnboarded, selectedCharacter, resetProgress } = useGameStore()

  const handleSubmit = () => {
    setError('')
    if (!email.trim()) { setError('Please enter an email'); return }
    if (pin.length < 4) { setError('PIN must be 4 digits'); return }
    if (!/^\d{4}$/.test(pin)) { setError('PIN must be numbers only'); return }

    if (mode === 'signup') {
      if (!childName.trim()) { setError("Please enter child's name"); return }
      resetProgress()
      signup(email.trim(), pin, childName.trim())
      navigate('characterSelect')
    } else {
      login(email.trim(), pin)
      if (isOnboarded && selectedCharacter) {
        navigate('home')
      } else {
        navigate('characterSelect')
      }
    }
  }

  const handleGuest = () => {
    resetProgress()
    continueAsGuest()
    navigate('characterSelect')
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-5"
      style={{
        background: 'linear-gradient(180deg, #E8D5F5 0%, #F5D5C8 100%)',
        position: 'relative',
      }}>

      <FloatingStar x="10%" y="15%" size={10} delay={0} />
      <FloatingStar x="85%" y="20%" size={12} delay={0.5} />
      <FloatingStar x="8%" y="70%" size={9} delay={1} />
      <FloatingStar x="88%" y="65%" size={11} delay={1.5} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Owl mascot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-center mb-5"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-3"
            style={{
              width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden',
              border: '3px solid rgba(139,92,246,0.3)',
              boxShadow: '0 8px 24px rgba(139,92,246,0.2)',
            }}
          >
            <AnimatedCompanion character="owl" size={72} animation="idle" fps={4} />
          </motion.div>
          <h1 style={{
            fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2rem',
            color: '#1F2937', lineHeight: 1.1, margin: 0,
          }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
        </motion.div>

        {/* Glass card */}
        <div style={{
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '1.5rem', padding: '1.5rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}>
          {/* Toggle */}
          <div style={{
            display: 'flex', borderRadius: '9999px', overflow: 'hidden',
            background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)',
            marginBottom: '1.25rem',
          }}>
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                style={{
                  flex: 1, padding: '0.6rem', border: 'none', cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem',
                  borderRadius: '9999px', transition: 'all 0.2s ease',
                  background: mode === m ? 'rgba(139,92,246,0.2)' : 'transparent',
                  color: mode === m ? '#7C3AED' : '#9CA3AF',
                }}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                  <MailIcon size={18} color="#9CA3AF" />
                </div>
                <input
                  type="email"
                  placeholder="Parent email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="glass-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                  <LockIcon size={18} color="#9CA3AF" />
                </div>
                <input
                  type="password"
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  maxLength={4}
                  className="glass-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                    <UserIcon size={18} color="#9CA3AF" />
                  </div>
                  <input
                    type="text"
                    placeholder="Child's name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    maxLength={20}
                    className="glass-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </motion.div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', margin: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '0.5rem' }}>
                {mode === 'login' ? 'Continue' : 'Create Account'}
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.06)' }} />
          </div>

          <button className="btn btn-glass" onClick={handleGuest} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <GuestIcon size={18} color="#6B7280" />
            Continue as Guest
          </button>
        </div>

        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem',
          color: '#9CA3AF', textAlign: 'center', marginTop: '1rem',
        }}>
          For kids ages 4-10. Safe and private.
        </p>
      </motion.div>
    </div>
  )
}
