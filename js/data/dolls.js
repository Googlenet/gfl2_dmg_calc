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

      // s1 v0-v3
      {
        id: 'leva_s1_lv1',
        name: 'Rational Suppression',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Selects one direction, dealing AoE Electric damage equal to 120% of attack to all enemies in a 7×3 tile area. Applies Negative Charge to all enemies in the area for 2 turns and generates Voltage tiles for 3 turns.',
        multiplier: 1.20,
        vertebrae: ['v0', 'v1', 'v2', 'v3'],
        cooldown: 1,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // s1 v4-v6
      {
        id: 'leva_s1_lv2',
        name: 'Rational Suppression',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Select one direction, dealing AoE Electric damage equal to 120% of attack to all enemy units in a 7×3 tile area of the selected direction, applies Negative Charge and Paralysis to all enemies in the selected area for 2 turns, and generates Voltage tiles for 3 turns. The critical damage for this skill is increased by 25%. ',
        multiplier: 1.20,
        vertebrae: ['v4', 'v5', 'v6'],
        cooldown: 1,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Add +25% to Crit DMG manually'
      },

      // s2 v0-v1
      {
        id: 'leva_s2_lv1',
        name: 'Ordered Disruption',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Selects one tile within 7 tiles, dealing AoE Electric damage equal to 100% of attack to all enemies within 3 tiles. Against targets with Negative Charge, damage dealt is increased by 30% and stability damage dealt is increased by 1 point.',
        multiplier: 1.00,
        vertebrae: ['v0','v1'],
        cooldown: 1,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Add +30% to DMG Buffs manually if target has Negative Charge.',
      },

      // s2 v2-v6
      {
        id: 'leva_s2_lv2',
        name: 'Ordered Disruption',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Selects one tile within a 7 tiles, dealing AoE Electric damage equal to 130% of attack to all enemy targets within 3 tiles of the selected tile. Against targets with Negative Charge, damage dealt is increased by 30%, and stability damage dealt is increased by 1 point. At the end of the action, Leva gains 1 stack of Superconductive Code.',
        multiplier: 1.30,
        vertebrae: ['v2','v3', 'v4', 'v5', 'v6'],
        cooldown: 1,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Add +30% to DMG Buffs manually if target has Negative Charge.',
      },

      // ult v0-v2
      {
        id: 'leva_ult_lv1',
        name: 'Quantum Calculation',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Deals AoE Electric damage equal to 60% of attack to all enemy targets within 7 tiles and generates Voltage tiles for 3 turns. Leva gains Overclocking Strike for 3 turns. After this attack, Leva can use the active skill Superconductive Strike once.',
        multiplier: 0.6,
        vertebrae: ['v0', 'v1', 'v2'],
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // ult v3-v4
      {
        id: 'leva_ult_lv2',
        name: 'Quantum Calculation',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Deals AoE Electric damage equal to 60% of attack to all enemy targets within 7 tiles and generates Voltage tiles for 3 turns. Leva gains Overclocking Strike for 3 turns. After this attack, Leva can use the active skill Superconductive Strike once. \nDepending on the number of stacks of Superconductive Code expended, the damage multiplier of Superconductive Strike is increased to 75%/90%/120%/180%, and the stability damage dealt is increased to 1 point/2 points/4 points/8 points.\nWhen using Superconductive Strike, ignores 15% of the target\'s defense. After this skill, Leva gains 1 stack of Superconductive Code.',
        multiplier: 0.6,
        vertebrae: ['v3', 'v4'],
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // ult v5-v6
      {
        id: 'leva_ult_lv3',
        name: 'Quantum Calculation',
        dmg_type: 'Electric',
        skill_type: 'aoe',
        description: 'Leva cleanses all debuffs on self and deals AoE Electric damage equal to 90% of attack to all enemy targets within 7 tiles and generates Voltage tiles for 3 turns. Leva gains Overclocking Strike for 3 turns. After this attack, Leva can use the active skill Superconductive Strike once.\nDepending on the number of stacks of Superconductive Code expended, the damage multiplier of Superconductive Strike is increased to 75%/90%/120%/180%, and the stability damage dealt is increased to 1 point/2 points/4 points/8 points.\nWhen using Superconductive Strike, ignores 15% of the target\'s defense. After this skill, Leva gains 1 stack of Superconductive Code.',
        multiplier: 0.9,
        vertebrae: ['v5', 'v6'],
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // passive v0
      {
        id: 'leva_passive_lv1',
        name: 'Fox\'s Scheme',
        dmg_type: 'Electric',
        skill_type: 'melee',
        description: 'At the start of the turn, when Leva triggers a Voltage tile reaction, she gains 1 stacks of Superconductive Code. If Leva has Positive Charge, Electric damage dealt is increased by 10%.\nWhen Negative Charge is applied to an enemy unit within her attack range , Leva performs one instance of Emergency Support, dealing melee Electric damage equal to 60% of attack and 1 point of stability damage, as well as gaining 1 point of Confectance Index. If this kills the target, she applies Negative Charge to the nearest enemy unit within range for 1 turn. This effect can be triggered up to 2 times per turn.',
        multiplier: 0.60,
        vertebrae: ['v0'],
        cooldown: null,
        canCrit: false,
        scalingStat: 'ATK',
      },

      // passive v1-v5
      {
        id: 'leva_passive_lv2',
        name: 'Fox\'s Scheme',
        dmg_type: 'Electric',
        skill_type: 'melee',
        description: 'At the start of the turn, when Leva triggers a Voltage tile reaction, or when an enemy with Negative Charge dies within her attack range, she gains 1 stacks of Superconductive Code. If she has Positive Charge, Electric damage dealt is increased by 25%.\nWhen Negative Charge is applied to an enemy unit within her attack range , Leva performs one instance of Emergency Support, dealing melee Electric damage equal to 60% of attack and 1 point of stability damage, as well as gaining 1 point of Confectance Index. If this kills the target, she applies Negative Charge to the nearest enemy unit within range for 1 turn. This effect can be triggered up to 3 times per turn.',
        multiplier: 0.60,
        vertebrae: ['v1', 'v2', 'v3', 'v4', 'v5'],
        cooldown: null,
        canCrit: false,
        scalingStat: 'ATK',
      },

      // passive v6
      {
        id: 'leva_passive_lv3',
        name: 'Fox\'s Scheme',
        dmg_type: 'Electric',
        skill_type: 'melee',
        description: 'At the start of the turn, Leva gains 2 stacks of Superconductive Code. In addition, when Leva triggers a Voltage tile reaction, or when an enemy with Negative Charge dies within her attack range, Leva gains 1 stacks of Superconductive Code. If Leva has Positive Charge, Electric damage dealt is increased by 25%.\nLeva\'s attack is increased by 15% the first time she reaches 4 stacks of Superconductive Code in battle.\nWhen Negative Charge is applied to an enemy target within range , Leva performs one instance of Emergency Support, dealing melee Electric damage equal to 60% of attack and 1 point of stability damage, as well as gaining 1 point of Confectance Index. If this kills the target, she applies Negative Charge to the nearest enemy unit within range for 1 turn. This effect can be triggered up to 3 times per turn. She can also use the active skill Superconductive Strike after using the active skill Rational Suppression or Ordered Disruption. ',
        multiplier: 0.60,
        vertebrae: ['v1', 'v2', 'v3', 'v4', 'v5'],
        cooldown: null,
        canCrit: false,
        scalingStat: 'ATK',
      },

      // superconductive strike lv1
      {
        id: 'leva_sa_lv1',
        name: 'Superconductive Strike',
        dmg_type: 'Electric',
        skill_type: 'melee',
        description: 'Selects one enemy target within 7 tiles, dealing melee Electric damage equal to 50% of attack to it. Before the skill resolves, generates Voltage tiles within 1 tile around the target for 3 turns.\nExpends all stacks of Superconductive Code. Depending on the number of stacks expended, the damage multiplier is changed to 60%/70%/85%/120%, and the stability damage dealt is changed to 1 point/2 points/3 points/6 points.',
        multiplier: [
          { label: '0 stacks (50%)',  value: 0.50 },
          { label: '1 stack  (60%)',  value: 0.60 },
          { label: '2 stacks (70%)', value: 0.70 },
          { label: '3 stacks (85%)', value: 0.85 },
          { label: '4 stacks (120%)',value: 1.20 },
        ],
        vertebrae: ['v0', 'v1', 'v2'],
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Stability damage: 1 / 2 / 3 / 6 points for 1–4 stacks respectively.',
      },

      // superconductive strike lv2
      {
        id: 'leva_sa_lv2',
        name: 'Superconductive Strike',
        dmg_type: 'Electric',
        skill_type: 'melee',
        description: 'Selects one enemy target within 7 tiles, dealing melee Electric damage equal to 50% of attack to it. Before the skill resolves, generates Voltage tiles within 1 tile around the target for 3 turns.\nExpends all stacks of Superconductive Code. Depending on the number of stacks expended, the damage multiplier is changed to 75%/90%/120%/180%, and the stability damage dealt is changed to 1 point/2 points/4 points/8 points. This attack ignores 15% of the target\'s defense. After using this skill, Leva gains 1 stack of Superconductive Code. ',
        multiplier: [
          { label: '0 stacks (50%)',  value: 0.50 },
          { label: '1 stack  (75%)',  value: 0.75 },
          { label: '2 stacks (90%)', value: 0.90 },
          { label: '3 stacks (120%)', value: 1.20 },
          { label: '4 stacks (180%)',value: 1.80 },
        ],
        vertebrae: ['v3', 'v4', 'v5', 'v6'],
        cooldown: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Stability damage: 1 / 2 / 4 / 8 points for 1–4 stacks respectively.',
      },

    ],
    passives: [],
    notes: 'Add 15% to def reduction',
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