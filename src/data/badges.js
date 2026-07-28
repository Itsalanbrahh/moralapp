// Metadata for the badges kids can earn. `art` maps to a BadgeArt medallion.
export const BADGES = {
  'duck-helper': { name: 'Duck Helper', desc: 'Rescued a stuck duckling in the Enchanted Forest.', art: 'heart' },
  'mushroom-friend': { name: 'Mushroom Friend', desc: 'Helped a tiny mushroom creature find its way home.', art: 'tree' },
  'shell-finder': { name: 'Shell Finder', desc: 'Found the little octopus’s favorite lost shell.', art: 'compass' },
  'turtle-saver': { name: 'Turtle Saver', desc: 'Gently freed a sea turtle tangled in seaweed.', art: 'shield' },
  'dragon-pal': { name: 'Dragon Pal', desc: 'Helped a lonely dragon find a friend at the castle.', art: 'lantern' },
}

const STORY_TITLES = {
  'story-three-lights': 'The Three Lights of Whisperwood',
}

// Resolve display info for any earned badge object ({ id, name, ... }).
export function getBadgeMeta(badge) {
  const id = badge?.id || ''
  if (BADGES[id]) return BADGES[id]
  if (id.startsWith('story-')) {
    const title = STORY_TITLES[id]
    return {
      name: badge?.name || 'Story Complete',
      desc: title ? `Finished the story “${title}”.` : 'Finished a story adventure.',
      art: 'star',
    }
  }
  return { name: badge?.name || 'Badge', desc: badge?.description || 'A special achievement you earned!', art: 'star' }
}
