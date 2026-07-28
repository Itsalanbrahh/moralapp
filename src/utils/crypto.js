// AES-256 encryption for voice audio (COPPA compliance)
// Uses Web Crypto API — all processing on-device

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256

async function getKeyMaterial(password) {
  const encoder = new TextEncoder()
  return crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey'])
}

async function deriveKey(keyMaterial, salt) {
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptAudio(audioBlob, deviceId) {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const keyMaterial = await getKeyMaterial(deviceId)
    const key = await deriveKey(keyMaterial, salt)
    const audioBuffer = await audioBlob.arrayBuffer()
    const encrypted = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, audioBuffer)

    // Return encrypted bundle with metadata
    return {
      encrypted: new Uint8Array(encrypted),
      iv: Array.from(iv),
      salt: Array.from(salt),
      timestamp: Date.now(),
      algorithm: ALGORITHM,
    }
  } catch (e) {
    console.error('Encryption failed:', e)
    return null
  }
}

export async function decryptAudio(encryptedData, deviceId) {
  try {
    const { encrypted, iv, salt } = encryptedData
    const keyMaterial = await getKeyMaterial(deviceId)
    const key = await deriveKey(keyMaterial, new Uint8Array(salt))
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: new Uint8Array(iv) },
      key,
      new Uint8Array(encrypted)
    )
    return new Blob([decrypted], { type: 'audio/webm' })
  } catch (e) {
    console.error('Decryption failed:', e)
    return null
  }
}

// Secure deletion — overwrite buffer before releasing
export function secureDelete(arrayBuffer) {
  if (arrayBuffer instanceof ArrayBuffer) {
    const view = new Uint8Array(arrayBuffer)
    crypto.getRandomValues(view) // overwrite with random
    view.fill(0) // then zero
  }
}

// Get or create a device-specific ID for encryption
export function getDeviceId() {
  let id = localStorage.getItem('moral-device-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('moral-device-id', id)
  }
  return id
}
