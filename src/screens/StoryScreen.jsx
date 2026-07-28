import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getAllStories } from '../data/stories'

export default function StoryScreen({ navigate }) {
  const { completedStories, selectedCharacter } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const stories = getAllStories()

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-stars" style={{ background: '#131f24' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => navigate('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#1a2e35', border: '1.5px solid #2b3f48' }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-white text-lg">←</span>
        </motion.button>
        <h1 className="font-display text-xl font-bold text-white">Stories</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {/* Character guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="speech-bubble flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${character.color}20` }}>
              <img src={character.image} alt={character.name} className="w-8 h-8 rounded-full object-cover" style={{ border: '2px solid rgba(255,255,255,0.2)' }} />
            </div>
            <p className="font-bold text-sm" style={{ color: '#3c3c3c' }}>
              Pick a story to read with your buddy! 📚
            </p>
          </div>
        </motion.div>

        {/* AI Story button — shimmer */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate('aiStory')}
          className="relative w-full rounded-2xl p-4 flex items-center gap-3 overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(135deg, #58cc02, #1cb0f6)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderBottom: '5px solid rgba(0,0,0,0.15)',
            boxShadow: '0 6px 20px rgba(88,204,2,0.2)',
          }}
          whileTap={{ y: 2 }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.2)' }}>
            <span className="text-2xl" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}>✨</span>
          </div>
          <div className="text-left flex-1">
            <h3 className="font-display text-lg font-bold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>Create a Story</h3>
            <p className="text-white/80 text-sm font-semibold">AI creates a unique story just for you!</p>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            <span className="text-white font-bold">→</span>
          </div>
        </motion.button>

        {/* Lesson path title */}
        <p className="text-xs font-extrabold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
          📖 Story Collection
        </p>

        {/* Duolingo-style lesson path */}
        <div className="flex flex-col items-center gap-5 relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 rounded-full" style={{ background: '#1a2e35', border: '1px solid #2b3f48' }} />

          {stories.map((story, i) => {
            const isComplete = completedStories.includes(story.id)
            const isFirst = i === 0
            const nodeSize = isFirst ? 84 : 68

            return (
              <motion.button
                key={story.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 300, damping: 15 }}
                onClick={() => navigate('storyPlay', { storyId: story.id })}
                className="relative z-10 flex flex-col items-center"
              >
                {/* Lesson node */}
                <motion.div
                  className="relative rounded-full flex items-center justify-center"
                  style={{
                    width: nodeSize, height: nodeSize,
                    background: isComplete
                      ? 'linear-gradient(145deg, #58cc02, #46a302)'
                      : 'linear-gradient(145deg, #2b3f48, #1a2e35)',
                    border: `4px solid ${isComplete ? '#7de03b' : '#3d5560'}`,
                    borderBottom: `6px solid ${isComplete ? '#3d8b02' : '#131f24'}`,
                    boxShadow: isComplete
                      ? '0 8px 0 #2d7000, 0 0 20px rgba(88,204,2,0.25)'
                      : '0 6px 0 #0d1518, 0 8px 12px rgba(0,0,0,0.2)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ y: 3 }}
                >
                  <span style={{
                    fontSize: isFirst ? '2rem' : '1.6rem',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                  }}>
                    {story.thumbnail}
                  </span>
                  {isComplete && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: 'white', border: '2px solid #58cc02', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.3 + i * 0.1 }}
                    >
                      <span className="text-green-500 text-sm font-extrabold">✓</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Label */}
                <div className="mt-2.5 text-center" style={{ maxWidth: 150 }}>
                  <p className="font-display font-bold text-sm text-white leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                    {story.title}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>⏱ {story.duration}</span>
                    {story.ageRange && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>· Ages {story.ageRange}</span>}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}