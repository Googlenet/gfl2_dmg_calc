// ─────────────────────────────────────────────────────────────────────────────
// dolls.js  —  GFL2 Doll Database
//
// MECHANICS SCHEMA
// ─────────────────
// Each doll can have a `mechanics` array describing her unique in-battle
// mechanics. The UI reads this and renders a doll-specific panel automatically.
//
// Mechanic types:
//
//   { type: 'stack_selector',
//     key:    string,          — unique key for state tracking
//     label:  string,          — display name
//     max:    number,          — maximum stacks (e.g. 4)
//     effect: (stacks) => ({   — function returning bonuses at given stack count
//       atkPct?:    number,    — % added to battle ATK
//       critDmg?:   number,    — flat % added to crit DMG
//       critRate?:  number,    — flat % added to crit rate
//       dmgPct?:    number,    — % added to DMG pool
//     }),
//     notes?: string,
//   }
//
//   { type: 'toggle',
//     key:    string,
//     label:  string,
//     condition?: string,      — short description of when to enable
//     effect: {                — bonuses when toggled ON
//       atkPct?:    number,
//       dmgPct?:    number,
//       critDmg?:   number,
//       critRate?:  number,
//       fixedDmgPct?: number,  — % of final DMG added as fixed (ignores DEF)
//       fixedAtkPct?: number,  — % of applier ATK added as fixed DMG
//       dmgMultiplier?: number,— multiply the current dmg result (e.g. x2 = 2)
//     },
//     notes?: string,
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const DOLLS = [

  // ── Template ─────────────────────────────────────────────────────────────
  // {
  //   id: 'doll_id',
  //   name: 'Doll Name',
  //   class: 'Sentinel',
  //   ammoType: 'Light',
  //   phase: 'Burn',
  //   baseCritDmg: 150,    ← locked crit DMG pulled from this field on select
  //   skills: [ ... ],
  //   passives: [],
  //   mechanics: [],
  //   notes: '',
  // },

  // ── Leva ─────────────────────────────────────────────────────────────────
  {
    id: 'leva',
    name: 'Leva',
    class: 'Sentinel',
    ammoType: 'Light',
    phase: 'Electric',
    baseCritDmg: 150,   // update with actual base value when confirmed

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
        vertebrae: ['v6'],
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

    passives: [
      // S1 always grants +25% crit DMG for its own attack — pre-fill critdmg_extra
      // Note: this will be overridden by the S1 toggle in mechanics for per-skill use
    ],

    // ── Leva-specific mechanics ───────────────────────────────────────────
    mechanics: [

      // ── Superconductive Code ─────────────────────────────────────────────
      {
        type: 'stack_selector',
        key: 'sc_stacks',
        label: 'Superconductive Code Stacks',
        max: 4,
        // Per-stack: +5% crit rate, +7% crit DMG. At 4 stacks: +15% ATK, +10% ATK (chain)
        effect: (stacks) => ({
          critRate: stacks * 5,
          critDmg:  stacks * 7,
          atkPct:   stacks >= 4 ? 25 : 0,  // +15% passive + +10% chain at max stacks
        }),
        notes: '+5% Crit Rate and +7% Crit DMG per stack. At 4 stacks: +15% ATK (passive) and +10% ATK (Superconductive Chain) activate.',
      },

      // ── S1 Crit DMG bonus (per-attack) ───────────────────────────────────
      {
        type: 'toggle',
        key: 's1_crit_bonus',
        label: 'S1 — +25% Crit DMG (this attack)',
        condition: 'Using Rational Suppression (S1)',
        effect: { critDmg: 25 },
        notes: 'Only applies to the S1 attack. Toggle on when calculating S1 damage.',
      },

      // ── Negative Charge on target ─────────────────────────────────────────
      {
        type: 'toggle',
        key: 'neg_charge_dmg',
        label: 'Neg Charge — +30% DMG (targeted)',
        condition: 'Target has Negative Charge debuff',
        effect: { dmgPct: 30 },
        notes: 'Applies to targeted attacks against a Negative Charge target.',
      },

      {
        type: 'toggle',
        key: 'neg_charge_fixed',
        label: 'Neg Charge — +3% Fixed DMG (reapplied)',
        condition: 'Negative Charge reapplied to target',
        effect: { fixedDmgPct: 3 },
        notes: '+3% of final DMG as additional fixed damage when Neg Charge is reapplied.',
      },

      // ── Voltage Tiles ─────────────────────────────────────────────────────
      {
        type: 'toggle',
        key: 'voltage_tile_dmg',
        label: 'Voltage Tiles — +30% DMG (AoE)',
        condition: 'Attack on or near Voltage Tiles (AoE)',
        effect: { dmgPct: 30 },
        notes: 'AoE attacks on Voltage tiles deal +30% DMG.',
      },

      {
        type: 'toggle',
        key: 'voltage_tile_elec',
        label: 'Voltage Tiles — +60% DMG (Electric/Hydro AoE)',
        condition: 'AoE attack is Electric or Hydro type',
        effect: { dmgPct: 60 },
        notes: 'Replaces the base +30% — select this instead when skill is Electric/Hydro. Do not stack both.',
      },

      {
        type: 'toggle',
        key: 'voltage_tile_boss',
        label: 'Voltage Tiles — ×2 vs Large/Boss target',
        condition: 'Target is a large enemy or boss',
        effect: { dmgMultiplier: 2 },
        notes: 'Doubles the Voltage Tile bonus DMG against large/boss targets.',
      },

      // ── S2 Neg Charge bonus ───────────────────────────────────────────────
      {
        type: 'toggle',
        key: 's2_neg_charge',
        label: 'S2 — +30% DMG vs Neg Charge target (AoE)',
        condition: 'Using Ordered Disruption (S2) and target has Negative Charge',
        effect: { dmgPct: 30 },
        notes: 'Additional +30% DMG on top of any other bonuses. Do not stack with Neg Charge toggle above if both apply.',
      },

      // ── Positive Charge buff (passive) ────────────────────────────────────
      {
        type: 'toggle',
        key: 'positive_charge',
        label: 'Passive — +25% Electric DMG (Positive Charge buff)',
        condition: 'Leva has the Positive Charge buff',
        effect: { dmgPct: 25 },
        notes: '+25% Electric DMG dealt. Only activate when Leva has Positive Charge.',
      },

    ],

    notes: 'Electric Sentinel. Core mechanics: Superconductive Code stacks (0–4), Voltage Tiles, Negative Charge conditional bonuses.',
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getDoll(id) {
  return DOLLS.find(d => d.id === id);
}

function getDollList() {
  return [...DOLLS].sort((a, b) => a.name.localeCompare(b.name));
}

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
