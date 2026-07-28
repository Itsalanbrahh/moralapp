import { getCharacter } from './characters'

// Accent / aura colors the child can pick for their guide.
export const ACCENT_COLORS = [
  { id: 'default', color: null, label: 'Original' },
  { id: 'blue', color: '#5AA9E6', label: 'Sky' },
  { id: 'violet', color: '#A78BFA', label: 'Violet' },
  { id: 'mint', color: '#34D399', label: 'Mint' },
  { id: 'pink', color: '#F472B6', label: 'Rose' },
  { id: 'peach', color: '#FB923C', label: 'Peach' },
  { id: 'gold', color: '#FBBF24', label: 'Gold' },
]

// Cosmetic hats (sit on top of the head so they don't clash with the painted art).
export const HATS = [
  { id: 'none', name: 'No Hat', minLevel: 1 },
  { id: 'party', name: 'Party Hat', minLevel: 1 },
  { id: 'flower', name: 'Flower Crown', minLevel: 2 },
  { id: 'wizard', name: 'Wizard Hat', minLevel: 3 },
  { id: 'crown', name: 'Royal Crown', minLevel: 5 },
]

// Fun suggested names shown during onboarding, per guide.
export const SUGGESTED_NAMES = {
  owl: ['Hoots', 'Professor', 'Luna', 'Ollie'],
  bear: ['Barnaby', 'Cuddles', 'Bruno', 'Honey'],
  bunny: ['Clover', 'Hops', 'Cottontail', 'Pip'],
}

// The name to show for the guide (falls back to the species name).
export const companionDisplayName = (state) =>
  (state?.companionName || '').trim() || getCharacter(state?.selectedCharacter).name

// The color to theme the guide with (falls back to the character's default).
export const companionColor = (state) =>
  state?.companionColor || getCharacter(state?.selectedCharacter).color
