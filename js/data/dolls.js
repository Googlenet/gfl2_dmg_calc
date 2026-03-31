// ─────────────────────────────────────────────────────────────────────────────
// dolls.js  —  GFL2 Doll Database
//
// SCHEMA
// ──────
// {
//   id:        string    — unique slug (e.g. 'leva')
//   name:      string    — display name
//   class:     string    — 'Bulwark' | 'Vanguard' | 'Sentinel' | 'Support'
//   ammoType:  string    — 'Light' | 'Medium' | 'Heavy' | 'Shotgun' | 'Melee'
//   phase:     string    — 'Burn' | 'Freeze' | 'Electric' | 'Corrosion' | 'Hydro'
//
//   skills: [
//     {
//       id:          string    — unique slug (e.g. 'leva_s1')
//       name:        string    — display name
//       dmg_type:    string    — 'Physical' | 'Burn' | 'Freeze' | 'Electric' | 'Corrosion' | 'Hydro'
//       skill_type:  string    — 'target' | 'aoe' | 'melee' | 'support' | 'passive'
//       description: string    — tooltip text
//
//       multiplier:  number | Array<{ label: string, value: number }>
//                    — Single decimal value (e.g. 1.20 = 120% ATK), OR an array
//                      of labeled options for skills with variable multipliers.
//                      Array form: [{ label: '0 stacks', value: 0.50 }, ...]
//                      The UI renders mutually exclusive checkboxes for each option.
//
//       vertebrae:   Array<string> | null
//                    — Which V levels this skill entry applies to.
//                      e.g. ['v0','v1','v2'] or ['v6'].
//                      null = applies at all vertebrae levels.
//                      Use multiple entries with the same id but different vertebrae
//                      arrays to represent skills that change at higher V.
//
//       cooldown:    number | null   — cooldown in turns (reserved for future use)
//
//       // optional
//       canCrit:     bool     — defaults to true
//       scalingStat: string   — 'ATK' (default) | 'HP' | 'DEF'
//       notes:       string   — extra context shown in the skill card
//     }
//   ],
//
//   passives: [
//     {
//       field:  string  — input id to pre-fill (e.g. 'dmg_doll_passive')
//       value:  number  — value to set (e.g. 20 for 20%)
//       label:  string  — display label
//     }
//   ],
//
//   notes: string  — general kit notes
// }
//
// VERTEBRAE VERSIONING
// ─────────────────────
// Add a second skill entry with the same id but different vertebrae to represent
// a skill that improves at a certain V level. getSkillsForVertebrae() will pick
// the correct version automatically.
//
// Example:
//   { id: 'leva_s2', vertebrae: ['v0','v1','v2','v3'], multiplier: 1.00, ... }
//   { id: 'leva_s2', vertebrae: ['v4','v5','v6'],      multiplier: 1.30, ... }
//
// MULTI-MULTIPLIER SKILLS
// ────────────────────────
// Use an array for skills with conditional/stack-based multipliers:
//   multiplier: [
//     { label: '0 stacks', value: 0.50 },
//     { label: '1 stack',  value: 0.60 },
//     { label: 'Max (4)',  value: 1.20 },
//   ]
// ─────────────────────────────────────────────────────────────────────────────

const DOLLS = [

  // ── Template ─────────────────────────────────────────────────────────────
  // {
  //   id: 'doll_id',
  //   name: 'Doll Name',
  //   class: 'Sentinel',
  //   ammoType: 'Light',
  //   phase: 'Burn',
  //   skills: [
  //     {
  //       id: 'doll_s1',
  //       name: 'Skill Name',
  //       dmg_type: 'Physical',
  //       skill_type: 'target',
  //       description: 'Deals X% ATK to a single target.',
  //       multiplier: 2.50,
  //       vertebrae: null,
  //       cooldown: null,
  //       canCrit: true,
  //       scalingStat: 'ATK',
  //     },
  //   ],
  //   passives: [],
  //   notes: '',
  // },

  // ── Leva ─────────────────────────────────────────────────────────────────
  {
    id: 'leva',
    name: 'Leva',
    class: 'Sentinel',
    ammoType: 'Light',
    phase: 'Electric',
    skills: [

      {
        id: 'leva_basic',
        name: 'Dangerous Smile',
        dmg_type: 'Physical',
        skill_type: 'target',
        description: 'Selects one enemy target within 7 tiles and deals Physical damage equal to 80% of attack to it.',
        multiplier: 0.80,
        vertebrae: null,
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'leva_s1',
        name: 'Rational Suppression',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Selects one direction, dealing AoE Electric damage equal to 120% of attack to all enemies in a 7×3 tile area. Applies Negative Charge to all enemies in the area for 2 turns and generates Voltage tiles for 3 turns.',
        multiplier: 1.20,
        vertebrae: null,
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // Ordered Disruption — V0 to V5 version
      {
        id: 'leva_s2',
        name: 'Ordered Disruption',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Selects one tile within 7 tiles, dealing AoE Electric damage equal to 100% of attack to all enemies within 3 tiles. Against targets with Negative Charge, damage dealt is increased by 30% and stability damage dealt is increased by 1 point.',
        multiplier: 1.00,
        vertebrae: ['v0','v1','v2','v3','v4','v5'],
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Add +30% to DMG Buffs manually if target has Negative Charge.',
      },

      // Ordered Disruption — V6 version (update multiplier/description when known)
      {
        id: 'leva_s2',
        name: 'Ordered Disruption (V6)',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Selects one tile within 7 tiles, dealing AoE Electric damage equal to 100% of attack to all enemies within 3 tiles. Against targets with Negative Charge, damage is increased by 30% and stability damage is increased by 1 point. V6 adds an additional effect.',
        multiplier: 1.00,
        vertebrae: ['v6'],
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'V6 version. Add +30% to DMG Buffs manually if target has Negative Charge.',
      },

      {
        id: 'leva_ult',
        name: 'Absolute Shutdown',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Ultimate skill — placeholder, fill in when data is available.',
        multiplier: 1.00,
        vertebrae: null,
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'leva_passive',
        name: 'Passive',
        dmg_type: 'Electric',
        skill_type: 'passive',
        description: 'Passive skill — placeholder, fill in when data is available.',
        multiplier: null,
        vertebrae: null,
        cooldown: null,
        canCrit: false,
        scalingStat: 'ATK',
      },

      // Superconductive Strike — multi-multiplier based on stacks consumed
      {
        id: 'leva_sa',
        name: 'Superconductive Strike',
        dmg_type: 'Electric',
        skill_type: 'melee',
        description: 'Selects one enemy within 7 tiles, dealing melee Electric damage. Generates Voltage tiles within 1 tile of the target for 3 turns before resolving. Expends all Superconductive Code stacks — multiplier and stability damage scale with stacks consumed.',
        multiplier: [
          { label: '0 stacks (50%)',  value: 0.50 },
          { label: '1 stack  (60%)',  value: 0.60 },
          { label: '2 stacks (70%)', value: 0.70 },
          { label: '3 stacks (85%)', value: 0.85 },
          { label: '4 stacks (120%)',value: 1.20 },
        ],
        vertebrae: null,
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Stability damage: 1 / 2 / 3 / 6 points for 1–4 stacks respectively.',
      },

    ],
    passives: [],
    notes: 'Electric Sentinel. Key mechanic: Superconductive Code stacks (0–4) scale Superconductive Strike. Negative Charge on target adds +30% DMG to Ordered Disruption.',
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the full doll object by id, or undefined. */
function getDoll(id) {
  return DOLLS.find(d => d.id === id);
}

/** Returns all dolls sorted alphabetically by name. */
function getDollList() {
  return [...DOLLS].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns the skills for a doll filtered to those valid at the given vertebrae level.
 * When multiple entries share the same id, only the first one matching the current
 * vertebrae level is returned (vertebrae-specific entries take priority).
 *
 * @param {object} doll
 * @param {string} vLevel — e.g. 'v0', 'v3', 'v6'
 * @returns {Array} filtered, deduplicated skill list
 */
function getSkillsForVertebrae(doll, vLevel) {
  if (!doll) return [];
  const seen = new Set();
  const result = [];
  for (const skill of doll.skills) {
    if (seen.has(skill.id)) continue;
    if (skill.vertebrae === null || skill.vertebrae.includes(vLevel)) {
      seen.add(skill.id);
      result.push(skill);
    }
  }
  return result;
}