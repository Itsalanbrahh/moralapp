import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { getCharacter } from '../data/characters'
import { getStory } from '../data/stories'
import { speak, stopSpeaking } from '../utils/voice'
import { CloseIcon, BackArrowIcon, BoltIcon, CheckIcon, StarIcon, PlayIcon, PauseIcon, RefreshIcon, VoiceOnIcon, BookIcon, TrophyIcon } from '../components/SVGIcons'

const READING = {
  listen: { label: 'Listening', color: '#3B82F6', Icon: VoiceOnIcon },
  beginner: { label: 'Read-Along', color: '#10B981', Icon: BookIcon },
  advanced: { label: 'Reading Pro', color: '#8B5CF6', Icon: TrophyIcon },
}

// Split text into word / whitespace tokens, tagging each word with its order and
// character range (used to sync the read-along highlight to speech boundaries).
function tokenize(text) {
  const parts = (text || '').split(/(\s+)/)
  let ci = 0, order = -1
  return parts.map((p) => {
    const startChar = ci
    ci += p.length
    const isWord = /\S/.test(p)
    if (isWord) order++
    return { text: p, isWord, order: isWord ? order : -1, startChar, endChar: ci }
  })
}

// little up-pointing guide that bounces under the word the child should read next
function PointerCaret() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" style={{ display: 'block' }}>
      <path d="M8 0 L15 10 L1 10 Z" fill="#FBBF24" />
    </svg>
  )
}

export default function StorybookScreen({ navigate, params }) {
  const { selectedCharacter, childName, completeStory, addXP, readingLevel, voiceEnabled, speechRate, companionName } = useGameStore()
  const character = getCharacter(selectedCharacter)
  const guideName = (companionName || '').trim() || character.name
  const story = getStory(params.storyId)
  const mode = READING[readingLevel] ? readingLevel : 'listen'

  const [sceneIndex, setSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [modelIdx, setModelIdx] = useState(-1)   // word being modeled while "Hear it" plays
  const [readIdx, setReadIdx] = useState(0)       // words the child has read (beginner tap-to-read)
  const [celebrate, setCelebrate] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [phase, setPhase] = useState('story') // 'story' | 'quiz'

  // quiz state (advanced)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const scene = story?.scenes[sceneIndex]
  const tokens = useMemo(() => tokenize(scene?.text), [scene])
  const wordCount = useMemo(() => tokens.filter((t) => t.isWord).length, [tokens])
  const quiz = story?.comprehension || []
  const targetWord = useMemo(() => tokens.find((t) => t.isWord && t.order === readIdx)?.text || '', [tokens, readIdx])

  const effRate = mode === 'advanced' ? speechRate : Math.min(speechRate, 0.9)

  // Read the whole sentence aloud — models word-by-word tracking for beginners.
  const playFull = useCallback(() => {
    if (!scene || !voiceEnabled) return
    stopSpeaking()
    setModelIdx(-1)
    setIsPlaying(true)
    speak(scene.text, {
      rate: effRate,
      pitch: character.voicePitch,
      onBoundary: mode === 'beginner' ? (e) => {
        const tk = tokens.find((t) => e.charIndex >= t.startChar && e.charIndex < t.endChar)
        if (tk) setModelIdx(tk.isWord ? tk.order : Math.max(0, tk.order))
      } : undefined,
    }).then(() => { setIsPlaying(false); setModelIdx(-1) })
  }, [scene, tokens, mode, effRate, character.voicePitch, voiceEnabled])

  // Speak a single word (tap-to-hear). `slow` stretches it for sounding-out.
  const speakWord = (raw, slow = false) => {
    if (!voiceEnabled) return
    const w = raw.replace(/[^A-Za-z'’-]/g, '')
    if (w) speak(w, { rate: slow ? 0.4 : 0.72, pitch: character.voicePitch })
  }

  // Beginner tap-to-read: tapping the glowing word reads it & advances; other taps just help.
  const tapWord = (t) => {
    if (modelIdx >= 0 || !t.isWord || celebrate) return
    speakWord(t.text)
    if (t.order === readIdx) {
      const next = readIdx + 1
      setReadIdx(next)
      if (next >= wordCount) {
        setCelebrate(true)
        setTimeout(() => speak('You read it! Great job!', { rate: 0.95, pitch: character.voicePitch }), 300)
      }
    }
  }

  // Per-scene reset (+ auto-narrate for listen mode)
  useEffect(() => {
    if (isDone || phase !== 'story' || !scene) return
    stopSpeaking()
    setModelIdx(-1); setReadIdx(0); setCelebrate(false)
    if (mode === 'listen') { const t = setTimeout(playFull, 350); return () => { clearTimeout(t); stopSpeaking() } }
    return () => stopSpeaking()
  }, [sceneIndex, phase, isDone]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    if (isPlaying) { stopSpeaking(); setIsPlaying(false); setModelIdx(-1) }
    else playFull()
  }

  const finish = () => {
    stopSpeaking()
    setIsDone(true)
    completeStory(story.id)
  }

  const advanceOrFinish = () => {
    stopSpeaking()
    if (sceneIndex < story.scenes.length - 1) setSceneIndex((s) => s + 1)
    else if (mode === 'advanced' && quiz.length) setPhase('quiz')
    else finish()
  }

  const answerQuiz = (i) => {
    if (selected !== null) return
    setSelected(i)
    const correct = i === quiz[qIdx].answer
    if (correct) setCorrectCount((c) => c + 1)
    setTimeout(() => {
      if (qIdx < quiz.length - 1) { setQIdx((q) => q + 1); setSelected(null); setShowHint(false) }
      else { if (correctCount + (correct ? 1 : 0) >= 0) addXP((correctCount + (correct ? 1 : 0)) * 10); finish() }
    }, 1400)
  }

  if (!story) return <div style={{ padding: '2rem', textAlign: 'center', color: 'white', fontFamily: "'Baloo 2', cursive" }}>Story not found</div>

  const rc = READING[mode]

  // ---------- Victory ----------
  if (isDone) {
    const isQuiz = mode === 'advanced' && quiz.length
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)' }}>
        {[...Array(12)].map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: 6 + (i % 4) * 3, height: 6 + (i % 4) * 3, background: ['#8B5CF6', '#FBBF24', '#3B82F6', '#EC4899', '#F59E0B', '#10B981'][i % 6], left: `${10 + (i * 7) % 80}%`, top: `${20 + (i * 5) % 40}%` }}
            animate={{ y: [0, -35], opacity: [1, 0], rotate: [0, 360] }} transition={{ duration: 1.6, delay: i * 0.08, repeat: Infinity, repeatDelay: 1 }} />
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="text-center relative z-10">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)', boxShadow: '0 8px 32px rgba(139,92,246,0.3)' }}>
            {isQuiz ? <TrophyIcon size={40} color="#FBBF24" /> : <StarIcon size={40} color="#FBBF24" />}
          </div>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.8rem', fontWeight: 700, color: 'white', margin: '0 0 4px' }}>STORY COMPLETE!</h2>
          {isQuiz ? (
            <p style={{ marginBottom: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontFamily: "'Nunito', sans-serif" }}>
              You answered <span style={{ color: '#A78BFA', fontWeight: 800 }}>{correctCount} / {quiz.length}</span> right, {childName}!
            </p>
          ) : (
            <p style={{ marginBottom: '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontFamily: "'Nunito', sans-serif" }}>
              {mode === 'listen' ? `Great listening, ${childName}!` : `Great reading, ${childName}!`}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ borderRadius: '20px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <BoltIcon size={18} color="#A78BFA" />
              </div>
              <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.25rem', fontWeight: 700, color: '#A78BFA' }}>+{50 + (isQuiz ? correctCount * 10 : 0)}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: "'Nunito', sans-serif" }}>XP</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('home')} style={{ maxWidth: '300px' }}>CONTINUE</button>
        </motion.div>
      </div>
    )
  }

  // ---------- Comprehension quiz (advanced) ----------
  if (phase === 'quiz') {
    const q = quiz[qIdx]
    return (
      <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0F172A', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <motion.button onClick={() => navigate('story')} whileTap={{ scale: 0.9 }}
            style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
            <BackArrowIcon size={16} color="rgba(255,255,255,0.7)" />
          </motion.button>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: 'white', margin: 0, flex: 1 }}>Comprehension Quiz</p>
          <div style={{ padding: '3px 10px', borderRadius: '9999px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: '#A78BFA' }}>{qIdx + 1} / {quiz.length}</span>
          </div>
        </div>

        {/* progress */}
        <div style={{ padding: '0 1rem', flexShrink: 0 }}>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${((qIdx + (selected !== null ? 1 : 0)) / quiz.length) * 100}%` }} style={{ height: '100%', background: 'linear-gradient(90deg,#8B5CF6,#A78BFA)' }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding: '1.25rem 1rem' }}>
          <motion.div key={qIdx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.1rem', marginBottom: '1rem' }}>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.15rem', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.4 }}>{q.question}</p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt, i) => {
              const isPicked = selected === i
              const isAnswer = i === q.answer
              const reveal = selected !== null
              let bg = 'rgba(255,255,255,0.06)', border = 'rgba(255,255,255,0.1)'
              if (reveal && isAnswer) { bg = 'rgba(16,185,129,0.18)'; border = 'rgba(16,185,129,0.5)' }
              else if (reveal && isPicked) { bg = 'rgba(239,68,68,0.16)'; border = 'rgba(239,68,68,0.5)' }
              return (
                <motion.button key={i} onClick={() => answerQuiz(i)} disabled={reveal} whileTap={reveal ? {} : { scale: 0.98 }}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem 1rem', borderRadius: '16px', background: bg, border: `1px solid ${border}`, cursor: reveal ? 'default' : 'pointer', textAlign: 'left', width: '100%' }}>
                  <span style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1rem', fontWeight: 700, color: '#A78BFA', width: 16 }}>{['A', 'B', 'C', 'D'][i]}</span>
                  <span style={{ flex: 1, fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{opt}</span>
                  {reveal && isAnswer && <CheckIcon size={16} color="#10B981" />}
                  {reveal && isPicked && !isAnswer && <CloseIcon size={14} color="#EF4444" />}
                </motion.button>
              )
            })}
          </div>

          {q.hint && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              {showHint ? (
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', margin: 0 }}>Hint: {q.hint}</p>
              ) : (
                <button onClick={() => setShowHint(true)} style={{ background: 'none', border: 'none', color: '#A78BFA', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Need a hint?</button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const progress = ((sceneIndex + 1) / story.scenes.length) * 100

  // ---------- Story (mode-specific body) ----------
  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: '#0F172A', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <motion.button onClick={() => navigate('story')} whileTap={{ scale: 0.9 }}
          style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
          <BackArrowIcon size={16} color="rgba(255,255,255,0.7)" />
        </motion.button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: 'white', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{story.title}</p>
        </div>
        {/* reading-mode badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '9999px', background: `${rc.color}22`, border: `1px solid ${rc.color}55` }}>
          <rc.Icon size={12} color={rc.color} />
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.62rem', fontWeight: 700, color: rc.color }}>{rc.label}</span>
        </div>
      </div>

      {/* Chapter progress */}
      <div style={{ padding: '0 1rem 0.5rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: `linear-gradient(90deg,${rc.color},${rc.color}99)` }} />
          </div>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>Chapter {sceneIndex + 1} of {story.scenes.length}</span>
        </div>
      </div>

      {/* Illustration */}
      <AnimatePresence mode="wait">
        <motion.div key={sceneIndex} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ display: 'flex', justifyContent: 'center', padding: '0.25rem 1rem 0.5rem', flexShrink: 0 }}>
          <div style={{ width: '100%', height: mode === 'listen' ? '220px' : '150px', borderRadius: '20px', overflow: 'hidden', background: scene?.background || 'linear-gradient(180deg,#1a2a1a,#0d2818)', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
            <img src={scene?.image} alt="Scene" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            {mode === 'listen' && (
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                style={{ position: 'absolute', bottom: 10, left: 10, width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${character.color}`, boxShadow: `0 6px 18px ${character.color}55` }}>
                <img src={character.image} alt={character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Body */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '0 1rem', WebkitOverflowScrolling: 'touch' }}>
        {mode === 'listen' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '40px', marginBottom: '0.75rem' }}>
              {[...Array(9)].map((_, i) => (
                <motion.div key={i} style={{ width: '5px', borderRadius: '3px', background: rc.color }}
                  animate={{ height: isPlaying ? [8, 26, 8] : 8 }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.08 }} />
              ))}
            </div>
            <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.05rem', fontWeight: 700, color: 'white', margin: 0 }}>
              {isPlaying ? `${guideName} is telling the story…` : 'Tap play to hear this part'}
            </p>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: '6px 0 0' }}>Listen along, then tap Next</p>
          </div>
        )}

        {mode === 'beginner' && (
          <div style={{ padding: '0.25rem 0 1rem' }}>
            {/* words-read progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 2px 12px' }}>
              <div style={{ flex: 1, height: '7px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${(Math.min(readIdx, wordCount) / Math.max(1, wordCount)) * 100}%` }} style={{ height: '100%', background: 'linear-gradient(90deg,#10B981,#34D399)' }} />
              </div>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{Math.min(readIdx, wordCount)} / {wordCount} words</span>
            </div>

            {/* tap-to-read card */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.15rem 1rem 1.35rem' }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '1.55rem', lineHeight: 2.05, fontWeight: 700, margin: 0 }}>
                {tokens.map((t, i) => {
                  if (!t.isWord) return <span key={i}>{t.text}</span>
                  const modeling = modelIdx >= 0
                  const modeled = modeling && t.order <= modelIdx
                  const read = !modeling && t.order < readIdx
                  const target = !modeling && !celebrate && t.order === readIdx
                  let color = 'rgba(255,255,255,0.5)', background = 'transparent', boxShadow = 'none'
                  if (modeled) color = '#93C5FD'
                  else if (read) color = '#34D399'
                  else if (target) { color = '#0F172A'; background = '#FBBF24'; boxShadow = '0 0 0 3px rgba(251,191,36,0.35)' }
                  return (
                    <span key={i} onClick={() => tapWord(t)}
                      style={{ position: 'relative', cursor: 'pointer', display: 'inline-block', borderRadius: '9px', padding: '2px 5px', color, background, boxShadow, transition: 'color 0.15s, background 0.15s' }}>
                      {t.text}
                      {target && (
                        <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 0.9, repeat: Infinity }}
                          style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '3px' }}>
                          <PointerCaret />
                        </motion.span>
                      )}
                    </span>
                  )
                })}
              </p>
            </div>

            {/* helper / celebration */}
            {celebrate ? (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <StarIcon size={16} color="#FBBF24" />
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#34D399' }}>You read the whole page!</span>
                <StarIcon size={16} color="#FBBF24" />
              </motion.div>
            ) : (
              <p style={{ textAlign: 'center', fontFamily: "'Nunito', sans-serif", fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0.85rem 0 0' }}>
                {modelIdx >= 0 ? 'Follow along as I read…' : 'Tap the glowing word to read it out loud'}
              </p>
            )}
          </div>
        )}

        {mode === 'advanced' && (
          <div style={{ padding: '0.25rem 0 1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.1rem 1.15rem' }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '1.02rem', lineHeight: 1.75, fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{scene?.text}</p>
            </div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', margin: '0.75rem 2px 0' }}>
              Read carefully — a comprehension quiz comes at the end.
            </p>
          </div>
        )}
      </div>

      {/* Audio control row */}
      <div style={{ padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <motion.button onClick={togglePlay} whileTap={{ scale: 0.9 }}
          style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg,${rc.color},${rc.color}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', boxShadow: `0 4px 16px ${rc.color}55` }}>
          {isPlaying ? <PauseIcon size={16} color="white" /> : <PlayIcon size={16} color="white" />}
        </motion.button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            {mode === 'advanced' ? 'Read it aloud' : mode === 'beginner' ? 'Hear the sentence' : 'Hear the story'}
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            {isPlaying ? 'Playing…' : mode === 'beginner' ? 'I’ll model it for you' : 'Tap to play'}
          </p>
        </div>
        {mode === 'beginner' ? (
          <motion.button onClick={() => speakWord(targetWord, true)} disabled={celebrate || !targetWord} whileTap={{ scale: 0.92 }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', borderRadius: '9999px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', cursor: celebrate || !targetWord ? 'default' : 'pointer', opacity: celebrate || !targetWord ? 0.4 : 1 }}>
            <VoiceOnIcon size={13} color="#FBBF24" />
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: '#FBBF24' }}>Sound out</span>
          </motion.button>
        ) : (
          <motion.button onClick={playFull} whileTap={{ scale: 0.92 }}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 11px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            <RefreshIcon size={13} color="rgba(255,255,255,0.6)" />
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Again</span>
          </motion.button>
        )}
      </div>

      {/* Advance */}
      <div style={{ padding: '0.4rem 1rem 1rem', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button className="btn btn-primary" onClick={advanceOrFinish} style={{ maxWidth: '100%' }}>
          {sceneIndex < story.scenes.length - 1 ? 'NEXT' : (mode === 'advanced' && quiz.length ? 'START QUIZ' : 'FINISH')}
        </button>
      </div>
    </div>
  )
}
