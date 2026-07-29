// Sprite animation engine for Sprout Lands style character sheets
// Handles frame-based animation from sprite sheets

export class SpriteAnimator {
  constructor(sheetUrl, frameWidth, frameHeight, cols, rows) {
    this.sheetUrl = sheetUrl
    this.frameWidth = frameWidth
    this.frameHeight = frameHeight
    this.cols = cols
    this.rows = rows
    this.currentRow = 0
    this.currentFrame = 0
    this.frameCount = cols
    this.fps = 8
    this.elapsed = 0
    this.playing = true
    this.loop = true
    this.onComplete = null
  }

  setAnimation(row, fps = 8, loop = true) {
    if (this.currentRow !== row) {
      this.currentRow = row
      this.currentFrame = 0
      this.elapsed = 0
      this.fps = fps
      this.loop = loop
      this.playing = true
    }
  }

  update(deltaTime) {
    if (!this.playing) return
    this.elapsed += deltaTime
    const frameDuration = 1000 / this.fps
    if (this.elapsed >= frameDuration) {
      this.elapsed -= frameDuration
      this.currentFrame++
      if (this.currentFrame >= this.frameCount) {
        if (this.loop) {
          this.currentFrame = 0
        } else {
          this.currentFrame = this.frameCount - 1
          this.playing = false
          this.onComplete?.()
        }
      }
    }
  }

  getFramePosition() {
    return {
      x: this.currentFrame * this.frameWidth,
      y: this.currentRow * this.frameHeight,
      w: this.frameWidth,
      h: this.frameHeight,
    }
  }
}

// Direction constants for walk sheets (4 rows)
export const DIRECTION = {
  DOWN: 0,
  UP: 1,
  RIGHT: 2,
  LEFT: 3,
}

// Emote constants for idle sheets (row 1 = idle, row 2 = emotes)
export const EMOTE = {
  IDLE: 0,
  HAPPY: 1,
  SURPRISED: 1,
  THINKING: 1,
  WAVE: 1,
}

// Sprite sheet metadata
export const SPRITE_SHEETS = {
  owl: {
    walk: '/assets/sprites/owl-walk.png',
    idle: '/assets/sprites/owl-idle.png',
    frameWidth: 16,
    frameHeight: 16,
    walkCols: 4,
    walkRows: 4,
    idleCols: 4,
    idleRows: 2,
  },
  bear: {
    walk: '/assets/sprites/bear-walk.png',
    idle: '/assets/sprites/bear-idle.png',
    frameWidth: 16,
    frameHeight: 16,
    walkCols: 4,
    walkRows: 4,
    idleCols: 4,
    idleRows: 2,
  },
  bunny: {
    walk: '/assets/sprites/bunny-walk.png',
    idle: '/assets/sprites/bunny-idle.png',
    frameWidth: 16,
    frameHeight: 16,
    walkCols: 4,
    walkRows: 4,
    idleCols: 4,
    idleRows: 2,
  },
  cat: {
    walk: '/assets/sprites/cat-walk.png',
    idle: '/assets/sprites/cat-idle.png',
    frameWidth: 16,
    frameHeight: 16,
    walkCols: 4,
    walkRows: 4,
    idleCols: 4,
    idleRows: 2,
  },
}

// Farm sprite sheets
export const FARM_SPRITES = {
  crops: '/assets/sprites/farm-crops.png',
  house: '/assets/sprites/farm-house.png',
  decor: '/assets/sprites/farm-decor.png',
}
