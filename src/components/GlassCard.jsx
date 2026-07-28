import { motion } from 'framer-motion'

const glassStyle = {
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
}

const glassStyleLight = {
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '1.25rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
}

const glassStyleDark = {
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '1.25rem',
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
      background: 'linear-gradient(135deg, #7c5aff, #6a4eff)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(124,90,255,0.3), 0 2px 8px rgba(0,0,0,0.1)',
    },
    success: {
      background: 'linear-gradient(135deg, #00e676, #00c853)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0,230,118,0.3), 0 2px 8px rgba(0,0,0,0.1)',
    },
    glass: {
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.15)',
      color: 'white',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    },
    outline: {
      background: 'transparent',
      border: '1.5px solid rgba(255,255,255,0.2)',
      color: 'rgba(255,255,255,0.7)',
      boxShadow: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, #ff4b4b, #e53935)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(255,75,75,0.3), 0 2px 8px rgba(0,0,0,0.1)',
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
        borderRadius: '9999px',
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
        background: 'rgba(255,255,255,0.08)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '1rem',
        padding: '0.875rem 1.25rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'white',
        outline: 'none',
        fontFamily: "'Nunito', sans-serif",
        transition: 'border-color 0.2s ease',
        ...style,
      }}
      onFocus={(e) => { e.target.style.borderColor = 'rgba(124,90,255,0.5)' }}
      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)' }}
      {...props}
    />
  )
}
