// ─────────────────────────────────────────────────────────────────────────────
// _template.js  —  Blank doll template
// Copy this file, rename it to <dollname>.js, and fill in the fields.
// Add a <script> tag for it in index.html after dolls.js.
// ─────────────────────────────────────────────────────────────────────────────

DOLLS.push({
  id:          'andoris',          // lowercase, no spaces (used as key)
  name:        'Andoris',         // display name
  class:       'Bulwark',          // Sentinel | Support | Bulwark | Vanguard
  ammoType:    'Medium',            // Light | Medium | Heavy | Shotgun | Melee
  phase:       'Electric',          // Physical | Electric | Corrosion | Burn | Hydro | Freeze
  baseCritDmg: 120,                // base crit DMG % 

  skills: [

    // ── Basic Attack ─────────────────────────────────────────────────────────
    {
      id:               'dollname_basic',
      name:             'Basic Attack Name',
      phase_dmg_type:   'physical',   // physical | electric | corrosion | thermal | hydro
      target_type:      'targeted',   // targeted | aoe
      skill_type:       'active',     // active | oot
      ammo_type:        'medium',     
      description:      '',
      multiplier:       0.80,         // number, or array of { label, value } for multi-hit/options
      vertebrae:        null,         // null = all levels; or array of numbers e.g. [0, 1, 2]
      cooldown:         null,
      stability_dmg:    3,
      confectance_cost: null,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Skill 1 Lv.1 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s1_lv1',
      name:             '(S1) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [0, 1, 2, 3],
      cooldown:         1,
      stability_dmg:    2,
      confectance_cost: null,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Skill 1 Lv.2 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s1_lv2',
      name:             '(S1) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [4, 5, 6],
      cooldown:         1,
      stability_dmg:    2,
      confectance_cost: null,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Skill 2 Lv.1 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s2_lv1',
      name:             '(S2) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [0, 1],
      cooldown:         2,
      stability_dmg:    1,
      confectance_cost: null,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Skill 2 Lv.2 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_s2_lv2',
      name:             '(S2) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [2, 3, 4, 5, 6],
      cooldown:         2,
      stability_dmg:    1,
      confectance_cost: null,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Ultimate Lv.1 ────────────────────────────────────────────────────────
    {
      id:               'dollname_ult_lv1',
      name:             '(Ult) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [0, 1, 2],
      cooldown:         null,
      stability_dmg:    2,
      confectance_cost: 6,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Ultimate Lv.2 ────────────────────────────────────────────────────────
    {
      id:               'dollname_ult_lv2',
      name:             '(Ult) Skill Name',
      phase_dmg_type:   'physical',
      target_type:      'aoe',
      skill_type:       'active',
      ammo_type:        null,
      description:      '',
      multiplier:       1.00,
      vertebrae:        [3, 4, 5, 6],
      cooldown:         null,
      stability_dmg:    2,
      confectance_cost: 6,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Passive Lv.1 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_passive_lv1',
      name:             'Passive Name',
      phase_dmg_type:   'physical',
      target_type:      'targeted',
      skill_type:       'oot',
      ammo_type:        null,
      description:      '',
      multiplier:       0.50,
      vertebrae:        [0, 1, 2],
      cooldown:         null,
      stability_dmg:    1,
      confectance_cost: null,
      canCrit:          true,
      scalingStat:      'ATK',
    },

    // ── Passive Lv.2 ─────────────────────────────────────────────────────────
    {
      id:               'dollname_passive_lv2',
      name:             'Passive Name',
      phase_dmg_type:   'physical',
      target_type:      'targeted',
      skill_type:       'oot',
      ammo_type:        null,
      description:      '',
      multiplier:       0.50,
      vertebrae:        [3, 4, 5, 6],
      cooldown:         null,
      stability_dmg:    1,
      confectance_cost: null,
      canCrit:          true,
      scalingStat:      'ATK',
    },

  ],

  // ── Doll Passives (in-calc toggles/selectors) ─────────────────────────────
  // These show up in the Doll Passives panel as checkboxes or stack selectors.
  // type: 'toggle'         — checkbox; effect is a plain object
  // type: 'stack_selector' — numbered buttons 0–max; effect is a function
  passives: [

    /**
    Example toggle:
    {
      type:      'toggle',
      key:       'dollname_some_buff',
      label:     'Buff Name — +X% ATK',
      condition: 'When condition is met',
      effect:    { atkPct: 10 },           
      vertebrae: [4, 5, 6],               
      notes:     'Optional clarification.',
    },

    Example stack selector:
    {
      type:   'stack_selector',
      key:    'dollname_stack_buff',
      label:  'Stack Buff Name',
      max:    5,
      effect: (stacks) => ({ dmgPct: stacks * 10 }),
      notes:  '+10% DMG per stack.',
    },
    */

  ],

  // ── Support Skills (shown in Team Skills panel when this doll is a teammate) ─
  // Same shape as passives. Leave empty [] if doll has no relevant team buffs.
  supportSkills: [

    {
      type:   'stack_selector',
      key:    'ando_s1_lv3',
      label:  '(S1) Gentle Offensive - Atk% Boost',
      max:    3,
      effect: (stacks) => ({ attPct: stacks * 10 }),
      vertebrae: [6],
      notes:  'For each Auto-Turret on the field, allied units gain 10% attack boost upon dealing Electric damage.',

    },

    {
      type:   'toggle',
      key:    'ando_s2_lv2',
      label:  '(S2) Streamlined Tactics - Elec Dmg Boost',
      effect: { elecDmgPct: 15 },
      vertebrae: [5, 6],
      notes:  'When taking Electric damage, the damage taken is increased by 15%.',

    },

    {
      type:   'toggle',
      key:    'ando_ult_sup_lv2',
      label:  '(Ult) Fortification Protocol - Dmg Boost II',
      effect: { dmgPct: 20 },
      vertebrae: [2, 3, 4, 5, 6],
      notes:  'When Andoris is on the field, she applies Movement Up II and Damage Up II to all allied Dolls with Positive Charge.',

    },

  ],

  flowerSlots: ['bulwark', 'bulwark', 'bulwark', 'bulwark', 'support', 'sentinel'],
  imagoform: [
    { tier: 'embryo',   requires: {               support: 1, bulwark: 5  }, effect: { dmgReduc: 5 },  description: 'When attacked by enemy units with Electric debuffs, damage taken is reduced by 5%.' },
    { tier: 'seedling', requires: { sentinel: 1,  support: 2, bulwark: 7  }, effect: { dmgReduc: 5 },  description: 'Physical and phase damage taken is reduced by 5%.' },
    { tier: 'sprout',   requires: { sentinel: 2,  support: 3, bulwark: 8  }, effect: { elecDmgPct: 5 }, description: 'Electric damage dealt is increased by 5%.' },
    { tier: 'shoot',    requires: { sentinel: 3,  support: 4, bulwark: 11 }, effect: { dmgReduc: 5 },  description: 'When not protected by cover, damage taken is reduced by 5%.' },
    { tier: 'bud',      requires: { sentinel: 4,  support: 4, bulwark: 15 }, effect: { defPct: 8 },    description: 'Defense is increased by 8%.' },
    { tier: 'blossom',  requires: { sentinel: 5,  support: 6, bulwark: 18 }, effect: { hpPct: 12 },    description: 'When stability is greater than 0, max HP is increased by 12%.' },
  ],

  notes: '',
});
