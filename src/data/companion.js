import { getCharacter } from './characters'

// Accent / aura colors the child can pick for their guide.
export const ACCENT_COLORS = [
  { id: 'default', color: null, label: 'Original' },
  { id: 'blue', color: '#5AA9E6', label: 'Sky' },
  { id: 'teal', color: '#34D399', label: 'Teal' },
  { id: 'lavender', color: '#A78BFA', label: 'Lavender' },
  { id: 'pink', color: '#F472B6', label: 'Rose' },
  { id: 'orange', color: '#FB923C', label: 'Orange' },
  { id: 'gold', color: '#FBBF24', label: 'Gold' },
]

// Cosmetic outfits (simplified to 3 items)
export const OUTFITS = [
  { id: 'none', name: 'None', minLevel: 1 },
  { id: 'scarf', name: 'Cozy Scarf', minLevel: 1 },
  { id: 'hat', name: 'Farm Hat', minLevel: 1 },
  { id: 'bow', name: 'Cute Bow', minLevel: 1 },
]

// Keep HATS as alias for backward compatibility
export const HATS = OUTFITS

// Fun suggested names shown during onboarding, per guide.
export const SUGGESTED_NAMES = {
  owl: ['Hoots', 'Professor', 'Luna', 'Ollie'],
  bear: ['Barnaby', 'Cuddles', 'Bruno', 'Honey'],
  bunny: ['Clover', 'Hops', 'Cottontail', 'Pip'],
  cat: ['Whiskers', 'Mittens', 'Shadow', 'Cleo'],
}

// The name to show for the guide (falls back to the species name).
export const companionDisplayName = (state) =>
  (state?.companionName || '').trim() || getCharacter(state?.selectedCharacter).name

// The color to theme the guide with (falls back to the character's default).
export const companionColor = (state) =>
  state?.companionColor || getCharacter(state?.selectedCharacter).color
