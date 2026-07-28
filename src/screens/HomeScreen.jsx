import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'

const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1800, 2500, 3500, 5000]

export default function HomeScreen({ navigate }) {
  const { childName, selectedCharacter, level, xp, stars, badges } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const currentLevelXP = XP_PER_LEVEL[level - 1] || 0
  const nextLevelXP = XP_PER_LEVEL[level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1]
  const progress = Math.min((xp - currentLevelXP) / (nextLevelXP - currentLevelXP), 1)

  const worlds = [
    { id: 'story', image: '/assets/stories/whisperwood-intro.png', label: 'Stories', desc: 'Read & listen', color: '#58cc02', darkColor: '#46a302' },
    { id: 'mission', image: '/assets/stories/forest-path.png', label: 'Missions', desc: 'Go adventuring', color: '#ff9600', darkColor: '#e08600' },
    { id: 'house', image: '/assets/characters/bear.png', label: 'My House', desc: 'Decorate & play', color: '#1cb0f6', darkColor: '#1899d6' },
  ]

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#131f24' }}>
      {/* Top bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden"
            style={{ background: character.color, border: '2px solid rgba(255,255,255,0.2)' }}>
            <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.2 }}>Level {level}</p>
            <div className="w-20 h-3 rounded-full overflow-hidden" style={{ background: '#2b3f48' }}>
              <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, background: '#58cc02' }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: '#2b3f48' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffc800"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.8rem', color: 'white' }}>{stars}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: '#2b3f48' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff4b4b"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>
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
        <div className="bg-white rounded-2xl p-3 flex items-center gap-3" style={{ borderBottom: '4px solid #e5e5e5' }}>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0"
            style={{ background: character.color }}>
            <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
          </div>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#3c3c3c' }}>
            {getGreeting(character.id, childName)}
          </p>
        </div>
      </motion.div>

      {/* World cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
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
              className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-transform active:scale-[0.98]"
              style={{ background: world.color, borderBottom: `4px solid ${world.darkColor}` }}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' }}>
                <img src={world.image} alt={world.label} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.3rem', color: 'white', lineHeight: 1.2 }}>{world.label}</h3>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{world.desc}</p>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </motion.button>
          ))}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mt-5">
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              My Badges
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.slice(-6).map((badge, i) => (
                <motion.div key={badge.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: '#1a2e35', border: '2px solid #2b3f48' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#58cc02"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { value: useGameStore.getState().totalStoriesRead, label: 'Stories', color: '#58cc02' },
            { value: useGameStore.getState().totalMissionsCompleted, label: 'Missions', color: '#ff9600' },
            { value: stars, label: 'Stars', color: '#ffc800' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: '#1a2e35', border: '2px solid #2b3f48' }}>
              <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.3rem', color: stat.color, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{stat.label}</p>
            </div>
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
