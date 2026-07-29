import { useRef, useEffect, useState, useCallback } from 'react'

// Animated sprite component for Sprout Lands style sprite sheets
// Uses CSS background-position to cycle through frames

export default function AnimatedSprite({
  sheet,
  frameWidth = 16,
  frameHeight = 16,
  cols = 4,
  rows = 4,
  animationRow = 0,
  fps = 8,
  loop = true,
  scale = 4,
  width,
  height,
  style = {},
  className = '',
  onComplete,
}) {
  const [frame, setFrame] = useState(0)
  const frameRef = useRef(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef(null)
  const rafRef = useRef(null)
  const rowRef = useRef(animationRow)

  // Update row when prop changes
  useEffect(() => {
    if (rowRef.current !== animationRow) {
      rowRef.current = animationRow
      frameRef.current = 0
      elapsedRef.current = 0
      setFrame(0)
    }
  }, [animationRow])

  const animate = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const delta = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    elapsedRef.current += delta
    const frameDuration = 1000 / fps

    if (elapsedRef.current >= frameDuration) {
      elapsedRef.current -= frameDuration
      frameRef.current++

      if (frameRef.current >= cols) {
        if (loop) {
          frameRef.current = 0
        } else {
          frameRef.current = cols - 1
          onComplete?.()
          return // stop animation
        }
      }
      setFrame(frameRef.current)
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [fps, cols, loop, onComplete])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  const displayWidth = width || frameWidth * scale
  const displayHeight = height || frameHeight * scale
  const bgSize = `${cols * displayWidth}px ${rows * displayHeight}px`
  const bgPos = `-${frame * displayWidth}px -${animationRow * displayHeight}px`

  return (
    <div
      className={className}
      style={{
        width: displayWidth,
        height: displayHeight,
        backgroundImage: `url(${sheet})`,
        backgroundSize: bgSize,
        backgroundPosition: bgPos,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  )
}
