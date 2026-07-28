import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './stores/gameStore'
import WelcomeScreen from './screens/WelcomeScreen'
import CharacterSelect from './screens/CharacterSelect'
import HomeScreen from './screens/HomeScreen'
import StoryScreen from './screens/StoryScreen'
import MissionScreen from './screens/MissionScreen'
import HouseScreen from './screens/HouseScreen'
import StorybookScreen from './screens/StorybookScreen'
import MissionPlayScreen from './screens/MissionPlayScreen'
import AIStoryScreen from './screens/AIStoryScreen'

const screens = {
  welcome: WelcomeScreen,
  characterSelect: CharacterSelect,
  home: HomeScreen,
  story: StoryScreen,
  storyPlay: StorybookScreen,
  mission: MissionScreen,
  missionPlay: MissionPlayScreen,
  house: HouseScreen,
  aiStory: AIStoryScreen,
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [screenParams, setScreenParams] = useState({})
  const isOnboarded = useGameStore(s => s.isOnboarded)
  const selectedCharacter = useGameStore(s => s.selectedCharacter)

  useEffect(() => {
    if (isOnboarded && selectedCharacter) setCurrentScreen('home')
  }, [])

  const navigate = (screen, params = {}) => {
    setScreenParams(params)
    setCurrentScreen(screen)
  }

  const ScreenComponent = screens[currentScreen] || HomeScreen

  return (
    <div className="app-shell" style={{ background: '#131f24' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full h-full"
        >
          <ScreenComponent navigate={navigate} params={screenParams} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
