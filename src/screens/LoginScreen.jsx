import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../stores/authStore'
import { useGameStore } from '../stores/gameStore'
import { GlassButton, GlassInput } from '../components/GlassCard'
import { MailIcon, LockIcon, UserIcon, GuestIcon, BackArrowIcon } from '../components/SVGIcons'

export default function LoginScreen({ navigate }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [childName, setChildName] = useState('')
  const [error, setError] = useState('')

  const { login, signup, continueAsGuest } = useAuthStore()
  const { isOnboarded, selectedCharacter } = useGameStore()

  const handleSubmit = () => {
    setError('')
    if (!email.trim()) { setError('Please enter an email'); return }
    if (pin.length < 4) { setError('PIN must be 4 digits'); return }
    if (!/^\d{4}$/.test(pin)) { setError('PIN must be numbers only'); return }

    if (mode === 'signup') {
      if (!childName.trim()) { setError("Please enter child's name"); return }
      signup(email.trim(), pin, childName.trim())
    } else {
      login(email.trim(), pin)
    }

    // After auth, check if already onboarded
    if (isOnboarded && selectedCharacter) {
      navigate('home')
    } else {
      navigate('characterSelect')
    }
  }

  const handleGuest = () => {
    continueAsGuest()
    if (isOnboarded && selectedCharacter) {
      navigate('home')
    } else {
      navigate('characterSelect')
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 30%, #0f1a2e 60%, #0a0a1a 100%)',
      }}>

      {/* Decorative gradient orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,90,255,0.15), transparent)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%', width: '180px', height: '180px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,0.1), transparent)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo area */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-4"
            style={{
              width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
              border: '3px solid rgba(124,90,255,0.3)',
              boxShadow: '0 8px 32px rgba(124,90,255,0.2)',
            }}
          >
            <img src="/assets/characters/owl.png" alt="Moral" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          <h1 style={{
            fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2.2rem',
            color: 'white', lineHeight: 1.1, margin: 0,
          }}>
            Welcome to Moral
          </h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.4)', marginTop: '4px',
          }}>
            Stories That Grow With You
          </p>
        </motion.div>

        {/* Glass card */}
        <div style={{
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          {/* Toggle */}
          <div style={{
            display: 'flex', borderRadius: '9999px', overflow: 'hidden',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
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
                  background: mode === m ? 'rgba(124,90,255,0.25)' : 'transparent',
                  color: mode === m ? '#c4b0ff' : 'rgba(255,255,255,0.4)',
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
                  <MailIcon size={18} color="rgba(255,255,255,0.5)" />
                </div>
                <GlassInput
                  type="email"
                  placeholder="Parent email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                  <LockIcon size={18} color="rgba(255,255,255,0.5)" />
                </div>
                <GlassInput
                  type="password"
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  maxLength={4}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {mode === 'signup' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                    <UserIcon size={18} color="rgba(255,255,255,0.5)" />
                  </div>
                  <GlassInput
                    type="text"
                    placeholder="Child's name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    maxLength={20}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </motion.div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: '#ff6b6b', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', margin: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <GlassButton variant="primary" onClick={handleSubmit} style={{ marginTop: '0.5rem' }}>
                {mode === 'login' ? 'Log In' : 'Create Account'}
              </GlassButton>
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            margin: '1.25rem 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <GlassButton variant="glass" onClick={handleGuest}>
            <GuestIcon size={18} color="rgba(255,255,255,0.7)" />
            Continue as Guest
          </GlassButton>
        </div>

        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '1rem',
        }}>
          For kids ages 4-10. Safe and private.
        </p>
      </motion.div>
    </div>
  )
}
