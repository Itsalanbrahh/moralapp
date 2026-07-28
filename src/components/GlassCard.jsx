import { motion } from 'framer-motion'

const glassStyle = {
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: '1.5rem',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
}

const glassStyleLight = {
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(255,255,255,0.6)',
  borderRadius: '1.5rem',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
}

const glassStyleDark = {
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '1.5rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
}

export default function GlassCard({
  children,
  variant = 'default', // 'default' | 'light' | 'dark'
  style = {},
  className = '',
  animate = true,
  onClick,
  ...props
}) {
  const baseStyle = variant === 'light' ? glassStyleLight : variant === 'dark' ? glassStyleDark : glassStyle

  const Component = animate ? motion.div : 'div'
  const animateProps = animate ? {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    ...(onClick ? { whileTap: { scale: 0.98 } } : {}),
  } : {}

  return (
    <Component
      className={className}
      style={{ ...baseStyle, ...style }}
      onClick={onClick}
      {...animateProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export function GlassButton({ children, variant = 'primary', style = {}, className = '', disabled = false, ...props }) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(139,92,246,0.3)',
    },
    success: {
      background: 'linear-gradient(135deg, #10B981, #059669)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
    },
    glass: {
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(255,255,255,0.5)',
      border: '1px solid rgba(0,0,0,0.06)',
      color: '#1F2937',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    },
    outline: {
      background: 'transparent',
      border: '1.5px solid rgba(0,0,0,0.1)',
      color: '#6B7280',
      boxShadow: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
    },
  }

  return (
    <motion.button
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.875rem 1.5rem',
        borderRadius: '16px',
        fontFamily: "'Baloo 2', cursive",
        fontWeight: 700,
        fontSize: '1rem',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.15s ease',
        width: '100%',
        maxWidth: '400px',
        ...variants[variant],
        ...style,
      }}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97, y: 1 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function GlassInput({ style = {}, ...props }) {
  return (
    <input
      style={{
        width: '100%',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(255,255,255,0.5)',
        border: '1.5px solid rgba(0,0,0,0.08)',
        borderRadius: '1rem',
        padding: '0.875rem 1.25rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1F2937',
        outline: 'none',
        fontFamily: "'Nunito', sans-serif",
        transition: 'border-color 0.2s ease',
        ...style,
      }}
      onFocus={(e) => { e.target.style.borderColor = 'rgba(139,92,246,0.4)' }}
      onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.08)' }}
      {...props}
    />
  )
}
