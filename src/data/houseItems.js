// Catalog of everything that can live in the house.
// Ownership is tracked in the game store (furniture / gear / pets arrays);
// this file is purely the source of truth for how each item looks & is grouped.
// IMPORTANT: pets are NOT unlocked by default — they are discovered through Adventures.

// ---- Wall styles (cosmetic, always available) ----
export const WALLS = {
  cozywood: { id: 'cozywood', name: 'Cozy Wood', wall: 'linear-gradient(180deg,#F3DDBB 0%,#E9CB9C 60%,#E0BC86 100%)', swatch: 'linear-gradient(135deg,#F3DDBB,#D9B885)', plank: true },
  lavender: { id: 'lavender', name: 'Lavender', wall: 'linear-gradient(180deg,#E9D5FF 0%,#F3E8FF 55%,#FBF5FF 100%)', swatch: 'linear-gradient(135deg,#E9D5FF,#C4B5FD)' },
  mint:     { id: 'mint',     name: 'Mint',     wall: 'linear-gradient(180deg,#A7F3D0 0%,#D1FAE5 55%,#ECFDF5 100%)', swatch: 'linear-gradient(135deg,#A7F3D0,#6EE7B7)' },
  sky:      { id: 'sky',      name: 'Sky',      wall: 'linear-gradient(180deg,#BFDBFE 0%,#DBEAFE 55%,#EFF6FF 100%)', swatch: 'linear-gradient(135deg,#BFDBFE,#93C5FD)' },
  sunset:   { id: 'sunset',   name: 'Sunset',   wall: 'linear-gradient(180deg,#FED7AA 0%,#FBCFE8 60%,#FFF1F2 100%)', swatch: 'linear-gradient(135deg,#FED7AA,#FBCFE8)' },
  rose:     { id: 'rose',     name: 'Rose',     wall: 'linear-gradient(180deg,#FBCFE8 0%,#FCE7F3 55%,#FFF1F5 100%)', swatch: 'linear-gradient(135deg,#FBCFE8,#F9A8D4)' },
  night:    { id: 'night',    name: 'Starry',   wall: 'linear-gradient(180deg,#312E81 0%,#4C1D95 55%,#6D28D9 100%)', swatch: 'linear-gradient(135deg,#4C1D95,#7C3AED)', dark: true },
}

// ---- Floor styles (cosmetic, always available) ----
export const FLOORS = {
  wood:     { id: 'wood',     name: 'Oak',     base: '#B67F3E', floor: 'repeating-linear-gradient(90deg,#C8934F 0 22px,#B67F3E 22px 44px)' },
  pinkwood: { id: 'pinkwood', name: 'Blush',   base: '#D8A3A0', floor: 'repeating-linear-gradient(90deg,#E7B7B4 0 22px,#D8A3A0 22px 44px)' },
  stone:    { id: 'stone',    name: 'Stone',   base: '#B8BCC4', floor: 'repeating-linear-gradient(90deg,#C7CBD3 0 24px,#AEB2BB 24px 48px)' },
  grass:    { id: 'grass',    name: 'Meadow',  base: '#7CC26A', floor: 'repeating-linear-gradient(90deg,#8FD07C 0 22px,#6FB55E 22px 44px)' },
  starrug:  { id: 'starrug',  name: 'Starlit', base: '#8B5CF6', floor: 'linear-gradient(180deg,#A78BFA,#8B5CF6)' },
  cloud:    { id: 'cloud',    name: 'Cloud',   base: '#DCEEFB', floor: 'linear-gradient(180deg,#EAF4FD,#D2E7F8)' },
}

// ---- Furniture & decor ----
// default: true  -> in the backpack from the start
// scale: relative size on the floor (1 = normal)
export const HOUSE_ITEMS = {
  // starter furniture
  'cozy-bed':      { id: 'cozy-bed',      name: 'Cozy Bed',       emoji: '🛏️', category: 'furniture', scale: 1.35, default: true },
  'potted-plant':  { id: 'potted-plant',  name: 'Potted Plant',   emoji: '🪴', category: 'furniture', scale: 0.95, default: true },
  'star-lamp':     { id: 'star-lamp',     name: 'Star Lamp',      emoji: '💡', category: 'furniture', scale: 0.9,  default: true },
  'wooden-chair':  { id: 'wooden-chair',  name: 'Little Chair',   emoji: '🪑', category: 'furniture', scale: 1,    default: true },

  // earned furniture (from adventures)
  'pink-armchair': { id: 'pink-armchair', name: 'Comfy Armchair', emoji: '🛋️', category: 'furniture', scale: 1.25 },
  'bookshelf':     { id: 'bookshelf',     name: 'Bookshelf',      emoji: '📚', category: 'furniture', scale: 1.2 },
  'mushroom-lamp': { id: 'mushroom-lamp', name: 'Mushroom Lamp',  emoji: '🍄', category: 'furniture', scale: 1 },
  'acorn-trophy':  { id: 'acorn-trophy',  name: 'Acorn Shelf',    emoji: '🌰', category: 'furniture', scale: 1 },
  'star-throne':   { id: 'star-throne',   name: 'Star Throne',    emoji: '👑', category: 'furniture', scale: 1.15 },
  'magic-cupcake': { id: 'magic-cupcake', name: 'Cupcake Stand',  emoji: '🧁', category: 'furniture', scale: 0.95 },
  'toy-box':       { id: 'toy-box',       name: 'Toy Box',        emoji: '🧸', category: 'furniture', scale: 1 },
  'grand-clock':   { id: 'grand-clock',   name: 'Grand Clock',    emoji: '🕰️', category: 'furniture', scale: 1.1 },

  // decor
  'wall-painting': { id: 'wall-painting', name: 'Painting',       emoji: '🖼️', category: 'decor', scale: 1 },
  'flower-vase':   { id: 'flower-vase',   name: 'Flower Vase',    emoji: '🌷', category: 'decor', scale: 0.85 },
  'crystal-ball':  { id: 'crystal-ball',  name: 'Crystal Ball',   emoji: '🔮', category: 'decor', scale: 0.85 },
  'fairy-lights':  { id: 'fairy-lights',  name: 'Fairy Lights',   emoji: '✨', category: 'decor', scale: 0.9 },
  'balloon':       { id: 'balloon',       name: 'Balloon',        emoji: '🎈', category: 'decor', scale: 0.95 },
  'candle':        { id: 'candle',        name: 'Candle',         emoji: '🕯️', category: 'decor', scale: 0.8 },
  'lantern':       { id: 'lantern',       name: 'Lantern',        emoji: '🏮', category: 'decor', scale: 0.9 },
  'rainbow':       { id: 'rainbow',       name: 'Rainbow',        emoji: '🌈', category: 'decor', scale: 1.1 },

  // treasures won at the end of adventures (the "gear" collectibles) — displayable in the house
  'golden-acorn':    { id: 'golden-acorn',    name: 'Golden Acorn',       emoji: '🌟', category: 'decor', scale: 0.9,  treasure: true },
  'friendship-pearl':{ id: 'friendship-pearl',name: 'Pearl of Friendship',emoji: '🫧', category: 'decor', scale: 0.95, treasure: true },
  'kindness-crown':  { id: 'kindness-crown',  name: 'Crown of Kindness',  emoji: '👑', category: 'decor', scale: 0.95, treasure: true },
  'pearl-fountain':  { id: 'pearl-fountain',  name: 'Pearl Fountain',     emoji: '⛲', category: 'decor', scale: 1.2,  treasure: true },
}

// ---- Pets (discovered through Adventures — none owned by default) ----
export const PETS = {
  duck:    { id: 'duck',    name: 'Waddles', emoji: '🦆', hint: 'Help a duckling in the Enchanted Forest' },
  fox:     { id: 'fox',     name: 'Pip',     emoji: '🦊', hint: 'Complete the Enchanted Forest adventure' },
  octopus: { id: 'octopus', name: 'Inky',    emoji: '🐙', hint: 'Help the octopus in the Coral Kingdom' },
  turtle:  { id: 'turtle',  name: 'Shelly',  emoji: '🐢', hint: 'Complete the Coral Kingdom adventure' },
  dragon:  { id: 'dragon',  name: 'Ember',   emoji: '🐉', hint: 'Help the dragon at the Friendly Castle' },
  cat:     { id: 'cat',     name: 'Whiskers',emoji: '🐱', hint: 'Discovered in a future adventure' },
  dog:     { id: 'dog',     name: 'Biscuit', emoji: '🐶', hint: 'Discovered in a future adventure' },
  bunny:   { id: 'bunny',   name: 'Clover',  emoji: '🐰', hint: 'Discovered in a future adventure' },
}

export const CATEGORIES = [
  { id: 'furniture', label: 'Furniture', emoji: '🛋️' },
  { id: 'pets',      label: 'Pets',      emoji: '🐾' },
  { id: 'decor',     label: 'Decor',     emoji: '🪴' },
  { id: 'walls',     label: 'Walls',     emoji: '🎨' },
  { id: 'floors',    label: 'Floors',    emoji: '🧱' },
]

// ---- lookup helpers ----
export const getHouseItem = (id) => HOUSE_ITEMS[id]
export const getPetDef = (id) => PETS[id]
export const getWall = (id) => WALLS[id] || WALLS.lavender
export const getFloor = (id) => FLOORS[id] || FLOORS.wood
export const itemsByCategory = (cat) => Object.values(HOUSE_ITEMS).filter((i) => i.category === cat)
export const allPets = () => Object.values(PETS)
