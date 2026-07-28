import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import GlassCard from '../components/GlassCard'
import { StarIcon, BoltIcon, ChevronRightIcon } from '../components/SVGIcons'

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000]

export default function HomeScreen({ navigate }) {
  const { childName, selectedCharacter, level, xp, stars, badges } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1]
  const progress = Math.min((xp - currentLevelXP) / (nextLevelXP - currentLevelXP), 1)

  const worlds = [
    { id: 'story', image: '/assets/stories/whisperwood-intro.png', label: 'Stories', desc: 'Read and listen', color: '#00e676', glow: 'rgba(0,230,118,0.15)' },
    { id: 'mission', image: '/assets/stories/forest-path.png', label: 'Missions', desc: 'Go adventuring', color: '#ff9600', glow: 'rgba(255,150,0,0.15)' },
    { id: 'house', image: '/assets/characters/bear.png', label: 'My House', desc: 'Decorate and play', color: '#1cb0f6', glow: 'rgba(28,176,246,0.15)' },
  ]

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0a0a1a' }}>
      {/* Top bar - glass */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
            border: `2px solid ${character.color}40`,
            boxShadow: `0 4px 12px ${character.color}20`,
          }}>
            <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.2 }}>Level {level}</p>
            <div style={{
              width: '80px', height: '6px', borderRadius: '3px', overflow: 'hidden',
              background: 'rgba(255,255,255,0.06)', marginTop: '3px',
            }}>
              <motion.div style={{
                height: '100%', borderRadius: '3px',
                background: 'linear-gradient(90deg, #7c5aff, #a78bfa)',
              }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
            <StarIcon size={13} color="#ffc800" />
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.8rem', color: 'white' }}>{stars}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
            <BoltIcon size={13} color="#7c5aff" />
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.8rem', color: 'white' }}>{xp}</span>
          </div>
        </div>
      </div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-3 shrink-0"
      >
        <div className="speech-bubble flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0"
            style={{ border: `2px solid ${character.color}40` }}>
            <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
          </div>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
            {getGreeting(character.id, childName)}
          </p>
        </div>
      </motion.div>

      {/* World cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          Choose your adventure
        </p>

        <div className="space-y-3">
          {worlds.map((world, i) => (
            <motion.button
              key={world.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => navigate(world.id)}
              className="w-full text-left world-card transition-transform"
              style={{
                background: `linear-gradient(135deg, ${world.color}12, ${world.color}08)`,
                borderColor: `${world.color}20`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                style={{
                  background: `${world.color}15`,
                  border: `2px solid ${world.color}25`,
                  boxShadow: `0 4px 12px ${world.color}10`,
                }}>
                <img src={world.image} alt={world.label} className="w-full h-full object-cover" style={{ opacity: 0.8 }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.2 }}>{world.label}</h3>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{world.desc}</p>
              </div>
              <ChevronRightIcon size={20} color="rgba(255,255,255,0.25)" />
            </motion.button>
          ))}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mt-5">
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              My Badges
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.slice(-6).map((badge, i) => (
                <motion.div key={badge.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <StarIcon size={11} color="#7c5aff" />
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { value: useGameStore.getState().totalStoriesRead, label: 'Stories', color: '#00e676' },
            { value: useGameStore.getState().totalMissionsCompleted, label: 'Missions', color: '#ff9600' },
            { value: stars, label: 'Stars', color: '#ffc800' },
          ].map((stat, i) => (
            <GlassCard key={i} variant="dark" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.3rem', color: stat.color, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

function getGreeting(characterId, name) {
  const greetings = {
    owl: [`Ready for a story, ${name}?`, `Hello, ${name}! What shall we explore today?`, `Welcome back, young one!`],
    bear: [`Hey ${name}! Let's go adventuring!`, `There you are, buddy! Ready?`, `${name}! My favorite adventurer!`],
    bunny: [`Hi ${name}! I'm SO excited!`, `Yay! ${name}'s back!`, `I have SO much to show you, ${name}!`],
  }
  const options = greetings[characterId] || greetings.owl
  return options[Math.floor(Math.random() * options.length)]
}
