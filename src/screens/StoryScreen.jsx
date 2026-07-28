import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getAllStories } from '../data/stories'
import { BackArrowIcon, CheckIcon, SparkleIcon, ChevronRightIcon } from '../components/SVGIcons'

export default function StoryScreen({ navigate }) {
  const { completedStories, selectedCharacter } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const stories = getAllStories()

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg,#F1EAFB 0%,#F6EDF8 45%,#FCEFF4 100%)' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <motion.button
          onClick={() => navigate('home')}
          style={{
            width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <BackArrowIcon size={16} color="#6B7280" />
        </motion.button>
        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#1F2937', margin: 0 }}>
          Stories
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem 1.5rem', WebkitOverflowScrolling: 'touch' }}>
        {/* Character guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '1rem' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: '1.25rem', padding: '0.75rem 1rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              border: `2px solid ${character.color}40`,
            }}>
              <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: '#4A5568' }}>
              Pick a story to read with your buddy!
            </p>
          </div>
        </motion.div>

        {/* AI Story button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('aiStory')}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', borderRadius: '20px', padding: '1rem',
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.08))',
            border: '1px solid rgba(139,92,246,0.15)',
            boxShadow: '0 4px 16px rgba(139,92,246,0.08)',
            cursor: 'pointer', textAlign: 'left', marginBottom: '1rem',
          }}
        >
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <SparkleIcon size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#1F2937', margin: 0 }}>
              Create a Story
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
              AI creates a unique story just for you!
            </p>
          </div>
          <ChevronRightIcon size={18} color="#9CA3AF" />
        </motion.button>

        {/* Story collection */}
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700,
          color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '0.75rem', paddingLeft: '2px',
        }}>
          Story Collection
        </p>

        {/* Story cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stories.map((story, i) => {
            const isComplete = completedStories.includes(story.id)
            return (
              <motion.button
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => navigate('storyPlay', { storyId: story.id })}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', borderRadius: '20px', overflow: 'hidden',
                  background: 'white', border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'stretch', cursor: 'pointer', textAlign: 'left', padding: 0,
                }}
              >
                <div style={{
                  width: '90px', flexShrink: 0, overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a2a1a, #0d2818)',
                }}>
                  <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                </div>
                <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.95rem', color: '#1F2937', margin: 0 }}>
                      {story.title}
                    </p>
                    {isComplete && (
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckIcon size={10} color="#10B981" />
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: '#9CA3AF', margin: '2px 0 0' }}>
                    {story.duration} · Ages {story.ageRange}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingRight: '0.75rem', flexShrink: 0 }}>
                  <ChevronRightIcon size={18} color="#D1D5DB" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
