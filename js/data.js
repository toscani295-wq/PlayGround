/* ============================================================
   POKÉSPIRE — game data
   ============================================================ */

export const TYPES = {
  normal:  { label: 'Normal',   color: '#c6c2a8', icon: 'star' },
  fire:    { label: 'Fire',     color: '#e77b4b', icon: 'flame' },
  water:   { label: 'Water',    color: '#62a9d8', icon: 'drop' },
  grass:   { label: 'Grass',    color: '#6fbf73', icon: 'leaf' },
  electric:{ label: 'Electric', color: '#e7c84c', icon: 'bolt' },
  psychic: { label: 'Psychic',  color: '#cf6e9e', icon: 'eye' },
  poison:  { label: 'Poison',   color: '#a971b8', icon: 'bubble' },
  rock:    { label: 'Rock',     color: '#b5a169', icon: 'hex' },
  ground:  { label: 'Ground',   color: '#c8a66a', icon: 'mound' },
  flying:  { label: 'Flying',   color: '#9da5d6', icon: 'wing' },
  dragon:  { label: 'Dragon',   color: '#8c6de0', icon: 'diamond' },
  dark:    { label: 'Dark',     color: '#8a776a', icon: 'moon' },
  item:    { label: 'Item',     color: '#d2ad63', icon: 'bag' }
};

export const ICONS = {
  sword: '<path d="m14.7 3.6 5.7 5.7-8.8 8.8H6.2v-5.4l8.5-9.1Z"/><path d="m4 20 4.3-4.3M13 6.3l4.7 4.7"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 2.8 8.1 7 10 4.2-1.9 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.8 1.8 3.6-4"/>',
  flame: '<path d="M12 21c4 0 6.5-2.6 6.5-6.2 0-2.6-1.3-4.8-3.4-6.5.1 1.8-.8 3.1-2 3.7.4-3.8-1.5-6.9-4.6-8.5.2 3-1.2 4.6-2.4 6.4-.9 1.4-1.4 2.9-1.4 4.6C4.7 18.2 7.7 21 12 21Z"/><path d="M12 21c1.9 0 3-1.4 3-3.1 0-1.5-1-2.6-2.1-3.6 0 1.2-.8 1.8-1.4 2.4-.5.5-.9 1.1-.9 2 0 1.4.8 2.3 1.4 2.3Z"/>',
  drop: '<path d="M12 3.2S6 10 6 14.4A6 6 0 0 0 18 14.4C18 10 12 3.2 12 3.2Z"/><path d="M9.2 14.7c0 1.7 1.1 2.8 2.8 2.8"/>',
  leaf: '<path d="M20 4C12 4 5 7.6 5 14.2c0 2.4 1.5 4.4 3.8 4.4 5.4 0 9.7-6.2 11.2-14.6Z"/><path d="M5.2 20.5c1.1-5.3 4.6-9.4 9.3-12"/>',
  bolt: '<path d="m13.2 2-8 11.2h6.1L10.8 22l8-12.3h-6.1L13.2 2Z"/>',
  eye: '<path d="M2.6 12S6.2 5.7 12 5.7 21.4 12 21.4 12 17.8 18.3 12 18.3 2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="3.1"/><path d="M12 8.9v.1"/>',
  bubble: '<circle cx="8" cy="15" r="4.2"/><circle cx="15.6" cy="9.2" r="3.2"/><circle cx="17" cy="17" r="2.2"/>',
  hex: '<path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><path d="m9 12 2 2 4-4"/>',
  mound: '<path d="M3 18.5 9 9l3.4 5.2L15.5 10 21 18.5H3Z"/><path d="M3 21h18"/>',
  wing: '<path d="M21 5c-6.6.4-11 3.3-13.3 8.2L3 20c6.5-.5 11.2-3.8 13.6-9.2L21 5Z"/><path d="M7.5 14.2c2.2-.6 4.4-2 6.2-4.4"/>',
  diamond: '<path d="m12 2.8 5.4 5.4L12 21 6.6 8.2 12 2.8Z"/><path d="m6.6 8.2 10.8 0M12 2.8v18.2"/>',
  moon: '<path d="M20.3 15.1A8.5 8.5 0 0 1 8.9 3.7 8.7 8.7 0 1 0 20.3 15.1Z"/><path d="m17 4 .3 1.1 1.1.3-1.1.3L17 6.8l-.3-1.1-1.1-.3 1.1-.3L17 4Z"/>',
  bag: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2M9.5 12h5"/>',
  star: '<path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.2l5.9-.8L12 3Z"/>',
  paw: '<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7.2 16.5c0-2.3 2.2-4 4.8-4s4.8 1.7 4.8 4c0 2.1-1.6 3.2-3.4 3.2-.8 0-1-.3-1.4-.3s-.6.3-1.4.3c-1.8 0-3.4-1.1-3.4-3.2Z"/>',
  tent: '<path d="m12 4 7 16H5L12 4Z"/><path d="M12 4v16M8.4 20l3.6-8 3.6 8"/>',
  chest: '<path d="M4 10h16v10H4V10Z"/><path d="M4 10V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M4 13h16M10 13v3h4v-3"/>',
  crown: '<path d="m3 7 4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7Z"/><path d="M5 19h14"/>',
  skull: '<path d="M12 3a7.5 7.5 0 0 0-7.5 7.5c0 2.6 1.3 4.4 3 5.5v4h9v-4c1.7-1.1 3-2.9 3-5.5A7.5 7.5 0 0 0 12 3Z"/><circle cx="9" cy="11" r="1.4"/><circle cx="15" cy="11" r="1.4"/><path d="M10 16h4"/>',
  grass: '<path d="M4 20c0-8 5.5-13 16-14-1 9-6 14-13 14"/><path d="M4 20c2.8-5 6.4-8.2 11-10.4"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z"/><path d="M9 4v14M15 6v14"/>',
  deck: '<rect x="5" y="4" width="12" height="16" rx="1.5"/><path d="M8 8h6M8 12h6M8 16h3"/>',
  party: '<circle cx="9" cy="9" r="2.5"/><circle cx="16" cy="10" r="2"/><path d="M4.5 19c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5M13 19c0-1.8 1.3-3.2 3-3.2s3 1.4 3 3.2"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrowUp: '<path d="M12 20V4M5 11l7-7 7 7"/>',
  arrowDown: '<path d="M12 4v16M5 13l7 7 7-7"/>',
  heal: '<path d="M12 20s-7-4.2-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8c0 5-7 9.2-7 9.2Z"/><path d="M9 12h6M12 9v6"/>',
  sword2: '<path d="M5 4h4l10 10-4 4L5 8V4Z"/><path d="m14 14 4 4M4 20l4-4M16 4h4v4"/>',
  snow: '<path d="M12 2v20M4 6l16 12M20 6 4 18"/><path d="m9 3 3 3 3-3M9 21l3-3 3 3"/>',
  spark: '<path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z"/>',
  energy: '<path d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z"/>',
  unknown: '<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.5 2.2c-.9.5-1.3 1-1.3 2.1M12 17h.1"/>'
};

export function icon(name, cls = '') {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.unknown}</svg>`;
}

/* ---------------- Cards ---------------- */
/* dmg/block/heal/statuses/draw/energy/strength/gold; up overrides; artMon shows a caught Pokémon. */
export const CARDS = {
  tackle: {
    name: 'Tackle', type: 'normal', cost: 1, rarity: 'common', dmg: 6, up: { dmg: 3 },
    text: 'A straightforward charge. Sometimes that is enough.'
  },
  scratch: {
    name: 'Scratch', type: 'normal', cost: 1, rarity: 'common', dmg: 7, up: { dmg: 3 },
    text: 'Rake with sharp little claws.'
  },
  vine_whip: {
    name: 'Vine Whip', type: 'grass', cost: 1, rarity: 'common', dmg: 8, up: { dmg: 3 },
    text: 'A lashing green tendril.'
  },
  ember: {
    name: 'Ember', type: 'fire', cost: 1, rarity: 'common', dmg: 7, statuses: { burn: 2 }, up: { dmg: 2, burn: 1 },
    text: 'A small flame that clings and burns.'
  },
  water_gun: {
    name: 'Water Gun', type: 'water', cost: 1, rarity: 'common', dmg: 6, block: 3, up: { dmg: 2, block: 2 },
    text: 'A pressurized jet. Leaves you steady on your feet.'
  },
  bubble: {
    name: 'Bubble', type: 'water', cost: 1, rarity: 'common', dmg: 5, statuses: { weak: 1 }, up: { dmg: 2, weak: 1 },
    text: 'Soapy spheres that sap an enemy’s force.'
  },
  bite: {
    name: 'Bite', type: 'dark', cost: 1, rarity: 'common', dmg: 8, statuses: { vulnerable: 1 }, up: { dmg: 3 },
    text: 'A sudden snap that leaves a opening.'
  },
  quick_attack: {
    name: 'Quick Attack', type: 'normal', cost: 1, rarity: 'common', dmg: 4, hits: 2, up: { dmg: 1 },
    text: 'Strike twice before the foe can react.'
  },
  gust: {
    name: 'Gust', type: 'flying', cost: 1, rarity: 'common', dmg: 5, draw: 1, up: { dmg: 2 },
    text: 'A buffeting wind. Draw a card.'
  },
  poison_sting: {
    name: 'Poison Sting', type: 'poison', cost: 1, rarity: 'common', dmg: 4, statuses: { poison: 3 }, up: { dmg: 2, poison: 2 },
    text: 'A tiny barb with a lasting ache.'
  },
  rock_throw: {
    name: 'Rock Throw', type: 'rock', cost: 1, rarity: 'common', dmg: 9, block: 3, up: { dmg: 3, block: 2 },
    text: 'Hurl a stone. Keep one foot behind cover.'
  },
  string_shot: {
    name: 'String Shot', type: 'grass', cost: 1, rarity: 'common', dmg: 3, statuses: { weak: 2 }, up: { dmg: 2, weak: 1 },
    text: 'Sticky silk tangles limbs and tempers.'
  },
  sand_attack: {
    name: 'Sand Attack', type: 'ground', cost: 1, rarity: 'common', block: 5, statuses: { weak: 2 }, up: { block: 3 },
    text: 'Kick up grit to blunt the next attack.'
  },
  harden: {
    name: 'Harden', type: 'normal', cost: 1, rarity: 'common', block: 8, up: { block: 4 },
    text: 'Tense every muscle. Brace for impact.'
  },
  meditate: {
    name: 'Meditate', type: 'psychic', cost: 0, rarity: 'common', draw: 2, exhaust: true, up: { draw: 1 },
    text: 'Clear your mind. Draw 2 cards. Exhaust.'
  },
  potion: {
    name: 'Potion', type: 'item', cost: 0, rarity: 'common', heal: 12, exhaust: true, up: { heal: 7 },
    text: 'A bitter berry tonic. Heal 12 HP. Exhaust.'
  },
  focus_energy: {
    name: 'Focus Energy', type: 'normal', cost: 0, rarity: 'common', strength: 1, exhaust: true, up: { strength: 1 },
    text: 'Find the opening. Gain 1 Strength. Exhaust.'
  },

  razor_leaf: {
    name: 'Razor Leaf', type: 'grass', cost: 1, rarity: 'uncommon', dmg: 11, statuses: { poison: 1 }, up: { dmg: 4, poison: 1 },
    text: 'Sharp leaves slice and leave a sting.'
  },
  flame_wheel: {
    name: 'Flame Wheel', type: 'fire', cost: 2, rarity: 'uncommon', dmg: 14, statuses: { burn: 3 }, up: { dmg: 5, burn: 2 },
    text: 'A rolling wheel of fire.'
  },
  withdraw: {
    name: 'Withdraw', type: 'water', cost: 1, rarity: 'uncommon', block: 11, up: { block: 5 },
    text: 'Pull into your shell and wait out the blow.'
  },
  leech_seed: {
    name: 'Leech Seed', type: 'grass', cost: 1, rarity: 'uncommon', block: 4, statuses: { poison: 4 }, up: { block: 3, poison: 2 },
    text: 'Plant a seed. It feeds on the foe and shields you.'
  },
  thunder_shock: {
    name: 'Thunder Shock', type: 'electric', cost: 1, rarity: 'uncommon', dmg: 8, statuses: { vulnerable: 1 }, up: { dmg: 3, vulnerable: 1 },
    text: 'A crackling jolt that leaves the foe exposed.'
  },
  acid: {
    name: 'Acid', type: 'poison', cost: 1, rarity: 'uncommon', dmg: 4, statuses: { poison: 5 }, up: { dmg: 2, poison: 3 },
    text: 'Corrosive droplets that eat through hide.'
  },
  teleport: {
    name: 'Teleport', type: 'psychic', cost: 1, rarity: 'uncommon', block: 9, draw: 2, up: { block: 3, draw: 1 },
    text: 'Blink out of danger. Draw 2 cards.'
  },
  karate_chop: {
    name: 'Karate Chop', type: 'normal', cost: 1, rarity: 'uncommon', dmg: 12, up: { dmg: 4 },
    text: 'One clean, decisive strike.'
  },
  lick: {
    name: 'Lick', type: 'dark', cost: 1, rarity: 'uncommon', dmg: 6, statuses: { poison: 5 }, up: { dmg: 2, poison: 3 },
    text: 'A cold touch that leaves a creeping dread.'
  },
  bind: {
    name: 'Bind', type: 'normal', cost: 1, rarity: 'uncommon', dmg: 7, block: 5, statuses: { weak: 2 }, up: { dmg: 2, block: 2 },
    text: 'Wrap the foe tight. It hits softer for a while.'
  },
  swift: {
    name: 'Swift', type: 'normal', cost: 1, rarity: 'uncommon', dmg: 9, pierce: true, up: { dmg: 4 },
    text: 'Never misses. Damage ignores Block.'
  },
  helping_hand: {
    name: 'Helping Hand', type: 'normal', cost: 0, rarity: 'uncommon', strength: 2, exhaust: true, up: { strength: 1 },
    text: 'A partner’s cheer. Gain 2 Strength. Exhaust.'
  },
  dragon_rage: {
    name: 'Dragon Rage', type: 'dragon', cost: 2, rarity: 'uncommon', dmg: 16, up: { dmg: 6 },
    text: 'A surge of ancient, furious power.'
  },
  glare: {
    name: 'Glare', type: 'normal', cost: 1, rarity: 'uncommon', statuses: { vulnerable: 2, weak: 2 }, up: { vulnerable: 1, weak: 1 },
    text: 'A stare that freezes the blood.'
  },
  double_team: {
    name: 'Double Team', type: 'normal', cost: 1, rarity: 'uncommon', block: 8, draw: 1, up: { block: 4 },
    text: 'Afterimages. Draw a card and raise your guard.'
  },
  iron_defense: {
    name: 'Iron Defense', type: 'rock', cost: 1, rarity: 'uncommon', block: 15, up: { block: 6 },
    text: 'Make yourself as immovable as the spire.'
  },
  swords_dance: {
    name: 'Swords Dance', type: 'normal', cost: 1, rarity: 'uncommon', strength: 3, exhaust: true, up: { strength: 2 },
    text: 'A whirling ritual of honed intent. Gain 3 Strength.'
  },
  calm_mind: {
    name: 'Calm Mind', type: 'psychic', cost: 1, rarity: 'uncommon', strength: 1, draw: 1, up: { strength: 1 },
    text: 'Steady the breath. Gain 1 Strength and draw a card.'
  },
  body_slam: {
    name: 'Body Slam', type: 'normal', cost: 2, rarity: 'uncommon', dmg: 16, statuses: { weak: 2 }, up: { dmg: 5, weak: 1 },
    text: 'A crushing weight that knocks the wind out.'
  },
  surf: {
    name: 'Surf', type: 'water', cost: 2, rarity: 'uncommon', dmg: 17, block: 6, up: { dmg: 5, block: 4 },
    text: 'Ride a wave into the fray.'
  },
  flamethrower: {
    name: 'Flamethrower', type: 'fire', cost: 2, rarity: 'uncommon', dmg: 14, statuses: { burn: 4 }, up: { dmg: 5, burn: 2 },
    text: 'A sustained torrent of flame.'
  },
  giga_drain: {
    name: 'Giga Drain', type: 'grass', cost: 2, rarity: 'uncommon', dmg: 13, heal: 7, up: { dmg: 4, heal: 4 },
    text: 'Take life from the foe and make it yours.'
  },
  sludge_bomb: {
    name: 'Sludge Bomb', type: 'poison', cost: 2, rarity: 'uncommon', dmg: 13, statuses: { poison: 6 }, up: { dmg: 4, poison: 3 },
    text: 'A lobbed glob of awful. Poisons deeply.'
  },
  thunderbolt: {
    name: 'Thunderbolt', type: 'electric', cost: 2, rarity: 'uncommon', dmg: 16, statuses: { vulnerable: 1 }, up: { dmg: 5, vulnerable: 1 },
    text: 'A bright, punishing arc of lightning.'
  },
  shadow_ball: {
    name: 'Shadow Ball', type: 'psychic', cost: 2, rarity: 'uncommon', dmg: 15, statuses: { vulnerable: 2 }, up: { dmg: 5, vulnerable: 1 },
    text: 'A sphere of gathered gloom. Exposes weakness.'
  },
  flail: {
    name: 'Flail', type: 'normal', cost: 1, rarity: 'uncommon', special: 'flail', up: { special: 2 },
    text: 'Deal damage equal to 5 plus a quarter of your missing HP.'
  },
  pay_day: {
    name: 'Pay Day', type: 'normal', cost: 1, rarity: 'uncommon', dmg: 6, gold: 8, up: { dmg: 2, gold: 5 },
    text: 'A lucky strike. Gain 8 gold.'
  },

  hyper_beam: {
    name: 'Hyper Beam', type: 'normal', cost: 3, rarity: 'rare', dmg: 34, exhaust: true, up: { dmg: 12 },
    text: 'A devastating beam. Exhaust.'
  },
  fire_blast: {
    name: 'Fire Blast', type: 'fire', cost: 3, rarity: 'rare', dmg: 26, statuses: { burn: 6 }, up: { dmg: 8, burn: 3 },
    text: 'A roaring star of fire.'
  },
  solar_beam: {
    name: 'Solar Beam', type: 'grass', cost: 3, rarity: 'rare', dmg: 28, statuses: { poison: 4 }, up: { dmg: 9, poison: 2 },
    text: 'Gather the spire’s thin light. Release.'
  },
  hydro_cannon: {
    name: 'Hydro Cannon', type: 'water', cost: 3, rarity: 'rare', dmg: 25, block: 10, up: { dmg: 8, block: 5 },
    text: 'A cannonade of water that leaves you braced.'
  },
  earthquake: {
    name: 'Earthquake', type: 'ground', cost: 2, rarity: 'rare', dmg: 20, statuses: { weak: 1 }, up: { dmg: 7, weak: 1 },
    text: 'The ground itself revolts.'
  },
  psychic: {
    name: 'Psychic', type: 'psychic', cost: 2, rarity: 'rare', dmg: 19, statuses: { vulnerable: 2 }, up: { dmg: 6, vulnerable: 1 },
    text: 'Bend the foe’s thoughts and defenses.'
  },
  hurricane: {
    name: 'Hurricane', type: 'flying', cost: 2, rarity: 'rare', dmg: 20, statuses: { weak: 1 }, up: { dmg: 7, weak: 1 },
    text: 'A howling spiral of wind and debris.'
  },
  substitute: {
    name: 'Substitute', type: 'normal', cost: 1, rarity: 'rare', block: 18, exhaust: true, up: { block: 7 },
    text: 'A decoy takes the hit. Gain 18 Block. Exhaust.'
  },
  recover: {
    name: 'Recover', type: 'psychic', cost: 1, rarity: 'rare', heal: 14, exhaust: true, up: { heal: 7 },
    text: 'Mend what is torn. Heal 14 HP. Exhaust.'
  },
  full_restore: {
    name: 'Full Restore', type: 'item', cost: 0, rarity: 'rare', heal: 28, cleanse: true, exhaust: true, up: { heal: 12 },
    text: 'Heal 28 HP and clear all ailments. Exhaust.'
  },
  metronome: {
    name: 'Metronome', type: 'normal', cost: 1, rarity: 'rare', special: 'metronome', up: { special: 1 },
    text: 'Wag a finger. Unleash a random powerful move.'
  },

  /* Signatures — added when a Pokémon is caught */
  sig_caterpie: {
    name: 'String Shot', type: 'grass', cost: 1, rarity: 'signature', dmg: 4, statuses: { weak: 2 }, artMon: 'caterpie', up: { dmg: 2, weak: 1 },
    text: 'Your Caterpie’s sticky silk. Weakens the foe.'
  },
  sig_weedle: {
    name: 'Poison Sting', type: 'poison', cost: 1, rarity: 'signature', dmg: 5, statuses: { poison: 4 }, artMon: 'weedle', up: { dmg: 2, poison: 2 },
    text: 'Your Weedle’s little barb. Poisons.'
  },
  sig_pidgey: {
    name: 'Gust', type: 'flying', cost: 1, rarity: 'signature', dmg: 6, draw: 1, artMon: 'pidgey', up: { dmg: 2 },
    text: 'Your Pidgey whips up a tailwind. Draw a card.'
  },
  sig_rattata: {
    name: 'Quick Attack', type: 'normal', cost: 1, rarity: 'signature', dmg: 4, hits: 2, artMon: 'rattata', up: { dmg: 2 },
    text: 'Your Rattata darts in twice.'
  },
  sig_oddish: {
    name: 'Acid', type: 'poison', cost: 1, rarity: 'signature', dmg: 5, statuses: { poison: 5 }, artMon: 'oddish', up: { dmg: 2, poison: 2 },
    text: 'Your Oddish spits caustic sap.'
  },
  sig_bellsprout: {
    name: 'Sleep Powder', type: 'grass', cost: 1, rarity: 'signature', dmg: 3, statuses: { weak: 2 }, block: 4, artMon: 'bellsprout', up: { dmg: 2, weak: 1 },
    text: 'Your Bellsprout scatters drowsy spores.'
  },
  sig_magikarp: {
    name: 'Flail', type: 'normal', cost: 1, rarity: 'signature', special: 'flail', artMon: 'magikarp', up: { special: 2 },
    text: 'Your Magikarp flops with surprising force.'
  },
  sig_pikachu: {
    name: 'Thunder Shock', type: 'electric', cost: 1, rarity: 'signature', dmg: 8, statuses: { vulnerable: 1 }, artMon: 'pikachu', up: { dmg: 3, vulnerable: 1 },
    text: 'Your Pikachu’s crackling greeting.'
  },
  sig_zubat: {
    name: 'Supersonic', type: 'flying', cost: 1, rarity: 'signature', statuses: { weak: 2, poison: 2 }, artMon: 'zubat', up: { weak: 1, poison: 1 },
    text: 'Your Zubat’s disorienting screech.'
  },
  sig_meowth: {
    name: 'Pay Day', type: 'normal', cost: 1, rarity: 'signature', dmg: 6, gold: 8, artMon: 'meowth', up: { dmg: 2, gold: 5 },
    text: 'Your Meowth shakes down the wilds for gold.'
  },
  sig_psyduck: {
    name: 'Confusion', type: 'psychic', cost: 1, rarity: 'signature', dmg: 8, statuses: { weak: 1 }, artMon: 'psyduck', up: { dmg: 3 },
    text: 'Your Psyduck’s headache becomes someone else’s.'
  },
  sig_growlithe: {
    name: 'Flame Wheel', type: 'fire', cost: 2, rarity: 'signature', dmg: 13, statuses: { burn: 3 }, artMon: 'growlithe', up: { dmg: 4, burn: 2 },
    text: 'Your Growlithe curls into a rolling blaze.'
  },
  sig_abra: {
    name: 'Teleport', type: 'psychic', cost: 1, rarity: 'signature', block: 9, draw: 2, artMon: 'abra', up: { block: 3, draw: 1 },
    text: 'Your Abra blinks you both out of harm.'
  },
  sig_machop: {
    name: 'Karate Chop', type: 'normal', cost: 1, rarity: 'signature', dmg: 12, artMon: 'machop', up: { dmg: 4 },
    text: 'Your Machop delivers one clean strike.'
  },
  sig_geodude: {
    name: 'Rock Throw', type: 'rock', cost: 1, rarity: 'signature', dmg: 9, block: 4, artMon: 'geodude', up: { dmg: 3, block: 2 },
    text: 'Your Geodude provides both rock and cover.'
  },
  sig_ponyta: {
    name: 'Agility', type: 'normal', cost: 1, rarity: 'signature', block: 8, draw: 1, artMon: 'ponyta', up: { block: 4 },
    text: 'Your Ponyta wheels away, leaving an opening.'
  },
  sig_gastly: {
    name: 'Lick', type: 'dark', cost: 1, rarity: 'signature', dmg: 6, statuses: { poison: 5 }, artMon: 'gastly', up: { dmg: 2, poison: 3 },
    text: 'Your Gastly’s cold, creeping touch.'
  },
  sig_onix: {
    name: 'Bind', type: 'normal', cost: 1, rarity: 'signature', dmg: 7, block: 5, statuses: { weak: 2 }, artMon: 'onix', up: { dmg: 2, block: 2 },
    text: 'Your Onix coils around the foe.'
  },
  sig_voltorb: {
    name: 'Rollout', type: 'rock', cost: 1, rarity: 'signature', dmg: 5, hits: 2, artMon: 'voltorb', up: { dmg: 2 },
    text: 'Your Voltorb rolls over the foe twice.'
  },
  sig_koffing: {
    name: 'Smog', type: 'poison', cost: 1, rarity: 'signature', dmg: 4, statuses: { poison: 5 }, artMon: 'koffing', up: { dmg: 2, poison: 3 },
    text: 'Your Koffing adds a foul cloud to the fight.'
  },
  sig_rhyhorn: {
    name: 'Horn Attack', type: 'normal', cost: 2, rarity: 'signature', dmg: 14, artMon: 'rhyhorn', up: { dmg: 5 },
    text: 'Your Rhyhorn lowers its head and charges.'
  },
  sig_staryu: {
    name: 'Swift', type: 'normal', cost: 1, rarity: 'signature', dmg: 9, pierce: true, artMon: 'staryu', up: { dmg: 4 },
    text: 'Your Staryu’s star-shaped volley never misses.'
  },
  sig_eevee: {
    name: 'Helping Hand', type: 'normal', cost: 0, rarity: 'signature', strength: 2, exhaust: true, artMon: 'eevee', up: { strength: 1 },
    text: 'Your Eevee cheers you on. Gain 2 Strength.'
  },
  sig_snorlax: {
    name: 'Rest', type: 'psychic', cost: 2, rarity: 'signature', heal: 12, block: 10, exhaust: true, artMon: 'snorlax', up: { heal: 6, block: 4 },
    text: 'Your Snorlax shares a very good nap.'
  },
  sig_dratini: {
    name: 'Dragon Rage', type: 'dragon', cost: 2, rarity: 'signature', dmg: 16, artMon: 'dratini', up: { dmg: 6 },
    text: 'Your Dratini’s inherited fury.'
  },
  sig_gengar: {
    name: 'Shadow Ball', type: 'psychic', cost: 2, rarity: 'signature', dmg: 15, statuses: { vulnerable: 2 }, artMon: 'gengar', up: { dmg: 5, vulnerable: 1 },
    text: 'Your Gengar hurls a sphere of living gloom.'
  },
  sig_dragonite: {
    name: 'Hurricane', type: 'flying', cost: 2, rarity: 'signature', dmg: 19, statuses: { weak: 1 }, artMon: 'dragonite', up: { dmg: 6, weak: 1 },
    text: 'Your Dragonite calls down a howling gale.'
  },
  sig_arbok: {
    name: 'Glare', type: 'normal', cost: 1, rarity: 'signature', statuses: { vulnerable: 2, weak: 2 }, artMon: 'arbok', up: { vulnerable: 1, weak: 1 },
    text: 'Your Arbok freezes the foe with a look.'
  },
  sig_mewtwo: {
    name: 'Psystrike', type: 'psychic', cost: 2, rarity: 'signature', dmg: 22, statuses: { vulnerable: 2 }, artMon: 'mewtwo', up: { dmg: 7, vulnerable: 1 },
    text: 'Your Mewtwo bends the battlefield to its will.'
  },
  sig_mew: {
    name: 'Metronome', type: 'normal', cost: 1, rarity: 'signature', special: 'metronome', artMon: 'mew', up: { special: 1 },
    text: 'Your Mew wags a paw. Anything could happen.'
  },
  sig_bulbasaur: {
    name: 'Leech Seed', type: 'grass', cost: 1, rarity: 'signature', block: 4, statuses: { poison: 4 }, artMon: 'bulbasaur', up: { block: 3, poison: 2 },
    text: 'Your Bulbasaur plants a hungry seed.'
  },
  sig_charmander: {
    name: 'Ember', type: 'fire', cost: 1, rarity: 'signature', dmg: 7, statuses: { burn: 2 }, artMon: 'charmander', up: { dmg: 2, burn: 1 },
    text: 'Your Charmander’s eager little flame.'
  },
  sig_squirtle: {
    name: 'Bubble', type: 'water', cost: 1, rarity: 'signature', dmg: 5, statuses: { weak: 1 }, artMon: 'squirtle', up: { dmg: 2, weak: 1 },
    text: 'Your Squirtle’s wobbling, bothersome bubbles.'
  }
};

export const STARTERS = {
  bulbasaur: {
    key: 'bulbasaur', name: 'Bulbasaur', types: ['grass', 'poison'], hp: 78, style: 'Bloom & blight',
    blurb: 'Patient and poisonous. Wear foes down with seeds and acid while you grow unkillable.',
    deck: [
      ['tackle', 5], ['vine_whip', 4], ['leech_seed', 1], ['razor_leaf', 1], ['potion', 1]
    ],
    signature: 'sig_bulbasaur', color: '#6fbf73'
  },
  charmander: {
    key: 'charmander', name: 'Charmander', types: ['fire'], hp: 72, style: 'All flame',
    blurb: 'A glass cannon with a hot temper. Stack Burn and end fights before they begin.',
    deck: [
      ['scratch', 5], ['ember', 4], ['smokescreen', 1], ['flame_wheel', 1], ['potion', 1]
    ],
    signature: 'sig_charmander', color: '#e77b4b'
  },
  squirtle: {
    key: 'squirtle', name: 'Squirtle', types: ['water'], hp: 84, style: 'Tide & guard',
    blurb: 'Steady and stubborn. Build Block, draw cards, and outlast everything on the climb.',
    deck: [
      ['tackle', 5], ['water_gun', 4], ['withdraw', 1], ['bubble', 1], ['potion', 1]
    ],
    signature: 'sig_squirtle', color: '#62a9d8'
  }
};

// A starter-only extra card that isn't in the general pool.
CARDS.smokescreen = {
  name: 'Smokescreen', type: 'fire', cost: 1, rarity: 'common', block: 4, statuses: { weak: 2 }, up: { block: 3, weak: 1 },
  text: 'A stinging veil of smoke. Weakens the foe and shields you.'
};

/* ---------------- Species ---------------- */
/* baseHp is tuned by tier; moves cycle through the pattern array. */
export const SPECIES = {
  bulbasaur: { name:'Bulbasaur', dex:1, types:['grass','poison'], baseHp:78, tier:0, signature:'sig_bulbasaur', flavor:'The seed on its back drinks the dawn.' },
  charmander: { name:'Charmander', dex:4, types:['fire'], baseHp:72, tier:0, signature:'sig_charmander', flavor:'The flame at its tail tells the truth of its mood.' },
  squirtle: { name:'Squirtle', dex:7, types:['water'], baseHp:84, tier:0, signature:'sig_squirtle', flavor:'It hides in its shell, then strikes with the tide.' },

  caterpie: {
    name:'Caterpie', dex:10, types:['grass'], baseHp:30, tier:1, signature:'sig_caterpie', flavor:'Its antennae smell of a fresh green world.',
    moves:[
      {name:'Tackle',kind:'attack',dmg:5},
      {name:'String Shot',kind:'debuff',playerStatus:{weak:1}},
      {name:'Bug Bite',kind:'attack',dmg:7}
    ], pattern:[0,0,1,2]
  },
  weedle: {
    name:'Weedle', dex:13, types:['grass','poison'], baseHp:29, tier:1, signature:'sig_weedle', flavor:'A tiny barb with a big opinion.',
    moves:[
      {name:'Poison Sting',kind:'attack',dmg:4,playerStatus:{poison:2}},
      {name:'Bug Bite',kind:'attack',dmg:6},
      {name:'Harden',kind:'defend',block:6}
    ], pattern:[0,1,2,1]
  },
  pidgey: {
    name:'Pidgey', dex:16, types:['normal','flying'], baseHp:32, tier:1, signature:'sig_pidgey', flavor:'It kicks up dust and pretends not to notice you.',
    moves:[
      {name:'Tackle',kind:'attack',dmg:6},
      {name:'Sand Attack',kind:'debuff',playerStatus:{weak:1}},
      {name:'Wing Attack',kind:'attack',dmg:8}
    ], pattern:[0,1,0,2]
  },
  rattata: {
    name:'Rattata', dex:19, types:['normal'], baseHp:31, tier:1, signature:'sig_rattata', flavor:'Its incisors can chew through a rope bridge.',
    moves:[
      {name:'Quick Attack',kind:'attack',dmg:4,hits:2},
      {name:'Tail Whip',kind:'debuff',playerStatus:{vulnerable:1}},
      {name:'Bite',kind:'attack',dmg:8}
    ], pattern:[0,0,1,2]
  },
  oddish: {
    name:'Oddish', dex:43, types:['grass','poison'], baseHp:34, tier:1, signature:'sig_oddish', flavor:'It buries itself in soil and hums to the moon.',
    moves:[
      {name:'Absorb',kind:'attack',dmg:5,heal:3},
      {name:'Acid',kind:'attack',dmg:5,playerStatus:{poison:2}},
      {name:'Growth',kind:'buff',strength:1}
    ], pattern:[0,1,2,1]
  },
  bellsprout: {
    name:'Bellsprout', dex:69, types:['grass','poison'], baseHp:33, tier:1, signature:'sig_bellsprout', flavor:'Its bell-shaped head lures small insects close.',
    moves:[
      {name:'Vine Whip',kind:'attack',dmg:7},
      {name:'Growth',kind:'buff',strength:2},
      {name:'Acid',kind:'attack',dmg:5,playerStatus:{poison:2}}
    ], pattern:[0,0,1,2]
  },
  magikarp: {
    name:'Magikarp', dex:129, types:['water'], baseHp:26, tier:1, signature:'sig_magikarp', flavor:'It splashes. It flails. It believes.',
    moves:[
      {name:'Splash',kind:'buff',block:0,flavor:'Nothing happens...'},
      {name:'Tackle',kind:'attack',dmg:4},
      {name:'Flail',kind:'attack',dmg:8}
    ], pattern:[0,1,2]
  },

  pikachu: {
    name:'Pikachu', dex:25, types:['electric'], baseHp:48, tier:2, signature:'sig_pikachu', flavor:'Cheeks spark when it is annoyed. It is often annoyed.',
    moves:[
      {name:'Thunder Shock',kind:'attack',dmg:7,playerStatus:{vulnerable:1}},
      {name:'Quick Attack',kind:'attack',dmg:5,hits:2},
      {name:'Charge',kind:'buff',strength:2}
    ], pattern:[0,1,2,0]
  },
  zubat: {
    name:'Zubat', dex:41, types:['poison','flying'], baseHp:44, tier:2, signature:'sig_zubat', flavor:'It finds you by the sound of your breathing.',
    moves:[
      {name:'Supersonic',kind:'debuff',playerStatus:{weak:1}},
      {name:'Bite',kind:'attack',dmg:7},
      {name:'Leech Life',kind:'attack',dmg:5,heal:4}
    ], pattern:[0,1,0,2]
  },
  meowth: {
    name:'Meowth', dex:52, types:['normal'], baseHp:46, tier:2, signature:'sig_meowth', flavor:'It collects shiny things. Your bag is a shiny thing.',
    moves:[
      {name:'Scratch',kind:'attack',dmg:7},
      {name:'Pay Day',kind:'attack',dmg:5,stealGold:6},
      {name:'Fury Swipes',kind:'attack',dmg:4,hits:2}
    ], pattern:[0,1,2,1]
  },
  psyduck: {
    name:'Psyduck', dex:54, types:['water'], baseHp:50, tier:2, signature:'sig_psyduck', flavor:'Its headache is a warning. Probably.',
    moves:[
      {name:'Confusion',kind:'attack',dmg:8},
      {name:'Water Gun',kind:'attack',dmg:6},
      {name:'Headache',kind:'buff',strength:2}
    ], pattern:[1,0,2,0]
  },
  growlithe: {
    name:'Growlithe', dex:58, types:['fire'], baseHp:52, tier:2, signature:'sig_growlithe', flavor:'A loyal heart wrapped in warm, orange fur.',
    moves:[
      {name:'Ember',kind:'attack',dmg:7,playerStatus:{burn:2}},
      {name:'Bite',kind:'attack',dmg:8},
      {name:'Flame Wheel',kind:'attack',dmg:10,playerStatus:{burn:2}}
    ], pattern:[0,1,0,2]
  },
  abra: {
    name:'Abra', dex:63, types:['psychic'], baseHp:42, tier:2, signature:'sig_abra', flavor:'It sleeps for eighteen hours a day. It has earned it.',
    moves:[
      {name:'Teleport',kind:'defend',block:9},
      {name:'Psybeam',kind:'attack',dmg:9},
      {name:'Calm Mind',kind:'buff',strength:2}
    ], pattern:[0,1,2,1]
  },
  machop: {
    name:'Machop', dex:66, types:['normal'], baseHp:54, tier:2, signature:'sig_machop', flavor:'It lifts boulders for fun and for spite.',
    moves:[
      {name:'Karate Chop',kind:'attack',dmg:9},
      {name:'Low Kick',kind:'attack',dmg:7,playerStatus:{weak:1}},
      {name:'Bulk Up',kind:'buff',strength:2,block:4}
    ], pattern:[0,0,1,2]
  },
  geodude: {
    name:'Geodude', dex:74, types:['rock','ground'], baseHp:55, tier:2, signature:'sig_geodude', flavor:'It blends in with the path until you step on it.',
    moves:[
      {name:'Rock Throw',kind:'attack',dmg:8},
      {name:'Harden',kind:'defend',block:8},
      {name:'Rollout',kind:'attack',dmg:6,hits:2}
    ], pattern:[0,1,0,2]
  },

  ponyta: {
    name:'Ponyta', dex:77, types:['fire'], baseHp:68, tier:3, signature:'sig_ponyta', flavor:'Its mane burns without consuming itself.',
    moves:[
      {name:'Ember',kind:'attack',dmg:8,playerStatus:{burn:2}},
      {name:'Stomp',kind:'attack',dmg:10},
      {name:'Agility',kind:'defend',block:8}
    ], pattern:[0,1,2,0]
  },
  gastly: {
    name:'Gastly', dex:92, types:['psychic','poison'], baseHp:62, tier:3, signature:'sig_gastly', flavor:'A gas wrapped around a wicked little grin.',
    moves:[
      {name:'Lick',kind:'attack',dmg:6,playerStatus:{poison:3}},
      {name:'Night Shade',kind:'attack',dmg:9},
      {name:'Hypnosis',kind:'debuff',playerStatus:{weak:2}}
    ], pattern:[0,1,2,1]
  },
  onix: {
    name:'Onix', dex:95, types:['rock','ground'], baseHp:78, tier:3, signature:'sig_onix', flavor:'The tunnel is not a tunnel. It is Onix.',
    moves:[
      {name:'Bind',kind:'attack',dmg:7,playerStatus:{weak:1}},
      {name:'Rock Throw',kind:'attack',dmg:9},
      {name:'Harden',kind:'defend',block:12}
    ], pattern:[0,1,2,1]
  },
  voltorb: {
    name:'Voltorb', dex:100, types:['electric'], baseHp:58, tier:3, signature:'sig_voltorb', flavor:'Indistinguishable from a Poké Ball until it is far too late.',
    moves:[
      {name:'Spark',kind:'attack',dmg:8},
      {name:'Charge',kind:'buff',strength:2},
      {name:'Self-Destruct',kind:'attack',dmg:16,selfDamage:10}
    ], pattern:[0,1,2]
  },
  koffing: {
    name:'Koffing', dex:109, types:['poison'], baseHp:66, tier:3, signature:'sig_koffing', flavor:'It is a floating warning label.',
    moves:[
      {name:'Smog',kind:'attack',dmg:5,playerStatus:{poison:3}},
      {name:'Tackle',kind:'attack',dmg:7},
      {name:'Poison Gas',kind:'debuff',playerStatus:{poison:4}}
    ], pattern:[0,1,2,0]
  },
  rhyhorn: {
    name:'Rhyhorn', dex:111, types:['rock','ground'], baseHp:76, tier:3, signature:'sig_rhyhorn', flavor:'It runs in a straight line and apologizes later.',
    moves:[
      {name:'Horn Attack',kind:'attack',dmg:10},
      {name:'Stomp',kind:'attack',dmg:8},
      {name:'Rock Blast',kind:'attack',dmg:5,hits:2}
    ], pattern:[0,1,0,2]
  },
  staryu: {
    name:'Staryu', dex:120, types:['water'], baseHp:64, tier:3, signature:'sig_staryu', flavor:'The gem at its core pulses with the tide.',
    moves:[
      {name:'Swift',kind:'attack',dmg:8},
      {name:'Water Gun',kind:'attack',dmg:7},
      {name:'Recover',kind:'heal',heal:8}
    ], pattern:[0,1,2,0]
  },
  eevee: {
    name:'Eevee', dex:133, types:['normal'], baseHp:60, tier:3, signature:'sig_eevee', flavor:'A bundle of potential with a very fluffy tail.',
    moves:[
      {name:'Tackle',kind:'attack',dmg:7},
      {name:'Sand Attack',kind:'debuff',playerStatus:{weak:1}},
      {name:'Bite',kind:'attack',dmg:8}
    ], pattern:[0,1,2,0]
  },

  snorlax: {
    name:'Snorlax', dex:143, types:['normal'], baseHp:104, tier:4, signature:'sig_snorlax', flavor:'The path is blocked. The path is Snorlax.',
    moves:[
      {name:'Body Slam',kind:'attack',dmg:12,playerStatus:{weak:1}},
      {name:'Rest',kind:'heal',heal:18},
      {name:'Heavy Slam',kind:'attack',dmg:16},
      {name:'Yawn',kind:'debuff',playerStatus:{weak:2}}
    ], pattern:[0,1,2,3]
  },
  dratini: {
    name:'Dratini', dex:147, types:['dragon'], baseHp:86, tier:4, signature:'sig_dratini', flavor:'It sheds its skin and grows toward something enormous.',
    moves:[
      {name:'Dragon Rage',kind:'attack',dmg:10},
      {name:'Slam',kind:'attack',dmg:9},
      {name:'Agility',kind:'buff',strength:1,block:6}
    ], pattern:[0,1,2,1]
  },
  gengar: {
    name:'Gengar', dex:94, types:['psychic','poison'], baseHp:122, tier:4, elite:true, signature:'sig_gengar', flavor:'Your shadow has too many teeth.',
    moves:[
      {name:'Shadow Ball',kind:'attack',dmg:12,playerStatus:{vulnerable:1}},
      {name:'Lick',kind:'attack',dmg:8,playerStatus:{poison:4}},
      {name:'Hex',kind:'attack',dmg:10},
      {name:'Dream Eater',kind:'attack',dmg:8,heal:8}
    ], pattern:[0,1,2,0,3]
  },
  dragonite: {
    name:'Dragonite', dex:149, types:['dragon','flying'], baseHp:138, tier:4, elite:true, signature:'sig_dragonite', flavor:'A gentle giant until the storm arrives.',
    moves:[
      {name:'Dragon Claw',kind:'attack',dmg:13},
      {name:'Hurricane',kind:'attack',dmg:16,playerStatus:{weak:1}},
      {name:'Wing Attack',kind:'attack',dmg:8,hits:2},
      {name:'Roost',kind:'heal',heal:12}
    ], pattern:[0,1,2,0,3]
  },
  arbok: {
    name:'Arbok', dex:24, types:['poison'], baseHp:128, tier:4, elite:true, signature:'sig_arbok', flavor:'The pattern on its hood is a warning you should have heeded.',
    moves:[
      {name:'Poison Sting',kind:'attack',dmg:6,playerStatus:{poison:3}},
      {name:'Glare',kind:'debuff',playerStatus:{vulnerable:2}},
      {name:'Crunch',kind:'attack',dmg:12},
      {name:'Wrap',kind:'attack',dmg:5,hits:2}
    ], pattern:[0,1,2,3,2]
  },
  mewtwo: {
    name:'Mewtwo', dex:150, types:['psychic'], baseHp:220, tier:5, boss:true, signature:'sig_mewtwo', flavor:'The spire was built to contain it. The spire is failing.',
    moves:[
      {name:'Psystrike',kind:'attack',dmg:16,playerStatus:{vulnerable:1}},
      {name:'Shadow Ball',kind:'attack',dmg:14},
      {name:'Barrier',kind:'defend',block:18},
      {name:'Psychic',kind:'attack',dmg:20},
      {name:'Recover',kind:'heal',heal:16}
    ], pattern:[0,1,2,3,4,0,3]
  },
  mew: {
    name:'Mew', dex:151, types:['psychic'], baseHp:20, tier:6, signature:'sig_mew', flavor:'It was here before the spire. It will be here after.',
    moves:[
      {name:'Metronome',kind:'attack',dmg:7},
      {name:'Teleport',kind:'defend',block:6}
    ], pattern:[0,1,0]
  }
};

export const CATCHABLE = Object.keys(SPECIES).filter(k => SPECIES[k].tier >= 1);
export const TIER_POOLS = {
  1: ['caterpie','weedle','pidgey','rattata','oddish','bellsprout','magikarp'],
  2: ['pikachu','zubat','meowth','psyduck','growlithe','abra','machop','geodude'],
  3: ['ponyta','gastly','onix','voltorb','koffing','rhyhorn','staryu','eevee'],
  4: ['snorlax','dratini']
};
export const ELITE_POOL = ['arbok','gengar','dragonite','snorlax'];

/* ---------------- Relics ---------------- */
export const RELICS = {
  lucky_egg: { name:'Lucky Egg', glyph:'🥚', desc:'Catch chance +12%. A little luck goes a long way.' },
  charcoal: { name:'Charcoal', glyph:'🔥', desc:'Fire cards deal +2 damage.' },
  mystic_water: { name:'Mystic Water', glyph:'💧', desc:'Water cards grant +2 Block.' },
  miracle_seed: { name:'Miracle Seed', glyph:'🌱', desc:'Whenever you apply Poison, apply 2 more.' },
  silph_scope: { name:'Silph Scope', glyph:'👁', desc:'Draw 1 extra card at the start of each turn.' },
  amulet_coin: { name:'Amulet Coin', glyph:'🪙', desc:'Gain 20 extra gold after each battle.' },
  oran_berry: { name:'Oran Berry', glyph:'🫐', desc:'Heal 6 HP after each battle.' },
  focus_band: { name:'Focus Band', glyph:'🎗', desc:'Once per battle, survive a lethal hit at 1 HP.' },
  quick_claw: { name:'Quick Claw', glyph:'🦴', desc:'Draw 1 extra card each turn. Stacks with Silph Scope.' },
  exp_share: { name:'Exp. Share', glyph:'📗', desc:'Gain 5 max HP whenever you catch a Pokémon.' },
  poke_flute: { name:'Poké Flute', glyph:'🎵', desc:'Gain 1 of each ball type when acquired.' },
  bicycle: { name:'Bicycle', glyph:'🚲', desc:'Start every battle with +1 Energy on turn 1.' },
  choice_band: { name:'Choice Band', glyph:'🎽', desc:'Start every battle with 2 Strength.' },
  leftovers: { name:'Leftovers', glyph:'🍎', desc:'Heal 3 HP at the end of each turn.' },
  rocky_helmet: { name:'Rocky Helmet', glyph:'🪨', desc:'Deal 3 damage back whenever the foe attacks you.' },
  master_ball: { name:'Master Ball', glyph:'🟣', desc:'A single, guaranteed catch. Use it wisely.' }
};

export const RELIC_POOL = Object.keys(RELICS);

/* ---------------- Map ---------------- */
export const MAP_ROWS = 12;
export const MAP_NODES = [
  { id:'start', row:0, col:1, type:'start' },

  { id:'n1a', row:1, col:0, type:'wild' },
  { id:'n1b', row:1, col:1, type:'wild' },
  { id:'n1c', row:1, col:2, type:'wild' },

  { id:'n2a', row:2, col:0, type:'shop' },
  { id:'n2b', row:2, col:1, type:'grass' },
  { id:'n2c', row:2, col:2, type:'camp' },

  { id:'n3a', row:3, col:0, type:'wild' },
  { id:'n3b', row:3, col:1, type:'elite' },
  { id:'n3c', row:3, col:2, type:'wild' },

  { id:'n4a', row:4, col:0, type:'treasure' },
  { id:'n4b', row:4, col:1, type:'wild' },
  { id:'n4c', row:4, col:2, type:'shop' },

  { id:'n5a', row:5, col:0, type:'wild' },
  { id:'n5b', row:5, col:1, type:'elite' },
  { id:'n5c', row:5, col:2, type:'wild' },

  { id:'n6a', row:6, col:0, type:'camp' },
  { id:'n6b', row:6, col:1, type:'grass' },
  { id:'n6c', row:6, col:2, type:'treasure' },

  { id:'n7a', row:7, col:0, type:'wild' },
  { id:'n7b', row:7, col:1, type:'wild' },
  { id:'n7c', row:7, col:2, type:'elite' },

  { id:'n8a', row:8, col:0, type:'shop' },
  { id:'n8b', row:8, col:1, type:'camp' },
  { id:'n8c', row:8, col:2, type:'wild' },

  { id:'n9a', row:9, col:0, type:'wild' },
  { id:'n9b', row:9, col:1, type:'elite' },
  { id:'n9c', row:9, col:2, type:'wild' },

  { id:'n10a', row:10, col:0, type:'camp' },
  { id:'n10b', row:10, col:1, type:'treasure' },
  { id:'n10c', row:10, col:2, type:'shop' },

  { id:'boss', row:11, col:1, type:'boss' }
];

export const NODE_META = {
  start: { label:'Trailhead', icon:'map', desc:'The climb begins here.' },
  wild: { label:'Wilds', icon:'paw', desc:'A wild Pokémon blocks the path. Battle it — or catch it.' },
  grass: { label:'Tall Grass', icon:'grass', desc:'A weakened wild Pokémon rustles in the grass. Catch odds are improved.' },
  elite: { label:'Elite Den', icon:'skull', desc:'A powerful Pokémon guards a relic. Dangerous, but rewarding.' },
  camp: { label:'Camp', icon:'tent', desc:'Rest to heal, or train to upgrade a card.' },
  shop: { label:'Peddler', icon:'bag', desc:'Buy cards, balls, and supplies — or pay to remove a card.' },
  treasure: { label:'Cache', icon:'chest', desc:'A forgotten cache. Choose a relic.' },
  boss: { label:'The Spire Heart', icon:'crown', desc:'Mewtwo waits at the summit. End the climb.' }
};

/* ---------------- Utility ---------------- */
export const CARD_POOL = Object.keys(CARDS).filter(k => !k.startsWith('sig_') && k !== 'smokescreen');
export const COMMON_POOL = CARD_POOL.filter(k => CARDS[k].rarity === 'common');
export const UNCOMMON_POOL = CARD_POOL.filter(k => CARDS[k].rarity === 'uncommon');
export const RARE_POOL = CARD_POOL.filter(k => CARDS[k].rarity === 'rare');

export function getStats(cardId, upgraded = false) {
  const def = CARDS[cardId];
  if (!def) throw new Error('Unknown card ' + cardId);
  const s = {
    dmg: def.dmg || 0, block: def.block || 0, heal: def.heal || 0, draw: def.draw || 0,
    energy: def.energy || 0, strength: def.strength || 0, hits: def.hits || 1,
    gold: def.gold || 0, cost: def.cost || 0, special: def.special || null,
    statuses: { ...(def.statuses || {}) }
  };
  if (upgraded && def.up) {
    for (const [k, v] of Object.entries(def.up)) {
      if (k === 'special') {
        // Numeric upgrades (Flail, Metronome) boost the move; only a string
        // replaces the special behaviour itself.
        if (typeof v === 'string') s.special = v;
        else s.specialBonus = v;
      }
      else if (k === 'cost') s.cost = Math.max(0, s.cost + v);
      else if (['dmg','block','heal','draw','energy','strength','hits','gold'].includes(k)) s[k] += v;
      else s.statuses[k] = (s.statuses[k] || 0) + v;
    }
  }
  return s;
}

export function cardDescription(cardId, upgraded = false) {
  const def = CARDS[cardId];
  const s = getStats(cardId, upgraded);
  if (def.special === 'flail') return `Deal <b>${5 + (upgraded ? 2 : 0)}</b> damage, plus <b>25%</b> of your missing HP.`;
  if (def.special === 'metronome') return `Unleash a random powerful move. ${upgraded ? 'It hits harder.' : ''}`;
  const parts = [];
  if (s.dmg) parts.push(`Deal <b>${s.dmg}</b> damage${s.hits > 1 ? ` <b>${s.hits}</b> times` : ''}${s.pierce ? ' <span class="kw">(ignores Block)</span>' : ''}.`);
  if (s.block) parts.push(`Gain <b>${s.block}</b> Block.`);
  if (s.heal) parts.push(`Heal <b>${s.heal}</b> HP.`);
  const st = s.statuses;
  const stParts = [];
  if (st.poison) stParts.push(`<b>${st.poison}</b> Poison`);
  if (st.burn) stParts.push(`<b>${st.burn}</b> Burn`);
  if (st.weak) stParts.push(`<b>${st.weak}</b> Weak`);
  if (st.vulnerable) stParts.push(`<b>${st.vulnerable}</b> Vulnerable`);
  if (stParts.length) parts.push(`Apply ${stParts.join(', ')}.`);
  if (s.strength) parts.push(`Gain <b>${s.strength}</b> Strength.`);
  if (s.draw) parts.push(`Draw <b>${s.draw}</b> card${s.draw > 1 ? 's' : ''}.`);
  if (s.energy) parts.push(`Gain <b>${s.energy}</b> Energy.`);
  if (s.gold) parts.push(`Gain <b>${s.gold}</b> gold.`);
  if (s.cleanse) parts.push(`Clear your ailments.`);
  if (def.exhaust) parts.push(`<span class="kw">Exhaust.</span>`);
  return parts.join(' ') || def.text || '';
}

export function typeLabel(types) {
  return types.map(t => TYPES[t]?.label || t).join(' · ');
}

export function typeColor(types) {
  return TYPES[types[0]]?.color || TYPES.normal.color;
}
