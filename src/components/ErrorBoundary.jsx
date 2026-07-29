import { Component } from 'react'

// Catches render/runtime errors in a screen so a crash shows a friendly,
// recoverable card instead of a blank white page. Also surfaces the error text
// so issues can be diagnosed from a screenshot.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Screen error:', error, info?.componentStack)
  }

  handleHome = () => {
    this.setState({ error: null })
    this.props.onGoHome?.()
  }

  render() {
    if (this.state.error) {
      const msg = String(this.state.error?.message || this.state.error)
      return (
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: '2rem 1.5rem', background: 'linear-gradient(180deg,#F1EAFB 0%,#FCEFF4 100%)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌧️</div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem', color: '#5B21B6', margin: '0 0 0.4rem' }}>
            Oops! This page took a tumble.
          </h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#6B7280', margin: '0 0 1.25rem', maxWidth: '300px' }}>
            Don’t worry — your progress is safe. Let’s head back and try again.
          </p>
          <button onClick={this.handleHome}
            style={{
              fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: 'white',
              border: 'none', cursor: 'pointer', padding: '0.85rem 2rem', borderRadius: '18px',
              background: 'linear-gradient(180deg,#9B7BF5,#7C3AED)',
              boxShadow: '0 8px 18px rgba(124,58,237,0.38), inset 0 2px 0 rgba(255,255,255,0.45)',
            }}>
            Back to Home
          </button>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: '#B0A8C0', margin: '1.5rem 0 0', maxWidth: '300px', wordBreak: 'break-word' }}>
            {msg}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
