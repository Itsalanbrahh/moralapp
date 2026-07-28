import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './stores/gameStore'
import { useAuthStore } from './stores/authStore'
import BottomNav from './components/BottomNav'
import WelcomeScreen from './screens/WelcomeScreen'
import LoginScreen from './screens/LoginScreen'
import CharacterSelect from './screens/CharacterSelect'
import HomeScreen from './screens/HomeScreen'
import StoryScreen from './screens/StoryScreen'
import MissionScreen from './screens/MissionScreen'
import HouseScreen from './screens/HouseScreen'
import StorybookScreen from './screens/StorybookScreen'
import MissionPlayScreen from './screens/MissionPlayScreen'
import AIStoryScreen from './screens/AIStoryScreen'
import ProfileScreen from './screens/ProfileScreen'

// Screens that should NOT show the bottom nav
const noNavScreens = new Set(['welcome', 'login', 'characterSelect', 'storyPlay', 'missionPlay'])

// Map bottom nav tabs to screen names
const tabToScreen = {
  home: 'home',
  story: 'story',
  mission: 'mission',
  house: 'house',
  profile: 'profile',
}

const screenToTab = {
  home: 'home',
  story: 'story',
  mission: 'mission',
  house: 'house',
  profile: 'profile',
  aiStory: 'story',
}

const screens = {
  welcome: WelcomeScreen,
  login: LoginScreen,
  characterSelect: CharacterSelect,
  home: HomeScreen,
  story: StoryScreen,
  storyPlay: StorybookScreen,
  mission: MissionScreen,
  missionPlay: MissionPlayScreen,
  house: HouseScreen,
  aiStory: AIStoryScreen,
  profile: ProfileScreen,
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [screenParams, setScreenParams] = useState({})
  const isOnboarded = useGameStore(s => s.isOnboarded)
  const selectedCharacter = useGameStore(s => s.selectedCharacter)
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)

  useEffect(() => {
    // Auto-route on load
    if (isLoggedIn && isOnboarded && selectedCharacter) {
      setCurrentScreen('home')
    }
  }, [])

  const navigate = (screen, params = {}) => {
    setScreenParams(params)
    setCurrentScreen(screen)
  }

  const handleTabChange = (tabId) => {
    const screenId = tabToScreen[tabId]
    if (screenId && screenId !== currentScreen) {
      setScreenParams({})
      setCurrentScreen(screenId)
    }
  }

  const showNav = !noNavScreens.has(currentScreen)
  const activeTab = screenToTab[currentScreen] || 'home'

  const ScreenComponent = screens[currentScreen] || HomeScreen

  return (
    <div className="app-shell" style={{ background: '#0a0a1a' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full h-full"
          style={showNav ? { paddingBottom: '60px' } : undefined}
        >
          <ScreenComponent navigate={navigate} params={screenParams} />
        </motion.div>
      </AnimatePresence>

      {showNav && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  )
}
