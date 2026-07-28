import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getAllStories } from '../data/stories'
import GlassCard, { GlassButton } from '../components/GlassCard'
import { BackArrowIcon, StarIcon, CheckIcon, SparkleIcon, ChevronRightIcon } from '../components/SVGIcons'

export default function StoryScreen({ navigate }) {
  const { completedStories, selectedCharacter } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const stories = getAllStories()

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-stars" style={{ background: '#0a0a1a' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 shrink-0">
        <motion.button
          onClick={() => navigate('home')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <BackArrowIcon size={18} color="rgba(255,255,255,0.7)" />
        </motion.button>
        <h1 className="font-display text-xl font-bold text-white">Stories</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Character guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="speech-bubble flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${character.color}15` }}>
              <img src={character.image} alt={character.name} className="w-8 h-8 rounded-full object-cover" style={{ border: `2px solid ${character.color}40` }} />
            </div>
            <p className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Pick a story to read with your buddy!
            </p>
          </div>
        </motion.div>

        {/* AI Story button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate('aiStory')}
          className="relative w-full rounded-2xl p-4 flex items-center gap-3 overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(124,90,255,0.15), rgba(0,230,118,0.1))',
            border: '1px solid rgba(124,90,255,0.2)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(124,90,255,0.1)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 opacity-15"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(124,90,255,0.2), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(124,90,255,0.15)', border: '1px solid rgba(124,90,255,0.2)' }}>
            <SparkleIcon size={22} color="#c4b0ff" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-display text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Create a Story</h3>
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>AI creates a unique story just for you!</p>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <ChevronRightIcon size={18} color="rgba(255,255,255,0.4)" />
          </div>
        </motion.button>

        {/* Story Collection title */}
        <p className="text-xs font-extrabold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Story Collection
        </p>

        {/* Duolingo-style lesson path */}
        <div className="flex flex-col items-center gap-5 relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />

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
                <motion.div
                  className="relative rounded-full flex items-center justify-center"
                  style={{
                    width: nodeSize, height: nodeSize,
                    background: isComplete
                      ? 'linear-gradient(145deg, #7c5aff, #6a4eff)'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                    border: `3px solid ${isComplete ? 'rgba(124,90,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isComplete
                      ? '0 8px 24px rgba(124,90,255,0.25), 0 0 40px rgba(124,90,255,0.1)'
                      : '0 4px 16px rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(16px)',
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
                      style={{
                        background: '#0a0a1a', border: '2px solid #7c5aff',
                        boxShadow: '0 2px 8px rgba(124,90,255,0.3)',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.3 + i * 0.1 }}
                    >
                      <CheckIcon size={12} color="#7c5aff" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Label */}
                <div className="mt-2.5 text-center" style={{ maxWidth: 150 }}>
                  <p className="font-display font-bold text-sm text-white leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
                    {story.title}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{story.duration}</span>
                    {story.ageRange && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>Ages {story.ageRange}</span>}
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
