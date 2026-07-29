import { useState } from 'react'
import AnimatedSprite from './AnimatedSprite'
import { SPRITE_SHEETS } from '../utils/spriteEngine'
import { getCharacter } from '../data/characters'

// Animated companion that uses sprite sheets
// Drop-in replacement for CompanionAvatar with animation support

export default function AnimatedCompanion({
  character,
  size = 72,
  color,
  animation = 'idle', // 'idle' | 'walk'
  direction = 0,       // 0=down, 1=up, 2=right, 3=left
  fps = 6,
  style = {},
}) {
  const id = typeof character === 'string' ? character : character?.id
  const charData = getCharacter(id)
  const sheets = SPRITE_SHEETS[id] || SPRITE_SHEETS.owl

  const sheet = animation === 'walk' ? sheets.walk : sheets.idle
  const cols = animation === 'walk' ? sheets.walkCols : sheets.idleCols
  const rows = animation === 'walk' ? sheets.walkRows : sheets.idleRows
  const row = animation === 'walk' ? direction : 0

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: color || charData?.colorLight || '#E8D5F5',
      ...style,
    }}>
      <AnimatedSprite
        sheet={sheet}
        frameWidth={sheets.frameWidth}
        frameHeight={sheets.frameHeight}
        cols={cols}
        rows={rows}
        animationRow={row}
        fps={fps}
        loop={true}
        scale={size / sheets.frameWidth}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
