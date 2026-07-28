import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000]

const initialState = {
  // Child profile
  childName: '',
  selectedCharacter: null, // 'owl' | 'bear' | 'bunny'
  isOnboarded: false,

  // Progression
  xp: 0,
  level: 1,
  stars: 0,
  badges: [],
  gear: [],
  furniture: [],
  pets: [], // discovered companions (never granted by default — earned in Adventures)

  // Story state
  completedStories: [],
  currentStory: null,
  currentScene: 0,
  storyArchive: [],

  // Mission state
  completedMissions: [],
  currentMission: null,
  missionProgress: {},

  // House state (interactive room)
  // placedItems: [{ uid, itemId, kind: 'item' | 'pet', x, y }] positions are % of the room
  placedItems: [],
  wallStyle: 'lavender',
  floorStyle: 'wood',

  // Legacy grid layout (kept for backward compatibility with old saves)
  houseLayout: {
    livingRoom: [],
    bedroom: [],
    garden: [],
  },

  // Audio settings
  voiceEnabled: true,
  ttsVoice: null,
  speechRate: 0.9,

  // Session
  lastActive: null,
  totalStoriesRead: 0,
  totalMissionsCompleted: 0,
  streakDays: 0,
  lastPlayDate: null,
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Onboarding
      setChildName: (name) => set({ childName: name }),
      selectCharacter: (character) => set({ selectedCharacter: character }),
      completeOnboarding: () => set({ isOnboarded: true, lastActive: Date.now() }),

      // XP & Leveling
      addXP: (amount) => {
        const { xp, level } = get()
        const newXP = xp + amount
        let newLevel = level
        while (newLevel < XP_PER_LEVEL.length && newXP >= XP_PER_LEVEL[newLevel]) {
          newLevel++
        }
        set({ xp: newXP, level: newLevel, lastActive: Date.now() })
        return newLevel > level ? newLevel : null // returns new level if leveled up
      },

      addStars: (amount) => set((s) => ({ stars: s.stars + amount })),

      addBadge: (badge) => set((s) => ({
        badges: s.badges.some(b => b.id === badge.id) ? s.badges : [...s.badges, badge]
      })),

      addGear: (item) => set((s) => ({
        gear: s.gear.some(g => g.id === item.id) ? s.gear : [...s.gear, item]
      })),

      addFurniture: (item) => set((s) => ({
        furniture: s.furniture.some(f => f.id === item.id) ? s.furniture : [...s.furniture, item]
      })),

      // Pets are ONLY added here — discovered through Adventures, never seeded by default
      addPet: (pet) => set((s) => ({
        pets: s.pets.some(p => p.id === pet.id) ? s.pets : [...s.pets, pet]
      })),

      // Story progression
      startStory: (storyId) => set({ currentStory: storyId, currentScene: 0 }),

      advanceScene: () => set((s) => ({ currentScene: s.currentScene + 1 })),

      completeStory: (storyId) => {
        const state = get()
        const story = {
          id: storyId,
          completedAt: Date.now(),
          character: state.selectedCharacter,
        }
        set({
          currentStory: null,
          currentScene: 0,
          completedStories: [...new Set([...state.completedStories, storyId])],
          storyArchive: [...state.storyArchive, story],
          totalStoriesRead: state.totalStoriesRead + 1,
          lastPlayDate: new Date().toDateString(),
        })
        // Award XP
        state.addXP(50)
        state.addBadge({ id: `story-${storyId}`, name: 'Story Complete', icon: '📖' })
      },

      // Mission progression
      startMission: (missionId) => set({ currentMission: missionId, missionProgress: {} }),

      updateMissionProgress: (key, value) => set((s) => ({
        missionProgress: { ...s.missionProgress, [key]: value }
      })),

      completeMission: (missionId) => {
        const state = get()
        set({
          currentMission: null,
          missionProgress: {},
          completedMissions: [...new Set([...state.completedMissions, missionId])],
          totalMissionsCompleted: state.totalMissionsCompleted + 1,
          lastPlayDate: new Date().toDateString(),
        })
        state.addXP(75)
        state.addStars(3)
      },

      // ---- Interactive house ----
      placeHouseItem: ({ itemId, kind = 'item', x = 50, y = 70 }) => {
        const uid = `${itemId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        set((s) => ({ placedItems: [...s.placedItems, { uid, itemId, kind, x, y }] }))
        return uid
      },

      moveHouseItem: (uid, x, y) => set((s) => ({
        placedItems: s.placedItems.map(p => p.uid === uid ? { ...p, x, y } : p),
      })),

      removeHouseItem: (uid) => set((s) => ({
        placedItems: s.placedItems.filter(p => p.uid !== uid),
      })),

      // Bulk replace — used by undo / redo so history stays simple
      setPlacedItems: (items) => set({ placedItems: items }),

      setWallStyle: (wallStyle) => set({ wallStyle }),
      setFloorStyle: (floorStyle) => set({ floorStyle }),

      // Legacy grid layout helpers (retained for old saves)
      placeFurniture: (room, itemId) => set((s) => ({
        houseLayout: { ...s.houseLayout, [room]: [...s.houseLayout[room], itemId] },
      })),
      removeFurniture: (room, itemId) => set((s) => ({
        houseLayout: { ...s.houseLayout, [room]: s.houseLayout[room].filter(id => id !== itemId) },
      })),

      // Settings
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      setSpeechRate: (rate) => set({ speechRate: rate }),

      // Reset
      resetProgress: () => set({ ...initialState, isOnboarded: true, childName: get().childName, selectedCharacter: get().selectedCharacter }),
    }),
    {
      name: 'moral-game-storage',
      version: 2,
      migrate: (persisted, version) => {
        if (!persisted) return persisted
        if (version < 2) {
          // Introduce interactive-house + pets fields for older saves
          persisted.pets = persisted.pets || []
          persisted.placedItems = persisted.placedItems || []
          persisted.wallStyle = persisted.wallStyle || 'lavender'
          persisted.floorStyle = persisted.floorStyle || 'wood'
        }
        return persisted
      },
    }
  )
)
