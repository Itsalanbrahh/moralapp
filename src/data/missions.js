export const missions = {
  'forest-treasure': {
    id: 'forest-treasure',
    title: 'The Enchanted Forest',
    image: '/assets/stories/forest-path.png',
    world: 'forest',
    description: 'Find the hidden golden acorn deep in the enchanted forest!',
    difficulty: 1,
    steps: [
      {
        id: 'start',
        text: "You enter the Enchanted Forest! The trees are tall and the path splits in two. Which way do you go?",
        image: '/assets/stories/forest-path.png',
        type: 'choice',
        choices: [
          { text: 'Left — toward the sparkling stream', next: 'stream' },
          { text: 'Right — toward the mushroom grove', next: 'mushroom' },
        ],
      },
      {
        id: 'stream',
        text: "You follow the stream and find a family of ducks! They look worried — their duckling is stuck on a rock in the water!",
        image: '/assets/stories/whisperwood-meadow.png',
        type: 'choice',
        choices: [
          { text: 'Help the duckling!', next: 'help-duck', reward: { xp: 25, stars: 1, badge: { id: 'duck-helper', name: 'Duck Helper', icon: 'duck' }, pet: { id: 'duck', name: 'Waddles', emoji: '🦆' } } },
          { text: 'Keep walking', next: 'bridge' },
        ],
      },
      {
        id: 'help-duck',
        text: "You carefully wade into the water and carry the little duckling to safety! The mama duck quacks happily and shows you a secret shortcut!",
        image: '/assets/stories/whisperwood-meadow.png',
        type: 'narrative',
        next: 'bridge',
      },
      {
        id: 'mushroom',
        text: "The mushroom grove is beautiful! Big colorful mushrooms everywhere. But wait — one of them is moving! It's a tiny mushroom creature! 'Help!' it squeaks.",
        image: '/assets/stories/forest-path.png',
        type: 'choice',
        choices: [
          { text: 'Help find its home!', next: 'mushroom-help', reward: { xp: 25, stars: 1, badge: { id: 'mushroom-friend', name: 'Mushroom Friend', icon: 'mushroom' } } },
          { text: 'Keep going', next: 'bridge' },
        ],
      },
      {
        id: 'mushroom-help',
        text: "You search around and find the mushroom-home wedged under a root! With a big push, you free it! The creature gives you a tiny glowing mushroom-lamp!",
        image: '/assets/stories/forest-path.png',
        type: 'reward',
        reward: { furniture: { id: 'mushroom-lamp', name: 'Mushroom Lamp', room: 'livingRoom' } },
        next: 'bridge',
      },
      {
        id: 'bridge',
        text: "You reach a rickety old bridge over a deep ravine. On the other side, you can see something glowing — it must be the golden acorn!",
        image: '/assets/stories/forest-path.png',
        type: 'choice',
        choices: [
          { text: 'Cross carefully, one step at a time', next: 'treasure' },
          { text: 'Look for another way around', next: 'treasure' },
        ],
      },
      {
        id: 'treasure',
        text: "You made it across! And there it is — the GOLDEN ACORN, sitting on a velvet moss bed, glowing like a tiny sun! You did it!",
        image: '/assets/stories/whisperwood-finale.png',
        type: 'victory',
        reward: {
          xp: 50, stars: 3,
          gear: { id: 'golden-acorn', name: 'Golden Acorn' },
          furniture: { id: 'acorn-trophy', name: 'Acorn Trophy Shelf', room: 'livingRoom' },
          pet: { id: 'fox', name: 'Pip', emoji: '🦊' },
        },
      },
    ],
  },
  'ocean-adventure': {
    id: 'ocean-adventure',
    title: 'The Coral Kingdom',
    image: '/assets/stories/ocean-kingdom.png',
    world: 'ocean',
    description: 'Dive deep to find the legendary Pearl of Friendship!',
    difficulty: 2,
    steps: [
      {
        id: 'start',
        text: "Splash! You dive into the crystal-clear ocean. Colorful fish swim all around you! A friendly seahorse floats up to guide you.",
        image: '/assets/stories/ocean-kingdom.png',
        type: 'choice',
        choices: [
          { text: 'Follow the seahorse!', next: 'coral' },
          { text: 'Explore the coral reef first!', next: 'reef' },
        ],
      },
      {
        id: 'coral',
        text: "The seahorse leads you through a maze of beautiful coral. You hear someone crying... it's a little octopus who lost its favorite shell!",
        image: '/assets/stories/ocean-kingdom.png',
        type: 'choice',
        choices: [
          { text: 'Help find the shell!', next: 'octopus-help', reward: { xp: 25, stars: 1, badge: { id: 'shell-finder', name: 'Shell Finder' }, pet: { id: 'octopus', name: 'Inky', emoji: '🐙' } } },
          { text: 'Ask the fish if they saw it', next: 'octopus-help' },
        ],
      },
      {
        id: 'reef',
        text: "The reef is amazing! You see a sea turtle tangled in some seaweed. 'Oh dear, I can't move!' it says.",
        image: '/assets/stories/ocean-kingdom.png',
        type: 'choice',
        choices: [
          { text: 'Gently untangle the turtle!', next: 'turtle-help', reward: { xp: 25, stars: 1, badge: { id: 'turtle-saver', name: 'Turtle Saver' } } },
        ],
      },
      {
        id: 'octopus-help',
        text: "You search high and low... and find the shell hiding in a sea anemone! The octopus is SO happy! The Pearl is just ahead!",
        image: '/assets/stories/ocean-kingdom.png',
        type: 'narrative',
        next: 'pearl',
      },
      {
        id: 'turtle-help',
        text: "Carefully, you pull away the seaweed. 'Thank you, kind friend!' says the turtle. The Pearl of Friendship is in the Grotto of Echoes!",
        image: '/assets/stories/ocean-kingdom.png',
        type: 'narrative',
        next: 'pearl',
      },
      {
        id: 'pearl',
        text: "You enter a magical underwater cave. In the center, on a bed of rainbow coral, sits the PEARL OF FRIENDSHIP — glowing with a warm, pink light!",
        image: '/assets/stories/whisperwood-finale.png',
        type: 'victory',
        reward: {
          xp: 50, stars: 3,
          gear: { id: 'friendship-pearl', name: 'Pearl of Friendship' },
          furniture: { id: 'pearl-fountain', name: 'Pearl Fountain', room: 'garden' },
          pet: { id: 'turtle', name: 'Shelly', emoji: '🐢' },
        },
      },
    ],
  },
  'castle-mystery': {
    id: 'castle-mystery',
    title: 'The Friendly Castle',
    image: '/assets/stories/castle.png',
    world: 'castle',
    description: 'Explore the friendly castle and find the Crown of Kindness!',
    difficulty: 3,
    steps: [
      {
        id: 'start',
        text: "You stand before a grand castle with rainbow flags fluttering! The drawbridge is down and a friendly guard waves at you.",
        image: '/assets/stories/castle.png',
        type: 'choice',
        choices: [
          { text: 'Enter through the front door!', next: 'hall' },
          { text: 'Sneak through the garden!', next: 'garden' },
        ],
      },
      {
        id: 'hall',
        text: "The Great Hall is enormous! Paintings on the walls seem to watch you. One painting winks! 'The Crown is in the Tower of Stars!'",
        image: '/assets/stories/castle.png',
        type: 'narrative',
        next: 'kitchen',
      },
      {
        id: 'garden',
        text: "The castle garden is beautiful! Roses, fountains, and... a little dragon sitting by the fountain, looking sad.",
        image: '/assets/stories/castle.png',
        type: 'choice',
        choices: [
          { text: 'Help the dragon find its friend!', next: 'dragon-help', reward: { xp: 30, stars: 1, badge: { id: 'dragon-pal', name: 'Dragon Pal' }, pet: { id: 'dragon', name: 'Ember', emoji: '🐉' } } },
        ],
      },
      {
        id: 'dragon-help',
        text: "You search the garden together and find a little phoenix hiding behind a bush! 'SURPRISE!' They hug and you all laugh together!",
        image: '/assets/stories/castle.png',
        type: 'narrative',
        next: 'kitchen',
      },
      {
        id: 'kitchen',
        text: "You find the castle kitchen! A chef-hat wearing mouse squeaks: 'The Key of Friendship? I baked it into a cake!'",
        image: '/assets/stories/castle.png',
        type: 'reward',
        reward: { xp: 20, furniture: { id: 'magic-cupcake', name: 'Magic Cupcake Display', room: 'kitchen' } },
        next: 'tower',
      },
      {
        id: 'tower',
        text: "You climb the Tower of Stars! At the top, on a cloud-soft cushion, rests the CROWN OF KINDNESS — made of starlight and flowers!",
        image: '/assets/stories/whisperwood-finale.png',
        type: 'victory',
        reward: {
          xp: 60, stars: 3,
          gear: { id: 'kindness-crown', name: 'Crown of Kindness' },
          furniture: { id: 'star-throne', name: 'Star Throne', room: 'bedroom' },
          pet: { id: 'dragon', name: 'Ember', emoji: '🐉' },
        },
      },
    ],
  },
}

export const getMission = (id) => missions[id]
export const getAllMissions = () => Object.values(missions)
