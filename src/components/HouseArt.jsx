// Rendered SVG artwork for every house item & pet — replaces emoji so the room
// reads like painted illustration. Each piece is drawn on a 0..64 viewBox with its
// "ground contact" near the bottom-center, so it sits correctly on the floor.

// 5-point star helper (reused across items)
function star(cx, cy, r, fill, key) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5
    const rad = i % 2 ? r * 0.44 : r
    pts.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`)
  }
  return <polygon key={key} points={pts.join(' ')} fill={fill} />
}

const WOOD = '#B5793D', WOOD_D = '#96602E', WOOD_L = '#CD9354'

function art(id) {
  switch (id) {
    // ---------------- Furniture ----------------
    case 'cozy-bed':
      return (
        <g>
          <rect x="10" y="48" width="4" height="9" rx="1.5" fill={WOOD_D} />
          <rect x="50" y="48" width="4" height="9" rx="1.5" fill={WOOD_D} />
          <rect x="48" y="30" width="8" height="24" rx="3" fill={WOOD} />
          <rect x="49.5" y="31" width="3" height="22" rx="1.5" fill={WOOD_L} />
          <rect x="8" y="20" width="9" height="34" rx="3" fill={WOOD} />
          <rect x="9.5" y="21.5" width="3" height="31" rx="1.5" fill={WOOD_L} />
          <circle cx="12.5" cy="20" r="3" fill={WOOD} />
          <rect x="12" y="40" width="40" height="12" rx="4" fill="#F5EEDD" />
          <path d="M26 40 h24 a4 4 0 0 1 4 4 v6 a2 2 0 0 1 -2 2 H26 z" fill="#7C6BD9" />
          <path d="M26 40 h24 a4 4 0 0 1 4 4 v2 H26 z" fill="#8B78E6" />
          {star(43, 46, 3.2, '#FBBF24', 's')}
          <rect x="14" y="33" width="16" height="11" rx="4" fill="#FFFFFF" />
          <rect x="14" y="33" width="16" height="5" rx="2.5" fill="#FBE8F1" />
          {star(22, 33, 5.5, '#F472B6', 'p')}
        </g>
      )
    case 'pink-armchair':
      return (
        <g>
          <rect x="16" y="50" width="4" height="7" rx="1.5" fill={WOOD_D} />
          <rect x="44" y="50" width="4" height="7" rx="1.5" fill={WOOD_D} />
          <rect x="14" y="18" width="36" height="30" rx="12" fill="#F9A8D4" />
          <rect x="10" y="30" width="10" height="23" rx="5" fill="#F9A8D4" />
          <rect x="44" y="30" width="10" height="23" rx="5" fill="#F9A8D4" />
          <rect x="12" y="36" width="40" height="16" rx="8" fill="#F472B6" />
          <rect x="19" y="33" width="26" height="13" rx="6" fill="#FBC7E0" />
          {star(39, 27, 6.5, '#FBBF24', 's')}
        </g>
      )
    case 'bookshelf':
      return (
        <g>
          <rect x="12" y="9" width="40" height="48" rx="3" fill={WOOD} />
          <rect x="15" y="12" width="34" height="42" rx="2" fill="#7A4E26" />
          <rect x="15" y="26" width="34" height="3" fill={WOOD} />
          <rect x="15" y="40" width="34" height="3" fill={WOOD} />
          <rect x="17" y="15" width="4" height="11" fill="#EF6F6F" />
          <rect x="22" y="14" width="4" height="12" fill="#6FA8EF" />
          <rect x="27" y="16" width="4" height="10" fill="#F4B740" />
          <rect x="32" y="15" width="4" height="11" fill="#7ED07E" />
          <path d="M42 26 q-3 -2 0 -8 q3 6 0 8z" fill="#4FD08C" />
          <rect x="17" y="30" width="4" height="10" fill="#7ED07E" />
          <rect x="22" y="29" width="4" height="11" fill="#EF6F6F" />
          <rect x="27" y="31" width="4" height="9" fill="#6FA8EF" />
          {star(40, 34, 3.4, '#FBBF24', 's')}
          <rect x="18" y="44" width="12" height="8" rx="1.5" fill="#B5793D" />
          <rect x="18" y="44" width="12" height="3" rx="1.5" fill="#CD9354" />
        </g>
      )
    case 'star-lamp':
      return (
        <g>
          <rect x="30" y="28" width="4" height="26" fill="#9AA0A6" />
          <rect x="22" y="53" width="20" height="4" rx="2" fill="#7A7F85" />
          {star(32, 20, 15, '#F59E0B', 'o')}
          {star(32, 20, 11, '#FBBF24', 'm')}
          {star(32, 19, 5, '#FDE68A', 'i')}
        </g>
      )
    case 'wooden-chair':
      return (
        <g>
          <rect x="18" y="18" width="4" height="36" fill={WOOD} />
          <rect x="42" y="30" width="4" height="24" fill={WOOD} />
          <rect x="18" y="18" width="28" height="4" rx="2" fill={WOOD_L} />
          <rect x="18" y="25" width="28" height="3" rx="1.5" fill={WOOD_L} />
          <rect x="17" y="34" width="30" height="6" rx="2" fill={WOOD_L} />
          <rect x="20" y="40" width="4" height="14" fill={WOOD_D} />
          <rect x="40" y="40" width="4" height="14" fill={WOOD_D} />
        </g>
      )
    case 'potted-plant':
      return (
        <g>
          <path d="M32 40 C 20 34 20 17 30 13 C 30 26 34 34 32 40Z" fill="#3FBF80" />
          <path d="M32 40 C 44 34 44 17 34 13 C 34 26 30 34 32 40Z" fill="#34A96E" />
          <path d="M32 41 C 26 31 26 20 32 15 C 38 20 38 31 32 41Z" fill="#4FD08C" />
          <path d="M21 40 h22 l-3 16 h-16 z" fill="#E4794A" />
          <path d="M21 40 h22 l-1 5 h-20 z" fill="#F0966E" />
        </g>
      )
    case 'mushroom-lamp':
      return (
        <g>
          <rect x="28" y="38" width="8" height="16" rx="3" fill="#F5E6D0" />
          <ellipse cx="32" cy="53" rx="10" ry="3" fill="#E4D3B8" />
          <path d="M14 39 a18 13 0 0 1 36 0 z" fill="#EF5A5A" />
          <circle cx="22" cy="31" r="3" fill="#fff" />
          <circle cx="34" cy="27" r="3.6" fill="#fff" />
          <circle cx="42" cy="33" r="2.6" fill="#fff" />
        </g>
      )
    case 'acorn-trophy':
      return (
        <g>
          <ellipse cx="32" cy="40" rx="12" ry="14" fill="#C98A4A" />
          <ellipse cx="32" cy="44" rx="7" ry="8" fill="#DBA76A" />
          <path d="M20 31 a12 8 0 0 1 24 0 z" fill="#7A4E26" />
          <rect x="31" y="14" width="2.5" height="8" rx="1" fill="#7A4E26" />
          <rect x="21" y="52" width="22" height="5" rx="2" fill="#FBBF24" />
        </g>
      )
    case 'star-throne':
      return (
        <g>
          <rect x="16" y="52" width="4" height="6" fill="#6D28D9" />
          <rect x="44" y="52" width="4" height="6" fill="#6D28D9" />
          <rect x="16" y="16" width="32" height="38" rx="6" fill="#8B5CF6" />
          <rect x="12" y="30" width="8" height="24" rx="3" fill="#7C3AED" />
          <rect x="44" y="30" width="8" height="24" rx="3" fill="#7C3AED" />
          <rect x="20" y="36" width="24" height="16" rx="4" fill="#A78BFA" />
          {star(32, 15, 9, '#FBBF24', 's')}
        </g>
      )
    case 'magic-cupcake':
      return (
        <g>
          <path d="M18 36 h28 l-3 20 h-22 z" fill="#F6C233" />
          <path d="M18 36 h28 l-1 6 h-26 z" fill="#EBB021" />
          <path d="M24 38 l-2 16 M32 38 v18 M40 38 l2 16" stroke="#D89A18" strokeWidth="1.4" />
          <path d="M15 36 a17 12 0 0 1 34 0 z" fill="#F9A8D4" />
          <ellipse cx="23" cy="31" rx="7" ry="6" fill="#FBC7E0" />
          <ellipse cx="41" cy="31" rx="7" ry="6" fill="#FBC7E0" />
          <ellipse cx="32" cy="27" rx="8" ry="7" fill="#FBC7E0" />
          <circle cx="32" cy="20" r="3.4" fill="#EF5A5A" />
        </g>
      )
    case 'toy-box':
      return (
        <g>
          <rect x="16" y="34" width="32" height="22" rx="3" fill="#8B5CF6" />
          <rect x="16" y="34" width="32" height="8" rx="3" fill="#A78BFA" />
          <rect x="30" y="42" width="4" height="14" fill="#7C3AED" />
          <rect x="18" y="21" width="13" height="13" rx="2" fill="#EF6F6F" />
          <rect x="34" y="24" width="10" height="10" rx="2" fill="#6FA8EF" />
          <circle cx="24.5" cy="27.5" r="2.4" fill="#fff" />
          {star(39, 29, 3, '#FBBF24', 's')}
        </g>
      )
    case 'grand-clock':
      return (
        <g>
          <rect x="22" y="14" width="20" height="42" rx="4" fill={WOOD} />
          <path d="M22 15 l10 -7 10 7 z" fill={WOOD_D} />
          <circle cx="32" cy="27" r="8.5" fill="#F5E6D0" />
          <circle cx="32" cy="27" r="8.5" fill="none" stroke={WOOD_D} strokeWidth="1.5" />
          <path d="M32 27 v-5 M32 27 l4 2" stroke="#3B2A1A" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="32" cy="45" r="3.2" fill="#FBBF24" />
        </g>
      )

    // ---------------- Decor ----------------
    case 'wall-painting':
      return (
        <g>
          <rect x="13" y="17" width="38" height="30" rx="3" fill="#7A4E26" />
          <rect x="17" y="21" width="30" height="22" rx="2" fill="#BFE3FF" />
          <circle cx="26" cy="29" r="4" fill="#FDE68A" />
          <path d="M17 41 l8 -7 6 4 6 -6 10 9 v2 h-30z" fill="#6FB585" />
        </g>
      )
    case 'flower-vase':
      return (
        <g>
          <path d="M24 40 q-2 15 8 16 q10 -1 8 -16 z" fill="#93C5FD" />
          <path d="M24 40 h16 v3 h-16z" fill="#60A5FA" />
          <path d="M26 32 v8 M38 30 v10 M32 26 v14" stroke="#34A96E" strokeWidth="2" />
          <circle cx="26" cy="28" r="4.5" fill="#F472B6" />
          <circle cx="38" cy="26" r="4.5" fill="#FBBF24" />
          <circle cx="32" cy="22" r="4.5" fill="#EF6F6F" />
        </g>
      )
    case 'crystal-ball':
      return (
        <g>
          <rect x="23" y="46" width="18" height="8" rx="3" fill="#7A4E26" />
          <circle cx="32" cy="33" r="14" fill="#C4B5FD" />
          <circle cx="32" cy="33" r="14" fill="none" stroke="#A78BFA" strokeWidth="1.5" />
          <ellipse cx="27" cy="28" rx="4" ry="6" fill="#EDE9FE" opacity="0.85" />
        </g>
      )
    case 'fairy-lights':
      return (
        <g>
          <path d="M6 18 Q32 40 58 18" fill="none" stroke="#C99354" strokeWidth="1.6" />
          {['#FBBF24', '#F472B6', '#A78BFA', '#34D399', '#6FA8EF'].map((c, i) => {
            const x = 12 + i * 10, y = 24 + Math.sin(i) * 4
            return <g key={i}><line x1={x} y1={y - 4} x2={x} y2={y} stroke="#C99354" strokeWidth="1" /><circle cx={x} cy={y + 2} r="3.4" fill={c} /></g>
          })}
        </g>
      )
    case 'balloon':
      return (
        <g>
          <ellipse cx="32" cy="24" rx="14" ry="17" fill="#EF6F6F" />
          <ellipse cx="27" cy="18" rx="4" ry="6" fill="#FBB4B4" opacity="0.6" />
          <path d="M32 41 l-3 4 h6 z" fill="#C0453F" />
          <path d="M32 45 q5 6 0 12" stroke="#9AA0A6" strokeWidth="1.4" fill="none" />
        </g>
      )
    case 'candle':
      return (
        <g>
          <rect x="26" y="30" width="12" height="26" rx="3" fill="#FBE8F1" />
          <rect x="26" y="30" width="12" height="6" rx="3" fill="#F9D4E4" />
          <rect x="31" y="22" width="2" height="8" fill="#7A4E26" />
          <path d="M32 11 q5 7 0 11 q-5 -4 0 -11z" fill="#FBBF24" />
          <path d="M32 15 q2.5 4 0 7 q-2.5 -3 0 -7z" fill="#FDE68A" />
        </g>
      )
    case 'lantern':
      return (
        <g>
          <rect x="30" y="8" width="4" height="4" fill="#C99354" />
          <path d="M24 13 h16 v3 h-16z" fill={WOOD} />
          <rect x="24" y="16" width="16" height="30" rx="4" fill="#EF5A5A" />
          <rect x="27" y="20" width="10" height="22" rx="3" fill="#FDE68A" />
          <path d="M24 45 h16 v3 h-16z" fill={WOOD} />
        </g>
      )
    case 'rainbow':
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M9 50 a23 23 0 0 1 46 0" stroke="#EF6F6F" strokeWidth="5" />
          <path d="M14 50 a18 18 0 0 1 36 0" stroke="#F4B740" strokeWidth="5" />
          <path d="M19 50 a13 13 0 0 1 26 0" stroke="#7ED07E" strokeWidth="5" />
          <path d="M24 50 a8 8 0 0 1 16 0" stroke="#6FA8EF" strokeWidth="5" />
          <ellipse cx="10" cy="50" rx="8" ry="5" fill="#fff" stroke="none" />
          <ellipse cx="54" cy="50" rx="8" ry="5" fill="#fff" stroke="none" />
        </g>
      )
    case 'golden-acorn':
      return (
        <g>
          {star(32, 32, 16, '#F59E0B', 'o')}
          {star(32, 32, 11, '#FBBF24', 'm')}
          {star(32, 31, 5, '#FDE68A', 'i')}
        </g>
      )
    case 'friendship-pearl':
      return (
        <g>
          <path d="M12 46 q20 -20 40 0 z" fill="#F9A8D4" />
          <path d="M20 46 q12 -13 24 0z" fill="#FBC7E0" />
          <path d="M32 46 v-15 M24 46 l3 -13 M40 46 l-3 -13" stroke="#F472B6" strokeWidth="1.4" />
          <circle cx="32" cy="35" r="7.5" fill="#EDE9FE" />
          <circle cx="29" cy="32" r="2.5" fill="#fff" />
        </g>
      )
    case 'kindness-crown':
      return (
        <g>
          <path d="M15 44 h34 l-3 -23 -10 9 -4 -13 -4 13 -10 -9z" fill="#FBBF24" />
          <path d="M15 44 h34 v5 h-34z" fill="#F59E0B" />
          <circle cx="19" cy="22" r="2.6" fill="#EF6F6F" />
          <circle cx="45" cy="22" r="2.6" fill="#6FA8EF" />
          <circle cx="32" cy="30" r="3" fill="#F472B6" />
        </g>
      )
    case 'pearl-fountain':
      return (
        <g>
          <ellipse cx="32" cy="50" rx="19" ry="6" fill="#93C5FD" />
          <path d="M17 50 q0 -13 15 -13 q15 0 15 13z" fill="#BFDBFE" />
          <path d="M32 22 q-7 7 -9 15 M32 22 q7 7 9 15" stroke="#DBEAFE" strokeWidth="2.4" fill="none" />
          <ellipse cx="32" cy="27" rx="8" ry="4" fill="#93C5FD" />
          <rect x="30" y="27" width="4" height="12" fill="#DBEAFE" />
          <circle cx="32" cy="20" r="3.4" fill="#EDE9FE" />
        </g>
      )

    // ---------------- Pets ----------------
    case 'cat':
      return (
        <g>
          <path d="M50 52 q10 -2 6 -12" stroke="#E8843C" strokeWidth="5" fill="none" strokeLinecap="round" />
          <ellipse cx="32" cy="46" rx="16" ry="13" fill="#F59E4B" />
          <ellipse cx="32" cy="50" rx="9" ry="7" fill="#FCE9D2" />
          <circle cx="32" cy="30" r="13" fill="#F59E4B" />
          <path d="M20 24 l-2 -12 12 6 z" fill="#F59E4B" />
          <path d="M44 24 l2 -12 -12 6 z" fill="#F59E4B" />
          <path d="M21 22 l-1 -6 6 3 z" fill="#F7B8A0" />
          <path d="M43 22 l1 -6 -6 3 z" fill="#F7B8A0" />
          <path d="M26 20 l3 4 M32 18 v5 M38 20 l-3 4" stroke="#E07A2E" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="32" cy="34" rx="7" ry="5" fill="#FCE9D2" />
          <circle cx="27" cy="30" r="2.3" fill="#3B2A1A" />
          <circle cx="37" cy="30" r="2.3" fill="#3B2A1A" />
          <path d="M30 33 h4 l-2 2 z" fill="#EC6A8A" />
          <path d="M25 34 l-7 -1 M25 36 l-6 2 M39 34 l7 -1 M39 36 l6 2" stroke="#C98A4A" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      )
    case 'dog':
      return (
        <g>
          <ellipse cx="32" cy="48" rx="15" ry="12" fill="#D9A066" />
          <ellipse cx="32" cy="52" rx="8" ry="6" fill="#F0D6AE" />
          <ellipse cx="19" cy="31" rx="5" ry="10" fill="#B87C42" />
          <ellipse cx="45" cy="31" rx="5" ry="10" fill="#B87C42" />
          <circle cx="32" cy="30" r="13" fill="#E0AC70" />
          <ellipse cx="32" cy="35" rx="8" ry="6" fill="#F0D6AE" />
          <circle cx="27" cy="29" r="2.3" fill="#3B2A1A" />
          <circle cx="37" cy="29" r="2.3" fill="#3B2A1A" />
          <ellipse cx="32" cy="33" rx="3" ry="2.2" fill="#4A2E1A" />
          <path d="M32 35 v3" stroke="#8a5a2a" strokeWidth="1.4" />
        </g>
      )
    case 'fox':
      return (
        <g>
          <path d="M46 50 q14 2 6 -14" stroke="#E8843C" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M50 41 q6 -6 3 -12" stroke="#FBEEDD" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="30" cy="46" rx="14" ry="12" fill="#EF8A3C" />
          <ellipse cx="30" cy="50" rx="8" ry="6" fill="#FBEEDD" />
          <circle cx="30" cy="30" r="12" fill="#EF8A3C" />
          <path d="M18 24 l-3 -12 11 7 z" fill="#EF8A3C" />
          <path d="M42 24 l3 -12 -11 7 z" fill="#EF8A3C" />
          <path d="M20 22 l-1 -6 5 3 z" fill="#3B2A1A" />
          <path d="M40 22 l1 -6 -5 3 z" fill="#3B2A1A" />
          <path d="M30 24 C22 30 24 40 30 40 C36 40 38 30 30 24Z" fill="#FBEEDD" />
          <circle cx="25" cy="30" r="2.1" fill="#3B2A1A" />
          <circle cx="35" cy="30" r="2.1" fill="#3B2A1A" />
          <path d="M28 35 h4 l-2 2.5 z" fill="#3B2A1A" />
        </g>
      )
    case 'duck':
      return (
        <g>
          <path d="M44 44 q11 -3 8 -11 q-3 9 -8 5z" fill="#F6C233" />
          <ellipse cx="30" cy="44" rx="15" ry="12" fill="#FBD34D" />
          <path d="M30 40 q10 -4 12 5 q-8 3 -12 -2z" fill="#F6C233" />
          <circle cx="23" cy="30" r="10" fill="#FBD34D" />
          <circle cx="20" cy="28" r="1.9" fill="#3B2A1A" />
          <path d="M13 30 q-9 0 -9 3 q0 3 9 2 z" fill="#F59E0B" />
        </g>
      )
    case 'turtle':
      return (
        <g>
          <ellipse cx="20" cy="52" rx="5" ry="3" fill="#7BD3A0" />
          <ellipse cx="44" cy="52" rx="5" ry="3" fill="#7BD3A0" />
          <circle cx="50" cy="42" r="6" fill="#7BD3A0" />
          <circle cx="52" cy="41" r="1.4" fill="#22364a" />
          <ellipse cx="30" cy="42" rx="18" ry="13" fill="#2FA36B" />
          <ellipse cx="30" cy="40" rx="14" ry="9" fill="#3FBF80" />
          <path d="M30 31 v18 M17 41 h26 M23 34 l-3 6 M37 34 l3 6" stroke="#2A8F5E" strokeWidth="1.5" />
        </g>
      )
    case 'octopus':
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${21 + i * 5.5} 39 q -3 13 ${(i - 2) * 3} 17`} stroke="#B26AF0" strokeWidth="4" fill="none" strokeLinecap="round" />
          ))}
          <ellipse cx="32" cy="28" rx="15" ry="14" fill="#C084FC" />
          <circle cx="22" cy="31" r="2.5" fill="#F9A8D4" />
          <circle cx="42" cy="31" r="2.5" fill="#F9A8D4" />
          <ellipse cx="27" cy="26" rx="3" ry="4" fill="#fff" />
          <ellipse cx="37" cy="26" rx="3" ry="4" fill="#fff" />
          <circle cx="27" cy="27" r="1.6" fill="#3b2a4a" />
          <circle cx="37" cy="27" r="1.6" fill="#3b2a4a" />
        </g>
      )
    case 'dragon':
      return (
        <g>
          <path d="M46 50 q12 0 8 -12" stroke="#5AA9E6" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M16 38 q-11 -6 -13 4 q9 -1 13 3 z" fill="#7C6BD9" />
          <path d="M44 38 q11 -6 13 4 q-9 -1 -13 3 z" fill="#7C6BD9" />
          <ellipse cx="30" cy="44" rx="14" ry="14" fill="#5AA9E6" />
          <ellipse cx="30" cy="48" rx="8" ry="8" fill="#BFE3FF" />
          <circle cx="30" cy="26" r="12" fill="#5AA9E6" />
          <path d="M24 16 l-2 -7 5 4 z" fill="#F3D9A0" />
          <path d="M36 16 l2 -7 -5 4 z" fill="#F3D9A0" />
          <ellipse cx="30" cy="30" rx="7" ry="5" fill="#BFE3FF" />
          <circle cx="26" cy="25" r="2.2" fill="#22364a" />
          <circle cx="34" cy="25" r="2.2" fill="#22364a" />
          <circle cx="27.5" cy="30" r="1" fill="#22364a" />
          <circle cx="32.5" cy="30" r="1" fill="#22364a" />
        </g>
      )
    case 'bunny':
      return (
        <g>
          <ellipse cx="26" cy="14" rx="4" ry="11" fill="#EDE7F6" />
          <ellipse cx="38" cy="14" rx="4" ry="11" fill="#EDE7F6" />
          <ellipse cx="26" cy="14" rx="2" ry="8" fill="#F7CCE0" />
          <ellipse cx="38" cy="14" rx="2" ry="8" fill="#F7CCE0" />
          <ellipse cx="32" cy="46" rx="13" ry="12" fill="#F3EEFB" />
          <circle cx="32" cy="32" r="12" fill="#F3EEFB" />
          <circle cx="24" cy="35" r="2.5" fill="#F9C6DE" />
          <circle cx="40" cy="35" r="2.5" fill="#F9C6DE" />
          <circle cx="27" cy="31" r="2" fill="#5b4a6a" />
          <circle cx="37" cy="31" r="2" fill="#5b4a6a" />
          <path d="M30 35 h4 l-2 2 z" fill="#F472B6" />
        </g>
      )
    default:
      return null
  }
}

// Renders a house item / pet as an SVG illustration.
// Falls back to a wrapped-gift illustration for unknown ids.
export function ItemArt({ id, size = 48, glow = false }) {
  let inner = art(id)
  if (!inner) {
    inner = (
      <g>
        <rect x="16" y="30" width="32" height="24" rx="3" fill="#A78BFA" />
        <rect x="16" y="30" width="32" height="8" rx="3" fill="#C4B5FD" />
        <rect x="30" y="30" width="4" height="24" fill="#7C3AED" />
        <path d="M32 30 q-6 -10 -10 -4 q-2 4 10 4 q12 0 10 -4 q-4 -6 -10 4z" fill="#7C3AED" />
      </g>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{
      display: 'block', overflow: 'visible',
      filter: `drop-shadow(0 3px 3px rgba(0,0,0,0.28))${glow ? ' drop-shadow(0 0 6px rgba(139,92,246,0.9))' : ''}`,
    }}>
      {inner}
    </svg>
  )
}
