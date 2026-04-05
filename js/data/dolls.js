// ─────────────────────────────────────────────────────────────────────────────
// dolls.js  —  GFL2 Doll Database
//
// PASSIVES SCHEMA
// ────────────────
// Each doll has a `passives` array covering all passive effects — stacks,
// toggles, and always-on bonuses. These are distinct from skills, which have
// an active multiplier. Anything that modifies stats without being a direct
// attack goes here.
//
// Passive types:
//
//   { type: 'stack_selector',
//     key:    string,          — unique key for state tracking
//     label:  string,          — display name
//     max:    number,          — maximum stacks
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
// SKILL SCHEMA
// ─────────────
// Each skill entry has the following tag fields:
//
//   phase_dmg_type  — elemental/phase damage type: 'Electric', 'Corrosion',
//                     'Physical', 'Burn', 'Hydro', 'Freeze', or null
//   target_type     — attack shape: 'aoe', 'targeted', or null
//   skill_type      — when it activates: 'active', 'oot' (out-of-turn), or null
//   ammo_type       — ammo used: 'light', 'medium', 'heavy', 'melee',
//                     'shotgun', or null (no ammo — specials, ults, passives)
//   stability_dmg   — stability damage dealt (number, or null if passive/variable)
//   confectance_cost — confectance index cost to activate (number, or null)
//
// These tags control which conditional buffs apply in the calculator.
// stability_dmg and confectance_cost are cosmetic-only for now (shown on skill card).
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
  //   passives: [ ... ],
  //   mechanics: [],
  //   flowerSlots: [...],
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
        phase_dmg_type: 'physical',
        target_type:    'targeted',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects one enemy target within 7 tiles and deals Physical damage equal to 80% of attack to it.',
        multiplier: 0.80,
        vertebrae: null,
        cooldown: null,
        stability_dmg: 3,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // s1 v0-v3
      {
        id: '(S1) leva_s1_lv1',
        name: 'Rational Suppression',
        phase_dmg_type: 'electric',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects one direction, dealing AoE Electric damage equal to 120% of attack to all enemies in a 7×3 tile area. Applies Negative Charge to all enemies in the area for 2 turns and generates Voltage tiles for 3 turns.',
        multiplier: 1.20,
        vertebrae: ['v0', 'v1', 'v2', 'v3'],
        cooldown: 1,
        stability_dmg: 2,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // s1 v4-v6
      {
        id: '(S1) leva_s1_lv2',
        name: 'Rational Suppression',
        phase_dmg_type: 'electric',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Select one direction, dealing AoE Electric damage equal to 120% of attack to all enemy units in a 7×3 tile area of the selected direction, applies Negative Charge and Paralysis to all enemies in the selected area for 2 turns, and generates Voltage tiles for 3 turns. The critical damage for this skill is increased by 25%. ',
        multiplier: 1.20,
        vertebrae: ['v4', 'v5', 'v6'],
        cooldown: 1,
        stability_dmg: 2,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Add +25% to Crit DMG manually'
      },

      // s2 v0-v1
      {
        id: '(S2) leva_s2_lv1',
        name: 'Ordered Disruption',
        phase_dmg_type: 'electric',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      'light',
        description: 'Selects one tile within 7 tiles, dealing AoE Electric damage equal to 100% of attack to all enemies within 3 tiles. Against targets with Negative Charge, damage dealt is increased by 30% and stability damage dealt is increased by 1 point.',
        multiplier: 1.00,
        vertebrae: ['v0','v1'],
        cooldown: 1,
        stability_dmg: 1,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Add +30% to DMG Buffs manually if target has Negative Charge.',
      },

      // s2 v2-v6
      {
        id: '(S2) leva_s2_lv2',
        name: 'Ordered Disruption',
        phase_dmg_type: 'electric',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      'light',
        description: 'Selects one tile within a 7 tiles, dealing AoE Electric damage equal to 130% of attack to all enemy targets within 3 tiles of the selected tile. Against targets with Negative Charge, damage dealt is increased by 30%, and stability damage dealt is increased by 1 point. At the end of the action, Leva gains 1 stack of Superconductive Code.',
        multiplier: 1.30,
        vertebrae: ['v2','v3', 'v4', 'v5', 'v6'],
        cooldown: 1,
        stability_dmg: 1,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Add +30% to DMG Buffs manually if target has Negative Charge.',
      },

      // ult v0-v2
      {
        id: '(Ult) leva_ult_lv1',
        name: 'Quantum Calculation',
        phase_dmg_type: 'electric',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Deals AoE Electric damage equal to 60% of attack to all enemy targets within 7 tiles and generates Voltage tiles for 3 turns. Leva gains Overclocking Strike for 3 turns. After this attack, Leva can use the active skill Superconductive Strike once.',
        multiplier: 0.6,
        vertebrae: ['v0', 'v1', 'v2'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: 6,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // ult v3-v4
      {
        id: '(Ult) leva_ult_lv2',
        name: 'Quantum Calculation',
        phase_dmg_type: 'electric',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Deals AoE Electric damage equal to 60% of attack to all enemy targets within 7 tiles and generates Voltage tiles for 3 turns. Leva gains Overclocking Strike for 3 turns. After this attack, Leva can use the active skill Superconductive Strike once. \nDepending on the number of stacks of Superconductive Code expended, the damage multiplier of Superconductive Strike is increased to 75%/90%/120%/180%, and the stability damage dealt is increased to 1 point/2 points/4 points/8 points.\nWhen using Superconductive Strike, ignores 15% of the target\'s defense. After this skill, Leva gains 1 stack of Superconductive Code.',
        multiplier: 0.6,
        vertebrae: ['v3', 'v4'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: 6,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // ult v5-v6
      {
        id: '(Ult) leva_ult_lv3',
        name: 'Quantum Calculation',
        phase_dmg_type: 'electric',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Leva cleanses all debuffs on self and deals AoE Electric damage equal to 90% of attack to all enemy targets within 7 tiles and generates Voltage tiles for 3 turns. Leva gains Overclocking Strike for 3 turns. After this attack, Leva can use the active skill Superconductive Strike once.\nDepending on the number of stacks of Superconductive Code expended, the damage multiplier of Superconductive Strike is increased to 75%/90%/120%/180%, and the stability damage dealt is increased to 1 point/2 points/4 points/8 points.\nWhen using Superconductive Strike, ignores 15% of the target\'s defense. After this skill, Leva gains 1 stack of Superconductive Code.',
        multiplier: 0.9,
        vertebrae: ['v5', 'v6'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: 6,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // passive v0
      {
        id: 'leva_passive_lv1',
        name: 'Fox\'s Scheme',
        phase_dmg_type: 'electric',
        target_type:    'targeted',
        skill_type:     'oot',
        ammo_type:      'melee',
        description: 'At the start of the turn, when Leva triggers a Voltage tile reaction, she gains 1 stacks of Superconductive Code. If Leva has Positive Charge, Electric damage dealt is increased by 10%.\nWhen Negative Charge is applied to an enemy unit within her attack range , Leva performs one instance of Emergency Support, dealing melee Electric damage equal to 60% of attack and 1 point of stability damage, as well as gaining 1 point of Confectance Index. If this kills the target, she applies Negative Charge to the nearest enemy unit within range for 1 turn. This effect can be triggered up to 2 times per turn.',
        multiplier: 0.60,
        vertebrae: ['v0'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: null,
        canCrit: false,
        scalingStat: 'ATK',
      },

      // passive v1-v5
      {
        id: 'leva_passive_lv2',
        name: 'Fox\'s Scheme',
        phase_dmg_type: 'electric',
        target_type:    'targeted',
        skill_type:     'oot',
        ammo_type:      'melee',
        description: 'At the start of the turn, when Leva triggers a Voltage tile reaction, or when an enemy with Negative Charge dies within her attack range, she gains 1 stacks of Superconductive Code. If she has Positive Charge, Electric damage dealt is increased by 25%.\nWhen Negative Charge is applied to an enemy unit within her attack range , Leva performs one instance of Emergency Support, dealing melee Electric damage equal to 60% of attack and 1 point of stability damage, as well as gaining 1 point of Confectance Index. If this kills the target, she applies Negative Charge to the nearest enemy unit within range for 1 turn. This effect can be triggered up to 3 times per turn.',
        multiplier: 0.60,
        vertebrae: ['v1', 'v2', 'v3', 'v4', 'v5'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: null,
        canCrit: false,
        scalingStat: 'ATK',
      },

      // passive v6
      {
        id: 'leva_passive_lv3',
        name: 'Fox\'s Scheme',
        phase_dmg_type: 'electric',
        target_type:    'targeted',
        skill_type:     'oot',
        ammo_type:      'melee',
        description: 'At the start of the turn, Leva gains 2 stacks of Superconductive Code. In addition, when Leva triggers a Voltage tile reaction, or when an enemy with Negative Charge dies within her attack range, Leva gains 1 stacks of Superconductive Code. If Leva has Positive Charge, Electric damage dealt is increased by 25%.\nLeva\'s attack is increased by 15% the first time she reaches 4 stacks of Superconductive Code in battle.\nWhen Negative Charge is applied to an enemy target within range , Leva performs one instance of Emergency Support, dealing melee Electric damage equal to 60% of attack and 1 point of stability damage, as well as gaining 1 point of Confectance Index. If this kills the target, she applies Negative Charge to the nearest enemy unit within range for 1 turn. This effect can be triggered up to 3 times per turn. She can also use the active skill Superconductive Strike after using the active skill Rational Suppression or Ordered Disruption. ',
        multiplier: 0.60,
        vertebrae: ['v6'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: null,
        canCrit: false,
        scalingStat: 'ATK',
      },

      // superconductive strike lv1
      {
        id: 'leva_sa_lv1',
        name: 'Superconductive Strike',
        phase_dmg_type: 'electric',
        target_type:    'targeted',
        skill_type:     'active',
        ammo_type:      'melee',
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
        stability_dmg: 1,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Stability damage: 1 / 2 / 3 / 6 points for 1–4 stacks respectively.',
      },

      // superconductive strike lv2
      {
        id: 'leva_sa_lv2',
        name: 'Superconductive Strike',
        phase_dmg_type: 'electric',
        target_type:    'targeted',
        skill_type:     'active',
        ammo_type:      'melee',
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
        stability_dmg: 1,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
        notes: 'Stability damage: 1 / 2 / 4 / 8 points for 1–4 stacks respectively.',
      },

      // overclocking strike lv1
      {
        id: 'leva_sb_lv1',
        name: 'Overclocking Strike',
        phase_dmg_type: 'electric',
        target_type:    'targeted',
        skill_type:     'oot',
        ammo_type:      null,
        description: 'When the target\'s stability is at 0, excess stability damage is converted into Electric damage, dealing additional Electric damage to the target equal to (overflow stability damage amount) x 5% of attack (This will not trigger Negative Charge). Considered a buff, cannot be cleansed.',
        multiplier: null,
        scalingType: 'stability_overflow',
        overflowRate: 5,  // effective mult = overflow_stab × 5% (user inputs overflow)
        vertebrae: ['v0', 'v1', 'v2', 'v3', 'v4'],
        cooldown: null,
        stability_dmg: null,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      // overclocking strike lv2
      {
        id: 'leva_sb_lv2',
        name: 'Overclocking Strike',
        phase_dmg_type: 'electric',
        target_type:    'targeted',
        skill_type:     'oot',
        ammo_type:      null,
        description: 'When the target\'s stability is at 0, excess stability damage is converted into Electric damage, dealing additional Electric damage to the target equal to (overflow stability damage amount) x 8% of attack (This will not trigger Negative Charge). Considered a buff, cannot be cleansed.',
        multiplier: null,
        scalingType: 'stability_overflow',
        overflowRate: 8,  // effective mult = overflow_stab × 8% (user inputs overflow)
        vertebrae: ['v5', 'v6'],
        cooldown: null,
        stability_dmg: null,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },
    ],

    // ── Leva passives ─────────────────────────────────────────────────────
    passives: [

      // ── Superconductive Code ─────────────────────────────────────────────
      {
        type: 'stack_selector',
        key: 'sc_stacks',
        label: 'Superconductive Code Stacks',
        max: 4,
        effect: (stacks) => ({
          critRate: stacks * 5,
          critDmg:  stacks * 7,
        }),
        notes: '+5% Crit Rate and +7% Crit DMG per stack.',
      },

      // ── SC Code: first time reaching 4 stacks — once per battle passive ──
      {
        type: 'toggle',
        key: 'sc_passive_atk',
        label: 'SC Code — +15% ATK (first 4-stack, passive)',
        condition: 'First time reaching 4 Superconductive Code stacks this battle',
        effect: { atkPct: 15 },
        notes: 'Once per battle. Stays active after triggering — turn off between battles.',
      },

      // ── Superconductive Chain: +10% ATK when 4 stacks consumed ───────────
      {
        type: 'toggle',
        key: 'sc_chain_atk',
        label: 'SC Code — +10% ATK (Superconductive Chain)',
        condition: '4 stacks consumed for Superconductive Strike',
        effect: { atkPct: 10 },
        notes: '+10% ATK from the Superconductive Chain bonus at max stacks.',
      },

      // ── S1 Crit DMG bonus (per-attack) ───────────────────────────────────
      {
        type: 'toggle',
        key: 's1_crit_bonus',
        label: 'S1 — +25% Crit DMG (this attack)',
        condition: 'Using Rational Suppression (S1)',
        effect: { critDmg: 25 },
        vertebrae: ['v4', 'v5', 'v6'],
        notes: 'Only applies to the S1 attack at V4+. Toggle on when calculating S1 damage.',
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
      // Voltage Tile reactions deal fixed damage = ATK × %, bypassing DEF.
      // Select the appropriate % based on attack type, then optionally ×2 for large/boss.
      {
        type: 'toggle',
        key: 'voltage_tile_dmg',
        label: 'Voltage Tiles — 30% ATK fixed (non-elec AoE)',
        condition: 'AoE attack on/near Voltage Tiles, non-electric',
        effect: { fixedAtkPct: 30 },
        notes: 'Fixed damage = 30% of Final ATK, added after main calc, ignores DEF. Use 60% toggle instead for electric/hydro.',
      },

      {
        type: 'toggle',
        key: 'voltage_tile_elec',
        label: 'Voltage Tiles — 60% ATK fixed (Electric/Hydro AoE)',
        condition: 'AoE attack is Electric or Hydro type',
        effect: { fixedAtkPct: 60 },
        notes: 'Fixed damage = 60% of Final ATK, added after main calc, ignores DEF. Replaces +30% — do not enable both.',
      },

      {
        type: 'toggle',
        key: 'voltage_tile_boss',
        label: 'Voltage Tiles — ×2 fixed DMG (Large/Boss target)',
        condition: 'Target is a large enemy or boss',
        effect: { fixedAtkMultiplier: 2 },
        notes: 'Doubles the Voltage Tile fixed damage. Stack with the 30% or 60% toggle above.',
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

    flowerSlots: ['sentinel', 'sentinel', 'sentinel', 'sentinel', 'vanguard', 'vanguard'],
    notes: 'Electric Sentinel. Core mechanics: Superconductive Code stacks (0–4), Voltage Tiles, Negative Charge conditional bonuses.',
  },

  {
    id: 'klukai',
    name: 'Klukai',
    class: 'Sentinel',
    ammoType: 'Medium',
    phase: 'Corrosion',
    baseCritDmg: 150,   // update with actual base value when confirmed

    skills: [

      {
        id: 'klukai_basic',
        name: 'Swift Strike',
        phase_dmg_type: 'physical',
        target_type:    'targeted',
        skill_type:     'active',
        ammo_type:      'medium',
        description: 'Selects one enemy target within 8 tiles and deals Physical damage equal to 80% of attack to it.',
        multiplier: 0.80,
        vertebrae: null,
        cooldown: null,
        stability_dmg: 3,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_s1_lv1',
        name: '(S2) Pinpoint Detonation',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      'medium',
        description: 'Selects 1 enemy target within 8 tiles, dealing AoE Corrosion damage equal to 80% of attack. Performs an additional attack, dealing AoE Corrosion damage equal to 60% of attack to the target and all enemy targets within 3 tiles, pulling all affected enemy targets 1 tile towards the center.\nIf any enemy targets are killed, reduces the cooldown of the Ultimate skill Devastating Drift by 1 turn and gains 2 points of Confectance Index. If no enemy targets are killed, applies 1 stack of Corrosive Infusion to the target for 2 turns.',
        multiplier: [
          { label: 'Hit 1', value: 0.80 },
          { label: 'Hit 2', value: 0.60 },
        ],
        multiHit: true,
        vertebrae: ['v0', 'v1', 'v2', 'v3'],
        cooldown: null,
        stability_dmg: 3,
        confectance_cost: 3,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_s1_lv2',
        name: '(S1) Pinpoint Detonation',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects 1 enemy target within 8 tiles, dealing AoE Corrosion damage equal to 100% of attack. Performs an additional attack, dealing AoE Corrosion damage equal to 60% of attack to the target and all enemy targets within 3 tiles. For each stack of Corrosive Infusion the target has, the damage multiplier is increased by 5%, and all affected enemy targets are pulled 1 tile towards the center. If a phase weakness is exploited, the attack ignores 15% of Cover damage reduction.\nIf any enemy targets are killed, reduces the cooldown of the Ultimate skill Devastating Drift by 1 turn and gains 2 points of Confectance Index. If no enemy targets are killed, applies 1 stack of Corrosive Infusion to the target for 2 turns.',
        multiplier: [
          { label: 'Hit 1', value: 1.00 },
          { label: 'Hit 2', value: 0.60 },
        ],
        multiHit: true,
        vertebrae: ['v4', 'v5', 'v6'],
        cooldown: null,
        stability_dmg: 3,
        confectance_cost: 3,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_s2_lv1',
        name: '(S2) Overpowering Corrosion',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects 1 tile within 8 tiles, dealing AoE Corrosion damage equal to 90% of attack to all enemy targets within 3 tiles, and applies Toxic Infiltration for 2 turns. Increases damage by 15% to targets already affected by Toxic Infiltration.',
        multiplier: 0.90,
        vertebrae: ['v0'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: 3,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_s2_lv2',
        name: '(S2) Overpowering Corrosion',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects 1 tile within 8 tiles, dealing AoE Corrosion damage equal to 90% of attack to all enemy targets within 3 tiles, and applies Toxic Infiltration for 2 turns. If the target survives, triggers the on-death effect of Toxic Infiltration. Increases damage dealt by 30% to targets already affected by Toxic Infiltration.',
        multiplier: 0.90,
        vertebrae: ['v1', 'v2', 'v3', 'v4'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: 3,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_s2_lv3',
        name: '(S2) Overpowering Corrosion',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects 1 tile within 8 tiles, dealing AoE Corrosion damage equal to 110% of attack to all enemy targets within 5 tiles, and applies Toxic Infiltration for 2 turns. If the target survives, triggers the on-death effect of Toxic Infiltration. If the target is inflicted with a Corrosion debuff, applies Toxic Infiltration for 2 turns before the attack. Increases damage by 30% to targets already affected by Toxic Infiltration.',
        multiplier: 1.10,
        vertebrae: ['v5', 'v6'],
        cooldown: null,
        stability_dmg: 1,
        confectance_cost: 3,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_ult_lv1',
        name: '(Ult) Devastating Drift',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects 1 tile within a cross-shaped area of 4 to 8 tiles, landing on the selected tile and dealing AoE Corrosion damage equal to 100% of attack to all enemy targets in a path 5 tiles wide. Gains 6 tiles of Additional Movement. If 2 or more targets are killed, this skill can be used again, up to a maximum of 1 additional time.',
        multiplier: 1.00,
        vertebrae: ['v0', 'v1', 'v2'],
        cooldown: 6,
        stability_dmg: 2,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_ult_lv2',
        name: '(Ult) Devastating Drift',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects 1 tile within a cross-shaped area of 4 to 8 tiles, landing on the selected tile, applying Defense Down II and Toxic Infiltration for 2 turns, and dealing AoE Corrosion damage equal to 100% of attack to all enemy targets in a path 5 tiles wide. Gains 6 tiles of Additional Movement. For each enemy hit, increases damage dealt by an additional 10%, up to a maximum of 50%. If a Boss is hit, this increase will be immediately raised to the maximum value of 50%.\nIf 2 or more targets or a Boss is hit, this skill can be used again, up to a maximum of 1 additional time.',
        multiplier: 1.00,
        vertebrae: ['v3', 'v4', 'v5'],
        cooldown: 6,
        stability_dmg: 2,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_ult_lv3',
        name: '(Ult) Devastating Drift',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'active',
        ammo_type:      null,
        description: 'Selects 1 tile within a cross-shaped area of 4 to 8 tiles, landing on the selected tile, applying Defense Down II and Toxic Infiltration for 2 turns, dealing AoE Corrosion damage that ignores Cover damage reduction equal to 100% of attack to all enemy targets in a path 7 tiles wide. Applies Dismay for 2 turns, and gains 6 tiles of Additional Movement. For each enemy hit, increases damage dealt by an additional 10%, up to a maximum of 50%. If a Boss is hit, this increase will be immediately raised to the maximum value of 50%.\nIf 2 or more targets or a Boss is hit, this skill can be used again, up to a maximum of 1 additional time.\nAfter the skill is used, triggers all enemies\' effects of Corrosive Infusion and the on-death effects of Toxic Infiltration.',
        multiplier: 1.00,
        vertebrae: ['v6'],
        cooldown: 6,
        stability_dmg: 2,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_passive_lv1',
        name: 'Elite\'s Pride',
        phase_dmg_type: null,
        target_type:    null,
        skill_type:     null,
        ammo_type:      null,
        description: 'Immune to all negative Crowd Control tile effects. When dealing damage with active attacks, applies 1 stack of Corrosive Infusion to the target for 2 turns, and gains 1 stack of Competitive Spirit after skill usage.\nEach time Klukai performs an active attack or other allied units deal Corrosion damage, Klukai gains 1 point of Confectance Index. For every 3 points of Confectance Index gained, reduces the cooldown of her Ultimate skill by 1 turn.',
        multiplier: null,
        vertebrae: ['v0', 'v1'],
        cooldown: null,
        stability_dmg: null,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_passive_lv2',
        name: 'Elite\'s Pride',
        phase_dmg_type: null,
        target_type:    null,
        skill_type:     null,
        ammo_type:      null,
        description: 'Immune to all negative Crowd Control tile effects.\nAt the start of the battle, gains 3 stacks of Competitive Spirit. When dealing damage with active attacks, applies 1 stack of Corrosive Infusion to the target for 2 turns.\nEach time Klukai performs an active attack or other allied units deal Corrosion damage, Klukai gains 1 stack of Competitive Spirit after skill usage and gains 1 point of Confectance Index.\nFor every 3 points of Confectance Index gained, applies an additional 1 stack of Corrosive Infusion to enemy units with Corrosive Infusion, and reduces the cooldown of her Ultimate skill by 2 turns.',
        multiplier: null,
        vertebrae: ['v2', 'v3', 'v4', 'v5'],
        cooldown: null,
        stability_dmg: null,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_sa_lv1',
        name: 'Corrosive Infusion',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'oot',
        ammo_type:      null,
        description: 'At the end of the action, the applier deals AoE Corrosion damage equal to 12% of attack. For each additional stack, the damage multiplier is increased by 12%. Upon being hit by active attacks from Klukai or Corrosion damage from other enemies, gain 1 additional stack and refresh the debuff duration, maximum of 10 stacks. Removed after the applier is killed. Considered a Corrosion debuff, cannot be cleansed.',
        multiplier: null,
        scalingType: 'stack_bonus',
        stackLabel: 'Corrosive Infusion Stacks',
        stackRate: 12,   // effective mult = stacks × 12%
        stackMax: 10,
        vertebrae: ['v0', 'v1'],
        cooldown: null,
        stability_dmg: null,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },

      {
        id: 'klukai_sa_lv2',
        name: 'Corrosive Infusion',
        phase_dmg_type: 'corrosion',
        target_type:    'aoe',
        skill_type:     'oot',
        ammo_type:      null,
        description: 'Reduce defense by 1%. At the end of the action, the applier deals AoE Corrosion damage equal to 12% of attack. For each additional stack, the damage multiplier is increased by 12%. Upon being hit by active attacks from Klukai or Corrosion damage from other enemies, gain 2 additional stacks and refresh the debuff duration, maximum of 15 stacks. Removed after the applier is killed. Considered a Corrosion debuff, cannot be cleansed.',
        multiplier: null,
        scalingType: 'stack_bonus',
        stackLabel: 'Corrosive Infusion Stacks',
        stackRate: 12,   // effective mult = stacks × 12%
        stackMax: 15,
        vertebrae: ['v2', 'v3', 'v4', 'v5', 'v6'],
        cooldown: null,
        stability_dmg: null,
        confectance_cost: null,
        canCrit: true,
        scalingStat: 'ATK',
      },
    ],

    // ── Klukai passives ───────────────────────────────────────────────────
    passives: [

      {
        type: 'stack_selector',
        key: 'competitive_spirit_lv1',
        label: 'Competitive Spirit',
        max: 8,
        effect: (stacks) => ({
          corroDmgPct: stacks * 5,
        }),
        vertebrae: ['v0', 'v1'],
        notes: '+5% Corrosion DMG per stack.',
      },

      {
        type: 'stack_selector',
        key: 'competitive_spirit_lv2',
        label: 'Competitive Spirit',
        max: 12,
        effect: (stacks) => ({
          corroDmgPct: stacks * 5,
        }),
        vertebrae: ['v2', 'v3', 'v4', 'v5', 'v6'],
        notes: '+5% Corrosion DMG per stack.',
      },

      {
        type: 'stack_selector',
        key: 'corrosive_infusion_lv1',
        label: 'Corrosive Infusion',
        max: 10,
        effect: (stacks) => ({
          defReducPct: stacks * 1,
        }),
        vertebrae: ['v0', 'v1'],
        notes: '-1% DEF per stack.',
      },

      {
        type: 'stack_selector',
        key: 'corrosive_infusion_lv2',
        label: 'Corrosive Infusion',
        max: 15,
        effect: (stacks) => ({
          defReducPct: stacks * 1,
        }),
        vertebrae: ['v2', 'v3', 'v4', 'v5', 'v6'],
        notes: '-1% DEF per stack.',
      },

    ],
    flowerSlots: ['sentinel', 'sentinel', 'sentinel', 'sentinel', 'vanguard', 'bulwark'],

    // Thresholds from screenshot (Imago Factor totals required per type)
    imagoform: [
      { tier: 'embryo',   requires: {                 vanguard: 1, sentinel: 5  }, effect: {dmgPct: 5},        description: 'Damage dealt to enemy units with Corrosion debuffs is increased by 5%.' },
      { tier: 'seedling', requires: { bulwark: 1,     vanguard: 2, sentinel: 7  }, effect: {dmgReduc: 5},      description: 'Physical and phase damage taken is reduced by 5%.' },
      { tier: 'sprout',   requires: { bulwark: 2,     vanguard: 3, sentinel: 8  }, effect: {corroDmgPct: 5},   description: 'Corrosion damage dealt is increased by 5%.' },
      { tier: 'shoot',    requires: { bulwark: 3,     vanguard: 4, sentinel: 11 }, effect: {dmgPct: 10},       description: 'Damage dealt to enemy targets in Stability Break is increased by 10%.' },
      { tier: 'bud',      requires: { bulwark: 4,     vanguard: 4, sentinel: 15 }, effect: {atkPct: 8},        description: 'Attack is increased by 8%.' },
      { tier: 'blossom',  requires: { bulwark: 5,     vanguard: 6, sentinel: 18 }, effect: {dmgPct: 12},       description: 'The damage of attacks which hit 2 or more enemy units is increased by 12%.' },
    ],

    notes: '',
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
